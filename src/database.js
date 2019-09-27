var sqlite3 = require('sqlite3').verbose();

/** @type {import('sqlite3').Database} */
var db;

function init_db(filename) {
    db = new sqlite3.Database(filename);
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS games2 (chatId INTEGER PRIMARY KEY, story TEXT, data TEXT);");
    })
}
/**
 * 
 * @param {number} chatId
 * @returns {{chatId:number, story:string, data:string}}
 */
async function getEntry(chatId) {
    return await new Promise((res, rej) => {
        db.get(`SELECT * FROM games2 WHERE chatId = ${Number(chatId)} `, (err, result) => {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}

async function setEntry(chatId, story, data) {
    const entry = await getEntry(chatId);
    if (!entry) {
        await insertEntry(chatId, story, data)
    } else {
        await new Promise((res, rej) => {
            db.run("UPDATE games2 SET story = $story, data = $data WHERE chatId = $chatId", {
                $chatId: chatId,
                $story: story,
                $data: data
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

async function insertEntry(chatId, story, data) {
    return await new Promise((res, rej) => {
        db.run("INSERT INTO games2 (chatId, story, data) VALUES ($chatId, $story, $data)", {
            $chatId: chatId,
            $story: story,
            $data: data
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