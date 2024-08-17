import { renderHook, act } from '@testing-library/react-hooks';
import {BaseViewModel} from "@/lib/sdk/view-models";
import useChunkedStream from "@/lib/infrastructure/hooks/useChunkedStream";
import { ReadableStream } from 'web-streams-polyfill';

interface MockViewModel {
  id: number;
  name: string;
}

describe('useChunkedStream', () => {
  // Mock the onData callback
  const onData = jest.fn();

  beforeEach(() => {
    onData.mockClear();
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

    const { result, waitForNextUpdate } = renderHook(() => useChunkedStream<MockViewModel>(onData));

    act(() => {
      result.current.start('https://example.com/api');
    });

    await waitForNextUpdate(); // Wait for the hook to process the stream

    expect(onData).toHaveBeenCalledTimes(2);
    expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
    expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});

    expect(result.current.status).toBe('stopped');
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

    const { result, waitForNextUpdate } = renderHook(() => useChunkedStream<MockViewModel>(onData));

    act(() => {
      result.current.start('https://example.com/api');
    });

    await waitForNextUpdate(); // Wait for the hook to process the stream

    expect(onData).toHaveBeenCalledTimes(5);
    expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
    expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});
    expect(onData).toHaveBeenCalledWith({id: 3, name: 'test3'});
    expect(onData).toHaveBeenCalledWith({id: 4, name: 'test4'});
    expect(onData).toHaveBeenCalledWith({id: 5, name: 'test5'});

    expect(result.current.status).toBe('stopped');
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

    const { result, waitForNextUpdate } = renderHook(() => useChunkedStream<MockViewModel>(onData));

    act(() => {
      result.current.start('https://example.com/api');
    });

    await waitForNextUpdate(); // Wait for the hook to process the stream

    expect(onData).toHaveBeenCalledTimes(2);
    expect(onData).toHaveBeenCalledWith({id: 1, name: 'test1'});
    expect(onData).toHaveBeenCalledWith({id: 2, name: 'test2'});

    expect(result.current.status).toBe('stopped');
  });

  it('Should throw an error if a request is already running', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChunkedStream<MockViewModel>(onData));

    act(() => {
      result.current.start('https://example.com/api');
    });

    expect(() => {
      act(() => {
        result.current.start('https://example.com/api');
      });
    }).toThrow();
  });

  it('Should restart after the first request is finished', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChunkedStream<MockViewModel>(onData));

    act(() => {
      result.current.start('https://example.com/api');
    });

    await waitForNextUpdate();

    expect(() => {
      act(() => {
        result.current.start('https://example.com/api');
      });
    }).not.toThrow();
  });
});
