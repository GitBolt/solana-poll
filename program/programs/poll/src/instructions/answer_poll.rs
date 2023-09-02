use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(poll_id : u32)]
pub struct AnswerPoll<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"poll", poll_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,

    #[account(
        mut,
        seeds = [b"poll_user", authority.key().as_ref(), poll_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub poll_user_account: Account<'info, PollUserAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AnswerPoll>, _poll_id: u32, selected_option: u32) -> Result<()> {
    let poll_user_account = &mut ctx.accounts.poll_user_account;
    let poll_account = &mut ctx.accounts.poll_account;

    if poll_user_account.selected_option != 0 {
        return err!(Errors::AlreadyAnsweredError);
    }
    if !poll_account.is_active {
        return err!(Errors::PollEndedError);
    }
    poll_user_account.selected_option = selected_option + 1;

    if selected_option + 1 < poll_account.selected_options.len() as u32 {
        poll_account.selected_options[selected_option as usize] += 1;
    } else {
        return err!(Errors::OptionMustBeInFourIndex);
    }

    Ok(())
}
