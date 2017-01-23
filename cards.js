//Cards.js
//Create decks,shuffle and deal hands!
function sayHello(){
  var greeting = "Hi, I'm a bot!" + addWords();
  
  return greeting;
}

function Person() {
    this.firstName = firstName();
    this.lastName = lastName();

}

function firstName(){
  var first = "George"
  return first;
}

function lastName(){
  var second = "Goldhagen"
  return second;
}

function addWords(){
  var additional = "and add this on the end too please!";
  return additional;
  
}

  module.exports = {
    
    sayHello : sayHello,
    firstName : firstName,
    lastName : lastName,
    Person : Person
}
