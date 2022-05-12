import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// const uri = process.env.MONGODB;
const uri = process.env.MONGOATLAS;

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
