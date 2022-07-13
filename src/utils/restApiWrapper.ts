export async function postData(
    url: string = '',
    headers: {} = {},
    data: {} = {},
): Promise<any> {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response
}

export async function getData(
    url: string = '',
    headers: {} = {},
): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
    })
    return response
}

export async function putData(
    url: string = '',
    headers: {} = {},
    data: {} = {},
): Promise<any> {
    const response = await fetch(url, {
        method: 'PUT',
        mode: 'no-cors',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response
}

export async function deleteData(
    url: string = '',
    headers: {} = {},
    data: {} = {},
): Promise<any> {
    const response = await fetch(url, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response
}
