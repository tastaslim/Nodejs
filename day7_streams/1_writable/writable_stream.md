- **writableHighWaterMark** : Returns the maximum byte size the internal array to be filled with.
  
- **writableLength** : This property contains the number of bytes (or objects) in the queue ready to be written. The value provides introspection data regarding the status of the highWaterMark.
  
```javascript

(async () => {
  time("Start Stream");
  const streamData = createWriteStream("./write_file.txt", "utf-8");
  log(streamData.writableLength); // Gives 0 as no data is present in writable stream yet.

  const buffer = Buffer.from("Taslim");
  streamData.write(buffer);
  streamData.write(buffer);
  streamData.write(buffer);
  streamData.write(buffer);
  streamData.write(buffer);
  log(streamData.writableLength); // Gives 30 as each char is represented as 1 byte.
  
  /*
   If you see above example, we are pushing data to internal buffer, irrespective of the writableHighWaterMark or writableLength. There will a time, when our internal buffer would be filled with so much data that we might run into memory issue (BackPressure). The same problem which we are facing with below for loop, because we are not clearing out the internal buffer once one chunk is written to dest successfully.
  */
  // for (let i = 0; i < 1000000; i++) {
  //   const buffer = Buffer.from(`${i} `, "utf-8");
  //   streamData.write(buffer);
  // }
  timeEnd("Start Stream");
})();
```
**write(some_buffer)**: Returns true if writableLength is less than writableHighWaterMark else returns false. If true, means we can write more data to internal buffer without clearing it out otherwise in case of false, we need to write the chunk to destination and clear out the internal buffer.

Note: **Never write a chunk of size >= writableHighWaterMark inside the drain event, otherwise, this event will keep on getting called (as .write(buff) method will return false and this event will get called every time) and you will get in a infinite loop.**
```javascript
stream.on("drain", ()=>{
    stream.write(Buffer.alloc(xyz,"a")); // Where xyz>= writeHighWaterMark value
});
```

---

## Events for Writable Streams ##

1. **close**: This event is emitted when the stream and any of its underlying resources (a file descriptor, for example) have been closed. The event indicates that no more events will be emitted, and no further computation will occur on writable stream.

```javascript
writableStream.on('close', ()=>{
  console.log(`No more data to be written to writable stream. Close the data flow.`);
});
```
  
2. **drain**: If a call to writableStream.write(chunk) returns false, which means the internal buffer is full. Hence the 'drain' event is be emitted when it is appropriate to resume writing data to the stream once the internal buffer memory is free.

```javascript
writableStream.on("drain", ()=>{
  console.log("The Internal buffer memory is free. Now, you can resume writing the chunk data to writable Stream.")
})
```
3. **error**: The 'error' event is emitted if an error occurred while writing or piping data. After 'error', no further events other than 'close' should be emitted (including any other 'error' events). Also stream is closed when this event is emitted unless you have manually specified **autoClose** flag as false while creating the writable stream.
   
```javascript
/*
  If autoClose is set to true (default behavior) on 'error' or 'finish'the file descriptor will be closed automatically. 
  If autoClose is false, then the file descriptor won't be closed, even if there's an error. 
  It is the application's responsibility to close it and make sure there's no file descriptor leak.
  const writeStream = fileHandler.createWriteStream({autoClose: false});
  */

 writer.on("error", ()=>{
  console.log("An Error has occurred while writing data to dest. Closing the stream, if the autoClose option is not set to false");
 });

```

4. **finish**: The 'finish' event is emitted after the stream.end() method has been called, and all data has been flushed to the underlying system.

```javascript
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
```

5. **pipe**: The 'pipe' event is emitted when the stream.pipe() method is called on a readable stream, adding this writable to its set of destinations.

```javascript
/*
  import { equal } from 'assert';
  equal(50, 50); //OK
  equal(50, "50"); //OK
  equal(50, 70); /*AssertionError: 50 == 70
*/
import { log } from "console";
const readableStream = getReadableStreamSomehow();
const writableStream = getWritableStreamSomehow();
writableStream.on('pipe', (src) => {
  log('Something is piping into the writer.');
});
readableStream.pipe(writableStream); 
```

6. **unpipe**: The 'unpipe' event is emitted when the stream.unpipe() method is called on a readable stream, removing writable from its set of destinations. This is also emitted in case of Writable stream emits an error when a Readable stream pipes into it.



```javascript
/*
  import { equal } from 'assert';
  equal(50, 50); //OK
  equal(50, "50"); //OK
  equal(50, 70); /*AssertionError: 50 == 70
*/
import { log } from "console";
const readableStream = getReadableStreamSomehow();
const writableStream = getWritableStreamSomehow();
writableStream.on('unpipe', (src) => {
  log('Something has stopped piping into the writer.');
});
readableStream.pipe(writableStream); 
readableStream.unpipe(writableStream); 
```

