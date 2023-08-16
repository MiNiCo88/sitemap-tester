const cliProgress = require("cli-progress");

const progressBarOpt = {
  format: 'Checking... [{bar}] {percentage}% | ETA: {eta}s | Link {value}/{total} | Errors: {countErr} | Started by {duration_formatted}',
}

module.exports.progressBar = new cliProgress.SingleBar(progressBarOpt);
