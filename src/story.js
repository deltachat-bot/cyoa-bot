module.exports = {
    "part_1": {
        message: "Hey you?",
        choices: [
            { label: "Hello?", goto: "part_3" },
            { label: "Who are you?", goto: "part_2" },
        ]
    },
    "part_2": {
        message: "I dont have time to explain all.",
        choices: [
            { label: "Ok", goto: "part_3" },
        ]
    },
    "part_3": {
        message: "You must trust me. I need your help!",
        choices: [
            { label: "What's wrong?", goto: "part_5" },
            { label: "I dont want to help you. I dont know you. Bye!", goto: "part_4" },
        ]
    },
    "part_4": {
        message: "Disconnected",
        choices: [
            { label: "Connect again", goto: "part_1" },
        ]
    },
    "part_5": {
        message: "I be tracked by strangers. They want to see me dead!",
        choices: [
            { label: "Who are the Strangers?", goto: "part_6" },
            { label: "Why they want to see your dead?", goto: "part_7" },
        ]
    },
    "part_6": {
        message: "I don't know it exactly who they are but I suspect Omega Corp. I have hacked before a couple of days Omega Corp. and they have tracked me.",
        choices: [
            { label: "Why have you hacked Omega Corp.?", goto: "part_8" },
        ]
    },
    "part_7": {
        message: "I think some of Omega Corp. want to see me dead. I have hacked before a couple of days Omega Inc. Corp. and they have tracked me.",
        choices: [
            { label: "Why have you hacked Omega Corp.?", goto: "part_8" },
        ]
    },
    "part_8": {
        message: "[not in the game yet]",
        choices: [
            { label: "", goto: "end" },
            { label: "", goto: "end" },
        ]
    },
    "end": {
        message: "The End",
        choices: [
            { label: "Restart", goto: "part_1" },
        ]
    },

}

