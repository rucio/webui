import { faker } from "@faker-js/faker";
import { createRandomRSE } from "./table-fixtures";

export function fixtureOngoingrules() {
    return {
        rulename: createRandomRSE(),
        replicating: faker.number.int({ min: 0, max: 100 }),
        ok: faker.number.int({ min: 0, max: 100 }),
        stuck: faker.number.int({ min: 0, max: 100 }),
    }
}