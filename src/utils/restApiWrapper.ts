import { env } from '../util'

const defaultHostEndpoint: string | undefined = env('RUCIO_HOST')

export async function postData(
    endpoint: string | undefined = '/',
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(host + endpoint, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response
}

export async function getData(
    endpoint: string | undefined = '/',
    queryParams:
        | string
        | string[][]
        | Record<string, string>
        | URLSearchParams
        | undefined = {},
    headers: HeadersInit | undefined = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'GET',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        },
    )
    return response
}

export async function putData(
    endpoint: string | undefined = '/',
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(host + endpoint, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response
}

export async function deleteData(
    endpoint: string | undefined = '/',
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(host + endpoint, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response
}

export async function streamData(
    endpoint: string | undefined = '/',
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<any> {
    fetch(host + endpoint, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/x-json-stream'
        },
    }).then(response => { 
    const reader = response.body?.getReader()
    return new ReadableStream({
        start(controller) {
          return pump();
          function pump(): any {
            return reader?.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                console.log('Stream complete');
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        }
      })
    })
    .then((stream) => new Response(stream))
    .then((response) => {
        return response.text()
    })
    .then(data => {
        console.log(data)
        const split_data = data.split('\n');
        const ret_data = [];
        for (let i = 0; i < split_data.length; i++) {
            if (split_data[i].length <= 0) {
                break;
            }
            ret_data.push(JSON.parse(split_data[i].replace(/Infinity/g, "-1")));
        }
        return ret_data;
    })

    
    
    // reader?.read().then(function processResult(result): Promise<ReadableStream> | undefined {
    //     if (result.done) {
    //         console.log('Stream complete')
    //     } else {
    //         console.log(result.value)
    //         return reader?.read().then(processResult)
    //     }
    // })
    // function processStreamResponse(result:any, ret_data: any[]): any[] | undefined {
    //     if (result.done) {
    //         console.log('Stream complete')
    //         return undefined
    //     } else {
    //         if (result.value !== undefined){
    //             const data = String.fromCharCode.apply(null, Array.from(result.value))
    //             const split_data = data.split('\n');
                
    //             for (let i = 0; i < split_data.length; i++) {
    //                 if (split_data[i].length <= 0) {
    //                     break;
    //                 }
    //                 ret_data.push(JSON.parse(split_data[i].replace(/Infinity/g, "-1")));
    //             }
    //             console.log(ret_data);
    //         }
    //         return ret_data
    //     }
    // }
    
    // function processData(stream:any): Promise<ReadableStream> | undefined {
    //     const ret_data: any[] = [];
    //     const data = stream.read()
    //     data.then(function processResult(result:any): Promise<ReadableStream> | undefined {
    //         if (result.done ) {
    //             console.log('Stream complete')
    //         } else {
    //             if (result.value !== undefined){
    //                 const data = String.fromCharCode.apply(null, Array.from(result.value))
    //                 const split_data = data.split('\n');
                    
    //                 for (let i = 0; i < split_data.length; i++) {
    //                     if (split_data[i].length <= 0) {
    //                         break;
    //                     }
    //                     ret_data.push(JSON.parse(split_data[i].replace(/Infinity/g, "-1")));
    //                 }
    //                 console.log(ret_data);
    //             }
    //             return processData(stream)
            
    //             //     const arr = JSON.stringify(result.value, (k, v: any) => {
    //             //         if (v !== null && v !== undefined && v instanceof Uint8Array) {
    //             //             console.log(v)
    //             //             return String.fromCharCode.apply(null, Array.from(result.value))
    //             //         }
    //             //         return v
    //             //     })
    //             //     result = String.fromCharCode.apply(null, Array.from(result.value))
    //             //     for (data of result){
    //             //         console.log(data)
    //             //     }
    //             // }
    //             return processResult(stream)
    //         }
    //     })
    // }
    // processData(reader)

    // reader?.read().then(({ value, done }) => {
    //     if (done) {
    //         console.log('Stream complete')
    //     } else {
    //         console.log(String.fromCharCode.apply(null, Array.from(value)))
    //         // return reader?.read().then(processResult)
    //     }
    // })
    // console.log('Recieved all data')
    // .then(response => response.body?.getReader())
    // .then(reader => ({
    //     const {value, done} = await reader.read()
    // })

    // return response
}