import { log } from "console";
import fs from "fs/promises";
import { createServer } from "http";
import { resolve } from "path";
const __dirname = resolve();
const server = createServer(async (req, res) => {
  const dataBuffer = await fs.readFile(
    __dirname + "/../Rich-Dad-Poor-Dad-eBook.pdf"
  );
  console.log("Being Done");
  res.statusCode = 200;
  res.statusMessage = "Successful";
  res.setHeader("Content-Type", "text/plain");
  res.end(dataBuffer.toString("utf-8"));
});
server.listen(3000, () => {
  log(`Server running on port 3000`);
});
