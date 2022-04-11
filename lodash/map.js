import _ from "lodash";
import axios from "axios";

const arr = [1, 2, 3, 4, 5];
const baseUrl = "https://www.breakingbadapi.com/api/";
/*
_.map(array, iteratee) is used to iterate over the elements of an array and perform actions on them according to the
requirements.
*/
const newArr = _.map(arr, element => {
    return element * 2;
});

// Given an array of elements, find data of each
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const listData = async (ids) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return await Promise.all(_.map(ids, id => {
        return axios.get(`${baseUrl}characters/${id}`, {headers}).then(res => {
            return res.data;
        }).catch(err => {
            return err.data;
        });
    }));
};

// listData(ids).then(data => {
//     console.log(data);
// }).catch(err => {
//     console.log(err);
// });

const names = ["John", "Jane", "Joe", "Jack", "Jill"];
const query = `INSERT INTO characters (name) VALUES ${_.map(arr, element => `(${element},true)`).join(",")};`;
console.log(query);