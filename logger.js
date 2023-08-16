const {Console} = require("console");
const fs = require("fs");
const {logDir} = require("./config");

const fileLogger = (filename) => {
  // Constructor
  let logger = new Console({
    stdout: fs.createWriteStream(`${logDir}${filename}.txt`),
  });

  function writeLog(message, fileOnly) {
    logger.log(message);
    if (!fileOnly) {
      console.log(`\n${message}`);
    }
  }

  return writeLog
}

module.exports = {fileLogger}
