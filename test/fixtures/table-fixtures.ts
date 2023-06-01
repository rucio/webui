import { faker } from '@faker-js/faker'
import { DIDContents } from '@/lib/infrastructure/data/view-model/page-did'
import { RulePageLockEntry } from '@/component-library/components/Pages/PageRule/PageRule'
import { LockState, RuleMeta, RuleNotification, RuleState, SubscriptionRuleStates } from '@/lib/core/entity/rucio'
import { DIDType } from '@/lib/core/data/rucio-dto'

function createRandomScope(): string {
    return `user.${faker.person.firstName()}${faker.person.lastName()}`
}

function randomEnum<T>(e: any): T {
    return faker.helpers.arrayElement(Object.values(e)) as T
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

export function createRuleMeta(): RuleMeta {
    return {
        account: faker.internet.userName(),
        activity: faker.company.buzzPhrase(),
        copies: faker.number.int({ min: 1, max: 10 }),
        created_at: faker.date.past(),
        did_type: faker.helpers.arrayElement<DIDType>(['Dataset', 'Container', 'File']),
        expires_at: faker.date.future(),
        grouping: faker.helpers.arrayElement<DIDType>(['Dataset', 'Container', 'File']),
        id: faker.string.uuid(),
        ignore_account_limit: faker.datatype.boolean(),
        ignore_availability: faker.datatype.boolean(),
        locked: faker.datatype.boolean(),
        locks_ok_cnt: faker.number.int({ min: 0, max: 10 }),
        locks_replicating_cnt: faker.number.int({ min: 0, max: 10 }),
        locks_stuck_cnt: faker.number.int({ min: 0, max: 10 }),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        notification: randomEnum<RuleNotification>(RuleNotification),
        priority: faker.number.int({ min: 0, max: 3 }),
        purge_replicas: faker.datatype.boolean(),
        rse_expression: createRandomRSE(),
        scope: createRandomScope(),
        split_container: faker.datatype.boolean(),
        state: randomEnum<RuleState>(RuleState),
        updated_at: faker.date.recent(),
    }
}

export function createSubscriptionRuleStates(): SubscriptionRuleStates {
    return {
        name: faker.lorem.words(3).replace(/\s/g, "."),
        state_ok: faker.number.int({ min: 0, max: 10 }),
        state_replicating: faker.number.int({ min: 0, max: 10 }),
        state_stuck: faker.number.int({ min: 0, max: 10 }),
        state_suspended: faker.number.int({ min: 0, max: 10 }),
    }
}