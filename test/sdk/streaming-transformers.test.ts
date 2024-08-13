import appContainer from "@/lib/infrastructure/ioc/container-config"
import {NewlineDelimittedDataParser} from "@/lib/sdk/stream-transformers"
import {Transform} from "stream"


class TestPipelineSink extends Transform {

    _transform(chunk: any, encoding: string, callback: Function) {
        const data = chunk.toString()
        this.push(data)
        callback()
    }

}

class TestPipelineSource extends Transform {

    _transform(chunk: any, encoding: string, callback: Function) {
        const data = chunk.toString()
        this.push(data)
        callback()
    }

}

// Is double parsing a desired behaviour?
const parseChunk = (chunk: string) => JSON.parse(JSON.parse(chunk))

describe("NewlineDelimittedDataParser - a transform stream that parses newline-delimited JSON data", () => {
    let source: Transform;
    let sink: Transform;
    let outputChunks: string[];

    beforeEach(() => {
        source = new TestPipelineSource()
        sink = new TestPipelineSink()
        outputChunks = []

        sink.on('data', (chunk) => {
            outputChunks.push(chunk.toString())
        })

        source.pipe(new NewlineDelimittedDataParser()).pipe(sink)
    })

    it("Handles a single full NDJSON object in one chunk", () => {
        source.write('{"hello": "world"}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'}
        ])
    })

    it("Handles two full NDJSON objects in one chunk", () => {
        source.write('{"hello": "world"}\n{"test": "json"}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'test': 'json'},
        ])
    })

    it("Handles multiple full NDJSON objects in one chunk", () => {
        source.write('{"hello": "world"}\n{"test": "json"}\n{"variable": 0, "test": "json"}\n{"variable": 0}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'test': 'json'},
            {'test': 'json', 'variable': 0},
            {'variable': 0}
        ])
    })

    it("Handles multiple full NDJSON objects in two chunks", () => {
        source.write('{"hello": "world"}\n{"test": "json"}\n')
        source.write('{"variable": 0, "test": "json"}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'test': 'json'},
            {'test': 'json', 'variable': 0},
        ])
    })

    it("Handles multiple full NDJSON objects in three chunks", () => {
        source.write('{"hello": "world"}\n{"test": "json"}\n')
        source.write('{"variable": 0, "test": "json"}\n')
        source.write('{"variable": 0}\n{"hello": "world", "variable": 0}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'test': 'json'},
            {'test': 'json', 'variable': 0},
            {'variable': 0},
            {'hello': 'world', 'variable': 0},
        ])
    })

    it("Doesn't pass a partial NDJSON", () => {
        source.write('{"hello": "world"')

        expect(outputChunks.length).toEqual(0)
    })

    it("Handles a single NDJSON passed in two chunks", () => {
        source.write('{"hello": "world"')
        source.write('}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'}
        ])
    })

    it("Handles multiple NDJSON passed partially", () => {
        source.write('{"hello": "wor')
        source.write('ld"}\n{"test": "json"}\n{"variable"')
        source.write(': 0}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'test': 'json'},
            {'variable': 0},
        ])
    })

    it("Handles long chunks of full NDJSON objects", () => {
        source.write('{"hello": "world"}\n{"test": "json"}\n{"hour": 1}\n')
        source.write('{"variable": 0, "test": "json"}\n{"method": "GET"}\n')
        source.write('{"variable": 0}\n{"hello": "world", "variable": 0}\n{"error": "unknown"}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'test': 'json'},
            {'hour': 1},
            {'test': 'json', 'variable': 0},
            {'method': 'GET'},
            {'variable': 0},
            {'hello': 'world', 'variable': 0},
            {'error': 'unknown'}
        ])
    })

    it("Doesn't pass a chunk that doesn't end in a newline", () => {
        source.write('{"hello": "world"}')

        expect(outputChunks.length).toEqual(0)
    })

    it("Doesn't pass a chunk that isn't a valid NDJSON string", () => {
        source.write('abc\n')

        expect(outputChunks.length).toEqual(0)
    })

    it("Passes only valid NDJSON strings", () => {
        source.write('{"hello": "wor')
        source.write('ld"}\n{{"test": "json"}\n{"variable": 0}\n')

        const parsedChunks = outputChunks.map(parseChunk)
        expect(parsedChunks).toEqual([
            {'hello': 'world'},
            {'variable': 0},
        ])
    })
})