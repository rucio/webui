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
    this.environmentVariables = {
      'SESSION_COOKIE_NAME': 'rucio-webui-session',
      'SESSION_PASSWORD': this.generateRandomString(),
      'MULTI_VO_ENABLED': 'false',
      'VO_LIST': 'def',
      'VO_DEFAULT': 'def',
      'OIDC_ENABLED': 'false',
      'ENABLE_SSL': 'false',
      ...this.environmentVariables,
    }
  }
  validateOIDCProvider(provider: string, global_prefix: string): EnvValidationError[] {
    const prefix = `OIDC_PROVIDER_${provider.toUpperCase()}_`
    const requiredVariables: string[] = ["client_id", "client_secret", "authorization_url", "token_url", "userinfo_url", "redirect_url", "refresh_token_url"]
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

    const requiredVariables: string[] = ["rucio_host", "rucio_auth_host", "hostname", "project_url", "vo_default", "vo_list"]

    // check if all required variables are set
    requiredVariables.forEach((key) => {
      let keyName = `${key.toUpperCase()}`
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
