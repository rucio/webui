importScripts("/comlink.js");

const Status = {
    STOPPED: 'stopped',
    RUNNING: 'running',
    DONE: 'done',
    PREPARING_BATCH: 'preparing_batch',
    ERROR: 'error'
}


class ComDOM {
    constructor(verbose = false) {
        this.status = Status.STOPPED;
        this.lastBatchID = 0;
        this.batches = [];
        this.buffer = []
        this.textBuffer = '';
        this.verbose = verbose;
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
                    this.log('error parsing line', line)
                }
                this.textBuffer += line;
            }
        });
    }
    
    log(...msg) {
        if(this.verbose) {
            console.log('ComDOMWorker@', this.url, new Date().toTimeString(), ...msg)
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
    
    async run(request) {
        this.url = request.url;
        this.method = request.method;
        this.body = request.body;
        this.headers = new Headers();
        let headersDict = request.headers;
        for (const key in headersDict) {
            this.headers.append(key, headersDict[key]);
        }
        this.log('fetching', this.method, this.url, 'with headers', this.headers, 'and body', this.body)
        let fetchDetails = {}
        fetchDetails['method'] = this.method
        if(this.headers !== null) fetchDetails['headers'] = this.headers
        if(this.body !== null) fetchDetails['body'] = JSON.stringify(this.body)
        const res = await fetch(this.url, fetchDetails);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
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

    getStatus() {
        return this.status;
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

Comlink.expose(ComDOM);

