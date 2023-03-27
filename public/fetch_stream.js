importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

const Status = {
    NOT_STARTED: 'not_started',
    FETCHING: 'fetching',
    DONE: 'done',
    DRAINING: 'draining',
    
}


class Fetch {
    constructor(url, mutation) {
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
        this.mutationWaitInterval = 5000;
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

    drain(emptyBuffer = false, postDrainStatus = Status.FETCHING) {
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
        // while(this.mutation.isLoading) {
            console.log(this.mutation.status === 'loading')
            console.log(`Batch size: ${deleteCount} Status: ${this.status}`)
            setTimeout(() => {}, this.mutationWaitInterval);
        // }
        console.log('Draining complete. Buffer size: ', this.buffer.length, 'Status: ', postDrainStatus, '')
        this.status = postDrainStatus;
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
                this.drain(1, Status.DONE);
                break;
            }
            const text = decoder.decode(value);
            this.pushObjectsToBuffer(text, this.buffer);
            const currentBackPressureRatio = this.buffer.length / this.highWaterMark;
            if (currentBackPressureRatio > this.idealBackPressureRatio) {
                this.drain();                
            }
        }

    }
}
async function eventStream(url) {
    this.url = url;
    const res = await fetch(url)
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    // while (true) {
    //     const { done, value } = await reader.read();
    //     if (done) {
    //         // console.log('done reading stream');
    //         return;
    //     }
    //     const text = decoder.decode(value);
    //     // console.log('text', text);
    //     const objects = await convertNDJsonToObjects(text);
    //     // console.log('objects', objects);
    //     this.data = objects;
    // }
    return [
        {
            id: 4,
            name: 'test',
        },
        {
            id: 5,
            name: 'test2',
        },
    ]   
}
// Comlink.expose({eventStream, Fetch})
Comlink.expose(Fetch)







