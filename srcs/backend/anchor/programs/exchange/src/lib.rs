use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Transfer, Token};

// Program ID for the exchange contract
declare_id!("uMhywp8T3MGLrXPgaTnX7HQjNCT6Cv9tp9pfZ2S7WBp");

#[program]
pub mod exchange {
    use super::*;

    /// Update the fixed exchange rate for an existing pool
    pub fn update_rate(
        ctx: Context<UpdateRate>,
        new_rate: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        // only business owner can update rate
        require_keys_eq!(ctx.accounts.authority.key(), pool.authority, ErrorCode::Unauthorized);
        pool.rate = new_rate;
        Ok(())
    }

    /// Swap branded token A for branded token B using existing pools
    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        min_amount_out: u64,
    ) -> Result<()> {
        let pool_from = &ctx.accounts.pool_from;
        let pool_to = &ctx.accounts.pool_to;

        // calculate LOYL amount: amount_in * rate_from
        let amount_loyl = amount_in
            .checked_mul(pool_from.rate)
            .ok_or(ErrorCode::CalculationOverflow)?;

        // calculate output amount: amount_loyl / rate_to
        let amount_out = amount_loyl
            .checked_div(pool_to.rate)
            .ok_or(ErrorCode::CalculationOverflow)?;

        // ensure we meet the minimum output requirement
        require!(amount_out >= min_amount_out, ErrorCode::InsufficientOutputAmount);

        // transfer branded token A from user to pool vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_from.to_account_info(),
                    to: ctx.accounts.vault_from.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount_in,
        )?;

        // transfer branded token B from pool vault to user
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_to.to_account_info(),
                    to: ctx.accounts.user_to.to_account_info(),
                    authority: ctx.accounts.pool_to.to_account_info(),
                },
                &[&[b"pool", pool_to.mint.as_ref(), &[pool_to.bump]]],
            ),
            amount_out,
        )?;

        // emit event for off-chain indexing
        emit!(SwapEvent {
            user: ctx.accounts.authority.key(),
            mint_from: pool_from.mint,
            mint_to: pool_to.mint,
            amount_in,
            amount_out,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

/// PDA-stored state for each branded token pool
#[account]
pub struct Pool {
    pub mint: Pubkey,      // branded token mint
    pub authority: Pubkey, // business owner
    pub rate: u64,         // price in LOYL (fixed-point 1e0)
    pub bump: u8,          // PDA bump
}

/// Accounts for updating pool rate
#[derive(Accounts)]
pub struct UpdateRate<'info> {
    /// Pool account to update
    #[account(mut)]
    pub pool: Account<'info, Pool>,

    /// Business owner authority
    pub authority: Signer<'info>,
}

/// Accounts for swapping between two pools
#[derive(Accounts)]
pub struct Swap<'info> {
    /// User performing the swap
    pub authority: Signer<'info>,

    /// Source pool account
    #[account(mut)]
    pub pool_from: Account<'info, Pool>,
    /// Destination pool account
    #[account(mut)]
    pub pool_to: Account<'info, Pool>,

    /// Token vault of source pool
    #[account(mut)]
    pub vault_from: Account<'info, TokenAccount>,
    /// Token vault of destination pool
    #[account(mut)]
    pub vault_to: Account<'info, TokenAccount>,

    /// User's token account for source token
    #[account(mut)]
    pub user_from: Account<'info, TokenAccount>,
    /// User's token account for destination token
    #[account(mut)]
    pub user_to: Account<'info, TokenAccount>,

    /// SPL token program
    pub token_program: Program<'info, Token>,
}

/// Event emitted after a swap
#[event]
pub struct SwapEvent {
    pub user: Pubkey,
    pub mint_from: Pubkey,
    pub mint_to: Pubkey,
    pub amount_in: u64,
    pub amount_out: u64,
    pub timestamp: i64,
}

/// Custom error codes for the exchange
#[error_code]
pub enum ErrorCode {
    #[msg("Calculation overflow occurred")]
    CalculationOverflow,
    #[msg("Insufficient output amount")]
    InsufficientOutputAmount,
    #[msg("Unauthorized operation")]
    Unauthorized,
}
