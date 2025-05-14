use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self as token_2022, Mint, Token2022},
};

declare_id!("LoyL1111111111111111111111111111111111111");

#[program]
pub mod loyl_token {
    use super::*;

    pub fn init_loyl(
        ctx: Context<InitLoyl>,
        decimals: u8,
        initial_supply: u64,
    ) -> Result<()> {
        // CPI: create Mint
        token_2022::initialize_mint2(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::InitializeMint2 {
                    mint: ctx.accounts.loyl_mint.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            decimals,
            &ctx.accounts.mint_authority.key(),
            Some(&ctx.accounts.mint_authority.key()),
        )?;

        // CPI: mint to ATA treasury
        token_2022::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::MintTo {
                    mint: ctx.accounts.loyl_mint.to_account_info(),
                    to: ctx.accounts.treasury_ata.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            initial_supply,
        )?;

        emit!(LoylInit {
            mint: ctx.accounts.loyl_mint.key(),
            supply: initial_supply,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitLoyl<'info> {
    #[account(init, payer = payer, mint::decimals = decimals,
              mint::authority = mint_authority,
              mint::freeze_authority = mint_authority)]
    pub loyl_mint: Account<'info, Mint>,
    /// tres PDA — seeds = ["treasury"]
    #[account(
        seeds = [b"treasury"],
        bump,
    )]
    pub treasury: SystemAccount<'info>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = loyl_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_ata: Account<'info, token_2022::TokenAccount>,
    #[account(mut)]
    pub mint_authority: Signer<'info>, // = Treasury KP
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[event]
pub struct LoylInit {
    pub mint: Pubkey,
    pub supply: u64,
}
