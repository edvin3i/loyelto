use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, TokenAccount},
    token_2022::{self as token_2022, Token2022},
};

declare_id!("TXWo3ecumxrx6DVxKHSjwMKhTf1mLotpgia8m18vTeN");

#[program]
pub mod business_factory {
    use super::*;

    pub fn create_loyalty_mint(
        ctx: Context<CreateMint>,
        decimals: u8,
        initial_supply: u64,
        rate_loyl: u64,
    ) -> Result<()> {
        // --- initialize mint ---
        token_2022::initialize_mint2(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::InitializeMint2 {
                    mint: ctx.accounts.mint.to_account_info(),
                },
            ),
            decimals,
            &ctx.accounts.business_authority.key(),
            Some(&ctx.accounts.business_authority.key()),
        )?;

        // --- mint initial supply to business ATA ---
        token_2022::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to:   ctx.accounts.business_ata.to_account_info(),
                    authority: ctx.accounts.business_authority.to_account_info(),
                },
            ),
            initial_supply,
        )?;

        // --- persist meta PDA ---
        let biz = &mut ctx.accounts.business;
        biz.owner      = ctx.accounts.business_authority.key();
        biz.mint       = ctx.accounts.mint.key();
        biz.rate_loyl  = rate_loyl;
        biz.bump = ctx.bumps.business;

        emit!(BusinessCreated {
            owner: biz.owner,
            mint:  biz.mint,
            rate_loyl,
        });

        Ok(())
    }
}

#[account]
pub struct Business {
    pub owner:     Pubkey,
    pub mint:      Pubkey,
    pub rate_loyl: u64,
    pub bump:      u8,
}
impl Business {
    pub const SIZE: usize = 32 + 32 + 8 + 1;
}

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct CreateMint<'info> {
    // PDA with business metadata ------------------------------------------
    #[account(
        init,
        payer  = payer,
        space  = 8 + Business::SIZE,
        seeds  = [b"business", business_authority.key().as_ref()],
        bump,
    )]
    pub business: Account<'info, Business>,

    // SPL-2022 Mint --------------------------------------------------------
    #[account(
        init,
        payer               = payer,
        mint::decimals      = decimals,
        mint::authority     = business_authority,
        mint::freeze_authority = business_authority,
        seeds  = [b"mint", business_authority.key().as_ref()],
        bump,
    )]
    pub mint: Account<'info, Mint>,

    // Associated Token Account for the business ---------------------------
    #[account(
        init_if_needed,
        payer               = payer,
        associated_token::mint      = mint,
        associated_token::authority = business_authority,
    )]
    pub business_ata: Account<'info, TokenAccount>,

    // ---------------------------------------------------------------------
    #[account(mut)]
    pub business_authority: Signer<'info>,
    #[account(mut)]
    pub payer:              Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program:  Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[event]
pub struct BusinessCreated {
    pub owner:     Pubkey,
    pub mint:      Pubkey,
    pub rate_loyl: u64,
}
