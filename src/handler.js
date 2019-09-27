const { getEntry, setEntry } = require('./database')
const { Story, StoryState } = require('inkjs');
const path = require('path')
const fs = require('fs')

const delay = async (millis) => await new Promise((res, rej) => setTimeout(res, millis));

const handleDCMessage = async (dc, chatId, msgId) => {

    const DCsendMessage = (text) => dc.sendMessage(chatId, text);

    const chat = dc.getChat(chatId);
    const message = dc.getMessage(msgId);
    if (!message || message.isInfo()) return;
    const sender = dc.getContact(message.getFromId());

    // IDEA: handle comands? for multiple stories you can play
    if( message.getText() == "open"){
        await setEntry(chatId, "intercept.ink.json", "");
    }

    // lockup chat id
    let entry = await getEntry(chatId);

    if (!entry) {
        // entry doesn't exist - creating it
        await setEntry(chatId, "intercept.ink.json", "");
        entry = await getEntry(chatId);
    }

    if (!entry.story){
        DCsendMessage("No story selected")
        dc.markNoticedChat(chatId);
        return;
    }

    // 1. Load story
    // console.time("load ink")
    var inkFile = fs.readFileSync(path.join('./stories', entry.story), 'UTF-8').replace(/^\uFEFF/, '');
    // console.timeEnd("load ink")
    // console.time("load")
    var myStory = new Story(inkFile);
    // console.timeEnd("load")

    // 2.Load save data
    let just_started = false;
    if (entry.data) {
        myStory.state.LoadJson(entry.data);
    } else {
        just_started = true
    }

    const sendElement = async () => {
        let replytext = ""
        while (myStory.canContinue) {
            replytext += myStory.Continue();
        }
        replytext += "\n"
        if (myStory.currentChoices.length > 0) {
            for (var i = 0; i < myStory.currentChoices.length; ++i) {
                var choice = myStory.currentChoices[i];
                replytext +=('\n'+(i + 1) + ". " + choice.text );
            }
        }
        DCsendMessage(replytext)
        await setEntry(chatId, entry.story, myStory.state.ToJson());
    }

    const end = async () => {
        await setEntry(chatId, "", "")
        DCsendMessage("The end - please select new story")
    }

    if (just_started) {
        sendElement()

    } else {
        // 3. compare to choices
        const userinput = Number.parseInt(message.getText());

        if (Number.isNaN(userinput)) {
            DCsendMessage(`(Send the number of the option you want to continue)`)
        } else if (userinput > myStory.currentChoices.length) {
            DCsendMessage(`(Number out of range, please select one of the options)`)
        } else {
            try {
                myStory.ChooseChoiceIndex(parseInt(userinput) - 1);
            } catch (error) {
                DCsendMessage(`Error: ${error.message}`)
            }
            if (!myStory.canContinue && myStory.currentChoices.length === 0) end();
            sendElement()
        }

    }

    dc.markNoticedChat(chatId); // mark message as read
}

module.exports = handleDCMessage