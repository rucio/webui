export class InvalidConfig extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'InvalidConfig';
    }
}
