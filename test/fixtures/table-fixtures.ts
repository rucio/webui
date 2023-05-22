import { faker } from '@faker-js/faker'
import { DIDContents } from '@/lib/infrastructure/data/view-model/page-did'
import { RulePageLockEntry } from '@/component-library/components/Pages/PageRule/PageRule'
import { LockState } from '@/lib/core/entity/rucio'

function createRandomScope(): string {
    return `user.${faker.person.firstName()}${faker.person.lastName()}`
}

function createRandomRSE(): string {
    return (
        "RSE-" +
        faker.location.country().toUpperCase().replace(/\s/g, "-").replace(/[^a-zA-Z\d\s]/g, "") +
        "-" +
        faker.number.int({ max: 100 })
    )
}

export function createRandomDIDContents(): DIDContents {
    const did_type = faker.helpers.arrayElement(['container', 'dataset', 'file'])
    return {
        scope: createRandomScope(),
        name: `${did_type}-${faker.string.alphanumeric(10)}`,
        did_type: did_type.replace(/^\w/, (c) => c.toUpperCase()),
    }
}

export function createRandomRulePageLockEntry(): RulePageLockEntry {
    return {
        scope: createRandomScope(),
        name: faker.string.alphanumeric(10),
        rse: createRandomRSE(),
        state: faker.helpers.arrayElement(['R', 'O', 'S']) as LockState,
        ddm_link: faker.internet.url(),
        fts_link: faker.internet.url(),
    }
}