import { Readable, Writable, Duplex } from "stream";
import { open, read, write, close } from "fs";
import { log, time, timeEnd } from "console";
/*
// Incorrect as JS doesn't support multiple inheritance

class DuplexStream extends Readable, Writable{

}
*/

class DuplexStream extends Duplex {
    constructor({ WritableHighWaterMark, ReadableHighWaterMark, readFilename, writeFilename }) {
        super({ WritableHighWaterMark, ReadableHighWaterMark });
        this.writeHighWaterMark = WritableHighWaterMark || this.writableHighWaterMark;
        this.readHighWaterMark = ReadableHighWaterMark || this.readableHighWaterMark;
        this.readFilename = readFilename;
        this.writeFilename = writeFilename;
        this.internalBuffer = [];
        this.chunkSize = 0;
        this.writeFileDescriptor = null;
        this.readFileDescriptor = null;
    }
    _construct(callback) {
        open(this.readFilename, "r", (readErr, readFileDescriptor) => {
            if (readErr) {
              return callback(readErr);
            } else {
              this.readFileDescriptor = readFileDescriptor;
              open(this.writeFilename, "w", (writeErr, writeFileDescriptor) => {
                if (writeErr) {
                  return callback(writeErr);
                } else {
                  this.writeFileDescriptor = writeFileDescriptor;
                  callback();
                }
              });
            }
        });
    }

    _write(chunk, encoding, callback) {
        this.chunkSize += chunk.length;
        this.internalBuffer.push(chunk);
        if (this.chunkSize > this.writeHighWaterMark) {
            write(
              this.writeFileDescriptor,
              Buffer.concat(this.internalBuffer),
              (err) => {
                if (err) return callback(err);
                this.chunkSize = 0;
                this.internalBuffer = [];
                callback();
              }
            );
        } else {
            callback();
        }
    }

    _read(size) {
        const buffer = Buffer.alloc(size);
        read(this.readFileDescriptor, buffer, 0, size, null, (err, bytesRead) => {
            if (err) this.destroy(err);
            this.push(bytesRead ? buffer.subarray(0, bytesRead) : null);
        });
    }
    _final(callback) {
        write(this.writeFileDescriptor, Buffer.concat(this.internalBuffer), (err) => {
            if (err) return callback(err);
            this.internalBuffer = [];
            this.chunkSize = 0;
            callback();
        });
    }

    _destroy(error, callback) {
        if (this.readFileDescriptor) {
            close(this.readFileDescriptor, (readErr) => {
                if (this.writeFileDescriptor) {
                    close(this.writeFileDescriptor, (writeErr) => {
                        callback(writeErr || readErr || error);
                    });
                } else {
                    callback(error);
                }
            });
        } else {
            if (this.writeFileDescriptor) {
                close(this.writeFileDescriptor, (writeErr) => {
                    callback(writeErr || error);
                });
            } else {
                callback(error);
            }
        }
    }
}

(async () => {
    let i = 0;
    time("Start Stream");
    const number_of_writes = 100000000;
    const duplexStream = new DuplexStream({ writeFilename: "write_file.txt", readFilename: 'read_file.txt' });
    const writeMany = () => {
        while (i < number_of_writes) {
            const buffer = Buffer.from(`${i} `, "utf-8");
            if (i === number_of_writes - 1) return duplexStream.end(buffer);
            if (!duplexStream.write(buffer)) break;
            i = i + 1;
        }
    };

    writeMany();
    duplexStream.on("drain", () => {
        writeMany();
    });

    duplexStream.on("data", (chunk) => {
        log(chunk.toString("utf-8"));
    });

    duplexStream.on("finish", () => {
        timeEnd("Start Stream");
    });

    // Called when we close the stream // .close() function
    duplexStream.on("close", () => {
        log("Stream was closed");
    });
})();

