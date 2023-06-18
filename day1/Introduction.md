- Node.js uses libuv and v8 to execute JavaScript outside the browser.
- Since libuv and v8 is mostly written in C++ and we don't want to write C++ code too, we have something called node as in interface which provides very reliable API to establish communication b/w JS and C++ codes.
- Most of the JS libraries(npm packages) which we use has main implementation inside libuv in C++ and we have some sort of mapping to those functions in JS , so we don't need to write C++ code, instead we just write JS and under the hood node takes care of it.

---

We will investigate the following:
Choose a node package function, go to GitHub repo of node.js (**https://github.com/nodejs/node**) and search for two
folders:
- lib (js API to interact with c++)
- src (C++ code)
  We can see there for functions written in C++, we have mapping for them in js, and we can directly import and use to
  function in JS.
- V8 project purpose is to take our node js code and transfer it to C++ equivalent and execute it.
- libuv focuses on asynchronous I/O operations such as file system, network, crypto, etc. It brings the Event Pool, Thread Pool, and Child Processes into Node.js.

![Libuv](./Node.drawio)


## V8 ##

- The V8 library provides Node.js with a JavaScript engine, which Node.js controls via the V8 C++ API. V8 is maintained by Google, for use in Chrome.

- V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs. V8's stop-the-world, generational, accurate garbage collector is one of the keys to V8's performance.

## libuv ##

Another important dependency is libuv, a C library that is used to abstract non-blocking I/O operations to a consistent interface across all supported platforms. It provides mechanisms to handle file system, DNS, network, child processes, pipes, signal handling, polling and streaming. It also includes a thread pool for offloading work for some things that can't be done asynchronously at the operating system level.

## llhttp ##

HTTP parsing is handled by a lightweight TypeScript and C library called llhttp. It is designed to not make any syscalls or allocations, so it has a very small per-request memory footprint.


## c-ares ##

For some asynchronous DNS requests, Node.js uses a C library called c-ares. It is exposed through the DNS module in JavaScript as the resolve() family of functions. The lookup() function, which is what the rest of core uses, makes use of threaded getaddrinfo(3) calls in libuv. The reason for this is that c-ares supports /etc/hosts, /etc/resolv.conf and /etc/svc.conf, but not things like mDNS.

## OpenSSL ##

OpenSSL is used extensively in both the tls and crypto modules. It provides battle-tested implementations of many cryptographic functions that the modern web relies on for security.


## zlib ##

For fast compression and decompression, Node.js relies on the industry-standard zlib library, also known for its use in gzip and libpng. Node.js uses zlib to create sync, async and streaming compression and decompression interfaces.

---


# Tools #

## npm ##

Node.js is all about modularity, and with that comes the need for a quality package manager; for this purpose, npm was made. With npm comes the largest selection of community-created packages of any programming ecosystem, which makes building Node.js apps quick and easy.


## gyp ##

The build system is handled by gyp, a python-based project generator copied from V8. It can generate project files for use with build systems across many platforms. Node.js requires a build system because large parts of it — and its dependencies — are written in languages that require compilation.


## gtest ##

Native code can be tested using gtest, which is taken from Chromium. It allows testing C/C++ without needing an existing node executable to bootstrap from.