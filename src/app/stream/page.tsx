import React, { Suspense } from 'react';
import ndjsonStream from 'can-ndjson-stream';

const ListElement = () => {
    return (
        <div>
            <p>Test</p>
        </div>
    );
};

const fetchData = async () => {
    // TODO: Need to provide complete url
    const streamResponse = await fetch('http://localhost:8080/stream', {
        method: 'GET',
    });
    const stream = ndjsonStream(streamResponse.body).getReader();
    let result: {
        done: boolean;
        value: any;
    } = {
        done: false,
        value: null,
    };
    while(!result || !result.done) {
        result = await stream.read();
        console.log(result.value);
    }
};
export default async function Dashboard(props: any) {

   const data = await fetchData();

    return (
        
        <ul>
            <Suspense fallback={<div>Loading...</div>}>
                <ListElement />
            </Suspense>
        </ul>
    );
}

