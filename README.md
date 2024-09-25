# twitter-puppeteer-continuous-unfollow-tool

This is a simple tool that uses Puppeteer to unfollow users who doesn't follow you on Twitter (X).
It is designed to be run continuously, so that you can unfollow users as they unfollow you,
WITHOUT Twitter API.

# NOTE

Currently accounts without 2FA are not supported,
because development is difficult by Twitter spam filtering.

Please setup your account with 2FA to use this app.

I am waiting for your PR `:D`

# How to use

Only first

1. Run `$ cp .env.example .env` and input your information
    - Please be careful. Don't share this config
1. Run `$ npm run run -- login` and login manually
    - If you are using 2FA, run `$ npm run run -- login --2fa=123456` with your 2FA code
1. Run `$ npm run run -- save-leaders` to make a cache of users list who doesn't follow you

Run when you want to unfollow users

1. Run `$ npm run run -- unfollow` to unfollow that leader users
    - Only unfollow 10th users at once, because Twitter suggest to ban you if you unfollow too many users at once
    - Save a count number that far you've unfollowed automatically
        - On the next `$ npm run run -- unfollow` running, it will unfollow users from the count number
