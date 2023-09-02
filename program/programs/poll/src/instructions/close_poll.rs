use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(poll_id : u32)]
pub struct ClosePoll<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"poll", poll_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClosePoll>, _poll_id: u32) -> Result<()> {
    let poll_account = &mut ctx.accounts.poll_account;
    poll_account.is_active = false;

    Ok(())
}
