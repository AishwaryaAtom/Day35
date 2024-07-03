import { MongoClient } from "mongodb";
const userName = "atomaishwarya";
const Dbpassword = "qb45XyfVaybaFpVm";
const dbUrl = "127.0.0.1:27017";

const dbName = "MentorStudent";

const localUrl = `mongodb://${dbUrl}`;
const cloudUrl = `mongodb+srv://${userName}:${Dbpassword}@cluster0.barcz6g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(cloudUrl);

const db = client.db(dbName);

const connectToDb = async () => {
  try {
    await client.connect();
    console.log("DB CONNECTED SUCCESSFULLY");
  } catch (e) {
    console.error("Failed to connect to the database", e);
    process.exit(1);
  }
};
export { db };
export default connectToDb;
