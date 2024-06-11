const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb+srv://grace:alohamora@netninja.sfsagjm.mongodb.net/?retryWrites=true&w=majority&appName=NetNinja')
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err =>{
            console.log(err)
            return cb (err)
        })
    }, 
    getDb: () => dbConnection
}