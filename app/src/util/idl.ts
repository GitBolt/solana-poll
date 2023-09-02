export type IDLType = {
    "version": "0.1.0",
    "name": "poll",
    "instructions": [
        {
            "name": "createPoll",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "id",
                    "type": "u32"
                },
                {
                    "name": "title",
                    "type": "string"
                },
                {
                    "name": "options",
                    "type": {
                        "vec": "string"
                    }
                },
                {
                    "name": "ending",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "createPollUser",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollUserAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "answerPoll",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pollUserAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u32"
                },
                {
                    "name": "selectedOption",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "closePoll",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u32"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "pollAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u32"
                    },
                    {
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "name": "options",
                        "type": {
                            "vec": "string"
                        }
                    },
                    {
                        "name": "selectedOptions",
                        "type": {
                            "vec": "u16"
                        }
                    },
                    {
                        "name": "endingTimestamp",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "pollUserAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pollId",
                        "type": "u32"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "selectedOption",
                        "type": "u32"
                    },
                    {
                        "name": "dateCreated",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "OptionMustBeInFourIndex",
            "msg": "Selected option must be either 1,2,3,4"
        },
        {
            "code": 6001,
            "name": "PollEndedError",
            "msg": "Poll already ended"
        },
        {
            "code": 6002,
            "name": "AlreadyAnsweredError",
            "msg": "You Already Answered"
        }
    ]
};


export const IDLData: IDLType = {
    "version": "0.1.0",
    "name": "poll",
    "instructions": [
        {
            "name": "createPoll",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "id",
                    "type": "u32"
                },
                {
                    "name": "title",
                    "type": "string"
                },
                {
                    "name": "options",
                    "type": {
                        "vec": "string"
                    }
                },
                {
                    "name": "ending",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "createPollUser",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollUserAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "answerPoll",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pollUserAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u32"
                },
                {
                    "name": "selectedOption",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "closePoll",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pollAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u32"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "pollAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u32"
                    },
                    {
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "name": "options",
                        "type": {
                            "vec": "string"
                        }
                    },
                    {
                        "name": "selectedOptions",
                        "type": {
                            "vec": "u16"
                        }
                    },
                    {
                        "name": "endingTimestamp",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "pollUserAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pollId",
                        "type": "u32"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "selectedOption",
                        "type": "u32"
                    },
                    {
                        "name": "dateCreated",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "OptionMustBeInFourIndex",
            "msg": "Selected option must be either 1,2,3,4"
        },
        {
            "code": 6001,
            "name": "PollEndedError",
            "msg": "Poll already ended"
        },
        {
            "code": 6002,
            "name": "AlreadyAnsweredError",
            "msg": "You Already Answered"
        }
    ]
};

