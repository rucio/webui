import { DID } from '../../client/dids'

describe('DID', () => {
    it('search', () => {
        expect(DID.search).toBeDefined()
    })
    it('get_did', () => {
        expect(DID.get_did).toBeDefined()
    })
    it('meta', () => {
        expect(DID.meta).toBeDefined()
    })
})
