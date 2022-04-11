import {SqsConsumer, SqsConsumerEvents, SqsProducer} from 'sns-sqs-big-payload';
import AWS from "aws-sdk";
import _ from "lodash";
import {uuid} from "uuidv4";
import * as crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encrypt = (message, algorithm) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (message, algorithm) => {
    const messageArray = message.split(":");
    let iv = Buffer.from(messageArray[0], 'hex'); // message.iv
    let encryptedText = Buffer.from(messageArray[1], 'hex'); // message.encryptedData
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const msg = encrypt("Hey There!", algorithm);
console.log(msg);

const decMsg = decrypt(msg, algorithm);
console.log(decMsg);
//
const params = {
    accessKeyId: "AKIAUMEEQTD5762G7W6C",
    secretAccessKey: "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",
    region: "us-east-1",
};

const S3 = new AWS.S3(params);
const SQS = new AWS.SQS(params);

const publishMessage = async (queueUrl, messages, options) => {
    const producer = SqsProducer.create({
        queueUrl: queueUrl,
        sqs: SQS,
        s3: S3,
        largePayloadThoughS3: true,
        s3Bucket: 's3bucket-with-message-payloads',
    });
    /*
    * We can encrypt the messages too before sending to SQS.
    * */

    const encryptedMessages = _.map(messages, message => encrypt(message, algorithm));
    const Messages = _.map(encryptedMessages, (message) => {
        return producer.sendJSON(message, {
            MessageGroupId: options ? options.groupId : uuid.toString(),
            MessageDeduplicationId: uuid.toString(),
        })
    });
    return await Promise.all(Messages);
};


const consumeMessage = async (queueUrl, method, options) => {
    const consumer = SqsConsumer.create({
        queueUrl: queueUrl,
        sqs: SQS,
        s3: S3,
        getPayloadFromS3: true,
        s3Bucket: 's3bucket-with-message-payloads',
        batchSize: options && options.prefetchCount ? options.prefetchCount : 10,
        parsePayload: (payload) => JSON.parse(payload),
        handleMessage: async (msg) => {
            const payload = decrypt(msg, algorithm);
            // Function to consume messages
            try {
                //changeVisibilityTimeout(message.ReceiptHandle, 10);
                payload.extendVisibilityTimeout = async (seconds) => {
                    await SQS.changeMessageVisibility({
                        QueueUrl: queueUrl,
                        ReceiptHandle: msg.message.ReceiptHandle,
                        VisibilityTimeout: seconds,
                    }).promise();
                };
                await method(payload);
            } catch (e) {
                console.log(e);
            }
        },

    });

    consumer.on(SqsConsumerEvents.error, (err) => {
        console.log(err);
    });

    consumer.on(SqsConsumerEvents.connectionError, (err) => {
        console.log(err);
    });

    consumer.on(SqsConsumerEvents.processingError, (err) => {
        console.log(err);
    });

    consumer.on(SqsConsumerEvents.payloadParseError, (err) => {
        console.log(err);
    });

    consumer.on(SqsConsumerEvents.s3PayloadError, (err) => {
        console.log(err);
    });

    consumer.start();
};