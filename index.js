const { v4 } = require("uuid");
const { parseLogs, parseConfigs, printRay } = require("./utils");
const fetch = require("node-fetch");
const { send } = require("@ayshptk/msngr");

function init(config) {
  this.ray = function (context) {
    return new ray(context, config);
  };
}

function ray(context, config) {
  this.context = context;
  this.config = new parseConfigs(config);
  this.printLogs = this.config.printLogs();
  this.rayId = v4();
  this.startTime = new Date().toISOString();
  this.logs = [];
  this.addLog = (label, message, ...optionalParams) => {
    this.logs.push({
      log: parseLogs(label, ":", message, ...optionalParams),
      timestamp: new Date().toISOString(),
    });
  };
  this.log = function (message, ...optionalParams) {
    if (this.printLogs) {
      console.log(message, ...optionalParams);
    }
    this.addLog("LOG", message, ...optionalParams);
  };
  this.warn = function (message, ...optionalParams) {
    if (this.printLogs) {
      console.warn(message, ...optionalParams);
    }
    this.addLog("WARN", message, ...optionalParams);
  };
  this.error = function (message, ...optionalParams) {
    if (this.printLogs) {
      console.error(message, ...optionalParams);
    }
    this.addLog("ERROR", message, ...optionalParams);
  };
  this.info = function (message, ...optionalParams) {
    if (this.printLogs) {
      console.info(message, ...optionalParams);
    }
    this.addLog("INFO", message, ...optionalParams);
  };
  this.debug = function (message, ...optionalParams) {
    if (this.printLogs) {
      console.debug(message, ...optionalParams);
    }
    this.addLog("DEBUG", message, ...optionalParams);
  };
  this.getLogs = function () {
    printRay(this.rayId, this.logs);
  };
  this.send = async function () {
    if (this.local) {
      console.warn("log printing is enabled");
      printRay(this.rayId, this.logs);
    }
    await fetch(this.config.loggerServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.config.loggerServiceApiKey,
      },
      body: JSON.stringify({
        rayId: this.rayId,
        logs: this.logs,
        context: this.context,
        startTime: this.startTime,
        endTime: new Date().toISOString(),
      }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (json.status === "success") {
          if (this.config.printLogs) {
            console.info(`logs sent for ${this.rayId}`);
          }
          return this.rayId;
        }
        throw new Error(json.message);
      })
      .catch((err) => {
        console.error("CRITICAL ERROR WHILE SENDING LOGS", err.message);
      });
  };
}

module.exports = init;
