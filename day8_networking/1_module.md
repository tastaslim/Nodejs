# Module #

Each file in Node.js is treated as module. The most common use of modules is to use code or functions across different modules. This allows us to keep our code organized, as each module can serve a specific purpose.

```javascript
// square.js
export const area = (size) => size * size;

// shape.js

import { log } from "console";
export class Shape {
    constructor(name, size){
        this.name =  name;
        this.size =  size;
    }

    information(){
        log(`Shape is ${this.name}`);
        log(`Side is ${this.size}`);
    }
}

// index.js

import {Shape} from './shape.js';
import {area} from "./square.js";
const squareShape = new Shape('Square', 5);
squareShape.information();
console.log(`Area is ${square(5)}`);
```

---

Node.js has mainly two module systems:

- CommonJS modules and
- ECMAScript modules.
  
Note: **CommonJS** is the default module system.

Node.js has three types of modules:

1. **Core Modules**: Built-in modules like: http, fs, etc.
2. **Local Modules**: Locally created modules by programmers.
3. **Third-Party Modules**: Installed using NPM or yarn manager. Like express, axios etc.

---

## How require works in Node.js ##
When we require any module, it goes throw below steps:

```javascript
const express = require('express')
```
### 1. Resolving ###

- It first looks for core modules with that name.
- If no such core module is present, it looks for a file with same name within **node_modules** folder of the current project.
-  If still no module is found then it will look for it in the parent folders of the current folder.
- If a folder is found with that name containing an index.js file then that index.js file is loaded.
- For syntax with path starting with **./ or ../ like: const express = require('./lib/example.js')** :
Such syntax may contain an absolute path or a relative path. So the file present at that location is loaded in this case.
- Note: If no file is found after these steps then an error is thrown.
  
### 2. Loading ###
In this step Node loads the module and determines the type of file content

### 3. Wrapping ###

After loading, the module code is wrapped in a special function that will give access to a couple of objects. It also gives a separate scope to the variables.

```javascript
(function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
```
This wrapper allows us to:

- Keep variables, defined in the module, scoped to the module rather than the global object.
- Use variables, such as __dirname and __filename, for accessing the directory path and the filename of the module
  
While we may not be able to use this wrapper directly, it is important to know what Node.js is doing behind the screen, so that we can better understand the process.


### 4. Evaluating ###

At this step JavaScript Engine (usually V8) executes the code present in the wrapper function and exports functions or variables mentioned with the **module.exports/exports (For CommandJs) / export(For ES6)** in the file.

### 5.Caching ###

After the evaluation step, Node.js modules are cached (i.e., stored for future use) when the module is loaded for the first time. And later if you need to load the same node module next time then node.js does not go through above mentioned steps for that module again as it will copy that module from the cache.

**Note:** By default, the node finds the index.js file in the folder and loads it for any module but we can also create a package.json file in that folder where we can define the node module name which we want to load by default.

---

## How import works in Node.js ##
**import** is used for including modules in ES6 (version 6 of the ECMA Script) module system and present Node.js doesn't support ES6 import directly. You can make import including the modules using below ways:

**1. package.json way**

In package.json, provide type as module in root.
```json
// package.json
{
  "name": "taslim",
  "version": "1.0.0",
  "description": "Taslim's project",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Taslim Arif",
  "license": "MIT"
}

```

**2. Filename extension to .mjs instead of .js**

---

## Difference between Require and Import ##


<table>
<thead>
	<tr>
		<th>require</th>
		<th>import</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>It is used in the CommonJS module system</td>
		<td>It is used in the ES6 (ECMAScript version 6) module system.</td>
	</tr>
	<tr>
		<td>Loading is synchronous in require (i.e., modules are imported sequentially.)</td>
		<td>Loading is asynchronous in import (i.e., modules are imported without waiting for previous module import to complete.)</td>
	</tr>
	<tr>
		<td>Because of synchronous loading performance of require less efficient than import.</td>
		<td>Because the Asynchronous loading performance of import is better than require.</td>
	</tr>
	<tr>
		<td>If we import a module using require then the complete module is imported. So, memory usage is more.</td>
		<td>Using import we can selectively load pieces of code in the module. So, memory usage is less compared to require.</td>
	</tr>
	<tr>
		<td>require imports of the components exported by module. exports in the module.</td>
		<td>import includes components exported by export in the module.</td>
	</tr>
	<tr>
		<td>require can be called anywhere in the program</td>
		<td>import works only at the top of the program</td>
	</tr>
</tbody>
</table>

--- 
When we say import works only at the top of the program and require can be called anywhere in the program, we mean below:

```javascript
import {log} from "console"; // correct
(async() => {
    import {post} from "axios"; // Gives error
});
```

```javascript
const console = require("console"); // correct
(async() => {
    const axios =require("axios"); //  Works fine
});
```

