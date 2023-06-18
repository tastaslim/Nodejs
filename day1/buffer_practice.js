import { log } from "console";
import { Buffer, constants } from "buffer";
/* 
Buffer is a place to temporarily hold a fixed length sequence of data. You ca consider it as array of integers but with fixed length and has many special methods. 

import { log } from "console";
const buff = Buffer.alloc(8); // 8 Bytes of buffer in Hexadecimal notation (All the bytes will contain 0)

Creates a Buffer of length 10 filled with bytes which all have the value `1`.
const buf2 = Buffer.alloc(10, 1);

log(buff);

buff.write("s", "utf-8"); // Remember buffer is binary data and to write string to it we need some sort of encoding to convert string to byte. We use utf-8
log(buff); // Now the first byte would be occupied and contain character satisfies. You can check with hexadecimal calculator

buff.write("Taslim", "utf-8");

log(buff); //<Buffer 54 61 73 6c 69 6d 00 00> ==> You see last 2 characters in buffer are free (00) because each character in buffer contains 1 byte and Taslim has 6 characters only which is why only first 6 are filled.
You can also see buffer in JSON format as well.

log(buff.toJSON());

{
  type: 'Buffer',
  data: [
     84,  97, 115, 108,
    105, 109,   0,   0
  ]
} 

You see the type is Buffer. And data is present in unicode format. 84 => T, 97 => a, 115=> s, 108=>l, 105=>i, 109=>m


/*
Since buffer has a fixed size (array of data). If you write more data than it's length, it is simply going to ignore it.


buff.write("More Data To"); // write basically overwrites the previous data

log(buff.toJSON()); # to Return Object and data in form of array in decimal(base 10) format

{
  type: 'Buffer',
  data: [
    77, 111, 114, 101,
    32,  68,  97, 116
  ]
}

77 => M, 111 => o, 114=> r, 101=>e, space =>32, 68=>D, 97=>a, 116=>t 

log(buff.length); // 8
*/
/*****************************************/

// Buffer.alloc() and buffer.write() can be simply present using Buffer.from in 1 line. Also It dynamically calculates the size of buffer which needs to be allocated to temporarily store the data based on data size.
// In below case String=> Taslim only needs 6 blocks , hence 6 size buffer will be allocated. We can also assign the data of any format along with it's character encoding format and can use toString() to get the actual string data.
// const buff2 = Buffer.from("Taslim", "utf-8");
// log(buff2.toJSON());

// const buff3 = Buffer.from([84, 97, 115, 108, 105, 109], "hex"); // The elements in array can be at max 255(Pass in decimal format)
// log(buff3.toString("utf-8"));
// https://www.google.com/search?q=%E4%BD%A0english ==> 你 is encoded to %E4%BD%A0 hexadecimal notation

const buff3 = Buffer.from("E4BDA0", "hex"); // The elements in array can be at max 255(Pass in decimal format)
log(buff3.toString("utf-8"));

console.log(constants.MAX_LENGTH);