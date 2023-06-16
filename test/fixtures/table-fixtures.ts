import { faker } from '@faker-js/faker'
import { RulePageLockEntry } from '@/component-library/components/Pages/PageRule/PageRule'
import {
    LockState, DID, DIDLong, DIDMeta, DIDType, RuleMeta, RuleNotification, RuleState,
    RSEBlockState, SubscriptionMeta, SubscriptionRuleStates, SubscriptionState,
    DIDAvailability, RSEAccountUsageLimit,
    ReplicaState
} from '@/lib/core/entity/rucio'
import {
    DIDDatasetReplicas, DIDRules, FilereplicaState, FilereplicaStateD
} from '@/lib/infrastructure/data/view-model/page-did';

var dedent = require('dedent-js');

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

function createRSEExpression(): string {
    const creators = faker.helpers.arrayElements([
        () => { return "type" },
        () => { return "tier" },
        () => { return "country" },
        () => { return "region" },
    ] as Array<() => string>, { min: 1, max: 4 })
    const strings = creators.map((creator) => creator())
    return strings.join("&")
}

export function createDID(): DID {
    return {
        scope: createRandomScope(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        did_type: randomEnum<DIDType>(DIDType),
    }
}

export function createRandomDIDLong(): DIDLong {
    return {
        scope: createRandomScope(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        did_type: randomEnum<DIDType>(DIDType),
        bytes: faker.number.int({ min: 0, max: 1e12 }),
        length: faker.number.int({ min: 0, max: 1e6 }),
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
        did_type: faker.helpers.arrayElement<DIDType>([DIDType.Container, DIDType.Dataset, DIDType.File]),
        expires_at: faker.date.future(),
        grouping: faker.helpers.arrayElement<DIDType>([DIDType.Container, DIDType.Dataset, DIDType.File]),
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

export function createRSEAccountUsageLimit(): RSEAccountUsageLimit {
    return {
        rse_id: faker.string.uuid(),
        rse: createRandomRSE(),
        account: faker.internet.userName(),
        used_files: faker.number.int({ min: 0, max: 1e6 }),
        used_bytes: faker.number.int({ min: 0, max: 1e12 }),
        quota_bytes: faker.number.int({ min: 0, max: 1e12 }),
    }
}

export function createDIDMeta(): DIDMeta {
    // ignore Collections
    const did_type = faker.helpers.arrayElement<DIDType>([DIDType.Container, DIDType.Dataset, DIDType.File])
    return {
        name: faker.lorem.words(3).replace(/\s/g, "."),
        scope: createRandomScope(),
        account: faker.internet.userName(),
        did_type: did_type,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
        availability: randomEnum<DIDAvailability>(DIDAvailability),
        obsolete: faker.datatype.boolean(),
        hidden: faker.datatype.boolean(),
        suppressed: faker.datatype.boolean(),
        purge_replicas: faker.datatype.boolean(),
        monotonic: faker.datatype.boolean(),
        // only for collections
        is_open: did_type !== DIDType.File ? faker.datatype.boolean() : null,
        // only for files
        adler32: did_type === DIDType.File ? faker.string.hexadecimal({ length: 8, prefix: "" }) : null,
        guid: did_type === DIDType.File ? faker.string.uuid() : null,
        md5: did_type === DIDType.File ? faker.string.hexadecimal({ length: 32, prefix: "" }) : null,
        filesize: did_type === DIDType.File ? faker.datatype.number({ min: 0, max: 1e12 }) : null,
    }
}

export function createDIDDatasetReplicas(): DIDDatasetReplicas {
    return {
        rse: createRandomRSE(),
        rseblocked: faker.number.int({ min: 0, max: 7 }) as RSEBlockState,
        availability: faker.datatype.boolean(),
        available_files: faker.number.int({ min: 0, max: 1e6 }),
        available_bytes: faker.number.int({ min: 0, max: 1e12 }),
        creation_date: faker.date.past(),
        last_accessed: faker.date.recent(),
    }
}

export function createDIDRules(): DIDRules {
    return {
        id: faker.string.uuid(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        state: randomEnum<RuleState>(RuleState),
        account: faker.internet.userName(),
        subscription: { name: faker.lorem.words(3).replace(/\s/g, "."), account: faker.internet.userName() },
        last_modified: faker.date.recent(),
    }
}

export function createFileReplicaState(): FilereplicaState {
    return {
        rse: createRandomRSE(),
        state: randomEnum<ReplicaState>(ReplicaState),
    }
}

export function createFileReplicaStateD(): FilereplicaStateD {
    return {
        scope: createRandomScope(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        available: faker.number.int({ min: 0, max: 10 }),
        unavailable: faker.number.int({ min: 0, max: 10 }),
        copying: faker.number.int({ min: 0, max: 10 }),
        being_deleted: faker.number.int({ min: 0, max: 10 }),
        bad: faker.number.int({ min: 0, max: 10 }),
        temporary_unavailable: faker.number.int({ min: 0, max: 10 }),
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

export function createSubscriptionMeta(): SubscriptionMeta {
    return {
        account: faker.internet.userName(),
        comments: faker.lorem.words(10),
        created_at: faker.date.past(),
        id: faker.string.uuid(),
        last_processed: faker.date.recent(),
        lifetime: faker.date.future(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        policyid: faker.number.int({ min: 0, max: 1e5 }),
        retroactive: faker.datatype.boolean(),
        state: randomEnum<SubscriptionState>(SubscriptionState),
        updated_at: faker.date.recent(),
        // more difficult datatypes:
        filter: JSON.stringify({
            "scope": [
                createRandomScope()
            ],
            "project": [
                faker.commerce.productName()
            ],
            "split_rule": faker.datatype.boolean()
        }, undefined, 2),
        replication_rules: JSON.stringify(
            Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => {
                return {
                    "activity": faker.company.buzzPhrase(),
                    "rse_expression": createRSEExpression(),
                    "source_replica_expression": createRSEExpression(),
                    "copies": "*",
                    "lifetime": 172800,
                    "comment": faker.lorem.words(10),
                }
            }),
            undefined,
            2
        ),
    }
}