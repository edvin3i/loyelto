//! LOYL settlement program – mints & governs the platform token (SPL-Token-2022).
//! End-users never receive LOYL; every mutable authority is PDA("platform").

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self as token_2022, Token2022},
    token_interface::{Mint, TokenAccount},
};

/*────────── CONSTANTS & PDA SEEDS ──────────*/
declare_id!("47RVB2NnGEYXdSvxxN7DfLFk69FvpJemvhH4rxLnjE4s");

const SEED_PLATFORM: &[u8] = b"platform";
const SEED_MINT:     &[u8] = b"loyl_mint";
const SEED_CONFIG:   &[u8] = b"config";

/// Raw SPL-mint size (без Anchor-дискриминатора)
const SPL_MINT_SIZE: usize = 82;

/*──────────────────── PROGRAM ───────────────────*/
#[program]
pub mod loyl_settlement {
    use super::*;

    /*──────── init_loyl ───────*/
    pub fn init_loyl(
        ctx: Context<InitLoyl>,
        decimals: u8,
        initial_supply: u64,
    ) -> Result<()> {
        require!(decimals == 6,  LoylError::InvalidDecimals);
        require!(initial_supply > 0, LoylError::InvalidAmount);

        /* 1. create mint */
        token_2022::initialize_mint2(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_2022::InitializeMint2 {
                    mint: ctx.accounts.loyl_mint.to_account_info(),
                },
            ),
            decimals,
            ctx.accounts.platform.key,
            Some(ctx.accounts.platform.key),
        )?;

        /* 2. mint to treasury */
        let signer: &[&[&[u8]]] = &[&[SEED_PLATFORM, &[ctx.bumps.platform]]];
        token_2022::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token_2022::MintTo {
                    mint: ctx.accounts.loyl_mint.to_account_info(),
                    to:   ctx.accounts.treasury_ata.to_account_info(),
                    authority: ctx.accounts.platform.to_account_info(),
                },
                signer,
            ),
            initial_supply,
        )?;

        emit!(LoylCreated { mint: ctx.accounts.loyl_mint.key(), supply: initial_supply });
        Ok(())
    }

    /*──────── mint_loyl_to ────*/
    pub fn mint_loyl_to(ctx: Context<MintLoylTo>, amount: u64) -> Result<()> {
        require!(amount > 0, LoylError::InvalidAmount);
        require!(
            !ctx.accounts.dest_ata.owner.is_on_curve(),
            LoylError::InvalidDestination
        );

        let signer: &[&[&[u8]]] = &[&[SEED_PLATFORM, &[ctx.bumps.platform]]];
        token_2022::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token_2022::MintTo {
                    mint: ctx.accounts.loyl_mint.to_account_info(),
                    to:   ctx.accounts.dest_ata.to_account_info(),
                    authority: ctx.accounts.platform.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        emit!(LoylMinted { destination: ctx.accounts.dest_ata.key(), amount });
        Ok(())
    }

    /*──────── update_settings ─*/
    pub fn update_settings(
        ctx: Context<UpdateSettings>,
        min_update_interval: i64,
        max_delta_bps: u64,
    ) -> Result<()> {
        require!(min_update_interval > 0, LoylError::InvalidInterval);
        require!(max_delta_bps      > 0, LoylError::InvalidAmount);

        let cfg = &mut ctx.accounts.config;
        cfg.min_update_interval = min_update_interval;
        cfg.max_delta_bps      = max_delta_bps;

        emit!(SettingsUpdated { min_update_interval, max_delta_bps });
        Ok(())
    }
}

/*──────────────────── ACCOUNTS ───────────────────*/
#[derive(Accounts)]
pub struct InitLoyl<'info> {
    #[account(seeds = [SEED_PLATFORM], bump)]
    pub platform: SystemAccount<'info>,

    #[account(
        init,
        payer = payer,
        space = SPL_MINT_SIZE,
        seeds = [SEED_MINT],
        bump
    )]
    pub loyl_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer  = payer,
        associated_token::mint      = loyl_mint,
        associated_token::authority = platform
    )]
    pub treasury_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program:            Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program:           Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintLoylTo<'info> {
    #[account(seeds = [SEED_PLATFORM], bump)]
    pub platform: SystemAccount<'info>,
    #[account(mut, seeds = [SEED_MINT], bump)]
    pub loyl_mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub dest_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct UpdateSettings<'info> {
    #[account(mut)]
    pub governor: Signer<'info>,
    #[account(
        init_if_needed,
        payer  = governor,
        space  = 8 + Settings::SIZE,
        seeds  = [SEED_CONFIG],
        bump
    )]
    pub config: Account<'info, Settings>,
    pub system_program: Program<'info, System>,
}

/*────────────────── STATE & EVENTS ─────────────────*/
#[account]
pub struct Settings {
    pub min_update_interval: i64,
    pub max_delta_bps:      u64,
}
impl Settings { pub const SIZE: usize = 8 + 8; }

#[event] pub struct LoylCreated     { pub mint: Pubkey, pub supply: u64 }
#[event] pub struct LoylMinted      { pub destination: Pubkey, pub amount: u64 }
#[event] pub struct SettingsUpdated { pub min_update_interval: i64, pub max_delta_bps: u64 }

/*────────────────── ERRORS ─────────────────*/
#[error_code]
pub enum LoylError {
    #[msg("Invalid decimals (must be 6)")]  InvalidDecimals,
    #[msg("Amount must be positive")]       InvalidAmount,
    #[msg("Destination must be PDA-owned")] InvalidDestination,
    #[msg("Update interval must be positive")] InvalidInterval,
}

/*────────────────── UNIT-TESTS ─────────────────*/
#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::{InstructionData, ToAccountMetas};
    use anchor_spl::{associated_token, token_2022::Token2022};
    use solana_program_test::*;
    use solana_sdk::{
        instruction::Instruction,
        signature::Keypair,
        signer::Signer,
        transaction::Transaction,
        system_program,
    };

    fn pt() -> (ProgramTest, Keypair) {
        let mut prg_test =
            ProgramTest::new("loyl_settlement", crate::ID, None);
        prg_test.add_program("spl_token_2022", Token2022::id(), None);
        (prg_test, Keypair::new())
    }

    #[tokio::test]
    async fn happy_flow() {
        let (mut prg, governor) = pt();
        let (mut banks, payer, _) = prg.start().await;

        let (platform, _) = Pubkey::find_program_address(&[SEED_PLATFORM], &crate::ID);
        let (mint, _)     = Pubkey::find_program_address(&[SEED_MINT], &crate::ID);
        let treasury_ata  = associated_token::get_associated_token_address(&platform, &mint);

        /* 1. init_loyl */
        let ix_init = Instruction {
            program_id: crate::ID,
            accounts: crate::accounts::InitLoyl {
                platform,
                loyl_mint: mint,
                treasury_ata,
                payer: payer.pubkey(),
                token_program: Token2022::id(),
                associated_token_program: associated_token::ID,
                system_program: system_program::ID,
            }
            .to_account_metas(None),
            data: crate::instruction::InitLoyl { decimals: 6, initial_supply: 1_000 }.data(),
        };
        let blockhash = banks.get_latest_blockhash().await.unwrap();
        banks.process_transaction(Transaction::new_signed_with_payer(
            &[ix_init],
            Some(&payer.pubkey()),
            &[&payer],
            blockhash,
        )).await.unwrap();

        /* 2. mint_loyl_to */
        let ix_mint = Instruction {
            program_id: crate::ID,
            accounts: crate::accounts::MintLoylTo {
                platform,
                loyl_mint: mint,
                dest_ata: treasury_ata,
                token_program: Token2022::id(),
            }
            .to_account_metas(None),
            data: crate::instruction::MintLoylTo { amount: 500 }.data(),
        };
        let blockhash = banks.get_latest_blockhash().await.unwrap();
        banks.process_transaction(Transaction::new_signed_with_payer(
            &[ix_mint],
            Some(&payer.pubkey()),
            &[&payer],
            blockhash,
        )).await.unwrap();

        /* 3. update_settings */
        let (cfg_pub, _) = Pubkey::find_program_address(&[SEED_CONFIG], &crate::ID);
        let ix_upd = Instruction {
            program_id: crate::ID,
            accounts: crate::accounts::UpdateSettings {
                governor: governor.pubkey(),
                config: cfg_pub,
                system_program: system_program::ID,
            }
            .to_account_metas(None),
            data: crate::instruction::UpdateSettings {
                min_update_interval: 60,
                max_delta_bps: 500,
            }.data(),
        };
        let blockhash = banks.get_latest_blockhash().await.unwrap();
        banks.process_transaction(Transaction::new_signed_with_payer(
            &[ix_upd],
            Some(&payer.pubkey()),
            &[&payer, &governor],
            blockhash,
        )).await.unwrap();
    }
}
