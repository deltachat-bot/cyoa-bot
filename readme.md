# Choose Your Own Adventure Story Bot

## Configuration:

create a json file with the name `.cyoa-dcrc` (no extra filename extention):
```json
{
    "email_address": "email",
    "email_password": "password"
}
```

## How to run the bot:

You need `nodejs` and `rustup` installed.
Install dependencies:
```sh
npm i
```

run the bot:
__todo__ document configuration (env vars)
```sh
npm run start
```


## links
https://www.npmjs.com/package/sqlite3
https://www.npmjs.com/package/deltachat-node


## wish list:

- Delay ( what about continue after bot crash if delay didn't fire)
- Random choices in choices
- save story as json with a json scheme?


## next project advanced imersive bot
- Multiple accounts (that bot uses to simulate different persons)
- text parsing to unstand player intention from?