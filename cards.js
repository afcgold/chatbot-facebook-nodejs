//Cards.js
//Create decks,shuffle and deal hands!
const cloudinary = require('cloudinary');

module.exports = {

CardObject : function(suit,rank,value,image){
     this.suit=suit;
     this.rank=rank;
     this.value=value;
     this.image=image;
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
      var image ="";
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
            
            image = suits[i] + "-" + rank + ".jpg";
            
            deck.push(new this.CardObject(suits[i],rank,value,image));

          }
        }

    return deck; 
},

  //function to shuffle the cards
shuffleDeck : function(deck) {

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
drawCards : function(deck, number){

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

 displayHand : function(hand){

    var displayHand = [];
  //   console.log(hand);

    for (i = 0; i < hand.length; i++){

      displayHand[i] = " " + hand[i].rank + " of " + hand[i].suit + "";
      
//       displayHandImage[i] = hand[i].image;
      
// //       console.log("cloudinary name = " + hand[i].image);
      
//       this.requestImage(hand[i].image);

    }
   
    return displayHand;
},

requestImage : function(array) {
      
     var imageURL = cloudinary.image("Hearts-10.jpg", {overlay: "Hearts-10.jpg", gravity: "east", x: -165});
  
//    var imageURL = "= " + array[0] + ", " + array[1];
      
     function prepareURL(){
      
       //only needs to be done when sending image to FB
       imageURL = imageURL.replace("img src=","");

       if (imageURL.substring(0, 1) == '<') { 
             imageURL = imageURL.substring(2);
             imageURL = imageURL.slice(0, -4);
       }
      
 //       console.log(imageURL);
      
     }
  
    //return URL ready for FACEBOOK to send
    return imageURL;
        
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
}
}
