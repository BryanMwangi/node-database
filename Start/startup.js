const crypto = require("crypto");
const FS = require("fs");
const configFile = "config.json";
let config = JSON.parse(FS.readFileSync(configFile));

/*
    The config file is read to determine the configuration of each db server
    The config file should never be edited until further notice
*/

let pid = null;

pid = config.pid;

function pidCheck() {
  if (pid) {
    console.log("Using existing pid: " + pid);
    config = null; //clear memory
    return;
  } else {
    //generate new 8 bit pid to be used
    pid = crypto.randomBytes(8).toString("hex");
    config.pid = pid;
    FS.writeFileSync(configFile, JSON.stringify(config));
    console.log("New pid generated: " + pid);
    config = null; // clear memory
  }
}

pidCheck();

module.exports = pid;
