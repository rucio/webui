export class AccountModel implements AccountType {
    account!: string
    scope!: string
    identities!: string[]
    rules!: string[]
    email!: string
    type!: 'USER' | 'GROUP' | 'SERVICE'
    constructor(
        account: string,
        scope: string,
        identities: string[],
        rules: string[],
        email: string,
        type: 'USER' | 'GROUP' | 'SERVICE',
    ) {
        this.account = account
        this.scope = scope
        this.identities = identities
        this.rules = rules
        this.email = email
        this.type = type
    }
}

export class RuleModel implements RuleType {
    rule_id!: string
    locks!: any[]
    history!: any[]
    scope_name!: string
    analysis!: object
    constructor(
        rule_id: string,
        locks: any[],
        history: any[],
        scope_name: string,
        analysis: object,
    ) {
        this.rule_id = rule_id
        this.locks = locks
        this.history = history
        this.scope_name = scope_name
        this.analysis = analysis
    }
}

export class DIDModel {
    id: string
    constructor(id: string) {
        this.id = id
    }
}

export class RSEModel {
    rse: string
    remaining_quota: string
    total_quota: string
    constructor (
        rse:string, 
        remaining_quota: string, 
        total_quota: string
    ){
        this.rse=rse
        this.remaining_quota=remaining_quota
        this.total_quota=total_quota
    }
}
