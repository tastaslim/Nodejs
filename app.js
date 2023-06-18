// // import buffer from "buffer";
// // import { log } from "console";
// // log(buffer.kMaxLength)
// import { log } from "console";
// import { watch } from "fs/promises";
// (async () => {
//   const watcher = watch("./");
//   for await (const event of watcher) {
//     log(event);
//   }
// })();


import { FileReadStream } from "./day7_streams/stream_api/readable/readable_prac.js";
import { time, timeEnd, log } from "console";
const readFile = () => {
  time("Start Stream");
  const fileReader = new FileReadStream({
    filename: "./day7_streams/stream_api/writable/write_file.txt",
    highWaterMark: 10*1024,
  });
  // const fileReader = createReadStream("../writable/write_file.txt");
  fileReader.on("data", (chunk) => {
    // const data = chunk.toString("utf-8");
    // log(data);
  });
  fileReader.on("end", () => {
    timeEnd("Start Stream");
  });
};

readFile();

