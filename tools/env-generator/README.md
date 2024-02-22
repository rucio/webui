# Env Generator

This tool is used to generate the `.env.production` or `.env` or `.env.development.local`` file for the Rucio WebUI project.

## Usage

1. For development, copy the provided `.env.template` file to a base envionment file. The base file will be used to export environment variables that will ultimately be used for generating the .env files for the WEBUI.

```bash
cp .env.template .env.base
```

2. Edit the `.env.base` file and add the required environment variables. All the variables **MUST** be prefixed with `RUCIO_WEBUI_`` The variables should be added in the following format:
```export RUCIO_WEBUI_<VARIABLE_NAME>=<VARIABLE_VALUE>```

| Variable Name   | Full Name                   | Description                                                                             | Example                        | Default |
|-----------------|-----------------------------|-----------------------------------------------------------------------------------------|--------------------------------|---------|
| RUCIO_HOST      | RUCIO_WEBUI_RUCIO_HOST      | URL for the Rucio Server                                                                | https://rucio-lb-prod.cern.ch  |         |
| RUCIO_AUTH_HOST | RUCIO_WEBUI_RUCIO_AUTH_HOST | URL for the Rucio authentication server                                                 | https://rucio-auth-host.ch:443 |         |
| HOSTNAME        | RUCIO_WEBUI_HOSTNAME        | Public HOSTNAME at which Rucio WebUI will be accessible. It can include the port number | rucio-ui.cern.ch               |         |
| ENABLE_SSL      | RUCIO_WEBUI_ENABLE_SSL      | Enable or Disable TLS Termination (true or false)                                       | true                           | false   |
| PROJECT_URL     | RUCIO_WEBUI_PROJECT_URL     | Public URL for your project                                                             | https://atlas.cern.ch          |         |
| VO_DEFAULT      | RUCIO_WEBUI_VO_DEFAULT      | Short name for the default VO used for authentication                                   | def                            | def     |
| VO_LIST         | RUCIO_WEBUI_VO_LIST         | CSV string containing the list of supported VOs                                         | def, atl, cms                  | def     |
| MULTIVO_ENABLED | RUCIO_WEBUI_MULTIVO_ENABLED | Whether to enable multi-VO config (true or false)                                       | true                           |         |
| OIDC_ENABLED    | RUCIO_WEBUI_OIDC_ENABLED    | Enable or Disable OIDC Authentication (true or false)                                   | true                           |         |
| OIDC_PROVIDERS  | RUCIO_WEBUI_OIDC_PROVIDERS  | CSV string containing names of OIDC Providers                                           | cern, indigo                   |         |

For each `VO` specified in the `VO_LIST` variable, the additional variables need to be specified. The variables should be added in the following format:
```export RUCIO_WEBUI_VO_<VO_SHORT_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>```. An example for the default VO is shown below:

For each `VO` specified in the `VO_LIST` variable, additional variables need to be specified. These variables should be added in the following format:
```RUCIO_WEBUI_VO_<VO_SHORT_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>```. An example for the default VO is shown below:
| Variable Name         | Full Name                         | Description                                                               | Example      | Default |
|-----------------------|-----------------------------------|---------------------------------------------------------------------------|--------------|---------|
| VO_DEF_NAME           | RUCIO_WEBUI_VO_DEF_NAME           | Full name of the default VO                                               | default      |         |
| VO_DEF_LOGO           | RUCIO_WEBUI_VO_DEF_LOGO           | URL to the logo of the default VO that will be rendered on the login page |              |         |
| VO_DEF_OIDC_ENABLED   | RUCIO_WEBUI_VO_DEF_OIDC_ENABLED   | Enable or Disable OIDC Authentication for the default VO (true or false)  | true         |         |
| VO_DEF_OIDC_PROVIDERS | RUCIO_WEBUI_VO_DEF_OIDC_PROVIDERS | CSV string containing names of OIDC Providers for the default VO          | cern, indigo |         |

For each `OIDC Provider` specified in the `OIDC_PROVIDERS` variable, the additional variables need to be specified. The variables should be added in the following format:
```export RUCIO_WEBUI_OIDC_PROVIDER_<PROVIDER_NAME>_<VARIABLE_NAME>=<VARIABLE_VALUE>```. An example for the CERN OIDC provider is shown below:

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
