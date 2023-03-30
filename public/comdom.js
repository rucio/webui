importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

const Status = {
    NOT_STARTED: 'not_started',
    RUNNING: 'running',
    DONE: 'done',
    PREPARING_BATCH: 'preparing_batch',
    ERROR: 'error'
    
}


class ComDOM {
    constructor(url, startFetching = false, verbose = false) {
        this.url = url;
        this.status = Status.NOT_STARTED;
        this.lastBatchID = 0;
        this.batches = [];
        this.buffer = []
        this.textBuffer = '';
        this.verbose = verbose;
        if(startFetching) {
            this.run();
        }
    }

    async pushObjectsToBuffer(data, buffer) {
        if (this.textBuffer !== '') {
            data = this.textBuffer + data;
            this.textBuffer = '';
        }
        data.split('\n').map((line) => {
            try {
                buffer.push(JSON.parse(line));
            } catch (e) {
                if (line !== '') {
                    console.log('error parsing line', line)
                }
                this.textBuffer += line;
            }
        });
    }
    
    log(msg) {
        if(this.verbose) {
            console.log(msg)
        }
    }

    async prepareBatch(final = false) {
        this.status = Status.PREPARING_BATCH;
        const batchID = this.lastBatchID++;
        const batchSize = this.buffer.length;
        if (batchSize === 0) {
            return;
        }
        
        this.log('Preparing batch of size: ', batchSize)

        this.batches.push({
            id: batchID,
            data: this.buffer.splice(0, this.buffer.length),
            next: !final
        });
    }
    
    async run() {
        const res = await fetch(this.url)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
        this.log('fetching', this.url)
        while (true) {
            this.status = Status.RUNNING;
            const { done, value } = await reader.read();
            if (done) {
                this.log('done reading stream! Final buffer size: ', this.buffer.length)
                await this.prepareBatch(true);
                this.status = Status.DONE;
                break;
            }
            const text = decoder.decode(value);
            await this.pushObjectsToBuffer(text, this.buffer);
            await this.prepareBatch();
        }
        this.log('done fetching', this.url)
    }

    getNextBatch() {
        if (this.batches.length === 0) {
            return null;
        }
        const batch = this.batches.shift();
        return batch;
    }

    isBatchAvailable() {
        return this.batches.length > 0
    }
    
    isDone() {
        if (this.status === Status.DONE) {
            return true;
        }
        return false;
    }
}

Comlink.expose(Fetch)

