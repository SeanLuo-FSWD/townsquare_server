import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";

import { connectDB } from "./src/util/database.util";

import APIRouter from './src/router/api.router';

import errorHandlingMiddleware from "./src/middleware/errorHandling.middleware";

import SocketIO from "./src/util/socketIO.util";

class App {
    private _app: express.Application;
    private readonly _port: string | number;
    private apiRouter = new APIRouter();
    private _socketIO;
    
    constructor() {
        this._app = express();
        dotenv.config();
        this.initializeMiddleWares();
        this.initAPIRouter();
        console.log(process.env.PORT);
        this._port = process.env.PORT || 8000;
        this.initErrorHandling();
        this._socketIO = new SocketIO(this._app);
        this.initHostingReactUI();
    }

    public async startServer() {
        await connectDB();
        this._socketIO.initServer();
    }

    public initializeMiddleWares() {
        require("./src/middleware/express.middleware")(this._app);
    }

    public initAPIRouter() {
        this._app.use(`${this.apiRouter.path}`, this.apiRouter.router);
    }

    public initErrorHandling() {
        this._app.use(errorHandlingMiddleware);
    }

    public initHostingReactUI() {
        this._app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname + '/public/index.html'))
        })
    }

    get app() {
        return this._app;
    }
}

export default App;