import { Rules } from '../../client/rules'

describe('Rules', () => {
    it('get', () => {
        expect(Rules.get).toBeDefined()
    })
    it('meta', () => {
        expect(Rules.meta).toBeDefined()
    })
    it('new', () => {
        expect(Rules.new).toBeDefined()
    })
})
