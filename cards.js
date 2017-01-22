//Cards.js
//Create decks,shuffle and deal hands!
module.exports = {
  
sayHello : function(){
  var greeting = "Hi, I'm a bot!"
  
  return greeting;
},

Deck : function(){

    this.deck = new Array();
  
    this.createShoe() = createShoe();
    this.createDeck() = createDeck();
    this.shuffleDeck() = shuffleDeck();
    this.dealCards() = dealCards();
    this.score() = isBlackjack();
    this.show() = displayHand();
    this.hit() = hit();
    this.isSplit = false;
},

Card : function(suit,rank,value,image){
  
   this.suit=suit;
   this.rank=rank;
   this.value=value;
   this.image=image;
},
   
//create the entire shoe of cards, made up of decks
createShoe: function(numDecks) {
      
      for (k = 0; k < numDecks; k++) {
        this.deck.push[k] = this.createDeck();
      }

      if (k % 6 === 0){
        var blankCard = new Card("","BB",0);
        this.deck.push(blankCard);
      }
  
  return;
},

createDeck: function() {
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
            
            image = suits[i] + "-" + rank + ".png";
            
            this.deck.push(new Card(suits[i],rank,value,image));

          }
        }
  
    return; 
},

  //function to shuffle the cards
shuffleDeck: function() {
   
    var m = this.deck.length, t, i;

    while (m) {

        i = Math.floor(Math.random() * m--);
        t = this.deck[m];
        this.deck[m] = this.deck[i];
        this.deck[i] = t;
      }
    
      return ;
  },

 //function that draws cards from the deck
 dealCards: function(number){
   
      if(number == null){
        number = 1;
      }
     
      //create a new array to hold "number" amount of cards
      var hand = new Deck();
      
      for (i = 0; i < number ; i++){      
          hand.deck.push(this.deck.shift());
      }

      for (i = 0; i < hand.length; i++){

        if (hand.deck[i].value === 0){
            console.log("blank card found at pos: "+i);
            hand.deck[i] = [];
            hand.deck.push(this.deck.shift());        
        }
      }
      
//    if (this.deck.isSplit === true) {
//         //if a matching pair is dealt then split
     
//      console.log("split");
          
//      if ((hand.deck[0].value === hand.deck[1].value) && (hand.deck[0].rank === hand.deck[1].rank) || (hand.deck[0].rank == "Ace" && hand.deck[1].rank == "Ace")){
    
//         console.log("matching pair");
//         split(hand);

//      } 
//    }

    return hand;
},

split :function(hand){
  
    //currently only handles 1-round of splitting
  
    var split1 = new Deck();

    split1.isSplit = true;
    split1.deck.push(hand.deck[0]);
    split1.hit(shoe.deck);
  
    var split2 = new Deck();
  
    split2.isSplit = true;
    split2.deck.push(hand.deck[1]);
    split2.hit(shoe.deck);
    
    //now return 2 separate split hands
    return [split1, split2];
},

 displayHand:function(deck){
   
    var handDisplay = [];  
   
     for (i = 0; i < deck.length; i++){

      handDisplay[i] = deck[i].rank + " of " + deck[i].suit + "";
      
    }
    return handDisplay;
 },

requestImage:function(array) {
      
//     var imageURL = cloudinary.image(array[0], {overlay: array[1], gravity: "east", x: -165});
  
    var imageURL = array[0] + ", " + array[1];
  
    return imageURL;   
},

isBlackjack:function(){
  
    var temp = [];

    var sum = 0;

    var numAces = 0;

      for (i = 0; i < this.deck.length; i++){

        temp[i] = this.deck[i].value;

        if (this.deck[i].rank === "Ace"){

          var add = Math.max.apply(Math, this.deck[i].value);
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

show:function(hand) {
    
  var cards = [];
  var images = [];
  
  //send text message
  cards = displayHand(hand);
  //sendTextMessage(sender, cards)
  
  return;
//  console.log(cards);
       
//     //send image
//      for (i = 0; i < hand.length; i++){
//
////      var cloudinaryRef = this.requestImage(hand[i].image);
//            
//        images[i] = hand[i].image
//        
//      } 
//  
//  var image = this.requestImage(images);
//  //sendImageMessage(sender, image);
},

 hit:function(deck){
  
  this.deck.push(shoe.dealCards().deck);
  
  this.deck = [].concat.apply([], this.deck);

  return
},

newGame:function(){
  
    shoe = new this.Deck();
    
    shoe.createShoe(1);
    shoe.shuffleDeck();
  
    return shoe;
},

below17:function(hand) {
  
    var val = hand.score();
    
    return val < 17 ? true : false;
  
}
 
}
