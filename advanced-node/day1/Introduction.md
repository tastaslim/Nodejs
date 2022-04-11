- Node.js uses libuv and v8 to execute JavaScript outside the browser.
- Since libuv and v8 is mostly written in C++ and we don't want to write C++ code too, we have something called node as an
interface which provides very reliable API to establish communication b/w out Js and C++ codes.

- Most of the JS libraries(npm packages) which we use has main implementation inside libuv in C++ and we have some sort
of mapping to those functions in JS , so we don't need to write C++ code, instead we just write JS and under the hood node
takes care of it.

---

We will investigate the following:
Choose a node package function, go to GitHub repo of node.js (**https://github.com/nodejs/node**) and search for two folders:
- lib (js API to interact with c++)
- src (C++ code)
We can see there for  functions written in C++, we have mapping for them in js, and we can directly import and use to 
function in JS.
- V8 project purpose is to take our node js code and transfer it to C++ equivalent and execute it.
- libuv focuses on asynchronous I/O operations such as file system, network, crypto, etc. It brings the Event Pool, 
Thread Pool, and Child Processes into Node.js.