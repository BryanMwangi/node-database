const pino = require("pino");

const fileTransport = pino.transport({
  targets: [
    {
      target: "pino/file",
    },
    {
      target: "pino-pretty",
      options: { destination: `./Volumes/db.log` },
    },
  ],
  options: {
    destination: `./Volumes/db.log`,
    colorize: true,
    destination: 1,
  },
});

const logger = pino(fileTransport);

module.exports = { logger };
