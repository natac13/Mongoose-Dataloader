"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prop2 = _interopRequireDefault(require("ramda/src/prop"));

var _map2 = _interopRequireDefault(require("ramda/src/map"));

var _zipObj2 = _interopRequireDefault(require("ramda/src/zipObj"));

var _chain2 = _interopRequireDefault(require("ramda/src/chain"));

var _curry2 = _interopRequireDefault(require("ramda/src/curry"));

var _dataloader = _interopRequireDefault(require("dataloader"));

/* https://www.youtube.com/watch?v=ld2_AS4l19g&app=desktop */

/* https://github.com/ramda/ramda/wiki/Cookbook#make-an-object-out-of-a-list-with-keys-derived-form-each-element */
const objFromListWith = (0, _curry2.default)((fn, list) => (0, _chain2.default)(_zipObj2.default, (0, _map2.default)(fn))(list));
/**
 * A one-to-one mapping of keys to returned documents from mongodb.
 * Meaning that for each key that is called with Loader.load() will return a document from
 * the DB.
 *
 * From the requirements on the Dataloader readme.md a Batch Function:
 * Accepts an arrys of keys and returns a promise that resolves to an arravy of values that
 * is the same length as the array of keys; and the return ordering of values must match the
 * input array of keys. See https://github.com/graphql/dataloader#batch-function
 * 
 * @param {*} model - Mogoose Model
 * @param {string} [field='_id'] - Which Field to use for searching the DB for documents.
 * @param {*} keys args to the batch function
 * @returns
 */

function createOneToOneMongooseLoader(model, field = '_id', projection = {
  __v: false
}) {
  return new _dataloader.default(async keys => {
    // Use .find() to get all docs for the respective keys.
    const results = await model.find({
      [field]: {
        $in: keys
      }
    }, projection); // create a hash with keys of the field's value with the value the corresponding doc
    // from the results array with the matching field value

    const hash = objFromListWith((0, _prop2.default)(field), results); // async function will wrap an value returned in a Promise; meaning second requirement

    return keys.map(key => hash[key.toString()]);
  });
} // * Usage: new Dataloader((keys) => createOneToOneMongooseLoader(model, keys, field))
// function createOneToOneMongooseLoader(model, keys, field = '_id') {
//   const results = await model.find({ [field]: { $in: keys } }, projection);
//   const hash = objFromListWith(R.prop(field), results);
//   return R.map((key) => hash[key.toString()])(keys);
// } 


var _default = createOneToOneMongooseLoader;
exports.default = _default;