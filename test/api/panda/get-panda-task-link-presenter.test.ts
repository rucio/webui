import GetPandaTaskLinkPresenter from '@/lib/infrastructure/presenter/get-panda-task-link-presenter';
import { GetPandaTaskLinkError } from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';

describe('GetPandaTaskLinkPresenter', () => {
    const presenter = new GetPandaTaskLinkPresenter(undefined as never);

    it('passes the link through with 200', () => {
        const response = { status: 'success' as const, taskId: '1', url: 'https://bigpanda.cern.ch/task/?jeditaskid=1' };
        expect(presenter.convertResponseModelToViewModel(response)).toEqual({ status: 200, viewModel: response });
    });

    it('maps InvalidTaskIdError to invalid_task_id', () => {
        const error: GetPandaTaskLinkError = { status: 'error', name: 'InvalidTaskIdError', type: 'InvalidTaskIdError', message: 'bad', code: 400 };
        expect(presenter.convertErrorModelToViewModel(error)).toEqual({
            status: 400,
            viewModel: { status: 'error', taskId: '', url: '', message: 'bad', errorType: 'invalid_task_id' },
        });
    });

    it('maps anything else to unknown and 500', () => {
        const error = { status: 'error', name: 'Error', type: 'Other', message: '', code: 0 } as unknown as GetPandaTaskLinkError;
        const { status, viewModel } = presenter.convertErrorModelToViewModel(error);
        expect(status).toBe(500);
        expect(viewModel.errorType).toBe('unknown');
    });
});
