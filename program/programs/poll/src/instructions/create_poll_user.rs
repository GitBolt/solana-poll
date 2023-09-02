use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(poll_id : u32)]
pub struct InitializePollUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer= authority,
        space = 8 + 4 + 32 + (1 + 4) + 8,
        seeds = [b"poll_user", authority.key().as_ref(), poll_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub poll_user_account: Account<'info, PollUserAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializePollUser>, poll_id: u32) -> Result<()> {
    let poll_user_account = &mut ctx.accounts.poll_user_account;

    let clock = Clock::get()?;
    poll_user_account.poll_id = poll_id;
    poll_user_account.owner = *ctx.accounts.authority.key;
    poll_user_account.date_created = clock.unix_timestamp as u64;

    msg!("Created a new poll user! Id: {}", poll_id);
    Ok(())
}
