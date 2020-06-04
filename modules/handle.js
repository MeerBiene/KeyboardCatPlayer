const SQLite = require("better-sqlite3");
const keyv = require('keyv')
const db = new keyv('sqlite://modules/data/channels.sqlite')
const cache = new keyv('sqlite://modules/data/cache.sqlite')
const data = new SQLite('modules/data/data.sqlite')

async function create () {
    const table = data.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='data';`).get();
    if (!table['count(*)']) {
        data.prepare("CREATE TABLE data (user TEXT, channel TEXT, channelspecificguild TEXT, hours TEXT);").run()
        data.pragma("synchronous = 1");
        data.pragma("journal_mode = wal");
    }
}

/**
 * @typedef {Object} userobject
 * @property {String} user - user id (discord ID)
 * @property {String} channel - channel the user is vibing in (will be null when user is not in VC)
 * @property {String} channelspecificguild - guild where the user is vibing in the voicechannel (will be null when user is not in VC)
 * @property {String} hours - total hours that the user spent listening.
 */


/**
 * @function push
 * @param {userobject} userobject 
 */

async function push(userobject) {
    data.prepare(`INSERT INTO data (user, channel, channelspecificguild, hours) VALUES (@user, @channel, @channelspecificguild, @hours)`).run(userobject)
}

async function get (field, key) {
    return data.prepare(`SELECT * FROM 'data' WHERE ${field}='${key}';`).all()
}

async function update(key, value, ID) {
    data.prepare(`UPDATE 'data' SET ${key}='${value}' WHERE user='${ID}'`).run()
}

async function dbpush (key, value) {
    try {
        await db.set(key, value)
    } catch(e) {
        console.error(new Date(), e)
    }
}

async function dbget(key) {
    try {
        return await db.get(key)
    } catch(e) {
        console.error(new Date(), e)
    }
}

// cache model: userid - listened time
async function cachepush(key, value) {
    try {
        await cache.set(`${key}`, `${value}`)
    } catch(e) {
        console.error(new Date(), e)
    }
}

async function cacheget(key) {
    try {
        return await cache.get(key);
    } catch(e) {
        console.error(new Date(), e)
    }
}

async function cachedelete(key) {
    try {
        await cache.delete(`${key}`)
    } catch(e) {
        console.error(new Date(), e)
    }
}



db.on('error', err => {
    console.error(new Date(), err)
})

cache.on('error', err => {
    console.error(new Date(), err)
})

module.exports = { dbpush, dbget, cachepush, cacheget, cachedelete, create, push, get, update }