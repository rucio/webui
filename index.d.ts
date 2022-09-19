type Account = {
    account: string
    scope: string
    identities: string[]
    rules: string[]
    email: string
    type: 'USER' | 'GROUP' | 'SERVICE'
}

type Rule = {
    rule_id: string
    locks: any[]
    history: any[]
    scope_name: string
    analysis: object
}
