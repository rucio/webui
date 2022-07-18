import { env } from '../util'

const defaultHostEndpoint: string | undefined = env('RUCIO_HOST')

export async function postData(
    endpoint = '/',
    queryParams = {},
    headers = {},
    data = {},
    host = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    )
    return response
}

export async function getData(
    endpoint = '/',
    queryParams = {},
    headers = {},
    host = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        },
    )
    return response
}

export async function putData(
    endpoint = '/',
    queryParams = {},
    headers = {},
    data = {},
    host = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'PUT',
            mode: 'no-cors',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    )
    return response
}

export async function deleteData(
    endpoint = '/',
    queryParams = {},
    headers = {},
    data = {},
    host = defaultHostEndpoint,
): Promise<any> {
    const response = await fetch(
        host + endpoint + '?' + new URLSearchParams(queryParams),
        {
            method: 'DELETE',
            mode: 'no-cors',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    )
    return response
}
