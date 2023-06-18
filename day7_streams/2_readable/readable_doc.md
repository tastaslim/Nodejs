# Readable streams #

- Readable streams are an abstraction for a source from which data is consumed.
- Readable streams effectively operate in one of two modes: **flowing** and **paused**.
- All Readable streams begin in **paused mode** but can be switched to flowing mode in one of the following ways:
  1. Adding a **'data'** event to event handler. (readStream.on('data',()=>{}))
  2. Calling the **readStream.resume()** method.
  3. Calling the **readStream.pipe()** method to send the data to a Writable.

- The Readable can switch back to paused mode using one of the following:
  1. If there are no pipe destinations, by calling the stream.pause() method.
  2. If there are pipe destinations, by removing all pipe destinations. Multiple pipe destinations may be removed by calling the stream.unpipe() method.

- Specifically, at any given point in time, every Readable is in one of three possible states:
  1. readable.readableFlowing === **null**
  2. readable.readableFlowing === **false**
  3. readable.readableFlowing === **true**

When **readable.readableFlowing is null**, no mechanism for consuming the stream's data is provided. Therefore, the stream will not generate data. While in this state, attaching a listener for the 'data' event, calling the readable.pipe() method, or calling the readable.resume() method will switch **readable.readableFlowing to true**, causing the Readable to begin actively emitting events as data is generated.

Calling **readable.pause(), readable.unpipe(), or receiving backpressure will cause the readable.readableFlowing to be set as false**, temporarily halting the flowing of events but not halting the generation of data (meaning we will be writing in internal buffer). While in this state, attaching a listener for the 'data' event will not switch readable readableFlowing to true unless you resume the stream (**readableStream.resume()**).

**Note**: We should only choose one of the style of working with readable stream in node.js 
**on('data'), on('readable'), pipe()**. No combination, just one. I prefer the pipe() way (rather pipeline() ==> will learn about it.)

---

## Events in Readable Stream ##

1. **data**: The 'data' event is emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer. This may occur whenever the stream is switched in flowing mode by calling readable.pipe(), readable.resume(), or by attaching a listener callback to the 'data' event.

```javascript
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
}); 
```

2. **end**: The 'end' event is emitted when there is no more data to be consumed from the stream.
```javascript
readable.on('end', () => {
  console.log('There will be no more data.');
}); 
```

1. **pause**: The 'pause' event is emitted when stream.pause() is called and readableFlowing is true.
```javascript
readable.on("pause", ()=>{
  log(`stream.pause() is called and readableFlowing is true`)
});
```

1. **readable**: The 'readable' event is emitted when there is data available to be read from the stream or when the end of the stream has been reached. Effectively, the 'readable' event indicates that the stream has new information. If data is available, stream.read() will return that data. If the end of the stream has been reached, calling stream.read() will return null and trigger the 'end' event.

In general, the readable.pipe() and 'data' event mechanisms are easier to understand than the 'readable' event. However, handling 'readable' might result in increased throughput.

If both 'readable' and 'data' are used at the same time, 'readable' takes precedence in controlling the flow.
```javascript
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;
  while ((data = this.read()) !== null) {
    console.log(data);
  }
});

readable.on("end", ()=>{
  console.log(`Stream has ended`);
});
```

5. **resume**: The 'resume' event is emitted when stream.resume() is called and readableFlowing is not true.
```javascript
readable.on("resume", ()=>{
  log(`stream.resume() is called and readableFlowing is false`)
});
```
6. **readable.isPaused()**: The readable.isPaused() method returns the current operating state of the Readable. This is used primarily by the mechanism that underlies the readable pipe() method. In most typical cases, there will be no reason to use this method directly.
```javascript
const readable = createReadStreamSomeHow();
readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false 
```

7. **readable.pipe()**:  **readable.pipe(destination[, options])**
The readable.pipe() method attaches a Writable stream to the readable, causing it to switch automatically into flowing mode and push all of its data to the attached Writable. The flow of data will be automatically managed so that the destination Writable stream is not overwhelmed by a faster Readable stream.
options contains property: **end** == End the writer when the reader ends. Default: true.
```javascript
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable); 
```

It is possible to attach multiple Writable streams to a single Readable stream.
The readable.pipe() method returns a reference to the destination stream making it possible to set up chains of piped streams:

```javascript
import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
const r = createReadStream('file.txt');
const z = createGzip();
const w = createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```

By default, stream.end() is called on the destination Writable stream when the source Readable stream emits 'end', so that the destination is no longer writable. To disable this default behavior, the end option can be passed as false, causing the destination stream to remain open:

```javascript
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```

Note: **If the Readable stream emits an error during processing, the Writable destination is not closed automatically. It is necessary to manually close each stream in order to prevent memory leaks. The process.stderr and process.stdout Writable streams are never closed until the Node.js process exits, regardless of the specified options. Due to poor error handling mechanism in pipe() (as writableStream needs to be handled by programmer in case of error in readable stream), it is not recommended to use it in production. Instead we should use pipeline method**

8. **pipeline**: 
   - using **.pipe()** in production applications is not recommended for several reasons. If one of the piped streams is closed or throws an error, pipe() will not automatically destroy the connected streams. This can cause memory leaks in applications. Also, pipe() does not automatically forward errors across streams to be handled in one place.
   - pipeline() was introduced to cater for these problems, so it's recommended you use pipeline() instead of pipe() to connect multiple streams. **pipeline()** accepts a callback function as the last parameter. Any forwarded errors from any of the piped streams will call the callback, so it's easier to handle errors for all streams in one place.
   - pipeline() was introduced in node 15, before that we were using an npm package **pump** for same purpose. [Read Here](https://www.npmjs.com/package/pump)
   - Just make sure that the middle streams are duplex/transform. **pipeline(s, m1, m2, m3, d)** ==> m1, m2, m3 must be duplex/transform stream, because let say if m2 is readable, m1 will not be able to write to m2 and if m2 is writable, we can not pipe m2 with m3.
   - **pipeline(s, m1, m2, m3, d)** ==> s.pipe(m1).pipe(m2).pipe(m3).pipe(d)
   - When using pipeline, the series of streams should be passed sequentially in the order in which they need to be executed.

We can rewrite the above pipe() example to use the pipeline() function, as follows:


```javascript
import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
const r = createReadStream('file.txt');
const z = createGzip();
const w = createWriteStream('file.txt.gz');
// r.pipe(z).pipe(w);
pipeline(r, z, w, (err) => {
  if(err){
    console.log("Do the stuff here");
  }
});

```
**pipeline()** will call stream.destroy(err) on all streams except:
  - **Readable** streams which have emitted 'end' or 'close'.
  - **Writable** streams which have emitted 'finish' or 'close'.

1.  **readable.setEncoding(encoding)**: The readable.setEncoding() method sets the character encoding for data read from the Readable stream.

By default, no encoding is assigned and stream data will be returned as Buffer objects. Setting an encoding causes the stream data to be returned as strings of the specified encoding rather than as Buffer objects. For instance, calling readable.setEncoding('utf8') will cause the output data to be interpreted as UTF-8 data, and passed as strings. Calling readable.setEncoding('hex') will cause the data to be encoded in hexadecimal string format.


10. **readable.unpipe()**: **readable.unpipe([destination])**
The readable.unpipe() method detaches a Writable stream previously attached using the stream.pipe() method.
If the destination is not specified, then all pipes are detached.
If the destination is specified, but no pipe is set up for it, then the method does nothing.
```javascript
import{ createWriteStream } from "fs";
const readable = getReadableStreamSomehow();
const writable = createWriteStream('file.txt');
// All the data from readable goes into 'file.txt',
// but only for the first second.
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000); 
```

11. **finished**: ==> **finished(stream[, options], callback)** ==> stream can be Readable/Writable
    
  - A function to get notified when a stream is no longer readable, writable or has experienced an error or a premature close event.
  - Especially useful in error handling scenarios where a stream is destroyed prematurely (like an aborted HTTP request), and will not emit 'end' or 'finish'.
  - When using a server Response as the last stream in the pipeline, you won't be able to send an error message to the client when an error occurs because the response is destroyed in case of an error while using pipeline(). The simple solution is to pipe the pipeline stream to the response stream.
```javascript
import { finished } from 'stream';

async function handler(req, res, next){

  // you won't get this response : something went wrong ==> as pipeline() destroys the streams and hence response.
  pipeline(
    stream1,
    stream2,
    (err) => {
       console.log(error);
       res.status(500).end('something went wrong')
    }
  )
  // .pipe(res);

  // We can pipe it with res to get response

  pipeline(
    stream1,
    stream2,
    (err) => {
       console.log(error);
       res.status(500).end('something went wrong')
    }
  )
  .pipe(res);
  
  // But but since we are using pipe(), the response/res stream won't get destroyed in case of an error in a proceeding operation. It will be available to handle the response to the client gracefully. In such scenario, we can take benefits of finished function to handle the errors.

  finished(res, (err)=>{
    if(err) console.log("Do Cleanup");
  });
}
```