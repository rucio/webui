import { injectable } from 'inversify';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { AMITagInfo, GetAMITagInfoRequest, GetAMITagInfoResponse } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import { GetAMITagInfoInputPort, type GetAMITagInfoOutputPort } from '@/lib/core/port/primary/get-ami-tag-info-ports';
import type AMIGatewayOutputPort from '@/lib/core/port/secondary/ami-gateway-output-port';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { AMITagInfoDTO } from '@/lib/core/dto/ami-dto';
import { MAX_AMI_TAGS_PER_REQUEST, createAmiTagUrl, isAmiTag, normalizeAmiBaseUrl } from '@/lib/core/utils/ami-tag-utils';

function toAMITagInfo(tag: string, url: string, result: PromiseSettledResult<AMITagInfoDTO>): AMITagInfo {
    if (result.status === 'rejected' || result.value.status === 'error') {
        return { tag, url, found: null };
    }
    const { found, productionStep, baseRelease, transformation, description, created, createdBy } = result.value;
    const info: AMITagInfo = { tag, url, found };
    // Only copy details that are present so the JSON stays compact
    Object.entries({ productionStep, baseRelease, transformation, description, created, createdBy }).forEach(([key, value]) => {
        if (value !== undefined) (info as unknown as Record<string, string>)[key] = value;
    });
    return info;
}

@injectable()
export default class GetAMITagInfoUseCase implements GetAMITagInfoInputPort {
    constructor(
        private readonly presenter: GetAMITagInfoOutputPort,
        private readonly amiGateway: AMIGatewayOutputPort,
        private readonly envConfigGateway: EnvConfigGatewayOutputPort,
    ) {}

    async execute(requestModel: AuthenticatedRequestModel<GetAMITagInfoRequest>): Promise<void> {
        const { tags } = requestModel;

        if (tags.length === 0 || tags.length > MAX_AMI_TAGS_PER_REQUEST || !tags.every(isAmiTag)) {
            await this.presenter.presentError({
                status: 'error',
                name: 'InvalidTagsError',
                type: 'InvalidTagsError',
                message: `Expected 1 to ${MAX_AMI_TAGS_PER_REQUEST} AMI tags, each a letter followed by at least 3 digits`,
                code: 400,
            });
            return;
        }

        const baseUrl = normalizeAmiBaseUrl(await this.envConfigGateway.get('AMI_BASE_URL'));
        const results = await Promise.allSettled(tags.map(tag => this.amiGateway.getTagInfo(baseUrl, tag)));

        const responseModel: GetAMITagInfoResponse = {
            status: 'success',
            tags: tags.map((tag, i) => toAMITagInfo(tag, createAmiTagUrl(baseUrl, tag), results[i])),
        };
        await this.presenter.presentSuccess(responseModel);
    }
}
