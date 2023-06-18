# Duplex Stream #
- A Duplex stream is one that implements both Readable and Writable.
- Since Javascript does not support multiple inheritance, the **Duplex** class is extended to implement a Duplex stream.
- Custom Duplex stream class must extend **Duplex** class and implement both the readable._read() and writable._write() methods.
- The most important aspect of a Duplex stream is that the Readable and Writable sides operate independently of one another despite co-existing within a single object instance. Which means that you can perform any actions on writable Stream and it won't affect readable and vice versa.
  
![Duplex](../images/duplexStream.png)
