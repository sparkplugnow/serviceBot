var Botkit = require('botkit');
//var os = require('os');
//var komponist = require('komponist');
//var request = require('request');
//var sys = require('sys')
//var exec = require('child_process').exec;
var Token = require('./token.js');


const playlistStore = [];

// Connect to slack

var controller = Botkit.slackbot({
  debug: false,
});

var bot = controller.spawn({
  token: Token.token
}).startRTM(function (err, bot, payload) {
  if (err) {
    console.log(err);
    throw new Error('Could not connect to slack');
  }
});


//var client = komponist.createConnection(6600, 'localhost', function () {
//console.log('client created')
//});


//a sample knowledgebaseObject that should persist on a DB come from DB per customer

var knowledgebaseObject = {

  customerName: 'Comfort Chefs',
  helpKeyword: 'help',
  customerID: 12631616216321,
  address: '16 Brookers Lane',
  optionList: '\n 1. Give Feedback \n 2. Frequently asked questions (FAQs)  \n 3. Contact Information \n 4. Services \n 5. Talk to Someone',
  welcomeMessage: function (name) {

    return "Hi " + name + ", my name is Funke, I'm a bot, Welcome to " + this.customerName + " You can say '" + this.helpKeyword + "' anytime to get a list of things I can assist you with."

  },

  menuObject: {

    Feedback: {},

    hoursOfOperation: ['Weekdays: 10am - 7pm | Weekends: 11am - 8pm'],
    faq: [

      {
        question: 'What time is  faq',
        answer: ' Sample answer'
      },

      {
        question: 'Sample faq',
        answer: ' Sample answer'
      }
    ],
    contactInformation: {},

    services: ['service1', 'service 2', 'service 3']
  }
};




controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {


  // start a conversation to handle this response.
  bot.startConversation(message, function (err, convo) {

    convo.addQuestion('Hi!, What is your name?', function (response, convo) {

      convo.say('Cool, you said: ' + response.text);
      convo.say(knowledgebaseObject.welcomeMessage(response.text));
      convo.say(knowledgebaseObject.menuObject)

      convo.next();

    }, {}, 'default');

    // convo.say(knowledgebaseObject.welcomeMessage);
    // convo.say(knowledgebaseObject.welcomeMessage);

  })

});


controller.hears('help', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {

  bot.startConversation(message, function (err, convo) {

    convo.addQuestion(knowledgebaseObject.optionList, function (response, convo) {
      convo.say('you picked ' + response.text);

      selectOption();

    })
  })

});


var selectOption = function () {
  switch (response.text) {
    //feedback option
    case '1': bot.reply(message, 'Enter your feedback here please');
      break;
    //faq action
    case '2': bot.reply(message, faq());
      break;
    //contact information action
    case '3': bot.reply(message, 'contact information action here');
      break;
    //service action
    case '4': bot.reply(message, service());
      break;
    //call action
    case '5': bot.reply(message, 'call action here');
      break;
    //Default action
    default: bot.reply(message, 'pick correct option');
  }
}
//functional units

//list out faqs
var faq = function () {
  var faqs = (knowledgebaseObject.menuObject.faq).map(function (faq) {
    var list = (faq.question);
    return list;
  }).forEach(function (faq, idx) {
    console.log(idx + 1, ':', faq)
  })
}

//list out services
var service = function () {
  var services = (knowledgebaseObject.menuObject.services).forEach(function (service, idx) {
    console.log(idx + 1, ':', service)
  })
}

  /*controller.hears('list', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {

    str = message.text;
    client.playlist(function (err, info) {

      info = info.toString();

      var reply_with_attachments = {

        'attachments': [
          {
            'fallback': 'List of songs in Playlist',
            'title': 'Playlist',
            'text': info,
            "fields": [
              {
                "Song 1": 'test',

                "short": false
              }


            ],

            'color': '#7CD197'
          }
        ],
        'icon_url': 'http://southpawgroup.com/gidiloungeart/images/albums_thumbnail/Untitled.jpg'
      }


      bot.reply(message, reply_with_attachments);


    })




  })*/

