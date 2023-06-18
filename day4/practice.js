import { log } from "console";
import { readFile } from "fs";

/*
log("first");
for (let i = 0; i < 10000000000; i++){ }
log("second");

In the above code the main thead would be blocked and your application will not doing anything unless it completes the for loop. But what
if there is some operations like reading file, will node be blocked as well. Answer would be no, Node is very good at managing these by using
asynchronous programming using V8, event loop and libuv.
*/

/*
log("First");
readFile("./doc.md", (err, data) => {
    if (err) log(err);
    log(data.toString("utf-8"));
});
log("Second");

Output=>>
First 
Second
Data from readFile
*/

/*
log("A");
// setTimeout(() => {
//     log("B");
// }, 0);

process.nextTick(() => {
  log("B");
});
log("C");
log("D");
log("E");

Output:

A
C
D
E
B

Because setTimeout() will be pushed to event loop for execution and in reality it does not take 0 second, rather some time > 0.

setTimeout(() => {
    log("B");
}, 0);

can also be represented using
process.nextTick(() => {
    log("B");
});

*/

/*
setInterval(()=>{
    log("B");
},100);

This is log B after each interval of 100 ms.
*/

