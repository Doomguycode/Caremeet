const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'Ref_Db';
// Create a new MongoClient
const client = new MongoClient(url);

// var Login_ID = "WAL-JESDALE";
var yoyo = "WAL-BALPERN";
// Use connect method to connect to the Server

client.connect(  async function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  const data = await db.collection("People_Info")
    .find({"Login_ID":yoyo}).toArray()
    console.log(data)

   client.close();
});


const findDocuments = async function(db, callback) {
  // Get the documents collection
  const collection = db.collection('People_Info');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}



