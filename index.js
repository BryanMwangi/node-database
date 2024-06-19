const http = require("node:http");
const port = 9923;
const host = "0.0.0.0";
const { logger } = require("./Logs/logs");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  const pathParts = url.pathname.split(`/`).filter((part) => part);
  const method = req.method;

  switch (method) {
    case "GET":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("You just made a GET request!");
      break;
    case "PUT":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("You just made a PUT request!");
      break;
    case "POST":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("You just made a POST request!");
      break;
    case "DELETE":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("You just made a DELETE request!");
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      break;
  }
});

server.listen(port, () => {
  logger.info(`Server is running on http://${host}:${port}`);
});
