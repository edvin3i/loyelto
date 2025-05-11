use anchor_lang::prelude::*;

declare_id!("2dwQT4Npc3MtRzYYrr8TmGMUsaGxTgCTKWPrHfMxSPAK");

#[program]
pub mod exchange {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
