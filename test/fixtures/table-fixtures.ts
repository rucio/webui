import { faker } from '@faker-js/faker'
import {
    LockState, DIDType, RuleNotification, RuleState,
    RSEBlockState, SubscriptionState,
    DIDAvailability,
    ReplicaState,
    RSEType,
    RSEProtocol,
    RSEAttribute,
} from '@/lib/core/entity/rucio'
import { RSEAccountUsageLimitViewModel, RSEAttributeViewModel, RSEProtocolViewModel, RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { SubscriptionRuleStatesViewModel, SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { BaseViewModel } from '@/lib/sdk/view-models';
import { DIDDatasetReplicasViewModel, DIDKeyValuePairsDataViewModel, DIDLongViewModel, DIDMetaViewModel, DIDRulesViewModel, DIDViewModel, FilereplicaStateDViewModel, FilereplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { RuleMetaViewModel, RulePageLockEntryViewModel, RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { DIDKeyValuePair } from '@/lib/core/entity/rucio';

export function mockUseComDOM<T extends BaseViewModel>(data: T[]): UseComDOM<T> {
    return {
        query: {
            data: data,
            fetchStatus: "idle",
        },
        start: () => { },
        resume: () => { },
        pause: () => { },
    } as UseComDOM<T>
}

export function mockBaseVM(fail?: "none" | "some" | "all"): BaseViewModel {
    const setting = fail ?? "none"
    return {
        status: setting === "none" ? "success" : (
            setting === "some" ? faker.helpers.arrayElement(["success", "error"]) : "error"
        ),
        message: faker.lorem.words(3),
    }
}

function createRandomScope(): string {
    return `user.${faker.person.firstName()}${faker.person.lastName()}`
}

function randomEnum<T>(e: any): T {
    return faker.helpers.arrayElement(Object.values(e)) as T
}

export function createRSEName(): string {
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

export function fixtureDIDViewModel(): DIDViewModel {
    return {
        ...mockBaseVM(),
        scope: createRandomScope(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        did_type: randomEnum<DIDType>(DIDType),
    }
}

export function fixtureDIDLongViewModel(): DIDLongViewModel {
    return {
        ...mockBaseVM(),
        scope: createRandomScope(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        did_type: randomEnum<DIDType>(DIDType),
        bytes: faker.number.int({ min: 0, max: 1e12 }),
        length: faker.number.int({ min: 0, max: 1e6 }),
    }
}

export function fixtureRulePageLockEntryViewModel(): RulePageLockEntryViewModel {
    return {
        ...mockBaseVM(),
        scope: createRandomScope(),
        name: faker.string.alphanumeric(10),
        rse: createRSEName(),
        state: faker.helpers.arrayElement(['R', 'O', 'S']) as LockState,
        ddm_link: faker.internet.url(),
        fts_link: faker.internet.url(),
    }
}

export function fixtureRuleMetaViewModel(): RuleMetaViewModel {
    return {
        ...mockBaseVM(),
        account: faker.internet.userName(),
        activity: faker.company.buzzPhrase(),
        copies: faker.number.int({ min: 1, max: 10 }),
        created_at: faker.date.past().toISOString(),
        did_type: faker.helpers.arrayElement<DIDType>([DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE]),
        expires_at: faker.date.future().toISOString(),
        grouping: faker.helpers.arrayElement<DIDType>([DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE]),
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
        rse_expression: createRSEName(),
        scope: createRandomScope(),
        split_container: faker.datatype.boolean(),
        state: randomEnum<RuleState>(RuleState),
        updated_at: faker.date.recent().toISOString(),
    }
}

export function fixtureRSEAccountUsageLimitViewModel(): RSEAccountUsageLimitViewModel {
    return {
        ...mockBaseVM(),
        rse_id: faker.string.uuid(),
        rse: createRSEName(),
        account: faker.internet.userName(),
        used_files: faker.number.int({ min: 0, max: 1e6 }),
        used_bytes: faker.number.int({ min: 0, max: 1e12 }),
        quota_bytes: faker.number.int({ min: 0, max: 1e12 }),
    }
}

export function fixtureRSEViewModel(): RSEViewModel {
    return {
        ...mockBaseVM(),
        id: faker.string.uuid(),
        name: createRSEName(),
        rse_type: randomEnum<RSEType>(RSEType),
        deterministic: faker.datatype.boolean(),
        volatile: faker.datatype.boolean(),
        staging_area: faker.datatype.boolean(),
    }
}

export function fixtureRSEProtocolViewModel(): RSEProtocolViewModel {
    return {
        ...mockBaseVM(),
        protocols: Array.from({ length: faker.number.int({ min: 1, max: 100 }) }, () => fixtureRSEProtocol()),
    }
}

export function fixtureRSEProtocol(): RSEProtocol {
    return {
        rseid: faker.string.uuid(),
        scheme: faker.helpers.arrayElement(["srm", "gsiftp", "root", "davs", "s3", "file"]),
        hostname: faker.internet.ip(),
        port: faker.number.int({ min: 0, max: 1e4 }),
        prefix: faker.lorem.words(3).replace(/\s/g, "."),
        impl: "rucio.rse.protocols.gfal.Default",
        priorities_lan: {
            read: faker.number.int({ min: 0, max: 10 }),
            write: faker.number.int({ min: 0, max: 10 }),
            delete: faker.number.int({ min: 0, max: 10 }),
        },
        priorities_wan: {
            read: faker.number.int({ min: 0, max: 10 }),
            write: faker.number.int({ min: 0, max: 10 }),
            delete: faker.number.int({ min: 0, max: 10 }),
            tpc: faker.number.int({ min: 0, max: 10 }),
            tpcwrite: faker.number.int({ min: 0, max: 10 }),
            tpcread: faker.number.int({ min: 0, max: 10 }),
        },
        updated_at: faker.date.recent().toISOString(),
        created_at: faker.date.past().toISOString(),
    }
}

export function fixtureRSEAttribute(): RSEAttribute {
    return {
        key: faker.lorem.words(2).replace(/\s/g, "-"),
        value: faker.helpers.arrayElement([
            faker.lorem.words(3),
            faker.date.past().toISOString(),
            faker.number.int({ min: 0, max: 1e6 }),
            faker.datatype.boolean(),
            null,
        ]),
    }
}


export function fixtureRSEAttributeViewModel(): RSEAttributeViewModel {
    return {
        ...mockBaseVM(),
        attributes: Array.from({ length: faker.number.int({ min: 1, max: 100 }) }, () => fixtureRSEAttribute()),
    }
}

export function fixtureRuleViewModel(): RuleViewModel {
    return {
        ...mockBaseVM(),
        id: faker.string.uuid(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        account: faker.internet.userName(),
        rse_expression: createRSEExpression(),
        created_at: faker.date.past().toISOString(),
        remaining_lifetime: faker.number.int({ min: 0, max: 1e6 }),
        state: randomEnum<RuleState>(RuleState),
        locks_ok_cnt: faker.number.int({ min: 0, max: 10 }),
        locks_replicating_cnt: faker.number.int({ min: 0, max: 10 }),
        locks_stuck_cnt: faker.number.int({ min: 0, max: 10 }),
    }
}

export function fixtureDIDMetaViewModel(): DIDMetaViewModel {
    // ignore Collections
    const did_type = faker.helpers.arrayElement<DIDType>([DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE])
    return {
        ...mockBaseVM(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        scope: createRandomScope(),
        account: faker.internet.userName(),
        did_type: did_type,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        availability: randomEnum<DIDAvailability>(DIDAvailability),
        obsolete: faker.datatype.boolean(),
        hidden: faker.datatype.boolean(),
        suppressed: faker.datatype.boolean(),
        purge_replicas: faker.datatype.boolean(),
        monotonic: faker.datatype.boolean(),
        // only for collections
        is_open: did_type !== DIDType.FILE ? faker.datatype.boolean() : null,
        // only for files
        adler32: did_type === DIDType.FILE ? faker.string.hexadecimal({ length: 8, prefix: "" }) : null,
        guid: did_type === DIDType.FILE ? faker.string.uuid() : null,
        md5: did_type === DIDType.FILE ? faker.string.hexadecimal({ length: 32, prefix: "" }) : null,
        filesize: did_type === DIDType.FILE ? faker.number.int({ min: 0, max: 1e12 }) : null,
    }
}

export function fixtureDIDKeyValuePair(): DIDKeyValuePair {
    return {
        key: faker.lorem.words(2).replace(/\s/g, "-"),
        value: faker.helpers.arrayElement([
            "das brot",
            faker.date.past().toISOString(),
            faker.datatype.boolean(),
            faker.number.int({ min: 0, max: 1e6 }),
            null,
        ])
    }
}

export function fixtureDIDKeyValuePairsDataViewModel(): DIDKeyValuePairsDataViewModel {
    return {
        ...mockBaseVM(),
        data: Array.from({ length: 100 }, () => {
            return fixtureDIDKeyValuePair()
        }),
    }
}

export function fixtureDIDDatasetReplicasViewModel(): DIDDatasetReplicasViewModel {
    return {
        ...mockBaseVM(),
        rse: createRSEName(),
        rseblocked: faker.number.int({ min: 0, max: 7 }) as RSEBlockState,
        availability: faker.datatype.boolean(),
        available_files: faker.number.int({ min: 0, max: 1e6 }),
        available_bytes: faker.number.int({ min: 0, max: 1e12 }),
        creation_date: faker.date.past().toISOString(),
        last_accessed: faker.date.recent().toISOString(),
    }
}

export function fixtureDIDRulesViewModel(): DIDRulesViewModel {
    return {
        ...mockBaseVM(),
        id: faker.string.uuid(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        state: randomEnum<RuleState>(RuleState),
        account: faker.internet.userName(),
        subscription: { name: faker.lorem.words(3).replace(/\s/g, "."), account: faker.internet.userName() },
        last_modified: faker.date.recent().toISOString(),
    }
}

export function fixtureFilereplicaStateViewModel(): FilereplicaStateViewModel {
    return {
        ...mockBaseVM(),
        rse: createRSEName(),
        state: randomEnum<ReplicaState>(ReplicaState),
    }
}

export function fixtureFilereplicaStateDViewModel(): FilereplicaStateDViewModel {
    return {
        ...mockBaseVM(),
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

export function fixtureSubscriptionRuleStatesViewModel(): SubscriptionRuleStatesViewModel {
    return {
        ...mockBaseVM(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        state_ok: faker.number.int({ min: 0, max: 10 }),
        state_replicating: faker.number.int({ min: 0, max: 10 }),
        state_stuck: faker.number.int({ min: 0, max: 10 }),
        state_suspended: faker.number.int({ min: 0, max: 10 }),
        state_inject: faker.number.int({ min: 0, max: 10 }),
        state_waiting_approval: faker.number.int({ min: 0, max: 10 }),
    }
}

export function fixtureSubscriptionViewModel(): SubscriptionViewModel {
    return {
        ...mockBaseVM(),
        account: faker.internet.userName(),
        created_at: faker.date.past().toISOString(),
        id: faker.string.uuid(),
        last_processed: faker.date.recent().toISOString(),
        lifetime: faker.date.future().toISOString(),
        name: faker.lorem.words(3).replace(/\s/g, "."),
        policyid: faker.number.int({ min: 0, max: 1e5 }),
        retroactive: faker.datatype.boolean(),
        state: randomEnum<SubscriptionState>(SubscriptionState),
        updated_at: faker.date.recent().toISOString(),
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
