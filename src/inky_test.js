const { Story, StoryState } = require('inkjs');
var fs = require('fs');
var readline = require('readline');

//load the ink file
console.time("load ink")
var inkFile = fs.readFileSync('./stories/intercept.ink.json', 'UTF-8').replace(/^\uFEFF/, '');
console.timeEnd("load ink")
//create a new story
console.time("load")
var myStory = new Story(inkFile);
console.timeEnd("load")
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  continueToNextChoice();

var save = "";
  
  function continueToNextChoice(){
      //check we haven't reached the end of the story
      if (!myStory.canContinue && myStory.currentChoices.length === 0) end();
      
      //write the story to the console until we find a choice
      while (myStory.canContinue){
          console.log(myStory.Continue());
      }

      //check if there are choices
      if (myStory.currentChoices.length > 0){
          for (var i = 0; i < myStory.currentChoices.length; ++i) {
              var choice = myStory.currentChoices[i];
              console.log((i + 1) + ". " + choice.text);
          }
          
          //prompt the user for a choice
          rl.question('> ', (answer) => {
              //continue with that choice
              if(answer == "s") {
                save = myStory.state.ToJson()
                continueToNextChoice();
              } else if (answer == "o"){
                // todo check if json is empty
                myStory.state.LoadJson(save);
                continueToNextChoice();
              } else {
                  try {
                      myStory.ChooseChoiceIndex(parseInt(answer) - 1);
                  } catch (error) {
                      console.log(error)
                  }
                  continueToNextChoice();
              }
          });
      }
      else{
          //if there are no choices, we reached the end of the story
          end();
      }
  }
  
  function end(){
      console.log('THE END');
      rl.close();
  }



  // Bot would look in db what story was played and then load it
  // load state from db into it and compare choices
  // write new state in db and return the object

  // Because inintilizing an story instance takes 80ms it might make sense
  // to rewrite the class so the state is an input parameter fo the functions instead of part of the story