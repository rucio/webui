import {renderHook, act, cleanup} from '@testing-library/react-hooks';
import useChunkedStream, {StreamingStatus} from "@/lib/infrastructure/hooks/useChunkedStream";
import {ReadableStream} from 'web-streams-polyfill';

interface MockViewModel {
    id: number;
    name: string;
}

describe('useChunkedStream', () => {
    // Mock the onData callback
    const onData = jest.fn();

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

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
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

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
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

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(2);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
        expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
    });

    it('Should throw an error if a request is already running', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
        });

        expect(() => {
            act(() => {
                result.current.start('https://example.com/api');
            });
        }).toThrow();

        await waitForNextUpdate();
    });

    it('Should restart after the first request is finished', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
        });

        await waitForNextUpdate();

        expect(() => {
            act(() => {
                result.current.start('https://example.com/api');
            });
        }).not.toThrow();

        await waitForNextUpdate();
    });

    it('Should update the error and stop the streaming if the endpoint cannot be fetched', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
        });

        await waitForNextUpdate();

        expect(onData).not.toHaveBeenCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
    });

    it('Should update the error and stop the streaming if the response has a faulty status code', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                body: null,
            })
        ) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
        });

        await waitForNextUpdate();

        expect(onData).not.toHaveBeenCalled();

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
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

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
        });

        await waitForNextUpdate();

        expect(onData).toHaveBeenCalledTimes(1);
        expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});

        expect(result.current.status).toBe(StreamingStatus.STOPPED);
        expect(result.current.error).not.toEqual(undefined);
    });

    it('Should let the fetching restart after the error', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
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
            result.current.start('https://example.com/api');
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

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
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

        const {result, waitForNextUpdate} = renderHook(() => useChunkedStream<MockViewModel>(onData));

        act(() => {
            result.current.start('https://example.com/api');
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
});
