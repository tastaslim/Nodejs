import { log, time, timeEnd } from "console";
import { open } from "fs/promises"; 
(async () => {
  time("Stream");
  const fileHandlerRead = await open("./source_file.txt", "r");
  const fileHandlerWrite = await open("./dest_file.txt", "w");
  const readStreamData = fileHandlerRead.createReadStream({
    highWaterMark: 64 * 1024,
  }); // 65536
  const writeStreamData = fileHandlerWrite.createWriteStream();
  readStreamData.on("data", (chunk) => {
    // chunk is nothing but buffer/raw data
    log(chunk.length);
    if (!writeStreamData.write(chunk)) readStreamData.pause();
  });

  writeStreamData.on("drain", () => {
    readStreamData.resume();
  });

  readStreamData.on("end", () => {
    fileHandlerRead.close();
    timeEnd("Stream");
  });

  writeStreamData.on("finish", () => {
    fileHandlerWrite.close();
  });
})();