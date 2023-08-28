const secureEnv = require("secure-env");
var fs = require('fs');
const path = require("path");
global.env = secureEnv({});

const APM_SERVICE_NAME = process.env.APM_SERVICE_NAME || global.env.APM_SERVICE_NAME || "gic-emr-backend";
const APM_SERVER_URL = process.env.APM_SERVER_URL || global.env.APM_SERVER_URL || "";
const APM_API_KEY = process.env.APM_API_KEY || global.env.APM_API_KEY || "";
const ENV = process.env.ENV || global.env.ENV || "development";
const ELASTICSEARCH_CLOUD_ID = process.env.ELASTICSEARCH_CLOUD_ID || global.env.ELASTICSEARCH_CLOUD_ID || "";
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY || global.env.ELASTICSEARCH_API_KEY || "";
const APM_ACTIVE = process.env.APM_ACTIVE || global.env.APM_ACTIVE || false;

const apm = require("elastic-apm-node").start({
  serviceName: APM_SERVICE_NAME,
  serverUrl: APM_SERVER_URL,
  apiKey: APM_API_KEY,
  environment: ENV,
  active: APM_ACTIVE,
});

const { transports } = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");
const esTransportOpts = {
  apm,
  level: "info",
  service_name: APM_SERVICE_NAME,
  indexPrefix: `gic-logs-${APM_SERVICE_NAME}`,
  indexSuffixPattern: "YYYY.MM",
  clientOpts: { cloud: { id: ELASTICSEARCH_CLOUD_ID }, auth: { apiKey: ELASTICSEARCH_API_KEY } },
};
const esTransport = new ElasticsearchTransport(esTransportOpts);
const winston = require("winston");
winston.loggers.add('elasticsearch', {
  transports: [
    new ElasticsearchTransport({
      apm,
      level: 'info',
      service_name: APM_SERVICE_NAME,
      indexPrefix: `gic-logs-${APM_SERVICE_NAME}`,
      indexSuffixPattern: 'YYYY.MM',
      clientOpts: { cloud: { id: ELASTICSEARCH_CLOUD_ID },
        auth: { apiKey: ELASTICSEARCH_API_KEY } },
    }),
    new winston.transports.Console({ level: 'warn' }),
  ],
});

import { spawn } from 'child_process';
console.log('# starting unoserver listener...');
try {
  var listener = spawn('unoserver', ['--daemon']);
} catch (err) {
  console.error(err)
}


import { Server } from "./network";

Server.start();
