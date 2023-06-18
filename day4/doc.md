```javascript
log("First");
readFile("./doc.md", (err, data) => {
    if (err) log(err);
    log(data.toString("utf-8"));
});
log("second");
```

- In above code, when node.js reaches to readFile function, V8 puts this function inside event loop to process it asynchronously and moves ahead in the execution flow. 
- Event loop sends a request to libuv to read this file by providing some necessary information like, file name, path, format etc.
- Libuv sends a request to OS to read the file
- OS reads the file from Storage and sends the data in required format to libuv which goes ahead and sends data to event loop.
- Once event loop receives the response/data from libuv, it sends the data to V8 and removes the readFile function from stack.
  
**V8 and event loop run in single thread.**
  

It is called as **Event Driven Architecture**

---

process.nextTick(() => {
    log("B");
});

is equivalent to

setTimeout(()=>{
    log("B");
},0);

---

setInterval(()=>{
    log("B");
},100);

This is log B after each interval of 100 ms.

![Node Architecture](./Node%20architecture.drawio)