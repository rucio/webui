import FeatureConfigGatewayOutputPort from '@/lib/core/port/secondary/feature-config-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';

describe('FeatureConfigGateway', () => {
    afterEach(() => {
        delete process.env['FEATURE_RULES'];
        delete process.env['FEATURE_RULES_CREATE'];
    });

    it('defaults rules to enabled when unset', async () => {
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        expect(await gateway.isEnabled('rules')).toBe(true);
    });

    it('reports rules disabled when FEATURE_RULES=false', async () => {
        process.env['FEATURE_RULES'] = 'false';
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        expect(await gateway.isEnabled('rules')).toBe(false);
    });

    it('cascades a disabled parent to the child via the gateway', async () => {
        process.env['FEATURE_RULES'] = 'false';
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        expect(await gateway.isEnabled('rules.create')).toBe(false);
    });

    it('isAnyEnabled returns true when at least one key is on', async () => {
        process.env['FEATURE_RULES_CREATE'] = 'false';
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        // rses defaults on, rules.create off -> OR is true
        expect(await gateway.isAnyEnabled(['rses', 'rules.create'])).toBe(true);
    });

    it('enabledSet contains all keys', async () => {
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        const set = await gateway.enabledSet();
        expect(set['subscriptions']).toBe(true);
    });
});
