import React, { Suspense } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
const ListElement = () => {
    return (
        <div>
            <p>Test</p>
        </div>
    );
};

const fetchData = async () => {
    // TODO: Need to provide complete url
    const streamResponse = await fetch('http://localhost:3000/api/stream', {
        method: 'GET',
    });
    if(!streamResponse.ok || streamResponse.body === null) {
        throw new Error('Error while fetching data');
    }
    streamResponse.body.on('data', (chunk: any) => {
        console.log(chunk.toString());
    });
    streamResponse.body.on('end', () => {
        console.log('end');
    });
    return streamResponse;
};
export default async function Dashboard(props: any) {

    const data = await fetchData();
    
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ListElement />
            </Suspense>
        </>
    );
}

