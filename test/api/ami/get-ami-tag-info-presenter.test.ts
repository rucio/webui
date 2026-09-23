import GetAMITagInfoPresenter from '@/lib/infrastructure/presenter/get-ami-tag-info-presenter';
import { GetAMITagInfoError } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';

describe('GetAMITagInfoPresenter', () => {
    const presenter = new GetAMITagInfoPresenter(undefined as never);

    it('passes tags through with 200', () => {
        const tags = [{ tag: 'f1723', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f1723', found: null }];
        expect(presenter.convertResponseModelToViewModel({ status: 'success', tags })).toEqual({
            status: 200,
            viewModel: { status: 'success', tags },
        });
    });

    it('maps InvalidTagsError to errorType invalid_tags with its code', () => {
        const error: GetAMITagInfoError = { status: 'error', name: 'InvalidTagsError', type: 'InvalidTagsError', message: 'bad', code: 400 };
        expect(presenter.convertErrorModelToViewModel(error)).toEqual({
            status: 400,
            viewModel: { status: 'error', tags: [], message: 'bad', errorType: 'invalid_tags' },
        });
    });

    it('maps anything else to errorType unknown and 500', () => {
        const error = { status: 'error', name: 'Error', type: 'Other', message: '', code: 0 } as unknown as GetAMITagInfoError;
        const { status, viewModel } = presenter.convertErrorModelToViewModel(error);
        expect(status).toBe(500);
        expect(viewModel.errorType).toBe('unknown');
    });
});
