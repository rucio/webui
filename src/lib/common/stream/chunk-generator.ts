import { sleep } from '@/pages/api/stream'

export default async function* generateChunks() {
    let i = 0
    while (true) {
        yield `data: Hello seq ${i}`
        i++
        await sleep(1000)
    }
}
