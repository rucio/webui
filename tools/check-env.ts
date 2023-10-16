import EnvConfigGateway from "@/lib/infrastructure/gateway/env-config-gateway";

const envGateway = new EnvConfigGateway()

const projectURL = await envGateway.projectURL()