# Writable Stream API #

1. **_construct**: ===> **_construct(callback)**
- This method is called after the constructor() and before any other function like _write(), _final(), _destroy() etc. This method should never be called directly. It may be implemented by child classes, and if so, will be called by the internal Writable class (base) methods only by automatically NodeJs.
- This optional function will be called in a tick after the stream constructor has returned, delaying any _write(), _final() and _destroy() calls until callback is called. This is useful to initialize state or asynchronously initialize resources before the stream can be used.
- **callback method without argument / null** indicates that we were able to initiate the resources properly.
```javascript
import { Writable } from "stream";
class FileReadStream extends Writable{
    constructor({ highWaterMark, filename}){
        super({ highWaterMark });
        this.filename = filename;
        this.fileDescriptor = null;
    }

    // Here it is being used to open the file resource so that it's data can be streamed and setting the fileDescriptor value. Lastly callback() method will send flow to next function.
    _construct(callback){
        open(this.filename, "w", (err, fileDescriptor) => {
            if(err) {
                callback(err);
            } else {
                this.fileDescriptor = fileDescriptor;
                callback();
            }
        });
    }
}
```

2. **_write()** : ==> **_write(chunk, encoding, callback)**
- All Writable stream implementations must provide a writable._write() and/or writable._writev() method to send data to the underlying resource.
- This function **MUST NOT** be called by application code directly. It should be implemented by child classes, and called by the internal Writable class methods only.
- The callback function must be called to indicate whether the write is successful or some error occurred.
- All calls to **writable.write()** that occur between the time ( writable._write() is called and the callback is called will cause the written data to be buffered ). When the callback is invoked, the stream will emit a 'drain' event when the **chunkSize is greater than the writeWaterMark value** otherwise, we will keep on buffering th data in internal buffer.
- The writable._write() method is prefixed with an underscore because it is internal to the class that defines it, and should never be called directly by user programs.
- If the decodeStrings property is explicitly set to false in the constructor options, then chunk will remain the same object that is passed to .write(), and may be a string rather than a Buffer. This is to support implementations that have an optimized handling for certain string data encodings. In that case, the encoding argument will indicate the character encoding of the string. Otherwise, the encoding argument can be safely ignored.
```javascript
import { Writable } from "stream";
class FileReadStream extends Writable{
    constructor({ highWaterMark, filename}){
        super({ highWaterMark });
        this.filename = filename;
        this.fileDescriptor = null;
        this.chunkSize = 0;
        this.internalBuffer = [];
        this.highWaterMark = highWaterMark || this.writableHighWaterMark
    }

    // Here it is being used to open the file resource so that it's data can be streamed and setting the fileDescriptor value. Lastly callback() method will send flow to next function.
    _construct(callback){
        open(this.filename, "w", (err, fileDescriptor) => {
            if(err) {
                callback(err);
            } else {
                this.fileDescriptor = fileDescriptor;
                callback();
            }
        });
    }
/*
  Once callback is called, we mean that one part of chunk is written to internal buffer.
*/
    _write(chunk, encoding, callback){
        this.chunkSize += chunk.length;
        this.internalBuffer.push(chunk);
        if(this.chunkSize > this.highWaterMark){
            write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err)=>{
                if(err) return callback(err);
                this.chunkSize = 0;
                this.internalBuffer = [];
                callback();
            });
        } else{
            callback();
        }
    }
}
```

3. **_final()**: ==> **_final(callback)**
- The _final() method must not be called directly. It may be implemented by child classes, and if so, will be called by the internal Writable class methods only.
- This is used to write the last chunk of data. If you don't use it, the last chunk will be written to dest.
- This optional function will be called before the stream closes, delaying the 'finish' event until callback is called. This is useful to close resources or write last chunk of buffered data before a stream ends.
```javascript
import { Writable } from "stream";
class FileReadStream extends Writable{
    constructor({ highWaterMark, filename}){
        super({ highWaterMark });
        this.filename = filename;
        this.fileDescriptor = null;
        this.chunkSize = 0;
        this.internalBuffer = [];
        this.highWaterMark = highWaterMark || this.writableHighWaterMark
    }

    // Here it is being used to open the file resource so that it's data can be streamed and setting the fileDescriptor value. Lastly callback() method will send flow to next function.
    _construct(callback){
        open(this.filename, "w", (err, fileDescriptor) => {
            if(err) {
                callback(err);
            } else {
                this.fileDescriptor = fileDescriptor;
                callback();
            }
        });
    }
/*
  Once callback is called, we mean that one part of chunk is written to internal buffer.
*/
    _write(chunk, encoding, callback){
        this.chunkSize += chunk.length;
        this.internalBuffer.push(chunk);
        if(this.chunkSize > this.highWaterMark){
            write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err)=>{
                if(err) return callback(err);
                this.chunkSize = 0;
                this.internalBuffer = [];
                callback();
            });
        } else{
            callback();
        }
    }
    /*
    Used to write the last chunk of data. Let's say your file size is less the highWaterMark value, then the data will not be written to destination without _final method because in that case, your first chunk is last chunk.
    */
    _final(callback){
        write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err)=>{
            if(err) callback(err);
            this.chunkSize = 0;
            this.internalBuffer = [];
            callback();
        });
    }
}
```

4. **_destroy()** : ===> **_destroy(callback)**
- The _destroy() method is called by writable.destroy() under the hood by NodeJS. **It can be overridden by child classes but it must not be called directly**. Furthermore, the callback should not be mixed with async/await once it is executed when a promise is resolved.
```javascript
import { Writable } from "stream";
class FileReadStream extends Writable{
    constructor({ highWaterMark, filename}){
        super({ highWaterMark });
        this.filename = filename;
        this.fileDescriptor = null;
        this.chunkSize = 0;
        this.internalBuffer = [];
        this.highWaterMark = highWaterMark || this.writableHighWaterMark
    }

    // Here it is being used to open the file resource so that it's data can be streamed and setting the fileDescriptor value. Lastly callback() method will send flow to next function.
    _construct(callback){
        open(this.filename, "w", (err, fileDescriptor) => {
            if(err) {
                callback(err);
            } else {
                this.fileDescriptor = fileDescriptor;
                callback();
            }
        });
    }
/*
  Once callback is called, we mean that one part of chunk is written to internal buffer.
*/
    _write(chunk, encoding, callback){
        this.chunkSize += chunk.length;
        this.internalBuffer.push(chunk);
        if(this.chunkSize > this.highWaterMark){
            write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err)=>{
                if(err) return callback(err);
                this.chunkSize = 0;
                this.internalBuffer = [];
                callback();
            });
        } else{
            callback();
        }
    }
    /*
    Used to write the last chunk of data. Let's say your file size is less the highWaterMark value, then the data will not be written to destination without _final method because in that case, your first chunk is last chunk.
    */
    _final(callback){
        write(this.fileDescriptor, Buffer.concat(this.internalBuffer), (err)=>{
            if(err) callback(err);
            this.chunkSize = 0;
            this.internalBuffer = [];
            callback();
        });
    }
    _destroy(error){
        if(this.fileDescriptor) {
            close(this.fileDescriptor, (err)=>{
                callback(err || error);
            });
        } else{
            callback(error);
        }
    }
}
```


## Errors while writing ##

1. **Errors occurring during the processing of the writable._write(), writable._writev() and writable._final() methods must be propagated by invoking the callback and passing the error as the first argument. Throwing an Error from within these methods or manually emitting an 'error' event results in undefined behavior.**

2. **If a Readable stream pipes into a Writable stream when Writable emits an error, the Readable stream will be unpiped.**