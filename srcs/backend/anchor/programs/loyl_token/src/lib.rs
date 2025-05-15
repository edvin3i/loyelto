use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, TokenAccount},
    associated_token::{self, AssociatedToken},
    token_2022::{
        ID as Token2022Program,
        cpi::accounts::{InitializeMint2, MintTo, TransferChecked},
        cpi::program::Token2022,
    },
};

declare_id!("LoyL111111111111111111111111111111111111111");

#[program]
pub mod loyalty_token {
    use super::*;

    /// Создаёт SPL-2022 mint с PDA-авторитетом, ментит `initial_supply` на ATA бизнеса
    pub fn create_loyalty_mint(
        ctx: Context<CreateMint>,
        decimals: u8,
        rate_loyl: u64,
        initial_supply: u64,
    ) -> Result<()> {
        // 1) InitializeMint2 (SPL-2022)
        let signer_seeds = &[
            b"mint".as_ref(),
            ctx.accounts.business_authority.key.as_ref(),
            &[ *ctx.bumps.get("mint_authority").unwrap() ],
        ];
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            InitializeMint2 {
                mint: ctx.accounts.mint.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );
        token_2022::cpi::initialize_mint2(cpi_ctx.with_signer(&[signer_seeds]), decimals, ctx.accounts.mint_authority.key, Some(ctx.accounts.mint_authority.key))?;

        // 2) Создаём (или берём существующий) associated token account бизнеса
        let cpi_ctx2 = CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            associated_token::Create {
                payer: ctx.accounts.business_authority.to_account_info(),
                associated_token: ctx.accounts.business_ata.to_account_info(),
                authority: ctx.accounts.business_authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            },
        );
        associated_token::create(cpi_ctx2)?;

        // 3) Mint initial_supply → бизнес ATA
        let cpi_ctx3 = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.business_ata.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        );
        token_2022::cpi::mint_to(cpi_ctx3.with_signer(&[signer_seeds]), initial_supply)?;

        // 4) Сохраняем метаданные
        let meta = &mut ctx.accounts.loyalty_meta;
        meta.mint = ctx.accounts.mint.key();
        meta.business = ctx.accounts.business_authority.key();
        meta.decimals = decimals;
        meta.rate_loyl = rate_loyl;
        meta.bump = *ctx.bumps.get("mint_authority").unwrap();

        Ok(())
    }

    /// Business → User (earn points)
    pub fn earn_points(ctx: Context<TransferBusiness>, amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.business_ata.to_account_info(),
                to:   ctx.accounts.user_ata.to_account_info(),
                authority: ctx.accounts.business_authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
        );
        // проверяем decimals, fee (0)
        token_2022::cpi::transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;
        Ok(())
    }

    /// User → Business (redeem points)
    pub fn redeem_points(ctx: Context<TransferUser>, amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.user_ata.to_account_info(),
                to:   ctx.accounts.business_ata.to_account_info(),
                authority: ctx.accounts.user_authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
        );
        token_2022::cpi::transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct CreateMint<'info> {
    /// PDA, выступает в роли mint & freeze authority
    #[account(
        seeds = [b"mint", business_authority.key().as_ref()],
        bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    /// Хранилище метаданных
    #[account(
        init,
        payer = business_authority,
        seeds = [b"meta", mint.key().as_ref()],
        bump,
        space = 8 + 32 + 32 + 1 + 8 + 1, // discriminator + поля LoyaltyMeta
    )]
    pub loyalty_meta: Account<'info, LoyaltyMeta>,

    /// SPL-2022 mint
    #[account(
        init,
        payer = business_authority,
        mint::decimals = decimals,
        mint::authority = mint_authority,
        mint::freeze_authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,

    /// Business ATA для mint
    #[account(
        init_if_needed,
        payer = business_authority,
        associated_token::mint = mint,
        associated_token::authority = business_authority,
    )]
    pub business_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub business_authority: Signer<'info>,

    pub token_program: Program<'info, Token2022Program>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TransferBusiness<'info> {
    #[account(mut)]
    pub business_authority: Signer<'info>,

    #[account(mut)]
    pub business_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_ata: Account<'info, TokenAccount>,

    /// Чтобы иметь доступ к decimals в TransferChecked
    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token2022Program>,
}

#[derive(Accounts)]
pub struct TransferUser<'info> {
    #[account(mut)]
    pub user_authority: Signer<'info>,

    #[account(mut)]
    pub user_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub business_ata: Account<'info, TokenAccount>,

    /// Чтобы иметь доступ к decimals в TransferChecked
    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token2022Program>,
}

#[account]
pub struct LoyaltyMeta {
    pub mint: Pubkey,
    pub business: Pubkey,
    pub decimals: u8,
    pub rate_loyl: u64,
    pub bump: u8,
}
