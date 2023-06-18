## Character Set ##
Letters and Symbols that a writing system uses and representation of assigning different numbers to those characters.
- For example **Unicode**, **ASCII** are two most popular character sets.
- Unicode is a standard for representing and encoding characters in most of the writing systems worldwide. (It defines 1444679 characters)
  
## Character Encodings ##
A system of assigning a sequence of bytes (0s and 1s) to  character. It is very important to specify the encoding because in different encoding the character it will show different data for same sequence of bytes. Generally default is **utf-8/utf8**.

# What is a buffer? #
- Buffers in the context of computers refer to a temporary data storage that is used to hold some fixed sequence of bytes when moving data. Moving data can mean a lot of things. The most common, nowadays, would be video streaming. Depending on how fast your internet is, your video quality can change and so can your viewing experience. Video data is fetched from the server, stored in the buffer, processed, and sent to your display. This is why when you click on a video, you do not wait for it to download completely; instead, it starts playing right away. As more data is fetched, the buffer gets filled with newer data and old data is usually overwritten.

- Buffers can help in synchronous operations as well, since the program does not have to wait for the entire file to be read from a local or network resource. Instead, as soon as some of the data arrives, the program can start processing it or move on to process more code.

- Generally these are expressed in Hexadecimal number system because it is easy and contains less character to express number in Hexadecimal.
- The reason we have buffer in node.js because plain Javascript was not good at handling raw data at the time node.js introduced. But with es6, we have something called typed array which kind of does same thing as buffer which we will learn in next tutorials.
- While the Buffer class is available within the global scope, it is still recommended to explicitly reference it via an import or require statement.
- While we did state that buffers only store data as integers, when we output a buffer, it is represented in hexadecimal notation. This makes it easier and shorter to read.
  
The Buffer class and its methods are very useful; however, being a low-level API, we rarely use it directly.

## Buffer Size ##

The actual maximum size of a buffer changes across platforms and versions of Node.js. You can find out what's the limit in bytes in a given platform, run this:
```javascript
import buffer from "buffer";
console.log(buffer.constants.MAX_LENGTH);
```
