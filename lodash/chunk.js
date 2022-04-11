/*
  _.chunk(array, size)
  Creates an array of elements, split into groups the length of size. If array can’t be split evenly, the final chunk
  will be the remaining elements.
 */
import _ from "lodash";

const baseUrl = "https://www.breakingbadapi.com/api/";
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const x = _.chunk(arr, 2);
// console.log(x);


// Given a list of ids, return the id and name of the users for a set of users.

const listInformation = async (ids) => {
    try {
        _.map(_.chunk(ids, 2), async (id) => {
            //publish 2 ids in the queue at a time. Say our use case is to publish few keys so that we don't overwhelm
            // CPU, we can use _.chunk for that case.
            // You can put any of your use case here
        });
    } catch (err) {
        console.log(err);
    }
};

listInformation(arr).then(r => console.log(r)).catch(e => console.log(e));

