### Few terminologies ### 

**Tick:** the time frame that outlines one full Event Loop iteration from start to finish.

## Process and threads ##

- Let's dive into the concept of process. Every application has a container. Process is the top-level container of the application. When you run an application with Node.js, e.g. node index.js, you are creating a Node.js process that the application runs in.
- Every process has a dedicated memory pool that is shared by all threads in the process. This means you can    
create a variable in one thread and read it from another one.
- To understand the concept better, imagine going to a restaurant that has a dedicated waitress who asks you for your order and takes the order to a chef. While your food is being cooked, the waitress cannot take anybody else's order, since she is dedicated to you. This means she is blocked from any other actions! Other customers come in as well, but nobody goes to take their orders, since the waitress is still waiting to serve your food.

- The easiest solution to this problem would be to hire more people to take orders. After some time, the number of
  waitresses would be equal to the number of clients who are dining. This is the classic example of how applications like Apache server process requests where a "waitress" is a thread. Every request gets its own thread. This outlines the concept of multithreading.

- This solution may not be memory-efficient due to its dependency on the release of resources and allocation of memory on time. Due to threads sharing limited resources allocated to the application process, creation and release of the resources may result in significant overhead and in turn impact performance.

- On top of this, multithreading contributes to software complexity as threads need to communicate between each other to
  stay synchronized with the main thread and other threads. For example, a thread needs to notify the main thread when
  an operation is finished.

- Multithreading can introduce a "Race Condition", a bug that happens due to lack of synchronization between two
  threads, and our inability to know which thread will access a shared variable first.

- To avoid these complexities, Node.js is single-threaded. This means that all operations execute in a single thread. In
  other words, Node.js applications have a single call stack.

- A call stack operates as a queue. During execution, when an application steps into a function (executes the function),
  it pushes the function into the stack. When the application steps out of the function (the function returns), that
  function is removed from the call stack. A call stack records where in the program structure we are at any given time.

- In the scenario where a slow, or processing-heavy, function is added to the stack, we cannot move out of it and on to
  the next function until the current function has finished its execution.

- This can cause blocking, and slow execution of the application. While the stack is blocked, users cannot interact with
  the application as the Node.js runtime has one thread and can only do one thing at a time... or can it?

- Behind the scenes, there are C/C++ APIs that provide asynchronous input/output (I/O), and interaction with the
  operating system (OS), that allow code execution similar to multithreading without the same memory shortcomings. The
  Event Loop was implemented to assist with the interactions between these asynchronous components and the main
  application thread. The Event loop is implemented as part of the **libuv** library that provides cross-platform
  asynchronous I/O in Node.js.

