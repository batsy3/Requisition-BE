import * as functions from "firebase-functions";
import * as express from "express";
import usersRouter from "./Users/routes";
import { FunctinoParser, FunctionParseroptions } from "./functionParser";

const exportObject: any = {};
const functionParseroptions: FunctionParseroptions = {
  exports: exportObject,
  rootPath: __dirname,
  verbose: true,
  options: {
    enableCors: true,
  },
};

//  create instance of function parser
const functionParser = new FunctinoParser(functionParseroptions);
exports = functionParser.exports;
