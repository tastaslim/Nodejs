import { log } from "console";
import { EventEmitter } from "events";
const eventListener = new EventEmitter();
/*
eventListener.on("myEvent", () => {
    log("My event is called");
});

eventListener.on("test_event", () => {
    log("Test event is called");
});

eventListener.emit("myEvent");
eventListener.emit("myEvent");
eventListener.emit("myEvent");
eventListener.emit('test_event')
*/


//  Pass Parameter inside emit method and use it inside .on or .once

/*
eventListener.on('custom_event', (times) => {
    log(`custom_event is called ${times} times`);
});

eventListener.emit("custom_event",1);
*/

// .once method

eventListener.once("myEvent", () => {
  log("My event is called");
});

// eventListener.on("test_event", () => {
//   log("Test event is called");
// });

eventListener.emit("myEvent");
eventListener.emit("myEvent");
// eventListener.emit("test_event");
// eventListener.emit("test_event");

// myEvent event will be called only once.


log(Math.min(),Math.max())