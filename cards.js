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
      var suits = ["hearts", "clubs", "spades", "diamonds"]; 
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
                      rank = "jack";
                      break;
                  case 12:
                      rank = "queen";
                      break;
                  case 13:
                      rank = "king";
                      break;
              }

            } else if (j == 1){

              value = [1, 11];
              rank = "ace";

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

      displayHand[i] = "" + hand[i].rank + " of " + hand[i].suit + "";

    }

    return displayHand;
  },

  isBlackjack : function(hand){

    var temp = [];

    var sum = 0;

    var numAces = 0;

      for (i = 0; i < hand.length; i++){
        console.log(hand[i].value);

         temp[i] = hand[i].value;

        if (hand[i].rank === "ace"){

          var add = Math.max.apply(Math, hand[i].value);
          sum += add;
          numAces++;

        } else {

           sum += temp[i];
        }
      }

      console.log("SUM 1 = " + sum);

    while (sum > 21 && numAces){

      sum -= 10;    
      numAces--;

    } 

    if (sum === 21){
      return "BLACKJACK";
    }

    return sum;

  },
}