import * as Comlink from 'comlink';

async function fetchStream() {
    console.log('fetching')
}
Comlink.expose(fetchStream)