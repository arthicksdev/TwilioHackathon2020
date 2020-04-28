# TwilioHackathon2020
I have baked up a solution written Node that allows the ability to 
give your name and phone number, recieive a confirmation notification, then 
call the subscriber into a custom conference room.

The .env file has been ignored as of course, so listed below are a few of your required setting to get this application up and running for yourself.

Enjoy!
~ArtHicksDev


###.env File Configuration
PORT=8080
number=[Your Twilio Number]
accountSid=[Twilio Account ID]
authToken=[Twilio Auth Token]
roomname=[Name of Default Room]
incomingvoiceurl=[Your Application End Point ("[https://www.exmple.com]/incoming/voice")]
