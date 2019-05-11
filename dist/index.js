"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createOneToOneMongooseLoader = _interopRequireDefault(require("./createOneToOneMongooseLoader"));

var _createOneToManyMongooseLoader = _interopRequireDefault(require("./createOneToManyMongooseLoader"));

var _default = {
  createOneToOneMongooseLoader: _createOneToOneMongooseLoader.default,
  createOneToManyMongooseLoader: _createOneToManyMongooseLoader.default
};
exports.default = _default;