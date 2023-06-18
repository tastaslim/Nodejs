import { log } from "console";
import { appendFileSync, open, writeSync, write, createReadStream } from "fs";
import split2 from "split2"; // package is used to split input by newline
import { stdin, stdout } from "process";
import * as csvParse from "csv-parse";

// (
//   /*
// // Synchronous way 1

// (()=> {
//   console.time("Start");
//   for (let i = 0; i < 1000000; i++){
//     appendFileSync("./write_file.txt", `${i} `);
//   }
//   console.timeEnd("Start");
// })();
// */

//   /*
// // Synchronous + Callback way 2
// // Takes around 1.8 sec to run, takes 50 MB memory and CPU 100%.
// (async()=> {
//   console.time("Start");
//   open("./write_file.txt", 'w', (err, data) => {
//     for (let i = 0; i < 1000000; i++) {
//       writeSync(data, `${i} `);
//     }
//   });
  
//   console.timeEnd("Start");
// })();
// */

//   /*
// // Callback way 2
// // Takes around 1.8 sec to run, takes 600-700 MB memory and CPU 100%. As size increases memory usage starts increasing as we are 
// // pushing too many events on event loop
// // Also ordering would not be same.
// (async()=> {
//   console.time("Start");
//   open("./write_file.txt", 'w', (err, data) => {
//     for (let i = 0; i < 10000000; i++) {
//       write(data, `${i} `, ()=>{});
//     }
//   });
  
//   console.timeEnd("Start");
// })();
// */

//   // import { appendFile, open } from "fs/promises";
//   /*
// // Asynchronous way 1
// (async () => {
//   console.time("Start Asynchronous 1");
//   for (let i = 0; i < 1000000; i++) {
//     await appendFile("./write_file.txt", `${i} `);
//   }
//   console.timeEnd("Start Asynchronous 1");
// })();
// */

//   // Asynchronous Way 2

//   // Takes around 9 sec to run, takes 50 MB memory and CPU 100%
//   // (async () => {
//   //   console.time("Start Asynchronous 2");
//   //   const fileData = await open("./write_file.txt", "w");
//   //   for (let i = 0; i < 1000000; i++) {
//   //     /*
//   //     // You convert string to buffer and write it to file
//   //     const buffer = Buffer.from(`${i} `, "utf-8");
//   //     fileData.write(buffer);
//   //     */

//   //     // Node.js converts string to buffer and write to file
//   //     // fileData.write(`${i} `); // If I don't put await, all the 1000000 buffers will be written
//   //     // parallel which can lead to high CPU and memory usage. Also ordering would be different every time.
//   //     await fileData.write(`${i} `);
//   //   }
//   //   console.timeEnd("Start Asynchronous 2");
//   // })();

//   // So the callback + Synchronous way is fast and less memory consuming.

//   async () => {
//     console.time("Start");
//     open("./write_file.txt", "w", (err, data) => {
//       for (let i = 0; i < 1000000; i++) {
//         if (err) log(err);
//         writeSync(data, `${i} `);
//         // or  const buffer = Buffer.from(`${i} `, 'utf-8);
//         //      writeSync(data, buffer);
//       }
//     });

//     console.timeEnd("Start");
//   }
// )();

/*
We saw various versions of reading data and writing it to file and compared the memory, 
CPU usage and time taken. You know what we can even make the process a lot faster using 
streams and by consuming less memory, CPU.
*/


// Stream in object mode

/*
import { Transform } from "stream";

const transformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const str = chunk.toString();
    const result = str.replace(/\n/, "").toUpperCase().split(/[ \t]/);
    callback(null, result);
  }
});

transformStream.on("data", (chunk) => {
  log(chunk);
});
*/
// stdin is a duplex stream which has file descriptor value assigned as 0 in file descriptor table by OS kernel.
// stdin.pipe(split2()).pipe(transformStream);


//csv-parse (the module used in csv) also uses an object stream, to parse CSV data from buffers
import { Transform } from "stream";
const transformStream2 = new Transform({
  objectMode: true,
  writableHighWaterMark : 1,
  transform(chunk, encoding, callback) {
    callback(null, {
      firstName: chunk[0],
      lastName: chunk[1],
      address: chunk[2]
    });
  },
});

transformStream2.on("data", (chunk) => {
  log(JSON.stringify(chunk));
});

createReadStream("./test.csv").pipe(csvParse.parse({ auto_parse : true})).pipe(transformStream2);

// database packages such as node-postgres uses stream in object mode