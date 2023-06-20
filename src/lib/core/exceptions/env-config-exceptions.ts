export class InvalidConfig extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'InvalidConfig';
  }
}

export class ConfigNotFound extends Error {
    constructor(config_var: any) {
        super(`Config variable ${config_var} not found in environment`);
        this.name = 'ConfigNotFound';
    }
}