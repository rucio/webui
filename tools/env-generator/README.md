# Env Generator

This tool is used to generate the `.env.production` or `.env` or `.env.development.local`` file for the Rucio WebUI project.

## Usage

1. For development, copy the provided `.env.template` file to a base envionment file. The base file will be used to export environment variables that will ultimately be used for generating the .env files for the WEBUI.

```bash
cp .env.template .env.base
```

2. Edit the `.env.base` file and add the required environment variables. All the variables **MUST** be prefixed with ` RUCIO*WEBUI*`` The variables should be added in the following format: `export RUCIO*WEBUI*<VARIABLE_NAME>=<VARIABLE_VALUE>`

**NOTE** By default, the rule activity is set to `User Subscription`. This can be changed by setting the `RULE_ACTIVITY` variable in the `.env.base` file.
**NOTE** In order to support DID schemas that use special characters like "/", a new configuration option has been added to the new webui to enable or disable this functionality.
In cases where DID schemas use any such special characters, the Apache configuration of the Rucio Server most likely uses `AllowEncodedSlashes` or `AllowEncode` directives.
The `PARAMS_ENCODING_ENABLED` in the helm chart config of the Rucio WebUI tells the webui to encode the URI parameters when requests are sent out to the rucio server.

| Variable Name             | Full Name                             | Description                                                                                | Example                        | Default            |
|---------------------------|---------------------------------------|--------------------------------------------------------------------------------------------|--------------------------------|--------------------|
| RUCIO_HOST                | RUCIO_WEBUI_RUCIO_HOST                | URL for the Rucio Server                                                                   | https://rucio-lb-prod.cern.ch  |                    |
| RUCIO_AUTH_HOST           | RUCIO_WEBUI_RUCIO_AUTH_HOST           | URL for the Rucio authentication server                                                    | https://rucio-auth-host.ch:443 |                    |
| PARAMS_ENCODING_ENABLED   | RUCIO_WEBUI_PARAMS_ENCODING_ENABLED   | If your DID schema has special characters like  '/' or '+' in the name, set this to true.  | true                           | false              |
| HOSTNAME                  | RUCIO_WEBUI_HOSTNAME                  | Public HOSTNAME at which Rucio WebUI will be accessible. It may include port number.       | rucio-ui.cern.ch               |                    |
| ENABLE_USERPASS_LOGIN     | RUCIO_WEBUI_ENABLE_USERPASS_LOGIN     | Show the Userpass Login option in the WebUI's Login Page                                   | true                           | true               |
| LIST_DIDS_INITIAL_PATTERN | RUCIO_WEBUI_LIST_DIDS_INITIAL_PATTERN | Configures the placeholder scope and name in the DIDs list page.                           | scope:name                     |                    |
| ENABLE_SSL                | RUCIO_WEBUI_ENABLE_SSL                | Enable or Disable TLS Termination (true or false)                                          | true                           | false              |
| SERVER_CA_BUNDLE          | RUCIO_WEBUI_SERVER_CA_BUNDLE          | Path to the CA bundle file that can verify Rucio Server certificate. If ENABLE_SSL is set. | /path/to/ca-bundle.pem         |                    |
| PROJECT_URL               | RUCIO_WEBUI_PROJECT_URL               | Public URL for your project                                                                | https://atlas.cern.ch          |                    |
| VO_DEFAULT                | RUCIO_WEBUI_VO_DEFAULT                | Short name for the default VO used for authentication                                      | def                            | def                |
| VO_LIST                   | RUCIO_WEBUI_VO_LIST                   | CSV string containing the list of supported VOs                                            | def, atl, cms                  | def                |
| MULTIVO_ENABLED           | RUCIO_WEBUI_MULTIVO_ENABLED           | Whether to enable multi-VO config (true or false)                                          | true                           |                    |
| OIDC_ENABLED              | RUCIO_WEBUI_OIDC_ENABLED              | Enable or Disable OIDC Authentication (true or false)                                      | true                           |                    |
| OIDC_PROVIDERS            | RUCIO_WEBUI_OIDC_PROVIDERS            | CSV string containing names of OIDC Providers                                              | cern, indigo                   |                    |
| RULE_ACTIVITY             | RUCIO_WEBUI_RULE_ACTIVITY             | The `Activity` to associate with rules created with WebUI                                  | User Subscriptions             | User Subscriptions |

For each `VO` specified in the `VO_LIST` variable, the additional variables need to be specified. The variables should be added in the following format:
`export RUCIO_WEBUI_VO_<VO_SHORT_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>`. An example for the default VO is shown below:

For each `VO` specified in the `VO_LIST` variable, additional variables need to be specified. These variables should be added in the following format:
`RUCIO_WEBUI_VO_<VO_SHORT_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>`. An example for the default VO is shown below:
| Variable Name | Full Name | Description | Example | Default |
|-----------------------|-----------------------------------|---------------------------------------------------------------------------|--------------|---------|
| VO_DEF_NAME | RUCIO_WEBUI_VO_DEF_NAME | Full name of the default VO | default | |
| VO_DEF_LOGO | RUCIO_WEBUI_VO_DEF_LOGO | URL to the logo of the default VO that will be rendered on the login page | | |
| VO_DEF_OIDC_ENABLED | RUCIO_WEBUI_VO_DEF_OIDC_ENABLED | Enable or Disable OIDC Authentication for the default VO (true or false) | true | |
| VO_DEF_OIDC_PROVIDERS | RUCIO_WEBUI_VO_DEF_OIDC_PROVIDERS | CSV string containing names of OIDC Providers for the default VO | cern, indigo | |

For each `OIDC Provider` specified in the `OIDC_PROVIDERS` variable, the additional variables need to be specified. The variables should be added in the following format:
`export RUCIO_WEBUI_OIDC_PROVIDER_<PROVIDER_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>`. An example for the CERN OIDC provider is shown below:

| Variable Name                        | Full Name                                        | Description                                                           | Example | Default |
| ------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------- | ------- | ------- |
| OIDC_PROVIDER_CERN_CLIENT_ID         | RUCIO_WEBUI_OIDC_PROVIDER_CERN_CLIENT_ID         | The client id for the webui registered on the OIDC Provider dashboard |         |         |
| OIDC_PROVIDER_CERN_CLIENT_SECRET     | RUCIO_WEBUI_OIDC_PROVIDER_CERN_CLIENT_SECRET     | The client secret for the webui obtained from the OIDC Provider       |         |         |
| OIDC_PROVIDER_CERN_AUTHORIZATION_URL | RUCIO_WEBUI_OIDC_PROVIDER_CERN_AUTHORIZATION_URL | The authorization URL for the OIDC Provider                           |         |         |
| OIDC_PROVIDER_CERN_TOKEN_URL         | RUCIO_WEBUI_OIDC_PROVIDER_CERN_TOKEN_URL         | The token endpoint for the OIDC Provider                              |         |         |
| OIDC_PROVIDER_CERN_REFRESH_TOKEN_URL | RUCIO_WEBUI_OIDC_PROVIDER_CERN_REFRESH_TOKEN_URL | The refresh token endpoint                                            |         |         |
| OIDC_PROVIDER_CERN_USERINFO_URL      | RUCIO_WEBUI_OIDC_PROVIDER_CERN_USERINFO_URL      | The URL to obtain user info from the OIDC Provider                    |         |         |
| OIDC_PROVIDER_CERN_REDIRECT_URL      | RUCIO_WEBUI_OIDC_PROVIDER_CERN_REDIRECT_URL      | The redirection URL configured on the OIDC Provider                   |         |         |

3. Run the `generate_env.js` script to generate the `.env` file for the WEBUI. You can switch between `dev` and `prod` modes.

```bash
npm install
npm run build
chmod +x ./dist/generate-env.js
source .env.base; ./dist/generate-env.js make dev ./.env --write
```

The script will report any errors in the `.env.base` file. If there are no errors, the `.env` file will be generated in the current directory.

4. Copy the generated `.env` file to the `rucio-webui` project directory.
   You can now move the `.env` file to the `rucio-webui` project directory and run the project.
