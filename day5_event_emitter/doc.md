[Great blog on event emitter](https://www.freecodecamp.org/news/how-to-code-your-own-event-emitter-in-node-js-a-step-by-step-guide-e13b7e7908e1/)
# Event-driven architecture #

- Node.js has an event-driven architecture which can perform asynchronous tasks. Node.js has **events** module which emits named events that can cause corresponding functions or callbacks to be called. Functions(Callbacks => We call these listeners) listen or subscribe to a particular event to occur and when that event triggers, all the callbacks subscribed to that event are fired one by one in order to which they were registered to make sure sequence of events is preserved and no race conditions or logic errors arise.

- The **EventEmitter** class: All objects that emit events are instances of the EventEmitter class. The event can be emitted or listen to an event with the help of EventEmitter. 


- To emit events, we use **.emit('eventName', optionalParameters)** method.
- Listeners listen to events using **.on('eventName', callback)** method. Once events are emitted, the callback function inside **.on()** will called to run your code logic.
- To execute the callback corresponding to an emitted event only once irrespective of ho many times same event is emitted, we use **.once()** instead of **.on()**.
- Passing multiple callbacks to .on or .once will not return anything and no callback will execute.


```javascript
import {EventEmitter} from "events";
const eventListener = new EventEmitter();
eventListener.on('myEvent', ()=>{ // Listener
    console.log("Event is called");
});

eventListener.emit('myEvent'); // Event is emitted
```

- The concept is quite simple: emitter objects emit named events that cause previously registered listeners to be called. So, an emitter object basically has two main features:

1. Emitting name events.
2. Registering and unregistering listener functions. (Meaning once event is executed by listener it is unregistered from list)
It's kind of like a pub/sub or observer design pattern (though not exactly).