import AWS from "aws-sdk"
// import dotenv from "dotenv"
//
// dotenv.config();
const params = {
    region: "us-east-1",
    accessKeyId: "AKIAUMEEQTD5762G7W6C",
    secretAccessKey: "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"
};
const sqs = new AWS.SQS(params);
const listQueues = async () => {
    try {
        return await sqs.listQueues().promise()
    } catch (err) {
        console.log(err.message)
    }

};

const getQueue = async (queueName) => {
    try {
        return await sqs.getQueueUrl({QueueName: queueName}).promise()
    } catch (err) {
        console.log(err.message)
    }
};


const deleteQueue = async (queueUrl) => {
    try {
        return await sqs.deleteQueue({QueueUrl: queueUrl}).promise()
    } catch (err) {
        console.log(err.message)
    }
};

const createQueue = async (params) => {
    try {
        return await sqs.createQueue(params).promise()
    } catch (err) {
        console.log(err.message)
    }
};

const sendMessage = async (params) => {
    try {
        return await sqs.sendMessage(params).promise()
    } catch (err) {
        console.log(err.message)
    }
};


const receiveMessage = async (params) => {
    try {
        return await sqs.receiveMessage(params).promise()

        // //Once consumed delete that message
        // for (let message of messages.Messages) {
        //     console.log(message.Body)
        //     await deleteMessage({
        //         QueueUrl: params.QueueUrl,
        //         ReceiptHandle: message.ReceiptHandle
        //     }).promise()
        // }
    } catch (err) {
        console.log(err.message)
    }
};

const deleteMessage = async (params) => {
    try {
        return await sqs.deleteMessage(params).promise()
    } catch (err) {
        console.log(err.message)
    }
};

const purgeQueue = async (params) => {
    try {
        return await sqs.purgeQueue(params).promise()
    } catch (err) {
        console.log(err.message)
    }
};

const changeVisibilityTimeout = async (params) => {
    try {
        return await sqs.changeMessageVisibility(params).promise()
    } catch (err) {
        console.log(err.message)
    }
};
listQueues().then(res => console.log(res)).catch(err => console.log(err));
// getQueue("test-queue.fifo").then(res => console.log(res)).catch(err => console.log(err))
// deleteQueue("https://sqs.us-east-1.amazonaws.com/282327156894/test-queue.fifo").then(res => console.log(res)).catch(err => console.log(err))

// createQueue("test-queue").then(res => console.log(res)).catch(err => console.log(err)) // -- creates Standard queue

// createQueue({
//     Attributes: {
//         "FifoQueue": "true"
//     },
//     QueueName: "fifo-queue.fifo"
// }).then(res => console.log(res)).catch(err => console.log(err))

// sendMessage({
//     MessageBody: `{
//         "keys": ["key1", "key2", "key3"],
//         encryption: "AES256",
//         name: "worker"
//     }`,
//     QueueUrl: "https://sqs.us-east-1.amazonaws.com/282327156894/fifo-queue.fifo",
//     MessageGroupId: "1",
//     MessageDeduplicationId: "1"
// }).then(res => console.log(res)).catch(err => console.log(err))

// receiveMessage({
//     QueueUrl: "https://sqs.us-east-1.amazonaws.com/282327156894/fifo-queue.fifo",
//     MaxNumberOfMessages: 10,
//     VisibilityTimeout: 1000,
//     WaitTimeSeconds: 10
// }).then(res => console.log(res)).catch(err => console.log(err))

//
// deleteMessage({
//     QueueUrl: 'https://sqs.us-east-1.amazonaws.com/282327156894/fifo-queue.fifo',
//     ReceiptHandle: 'AQEBirZu4KsoV37Z0qv0heNRL5GLgoWIjpy0DowDV5IgKXvOkm73MMVCg5d8WstXe7It9vcMD0Xedalfxg2RDBmX91YmzE+m+J99Ijt7v6P6rSNy+bGhy91pov0oKhU1oGscgxEyN9VBbzIjUeDKT8wyFmsWkA3XyjqCCBuGovcp+tsTr0sNzSd0W0h/65jl47Iha25DUCBRO6nS64h0qljxJsc5aaojuAl+05KXKEGA5tMOIps8rSGAIUljyQnpuqmozMgdzq2VrDMv1GfOFSvofw==',
// }).then(res => console.log(res)).catch(err => console.log(err))

// purgeQueue({
//     QueueUrl: 'https://sqs.us-east-1.amazonaws.com/282327156894/fifo-queue.fifo',
// }).then(res => console.log(res)).catch(err => console.log(err))

// changeVisibilityTimeout({
//     QueueUrl: 'https://sqs.us-east-1.amazonaws.com/282327156894/fifo-queue.fifo',
//     ReceiptHandle: 'AQEBirZu4KsoV37Z0qv0heNRL5GLgoWIjpy0DowDV5IgKXvOkm73MMVCg5d8WstXe7It9vcMD0Xedalfxg2RDBmX91YmzE+m+J99Ijt7v6P6rSNy+bGhy91pov0oKhU1oGscgxEyN9VBbzIjUeDKT8wyFmsWkA3XyjqCCBuGovcp+tsTr0sNzSd0W0h/65jl47Iha25DUCBRO6nS64h0qljxJsc5aaojuAl+05KXKEGA5tMOIps8rSGAIUljyQnpuqmozMgdzq2VrDMv1GfOFSvofw==',
//     VisibilityTimeout: 3500
// }).then(res => console.log(res)).catch(err => console.log(err))