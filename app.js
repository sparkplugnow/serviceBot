var Botkit = require('botkit');
var os = require('os');
var komponist = require('komponist');
var request = require('request');
var sys = require('sys')
var exec = require('child_process').exec;
var token = require('./token.js');


const playlistStore = []

// Connect to slack

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
     token: token.sparkplug
}).startRTM(function(err, bot, payload){
	if(err) {
		console.log(err);
		throw new Error('Could not connect to slack');
	}
});


    var client = komponist.createConnection(6600, 'localhost', function() {
        console.log('client created')
    });


//a sample knowledgebaseObject supposed to come from DB per customer

var knowledgebaseObject = {

  customerName: 'Comfort Chefs',
  customerID: 12631616216321,
  address: '16 Brookers Lane',
  welcomeMessage: "Hi, my name is Funke, I'm a bot, Welcome to Comfort Chefs! You can say 'help' anytime to get a list of things I can assist you with.",
  menuObject: {


  },

  hoursOfOperation: [ 'Weekdays: 10am - 7pm | Weekends: 11am - 8pm'],
  faq: [

      {
        question: 'Sample faq',
        answer: ' Sample answer'
      },

       {
        question: 'Sample faq',
        answer: ' Sample answer'
      }
  ]
}



controller.hears('help', ['direct_message','direct_mention','mention'],function(bot,message) {

var optionList = '\n 1. Give Feedback \n 2. Contact Information \n 3. Services \n 4. Talk to Someone';



 // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('Pick an option  '+ optionList,[
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say('1. Give Feedback');
          convo.next();
        }
      },
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say('Great! I will continue...');
          // do something else...
          convo.next();

        }
      },
      {
        pattern: bot.utterances.no,
        callback: function(response,convo) {
          convo.say('Perhaps later.');
          // do something else...
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.repeat();
          convo.next();
        }
      }
    ],{},'default');

  })


});







controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {


       // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('What is your name', function(response,convo) {

      // convo.say('Cool, you said: ' + response.text);
      convo.say(knowledgebaseObject.welcomeMessage);
      convo.next();

    },{},'default');

    // convo.say(knowledgebaseObject.welcomeMessage);
    // convo.say(knowledgebaseObject.welcomeMessage);


  })




     






    //   client.currentsong(function(err, info) {
    //         console.log(info.Artist); 
    //         console.log(info.Title);  
    //         console.log(info.Album);  
    //         var nowPlaying = info.file
    //         nowPlaying = nowPlaying.replace(/.mp3/g, '');
    //         var reply_with_attachments = {
 
    // 'attachments': [
    //   {
    //     'fallback': 'Now Playing attachments',
    //     'title': 'Now Playing' + '\n' + 'Stream link - http://158.85.113.45:7500',
        
    //       "fields": [
    //             {
    //                 "title": nowPlaying,
                
    //                 "short": false
    //             }
    //         ],
        
    //     'color': '#7CD197'
    //   }
    // ],
    // 'icon_url': 'http://southpawgroup.com/gidiloungeart/images/albums_thumbnail/Untitled.jpg'
    // }
          // });

// MPD playlist
 //        client.playlist(function(err, info) {
 //          console.log(info)
 //        })

});


//search youtube
//search request
controller.hears('search',['direct_message', 'direct_mention', 'mention'], function(bot, message) {

var str = message.text;

//remove search keyword
var newStr = str.replace(/search/i, '');

//remove whitespace
newStr = newStr.replace(/ /i,'');
console.log(newStr);

var bashCommand = './runyoutube.sh ' + '\'' + newStr + '\'';

dir = exec(bashCommand, function(err, stdout, stderr) {
  if (err) {
    // should have err.code here?  
  }
  //bot.reply(message, stdout )
  console.log(stdout);
});

dir.on('exit', function (code) {
  // exit code is code
  bot.reply(message, 'Song Added to Queue' )
});


//bot.reply(message, newStr )

  
  var sendSearch = function(searchterm){

            var options = {

              url: 'http://gplayer.herokuapp.com/api/search?q='+searchterm,
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',                  
            }
          }
            console.log('making network request')  
 }
})




controller.hears('list',['direct_message', 'direct_mention', 'mention'], function(bot, message) {

   str = message.text;
    client.playlist(function(err, info){

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




})

