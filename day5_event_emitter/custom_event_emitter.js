// We can extend the EventEmitter class and create our own event emitter.
/*

import { log } from "console";
import { EventEmitter } from "events";
class MyEventEmitter extends EventEmitter {
    // Write your or extend functionality or override functionalities according to need
}
 
const eventListener = new MyEventEmitter();

eventListener.on('checkEvent', () => {
    log('Custom Event Emitter is called')
});

eventListener.emit("checkEvent");
*/

// We can write our own eventEmitter class and implement the functionalities such as .on, .once, .emit,
// .addEventListener , .removeListener

class CustomEventEmitter {
  listeners = {}; // Key value pair where key is event name and value is array of callbacks attached to that event
  on(eventName, callback) {
    this.addEventListener(eventName, callback);
  }
  off(eventName, callback) {
    this.removeEventListener(eventName, callback);
  }
  once(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    const executeWrapper = (...args) => {
      callback(...args);
      this.off(eventName, executeWrapper);
    };
    this.addEventListener(eventName, executeWrapper);
  }
  emit(eventName, ...args) {
    const eventListeners = this.listeners[eventName] || [];
    for (let callback of eventListeners) {
      callback(...args);
    }
  }

  addEventListener(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(callback);
  }
  removeEventListener(eventName, callback) {
    const eventCallbacks = this.listeners[eventName] || [];
    for (let eventCallback of eventCallbacks) {
      if (eventCallback === callback) {
        this.listeners[eventName] = eventCallbacks.filter(
          (eve) => eve !== eventCallback
        );
        break;
      }
    }
  }

  countEventListener(eventName) {
    const events = this.listeners[eventName] || [];
    return events.length;
  }

  rawListeners(eventName) {
    return this.listeners[eventName] || [];
  }
}

const eve = new CustomEventEmitter();
const tas = (ele) => {
  console.log(`Event is called : ${ele}`);
}

eve.on('cus', tas);
eve.emit('cus', 'Taslim');
eve.emit("cus", "Taslim");
eve.emit("cus", "Taslim");


console.log(eve.rawListeners('cus'));
