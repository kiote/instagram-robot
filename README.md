# instagram-robot

Automate some instagram tasks

Run in with

```
USERNAME=your_instagram_username PASSWORD=your_instagram_password TAGREGT=target_user_name node server.js
```

## Functions

### 1. Autolike

It will like all your target's posts

## How to deploy on Heroku

1. Create new app [here](https://dashboard.heroku.com/new?org=personal-apps)

2. Fork this repo

3. Choose "deployment method" = "Github" and type the name of your fork.

4. Choose manual deploy -> deploy branch

5. Wait for the message "Your app was successfully deployed."

6. Go to "resources" tab and switch off the web interface dyno (you don't need it here)

7. In addons field type "scheduler" and choose Heroku scheduler addon, click "provision" button

8. Click on that addon appeared on resources tab.

9. Click "add new job" and fill the field with `USERNAME=your_instagram_username PASSWORD=your_instagram_password TARGET=your_target_to_like_username node server.js`

10. Click save.

11. Done! With this default setting your target account will be checked every day and likes will appear on new posts!
