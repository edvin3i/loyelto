use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self as token_2022, InitializeMint2, MintTo, TransferChecked},
    token_interface::{Mint, TokenAccount},
};
use spl_token::state::Mint as SplMint;

/*───────────────────────────  CONST SEEDS  ───────────────────────────*/
const SEED_CONFIG:        &[u8] = b"config";
const SEED_LOYL_TREASURY: &[u8] = b"loyl_treasury";
const SEED_MINT_AUTH:     &[u8] = b"mint";
const SEED_META:          &[u8] = b"meta";
const SEED_POOL:          &[u8] = b"pool";
const SEED_TREASURY:      &[u8] = b"treasury";

/*────────────────────────────  PROGRAM ID  ───────────────────────────*/
declare_id!("3kzE3Xvgzi9PurL9cjRU7t9twHLYZUhaVv2AVmLXqbxm");

/*───────────────────────────  STATE ACCOUNTS  ───────────────────────*/
#[account]
pub struct PlatformConfig {
    pub min_update_interval: u64, // seconds
    pub max_delta_bps:       u16, // basis-points  (e.g. 2500 = 25 %)
}
#[account]
pub struct LoyaltyMeta {
    pub mint:      Pubkey,
    pub business:  Pubkey,
    pub decimals:  u8,
    pub rate_loyl: u64,
    pub bump:      u8,
}
#[account]
pub struct Pool {
    pub mint:         Pubkey,
    pub rate:         u64,
    pub last_rate:    u64,
    pub last_updated: i64,
    pub bump:         u8,
}
#[account]
pub struct Treasury {
    pub bump: u8,
}

impl LoyaltyMeta { pub const SIZE: usize = 8 + 32 + 32 + 1 + 8 + 1; }
impl Pool        { pub const SIZE: usize = 8 + 32 + 8 + 8 + 8 + 1; }
impl Treasury    { pub const SIZE: usize = 8 + 1; }

/*────────────────────────── EVENTS & ERRORS ─────────────────────────*/
#[event]
pub struct MintCreated {
    #[index] pub mint: Pubkey,
    pub business:      Pubkey,
    pub initial_supply:u64,
    pub rate_loyl:     u64,
}
#[event]
pub struct ExtraMinted {
    #[index] pub mint: Pubkey,
    pub destination:   Pubkey,
    pub amount:        u64,
}
#[event]
pub struct RateUpdated {
    #[index] pub mint: Pubkey,
    pub old_rate:      u64,
    pub new_rate:      u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("rate_loyl must be > 0")]         InvalidRate,
    #[msg("amount must be > 0")]            InvalidAmount,
    #[msg("math overflow")]                 MathOverflow,
    #[msg("update too frequent")]           RateTooFrequent,
    #[msg("rate change too large")]         RateTooVolatile,
}

/*───────────────────────────  ACCOUNTS  ─────────────────────────────*/
use anchor_lang::prelude::InterfaceAccount;
use anchor_lang::solana_program::program_pack::Pack;

/// The size in bytes of an SPL token mint account.
/// This is the raw size without the Anchor discriminator.
const SPL_MINT_ACCOUNT_SIZE: usize = spl_token::state::Mint::LEN;// 82 B — raw SPL mint, without Anchor discriminator


#[derive(Accounts)]
pub struct CreateMint<'info> {
    /*--- global config (read-only) ---*/
    #[account(seeds = [SEED_CONFIG], bump)]
    pub platform_config: Account<'info, PlatformConfig>,

    /*--- LOYL treasury (for pool replenishment) ---*/
    pub loyl_mint: InterfaceAccount<'info, Mint>,
    #[account(seeds = [SEED_LOYL_TREASURY], bump)]
    /// CHECK: PDA authority
    pub platform_treasury_authority: UncheckedAccount<'info>,
    #[account(
        associated_token::mint      = loyl_mint,
        associated_token::authority = platform_treasury_authority
    )]
    pub platform_treasury_ata: InterfaceAccount<'info, TokenAccount>,

    /*Business address*/
    #[account(mut)]
    pub business_authority: Signer<'info>,

    /*--- PDA mint-authority ---*/
    #[account(seeds = [SEED_MINT_AUTH, business_authority.key().as_ref()], bump)]
    /// CHECK: PDA authority
    pub mint_authority: UncheckedAccount<'info>,

    /*--- Branded Mint account ---*/
    #[account(
        init,
        payer  = business_authority,
        space  = SPL_MINT_ACCOUNT_SIZE,
        seeds  = [b"brand_mint", business_authority.key().as_ref()],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer  = business_authority,
        associated_token::mint      = mint,
        associated_token::authority = business_authority
    )]
    pub business_ata: InterfaceAccount<'info, TokenAccount>,

    /*--- meta ---*/
    #[account(
        init,
        payer = business_authority,
        space = LoyaltyMeta::SIZE,
        seeds = [SEED_META, mint.key().as_ref()],
        bump
    )]
    pub loyalty_meta: Account<'info, LoyaltyMeta>,

    /*--- pool ---*/
    #[account(
        init,
        payer = business_authority,
        space = Pool::SIZE,
        seeds = [SEED_POOL, mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(
        init,
        payer  = business_authority,
        associated_token::mint      = mint,
        associated_token::authority = pool
    )]
    pub pool_vault_token: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer  = business_authority,
        associated_token::mint      = loyl_mint,
        associated_token::authority = pool
    )]
    pub pool_vault_loyl: InterfaceAccount<'info, TokenAccount>,

    /*--- treasury ---*/
    #[account(
        init,
        payer = business_authority,
        space = Treasury::SIZE,
        seeds = [SEED_TREASURY, mint.key().as_ref()],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    #[account(
        init,
        payer  = business_authority,
        associated_token::mint      = mint,
        associated_token::authority = treasury
    )]
    pub treasury_ata: InterfaceAccount<'info, TokenAccount>,

    /*--- programs ---*/
    pub system_program:           Program<'info, System>,
    pub token_program:            Program<'info, token_2022::Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent:                     Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Earn<'info> {
    /* token mint & treasury */
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(seeds = [SEED_TREASURY, mint.key().as_ref()], bump = treasury.bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(
        mut,
        associated_token::mint      = mint,
        associated_token::authority = treasury
    )]
    pub treasury_ata: InterfaceAccount<'info, TokenAccount>,

    /* user */
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint      = mint,
        associated_token::authority = user
    )]
    pub user_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, token_2022::Token2022>,
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(seeds = [SEED_TREASURY, mint.key().as_ref()], bump = treasury.bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(
        mut,
        associated_token::mint      = mint,
        associated_token::authority = treasury
    )]
    pub treasury_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint      = mint,
        associated_token::authority = user
    )]
    pub user_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, token_2022::Token2022>,
}

#[derive(Accounts)]
pub struct MintExtra<'info> {
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(seeds = [SEED_MINT_AUTH, business_authority.key().as_ref()], bump)]
    /// CHECK: PDA authority
    pub mint_authority: UncheckedAccount<'info>,
    pub business_authority: Signer<'info>,
    #[account(mut)]
    pub destination: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Program<'info, token_2022::Token2022>,
}

#[derive(Accounts)]
pub struct UpdateRate<'info> {
    #[account(
        mut,
        seeds = [SEED_POOL, mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    pub business_authority: Signer<'info>,

    #[account(seeds = [SEED_META, mint.key().as_ref()], bump)]
    pub loyalty_meta: Account<'info, LoyaltyMeta>,

    #[account(seeds = [SEED_CONFIG], bump)]
    pub platform_config: Account<'info, PlatformConfig>,
}

/*────────────────────────────  PROGRAM  ─────────────────────────────*/
#[program]
pub mod loyl_token {
    use super::*;

    /*──────────── create_loyalty_mint ────────────*/
    pub fn create_loyalty_mint(
        ctx: Context<CreateMint>,
        rate_loyl:      u64,
        decimals:       u8,
        initial_supply: u64,
    ) -> Result<()> {
        /* 1. Basic validation */
        require!(rate_loyl > 0, ErrorCode::InvalidRate);

        /* 2. seed preparation */
        let mint_auth_seeds = &[
            SEED_MINT_AUTH,
            ctx.accounts.business_authority.key.as_ref(),
            &[ctx.bumps.mint_authority],
        ];
        let loyl_treasury_seeds = &[SEED_LOYL_TREASURY, &[ctx.bumps.platform_treasury_authority]];

        /* 3. mint initialization */
        token_2022::initialize_mint2(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                InitializeMint2 {
                    mint: ctx.accounts.mint.to_account_info(),
                },
            ),
            decimals,
            &ctx.accounts.mint_authority.key(),
            Some(&ctx.accounts.mint_authority.key()),
        )?;

        /* 4. 100% emitted to business */
        token_2022::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint:      ctx.accounts.mint.to_account_info(),
                    to:        ctx.accounts.business_ata.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            )
            .with_signer(&[mint_auth_seeds]),
            initial_supply,
        )?;

        /* 5. 25% goes to the pool + LOYL equivalent */
        let quarter = initial_supply.checked_div(4).ok_or(ErrorCode::MathOverflow)?;
        token_2022::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from:      ctx.accounts.business_ata.to_account_info(),
                    to:        ctx.accounts.pool_vault_token.to_account_info(),
                    authority: ctx.accounts.business_authority.to_account_info(),
                    mint:      ctx.accounts.mint.to_account_info(),
                },
            ),
            quarter,
            decimals,
        )?;

        /* — Calculation of loyl_amount considering LOYL precision —*/
        let loyl_decimals = {
            let account_info = ctx.accounts.loyl_mint.to_account_info();
            let data = account_info.try_borrow_data()?;
            SplMint::unpack(&data)?.decimals
        };
        let scale = 10u64
            .checked_pow((loyl_decimals as i32).abs_diff(decimals as i32) as u32)
            .ok_or(ErrorCode::MathOverflow)?;
        let loyl_amount = if loyl_decimals >= decimals {
            /* need more base-units */
            quarter
                .checked_mul(scale)
                .ok_or(ErrorCode::MathOverflow)?
                .checked_div(rate_loyl)
                .ok_or(ErrorCode::MathOverflow)?
        } else {
            quarter
                .checked_div(scale)
                .ok_or(ErrorCode::MathOverflow)?
                .checked_div(rate_loyl)
                .ok_or(ErrorCode::MathOverflow)?
        };

        token_2022::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from:      ctx.accounts.platform_treasury_ata.to_account_info(),
                    to:        ctx.accounts.pool_vault_loyl.to_account_info(),
                    authority: ctx.accounts.platform_treasury_authority.to_account_info(),
                    mint:      ctx.accounts.loyl_mint.to_account_info(),
                },
            )
            .with_signer(&[loyl_treasury_seeds]),
            loyl_amount,
            loyl_decimals,
        )?;

        /* 6. state and event recording */
        ctx.accounts.loyalty_meta.set_inner(LoyaltyMeta {
            mint:      ctx.accounts.mint.key(),
            business:  ctx.accounts.business_authority.key(),
            decimals,
            rate_loyl,
            bump: ctx.bumps.loyalty_meta,
        });
        ctx.accounts.pool.set_inner(Pool {
            mint:         ctx.accounts.mint.key(),
            rate:         rate_loyl,
            last_rate:    rate_loyl,
            last_updated: Clock::get()?.unix_timestamp,
            bump:         ctx.bumps.pool,
        });
        ctx.accounts.treasury.bump = ctx.bumps.treasury;

        emit!(MintCreated {
            mint:            ctx.accounts.mint.key(),
            business:        ctx.accounts.business_authority.key(),
            initial_supply,
            rate_loyl,
        });
        Ok(())
    }

    /*──────────── earn_points ────────────*/
    pub fn earn_points(ctx: Context<Earn>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let mint_key = ctx.accounts.mint.key();
        let signer = &[
            SEED_TREASURY,
            mint_key.as_ref(),
            &[ctx.accounts.treasury.bump],
        ];
        let decimals = {
            let account_info = ctx.accounts.mint.to_account_info();
            let data = account_info.try_borrow_data()?;
            SplMint::unpack(&data)?.decimals
        };
        token_2022::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from:      ctx.accounts.treasury_ata.to_account_info(),
                    to:        ctx.accounts.user_ata.to_account_info(),
                    authority: ctx.accounts.treasury.to_account_info(),
                    mint:      ctx.accounts.mint.to_account_info(),
                },
            )
            .with_signer(&[signer]),
            amount,
            decimals,
        )?;
        Ok(())
    }

    /*──────────── redeem_points ────────────*/
    pub fn redeem_points(ctx: Context<Redeem>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let decimals = {
            let account_info = ctx.accounts.mint.to_account_info();
            let data = account_info.try_borrow_data()?;
            SplMint::unpack(&data)?.decimals
        };
        token_2022::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from:      ctx.accounts.user_ata.to_account_info(),
                    to:        ctx.accounts.treasury_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                    mint:      ctx.accounts.mint.to_account_info(),
                },
            ),
            amount,
            decimals,
        )?;
        Ok(())
    }

    /*──────────── mint_extra ────────────*/
    pub fn mint_extra(ctx: Context<MintExtra>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let mint_auth_seeds = &[
            SEED_MINT_AUTH,
            ctx.accounts.business_authority.key.as_ref(),
            &[ctx.bumps.mint_authority],
        ];
        token_2022::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint:      ctx.accounts.mint.to_account_info(),
                    to:        ctx.accounts.destination.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            )
            .with_signer(&[mint_auth_seeds]),
            amount,
        )?;
        emit!(ExtraMinted {
            mint:        ctx.accounts.mint.key(),
            destination: ctx.accounts.destination.key(),
            amount,
        });
        Ok(())
    }

    /*──────────── update_rate_loyl ────────────*/
    pub fn update_rate_loyl(ctx: Context<UpdateRate>, new_rate: u64) -> Result<()> {
        let now  = Clock::get()?.unix_timestamp;
        let pool = &mut ctx.accounts.pool;
        let cfg  = &ctx.accounts.platform_config;

        /*-- timelock --*/
        require!(
            now.checked_sub(pool.last_updated).ok_or(ErrorCode::MathOverflow)?
                >= cfg.min_update_interval as i64,
            ErrorCode::RateTooFrequent
        );

        /*-- deviation guard --*/
        let delta = pool.rate.abs_diff(new_rate);
        let max   = pool
            .rate
            .checked_mul(cfg.max_delta_bps as u64)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10_000)
            .ok_or(ErrorCode::MathOverflow)?;
        require!(delta <= max, ErrorCode::RateTooVolatile);

        /*-- update & sync meta-rate --*/
        let old_rate = pool.rate;
        pool.last_rate    = old_rate;
        pool.rate         = new_rate;
        pool.last_updated = now;

        ctx.accounts.loyalty_meta.rate_loyl = new_rate;

        emit!(RateUpdated {
            mint: pool.mint,
            old_rate,
            new_rate,
        });
        Ok(())
    }
}
