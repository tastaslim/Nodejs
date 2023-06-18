import { Readable } from "stream";
import {open, read, close, createReadStream} from "fs";
import { log, time, timeEnd } from "console";
/*
 BTW, don't use below set of code in Prod. It is just for education purpose. Instead use createReadStream().
 Also when working with streams, any error happens, don't throw or emit the error instead just pass the error
 to callback function, node.js will handle it properly.

 Wrong Way:
 throw new Error("Some Error");
 throw Error("Some Error");
 this.emit("error")
;
 Correct Way:
 if(err) callback(err);


 Here we are read from a file but you can modify it to read from network or whatever.
 */

export class FileReadStream extends Readable {
  constructor({ highWaterMark, filename }) {
    super({ highWaterMark });
    this.filename = filename;
    this.fileDescriptor = null;
    this.numberOfReads = 0;
  }
  /* 
  This method runs after our constructor and before any other method like _write, _final, _destroy etc.
  callback <Function> Call this function (optionally with an error argument) when the stream has finished initializing.
  The _construct() method MUST NOT be called directly. It may be implemented by child classes, and if so, will be called by the internal Writable class methods only.
  This optional function will be called in a tick after the stream constructor has returned, delaying any _write(), _final() and _destroy() calls until callback is called. This is useful to initialize state or asynchronously initialize resources before the stream can be used.
   
  */
  _construct(callback) {
    open(this.filename, "r", (err, fileDescriptor) => {
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
    This method is called when read() is called on readable stream.
    Never try to implement read() method yourself. Node does that using _read() under the hood.
  */

  _read(size) {
    const buffer = Buffer.alloc(size);
    read(this.fileDescriptor, buffer, 0, size, null, (err, bytesRead) => {
      log(bytesRead);
      if (err) return this.destroy(err);
      else this.push(bytesRead ? buffer.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
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

// (async () => {
//   time("Start Stream");
//   const fileReader = new FileReadStream({ filename : "../writable/write_file.txt", highWaterMark : 64});
//   // const fileReader = createReadStream("../writable/write_file.txt");
//   fileReader.on("data", (chunk) => {
//     const data = chunk.toString("utf-8");
//     log(data);
//   });
//   fileReader.on("end", () => {
//     log(fileReader.numberOfReads);
//   });
// })();

