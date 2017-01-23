//Cards.js
//Create decks,shuffle and deal hands!
function sayHello(){
  var greeting = "Hi, I'm a bot!" + addWords();
  
  return greeting;
}

function addWords(){
  var additional = "and add this on the end too please!";
  return additional;
  
}

  module.exports = {
    
    sayHello : sayHello,

}
