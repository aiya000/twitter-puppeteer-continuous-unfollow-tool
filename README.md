# twitter-puppeteer-continuous-unfollow-tool

This is a simple tool that uses Puppeteer to unfollow users who doesn't follow you on Twitter (X).
It is designed to be run continuously, so that you can unfollow users as they unfollow you,
WITHOUT Twitter API.

# How to use

1. Run `$ USERNAME=your_twitter_id npm run save-config` to make a config file of this app
1. Run `npm run save-leaders` to make a cache of users list who doesn't follow you
