use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id : u32)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + 4 + 32 + (4 + 70) + (4 + 1 * 50) + (4 + 1 * 4) + 8 + 1,
        seeds = [b"poll", id.to_le_bytes().as_ref()], 
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializePoll>,
    id: u32,
    title: String,
    options: Vec<String>,
    ending: u64,
) -> Result<()> {
    let poll_account = &mut ctx.accounts.poll_account;

    poll_account.id = id;
    poll_account.title = title;
    poll_account.options = options;
    poll_account.selected_options = [0, 0, 0, 0].to_vec();
    poll_account.ending_timestamp = ending;
    poll_account.owner = *ctx.accounts.authority.key;
    poll_account.is_active = true;

    msg!("Created a new poll! Id: {}", id);
    Ok(())
}
