const FS = require("fs");
const path = require("path");
const msgpack = require("@msgpack/msgpack");
const dbPath = path.join(__dirname, "/Volumes/database.ndb");

const documentLimit = 6291456; // 6MB

const dummyData = require("./dummydata");

// async function loadDatabaseFromDisk() {
//   return new Promise((resolve, reject)={

//   })
// }

function serializeDocument(document) {
  const binaryData = msgpack.encode(obj);

  if (binaryData.length > documentLimit) {
    throw new Error("Document exceeds the size limit of 6MB");
  }

  return binaryData;
}

function deserializeObject(buffer) {
  return msgpack.decode(buffer);
}

function saveToDisk(filePath, data) {
  const binaryData = serializeDocument(data);
  FS.writeFileSync(filePath, binaryData);
}

function loadFromDisk(filePath) {
  const binaryData = FS.readFileSync(filePath);
  return deserializeObject(binaryData);
}

function loadDatabaseWithDummyData() {
  saveToDisk(dbPath, dummyData);
}

loadDatabaseWithDummyData();

module.exports = {
  saveToDisk,
  loadFromDisk,
};
