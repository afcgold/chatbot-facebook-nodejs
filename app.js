'use strict';

var path = require('path');
const apiai = require('apiai');
const config = require('./config');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const uuid = require('uuid');
const cards = require('./cards');
const async = require("async");


// Messenger API parameters
if (!config.FB_PAGE_TOKEN) {
	throw new Error('missing FB_PAGE_TOKEN');
}
if (!config.FB_VERIFY_TOKEN) {
	throw new Error('missing FB_VERIFY_TOKEN');
}
if (!config.API_AI_CLIENT_ACCESS_TOKEN) {
	throw new Error('missing API_AI_CLIENT_ACCESS_TOKEN');
}
if (!config.FB_APP_SECRET) {
	throw new Error('missing FB_APP_SECRET');
}
if (!config.SERVER_URL) { //used for ink to static files
	throw new Error('missing SERVER_URL');
}


app.set('port', (process.env.PORT || 5000))

//verify request came from facebook
app.use(bodyParser.json({
	verify: verifyRequestSignature
}));

//serve static files in the public directory
app.use(express.static('public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())


const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
	language: "en",
	requestSource: "fb"
});
const sessionIds = new Map();

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I\'m working!!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	console.log("request");
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
})

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook/', function (req, res) {
	var data = req.body;
	console.log(JSON.stringify(data));
  
    

	// Make sure this is a page subscription
	if (data.object == 'page') {
		// Iterate over each entry
		// There may be multiple if batched
		data.entry.forEach(function (pageEntry) {
			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;

			// Iterate over each messaging event
			pageEntry.messaging.forEach(function (messagingEvent) {
				if (messagingEvent.optin) {
					receivedAuthentication(messagingEvent);
				} else if (messagingEvent.message) {
					receivedMessage(messagingEvent);
				} else if (messagingEvent.delivery) {
					receivedDeliveryConfirmation(messagingEvent);
				} else if (messagingEvent.postback) {
					receivedPostback(messagingEvent);
				} else if (messagingEvent.read) {
					receivedMessageRead(messagingEvent);
				} else if (messagingEvent.account_linking) {
					receivedAccountLink(messagingEvent);
				} else {
					console.log("Webhook received unknown messagingEvent: ", messagingEvent);
				}
			});
		});

		// Assume all went well.
		// You must send back a 200, within 20 seconds
		res.sendStatus(200);
	}
});

function receivedMessage(event) {

	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	if (!sessionIds.has(senderID)) {
		sessionIds.set(senderID, uuid.v1());
	}
	//console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
	//console.log(JSON.stringify(message));

	var isEcho = message.is_echo;
	var messageId = message.mid;
	var appId = message.app_id;
	var metadata = message.metadata;

	// You may get a text or attachment but not both
	var messageText = message.text;
	var messageAttachments = message.attachments;
	var quickReply = message.quick_reply;

	if (isEcho) {
		handleEcho(messageId, appId, metadata);
		return;
	} else if (quickReply) {
		handleQuickReply(senderID, quickReply, messageId);
		return;
	}


	if (messageText) {
		//send message to api.ai
		sendToApiAi(senderID, messageText);
	} else if (messageAttachments) {
		handleMessageAttachments(messageAttachments, senderID);
	}
}


function handleMessageAttachments(messageAttachments, senderID){
	//for now just reply
	sendTextMessage(senderID, "Attachment received. Thank you.");	
}

function handleQuickReply(senderID, quickReply, messageId) {
	var quickReplyPayload = quickReply.payload;
	console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
	//send payload to api.ai
	sendToApiAi(senderID, quickReplyPayload);
}

//https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo
function handleEcho(messageId, appId, metadata) {
	// Just logging message echoes to console
	console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
}

var player, dealer, shoe;
function handleApiAiAction(sender, action, responseText, contexts, parameters) {
	
  switch (action) {
          
      case "newGame" :
     
          var arrayQueue = []; //my result is a array

      
      
          //FUNCTION 1
          shoe = cards.newGame();

          player = new cards.Player("George");
          player.hand = shoe.deal(player,2);
          player.score = cards.score(player.hand);

          dealer = new cards.Player("Dealer");
          dealer.hand = shoe.deal(dealer,2);
          dealer.dealer = true;
          dealer.score = cards.score(dealer.hand);
          var dealerCardOne = cards.score([dealer.hand[0]]);

          //FUNCTION 2
          var message1 = "You've been dealt"+ cards.displayHand(player.hand).toString()+". Giving you a score of "+player.score.toString();
          arrayQueue.push(message1);

          //          sendTextMessage(sender, "You've been dealt"+ cards.displayHand(player.hand).toString()+". Giving you a score of "+player.score.toString());
        
//        var playerImageURL = cards.requestImage(player.hand);
//      
//        sendImageMessage(sender,playerImageURL);
        
          //FUNCTION 3
          var message2 = "The dealer's first card is" + cards.displayHand([dealer.hand[0]]).toString()+". Giving a score of "+dealerCardOne.toString();
          arrayQueue.push(message2);
          //          sendTextMessage(sender, "The dealer's first card is" + cards.displayHand([dealer.hand[0]]).toString()+". Giving a score of "+dealerCardOne.toString());

//        var dealerImageURL = cards.requestImage(dealer.hand);
//      
//        sendImageMessage(sender,dealerImageURL);
      
//        var handValue = cards.score(player.hand)
       
         //FUNCTION 4
        if (dealer.score < 21 && player.score < 21){
          
          var message205 = "Choose your next move:";
          arrayQueue.push(message205);
          
          var message2075 = hitStandButton(player.score, dealerCardOne);
          arrayQueue.push(message2075);

        } else if (player.score === "BLACKJACK" || player.score === 21){
          
          var message3 = "The Dealer's hidden card was"+cards.displayHand([dealer.hand[1]]).toString();
          arrayQueue.push(message3);

//          sendTextMessage(sender, "The Dealer's hidden card was"+cards.displayHand([dealer.hand[1]]).toString());
          if (dealer.score < 21 && dealer.score !== "Blackjack"){
            var message4 = "YOU WIN!!😎💰";
          arrayQueue.push(message4);
//            sendTextMessage(sender, "YOU WIN!!😎💰");
          } else if (dealer.score === "BLACKJACK"){
            var message5 = "It's a draw! 😑";
          arrayQueue.push(message5);
            sendTextMessage(senderID, "It's a draw! 😑");
          } 
        } else if (dealer.score === "BLACKJACK" || dealer.score === 21){
          var message6 = "The Dealer's hidden card was "+cards.displayHand([dealer.hand[1]]).toString();
          arrayQueue.push(message6);
//          sendTextMessage(sender, "The Dealer's hidden card was "+cards.displayHand([dealer.hand[1]]).toString());
          var message7 = "The Dealer had blackjack 😡. Dealer wins. 😭";
          arrayQueue.push(message7);
//          sendTextMessage(sender, "The Dealer had blackjack 😡. Dealer wins. 😭");
        }
      
                  sendTextMessages(sender, arrayQueue, 0); //OK. It works for me :)

        return shoe;
                
        break;
        
      default:
		//unhandled action, just send back the text
		sendTextMessage(sender, responseText);
	}
}


function sendTextMessages(sender, text, i) {
    if (i < text.length) {
      if (text[i] === String) {
              request({
                  url: 'https://graph.facebook.com/v2.6/me/messages',
                  qs: {access_token:config.FB_PAGE_TOKEN},
                  method: 'POST',
                  json: {
                      recipient: {id:sender},
                      message: {text:text[i]},
                  }
              }, function(error, response, body) {
                  if (error) {
                      console.log('Error sending messages: ', error)
                  } else if (response.body.error) {
                      console.log('Error: ', response.body.error)
                  }
                  sendTextMessages(sender, text, i+1)
              })
            }
        } else return
}
        
//      } else if (text[i] instanceof String ){
//        
//        request({
//            url: 'https://graph.facebook.com/v2.6/me/messages',
//            qs: {access_token:config.FB_PAGE_TOKEN},
//            method: 'POST',
//            json: {
//                recipient: {id:sender},
//                message: {attachment: {
//				type: "template",
//				payload: {
//					template_type: "button",
//					text: "Choose your next move:",
//					buttons: text[i]}
//                },
//            }
//            }
//        }, function(error, response, body) {
//            if (error) {
//                console.log('Error sending messages: ', error)
//            } else if (response.body.error) {
//                console.log('Error: ', response.body.error)
//            }
//            sendTextMessages(sender, text, i+1)
//        })
//      } else return
//      }
//}

function hitStandButton (score,dealerscore){
  
  if (score < 21 && score > dealerscore){
                var buttons = [
              {
                "type":"postback",
                "title":"Hit ☝️",
                "payload":"hit"
              },
              {
              "type":"postback",
              "title":"Stand ✋",
              "payload":"stand"
              }
            ];
      
    return buttons;
//      sendButtonMessage(sender,"Choose your next move:", buttons);
    
  } else {
    
     var buttons = [
              {
                "type":"postback",
              "title":"Stand ✋",
              "payload":"stand"
              },
       ];
    
        return buttons;

    
//      sendButtonMessage(sender,"Choose your next move:", buttons);
  }
  
}

function handleMessage(message, sender) {
	switch (message.type) {
		case 0: //text
			sendTextMessage(sender, message.speech);
			break;
		case 2: //quick replies
			let replies = [];
			for (var b = 0; b < message.replies.length; b++) {
				let reply =
				{
					"content_type": "text",
					"title": message.replies[b],
					"payload": message.replies[b]
				}
				replies.push(reply);
			}
			sendQuickReply(sender, message.title, replies);
			break;
		case 3: //image
			sendImageMessage(sender, message.imageUrl);
			break;
		case 4:
			// custom payload
			var messageData = {
				recipient: {
					id: sender
				},
				message: message.payload.facebook

			};

			callSendAPI(messageData);

			break;
	}
}


function handleCardMessages(messages, sender) {

	let elements = [];
	for (var m = 0; m < messages.length; m++) {
		let message = messages[m];
		let buttons = [];
		for (var b = 0; b < message.buttons.length; b++) {
			let isLink = (message.buttons[b].postback.substring(0, 4) === 'http');
			let button;
			if (isLink) {
				button = {
					"type": "web_url",
					"title": message.buttons[b].text,
					"url": message.buttons[b].postback
				}
			} else {
				button = {
					"type": "postback",
					"title": message.buttons[b].text,
					"payload": message.buttons[b].postback
				}
			}
			buttons.push(button);
		}


		let element = {
			"title": message.title,
			"image_url":message.imageUrl,
			"subtitle": message.subtitle,
			"buttons": buttons
		};
		elements.push(element);
	}
	sendGenericMessage(sender, elements);
}


function handleApiAiResponse(sender, response) {
	let responseText = response.result.fulfillment.speech;
	let responseData = response.result.fulfillment.data;
	let messages = response.result.fulfillment.messages;
	let action = response.result.action;
	let contexts = response.result.contexts;
	let parameters = response.result.parameters;

	sendTypingOff(sender);

	if (isDefined(messages) && (messages.length == 1 && messages[0].type != 0 || messages.length > 1)) {
		let timeoutInterval = 1100;
		let previousType ;
		let cardTypes = [];
		let timeout = 0;
		for (var i = 0; i < messages.length; i++) {

			if ( messages[i].type == 1 ) {
				cardTypes.push(messages[i]);
			} else if ( previousType == 1 && messages[i].type != 1 ) {
				timeout = (i - 1) * timeoutInterval;
				setTimeout(handleCardMessages.bind(null, cardTypes, sender), timeout);
				cardTypes = [];
				timeout = i * timeoutInterval;
				setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
			} else {
				timeout = i * timeoutInterval;
				setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
			}

			previousType = messages[i].type;

		}
	} else if (responseText == '' && !isDefined(action)) {
		//api ai could not evaluate input.
		console.log('Unknown query' + response.result.resolvedQuery);
		sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");
	} else if (isDefined(action)) {
		handleApiAiAction(sender, action, responseText, contexts, parameters);
	} else if (isDefined(responseData) && isDefined(responseData.facebook)) {
		try {
			console.log('Response as formatted message' + responseData.facebook);
			sendTextMessage(sender, responseData.facebook);
		} catch (err) {
			sendTextMessage(sender, err.message);
		}
	} else if (isDefined(responseText)) {

		sendTextMessage(sender, responseText);
	}
}

function sendToApiAi(sender, text) {

	sendTypingOn(sender);
	let apiaiRequest = apiAiService.textRequest(text, {
		sessionId: sessionIds.get(sender)
	});

	apiaiRequest.on('response', (response) => {
		if (isDefined(response.result)) {
			handleApiAiResponse(sender, response);
		}
	});

	apiaiRequest.on('error', (error) => console.error(error));
	apiaiRequest.end();
}




function sendTextMessage(recipientId, text) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: text
		}
	}
	callSendAPI(messageData);
}

/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId, imageUrl) {
  
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					url: imageUrl
				}
			}
		}
	};
  

	callSendAPI(messageData);
}

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					url: config.SERVER_URL + "/assets/instagram_logo.gif"
				}
			}
		}
	};

	callSendAPI(messageData);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "audio",
				payload: {
					url: config.SERVER_URL + "/assets/sample.mp3"
				}
			}
		}
	};

	callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 * example videoName: "/assets/allofus480.mov"
 */
function sendVideoMessage(recipientId, videoName) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "video",
				payload: {
					url: config.SERVER_URL + videoName
				}
			}
		}
	};

	callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 * example fileName: fileName"/assets/test.txt"
 */
function sendFileMessage(recipientId, fileName) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "file",
				payload: {
					url: config.SERVER_URL + fileName
				}
			}
		}
	};

	callSendAPI(messageData);
}



/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, text, buttons) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: text,
					buttons: buttons
				}
			}
		}
	};

	callSendAPI(messageData);
}


function sendGenericMessage(recipientId, elements) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: elements
				}
			}
		}
	};

	callSendAPI(messageData);
}


function sendReceiptMessage(recipientId, recipient_name, currency, payment_method,
							timestamp, elements, address, summary, adjustments) {
	// Generate a random receipt ID as the API requires a unique ID
	var receiptId = "order" + Math.floor(Math.random() * 1000);

	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "receipt",
					recipient_name: recipient_name,
					order_number: receiptId,
					currency: currency,
					payment_method: payment_method,
					timestamp: timestamp,
					elements: elements,
					address: address,
					summary: summary,
					adjustments: adjustments
				}
			}
		}
	};

	callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId, text, replies, metadata) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: text,
			metadata: isDefined(metadata)?metadata:'',
			quick_replies: replies
		}
	};

	callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {

	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "mark_seen"
	};

	callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {


	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_on"
	};

	callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {


	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_off"
	};

	callSendAPI(messageData);
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: "Welcome. Link your account.",
					buttons: [{
						type: "account_link",
						url: config.SERVER_URL + "/authorize"
          }]
				}
			}
		}
	};

	callSendAPI(messageData);
}


function greetUserText(userId) {
	//first read user firstname
	request({
		uri: 'https://graph.facebook.com/v2.7/' + userId,
		qs: {
			access_token: config.FB_PAGE_TOKEN
		}

	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var user = JSON.parse(body);

			if (user.first_name) {
				console.log("FB user: %s %s, %s",
					user.first_name, user.last_name, user.gender);

				sendTextMessage(userId, "Welcome " + user.first_name + '!');
			} else {
				console.log("Cannot get data for fb user with id",
					userId);
			}
		} else {
			console.error(response.error);
		}

	});
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: config.FB_PAGE_TOKEN
		},
		method: 'POST',
		json: messageData

	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var recipientId = body.recipient_id;
			var messageId = body.message_id;

			if (messageId) {
				console.log("Successfully sent message with id %s to recipient %s",
					messageId, recipientId);
              //here?
			} else {
				console.log("Successfully called Send API for recipient %s",
					recipientId);
			}
		} else {
			console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
		}
	});
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
function receivedPostback(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfPostback = event.timestamp;

	// The 'payload' param is a developer-defined field which is set in a postback 
	// button for Structured Messages. 
	var payload = event.postback.payload;

	switch (payload) {
        
        //need to look at this tomorrow
      case "hit":
        
        var arrayQueue = []; //my result is a array

        if (dealer.hand.length < 2 ){
          
//                    shoe.deal(dealer,1);
                    shoe.deal(player,1);

                    dealer.score = cards.score(dealer.hand);
                    player.score = cards.score(player.hand);


                    if (dealer.hand.length === 2){

                      if (player.score < 21){
                        
                        var message1 =  "The dealer's hole card was:" + cards.displayHand([dealer.hand[1]]).toString()+", so his score is now "+dealer.score.toString();
                        arrayQueue.push(message1);
//                        sendTextMessage(senderID, "The dealer's hole card was:" + cards.displayHand([dealer.hand[1]]).toString()+", so his score is now "+dealer.score.toString());

                        if (cards.below17(dealer.hand)=== false){
                          
                            var message2 = "The dealer has decided to stand!";
                            arrayQueue.push(message2);
//                            sendTextMessage(senderID, "The dealer has decided to stand!");
                        }
                        
                      }
                    
                          var message3 = "Your hand is now" + cards.displayHand(player.hand).toString()+", with a combined score of "+player.score.toString() + "!";
                          arrayQueue.push(message3);
                        
//                        sendTextMessage(senderID, "Your hand is now" + cards.displayHand(player.hand).toString()+", with a combined score of "+player.score.toString() + "!"); 
                    }

                    if (player.score <= 21){

                      hitStandButton(senderID, player.score, dealer.score);

                    } else if (player.score > 21){
                      player.busted === true;
                      
                      var message4 = "Dealer wins. 😭";
                      arrayQueue.push(message4);
//                      sendTextMessage(senderID, "Dealer wins. 😭")

                    }
        } else {
                    
                shoe.deal(player,1);

                player.score = cards.score(player.hand);

          
                var message5 = "Now you've got" + cards.displayHand(player.hand).toString()+", with a combined score of "+player.score.toString() + "!";
                arrayQueue.push(message5);
//                sendTextMessage(senderID, "Now you've got" + cards.displayHand(player.hand).toString()+", with a combined score of "+player.score.toString() + "!"); 

                if (player.score < 21){

                  hitStandButton(senderID, player.score, dealer.score);

                } else if (player.score > 21){
                  
                  var message6 = "Dealer wins. 😭";
                  arrayQueue.push(message6);
//                  sendTextMessage(senderID, "Dealer wins. 😭")
                  
                } else if (player.score === 21){
                  
                  hitStandButton(senderID, player.score, dealer.score);
                }
          
//           sendTextMessage(senderID, "hit hit hit hit")
//           sendTextMessage(senderID, player.score.toString());
        }
        
                          sendTextMessages(senderID, arrayQueue, 0); //OK. It works for me :)


        break;
      
      case "stand":
        
        var arrayQueue = []; //my result is a array

        var message1 = "Great, you've decided to stand with "+ player.score;
        arrayQueue.push(message1);
//        sendTextMessage(senderID,"Great, you've decided to stand with "+ player.score);
        
        var message2 = "The dealer's hidden card was" + cards.displayHand([dealer.hand[1]]).toString();
        arrayQueue.push(message2);
//        sendTextMessage(senderID, "The dealer's hidden card was" + cards.displayHand([dealer.hand[1]]).toString());

                  
              while (cards.below17(dealer.hand) === true){

                shoe.deal(dealer,1);
                
                dealer.score = cards.score(dealer.hand);

                if (dealer.score > 21){
                  dealer.busted = true;
                }

                if (dealer.hand.length ===2 ){
                  
                    var message3 =  "The dealer's hole card was:" + cards.displayHand([dealer.hand[1]]).toString()+", so his score is now "+dealer.score.toString();
                    arrayQueue.push(message3);
//                    sendTextMessage(senderID, "The dealer's hole card was:" + cards.displayHand([dealer.hand[1]]).toString()+", so his score is now "+dealer.score.toString());
                } else {
                  
                    var message4 = "The dealer hit, and now has: " + cards.displayHand(dealer.hand).toString()+", totalling "+dealer.score.toString();
                    arrayQueue.push(message4);
//                    sendTextMessage(senderID, "The dealer hit, and now has: " + cards.displayHand(dealer.hand).toString()+", totalling "+dealer.score.toString());
                }
                
              }
        //|| dealer.score < 21
            if (dealer.score <= 21){
              
                  var message5 = "The dealer has decided to stand on "+dealer.score.toString();
                  arrayQueue.push(message5);
//                  sendTextMessage(senderID, "The dealer has decided to stand on "+dealer.score.toString());
                } else if (dealer.score > 21){
                  
                  var message6 = "The dealers busts!";
                  arrayQueue.push(message6);
//                  sendTextMessage(senderID, "The dealers busts!");
                }

            if (dealer.busted === false && player.busted === false){
                 if (cards.below17(dealer.hand) === false ){
                if(player.score > dealer.score || dealer.busted === true){
                  
                  var message7 = "YOU WIN!!😎💰";
                  arrayQueue.push(message7);
//                  sendTextMessage(senderID, "YOU WIN!!😎💰");
                } else if (dealer.score > player.score || player.busted === true){
                  
                  var message8 = "Dealer wins. 😭";
                  arrayQueue.push(message8);
//                  sendTextMessage(senderID, "Dealer wins. 😭")
                } else if (dealer.score === player.score){
                  
                  var message9 = "It's a draw! 😑";
                  arrayQueue.push(message9);
//                  sendTextMessage(senderID, "It's a draw! 😑")
                }
              } 
            } else if (dealer.busted === true){
              
                 var message10 = "YOU WIN!!😎💰";
                arrayQueue.push(message10);
//                 sendTextMessage(senderID, "YOU WIN!!😎💰");
            }
                      sendTextMessages(senderID, arrayQueue, 0); //OK. It works for me :)

        break;
        
      default:
			//unindentified payload
			sendTextMessage(senderID, "I'm not sure what you want. Can you be more specific?");
			break;

	}

	console.log("Received postback for user %d and page %d with payload '%s' " +
		"at %d", senderID, recipientID, payload, timeOfPostback);

}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 * 
 */
function receivedMessageRead(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;

	// All messages before watermark (a timestamp) or sequence have been seen.
	var watermark = event.read.watermark;
	var sequenceNumber = event.read.seq;
  
	console.log("Received message read event for watermark %d and sequence " +
		"number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 * 
 */
function receivedAccountLink(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;

	var status = event.account_linking.status;
	var authCode = event.account_linking.authorization_code;

	console.log("Received account link event with for user %d with status %s " +
		"and auth code %s ", senderID, status, authCode);
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about 
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var delivery = event.delivery;
	var messageIDs = delivery.mids;
	var watermark = delivery.watermark;
	var sequenceNumber = delivery.seq;

	if (messageIDs) {
		messageIDs.forEach(function (messageID) {
			console.log("Received delivery confirmation for message ID: %s",
				messageID);
		});
	}

	console.log("All message before %d were delivered.", watermark);
}

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to 
 * Messenger" plugin, it is the 'data-ref' field. Read more at 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfAuth = event.timestamp;

	// The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
	// The developer can set this to an arbitrary value to associate the 
	// authentication callback with the 'Send to Messenger' click event. This is
	// a way to do account linking when the user clicks the 'Send to Messenger' 
	// plugin.
	var passThroughParam = event.optin.ref;

	console.log("Received authentication for user %d and page %d with pass " +
		"through param '%s' at %d", senderID, recipientID, passThroughParam,
		timeOfAuth);

	// When an authentication is received, we'll send a message back to the sender
	// to let them know it was successful.
	sendTextMessage(senderID, "Authentication successful");
}

/*
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		throw new Error('Couldn\'t validate the signature.');
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
}

function isDefined(obj) {
	if (typeof obj == 'undefined') {
		return false;
	}

	if (!obj) {
		return false;
	}

	return obj != null;
}

// Spin up the server
app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})

