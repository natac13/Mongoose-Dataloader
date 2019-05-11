"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prop2 = _interopRequireDefault(require("ramda/src/prop"));

var _groupBy2 = _interopRequireDefault(require("ramda/src/groupBy"));

var _dataloader = _interopRequireDefault(require("dataloader"));

/* One-to-Many mapping of keys to an array of docs. Such as querying with a courseId for a list of classes. */
function createOnetoManyMongooseLoader(model, field = '_id', projection = {
  __v: false
}) {
  return new _dataloader.default(async keys => {
    // Query the db for the requested docs in an array of arrays.
    const results = await model.find({
      [field]: {
        $in: keys
      }
    }, projection); // create the hash with the key as the field's values with the values as the array of
    // found documents that match the keys for the respective field

    const hash = (0, _groupBy2.default)((0, _prop2.default)(field), results); // map the keys so that I return the array of doc that matches each key passed in.

    return keys.map(key => hash[key.toString()]);
  });
}

var _default = createOnetoManyMongooseLoader;
exports.default = _default;