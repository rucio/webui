self.onmessage = async function (event) {
    const {url, fetchOptions, updateDelay = 50, maxUpdateLength = 100} = event.data;
    const buffer = [];

    const postData = () => {
        if (buffer.length > maxUpdateLength) {
            // Remove the first {maxUpdateLength} elements from the buffer
            const newBuffer = buffer.splice(0, maxUpdateLength);
            self.postMessage({type: 'data', data: newBuffer});
        } else {
            self.postMessage({type: 'data', data: buffer});
            buffer.length = 0;
        }
    };

    const updateWhileFetching = () => {
        if (buffer.length === 0) return;
        postData();
    };

    const updateAfterFetching = () => {
        if (buffer.length === 0) {
            self.postMessage({type: 'finish'});
        }
        postData();
        if (buffer.length === 0) {
            self.postMessage({type: 'finish'});
        }
    }

    const whileFetchingInterval = setInterval(updateWhileFetching, updateDelay);

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            self.postMessage({type: 'error', error: await getResponseError(response)});
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialData = '';

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, {stream: true});
            partialData += chunk;

            const lines = partialData.split('\n');
            partialData = lines.pop() || '';

            for (const line of lines) {
                try {
                    const parsedObject = JSON.parse(line);
                    buffer.push(parsedObject);
                } catch (e) {
                    self.postMessage({type: 'error', error: {type: 'parsing_error', message: e.message}});
                    clearInterval(whileFetchingInterval);
                    return;
                }
            }
        }

        if (partialData) {
            try {
                const parsedObject = JSON.parse(partialData);
                buffer.push(parsedObject);
            } catch (e) {
                self.postMessage({type: 'error', error: {type: 'parsing_error', message: e.message}});
                clearInterval(whileFetchingInterval);
                return;
            }
        }
        
        clearInterval(whileFetchingInterval);
        postData();
        if (buffer.length === 0) {
            self.postMessage({type: 'finish'});
        } else {
            setInterval(updateAfterFetching, updateDelay);
        }
    } catch (e) {
        self.postMessage({type: 'error', error: {type: 'network_error', message: e.message}});
    } finally {
        clearInterval(whileFetchingInterval);
    }
};

async function getResponseError(response) {
    let message = response.statusText;

    try {
        const jsonResponse = await response.json();
        message = jsonResponse.message ?? message;
    } catch (e) {
    }

    const error = {type: 'invalid_response', message: message};
    if (response.status === 404) {
        error.type = 'not_found';
    } else if (response.status === 400) {
        error.type = 'bad_request';
    }
    return error;
}
