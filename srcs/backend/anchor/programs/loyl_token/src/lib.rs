use anchor_lang::prelude::*;
use anchor_lang::system_program::System;
use anchor_spl::{
    associated_token::{self, AssociatedToken},
    token::{Mint, TokenAccount},
    token_2022::{
        self,
        InitializeMint2, MintTo, TransferChecked,
        Token2022,
    },
};

declare_id!("DEwDyoE1cQSEDwEACRygT2Un5sRkSUaF8kXgRXzzyP6x");

#[program]
pub mod loyalty_token {
    use super::*;

    /// Creates an SPL-2022 mint whose authority is a PDA derived
    /// from the business signer, mints `initial_supply` to the business ATA
    /// and stores on-chain metadata (rate to LOYL etc.).
    pub fn create_loyalty_mint(
        ctx:            Context<CreateMint>,
        decimals:       u8,
        rate_loyl:      u64,
        initial_supply: u64,
    ) -> Result<()> {
        /* -------------------------------------------------------
         *  1. Derive PDA seeds once
         * -----------------------------------------------------*/
        let bump   = ctx.bumps.mint_authority;
        let seeds: &[&[&[u8]]] = &[&[
            b"mint",
            ctx.accounts.business_authority.key.as_ref(),
            &[bump],
        ]];

        /* -------------------------------------------------------
         *  2. Initialise the mint (SPL-Token-2022)
         *    In 0.29 struct InitializeMint2 { mint }
         * -----------------------------------------------------*/
        let init_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            InitializeMint2 {
                mint: ctx.accounts.mint.to_account_info(),
            },
        )
        .with_signer(seeds);

        token_2022::initialize_mint2(
            init_ctx,
            decimals,
            ctx.accounts.mint_authority.key,
            Some(ctx.accounts.mint_authority.key),
        )?;

        /* -------------------------------------------------------
         *  3. Create (if absent) business ATA
         * -----------------------------------------------------*/
        let ata_ctx = CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            associated_token::Create {
                payer:               ctx.accounts.business_authority.to_account_info(),
                associated_token:    ctx.accounts.business_ata.to_account_info(),
                authority:           ctx.accounts.business_authority.to_account_info(),
                mint:                ctx.accounts.mint.to_account_info(),
                system_program:      ctx.accounts.system_program.to_account_info(),
                token_program:       ctx.accounts.token_program.to_account_info(),
            },
        );
        associated_token::create(ata_ctx)?;

        /* -------------------------------------------------------
         *  4. Mint initial supply → business ATA
         * -----------------------------------------------------*/
        let mint_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint:      ctx.accounts.mint.to_account_info(),
                to:        ctx.accounts.business_ata.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        )
        .with_signer(seeds);
        token_2022::mint_to(mint_ctx, initial_supply)?;

        /* -------------------------------------------------------
         *  5. Persist meta
         * -----------------------------------------------------*/
        let meta = &mut ctx.accounts.loyalty_meta;
        meta.mint      = ctx.accounts.mint.key();
        meta.business  = ctx.accounts.business_authority.key();
        meta.decimals  = decimals;
        meta.rate_loyl = rate_loyl;
        meta.bump      = bump;

        emit!(MintCreated {
            mint:     meta.mint,
            business: meta.business,
            supply:   initial_supply,
        });
        Ok(())
    }

    /* ───────────────────── Earn (business → user) ───────────────────── */
    pub fn earn_points(ctx: Context<TransferBusiness>, amount: u64) -> Result<()> {
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from:      ctx.accounts.business_ata.to_account_info(),
                to:        ctx.accounts.user_ata.to_account_info(),
                authority: ctx.accounts.business_authority.to_account_info(),
                mint:      ctx.accounts.mint.to_account_info(),
            },
        );
        token_2022::transfer_checked(cpi, amount, ctx.accounts.mint.decimals)?;
        Ok(())
    }

    /* ───────────────────── Redeem (user → business) ─────────────────── */
    pub fn redeem_points(ctx: Context<TransferUser>, amount: u64) -> Result<()> {
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from:      ctx.accounts.user_ata.to_account_info(),
                to:        ctx.accounts.business_ata.to_account_info(),
                authority: ctx.accounts.user_authority.to_account_info(),
                mint:      ctx.accounts.mint.to_account_info(),
            },
        );
        token_2022::transfer_checked(cpi, amount, ctx.accounts.mint.decimals)?;
        Ok(())
    }
}

/* ─────────────────────────────── Accounts ───────────────────────────── */

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct CreateMint<'info> {
    /// PDA that will own & freeze the mint
    #[account(
        seeds = [b"mint", business_authority.key().as_ref()],
        bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    /// Metadata (rate, decimals, bump)
    #[account(
        init,
        payer  = business_authority,
        seeds  = [b"meta", mint.key().as_ref()],
        bump,
        space  = 8 + LoyaltyMeta::SIZE,
    )]
    pub loyalty_meta: Account<'info, LoyaltyMeta>,

    /// SPL-2022 Mint itself
    #[account(
        init,
        payer               = business_authority,
        mint::decimals      = decimals,
        mint::authority     = mint_authority,
        mint::freeze_authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,

    /// Business’s associated token account for this mint
    #[account(
        init_if_needed,
        payer                      = business_authority,
        associated_token::mint     = mint,
        associated_token::authority= business_authority,
    )]
    pub business_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub business_authority: Signer<'info>,

    pub token_program:            Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program:           Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferBusiness<'info> {
    #[account(mut, signer)]
    pub business_authority: Signer<'info>,
    #[account(mut)]
    pub business_ata:       Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_ata:           Account<'info, TokenAccount>,
    pub mint:               Account<'info, Mint>,
    pub token_program:      Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct TransferUser<'info> {
    #[account(mut, signer)]
    pub user_authority:     Signer<'info>,
    #[account(mut)]
    pub user_ata:           Account<'info, TokenAccount>,

    #[account(mut)]
    pub business_ata:       Account<'info, TokenAccount>,
    pub mint:               Account<'info, Mint>,
    pub token_program:      Program<'info, Token2022>,
}

/* ────────────────────────────  Meta State  ─────────────────────────── */

#[account]
pub struct LoyaltyMeta {
    pub mint:      Pubkey,
    pub business:  Pubkey,
    pub decimals:  u8,
    pub rate_loyl: u64,
    pub bump:      u8,
}
impl LoyaltyMeta {
    pub const SIZE: usize = 32 + 32 + 1 + 8 + 1;
}

#[event]
pub struct MintCreated {
    pub mint:     Pubkey,
    pub business: Pubkey,
    pub supply:   u64,
}
