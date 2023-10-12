# Env Generator
This tool is used to generate the `.env.production` or `.env` or `.env.development`.local file for the Rucio WebUI project.

## Usage
1. Copy the provided `.env.template` file to a base envionment file. THe base file will be used to export environment variables that will ultimately be used for generating the .env files for the WEBUI.

```bash
cp .env.template .env.base
```

2. Edit the `.env.base` file and add the required environment variables. All the variables MUST be prefixed with `RUCIO_WEBUI_`The variables should be added in the following format:
```export RUCIO_WEBUI_<VARIABLE_NAME>=<VARIABLE_VALUE>```

| Variable Name   | Full Name                   | Description                                                                                    | Example                        | Default |
| --------------- | --------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------ | ------- |
| RUCIO_HOST      | RUCIO_WEBUI_RUCIO_HOST      | The url for the Rucio Server                                                                   | https://rucio-lb-prod.cern.ch  |         |
| RUCIO_AUTH_HOST | RUCIO_WEBUI_RUCIO_AUTH_HOST | The url for the rucio authentication server                                                    | https://rucio-auth-host.ch:443 |         |
| HOST            | RUCIO_WEBUI_HOST            | The public url at which Rucio WebUI will be accessible                                         | https://rucio-ui.cern.ch       |         |
| PROJECT_URL     | RUCIO_WEBUI_PROJECT_URL     | The public url for your project                                                                | https://atlas.cern.ch          |         |
| VO_DEFAULT      | RUCIO_WEBUI_VO_DEFAULT      | The short name for the default vo to be used for authentication                                | def                            | def     |
| VO_LIST         | RUCIO_WEBUI_VO_LIST         | A csv string containing the list of supported VO's. Please include the default VO here as well | def, atl, cms                  | def     |
| MULTIVO_ENABLED | RUCIO_WEBUI_MULTIVO_ENABLED | Specified whether to enable multi_vo config. Values can be `true` or `false`                   | true                           |         |
| OIDC_ENABLED    | RUCIO_WEBUI_OIDC_ENABLED    | Enable or Disable OIDC Authentication. Value can be `true` or `false`                          | true                           |         |
| OIDC_PROVIDERS  | RUCIO_WEBUI_OIDC_PROVIDERS  | A csv string containing the list of names of OIDC Providers                                    | cern, indigo                   |         |

For each `VO` specified in the `VO_LIST` variable, the additional variables need to be specified. The variables should be added in the following format:
```export RUCIO_WEBUI_VO_<VO_SHORT_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>```. An example for the default VO is shown below:


| Variable Name         | Full Name                         | Description                                                                                                                   | Example      | Default |
| --------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------ | ------- |
| VO_DEF_NAME           | RUCIO_WEBUI_VO_DEF_NAME           | The full name of the VO                                                                                                       | Default      | Default |
| VO_DEF_LOGO           | RUCIO_WEBUI_VO_DEF_LOGO           | A public url for the VOs logo                                                                                                 |              |         |
| VO_DEF_OIDC_ENABLED   | RUCIO_WEBUI_VO_DEF_OIDC_ENABLED   | `true` or `false` to incidicate whether users can login to this VO via OIDC provivers                                         | true         | false   |
| VO_DEF_OIDC_PROVIDERS | RUCIO_WEBUI_VO_DEF_OIDC_PROVIDERS | A csv string containing the names of the OIDC providers for this VO. This MUST be specified if `VO_DEF_OIDC_ENABLED` was true | cern, indigo |         |


For each `OIDC Provider` specified in the `OIDC_PROVIDERS` variable, the additional variables need to be specified. The variables should be added in the following format:
```export RUCIO_WEBUI_OIDC_PROVIDER_<PROVIDER_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>```. An example for the CERN OIDC provider is shown below:

| Variable Name                        | Full Name                                        | Description                                                                    | Example | Default |
| OIDC_PROVIDER_CERN_CLIENT_ID         | RUCIO_WEBUI_OIDC_PROVIDER_CERN_CLIENT_ID         | The client id for the webui that was registered on the OIDC Provider dashboard |         |         |
| OIDC_PROVIDER_CERN_CLIENT_SECRET     | RUCIO_WEBUI_OIDC_PROVIDER_CERN_CLIENT_SECRET     | The client secret for the webui obtained from the OIDC Provider                |         |         |
| OIDC_PROVIDER_CERN_AUTHORIZATION_URL | RUCIO_WEBUI_OIDC_PROVIDER_CERN_AUTHORIZATION_URL | The authorization url for the OIDC Provider                                    |         |         |
| OIDC_PROVIDER_CERN_TOKEN_URL         | RUCIO_WEBUI_OIDC_PROVIDER_CERN_TOKEN_URL         | The token endpoint for the OIDC Provider                                       |         |         |
| OIDC_PROVIDER_CERN_REFRESH_TOKEN_URL | RUCIO_WEBUI_OIDC_PROVIDER_CERN_REFRESH_TOKEN_URL | The refresh token endpoint                                                     |         |         |
| OIDC_PROVIDER_CERN_USERINFO_URL      | RUCIO_WEBUI_OIDC_PROVIDER_CERN_USERINFO_URL      | The url to obtain user info from the OIDC Provider                             |         |         |
| OIDC_PROVIDER_CERN_REDIRECT_URL      | RUCIO_WEBUI_OIDC_PROVIDER_CERN_REDIRECT_URL      | The redirection URL configured on the OIDC Provider                            |         |         |

3. Run the `generate_env.js` script to generate the `.env` file for the WEBUI. You can switch between `dev` and `prod` modes.
```bash
npm run build
chmod +x ./dist/generate_env.js
source .env.template; ./dist/generate-env.js make prod ./.env --write
```

The script will report any errors in the `.env.base` file. If there are no errors, the `.env` file will be generated in the current directory.

4. Copy the generated `.env` file to the `rucio-webui` project directory.
You can now move the `.env` file to the `rucio-webui` project directory and run the project.
