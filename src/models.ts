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