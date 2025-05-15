use anchor_lang::prelude::*;
use anchor_lang::system_program::System;
use anchor_spl::token::Token;

declare_id!("77xmLbf5RiK9fWUbBoqA1pZWpDxarB3PWwm9i6hLFAqo");

#[program]
pub mod exchange {
    use super::*;

    pub fn init_pool(
        ctx: Context<InitPool>,
        deposit_token: u64,
        deposit_loyl: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.balance_token = deposit_token;
        pool.balance_loyl = deposit_loyl;
        Ok(())
    }

    pub fn swap(
        _ctx: Context<Swap>,
        _amount_in: u64,
        _min_amount_out: u64,
    ) -> Result<()> {
        // TODO: for swap logic
        Ok(())
    }
}

#[account]
pub struct Pool {
    pub balance_token: u64,
    pub balance_loyl: u64,
}

#[derive(Accounts)]
pub struct InitPool<'info> {
    #[account(
        init,
        payer = platform_authority,
        space = 8 + 8 + 8,            // discriminator + two u64
        seeds = [b"pool", loyalty_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    /// CHECK: we do not read data
    pub loyalty_mint: AccountInfo<'info>,

    #[account(mut, signer)]
    /// CHECK: this is our business account signer, which is verified by signature
    pub business_authority: AccountInfo<'info>,
    
    #[account(mut, signer)]
    /// CHECK: this is a treasury signer account, managed locally
    pub platform_authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    // another accs 
}
