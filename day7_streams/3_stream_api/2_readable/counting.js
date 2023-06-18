import { Readable } from "stream";
import { log } from "console";
class Counter extends Readable {
    constructor(opt) {
        super(opt);
        this._max = 100;
        this._index = 1;
    }

    _read() {
        const i = this._index++;
        if (this._index > this._max) {
            // Pushing null signals the read stream to be done. Now Destroy can be called
            this.push(null);
        } else {
            const str = String(i);
            this.push(Buffer.from(str), 'ascii');
        }
    }
}

(() => {
    const readStream = new Counter();
    readStream.on("data", (chunk) => {
        log(chunk);
    });
    
    readStream.on("end", (chunk) => {
      log("End");
    }); 
})();
