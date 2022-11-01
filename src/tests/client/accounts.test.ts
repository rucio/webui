import { Account } from '../../client/accounts'

describe('Accounts', () => {
    it('create', () => {
        expect(Account.create).toBeDefined()
    })
    it('delete', () => {
        expect(Account.delete).toBeDefined()
    })
    it('getUsageHistory', () => {
        expect(Account.getUsageHistory).toBeDefined()
    })
})
