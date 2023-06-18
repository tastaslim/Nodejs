import { Transform } from "stream";
import { open } from "fs/promises";
import { log } from "console";
// import { createGzip } from "zlib";
class MyCrypto extends Transform {
    constructor({ writableHighWaterMark, readableHighWaterMark }) {
        super({ writableHighWaterMark, readableHighWaterMark });

    }

    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; i++) {
            if (i != 255) {
                chunk[i] += 1;
            }
        }
        log(chunk.toString("utf-8"));

        // You can use any of below.Both have same effect.
        /*
            this.push(chunk);
            callback();
        */
        callback(null, chunk);
    }
}
(async () => {
    const fileHandlerRead = await open("./doc.md", "r");
    const fileHandlerWrite = await open("dest_doc.md", "w");
    const readStream = fileHandlerRead.createReadStream();
    const writeStream = fileHandlerWrite.createWriteStream();
    const crypto = new MyCrypto({});
    readStream.pipe(crypto).pipe(writeStream);
    // readStream.pipe(createGzip({ level: 2 })).pipe(writeStream);
})();