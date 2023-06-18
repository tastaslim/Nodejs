import express from "express";
import { log, error } from "console";
import { createReadStream } from "fs";
import { open } from "fs/promises";
import { pipeline, finished } from "stream";
const app = express();

app.get('/', async (req, res) => {
    try {
        // const fileHandlerRead = await open("./source_file.txt", "r");
        const fileHandlerWrite = await open("./dest_file.txt", "w");
        const readStream = createReadStream("./source_ile.txt");
        const writeStream = fileHandlerWrite.createWriteStream();

        pipeline(readStream, writeStream, (err) => {
            if (!err) {
                res.status(200).send({ status: 200, message: "Successful" });
            } else if (err.code == "ENOENT") {
                error(err);
                res.status(404).send({ status: 404, message: "Resource not found" });
            } else {
                error(err);
                res.status(500).send({ status: 500, message: "Something went wrong" });
            }
        });
    
        // finished(res, (err) => {
        //     res.destroy();
        // });

        readStream.on("error", (err)=> {
            error(err);
            if (!res.headersSent)
                res
                .status(500)
                .json({
                    message: "Please check the application logs for more details.",
                })
                .end();
        });
    } catch (err) {
        if (err.code == "ENOENT") {
            res.status(404).send({ status: 404, message: "Resource not found" });
        } else {
            res.status(500).send({ status: 500, message: "Something went wrong" });
        }
    }

});

app.listen(3000, () => {
    log("Server started on port 3000");
});
