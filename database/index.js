const { async } = require("@firebase/util");
const { MongoClient } = require("mongodb");

const url =
    "mongodb+srv://giang112000:giang112000@cluster0.52bon.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "Ptitworks-admin";

async function getOneData(tableName, query) {
    await client.connect();
    console.log("Đã kết nối database");
    const db = client.db(dbName);
    const getTable = db.collection(tableName);
    const kq = await getTable.findOne(query);
    return kq;
}
async function getMultiData(tableName, query) {
    await client.connect();
    console.log("Đã kết nối database");
    const db = client.db(dbName);
    const getTable = db.collection(tableName);
    const kq = await getTable.find(query).toArray();
    return kq;
}
async function insertOneData(tableName, data) {
    await client.connect();
    console.log("Đã kết nối database");
    const db = client.db(dbName);
    const getTable = db.collection(tableName);
    const kq = await getTable.insertOne(data);
    return kq;
}
async function insertManyData(tableName, data) {
    await client.connect();
    console.log("Đã kết nối database");
    const db = client.db(dbName);
    const getTable = db.collection(tableName);
    const kq = getTable.insertMany(data);
    return kq;
}
async function updateHistory(id, data) {
    await client.connect();
    console.log("Đã kết nối database");
    const db = client.db(dbName);
    const getTable = db.collection("History");
    await getTable.updateOne({ user: id }, {
        $push: {
            history: data,
        },
    });
}

async function deleteOne(id) {
    await client.connect();
    console.log("Đã kết nối database");
    const db = client.db(dbName);
    const getTable = db.collection("History");
    await getTable.deleteOne({ user: id });
}

module.exports = {
    getOneData,
    getMultiData,
    insertOneData,
    insertManyData,
    updateHistory,
    deleteOne,
};