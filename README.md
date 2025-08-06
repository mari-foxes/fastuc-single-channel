# fastuc-single-channel
A utility selfbot designed for yggdrasil.fun that provides automated features and convenience commands.

>### Warning!
>I'm not responsible for you getting banned if you plan to use this.     
>Never use your main account.

# Features 
The bot includes several automated features:    
- autophone - Automatically calls back if a call gets hung up
- autorepeat - Waits for cooldown to end and repeats the last command
- autoresponse - Automatically responds to certain messages based on predefined keywords
- autowelcome - Automatically greets people when a call starts
- regexfilter - Filters usernames using regex patterns and hangs up calls if username doesn't match

## Filtering
You can do ``+regexfilter REGEX_HERE`` to switch to a different regex.      


The current regex ``/^(?=.{6,256}$)[a-zA-Z_.-]+$/`` filter's usernames with numbers in their username, and usernames that are below 6 letters.

# How to setup?
Clone this repository, then install the required packages via ``yarn``.    
Then edit the .env file with your: 
- your's discord token
- the allowed channel ID where the selfbot will only work in
- the allowed guild ID where the selfbot will only work in
- the yggdrasil's bot ID

Finally, run the main.js script via ``node``.
