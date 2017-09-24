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
        question: 'What time are you open',
        answer: ' Sample answer'
      },
      {
        question: 'When will Donald Trump leave office',
        answer: ' Sample answer'
      },
      {
        question: 'What is the best kitchen in the world',
        answer: ' Sample answer'
      },

      {
        question: 'how do i order food',
        answer: ' Sample answer'
      },
      {
        question: 'ETC... ETC...',
        answer: ' Sample answer'
      }
    ],
    contactInformation: {},

    services: ['Cooking', 'Catering','Broiling']
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

      //selectOption();
      switch (response.text) {
        //feedback option
        case '1': bot.reply(message, 'Enter your feedback here please');
          break;
        //faq action
        case '2': bot.reply(message, faq());
          break;
        //contact information action
        case '3': bot.reply(message, 'getting contact information ');
          break;
        //service action
        case '4': bot.reply(message,'we offer the following services \n'+ service());
          break;
        //call action
        case '5': bot.reply(message, 'Hold on a bit, putting your call through.....');
          break;
        //Default action
        default: bot.reply(message, 'kindly pick correct option');
      }


    })
  })

});




//FUNCTIONAL UNITS

//list out faqs
var faq = function () {
  var faqs = (knowledgebaseObject.menuObject.faq).map(function (faq, idx) {
    var list = (idx + 1, ':', faq.question);
    return list
  }).join('\n');
  return faqs;
}

//list out services
var service = function () {
  var services = (knowledgebaseObject.menuObject.services).map(function (service, idx) {
    return (idx + 1, ':', service)
  }).join('\n');
  return services;
}