# _read(size) #

- size <number> Number of bytes to read asynchronously
- This function **MUST NOT** be called by application code directly. It should be implemented by child classes, and called by the internal Readable class methods only.
- All Readable stream implementations must provide an implementation of the readable._read() method to fetch data from the underlying resource.
- When readable._read() is called, if data is available from the resource, the implementation should begin pushing that data into the read queue using the **this.push(dataChunk)** method. 
- **_read()** will be called again after each call to **this.push(dataChunk)** once the stream is ready to accept more data. _read() may continue reading from the resource and pushing data until **readable.push()** returns false. Only when _read() is called again after it has stopped should it resume pushing additional data into the queue.

- Once the readable._read() method has been called, it will not be called again until more data is pushed through the readable.push() method. Empty data such as empty buffers and strings will not cause readable._read() to be called.

- The size argument is advisory. For implementations where a "read" is a single operation that returns data can use the size argument to determine how much data to fetch. Other implementations may ignore this argument and simply provide data whenever it becomes available. There is no need to "wait" until size bytes are available before calling stream.push(chunk).

- The readable._read() method is prefixed with an underscore because it is internal to the class that defines it, and should never be called directly by user programs.
  

**Errors occurring during processing of the readable._read() must be propagated through the readable.destroy(err) method. Throwing an Error from within readable._read() or manually emitting an 'error' event results in undefined behavior.**