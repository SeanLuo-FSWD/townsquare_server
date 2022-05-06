import { MongoClient } from "mongodb";

// const uri = "mongodb+srv://johnny:tzuning615@cluster0.krtou.mongodb.net/townsquare?retryWrites=true&w=majority";
const uri = "const url = 'mongodb://127.0.0.1:27017'";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _database;

async function connectDB() {
  await client.connect();
  _database = client.db("townsquare");
}

function getDB() {
  return _database;
}

export { connectDB, getDB, client };
