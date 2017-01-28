//Cards.js
//Create decks,shuffle and deal hands!
function Player(name){
  this.name = name;
  this.score = 0;
  this.hand = [];
  this.dealer = false;
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

function deal(number){
     if(number === undefined){
        number = 1;
     }
   
     if(number === 1){
        return this.deck.shift();
     }
     
     var cards = [];
  
     for (i = 0; i < number; i++){
       cards.push(this.deck.shift());        
     }  
  
    return cards;
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

    if (sum === 21){
      return "BLACKJACK";
    } else if(sum > 21){
      
      return "BUSTED! Game over.";
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




//////////////////////


function sayHello(){
  var greeting = "Hi, I'm a bot!" + addWords();
  return greeting;
}

function Person() {
    this.firstName = firstName();
    this.lastName = lastName();
    this.concat = function(){
      var output = this.firstName + " " + this.lastName;
      return output;
    }
}

function firstName(){
  var first = "George"
  return first;
}

function lastName(){
  var second = "Goldhagen"
  return second;
}


  module.exports = {
    
    sayHello : sayHello,
    firstName : firstName,
    lastName : lastName,
    Person : Person,
    Deck: Deck,
    Player: Player,
    Card : Card,
    createShoe : createShoe,
    displayHand : displayHand,
    deal : deal,
    newGame : newGame,
    score: score,
    cardsRemain: cardsRemain
}
