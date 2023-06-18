import { timeEnd, time, log } from "console";
import { open, readFile } from "fs/promises";
import { pipeline, finished } from "stream"; // callback way
// import { pipeline } from "stream/promises"; // promise way
import { createGzip } from "zlib";

// ########################### Without Streams Just the File Way ############################
/* 
Fails for larger file as we are not clearing put internal buffer rather writing everything at one
go to dest.
RangeError [ERR_FS_FILE_TOO_LARGE]: File size (9894866529) is greater than 2 GiB

(async () => {
  time("Stream");
  const fileHandlerRead = await readFile("./source_file.txt");
  const fileHandlerWrite = await open("./dest_file.txt", "w");
  await fileHandlerWrite.write(fileHandlerRead)
  timeEnd("Stream");
})();
*/


// /* 
// Normal File Way to read data
// Memory : 30-40 MB
// Similar in time as of above
// */
// (async () => {
//   time("Stream");
//   const fileHandlerRead = await open("./write_file.txt", "r");
//   const fileHandlerWrite = await open("./dest_file.txt", "w");
//   /**
//    * @description Reads data from the file and stores that in the given buffer.
//    * If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
//    * @since — v10.0.0
//    * @param buffer — A buffer that will be filled with the file data read.
//    * @param offset — The location in the buffer at which to start filling.
//    * @param length — The number of bytes to read. (Default and max is 16384)
//    * @param position - The location where to begin reading data from the file. If null, data will be read from the current file position, and the position will be updated. If position is an integer, the current file position will remain unchanged.
//    * @return — Fulfills upon success with an object with two properties:
//    */
//   let bytesReadSoFar;
//   const bytesLength = 16384;
//   do {
//     const { bytesRead, buffer } = await fileHandlerRead.read();
//     bytesReadSoFar = bytesRead;
//     if (bytesReadSoFar != bytesLength) {
//       const indexOfZero = buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfZero);
//       buffer.copy(newBuffer, 0, 0, indexOfZero); // copy buffer from index 0 to indexOfZero into newBuffer starting from index 0
//       fileHandlerWrite.write(newBuffer);
//     } else {
//       fileHandlerWrite.write(buffer);
//     }
//   } while (bytesReadSoFar!=0);
//   timeEnd("Stream");
// })();


/* 
Using Streams
Memory : 20-25 MB
Faster than above
(async () => {
  time("Stream");
  const fileHandlerRead = await open("./source_file.txt", "r");
  const fileHandlerWrite = await open("./dest_file.txt", "w");
  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandlerWrite.createWriteStream();
  readStream.pipe(writeStream);
  await finished(readStream);
  readStream.on("end", () => {
    timeEnd("Stream");
  });
})();
*/

/*
Ideally, we should not use pipe() in production, instead use pipeline().
Using Streams (pipeline() callback way)
Memory : 20-25 MB
Similar as pipe()

(async () => {
  time("Stream");
  const fileHandlerRead = await open("./source_file.txt", "r");
  const fileHandlerWrite = await open("./dest_file.txt", "w");
  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandlerWrite.createWriteStream();
  const createZip = createGzip({ level: 5 });
  // Middle Streams must be duplex/transform
  pipeline(readStream, createZip, writeStream, (err) => {
    if (err) log(err);
    else log("Successful");
    timeEnd("Stream");
  });
})();
*/

/*
 pipeline() promise way

(async () => {
  time("Stream");
  try {
    const fileHandlerRead = await open("./source_file.txt", "r");
    const fileHandlerWrite = await open("./dest_file.txt", "w");
    const readStream = fileHandlerRead.createReadStream();
    const writeStream = fileHandlerWrite.createWriteStream();
    const createZip = createGzip({ level: 5 });
    // Middle Streams must be duplex/transform
    await pipeline(readStream, createZip, writeStream);
  } catch (err) {
    log(err);
  }
})();
*/


(async(req, res, next) => {
  const fileHandlerRead = await open("./source_file.txt", "r");
  const fileHandlerWrite = await open("./dest_file.txt", "w");
  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandlerWrite.createWriteStream();
  pipeline(readStream, writeStream, (err) => {
    if (err) {
      log(err);
      res.status(500).end("something went wrong");
    } else {
      log("Successful");
    }
  }).pipe(res);

  finished(res, (err)=>{
    if(err) res.destroy();
  }); 
})();
