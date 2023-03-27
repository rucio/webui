importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

const Status = {
    NOT_STARTED: 'not_started',
    FETCHING: 'fetching',
    DONE: 'done',
    DRAINING: 'draining',
    
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
    }
    getBatches() {
        return this.batches;
    }
    pushObjectsToBuffer(data, buffer) {
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

    async drain(emptyBuffer = false, postDrainStatus = Status.FETCHING) {
        this.status = Status.DRAINING;
        let deleteCount = this.buffer.length - this.idealBufferLength;
        if (emptyBuffer) {
            deleteCount = this.buffer.length;
        } 
        const objectsToDrain = this.buffer.splice(0, deleteCount);
        console.log('Draining batch of size: ', deleteCount)
        const batchID = this.lastBatchID++;
        this.batches.push({
            id: batchID,
            data: objectsToDrain,
        });
        this.mutation.mutate(objectsToDrain);
        let isReady = await this.queryIsReadyToFetch();
        let currentBackPressureRatio = this.buffer.length / this.highWaterMark;
        while(!isReady && currentBackPressureRatio > this.idealBackPressureRatio) {
            console.log(`Waiting!! Query is processing batch: ${batchID}`)
            await new Promise(r => setTimeout(r, this.mutationWaitInterval));
            console.log('queryStatus', isReady)
            isReady = await this.queryIsReadyToFetch();
            currentBackPressureRatio = this.buffer.length / this.highWaterMark;
        }
        this.status = postDrainStatus;
        console.log('Draining complete! Query Status', await this.queryIsReadyToFetch())
    }
    
    async fetch() {
        const res = await fetch(this.url)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
        console.log('fetching', this.url)
        while (true) {
            this.status = Status.FETCHING;
            const { done, value } = await reader.read();
            if (done) {
                console.log('done reading stream! Final buffer size: ', this.buffer.length)
                await this.drain(1, Status.DONE);
                break;
            }
            const text = decoder.decode(value);
            this.pushObjectsToBuffer(text, this.buffer);
            const currentBackPressureRatio = this.buffer.length / this.highWaterMark;
            if (currentBackPressureRatio > this.idealBackPressureRatio) {
                await this.drain();                
            }
        }

    }
}

Comlink.expose(Fetch)







