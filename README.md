# twitter-puppeteer-continuous-unfollow-tool

This is a simple tool that uses Puppeteer to unfollow users who doesn't follow you on Twitter (X).
It is designed to be run continuously, so that you can unfollow users as they unfollow you,
WITHOUT Twitter API.

# How to use

Only first

1. Run `$ npm run make-config --username=your_twitter_id` to make a config file of this app
1. Run `$ npm run save-leaders` to make a cache of users list who doesn't follow you

Run when you want to unfollow users

1. Run `$ npm run unfollow` to unfollow that leader users
    - Only unfollow 10th users at once, because Twitter suggest to ban you if you unfollow too many users at once
    - Save a count number that far you've unfollowed automatically
        - On the next `$ npm run unfollow` running, it will unfollow users from the count number
