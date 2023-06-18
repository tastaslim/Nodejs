import { open } from "fs/promises";
import { log } from "console";
(async () => {
  const fileHandlerWrite = await open("./writable_stream1.md", "w");
  const writeStreamData = fileHandlerWrite.createWriteStream({
    writableHighWaterMark: 64 * 1024,
  });

  log(writeStreamData.writableHighWaterMark);

  // write some data
  writeStreamData.write("H");
  writeStreamData.write("E");
  writeStreamData.write("L");
  writeStreamData.write("L");
  writeStreamData.write("O, ");

  // cork() function is called, all incoming data will be
  // part of the buffer.
  writeStreamData.cork();

  // All incoming data is corked and part of buffer memory.
  writeStreamData.write("Welcome ");
  writeStreamData.write("to ");
  writeStreamData.write("Educative!!!");
  
  // Calling the `uncork method, the data with their address
  // in printed in the console.
  writeStreamData.uncork();
  log(writeStreamData.bytesWritten);
})();