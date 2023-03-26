importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

const Status = {
    NOT_STARTED: 'not_started',
    FETCHING: 'fetching',
    DONE: 'done',
    
}

const response = {
    // url: "",
    // status: Status.NOT_STARTED,
    // lastBatchID: 0,
    // batches: [],
    // eventStream,
    data: [],
    lastIndex: 2,
    eventStream() {
        const iterations = Math.floor(Math.random()*100)
        this.data = [
            {
                id: this.lastIndex++,
                name: `test-${this.lastIndex}`,
            },
            {
                id: this.lastIndex++,
                name: `test-${this.lastIndex}`,
            },
        ]
    }
}
async function convertNDJsonToObjects(data) {
    const result = [];
    const objects = data.split('\n').map((line) => {
        // try to parse as json, if not, return nothing
        try {
            result.push(JSON.parse(line));
        } catch (e) {
            // console.log('error parsing line', line, e)
            return null;
        }
    });
    return result;
}

class Fetch {
    constructor(url, mutation) {
        this.url = url;
        this.mutation = mutation;
        this.status = Status.NOT_STARTED;
        this.lastBatchID = 0;
        this.batches = [];
        this.data = [];
    }
    async fetch() {
        this.status = Status.FETCHING;
        const res = await fetch(this.url)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                // console.log('done reading stream');
                break;
            }
            const text = decoder.decode(value);
            // console.log('text', text);
            const objects = await convertNDJsonToObjects(text);
            // console.log('objects', objects);
            this.data = objects;
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
Comlink.expose({eventStream, Fetch})







