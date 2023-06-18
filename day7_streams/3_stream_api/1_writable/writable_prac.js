import { Writable } from "stream";
import {open, write, close, createWriteStream} from "fs";
import { log, time, timeEnd } from "console";
/*
 BTW, don't use below set of code in Prod. It is just for education purpose. Instead use createWriteStream().
 Also when working with streams, any error happens, don't throw or emit the error instead just pass the error
 to callback function, node.js will handle it properly.

 Wrong Way:
 throw new Error("Some Error");
 throw Error("Some Error");
 this.emit("error")
;
 Correct Way:
 if(err) callback(err);


 Here we are writing to a file but you can modify it to write to a network call or whatever.
 */

class FileWriteStream extends Writable {
  constructor({ highWaterMark, filename }) {
    super({ highWaterMark });
    this.filename = filename;
    this.fileDescriptor = null;
    this.internalBuffer = [];
    this.chunkSize = 0;
    this.numberOfWrites = 0;
    // writableHighWaterMark is property of Writable Stream (Base class)
    this.highWaterMark = highWaterMark || this.writableHighWaterMark;
  }
  /* 
  This method runs after our constructor and before any other method like _write, _final, _destroy etc.
  callback <Function> Call this function (optionally with an error argument) when the stream has finished initializing.
  The _construct() method MUST NOT be called directly. It may be implemented by child classes, and if so, will be called by the internal Writable class methods only.
  This optional function will be called in a tick after the stream constructor has returned, delaying any _write(), _final() and _destroy() calls until callback is called. This is useful to initialize state or asynchronously initialize resources before the stream can be used.
   
  */
  _construct(callback) {
    open(this.filename, "w", (err, fileDescriptor) => {
      if (err) {
        // With argument means, we have an error and should not proceed.
        callback(err);
      } else {
        this.fileDescriptor = fileDescriptor;
        // no arguments means, it is successful.
        callback();
      }
    });
  }
  //

  /*
    This method is called when write() is called on writable stream. You can consider callback as  "drain" event. 
    You don't need to drain yourself, let node.js do the draining.
    Never try to implement write() method yourself. Node does that using _write() under the hood.
  */

  _write(chunk, encoding, callback) {
    this.chunkSize += chunk.length;
    this.internalBuffer.push(chunk);
    if (this.chunkSize > this.highWaterMark) {
      //Write buffer to the file specified by fileDescriptor.
      write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err) => {
        if (err) {
          return callback(err);
        }
        this.internalBuffer = [];
        this.chunkSize = 0;
        ++this.numberOfWrites;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err) => {
      if (err) return callback(err);
      ++this.numberOfWrites;
      this.internalBuffer = [];
      callback();
    });
  }

  _destroy(error, callback) {
    // error will be null in case of successful write
    log(`Total number of writes on file : ${this.numberOfWrites}`);
    if (this.fileDescriptor) {
      close(this.fileDescriptor, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

// // Never ever call _write() method. Let node js call that under the hood when you call write() method.
// // Let's go ahead and use our above custom writable Stream to write into a file.

(async () => {
  let i = 0;
  time("Start Stream");
  const number_of_writes = 10000;
  const writeStream = new FileWriteStream({ filename: "write_file.txt" }); // createWriteStream("./write_file.txt")
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
    writeMany();
  });

  writeStream.on("finish", () => {
    timeEnd("Start Stream");
  });

  // Called when we close the stream // .close() function
  writeStream.on("close", () => {
    log("Stream was closed");
  });
})();

