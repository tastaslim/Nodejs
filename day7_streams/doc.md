In prac.js, We saw various versions of reading data and writing it to file and compared the memory, CPU usage and time taken. You know what we can even make the process a lot faster using streams and by consuming less memory, CPU.

# Stream #

Stream is an abstract interface for working with streaming data in Node.js.

- Streaming Data can mean video/media streaming and a lot more. Data Streaming === Data flowing.
  
---

Let's understand this with an example:

- When we say a stream of 500 people are coming to University for graduation party, we don't mean that they all will come at the same time in one chunk. The same concept is applied for data streaming, which means you don't move whole data in one chunk, instead move data in multiple chunks. As the data keep of coming, we show the data to users instead of loading whole data in once which is time taken and not memory efficient.

- Although with different chunks we would be doing more write operations on destination but it is way memory efficient and very close to performance what we have in one chunk way.
- By default buffer size is 16KB(16384 Bytes ) in Node.js, and same chunk size is used by stream as well in Node.js but we can override that using highWaterMark property.
---

## Types of Streams in Node.js ##

1. Writable Stream
2. Readable Stream
3. Transform Stream
4. Duplex Stream


Note: For flow of data b/w anything, streams would be a great tool to use.

## Writable Stream ##

![Writable Stream](../images/writableStream.png)

This writable stream object contains events, methods and some properties. Let's say you start streaming data from source to destination, below things will happen:
-  Node.js will try to write the chunks of various sizes to internal buffer till 16KB/highWaterMark value is reached.
-  Once chunk size is reached the internal buffer will be written to destination.
-  But there can be such scenarios where for the chunks which we get from source to write into internal buffer, what if last chunk size is such that when we sum all buffer sizes it exceeds the 16KB/highWaterMark value of internal buffer:
   - In that case Node.js will write the buffer till 16KB/highWaterMark by selecting respective part of last chunk and rest of the chunk will be stored in memory to keep track of it and once the internal buffer clears out, it will be sent to it.
   - So from above statement, you can see if we don't clear out the internal buffer after each write to dest, the tracking buffer would keep on increasing and we can face the memory issue.
   - But we don't it, right? Because it will then defeat the whole idea of stream.
- The process which is used to empty the internal buffer is called draining which is nothing but an event.
- Basically in the drain event, we can write our logic to clear the internal buffer based on some conditions.
  
## Readable Stream ##

![Readable Stream](../images/readableStream.png)

- It also works similar to writable stream where internal buffer size is 16KB/highWaterMark value.
- Once the internal buffer is filled, we write the chunk to the destination and clear out the internal buffer for next chunks.
- Readable Stream is the way to read/stream a large file without loading whole data in memory. Once we create readable stream for source data, we start getting data in chunks and those chunks can be written to destination using writable Stream.
  
## Duplex Stream ##

It works as both readable and writable stream which means, it has two internal buffers: one for readable stream and other for writable stream.

## Transform Stream ##

It is a special Duplex Stream which can modify or transform the data as it is written and read.

---

# Streams in Object Mode #

- All streams created by Node.js APIs operate exclusively on strings and Buffer (or Uint8Array) objects. It is possible, however, for stream implementations to work with other types of JavaScript values (except null, which serves a special purpose within streams). Such streams are considered to operate in "object mode".

- Stream instances are switched into object mode using the objectMode option when the stream is created. Attempting to switch an existing stream into object mode is not safe.

- When in objectMode, the internal buffering algorithm counts objects rather than bytes. This means if we have a Transform stream with the highWaterMark option set to 5, the stream will only buffer a maximum of 5 objects internally.
- it's important to note that you can't pipe object stream to a non-object stream.

```javascript
import { Transform } from "stream";

const transformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const str = chunk.toString();
    var result = str.replace(/\n/, "").toUpperCase().split(/[ \t]/);
    callback(null, result);
  }
});

transformStream.on("data", (chunk) => {
  log(chunk);
});
// process.stdin is a duplex stream which has file descriptor value assigned as 0 in file descriptor table by OS kernel.
process.stdin.pipe(split2()).pipe(transformStream);
```

