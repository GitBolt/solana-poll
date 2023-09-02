use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("5dERc9MQSs11MhMLxoVGfkNXx2ESEaNvHTPcCeDdqyQj");

#[program]
pub mod poll {
    use super::*;

    pub fn create_poll(
        ctx: Context<InitializePoll>,
        id: u32,
        title: String,
        options: Vec<String>,
        ending: u64,
    ) -> Result<()> {
        instructions::create_poll::handler(ctx, id, title, options, ending)
    }

    pub fn create_poll_user(ctx: Context<InitializePollUser>, poll_id: u32) -> Result<()> {
        instructions::create_poll_user::handler(ctx, poll_id)
    }

    pub fn answer_poll(
        ctx: Context<AnswerPoll>,
        _poll_id: u32,
        selected_option: u32,
    ) -> Result<()> {
        instructions::answer_poll::handler(ctx, _poll_id, selected_option)
    }

    pub fn close_poll(ctx: Context<ClosePoll>, _poll_id: u32) -> Result<()> {
        instructions::close_poll::handler(ctx, _poll_id)
    }
}
