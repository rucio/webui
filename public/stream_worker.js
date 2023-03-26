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
//     //   Comlink.transferHandlers.get('messageport')!.release(this);
//       return;
//     }
//     Comlink.transfer(value.buffer, [value.buffer]);
//     this.read();
//   }
// }

async function streamObjects(url, callback) {
    console.log('streaming objects');
    console.log(url);
    setTimeout(() => {
        callback({
            id: 3,
            name: 'test',
            email: 'fromworker@email.com'
        });
    }, 5000);
}

Comlink.expose(streamObjects);