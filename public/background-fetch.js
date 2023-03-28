importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

const Status = {
    NOT_STARTED: 'not_started',
    FETCHING: 'fetching',
    DONE: 'done',
    PREPARING_BATCH: 'draining',
    
}


class Fetch {
    constructor(url, mutation, queryIsReadyToFetch) {
        this.url = url;
        this.mutation = mutation;
        this.status = Status.NOT_STARTED;
        this.lastBatchID = 0;
        this.batches = [];
        this.buffer = []
        this.textBuffer = '';
        this.highWaterMark = 100;
        this.idealBackPressureRatio = 0.5;
        this.idealBufferLength = this.highWaterMark * this.idealBackPressureRatio;
        this.mutationWaitInterval = 50;
        this.queryIsReadyToFetch = queryIsReadyToFetch;
        // start fetching data in background
        this.fetchData(url)
    }

    getBatches() {
        return this.batches;
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
    

    async prepareBatch() {
        this.status = Status.PREPARING_BATCH;
        const batchID = this.lastBatchID++;
        const batchSize = this.buffer.length;
        if (batchSize === 0) {
            return;
        }
        console.log('Preparing batch of size: ', batchSize)
        this.batches.push({
            id: batchID,
            data: this.buffer.splice(0, this.buffer.length),
        });
    }
    
    async fetchData() {
        const res = await fetch(this.url)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
        console.log('fetching', this.url)
        while (true) {
            this.status = Status.FETCHING;
            const { done, value } = await reader.read();
            if (done) {
                console.log('done reading stream! Final buffer size: ', this.buffer.length)
                await this.prepareBatch(true, Status.DONE);
                this.status = Status.DONE;
                break;
            }
            const text = decoder.decode(value);
            await this.pushObjectsToBuffer(text, this.buffer);
            await this.prepareBatch();
        }
        console.log('done fetching', this.url)
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


    getStatus() {
        if (this.status === Status.DONE && this.batches.length === 0) {
            return true;
        }
        return false;
    }

    async terminate() {
        this.status = Status.TERMINATION_REQUESTED;
    }

    async waitForTermination() {
        while (this.status !== Status.TERMINATION_REQUESTED) {
            await new Promise(r => setTimeout(r, 100));
        }
    }
}

Comlink.expose(Fetch)

