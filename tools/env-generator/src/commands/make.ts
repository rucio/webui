import { type Arguments, type CommandBuilder } from 'yargs';
import { WebUIEnvTemplateCompiler, EnvValidationError } from '../api/base';

// Command Line Options
type Options = {
  // generate a dev or prod environment file
  mode: 'dev' | 'prod',
  // path to the output file
  output_path: string,
  // write the output file to disk
  write: boolean | undefined,
  // enable strict mode i.e. don't use default values
  defaults: boolean | undefined
}

export const command = "make <mode> <output_path>"
export const desc = "generate a environment file for the webui"

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      write: { type: 'boolean', alias: 'w' },
      defaults: { type: 'boolean', alias: 'd' }
    })


export const handler = async (argv: Arguments<Options>) => {
  let { mode, output_path, write, defaults } = argv
  mode = mode || 'dev'
  output_path = output_path || './.env.development.local'
  write = write || false
  defaults = defaults || true

  console.log(`mode: ${mode}`)
  console.log(`output_path: ${output_path}`)
  console.log(`write: ${write}`)
  console.log(`defaults: ${defaults}`)

  // process.env['RUCIasd O_WEBUI_R UCIO_HOs  ST'] = 'https://rucio-server:443'
  // process.env['RUCIO_WEBUI_RUCIO_AUTH_HOST'] = 'https://rucio-server:443'
  

  // extract all env variables starting with RUCIO_WEBUI_    
  const prefix = 'RUCIO_WEBUI_'
  let filteredEnv = Object.keys(process.env)
    .filter(key => key.startsWith(prefix))
    .reduce((obj: Record<string, string>, key) => {
      const varName = key.replace(prefix, '').toUpperCase();
      obj[varName] = (process.env[key] || '');
      return obj;
    }, {});


  // add NODE_TLS_REJECT_UNAUTHORIZED
  if (mode === 'dev') {
    filteredEnv['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  } else {
    filteredEnv['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  }

  // initialize template builder
  const envTemplateBuilder = new WebUIEnvTemplateCompiler(
    filteredEnv,
    output_path,
    '.env',
    write
  )

  // add default values
  if(defaults) {
    envTemplateBuilder.mergeWithDefaults()
  }

  // validate env variables
  const errors: EnvValidationError[] = envTemplateBuilder.validateEnv(prefix)
  if (errors.length > 0) {
    errors.forEach((error) => {
      console.log(`${error.type.toUpperCase()} ${error.message}`)
    })
    // count errors
    const errorCount = errors.filter((error) => error.type === 'error').length
    console.log(`Found ${errorCount} errors and ${errors.length - errorCount} warnings`)
    if(errorCount > 0) {
      console.log("Please fix the environment variables and try again")
      process.exit(1)
    }
  }

  // render template
  const templateOutput = envTemplateBuilder.execute()

  // log output and exit
  console.log(templateOutput)
  process.exit(0)
}
