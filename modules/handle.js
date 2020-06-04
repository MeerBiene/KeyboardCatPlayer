const keyv = require('keyv')
const db = new keyv('sqlite://../data/channels.sqlite')
const cache = new keyv('sqlite://../data/cache.sqlite')

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

module.exports = { dbpush, dbget, cachepush, cacheget, cachedelete }