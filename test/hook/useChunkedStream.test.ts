import {renderHook, act, cleanup} from '@testing-library/react-hooks';
import useChunkedStream, {
    StreamingErrorType,
    StreamingSettings,
    StreamingStatus
} from "@/lib/infrastructure/hooks/useChunkedStream";
import {ReadableStream} from 'web-streams-polyfill';

interface MockViewModel {
    id: number;
    name: string;
}

describe('useChunkedStream', () => {
    // Mock the onData callback
    const onData = jest.fn();
    const settings: StreamingSettings<MockViewModel> = {
        url: 'https://example.com/api',
        onData
    }

    beforeEach(() => {
        onData.mockClear();
        jest.resetAllMocks(); // Resets the state of all mocks between tests
    });

    afterEach(() => {
        cleanup();
    });

    it('Should handle a stream of full NDJSON chunks', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Simulate streaming data
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id":1,"name":"test1"}\n'));
                            controller.enqueue(new TextEncoder().encode('{"id":2,"name":"test2"}\n'));
                            controller.close();
                        }, 0);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(2);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
        expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
    });

    it('Should handle a stream of full NDJSON chunks with multiple objects', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Simulate streaming data
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id":1,"name":"test1"}\n{"id":2,"name":"test2"}\n'));
                            controller.enqueue(new TextEncoder().encode('{"id":3,"name":"test3"}\n'));
                            controller.enqueue(new TextEncoder().encode('{"id":4,"name":"test4"}\n{"id":5,"name":"test5"}\n'));
                            controller.close();
                        }, 0);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(5);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
        expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});
        expect(onData).toHaveBeenCalledWith({id: 3, name: 'test3'});
        expect(onData).toHaveBeenCalledWith({id: 4, name: 'test4'});
        expect(onData).toHaveBeenCalledWith({id: 5, name: 'test5'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
    });

    it('Should handle a stream of partial NDJSON chunks', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Simulate streaming data
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id":1,"name":"te'));
                            controller.enqueue(new TextEncoder().encode('st1"}\n{"id":'));
                            controller.enqueue(new TextEncoder().encode('2,"name":"test2"}\n'));
                            controller.close();
                        }, 0);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(2);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
        expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
    });

    it('Should set an error if a request is already running', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        expect(() => {
            act(() => {
                result.current.start(settings);
            });
        }).not.toThrow();

        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.BAD_METHOD_CALL);

        await waitForNextUpdate();
    });

    it('Should restart after the first request is finished', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(() => {
            act(() => {
                result.current.start(settings);
            });
        }).not.toThrow();

        await waitForNextUpdate();
    });

    it('Should update the error and stop the streaming if the endpoint cannot be fetched', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).not.toHaveBeenCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.NETWORK_ERROR);
    });

    it('Should update the error and stop the streaming if the response has a 404 status code', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                body: null,
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).not.toHaveBeenCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.NOT_FOUND);
    });

    it('Should update the error and stop the streaming if the response has a 400 status code', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                body: null,
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).not.toHaveBeenCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.BAD_REQUEST);
    });

    it('Should update the error and stop the streaming if the response has other faulty status code', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                statusText: 'Internal Error',
                body: null,
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).not.toHaveBeenCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.INVALID_RESPONSE);
    });

    it('Should update the error and stop the streaming if the response cannot be parsed', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Simulate streaming data
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 1, "name": "test1"}\n'));
                            controller.enqueue(new TextEncoder().encode('faultychunk\n'));
                            controller.enqueue(new TextEncoder().encode('{"id": 2, "name": "test2"}\n'));
                            controller.close();
                        }, 0);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(1);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.PARSING_ERROR);
    });

    it('Should let the fetching restart after the error', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Simulate streaming data
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id":1,"name":"test1"}\n'));
                            controller.enqueue(new TextEncoder().encode('{"id":2,"name":"test2"}\n'));
                            controller.close();
                        }, 0);
                    },
                }),
            })
        ) as jest.Mock;

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(2);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
        expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).toEqual(undefined);
    });

    it('Should stop the at the fetching', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Stream data with a delay
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 1, "name": "test1"}\n'));
                            controller.enqueue(new TextEncoder().encode('{"id": 2, "name": "test2"}\n'));
                            controller.close();
                        }, 100);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current.status).toEqual(StreamingStatus.RUNNING);

        act(() => {
            result.current.stop();
        });

        await waitForNextUpdate();

        expect(onData).not.toBeCalled();
    });

    it('Should submit some data before stopping', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 1, "name": "test1"}\n'));
                        }, 0);
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 2, "name": "test2"}\n'));
                            controller.close();
                        }, 100);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current.status).toEqual(StreamingStatus.RUNNING);

        act(() => {
            result.current.stop();
        });

        await waitForNextUpdate();

        expect(onData).toBeCalledTimes(1);
        expect(onData).toBeCalledWith({id: 1, name: 'test1'});
    });

    it('Should fail at the non streamed response', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: 'Hello!'
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await waitForNextUpdate();

        expect(onData).not.toBeCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
    });

    it('Should correctly handle pause and resume', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 1, "name": "test1"}\n'));
                        }, 0);
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 2, "name": "test2"}\n'));
                            controller.close();
                        }, 100);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current.status).toEqual(StreamingStatus.RUNNING);

        act(() => {
            result.current.pause();
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(result.current.status).toEqual(StreamingStatus.PAUSED);
        // The next batch shouldn't be read
        expect(onData).toBeCalledTimes(1);
        expect(onData).toBeCalledWith({id: 1, name: 'test1'});

        // Cannot start a new request while paused
        expect(() => {
            act(() => {
                result.current.start(settings);
            });
        }).not.toThrow();

        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.BAD_METHOD_CALL);

        act(() => {
            result.current.resume();
        });

        await waitForNextUpdate();

        expect(onData).toBeCalledTimes(2);
        expect(onData).toBeCalledWith({id: 2, name: 'test2'});
        expect(result.current.status).toEqual(StreamingStatus.STOPPED);
    });

    it('Should be able to stop during the pause', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream({
                    start(controller) {
                        // Stream data with a delay
                        setTimeout(() => {
                            controller.enqueue(new TextEncoder().encode('{"id": 1, "name": "test1"}\n'));
                            controller.enqueue(new TextEncoder().encode('{"id": 2, "name": "test2"}\n'));
                            controller.close();
                        }, 100);
                    },
                }),
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        act(() => {
            result.current.start(settings);
        });

        await new Promise(resolve => setTimeout(resolve, 25));
        expect(result.current.status).toEqual(StreamingStatus.RUNNING);

        act(() => {
            result.current.pause();
        });

        await new Promise(resolve => setTimeout(resolve, 200));
        expect(result.current.status).toEqual(StreamingStatus.PAUSED);
        expect(onData).not.toBeCalled();

        act(() => {
            result.current.stop();
        });

        await waitForNextUpdate();

        expect(result.current.status).toEqual(StreamingStatus.STOPPED);
    });

    it('Should set an error on trying to stop without active fetching', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        expect(() => {
            act(() => {
                result.current.stop();
            });
        }).not.toThrow();

        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.BAD_METHOD_CALL);
    });

    it('Should set an error on trying to pause without active fetching', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        expect(() => {
            act(() => {
                result.current.pause();
            });
        }).not.toThrow();

        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.BAD_METHOD_CALL);
    });

    it('Should set an error on trying to resume without calling pause', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>());

        expect(() => {
            act(() => {
                result.current.pause();
            });
        }).not.toThrow();

        expect(result.current.error).not.toEqual(undefined);
        expect(result.current.error?.type).toEqual(StreamingErrorType.BAD_METHOD_CALL);
    });
});