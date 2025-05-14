use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self as token_2022, Mint, Token2022},
};

declare_id!("BizFctry11111111111111111111111111111111111");

#[program]
pub mod business_factory {
    use super::*;

    pub fn create_loyalty_mint(
        ctx: Context<CreateMint>,
        decimals: u8,
        initial_supply: u64,
        rate_loyl: u64,
    ) -> Result<()> {
        // --- mint init ---
        token_2022::initialize_mint2(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::InitializeMint2 {
                    mint: ctx.accounts.mint.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            decimals,
            &ctx.accounts.business_authority.key(),
            Some(&ctx.accounts.business_authority.key()),
        )?;

        // --- initial supply ---
        token_2022::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.business_ata.to_account_info(),
                    authority: ctx.accounts.business_authority.to_account_info(),
                },
            ),
            initial_supply,
        )?;

        // --- persist business PDA ---
        let biz = &mut ctx.accounts.business;
        biz.owner = ctx.accounts.business_authority.key();
        biz.mint = ctx.accounts.mint.key();
        biz.rate_loyl = rate_loyl;
        biz.bump = *ctx.bumps.get("business").unwrap();

        emit!(BusinessCreated {
            owner: biz.owner,
            mint: biz.mint,
            rate_loyl,
        });
        Ok(())
    }
}

#[account]
pub struct Business {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub rate_loyl: u64,
    pub bump: u8,
}
impl Business {
    pub const SIZE: usize = 32 + 32 + 8 + 1;
}

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct CreateMint<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Business::SIZE,
        seeds = [b"business", business_authority.key().as_ref()],
        bump,
    )]
    pub business: Account<'info, Business>,

    #[account(
        init,
        payer = payer,
        mint::decimals = decimals,
        mint::authority = business_authority,
        mint::freeze_authority = business_authority,
        seeds = [b"mint", business_authority.key().as_ref()],
        bump,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = business_authority,
    )]
    pub business_ata: Account<'info, token_2022::TokenAccount>,

    #[account(mut)]
    pub business_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[event]
pub struct BusinessCreated {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub rate_loyl: u64,
}
