import { PassThrough, Transform } from "stream";
import { open } from "fs/promises";
import { log } from "console";
import { createGunzip } from "zlib";
/*
class MyCrypto extends Transform {
    constructor({ writableHighWaterMark, readableHighWaterMark }) {
        super({ writableHighWaterMark, readableHighWaterMark });
    }

    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; i++) {
            if (i != 255) {
                chunk[i] -= 1;
            }
        }
        this.push(chunk);
        log(chunk.toString("utf-8"));
        callback();
    }

    _flush(callback) {
        log("Write Something Extra to output stream when Input stream is completed.");
        this.push("hello There");
        callback(null);
    }
}

class MyPassThrough extends PassThrough {
  constructor({ writableHighWaterMark, readableHighWaterMark }) {
    super({ writableHighWaterMark, readableHighWaterMark });
  }

  _transform(chunk, encoding, callback) {
    log(chunk.toString("utf-8"));
    callback(null, chunk);
  }
}

(async () => {
  const fileHandlerRead = await open("./doc.md", "r");
  const fileHandlerWrite = await open("doc_ft.md", "w");
  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandlerWrite.createWriteStream();
  const crypto = new MyCrypto({});
  readStream.pipe(crypto).pipe(writeStream);
//   readStream.pipe(createGunzip({ level: 2 })).pipe(crypto).pipe(writeStream);
})();
*/




const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        // Do some transformation of input stream
        log(chunk.toString("utf-8"));
        callback(null, chunk);
    },
    
    flush(callback) {
        log("Write Something Extra to output stream when Input stream is completed.");
        this.push("hello There");
        callback(null);
    }
});


(async () => {
  const fileHandlerRead = await open("./dest_doc.md", "r");
  const fileHandlerWrite = await open("doc_final_dest.md", "w");
  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandlerWrite.createWriteStream();
  //   readStream.pipe(crypto).pipe(writeStream);
  readStream
    .pipe(createGunzip({ level: 2 }))
    .pipe(transformStream)
    .pipe(writeStream);
})();
