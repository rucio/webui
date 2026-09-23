import type { Container } from 'inversify';

function loadContainer(flag: string | undefined): { container: Container; flagMap: Map<symbol, string[]>; symbol: symbol } {
    const previous = process.env.FEATURE_DIDS_AMI_TAGS;
    if (flag === undefined) delete process.env.FEATURE_DIDS_AMI_TAGS;
    else process.env.FEATURE_DIDS_AMI_TAGS = flag;
    let result!: { container: Container; flagMap: Map<symbol, string[]>; symbol: symbol };
    jest.isolateModules(() => {
        const config = require('@/lib/infrastructure/ioc/container-config');
        const CONTROLLERS = require('@/lib/infrastructure/ioc/ioc-symbols-controllers').default;
        result = { container: config.default, flagMap: config.CONTROLLER_FLAG_MAP, symbol: CONTROLLERS.GET_AMI_TAG_INFO };
    });
    if (previous === undefined) delete process.env.FEATURE_DIDS_AMI_TAGS;
    else process.env.FEATURE_DIDS_AMI_TAGS = previous;
    return result;
}

describe('GetAMITagInfoFeature loading', () => {
    it('does not bind the controller when the flag is unset (default off)', () => {
        const { container, symbol } = loadContainer(undefined);
        expect(container.isBound(symbol)).toBe(false);
    });

    it('binds the controller when FEATURE_DIDS_AMI_TAGS=true', () => {
        const { container, symbol } = loadContainer('true');
        expect(container.isBound(symbol)).toBe(true);
    });

    it('always maps the controller to dids.ami_tags so withFeature can 404', () => {
        const { flagMap, symbol } = loadContainer(undefined);
        expect(flagMap.get(symbol)).toEqual(['dids.ami_tags']);
    });
});
