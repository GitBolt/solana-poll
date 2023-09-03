# Online Solana Poll dApp

## 🎬 Recorded Sessions

| Link        | Instructor | Event |
| ----------- | ---------- | ----- |
| ... | ...        | ...     |

## ☄️ Open in Solana Playground IDE

| Program         | Link                                                                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Poll | [ ![program](https://ik.imagekit.io/mkpjlhtny/solpg_button_zWM8WlPKs.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1662621556513)](https://beta.solpg.io/64f49aa26f50baeacc2cd476) |


## 📗 Learn

In this workshop, we'll learn how to create an online poll dApp on Solana. The poll is largely inspired by X (formerly Twitter) poll system.
We'd be able to create polls, answer polls and close them.

### How to Build & Run

1. You would need to deploy the program on Solana blockchain first. You can use SolPg to get started quickly or clone this and work locally:
 - SOLPg
   - Click on the [Solana Playground](https://beta.solpg.io/64f49aa26f50baeacc2cd476) link and deploy it
  - Working Locally
    - Install [Anchor](https://www.anchor-lang.com/), [Rust](https://www.rust-lang.org/tools/install) and [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) and [Clockwork CLI](https://docs.clockwork.xyz/welcome/installation) and clone this repository
    - Run `clockwork localnet`
    - Then, open a new terminal instance and head over to `program/` directory using `cd program/` command.
    - Enter `anchor build` and `yarn install` in the same directory.
    - Then, enter `anchor deploy`, you'll get a program Id at the end, copy it and paste it in [declare_id macro](/program/programs/poll/src/lib.rs) and in [Anchor.toml localnet section](/program/Anchor.toml)
    - Finally, enter `anchor test --skip-local-validator` to build everything and run tests.

> Note that you may have some issues using latest version of Solana CLI. It is recommend that you install Solana CLI version 1.14.18
If you see blockhash keep expiring when you run `anchor deploy` or when running `anchor test`, then just stop your clockwork validator and re-start it. That will solve the issue.
  

2. To launch the frontend, head over to `/app` directory and enter: `yarn install && yarn dev`


### Anchor Program
We have four instructions in total and putting them all in one lib.rs file is not the best practice. Hence we have the file structure broken down as follows:
- instructions folder: having all individual instructions and instruction contexts
- state.rs: contain our account strucutres
- errors.rs: storing all error codes


Let's go through the code and understand how our program works.


1. Accounts
   - 1.1 Poll Account
   - 1.2 Poll User Account
   - 
2. Actions
    - 2.1 Creating Poll
    - 2.2 Creating Poll User
    - 2.3 Answering Poll
    - 2.4 Closing Poll

3. Error handling
   - 3.1 Error definations
   - 3.2 Using custom error codes

----
#### 1.1 Poll Account

First of all, open up [program/programs/poll/src/state.rs](program/programs/poll/src/state.rs)

In this file, we are defining our program state, which is stored in accounts. So we're defining our accounts here.
Let's see our poll account:

```rust
// Line 3
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
```

Above `PollAccount` struct, we have the `#[account]` macro, which is from Anchor program that specifies that this particular struct is representing a Solana account.
For our poll account, we need to specify certain attributes or fields, note that you can extend/modify these according to your preference and architecture ideas. But lets go through what we have here!
- id: unique id for each poll account used to identify them
- is_active: a true or false value determining if a particular poll has ended or not
- owner: the public key of the person who created the poll
- title: poll's question
- options: four poll options as a vector of strings
- selected_options: another vector of four items, but the items here are numbers representing the number of people who voted for the poll option in that index. For example, if the `options` are `["Yes", "No", "All", "None"]` and `selected_options` is `[0, 2, 3, 1]`, this means the 0 people voted for "Yes", 2 voted for "No", 3 voted for "All" and 1 voted for "None"
- ending_timestamp: unix timestamp for the date and time when the poll is supposed to end
  

#### 1.2 Poll User Account

Head over to [program/programs/poll/src/state.rs](program/programs/poll/src/state.rs) again

Let's look into our poll user account now

```rust
// Line 17
pub struct PollUserAccount {
    pub poll_id: u32,
    pub owner: Pubkey,
    pub selected_option: u32,
    pub date_created: u64,
}

```
We're ignoring the macros as we've covered them briefly just now.

Let's have a look into this account:
- poll_id: Id of the poll account for which this user's poll account is created
- owner: Once again, simply the public key of the user who created this poll account and hence "owns" it
- selected_option: This is the index of the option that the user selected from the poll.
- date_created: Simply the date and time of the creationg of this poll account. We don't really need this for our functionality, but storing this as a potentional addition to UI.
  

----

#### 2.1 Creating poll
Now, go to [program/programs/poll/src/instructions/create_poll.rs](program/programs/poll/src/instructions/create_poll.rs) and check this instruction context:
```rs
// Line 4

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

```

In instruction contexts, we basically defined how exactly the accounts are supposed to be used and what their roles are in our instruction.
We have three accounts here, notably `authority`, `poll_account`, `system_program`. Let us go through them one by one:
- authority: This is the account of the user who called the instruction, and hence is the owner of the poll that will be created.
- poll_account: This is the most important account. This is a PDA (Program Derived Address), we're passing the seeds as "poll", along with the unique id of the poll account to derive this poll account. This account uses the same structure of poll account we saw above in section 1.1
- system_program: This is a mandatory program we have to pass in every instruction context, as Solana system program is the native program responsible for most built in instructions.

Now, we pass this instruction context in our actual instruction responsible for executing logic, let's have a look into that. Head over to line 21 in the same file:
```rust

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

```
We can see that other than our context, we are passing id, title, options and ending as the parameters in our instruction function. That is because we want the client side code to enter these values, and then, we are simply assinging these values to our `poll_account` that we are getting from our `ctx` (context).
By default, as soon as a poll is created, it is live, hence we are assinging the `is_active` field to `true`.
We are also assining the `selected_options` the value of vector with 4 zeroes. That is because when a poll starts, all four options have zero votes.


#### 2.2 Creating poll user
Now, go to [program/programs/poll/src/instructions/create_poll_user.rs](program/programs/poll/src/instructions/create_poll_user.rs) and check this instruction context:
```rs
// Line 6

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


```
Mostly it is the same as initilize poll user, but only difference is that instead of "poll", we are using the string "poll_user" to derive this PDA

Lets have a look into the instruction:
```rust

pub fn handler(ctx: Context<InitializePollUser>, poll_id: u32) -> Result<()> {
    let poll_user_account = &mut ctx.accounts.poll_user_account;

    let clock = Clock::get()?;
    poll_user_account.poll_id = poll_id;
    poll_user_account.owner = *ctx.accounts.authority.key;
    poll_user_account.date_created = clock.unix_timestamp as u64;

    msg!("Created a new poll user! Id: {}", poll_id);
    Ok(())
}

```
In this case, we're doing one thing which is noticebly different, which is using the system `Clock` to get the current time. Since we need to assign the `date_created` value to our user account on creation. We can get the current time from Solana system clock using `Clock::get()?.unix_timestamp`.



#### 2.3 Answering poll
Now, go to [program/programs/poll/src/instructions/answer_poll.rs](program/programs/poll/src/instructions/answer_poll.rs) and check this instruction context:
```rs
// Line 7

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

```
In this case, we are passing both the `poll` and `poll_user` PDA, the reason for that is because we want to update the poll account itself with the vote that the user who called this instruction gave, as well as updating that user's poll user account too with the option they chose to vote. Lets understand this properly by seeing the actual logic in our instruction function:

Lets have a look into the instruction:
```rust
// Line 23

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

```
Woah woah what are all those if statements? Do not worry, we are just checking bunch of things before allowing a user to vote for that poll. We will go into them in detail in the error handling section. But for now, we are just making sure a user cannot poll in a poll that has ended, cannot poll for any option more than 4 as 4 is the limit and cannot vote more than once.

You can notice this function takes in `_poll_id` and `selected_option` parameters. However note that `_poll_id` argument is not even being used in this instruction function, then why are we passing it? Well, that is so that our instruction context can get this ID to derive our account PDAs, otherwise, our context cannot know which poll id is it supposed to use to derive both poll account and poll user account PDAs.

In the line `poll_user_account.selected_option = selected_option + 1;`, we are assinging the user's account to have their option selected. Note that we are adding one to it as indexes start with zero and in our client we are considering 0 to be the default value, so for user's selected option would be they have selected nothing, so for the first option, we cannot use zero index and hence must update it to be 1 for first, 2nd for second etc.

And then in this part:
```rs
poll_account.selected_options[selected_option as usize] += 1;
```
We are getting the user's selected option index value and incrementing it by one, denoting that now that index's option has one more new vote.


#### 2.4 Closing poll
Now, go to [program/programs/poll/src/instructions/close_poll.rs](program/programs/poll/src/instructions/close_poll.rs) and check this instruction context:
This part is super simple, we are just setting the `is_active` value to false, that is it!
Now, let us understand some error handling.

---- 

#### 3.1 Error definations
Now, go to [program/programs/poll/src/errors.rs](program/programs/poll/src/errors.rs)
Here, we can see this:
```rs
#[error_code]
pub enum Errors {
    #[msg("Selected option must be either 1,2,3,4")]
    OptionMustBeInFourIndex,
    #[msg("Poll already ended")]
    PollEndedError,
    #[msg("You Already Answered")]
    AlreadyAnsweredError,
}
```
Defining custom errors in Anchor is super easy. We just need to define an Enum and have use the msg macro to explain the error, which is followed by the Enum item name being the error's name which we will use in our code to reference.

In our code, we are defining just three custom errors for three situations:
- When user enters an option beyond 4. Since our poll allows 4 options max (which of course can be extended by you!), we cannot allow a user to enter any value more than 4 and get away!
- If the poll is already ended, then we want to show a user that they cannot vote for the poll now
- If the user has answered a poll already, they are not allowed to do it again, and hence we display them the already answered error.

Lets see how we are using this error code in our code

#### 3.2 Using custom error codes
We are using all of our errors in one instruction alone, which is [answer_poll](program/programs/poll/src/instructions/answer_poll.rs)
Lets go through the three if statements on by one:

```rs
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
```

- In the first one, we are checking if the user's poll account's `selected_option` value is zero or not, if it is not zero, that means the user already has selected an option, hence we are throwing the AlreadyAnsweredError
- In the second one, we are getting the `is_active` field, which is true by default, and checking if it's the opposite, i.e: false. If that is the case, the user cannot vote anymore and we show PollEndedError
- In the third one, we are comparing the user's option and making sure that the selected_options array, having length four, is always greater than the user's selected option, otherwise, a user may vote for an option that does not even exist.
  
That is it for our program! Lets understand our client

### Client Code

Let's go through the code and understand how our client works. We are just going to cover the Anchor program integration part, because rest of the things are basic Next.js/React.js stuff.

1. Program setup
   - 1.1 Creating Anchor Provider
   - 1.2 Adding IDL

2. Fetching Data
   - 2.1 Fetching all polls
   - 2.2 Fetching polls and user with filters

#### 1.1 Creating Anchor Provider

To get started, we create an Anchor provider, which will interact with our Solana program. Go to [/app/src/util/helper.ts](./app/src/util/helper.ts)

We first create an anchor program provider that will help us interact with our program. Note that it takes in our `IDL`. We will understand more about the IDL next.

```ts
// Line 26

export const anchorProgram = (wallet: anchor.Wallet, network?: string) => {
  const provider = getProvider(wallet, network);
  const idl = IDLData as anchor.Idl;
  const program = new anchor.Program(
    idl,
    new PublicKey(DEVNET_PROGRAM_ID),
    provider
  ) as unknown as anchor.Program<IDLType>;

  return program;
};
```

#### 1.2 Adding IDL

When you build your program, in the `target/` directory, your program's IDL is created. IDL is essentially the structure of your entire program, including all instructions, instruction params and all accounts. The IDL is saved in a JSON file. 

We have to copy it in our client code and save it as a type so that we can easily work with our anchor provider with type annotations and checking. In this repository, the IDL is present in [/app/src/util/idl.ts](./app/src/util/idl.ts) file

We have to first copy the generated IDL JSON from our program's `target/` directory, and paste it as `IDLType` in our client. This will be the type for our IDL Data. Then, define the `IDLData` variable with the exact same IDL JSON, and add the `IDLType` to our `IDLData` object's type. That's it!.

----

#### 2.1 Deriving thread address using Clockwork SDK
We have to first install Clockwork SDK. You can do it by typing `yarn add @clockwork-xyz/sdk`.
Now, open up [/app/src/util/program/openAccount.ts](/app/src/util/program/openAccount.ts)
Check line 14:

```ts
const clockworkProvider = ClockworkProvider.fromAnchorProvider(
    program.provider as anchor.AnchorProvider
);

const threadId = "bank_account-" + new Date().getTime() / 1000;

const [bank_account] = PublicKey.findProgramAddressSync(
    [Buffer.from("bank_account"), Buffer.from(threadId)],
    program.programId
);

const [threadAuthority] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("authority")],
    program.programId
);
const [threadAddress] = clockworkProvider.getThreadPDA(
    threadAuthority,
    threadId
);
```
We are first defining Clockwork provider. Just like our Anchor provider, we would need Clockwork provider to derive thread address.

Then, we are generating a unique thread ID. Using it as seed and the string "bank_account", we're then deriving our bank_account PDA

Next, we're deriving threadAuthority PDA using the string "authority". We're then using this "authority" PDA and unique thread ID to derive a `threadAddress` using Clockwork's provider

#### 2.2 Depositing and Withdrawing
Open up [/app/src/util/program/addBalance.ts](/app/src/util/program/addBalance.ts)
We're simply passing the unique `threadId` and our bank account PDA, along with the amount we want to deposit.
Check ine 19:
```ts
const sig = await program.methods.deposit(Buffer.from(threadId), balance)
    .accounts({
        bankAccount: bank_account,
        holder: wallet.publicKey,
        
    }).rpc()
```

Now, open [/app/src/util/program/removeBalance.ts](/app/src/util/program/removeBalance.ts)
You'll notice that just like how our withdraw and deposit program instructions were very similar, our clients are also pretty much the same.


----

#### 3.1 Fetching our Bank Account
Now, it's the time we fetch our bank accounts. A user can have multiple bank accounts, just like in real world, we are not categorizing them like real world for simplicity.

Open [/app/src/util/program/getBankAccount.ts](/app/src/util/program/getBankAccount.ts)
Notice Line 11:

```ts
const data = await program.account.bankAccount.all([
    {
    memcmp: { offset: 8, bytes: wallet.publicKey.toBase58() }
    }
])
```

Anchor provides us `.all()` and .fetch() methods. One returns all bank accounts, other returns an individual bank account through it's public key. But what about adding some filtering to fetch accouts by some specific attribute, like the owner?

Look at the array in the code snippet above.

Under the hood, `all` method is calling Solana JSON RPC's `getProgramAccounts` method. You can check out [Solana CookBook's Guide](https://solanacookbook.com/guides/get-program-accounts.html#facts) to understand it in more depth!

But for now, to keep it simple. The `memcmp` filter, standing for memory comparison helps us comparing specific value in bytes on its position. 

#### 3.2 Filters in detail

We define our account space according to this [Space Reference](https://book.anchor-lang.com/anchor_references/space.html).

Let's have a look at our Bank Account Struct again from Rust:
```rs
pub struct BankAccount {
    pub holder: Pubkey,
    pub holder_name: String,
    pub balance: f64,
    pub thread_id: Vec<u8>,
    pub created_at: i64,
    pub updated_at: i64,
}
```

The first `8` byte space is for discriminator, we have to add it every time when fetching data. Then, we have specific byte values for all values in our account struct. In order to get the value `holder`, which is after discriminator, we need to shift bytes by 8. That is the **offset** you see in the TypeScript code snippet in the [section above](#31-fetching-our-bank-account)

We just need to define the correct offset for the byte data we are looking at, and then add the actual byte data itself, which is the user's public key in this case.

And that is it! It's that easy to fetch particular accounts through filters. If we wanted to get let's say, all bank accounts with balance 100, we would just need to add 8 + (4 + 12) offset and enter our amount in bytes!


