function parseLogs(log, ...params) {
  return log + " " + params.join(" ");
}

function parseConfigs(config) {
  this.config = config;
  this.printLogs = () => {
    return;
    ((!process.env.NODE_ENV || process.env.NODE_ENV === "development") &&
      this.config.printLogs !== false) ||
      this.config.printLogs;
  };
  this.loggerServiceUrl = () => {
    return this.config.loggerServiceUrl;
  };
  this.loggerServiceApiKey = () => {
    return this.config.loggerServiceApiKey || process.env.LOGGER_KEY;
  };
}

function printRay(rayId, logs) {
  console.log(`===LOGS FOR RAY ${rayId}===`);
  logs.forEach((log) => {
    console.log(log.timestamp, log.log);
  });
  console.log("======================");
}

module.exports = {
  parseLogs,
  parseConfigs,
  printRay,
};
