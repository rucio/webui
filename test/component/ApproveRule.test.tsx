/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { ApproveRule } from '@/component-library/pages/Rule/approve/ApproveRule';
import { StreamingStatus, UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }));

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;

const streamingHook: UseStreamReader<ApproveRuleViewModel> = {
    status: StreamingStatus.STOPPED,
    error: undefined,
    start: jest.fn(),
    stop: jest.fn(),
};

const renderApproveRule = () =>
    render(
        <ApproveRule
            streamingHook={streamingHook}
            onGridReady={jest.fn()}
            onApprove={jest.fn()}
            onDeny={jest.fn()}
            approvingRuleId={null}
            denyingRuleId={null}
            onSearch={jest.fn()}
            onStop={jest.fn()}
        />,
    );

describe('ApproveRule', () => {
    it('leaves the page heading to the server-rendered page so it is not duplicated', () => {
        renderApproveRule();
        expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    });

    it('still renders its interactive parts', () => {
        renderApproveRule();
        expect(screen.getByRole('button', { name: /toggle filters/i })).toBeInTheDocument();
    });
});
