import { log } from "console";
import {
  watch,
  open,
  readFile,
  writeFile,
  unlink,
  rename,
} from "fs/promises";

(async () => {
    const fileHandler = await open("./doc.md", "r");
    let addedContent;
    try {
        const readFileContent = async (filePath) => {
            try {
                const contents = await readFile(filePath);
                log(contents.toString("utf-8"));
            } catch (err) {
                if (err.code === "ENOENT") {
                    log(`File/FilePath ${err.path} does not exist`);
                } 
            }
        };

        const createFile = async (filePath) => { 
            try {
                const fileOpener = await open(filePath, "r");
                log("File already exists");
                fileOpener.close();
            } catch (err) {
                if (err.code === "ENOENT") {
                    await writeFile(filePath, "");
                }
            }
        };
    

        const renameFile = async (filePath, newFilePath) => { 
            try {
                await rename(filePath, newFilePath);
                log(`File was renamed successfully`);
            } catch (err) {
                if (err.code === "ENOENT") {
                  log(`File/FilePath ${err.path} does not exist`);
              }
            }
        };

        const addContentToFile = async (filePath, fileContent) => {
            try {
              if (addedContent === fileContent) return; // To avoid multiple writes to same file with same content as write() has this behaviour. It is unsafe to use filehandle.write() multiple times on the same file without waiting for the promise to be resolved (or rejected).
              const fileOpener = await open(filePath, "a");
              addedContent = fileContent;
              fileOpener.write(fileContent);
              fileOpener.close();
              log(`Content was written successfully`);
            } catch (err) {
            if (err.code === "ENOENT") {
              log(`File/FilePath ${err.path} does not exist`);
            }
          }
        };
    
        const deleteFile = async (filePath) => { 
            try {
                await unlink(filePath);
                log("File Deleted Successfully");
            } catch (err) {
                 if (err.code === "ENOENT") {
                   log(`File/FilePath ${err.path} does not exist`);
                 }
            }
        };
    

        const READ_FILE = 'read a file', CREATE_FILE = 'create a file', DELETE_FILE = 'delete a file', RENAME_FILE = 'update a file', ADD_CONTENT_TO_FILE = 'add content to file';
        const watcher = watch('./', { recursive: true });

        const bufferSize = (await fileHandler.stat()).size;
        const offset = 0, position = 0, length = bufferSize;
        let buffer = Buffer.alloc(bufferSize);

        fileHandler.on("change", async () => {
            await fileHandler.read(buffer, offset, length, position);
            const contents = buffer.toString('utf-8'); // toString() decoded hexadecimal buffer to actual string data 
            if (contents.includes(READ_FILE)) {
                await readFileContent(contents.substring(READ_FILE.length + 1));
            }
            if (contents.includes(CREATE_FILE)) {
                await createFile(contents.substring(CREATE_FILE.length + 1));
            }
            if (contents.includes(DELETE_FILE)) {
                await deleteFile(contents.substring(DELETE_FILE.length + 1));
            }
            if (contents.includes(RENAME_FILE)) {
                await renameFile(contents.substring(RENAME_FILE.length + 1), contents.substring(RENAME_FILE.length + 3));
            }

            if (contents.includes(ADD_CONTENT_TO_FILE)) {
              await addContentToFile(
                contents.substring(
                  ADD_CONTENT_TO_FILE.length + 1,
                  ADD_CONTENT_TO_FILE.length + 7
                ),
                contents.substring(ADD_CONTENT_TO_FILE.length + 8)
              );
            }
        });

        for await (const event of watcher) {
            if (event.eventType == 'change') {
                fileHandler.emit("change");
            }
        }
    } catch (err) {
        log(err);
    } finally {
        fileHandler.close();
    }
    

})();