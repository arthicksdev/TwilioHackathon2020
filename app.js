var express = require("express");
var http = require("http");
require('dotenv').config();

var bodyParser = require('body-parser')
var app = express()
var subscribers = [];
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

app.post('/incoming/voice', function (req, res) {

    var roomname = process.env.roomname;
    var from = req["from"];
    var MessagingResponse = require('twilio').twiml.MessagingResponse;
    var messagingResponse = new MessagingResponse();

    var VoiceResponse = require('twilio').twiml.VoiceResponse;
    var response = new VoiceResponse();
    var name = "";
    var match = subscribers.filter(m => { return m.mobilephone == from });
    if (match.length > 0) {
        name = match[0].name;
    }



    response.say(
        {
            voice: 'woman',
            language: 'en',
        },
        `Welcome to Art Hicks Dev ${name}. You will be connected shortly.`
    );
    const dial = response.dial();
    dial.conference(roomname);

    response.say('Goodbye');






    res.set('Content-Type', 'text/xml')
    res.send(response.toString());

});
// POST method route
app.post('/api/v1/join', function (req, res) {

    console.log("Recieved data:", req.body);
    // console.log(req.body);
    var data = req.body;
    var recieved = {
        result: "Success",
        message: "awesome"

    }
    var match = subscribers.filter(m => { return m.mobilephone == data.mobilephone });
    if (match.length == 0) {
        subscribers.push(data);
    }

    var message = `Hello ${data.name}! Thank you for joining ArtHicksDev. We will be calling your shortly.`;
    sendText(data.mobilephone, message).then(msid => {

        //Store SID in database with number to track status
        recieved.sid = msid;
        //Wait 10 seconds before calling
        setTimeout(() => {
            joinConference(data.mobilephone);
        }, 10000);


        res.json(recieved);

    }, (err) => {

        //serror sending
        recieved.sid = "error sending";
        res.json(recieved);

    })


    // res.send('POST request to the homepage')
})


app.listen(port, () => {

    console.log(`Listening to server on port ${port}.`)

});


var sendText = (to_mobilenumber, sms) => {
    return new Promise((resolve, reject) => {
        const accountSid = process.env.accountSid;
        const authToken = process.env.authToken;
        const client = require('twilio')(accountSid, authToken);
        console.log("sending with:", accountSid, authToken);
        client.messages
            .create({
                body: sms,
                from: process.env.number,
                to: to_mobilenumber
            })
            .then(message => {
                //Return sid for message tracking
                resolve(message.sid)
                console.log(message.sid)
            }, (err) => {
                console.log("Error Sending", err);
                retject(err);

            });
    })

}


var joinConference = (callToNumber) => {

    var incomingUrl = process.env.incomingvoiceurl;
    var PlatformNumber = process.env.number;
    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    const client = require('twilio')(accountSid, authToken);
    console.log("calling with:", accountSid, authToken);
    console.log("Incoming Voice url:", incomingUrl);
    client.calls
        .create({

            to: callToNumber,
            from: PlatformNumber,
            url: incomingUrl,
        })
        .then(call => {
            console.log("Call SID:", call.sid)
        }, err => {

            console.log("error calling:", err)

        });

}

