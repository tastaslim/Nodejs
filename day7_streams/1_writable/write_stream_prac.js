import { log, time, timeEnd } from "console";
import { open } from "fs/promises";



// Not a good practice. Don't do this way as it is not memory efficient
// Takes 250 ms to complete, CPU usage 100% (1 core), Memory 2.6 GB


/*
(async () => {
    time("Start Stream");
    const fileHandler = await open("./write_file.txt", "w");
    const writeStream = fileHandler.createWriteStream();
    for (let i = 0; i < 10000000; i++){
        const buffer = Buffer.from(`${i} `, 'utf-8');
        writeStream.write(buffer);
    }
    timeEnd("Start Stream");
    fileHandler.close();
})();
*/


/*
(async () => {
  time("Start Stream");
  const streamData = createWriteStream("./write_file.txt", "utf-8");
  // Returns the maximum byte size the internal array to be filled with.
  log(streamData.writableHighWaterMark);
  // This property contains the number of bytes (or objects) in the queue ready to be written. The value provides introspection data regarding the status of the highWaterMark.
  log(streamData.writableLength); // Gives 0 as no data is present in writable stream yet.

  const buffer = Buffer.from("Taslim");
  streamData.write(buffer);
  streamData.write(buffer);
  streamData.write(buffer);
  streamData.write(buffer);
  streamData.write(buffer);
  log(streamData.writableLength); // Gives 30 as each char is represented as 1 byte.
  
  // If you see above example, we are pushing data to internal buffer, irrespective of
  //  the writableHighWaterMark or writableLength. There will a time, when our internal buffer would be
  //  filled with so much data that we might run into memory issue (Backpressure). The same
  //  problem which we are facing with below for loop, because we are not clearing out the internal
  //  buffer once one chunk is written to dest successfully.

  // for (let i = 0; i < 1000000; i++) {
  //   const buffer = Buffer.from(`${i} `, "utf-8");
  //   streamData.write(buffer);
  // }
  timeEnd("Start Stream");
}) ();

*/

// Let's fix above problem
/*
const writeDataStream = async() => {
  const fileHandler = await open("./write_file.txt", "w");
  const streamData = fileHandler.createWriteStream();
  // const buff = Buffer.alloc(1684, "a"); // returns true as internal buffer is not full
  const buff = Buffer.alloc(16384, "a"); // Fill each bytes with a
  log(streamData.write(buff)); // Returns false because internal buffer is full
  log(streamData.writableLength);

  // for (let i = 0; i < 1000000; i++) {
  //   const buffer = Buffer.from(`${i} `, "utf-8");
  //   if (!streamData.write(buffer)) {
  //     streamData.emit();
  //   }
  // }

  streamData.on("drain", async () => {
    log("Drain is called. Clear the internal buffer and write it to again");
    // await writeDataStream();
    log(streamData.write(Buffer.alloc(230, "a")));
    log(streamData.writableLength);
    log(streamData.write(Buffer.alloc(12, "b")));
    log(streamData.writableLength);
  
    // streamData.write(Buffer.alloc(16384, "a")); Never ever
    
    // Note: Never write a chunk of size >= writableHighWaterMark inside the drain event,
    // otherwise, this event will keep on getting called (as .write(buff) method will return false and this event will get called every time) and you will get in a infinite loop.
     
  });

  // await fileHandler.close();
};
*/

// Good practice. Use this way as it is memory efficient
// Takes 260 ms to complete, CPU usage 100% (1 core), Memory 50 MB

(async () => {
  let i = 0,
    drain = 0;
  time("Start Stream");
  const number_of_writes = 100000000;
  const fileHandler = await open("./write_file.txt", "w");
  const writeStream = fileHandler.createWriteStream();

  /*
  ########################  Writable Stream Properties ###########################

  // Is true after 'close' has been emitted
  log(`Is Stream Closed: ${writeStream.closed}`);

  //The number of bytes written so far. Does not include data that is still queued for writing
  log(`${writeStream.bytesWritten}`);

  //Returns error if the stream has been destroyed with an error.
  log(`${writeStream.errored}`);

  //Is true if it is safe to call writable.write(), which means the stream has not been destroyed, errored, or ended.
  log(`${writeStream.writable}`);
  
  //Return the value of highWaterMark passed when creating Writable Stream. Default value is 16KB.
  log(writeStream.writableHighWaterMark);
  
  // This property contains the number of bytes (or objects) in the queue ready to be written. The value provides introspection data regarding the status of the highWaterMark.
  log(writeStream.writableLength);

  // Is true if the stream's buffer has been full and stream will emit 'drain'
  log(writeStream.writableNeedDrain);

  // setDefaultEncoding method sets the default encoding for a Writable stream.
  log(writeStream.setDefaultEncoding("utf-8"));
  */
  
  const writeMany = () => {
    while (i < number_of_writes) {
      const buffer = Buffer.from(`${i} `, "utf-8");
      if (i === number_of_writes - 1) return writeStream.end(buffer);
      if (!writeStream.write(buffer)) break;
      i = i + 1;
    }
  };

  writeMany();
  writeStream.on("drain", () => {
    log("Drain called !!!");
    drain++;
    writeMany();
  });

  writeStream.on("finish", () => {
    timeEnd("Start Stream");
    log(drain);
    fileHandler.close();
  });

  // Called when we close the stream // .close() function
  writeStream.on("close", () => {
    log("Stream was closed");
  });
})();