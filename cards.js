//Cards.js
//Create decks,shuffle and deal hands!

function Deck() {

    this.deck = new Array();
  
    this.createShoe = createShoe;
    this.createDeck = createDeck;
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
      }
  
  return;
}

function createDeck() {
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
}

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
    Card : Card,
    createShoe : createShoe,
}
