export async function postData(
    url = '',
    headers = {},
    data = {},
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

export async function getData(url = '', headers = {}): Promise<any> {
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

export async function putData(url = '', headers = {}, data = {}): Promise<any> {
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
    url = '',
    headers = {},
    data = {},
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
