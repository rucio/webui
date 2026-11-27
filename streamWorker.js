self.onmessage = async function (event) {
    const {url, fetchOptions, updateDelay = 50, maxUpdateLength = 100} = event.data;
    const buffer = [];
    let foundEntries = false;

    const postData = () => {
        foundEntries = true;
        // Remove the first {maxUpdateLength} or all elements from the buffer
        const dataToSend = buffer.length > maxUpdateLength ? buffer.splice(0, maxUpdateLength) : buffer.splice(0);
        self.postMessage({type: 'data', data: dataToSend});
    };

    const handleUpdate = () => {
        if (buffer.length > 0) postData();
    };

    const updateInterval = setInterval(handleUpdate, updateDelay);

    const finalize = () => {
        handleUpdate();
        if (buffer.length === 0) {
            if (foundEntries) {
                self.postMessage({type: 'finish'});
            } else {
                handleError('not_found', 'No entries found.');
            }
        }
    };

    const handleError = (errorType, message) => {
        self.postMessage({type: 'error', error: {type: errorType, message}});
        clearInterval(updateInterval);
    };

    const tryParse = (line) => {
        try {
            const parsedObject = JSON.parse(line);
            buffer.push(parsedObject);
        } catch (e) {
            handleError(
                'parsing_error',
                'The response could not be parsed. Please see the console for details.'
            );
            console.error(`Parsing error\nElement: ${line}\nMessage: ${e.message}`);
            return false;
        }
        return true;
    };

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            self.postMessage({type: 'error', error: await getResponseError(response)});
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialData = '';

        let parsingFailed = false;

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, {stream: true});
            partialData += chunk;

            const lines = partialData.split('\n');
            partialData = lines.pop() || '';

            for (const line of lines) {
                if (!tryParse(line)) {
                    parsingFailed = true;
                    break;
                }
            }

            if (parsingFailed) break;
        }

        if (!parsingFailed && partialData) {
            tryParse(partialData);
        }

        clearInterval(updateInterval);
        finalize();
        if (buffer.length > 0) {
            setInterval(finalize, updateDelay);
        }
    } catch (e) {
        self.postMessage({type: 'error', error: {type: 'unknown_error', message: e.message}});
    } finally {
        clearInterval(updateInterval);
    }
};

async function getResponseError(response) {
    const error = {type: 'invalid_response', message: response.statusText};

    try {
        const jsonResponse = await response.json();
        if (jsonResponse.message) {
            error.message = jsonResponse.message;
            // NOT_FOUND should be from the rucio server, not a nonexistent endpoint
            if (response.status === 404) {
                error.type = 'not_found';
            }
        } else if (jsonResponse.error) {
            error.message = jsonResponse.error;
        }
    } catch (e) {
    }

    if (response.status === 400) {
        error.type = 'bad_request';
    }
    return error;
}
