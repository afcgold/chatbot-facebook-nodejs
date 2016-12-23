//Cards.js
//Create decks,shuffle and deal hands!
module.exports = {
  
  var blankCard = ["BB"];

  createDeck : function () {
    var suits = new Array("H", "C", "S", "D"); 
    var pack = new Array();
    var n = 52;
    var index = n / suits.length; 
    var count = 0;

      for(i = 0; i <= 3; i++) 
        for(j = 1; j <= index; j++) 
          pack[count++] = j + suits[i]; 
      //console.log(pack);
    return pack; 
  },
  
  createShoe : function (deck, numDecks) {
    for (k = 0; k < numDecks; k++) {
      deck[k] = this.createDeck();
    }
    
    if (k % 6 === 0){
        deck.push(blankCard);
    }

    deck = [].concat.apply([], deck);
    return deck;
  },
  
  shuffleDecks : function (cards) {
    var m = cards.length, t, i;
  //   console.log(m);
    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }
    return cards;
  },
  
  drawCards: function(deck, number){
      
    //create a new array to hold "number" amount of cards
    var hand = new Array();
  
    //pick 2 cards at random from the deck
  
    function randomCard() {
         var chosenCard = deck.splice(deck[Math.floor(Math.random() * deck.length)],1);
         chosenCard = [].concat.apply([], chosenCard);
         return chosenCard;
    }
    
    for (i = 0; i < number ; i++){      
      var rand = randomCard();
      hand[i] = rand;
    }
  
    for (i = 0; i < hand.length; i++){
      if (hand[i] == blankCard){
          hand[i] = randomCard();
          //shuffle deck at the end of this game.
      }
    }
    return hand
  }
}