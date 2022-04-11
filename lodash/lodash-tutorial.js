import _ from "lodash";
import axios from "axios";
const baseUrl ="https://www.breakingbadapi.com/api";
export const lodashTutorial=async()=>{
    const url =`${baseUrl}/characters`;
    const headers={
        'Content-Type':'application/json'
    };
    const response = await axios.get(url, {headers});
    const data = response.data;
    const firstCharacter = _.first(data),lastCharacter = _.last(data);
    console.log(firstCharacter,lastCharacter);
};

// lodashTutorial().then(res=>console.log()).catch(err=>console.log(err));
const arr=[{"age":1},{"age":2},{"age":3},{"age":4},{"age":1},{"age":2}];
// const sum=_.sum(arr);
let result = _.map(arr,key=>key.age);
// console.log(_.nth(result,3))
result=_.filter(result,res=>res===1);
// console.log(result);
// const filter=_.filter(arr,element=>element===2);
// console.log(_.isArguments(result));
