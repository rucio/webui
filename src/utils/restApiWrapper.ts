import { env } from '../util'

const defaultHostEndpoint: string | undefined = env('RUCIO_HOST')

export async function postData(
    endpoint: string | undefined = '/',
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(host + endpoint, {
        method: 'POST',
        headers: {
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
    headers: HeadersInit | undefined = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'GET',
            headers: {
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
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(host + endpoint, {
        method: 'PUT',
        headers: {
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
    headers: HeadersInit | undefined = {},
    data: unknown = {},
    host: string | undefined = defaultHostEndpoint,
): Promise<unknown> {
    const response = await fetch(host + endpoint, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).catch((err: Error) => {
        console.error(err)
    })
    return response
}
