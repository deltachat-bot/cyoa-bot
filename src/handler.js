const { getEntry, setEntry } = require('./database')
const story = require('./story')

const delay = async (millis) => await new Promise ((res, rej) => setTimeout(res, millis)) ;

const handleDCMessage = async (dc, chatId, msgId) => {

    const DCsendMessage = (text) => dc.sendMessage(chatId, text);

    const chat = dc.getChat(chatId);
    const message = dc.getMessage(msgId);
    if (!message || message.isInfo()) return;
    const sender = dc.getContact(message.getFromId());
    (() => {
        console.log(chat.getType());
        console.log(chat.toJson());
        console.log("chatId, msgId", chatId, msgId);
        console.log(message.getText());
    })(); //debug code

    // IDEA: handle comands? for multiple stories you can play

    // lockup chat id
    let entry = await getEntry(chatId);
    let just_started = false;
    if(!entry){
        // entry doesn't exist - creating it
        await setEntry(chatId, "name of story", "part_1");
        entry = await getEntry(chatId);
        just_started = true;
        console.log("user just started")
    }

    // 1. Check where the user/chatID is in the story (progress/stage) from db
    const stage = entry.stage;

    // 2. get the story element
    const currentStoryElement = story[stage];
    if(!currentStoryElement){
        console.error(`story_element '${stage}' not defined`, {entry, currentStoryElement});
        DCsendMessage(`Internal Error, please contact the developers of this bot. Your ID: ${chatId}`)
        return;
    }

    const sendElement = async (storyElem) => {
        DCsendMessage(storyElem.message);
        await delay(200);
        var choicesMessage = `Your choices:\n` + storyElem.choices.map((choice, index)=>`${index+1}: ${choice.label}`).join('\n');
        DCsendMessage(choicesMessage);
    }

    console.log({just_started})

    if(just_started){
        sendElement(currentStoryElement)
    } else {
        // 3. compare to choices
        const userinput = Number.parseInt(message.getText());

        console.log({userinput, cl: currentStoryElement.choices})
  
        if(Number.isNaN(userinput)){
            DCsendMessage(`(Send the number of the option you want to continue)`)
        } else if (userinput > currentStoryElement.choices.length) {
            DCsendMessage(`(Number out of range, please select one of the options)`)
        } else {
            const choice = currentStoryElement.choices[userinput-1];
            if(!choice){
                console.error(`choice '${userinput}' in stage '${stage}' not defined`, {entry, story_element: currentStoryElement});
                DCsendMessage(`Internal Error, please contact the developers of this bot. Your ID: ${chatId}`)
                return;
            }
            // 4. send answer to player and advance in db
            await setEntry(chatId, entry.story, choice.goto);
            const nextStoryElement = story[choice.goto];
            if(!nextStoryElement){
                console.error(`story_element '${choice.goto}' not defined`, {entry, nextStoryElement});
                DCsendMessage(`Internal Error, please contact the developers of this bot. Your ID: ${chatId}`)
                return;
            }
            sendElement(nextStoryElement);
        }
    }

    dc.markNoticedChat(chatId); // mark message as read
}

module.exports = handleDCMessage