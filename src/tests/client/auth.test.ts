import { Auth } from '../../client/auth'

describe('Auth', () => {
    it('userpassAuthCall', () => {
        expect(Auth.userpassAuthCall).toBeDefined()
    })
})
