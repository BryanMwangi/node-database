const database = require("./db");

let collections = {};

collections = database.collections; //should be an object containing collections

//check if no collections are present define a check that can run before every query
const noCollectionsPresent =
  Object.keys(collections).length === 0 || collections === null;

function creatCollection(name) {
  if (!collections.name) {
    collections[name] = [];
    return { message: `Collection ${name} created.` };
  } else {
    return { error: `Collection ${name} already exists.` };
  }
}

module.exports = {
  collections,
  noCollectionsPresent,
  creatCollection,
};
