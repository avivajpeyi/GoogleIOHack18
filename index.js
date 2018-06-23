'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// WELCOME INTENTS

app.intent('Make_Profile', (conv) => {
    conv.ask(`<speak> Ok! I’m Gee! What's your name?</speak>`);
});


app.intent('Get_Name', (conv, {name}) => {
    conv.user.storage.name = name
    conv.ask(name+"! Thats a cool name! Could I ask you for your pronouns, "+name+"?");
});

app.intent('Get_Pronouns', (conv, {pronouns}) => {
    conv.user.storage.pronouns = pronouns
    const name = conv.user.storage.name
    conv.ask("Gotcha! I'll keep that in mind! So "+name+", can you tell something you like?");
});


app.intent('Get_User_Like', (conv, {any}) => {
    const name = conv.user.storage.name
    conv.user.storage.like = any
    conv.ask("Cool! I also like "+any+", !  Can you tell me one thing you dont like??");
});

app.intent('Get_User_Dislike', (conv, {any}) => {
    const name = conv.user.storage.name
    conv.user.storage.dislike = any
    conv.ask("I see! Okay, "+name+", How old are you?");
});

app.intent('Get_Age', (conv, {age}) => {
    const name = conv.user.storage.name
    conv.user.storage.age = age
    conv.ask("Cool! Thanks! Last thing -- can I keep track of your location?");
});


app.intent('Get_Age - yes', (conv, {any}) => {
    const name = conv.user.storage.name
    conv.user.storage.location_permission = any
    conv.ask("Awesome! Let me know if you want to tell me more about yourself, or if you to want to make a friend!");
});

app.intent('Get_user_activity', (conv, {any}) => {
    const name = conv.user.storage.name
    conv.ask("Ok! Victor, Mike and Sally are nearby and also want to "+any+". Would you like to know more about one of them?");
});



/////

var matches = [
    {"name":"Victor", "age":19,"interest":"Dancing", "pronouns":"he"},
    {"name":"Mike", "age":22,"interest":"Basketball", "pronouns":"he"},
    {"name":"Sally", "age":32,"interest":"eating", "pronouns":"she"}
]

app.intent('describeMatch', (conv, {name}) => {
    var answer;
    var found = -1;
    var i;
    for (i = 0; i < matches.length; i++) {
        if (matches[i].name == name)
            found = i;
    }

    if (i == -1)
    {
        var nearby_people = ""
        for (i = 0; i < matches.length; i++) {
            nearby_people = matches.name + ","
        }

        answer = "Sorry,  " + name + " isnt nearby. However," +nearby_people+" are nearby! Would you like to know about any of them?"

    }
    else
    {
        var n = matches[found].name;
        var pronoun = matches[found].pronouns;
        var interest = matches[found].interest;
        var age = matches[found].age;
        answer = n +" is "+age +" and "+pronoun +" likes "+interest+". Do you want to message him?";
    }
    conv.ask(answer);
})



///



// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
