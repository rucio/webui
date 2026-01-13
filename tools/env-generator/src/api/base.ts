import { existsSync } from "fs";
import { Liquid } from "liquidjs";
import { readFileSync, writeFileSync } from "fs";
import crypto from "crypto";


export type TTemplateGeneratorOutput = {
  status: boolean,
  message: string
  content: string
  file: string

}

export type EnvValidationError = {
  message: string
  type: 'error' | 'warning'
}

export class WebUIEnvTemplateCompiler {
  protected engine: Liquid

  constructor(
    protected environmentVariables: Record<string, string>,
    protected outputFilePath: string,
    protected templateName: string,
    protected write: boolean = false
  ) {
    const templateDir = `${__dirname}/../templates`
    const templatePath = `${templateDir}/${templateName}.liquid`
    this.environmentVariables = environmentVariables

    if (!existsSync(templatePath)) throw new Error(`templatePath ${templatePath} does not exist`)
    this.engine = new Liquid({
      root: templateDir,
      extname: '.liquid'
    })

  }

  generateRandomString = (): string => {
    const length = 32
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const randomBytes = crypto.randomBytes(length)
    const result = new Array(length)
    let cursor = 0

    for (let i = 0; i < length; i++) {
      cursor += randomBytes[i]
      result[i] = chars[cursor % chars.length]
    }

    return result.join('')
  }

  mergeWithDefaults(): void {
    const authSecret = this.generateRandomString()
    this.environmentVariables = {
      'MULTI_VO_ENABLED': 'false',
      'VO_LIST': 'def',
      'VO_DEFAULT': 'def',
      'OIDC_ENABLED': 'false',
      'OIDC_EXPECTED_AUDIENCE_CLAIM': 'rucio',
      'ENABLE_SSL': 'false',
      'PARAMS_ENCODING_ENABLED': 'false',
      'RULE_ACTIVITY': 'User Subscriptions',
      'ENABLE_USERPASS_LOGIN': 'true',
      'AUTH_TRUST_HOST': 'true',
      'AUTH_SECRET': authSecret,
      'NEXTAUTH_SECRET': authSecret,
      ...this.environmentVariables,
    }
  }
  validateOIDCProvider(provider: string, global_prefix: string): EnvValidationError[] {
    const prefix = `OIDC_PROVIDER_${provider.toUpperCase()}_`
    // Required OIDC variables (must match env-config-gateway.ts)
    const requiredVariables: string[] = ["client_id", "client_secret", "authorization_url", "token_url", "redirect_url"]
    // Optional OIDC variables (must match env-config-gateway.ts)
    const optionalVariables: string[] = ["icon_url", "refresh_token_url", "userinfo_url", "scopes", "logout_url", "issuer"]
    const errors: EnvValidationError[] = []

    // Validate required variables
    requiredVariables.forEach((key) => {
      const varName = `${prefix}${key.toUpperCase()}`
      if (!this.environmentVariables[varName]) {
        errors.push({
          type: 'error',
          message: `required variable ${global_prefix}${varName} is not set. Please set a value for ${global_prefix}${varName}`
        })
      }
    })

    // Validate optional variables (warnings only)
    optionalVariables.forEach((key) => {
      const varName = `${prefix}${key.toUpperCase()}`
      if (!this.environmentVariables[varName]) {
        errors.push({
          type: 'warning',
          message: `optional variable ${global_prefix}${varName} is not set. Consider setting a value for ${global_prefix}${varName} if needed`
        })
      }
    })

    return errors
  }
  validateVO(vo: string, global_prefix: string): EnvValidationError[] {
    const prefix = `VO_${vo.toUpperCase()}_`
    const requiredVariables: string[] = ["name"]
    const optionalVariables: string[] = ["logo", "oidc_enabled", "oidc_providers"]
    const errors: EnvValidationError[] = []
    requiredVariables.forEach((key) => {
      const varName = `${prefix}${key.toUpperCase()}`
      if (!this.environmentVariables[varName]) {
        errors.push({
          type: 'error',
          message: `required variable ${global_prefix}${varName} is not set. Please set a value for ${global_prefix}${varName}`
        })
      }
    })
    // check if OIDC is enabled for VO
    const oidcEnabledVarName = `${prefix}OIDC_ENABLED`
    const oidcProvidersVarName = `${prefix}OIDC_PROVIDERS`
    if (this.environmentVariables[oidcEnabledVarName] === 'true') {
      if (!this.environmentVariables[oidcProvidersVarName]) {
        errors.push({
          type: 'error',
          message: `required variable ${global_prefix}${oidcProvidersVarName} is not set. Please set a value for ${global_prefix}${oidcProvidersVarName} as a csv string of oidc provider names`
        })
      } else {
        const voOIDCProviders = this.environmentVariables[oidcProvidersVarName].split(',')
        voOIDCProviders.forEach((oidcProvider) => {
          const oidcErrors = this.validateOIDCProvider(oidcProvider, prefix)
          oidcErrors.forEach((error) => {
            errors.push(error)
          })
        })
      }
    }
    optionalVariables.forEach((key) => {
      const varName = `${prefix}${key.toUpperCase()}`
      if (!this.environmentVariables[varName]) {
        errors.push({
          type: 'warning',
          message: `optional variable ${global_prefix}${varName} is not set. Please set a value for ${global_prefix}${varName} if needed`
        })
      }
    })
    return errors
  }

  validateEnv(prefix: string): EnvValidationError[] {
    console.log('validating environment variables')
    console.log(this.environmentVariables)
    const env = this.environmentVariables
    const errors: EnvValidationError[] = []

    const requiredVariables: string[] = ["rucio_host", "rucio_auth_host", "hostname", "project_url", "vo_default", "vo_list", "nextauth_url"]

    // check if NODE_TLS_REJECT_UNAUTHORIZED is set to 1, then NODE_EXTRA_TLS_CERTS should be set
    if(env['NODE_TLS_REJECT_UNAUTHORIZED'] === '1') {
      requiredVariables.push('SERVER_CA_BUNDLE')
    }

    // check if all required variables are set
    requiredVariables.forEach((key) => {
      const keyName = `${key.toUpperCase()}`
      console.log(`checking if ${keyName} is set`)
      console.log(env[keyName])
      if (!env[key.toUpperCase()]) {
        errors.push({
          type: 'error',
          message: `required variable ${key.toUpperCase()} is not set. Please set a value for ${prefix.toUpperCase()}${key.toUpperCase()}`
        })
      }
    })
    // validate vo in vo_list
    const voList = env['VO_LIST'].split(',').map((vo) => vo.trim())
    voList.forEach((vo) => {
      const voErrors = this.validateVO(vo, prefix)
      voErrors.forEach((error) => {
        errors.push(error)
      })
    })

    // check if oidc is enabled, all oidc variables are set
    if (env['OIDC_ENABLED'] === 'true') {
      // check if oidc_providers is defined
      if (!env['OIDC_PROVIDERS']) {
        errors.push({
          type: 'error',
          message: `OIDC is enabled. Please set a value for ${prefix}OIDC_PROVIDERS as csv string of oidc provider names`
        })
      } else {
        const oidcProviders = env['OIDC_PROVIDERS'].split(',')
        oidcProviders.forEach((oidcProvider) => {
          const oidcErrors = this.validateOIDCProvider(oidcProvider, prefix)
          oidcErrors.forEach((error) => {
            errors.push(error)
          })
        })
      }
    }
    return errors
  }

  execute(): TTemplateGeneratorOutput {
    try {
      console.log(`rendering template ${this.templateName}`)
      let content = this.engine.renderFileSync(this.templateName, { context: this.environmentVariables })
      // remove empty spaces in the beginning of a line
      content = content.replace(/^\s+/gm, '')
      // replace 2 or more newlines with 1 newline
      content = content.replace(/\n{2,}/g, '\n')
      if (this.write) {
        writeFileSync(this.outputFilePath, content)
      }
      console.log(`output file ${this.outputFilePath} created`)
      return {
        status: true,
        message: `output file ${this.outputFilePath} created`,
        content: content,
        file: this.outputFilePath
      }
    } catch (e: unknown) {
      console.log(`error rendering template ${this.templateName}`)
      console.log(e as Error)
      return {
        status: false,
        message: `error rendering template ${this.templateName}`,
        content: e as string,
        file: this.outputFilePath
      }
    }
  }
}
