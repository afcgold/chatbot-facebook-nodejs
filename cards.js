const cloudinary = require('cloudinary');

cloudinary.config({ 
              cloud_name: "afcgold", 
              api_key: "172131976868625", 
              api_secret: "MCVeonGDlwEga4ooiNgRiznd3Xc" 
          });
//Cards.js
//Create decks,shuffle and deal hands!
function Player(name){
  this.name = name;
  this.score = 0;
  this.hand = [];
  this.dealer = false;
  this.busted = false;
}

function Deck() {
    this.deck = new Array();
    this.createShoe = createShoe;
    this.createDeck = createDeck;
    this.shuffleDeck = shuffleDeck;
    this.deal = deal;
}

function Card(suit,rank,value,image){
   this.suit=suit;
   this.rank=rank;
   this.value=value;
   this.image=image;
}

function  createShoe(numDecks) {
      for (k = 0; k < numDecks; k++) {
        this.deck.push[k] = this.createDeck();
        this.shuffleDeck();
      }
  return;
}

function createDeck() {
  var suits = ["Hearts", "Clubs", "Spades", "Diamonds"]; 
  var value = [0];
  var rank = "";
  var image ="";
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
}

function shuffleDeck() {
  var m = this.deck.length, t, i;
  while (m) {
      i = Math.floor(Math.random() * m--);
      t = this.deck[m];
      this.deck[m] = this.deck[i];
      this.deck[i] = t;
    }
  return ;
}

function displayHand(deck){
  var display = [];  
    for (i = 0; i < deck.length; i++){
    display[i] = " " + deck[i].rank + " of " + deck[i].suit + "";
  }
  return display;
}

function deal(player,number){
    
  for (i = 0; i < number; i++){
                        
         player.hand.push(this.deck.shift());        
       }
  
    return player.hand;
}

function score(hand){
  
    var temp = [];

    var sum = 0;
  
//     console.log(hand);

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

    if (sum === 21 && hand.length <= 2){
      return "BLACKJACK";
    } else if (sum ===21 && hand.length > 2){
      
      return sum;
      
    } else if(sum > 21){
            
       var bust = ""+sum+". BUSTED! Game over 😭";
            
      return bust;
    } 
  
    return sum;
}

function newGame(){
  
  //create shoe to play from
  var shoe = new Deck()
  shoe.createShoe(6);
  
  return shoe;
  
}

function cardsRemain(deck){
  
  var remain = deck.deck.length;
  
  return remain;
  
}

function below17(hand){
  
  var value = score(hand);
    
  return value < 17 ? true : false
  
}

function requestImage(hand) {
       
      var images = [];

      //send image
      for (i = 0; i < hand.length; i++){
            
        images[i] = hand[i].image
        
      } 
          
      var imageURL = cloudinary.image(images[0], {overlay: images[1], gravity: "east", x: -175});
  
      var pImageURL = imageURL.replace("<img src='","");
      
      imageURL = pImageURL.replace("' />","");
  
      return imageURL;   

}


//////////////////////

  module.exports = {

    Deck: Deck,
    Player: Player,
    Card : Card,
    createShoe : createShoe,
    displayHand : displayHand,
    deal : deal,
    newGame : newGame,
    score: score,
    cardsRemain: cardsRemain,
    below17: below17,
    requestImage: requestImage
}
