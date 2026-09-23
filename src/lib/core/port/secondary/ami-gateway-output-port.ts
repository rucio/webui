import { AMITagInfoDTO } from '@/lib/core/dto/ami-dto';

export default interface AMIGatewayOutputPort {
    /**
     * Looks up a single AMI tag. Never throws: transport or parsing failures
     * are returned as a DTO with status 'error'.
     * @param baseUrl AMI base URL, e.g. https://atlas-ami.cern.ch
     * @param tag A single AMI tag, e.g. m2281
     */
    getTagInfo(baseUrl: string, tag: string): Promise<AMITagInfoDTO>;
}
