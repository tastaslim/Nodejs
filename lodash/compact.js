import _ from "lodash";
/*
* Creates an array with all falsy values removed. The values false, null, 0, "", undefined, and NaN are falsy.
* */
const arr = [1, 2, 3, 4, 5];
console.log(_.compact(arr));