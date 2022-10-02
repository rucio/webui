import { env } from '../util'

const defaultHostEndpoint: string | undefined = env('RUCIO_HOST')
const rucioToken: string = sessionStorage.getItem('X-Rucio-Auth-Token') ?? ''
const authorizationHeader = {
    'X-Rucio-Auth-Token': rucioToken,
}
export const commonHeaders = {
    'X-Rucio-VO': 'def',
    'X-Rucio-AppID': 'test',
    'X-Rucio-Script': 'webui::login',
}

export async function postData(
    endpoint: string | undefined = '/',
    headers: object | undefined = authorizationHeader,
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(host + endpoint, {
        method: 'POST',
        headers: {
            ...authorizationHeader,
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).catch((err: Error) => {
        console.error(err)
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
    headers: object | undefined = authorizationHeader,
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'GET',
            headers: {
                ...authorizationHeader,
                ...headers,
                'Content-Type': 'application/json',
            },
        },
    ).catch((err: Error) => {
        console.error(err)
    })
    return response
}

export async function putData(
    endpoint: string | undefined = '/',
    headers: object | undefined = authorizationHeader,
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(host + endpoint, {
        method: 'PUT',
        headers: {
            ...authorizationHeader,
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).catch((err: Error) => {
        console.error(err)
    })
    return response
}

export async function deleteData(
    endpoint: string | undefined = '/',
    headers: object | undefined = authorizationHeader,
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(host + endpoint, {
        method: 'DELETE',
        headers: {
            ...authorizationHeader,
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).catch((err: Error) => {
        console.error(err)
    })
    return response
}

export async function streamData(
    endpoint: string | undefined = '/',
    queryParams:
        | string
        | string[][]
        | Record<string, string>
        | URLSearchParams
        | undefined = {},
    headers: object | undefined = authorizationHeader,
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    return new Promise((resolve, reject) => {
        fetch(host + endpoint + '?' + new URLSearchParams(queryParams), {
            method: 'GET',
            headers: {
                ...authorizationHeader,
                ...headers,
                'Content-Type': 'application/x-json-stream',
            },
        })
            .then(response => {
                const reader = response.body?.getReader()
                return new ReadableStream({
                    start(controller) {
                        return pump()
                        function pump(): unknown {
                            return reader?.read().then(({ done, value }) => {
                                // When no more data needs to be consumed, close the stream
                                if (done) {
                                    controller.close()
                                    return
                                }
                                // Enqueue the next data chunk into our target stream
                                controller.enqueue(value)
                                return pump()
                            })
                        }
                    },
                })
            })
            .then(stream => new Response(stream))
            .then(response => {
                return response.text()
            })
            .then(data => {
                const split_data = data.split('\n')
                const ret_data: unknown[] = []
                for (let i = 0; i < split_data.length; i++) {
                    if (split_data[i].length <= 0) {
                        break
                    }
                    ret_data.push(
                        JSON.parse(split_data[i].replace(/Infinity/g, '-1')),
                    )
                }
                resolve(ret_data)
            })
    })
}
