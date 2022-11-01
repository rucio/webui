import { RSE } from '../../client/rses'

describe('RSE', () => {
    it('listRses', () => {
        expect(RSE.listRses).toBeDefined()
    })
    it('get_RSEMeta', () => {
        expect(RSE.getRSEMeta).toBeDefined()
    })
})
