# Transform Stream #

- A Transform stream is a special type of Duplex stream where the output is computed in some way from the input. Examples include zlib streams, crypto streams, encoding/decoding etc. that compress, encrypt, or decrypt data.
- If you just pass data from one stream to another stream and don't do anything in b/w, it is called **PassThrough Stream** (it is  trivial implementation of Transform Stream).
- There is no requirement that the output be the same size as the input, the same number of chunks, or arrive at the same time. For example, a Hash stream will only ever have a single chunk of output which is provided when the input is ended. A zlib stream will produce output that is either much smaller(compress) or much larger(decompress) than its input.
- The **Transform** class is extended to implement a Transform stream.
- The **Transform** class prototypically inherits from **Duplex** and implements its own versions of the **writable._write()** and **readable._read()** methods. Custom Transform implementations must implement the **transform._transform()** method and may also implement the **transform._flush()** method.

- **Care must be taken when using Transform streams in that data written to the stream can cause the Writable side of the stream to become paused if the output on the Readable side is not consumed.**

![PassThrough](../images/passthroughStream.png)hello There