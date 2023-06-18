// import { chmod, readdir, opendir } from "fs/promises";
// import { log } from "console";
// (async () => {
//     const changeFilePermission = async(filePath) => {
//         await chmod(filePath, 1);
//     };

//     const readDirectory = async (path) => {
//        try {
//            const dir = await opendir(path, { encoding: 'utf-8' });

//        } catch (err) {
//          const files = await readdir(path);
//          for (const file of files) {
//            log(file);
//          }
//        }
//     };

//     await readDirectory("./");
// })();

/*

//shape.js
import { log } from "console";
export class Shape {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }

  information() {
    log(`Shape is ${this.name}`);
    log(`Side is ${this.size}`);
  }
};

// square.js
export const area = (size)=> size * size; 

// index.js

import {Shape} from "./shape.js";
import { area } from "./square.js";
const squareShape = new Shape("Square", 5);
squareShape.information();
console.log(`Area is ${area(5)}`);
*/

