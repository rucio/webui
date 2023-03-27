// web worker to stream data from a url
// fetch from a url
// stream response.body
// on data, send to parent
// on end, send to parent

importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

// class StreamWorker {
//   constructor() {
//     this.url = null;
//     this.stream = null;
//     this.reader = null;
//   }

//   async start(url) {
//     this.url = url;
//     this.stream = await fetch(this.url);
//     this.reader = this.stream.body.getReader();
//     this.read();
//   }

//   async read() {
//     const { done, value } = await this.reader.read();
//     if (done) {
//       if (Comlink.transferHandlers.get('messageport')!== null){
//          Comlink.transferHandlers.get('messageport').release(this)
//         };
//       return; 
//     }
//     Comlink.transfer(value.buffer, [value.buffer]);
//     this.read();
//   }
// }

async function streamObjects(url, callback) {
    // console.log('streaming objects');
    const res = await fetch(url)
    const worker = new StreamWorker();
    
    // console.log(url);
    setTimeout(() => {
        callback({
            id: 3,
            name: 'test',
            email: 'fromworker@email.com'
        });
    }, 5000);
}
async function pushObjectsToBuffer(data) {
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
async function fetchObjects(url, callback) {
    // console.log('fetching objects');
    const res = await fetch(url)
    // parse response from body stream

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let data = '';
    let batchID = 0;
    let batchSize = 100;
    while (true) {
        const { done, value } = await reader.read();
        batchID++;
        if (done) {
            break;
        }
        // console.log('chunk', count, decoder.decode(value));
        data += decoder.decode(value);
        if (data.length > batchSize) {
            let objects = await pushObjectsToBuffer(data);
            console.log('batch', objects);
            callback(batchID, objects, false);
            data = '';
        }
    }
    // send final batch
    // console.log('final batch', data);
    callback(batchID++, await pushObjectsToBuffer(data), false);
    // setTimeout(() => {
    //     callback({
    //         id: 3,
    //         name: 'test',
    //     });
    // }, 5000);
}
Comlink.expose(fetchObjects);