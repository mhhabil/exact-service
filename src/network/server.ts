import express from "express";
//import mongoose from 'mongoose'
import morgan from "morgan";
const timeout = require("connect-timeout");
import fileUpload = require("express-fileupload");
import { AlyaWS } from "@gic-indonesia/messaging-socket";
import { applyRoutes } from "./router";
import { MedicalRecordService, DicomService, StorageService } from "./../services";
const cors = require("cors");
const debugEMR = require("debug")("emr");
const APM_SERVICE_NAME = process.env.APM_SERVICE_NAME || global.env.APM_SERVICE_NAME || "gic-emr-backend";
const REDIS_HOST = process.env.REDIS_HOST || global.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || global.env.REDIS_PORT || 6789;
const REDIS_USERNAME = process.env.REDIS_USERNAME || global.env.REDIS_USERNAME || "default";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || global.env.REDIS_PASSWORD || "";
const ENV = process.env.ENV || global.env.ENV || "development";
const GCP_CLOUD_REGION = process.env.GCP_CLOUD_REGION || global.env.GCP_CLOUD_REGION || "";
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || global.env.GCP_PROJECT_ID || "";
const OHIF_VIEWER = process.env.OHIF_VIEWER || global.env.OHIF_VIEWER || "";
const DATASET_ID = process.env.GCP_DATASET_ID || global.env.GCP_DATASET_ID || "";
const GCP_BUCKET_NAME = process.env.GCP_BUCKET_NAME || global.env.GCP_BUCKET_NAME || "";
const GCS_KEY_NAME = process.env.GCS_KEY_NAME || global.env.GCS_KEY_NAME || "";
const GCS_KEY_VALUE = process.env.GCS_KEY_VALUE || global.env.GCS_KEY_VALUE || "";

const alyaWS = new AlyaWS('emr');


const PORT = (process.env.PORT as string) || "3022";
const alyaHostSocket = process.env.ALYA_HOST_SOCKET ?? '';

import RBAC from "../services/rbac";
import MessagingService from "./messaging";

class Server {
    private _app: express.Application;

    constructor() {
        this._app = express();
        const expressWsInstance = alyaWS.init(this._app, alyaHostSocket, { serviceSecret:'12345' });
        this._app = expressWsInstance.app;
        //this._app = http2Express(express);
        // this._app.options('*', cors());

        this._config();
    }

    private _config() {
        this._app.set("port", PORT);
        this._app.use(morgan("dev"));
        this._app.use(express.json({ limit: "25mb" }));
        this._app.use(express.urlencoded({ extended: false }));
        this._app.use("*", cors());

        this._app.use(fileUpload({}));
        this._app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
            next();
        });
        this._app.use(timeout("20s"));
        applyRoutes(this._app);
    }

    public async start(): Promise<void> {
        //http2.createSecureServer(options, this._app).listen(PORT);
        this._app.listen(PORT, () => {
            debugEMR(`Server running at port ${PORT}`);
            const { networkInterfaces } = require("os");
            const nets = networkInterfaces();
            const results = Object.create(null); // Or just '{}', an empty object

            for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                    if (net.family === "IPv4" && !net.internal) {
                        if (!results[name]) {
                            results[name] = [];
                        }
                        results[name].push(net.address);
                    }
                }
            }
        });

        try {
            await RBAC.getInstance().connect();
            const redisConnectionString = `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
            global.medicalRecord = new MedicalRecordService({
                url: redisConnectionString,
            }, ENV);
            await global.medicalRecord.connect();

            global.messagingService = new MessagingService(this._app);

            global.dicom = new DicomService(OHIF_VIEWER, GCP_CLOUD_REGION, GCP_PROJECT_ID, DATASET_ID, {
                url: redisConnectionString,
            });
            // await Alya.getInstance().connect('gic-emr-backend')
            await global.dicom.connect();

            global.storage = new StorageService(GCP_BUCKET_NAME, GCS_KEY_NAME, GCS_KEY_VALUE, {
                url: redisConnectionString,
            });
            await global.storage.connect();
        } catch (e) {
            console.error(e);
        }
    }
}

const server = new Server();

export { server as Server };
