import { FieldPath } from "firebase-admin/firestore";
import { ParserOptions } from "firebase-backend";
import { glob } from "glob";
import { parse, ParsedPath } from "path";
import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";
import router from "./Users/routes";
import { Endpoint, RequestType } from "./models";

export interface FunctionParseroptions {
  rootPath: string;
  exports: any;
  options?: ParserOptions;
  verbose?: boolean;
}
const { log } = console;
export class FunctinoParser {
  rootPath: string;

  enableCors: boolean;
  exports: any;
  verbose: boolean;
  constructor(props: FunctionParseroptions) {
    const { options, exports, rootPath, verbose = false } = props;
    //   check if filepath was specified else throw error
    if (!rootPath) throw Error("filepath not specified");
    this.rootPath = rootPath;
    this.exports = exports;
    this.verbose = verbose;
    this.enableCors = options?.enableCors ?? false;

    let groupByFolder = options?.groupByFolder ?? true;
    let buildReactive = options?.buildReactive ?? true;
    let buildEndpoints = options?.buildEndpoints ?? true;

    if (buildReactive) {
      this.buildReactiveFunctions(groupByFolder);
    }
    if (buildEndpoints) {
      this.buildEndpointsFunctions(groupByFolder);
    }
  }
  private buildReactiveFunctions(groupByFolder: boolean) {
    // check if verbose logging is enabled
    if (this.verbose) log("Building Reactive Functinos...");

    // Get all the files that has .function in the file name
    const functionFiles: string[] = glob.sync(
      `${this.rootPath}/**/*.function.js`,
      { cwd: this.rootPath, ignore: "./node_modules/**" }
    );
    log(functionFiles);

    functionFiles.forEach((file: string) => {
      const filePath: ParsedPath = parse(file);
      const directories: string[] = filePath.dir.split("/");
      const groupName = groupByFolder
        ? directories[directories.length - 1] || ""
        : directories[directories.length - 2];
      const functionName = filePath.name.replace(".function", "");

      if (!this.exports[groupName]) this.exports[groupName] = {};
      if (this.verbose)
        log(`Reactive Functions - Added ${groupName}/${functionName}`);
      this.exports[groupName] = {
        ...this.exports[groupName],
        // dynamically imports the function module to group exports
        ...require(file),
      };
    });
  }
  private buildEndpointsFunctions(groupByFolder: boolean) {
    if (this.verbose) log("Restful Endpoints - Building...");

    const apiFiles: string[] = glob.sync(`${this.rootPath}/**/*.endpoint.js`, {
      cwd: this.rootPath,
      ignore: "./node_modules/**",
    });
    const app: express.Application = express();
    const groupRouters: Map<string, express.Router> = new Map();

    apiFiles.forEach((file: string) => {
      const filePath: ParsedPath = parse(file);

      const directories: Array<string> = filePath.dir.split("/");

      const groupName: string = groupByFolder
        ? directories[directories.length - 2] || ""
        : directories[directories.length - 1] || "";
      let router: express.Router | undefined = groupRouters.get(groupName);
      if (!router) {
        router = express.Router();
        groupRouters.set(groupName, router);
      }
      try {
        this.buildEndpoint(file, groupName, router);
      } catch (error) {
        `Restful Endpoints - Failed to add the endpoint defined in ${file} to the ${groupName} Api.`;
      }
      app.use("/", router);
      this.exports[groupName] = {
        ...this.exports[groupName],
        api: functions.https.onRequest(app),
      };
    });
    if (this.verbose) log("Restful Endpoints - Built");
  }

  private buildEndpoint(
    file: string,
    groupName: string,
    router: express.Router
  ) {
    const filePath: ParsedPath = parse(file);
    const endpoint = require(file).default as Endpoint;
    const name = endpoint.name || filePath.name.replace(".endpoint", "");
    const { handler } = endpoint;
    if (this.enableCors) router.use(cors);
    switch (endpoint.requestType) {
      case RequestType.GET:
        router.get(`${name}`, endpoint.options?.middlewares ?? [], handler);
        break;
      case RequestType.POST:
        router.post(`${name}`, endpoint.options?.middlewares ?? [], handler);
        break;
      case RequestType.PUT:
        router.put(`${name}`, endpoint.options?.middlewares ?? [], handler);
        break;
      case RequestType.DELETE:
        router.delete(`${name}`, endpoint.options?.middlewares ?? [], handler);
        break;
      case RequestType.PATCH:
        router.patch(`${name}`, endpoint.options?.middlewares ?? [], handler);
        break;
      default:
        throw new Error(`Invalid request type ${endpoint.requestType}`);
    }
    if (this.verbose)
      log(
        `Restful Endpoints - Added ${groupName}/${endpoint.requestType}:${name}`
      );
  }
}
