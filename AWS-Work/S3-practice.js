import AWS from "aws-sdk";
import _ from "lodash";
import * as zlib from "zlib";
import replace from "stream-replace";
import str from "string-to-stream";
// import {createWriteStream} from "fs";
// // listBuckets().then(res=>console.log(res)).catch(err=>console.log(err));
// // // getBucketAcl('sfapex-migration').then(res=>console.log(res)).catch(err=>console.log(err));
// // // createBucket('sfapex-final').then(res=>console.log(res)).catch(err=>console.log(err));
// // // deleteBucket('sfapex-final').then(res=>console.log(res)).catch(err=>console.log(err));
// // downloadBucketData('sfapex-test').then(res=>console.log(res)).catch(err=>console.log(err));
// // uploadData('sfapex-test').then(res => console.log(res)).catch(err => console.log(err));
//
// // const a = ["1", "2", "3"];
// // console.log(a.join(''));
//
// // const fileData = fs.readFileSync("./test", 'utf-8');
// // const arr = fileData.split('}');
// // const jsonData = JSON.parse(arr[0] + '}');
// // jsonData.VersionData = "xyz";
// // console.log(jsonData.VersionData);
// // let i;
// // let key = "jeet_test/_ - 2021-03-02 17:37:13/ContentVersion/_blob/0/1";
// // let keyArray = key.split("/");
// // //
// // for (i = 0; i < keyArray.length; i++)
// //     if (keyArray[i].match(/[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g))
// //         break;
// // const definitionId = 256;
// // const str1 = `${definitionId}/${keyArray.slice(i).join("/")}`;
// // // const result = fileData.replaceAll(key, str1);
// // const searchRegExp = new RegExp(key, 'g'); // Throws SyntaxError
// // const result = fileData.replaceAll(searchRegExp, str1);
// // await fs.writeFileSync("test", result, 'utf-8');
// /*
//  List bucket keys
// */
//
// export const getObject1 = async (bucket, key) => {
//     try {
//         const params = {
//             Bucket: bucket,
//             Key: key
//         }
//         const result = await S3.getObject(params).promise();
//         return result.Body.toString();
//     } catch (err) {
//         console.log(err)
//     }
// }
//
// const uploadData = async (bucket) => {
//     try {
//         const keys = await bucketData(bucket);
//         // const options = {
//         //     partSize: 10 * 1024 * 1024,
//         //     queueSize: 5
//         // }
//         for (let i = 0; i < keys.length; i++) {
//             const key = keys[i];
//             const data = await getObject1(bucket, key);
//             const params = {
//                 Bucket: bucket,
//                 Key: key,
//                 Body: data
//             };
//             await S3.upload(params, options).promise();
//             console.log(data);
//         }
//     } catch (err) {
//         console.log(err)
//     }
// };
//
//
// /*
//  List all buckets
// */
// export const listBuckets = async () => {
//     try {
//         const result = await S3.listBuckets().promise();
//         return result.Buckets;
//     } catch (err) {
//         console.log(err)
//     }
// }
//
// /*
// * Create Bucket
// */
// export const createBucket = async (bucket) => {
//     try {
//         return await S3.createBucket({Bucket: bucket}).promise();
//     } catch (err) {
//         console.log(err)
//     }
// }
//
// /*
// * Get Bucket
// */
//
// export const getBucket = async (bucket) => {
//     try {
//         const result = await S3.listBuckets().promise();
//         const bucket = _.filter(result.Buckets, bucket => bucket.Name === bucket);
//         return bucket[0]
//     } catch (err) {
//         console.log(err)
//     }
// }
//
// /*
// * Delete Bucket
// */
//
// export const deleteBucket = async (bucket) => {
//     try {
//         return await S3.deleteBucket({Bucket: bucket}).promise();
//     } catch (err) {
//         console.log(err)
//     }
// }
//
// /*
// * Get Bucket ACL==> Bucket permissions
// * */
//
// export const getBucketAcl = async (bucket) => {
//     try {
//         const data = await S32.getObject({
//             Bucket: bucket,
//             Key: "/572/_ - 2022-01-19 12:50:33/Attachment/_blob/0/100"
//         }).promise();
//         const body = data.Body;
//         const stream = str(body, 'utf-8');
//         await stream.pipe(createWriteStream('./test'));
//     } catch (err) {
//         console.log(err)
//     }
// }
//
// /*
// *  Get File type and extension
// * */
//
// export const headObject = async (Bucket, keyName) => {
//     return await S3.headObject({Bucket: process.env.Bucket, Key: keyName}).promise();
// }
//
// /*
// * Download data
// * */
// export const downloadBucketData = async (bucket) => {
//     try {
//         const listResults = await S3.listObjectsV2(
//             {
//                 Bucket: bucket,
//                 Prefix: '_ - 2021-06-11 20:34:04/Account'
//             }).promise();
//         // console.log(listResults.Contents[0]);
//         const keys = _.map(listResults.Contents, content => content.Key);
//         console.log(keys.length);
//         // const fileInfo = await headObject(bucket,keys[0]);
//         // const contentType = fileInfo.ContentType.split('/')[1];
//         // console.log(contentType);
//         for (let i = 0; keys && i < keys.length; i++) {
//             const key = keys[i];
//             console.log(key);
//             const params = {
//                 Key: key,
//                 Bucket: bucket,
//             }
//             // const dataStream=await S3.getObject(params).createReadStream();
//             // dataStream.pipe(fs.createWriteStream(`data${i}.${contentType}`));
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }
// // const str11 = '_ - 2020-02-30 19:56:50';
// // console.log(str11.match(/[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g));
// // let arr = str11.split('/');
// // console.log(arr[1].match(/^\d{4}\-\d{1,2}\-\d{1,2}$/));
// // let j = 0;
// // console.log(arr)
// // const data = _.forEach(arr, (item) => item.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/) ? j++ : '')
// //     .slice(j).join('/');
// // console.log(j)
// // console.log(data);
// // for (let i = 0; i < arr.length; i++) {
// //     const res = arr[i].match(/[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g);
// //     // console.log(res)
// //     if (!res) {
// //         j += 1;
// //     }
// // }
// // arr = arr.slice(j);
// // const data = arr.join('/');
// // console.log(data)
// // const reg=/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g;
// // console.log(res);
// bucketData('sfapex-test').then(res => console.log(res)).catch(err => console.log(err))
//
// dotenv.config()

const params = {
    accessKeyId: "AKIAUMEEQTD5762G7W6C",
    secretAccessKey: "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"
};

const params2 = {
    accessKeyId:'AKIA36WJA6MOMVFP5FVK',
    region:'us-east-1',
    secretAccessKey:'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'
}

const S32= new AWS.S3(params2);
const S3 = new AWS.S3(params);

export const bucketData = async (bucket) => {
    try {
        let nextPageToken, check;
        const x = new Date().getTime() / 1000;
        do {
            const params = {
                ContinuationToken: nextPageToken || undefined,
                Bucket: bucket,
                Prefix: "aaa/_ - 2021-03-21 06:54:17/ContentVersion",
            };
            console.log(`Listing keys from bucket: ${bucket}`);
            const response = await S3.listObjectsV2(params).promise();
            const keys = _.map(response.Contents, (content) => {
                return content.Key;
            });
            console.log(keys.length);
            const options = {
                partSize: 10 * 1024 * 1024,
                queueSize: 10
            };

            // const x = new Date().getTime() / 1000;
            // await Promise.all(keys.map(async (key) => {
            //     const params = {
            //         Bucket: bucket,
            //         Key: `${key}`,
            //         // SSECustomerAlgorithm: 'AES256',
            //         // SSECustomerKey: Buffer.alloc(32, '123', 'base64'),
            //     };
            //     let keyArray = key.split("/");
            //     console.log(`Reading object: ${key}`);
            //     try {
            //         const data = await S3.getObject(params).promise();
            //         const body = data.Body;
            //         let stream = str(body, 'utf8');
            //         let tempArr = keyArray.slice(0, keyArray.length - 1).join("/");
            //         const replacer = new RegExp(tempArr, 'g');
            //         let i;
            //         for (i = 0; i < keyArray.length; i++)
            //             if (keyArray[i].match(/[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g))
            //                 break;
            //         const definitionId = "AAA";
            //         const str1 = keyArray.slice(i, keyArray.length - 1).join("/");
            //         let tempArr2 = "/" + str1;
            //         const replacer2 = new RegExp(tempArr2, 'g');
            //         const mainKey = `${definitionId}/${keyArray.slice(i).join("/")}`;
            //         if (keyArray.indexOf("_blob") === -1 && keyArray.indexOf("_metadata_backup.zip") === -1) {
            //             stream = await stream
            //                 .pipe(zlib.createGunzip())
            //                 .pipe(replace(replacer, str1))
            //                 .pipe(replace(replacer2, str1))
            //                 .pipe(zlib.createGzip());
            //
            //             if (keyArray.indexOf("ContentVersion") !== -1 && keyArray.indexOf("_blob") === -1) {
            //                 stream = await stream
            //                     .pipe(zlib.createGunzip())
            //                     .pipe(replace(/"IsMajorVersion":"true"/g, '"IsMajorVersion":"false"'))
            //                     .pipe(zlib.createGzip());
            //
            //             }
            //         }
            //
            //
            //         const uploadParams = {
            //             Bucket: `${bucket}`,
            //             Key: `${mainKey}`,
            //             Body: `${stream}`,
            //             ContentType: data.ContentType,
            //         };
            //         console.log(`Uploading key: ${mainKey}`);
            //         await S3.upload(uploadParams, options).promise();
            //         console.log("Successfully uploaded data to " + bucket + "/" + key);
            //     } catch (err) {
            //         console.log(`Error uploading ${key}: ${err}`);
            //     }
            // }));
            // console.log(new Date().getTime() / 1000 - x);
            // const x = new Date().getTime() / 1000;
            for (let k = 0; k < keys.length; k++) {
                let key = keys[k];
                console.log(key);
                let keyArray = key.split("/");
                const getObjectParams = {
                    Bucket: bucket,
                    Key: `${key}`
                };
                const data = await S3.getObject(getObjectParams).promise();
                const body = data.Body;
                let stream = str(body, 'utf8');
                let tempArr = keyArray.slice(0, keyArray.length - 1).join("/");
                const replacer = new RegExp(tempArr, 'g');
                let i;
                for (i = 0; i < keyArray.length; i++)
                    if (keyArray[i].match(/[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g))
                        break;
                const definitionId = "1";
                const str1 = keyArray.slice(i, keyArray.length - 1).join("/");
                let tempArr2 = "/" + str1;
                const replacer2 = new RegExp(tempArr2, 'g');
                const mainKey = `${definitionId}/${keyArray.slice(i).join("/")}`;
                if (keyArray.indexOf("_blob") === -1 && keyArray.indexOf("_metadata_backup.zip") === -1) {
                    stream = await stream
                        .pipe(zlib.createGunzip())
                        .pipe(replace(replacer, str1))
                        .pipe(replace(replacer2, str1))
                        .pipe(zlib.createGzip());


                    // if (keyArray.indexOf("ContentVersion") !== -1 && keyArray.indexOf("_blob") === -1) {
                    //     stream = await stream
                    //         .pipe(zlib.createGunzip())
                    //         .pipe(replace(/"IsMajorVersion":"true"/g, '"IsMajorVersion":"false"'))
                    //         .pipe(zlib.createGzip());
                    //
                    // }
                }


                const uploadParams = {
                    Bucket: "abhijitvaidya-test-1",
                    Key: `${mainKey}`,
                    Body: `${stream}`,
                    ContentType: data.ContentType,
                };
                console.log(`Uploading key: ${mainKey}`);
                await S3.upload(uploadParams, options).promise();
                console.log("Successfully uploaded data to " + bucket + "/" + key);
            }
            nextPageToken = response.NextContinuationToken;
            check = response.IsTruncated;
        } while (check);

        console.log(new Date().getTime() / 1000 - x);
    } catch (err) {
        console.log(err.message);
    }
};

// const search = "_ - 2021-06-11 20:34:04/Document";
// const replacer = new RegExp(search, 'g');
bucketData('sfapex-test').then(res => console.log(res)).catch(err => console.log(err));

// fs.createReadStream("./task").pipe(zlib.createGunzip()).pipe(replace(replacer, 'taslim')).pipe(fs.createWriteStream("./test1"));
// const str = fs.readFileSync("./test", 'utf-8');
// const result = str.replace(replacer, 'John');
// fs.writeFileSync("test", result, 'utf-8');
// console.log(result);
// getBucketAcl('taslim-arif').then(res => console.log(res)).catch(err => console.log(err))