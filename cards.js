//Cards.js
//Create decks,shuffle and deal hands!
module.exports = {
  
  sayHello : function () {
  
    var greeting = "hello!!!";
  
    return greeting;
  
  },
  createPack : function () {
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
  createDeck : function (deck, numDecks) {
    for (k = 0; k < numDecks; k++) {
      deck[k] = this.createPack();
      if (k % 6 === 0){
        var blankCard = ["BB"];
        deck[k] = blankCard;
      }
    }
    deck = [].concat.apply([], deck);
  //   console.log(deck);
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
  //   console.log(cards);
    return cards;
  },
  drawCards : function (deck, number){
    var hand = new Array();

    for (i = 0; i < number; i++){      
       var rand = deck.splice(deck[Math.floor(Math.random() * deck.length)],1);
       hand[i] = rand;
    }
    return hand
  }
}