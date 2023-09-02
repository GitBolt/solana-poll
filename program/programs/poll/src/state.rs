use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct PollAccount {
    pub id: u32,
    pub is_active: bool,
    pub owner: Pubkey,
    pub title: String,
    pub options: Vec<String>,
    pub selected_options: Vec<u16>,
    pub ending_timestamp: u64,
}

#[account]
#[derive(Default)]
pub struct PollUserAccount {
    pub poll_id: u32,
    pub owner: Pubkey,
    pub selected_option: u32,
    pub date_created: u64,
}
