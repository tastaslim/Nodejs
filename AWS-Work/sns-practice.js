import AWS from "aws-sdk"
import dotenv from "dotenv"

dotenv.config()
const params = {
    region: "us-east-1",
    accessKeyId: "AKIAUDPACRCPKXGFKWVC",
    secretAccessKey: "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",
}
const sns = new AWS.SNS(params)
