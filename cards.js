//Cards.js
//Create decks,shuffle and deal hands!
function sayHello(){
  var greeting = "Hi, I'm a bot!" + addWords();
  
  return greeting;
}

function Person() {
    this.firstName = firstName();
    this.lastName = lastName();
    this.concat = function(this.firstName, this.lastName){
      var output = first + " " + last;
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
    Person : Person
}
