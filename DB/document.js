const { collections, noCollectionsPresent } = require("./collection");

function insertDocument(collectionName, data) {
  try {
    if (noCollectionsPresent) {
      throw new Error("cannot insert document, no collections present");
    } else {
      const requestedCollection = collections[collectionName];
      if (!requestedCollection) {
        throw new Error("cannot insert document, collection does not exist");
      }
      requestedCollection.push(data);
      return { message: "Document inserted successfully" };
    }
  } catch (error) {
    return { error };
  }
}

function getDocuments(collectionName) {
  try {
    if (noCollectionsPresent) {
      throw new Error("cannot get documents, no collections present");
    } else {
      const requestedCollection = collections[collectionName];
      if (!requestedCollection) {
        throw new Error("cannot insert document, collection does not exist");
      }
      return requestedCollection;
    }
  } catch (error) {
    return { error };
  }
}

function getDocument(collectionName, id) {
  try {
    if (noCollectionsPresent) {
      throw new Error("cannot get documents, no collections present");
    } else {
      const requestedCollection = collections[collectionName];
      if (!requestedCollection) {
        throw new Error("cannot insert document, collection does not exist");
      }
      return requestedCollection.findIndex((doc) => doc.id === id);
    }
  } catch (error) {
    return { error };
  }
}

function updateDocument(collectionName, documentId, newDocument) {
  try {
    if (noCollectionsPresent) {
      throw new Error("cannot get documents, no collections present");
    } else if (collections[collectionName]) {
      const index = collections[collectionName].findIndex(
        (doc) => doc.id === documentId
      );
      if (index !== -1) {
        collections[collectionName][index] = newDocument;
        return {
          message: `Document ${documentId} updated in ${collectionName}.`,
        };
      } else {
        return {
          error: `Document ${documentId} not found in ${collectionName}.`,
        };
      }
    } else {
      return { error: `Collection ${collectionName} does not exist.` };
    }
  } catch (error) {
    return { error };
  }
}
module.exports = { insertDocument, getDocuments, getDocument, updateDocument };
