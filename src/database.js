var sqlite3 = require('sqlite3').verbose();

/** @type {import('sqlite3').Database} */
var db;

function init_db(filename) {
    db = new sqlite3.Database(filename);
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS games (chatId INTEGER PRIMARY KEY, story TEXT, stage TEXT);");
    })
}

async function getEntry(chatId) {
    return await new Promise((res, rej) => {
        db.get(`SELECT * FROM games WHERE chatId = ${Number(chatId)} `, (err, result) => {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}

async function setEntry(chatId, story, stage) {
    const entry = await getEntry(chatId);
    if (!entry) {
        await insertEntry(chatId, story, stage)
    } else {
        await new Promise((res, rej) => {
            db.run("UPDATE games SET story = $story, stage = $stage WHERE chatId = $chatId", {
                $chatId: chatId,
                $story: story,
                $stage: stage
            }, (err) => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    }

}

async function insertEntry(chatId, story, stage) {
    return await new Promise((res, rej) => {
        db.run("INSERT INTO games (chatId, story, stage) VALUES ($chatId, $story, $stage)", {
            $chatId: chatId,
            $story: story,
            $stage: stage
        }, (err) => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    });
}

function close_db() {
    db.close();
}

module.exports = {
    init_db,
    getEntry,
    setEntry,
    close_db
}