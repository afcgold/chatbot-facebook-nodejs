//Cards.js
//Create decks,shuffle and deal hands!



module.exports = {

  CardObject : function(suit,rank,value)
  {
     this.suit=suit;
     this.rank=rank;
     this.value=value;
  },
  
    // var blankCard = ["BB"];
  //create the entire shoe of cards, made up of decks
  createDeck : function(deck,numDecks) {

      for (k = 0; k < numDecks; k++) {
        deck[k] = this.createPack(deck);

      }

      if (k % 6 === 0){

          var blankCard = new this.CardObject("","BB",0);

          deck.push(blankCard);
       }

      deck = [].concat.apply([], deck);

      return deck;
    },

  createPack : function(deck) {
      var suits = ["Hearts", "Clubs", "Spades", "Diamonds"]; 
      var value = [0];
      var rank = "";
  //     var pack = [];
      var n = 52;
      var index = n / suits.length; 
      var count = 0;

        for(i = 0; i <= 3; i++) {

          for(j = 1; j <= index; j++) {

            rank = j;

            if (j >= 10) {

              value = 10;

              switch(j) {
                  case 11:
                      rank = "Jack";
                      break;
                  case 12:
                      rank = "Queen";
                      break;
                  case 13:
                      rank = "King";
                      break;
              }

            } else if (j == 1){

              value = [1, 11];
              rank = "Ace";

            } else {

              value = j;

            }

            deck.push(new this.CardObject(suits[i],rank,value));

          }
        }

      return deck; 
   },


  //function to shuffle the cards
  shuffleDeck: function(deck) {

       var m = deck.length, t, i;

      while (m) {

        i = Math.floor(Math.random() * m--);
        t = deck[m];
        deck[m] = deck[i];
        deck[i] = t;
      }

      return deck;
   },

  //function that draws cards from the deck
  drawCards :function(deck, number){

      //create a new array to hold "number" amount of cards
      var hand = [];
      var displayHand = "";

      //pick 2 cards at random from the deck
      function randomCard() {

        var chosenCard = deck.splice(deck[Math.floor(Math.random() * deck.length)],1);

      }

      for (i = 0; i < number ; i++){      

        var rand = deck.splice(deck[Math.floor(Math.random() * deck.length)],1)

         rand = [].concat.apply([], rand);

         hand[i] = rand;

      }

      for (i = 0; i < hand.length; i++){

            hand = [].concat.apply([], hand);

        if (hand[i].value === 0){

          console.log("blank card found at pos: "+i);

            hand[i] = [];

            var newCard = deck.splice(deck[Math.floor(Math.random() * deck.length)],1)

            hand[i] = newCard;

        }
      }

      hand = [].concat.apply([], hand);

    return hand;
  },

  displayHand: function(hand){

    var displayHand = [];

  //   console.log(hand);

    for (i = 0; i < hand.length; i++){

      displayHand[i] = " " + hand[i].rank + " of " + hand[i].suit + "";

      this.showCardImage(i);

    }
    
    return displayHand;
  },

  isBlackjack : function(hand){

    var temp = [];

    var sum = 0;

    var numAces = 0;

      for (i = 0; i < hand.length; i++){

         temp[i] = hand[i].value;

        if (hand[i].rank === "Ace"){

          var add = Math.max.apply(Math, hand[i].value);
          sum += add;
          numAces++;

        } else {

           sum += temp[i];
        }
      }

    while (sum > 21 && numAces){

      sum -= 10;    
      numAces--;

    } 

    if (sum === 21){
      return "BLACKJACK";
    }

    return sum;

  },
  
  showCardImage : function (card) {
        
    //get card into naming image naming convention
    var cloudinaryImage = card.suit.toLowerCase() + "-" + card.rank + ".jpeg";
    
    //return image from Cloudinary
    this.requestImage(cloudinaryImage);
    
    return cloudinaryImage;
      
  },
    
  requestImage : function (string) {
    
    //take the URL from Cloudinary
    var imageURL = cloudinary.image(string).toString();
          
    function prepareURL(){
      imageURL = imageURL.replace("img src=","");

      if (imageURL.substring(0, 1) == '<') { 
            imageURL = imageURL.substring(2);
            imageURL = imageURL.slice(0, -4);
      };
      
      //return URL ready for FACEBOOK to send
      return imageURL;
    }
        
  },
    
  
//          var imageURL = cloudinary.image("dealer-like.png").toString();
//          var imageURL2 = cloudinary.image("sanchez.jpg").toString();
//
//          var replaced = imageURL.replace("img src=","");
//          var replaced2 = imageURL2.replace("img src=","");
//
//
//          if (replaced.substring(0, 1) == '<') { 
//              replaced = replaced.substring(2);
//              replaced = replaced.slice(0, -4);
//          }
//          
//          if (replaced2.substring(0, 1) == '<') { 
//              replaced2 = replaced2.substring(2);
//              replaced2 = replaced2.slice(0, -4);
//          }
//
//                    
//          var newImg = cloudinary.image("diamonds-10.jpg", {overlay: "hearts-10.jpg", gravity: "east", x: -165});
//          
//          var newImg = newImg.replace("img src=","");
//
//          if (newImg.substring(0, 1) == '<') { 
//             newImg = newImg.substring(2);
//              newImg = newImg.slice(0, -4);
//          }
//                    
////          sendTextMessage(sender, "new Image ===" + newImg.toString());
//////                    
////          cloudinary.uploader.upload(newImg, function(result) { 
////            console.log(result) 
////          });
////          
////          sendImageMessage(sender, replaced);
//          sendImageMessage(sender, newImg);
          
}