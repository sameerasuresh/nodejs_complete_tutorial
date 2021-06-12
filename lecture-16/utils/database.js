const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback)=> {
    //MongoClient.connect('mongodb+srv://suresh:bFV5dX93ZkJqE1xd@cluster0.vhyol.mongodb.net/test?retryWrites=true&w=majority')
    MongoClient.connect('mongodb://127.0.0.1:27017/test?gssapiServiceName=mongodb')
    .then(client => {
        console.log('MongoDB connected'); 
        _db = client.db();
        console.log(_db);
        callback();
    })
    .catch(err => {
        console.log('DB Connection error:',err); 
        //throw err;
    });
}

const getDB = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found!'; 
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
