import {
    ClickableAccountCell,
    ClickableDIDCell,
    ClickableRSECell,
    ClickableRSEExpressionCell,
    ClickableRuleIdCell,
    ClickableSubscriptionCell,
} from '@/component-library/features/table/cells/ClickableCellsCollection';
import { render, screen } from '@testing-library/react';

const spy = jest.spyOn(window, 'open').mockImplementation(() => null);

describe('ClickableRSE', () => {
    it('renders', () => {
        render(<ClickableRSECell value="XRD1" />);
        expect(screen.getByText('XRD1')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('does not render without value', () => {
        render(<ClickableRSECell value="" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each(['XRD1', 'INFN-GENOVA_SCRATCHDISK', 'CERN-PROD_OPENDATA', 'AGLT2-S3_LOCALGROUPDISK'])('opens correct link', rseName => {
        render(<ClickableRSECell value={rseName} />);
        const button = screen.getByRole('button', { name: rseName });
        button.click();

        expect(spy).toHaveBeenCalledWith(`/rse/${encodeURIComponent(rseName)}`, '_blank', 'noopener,noreferrer');
    });
    it('supports styling', () => {
        render(<ClickableRSECell value="XRD1" className="bg-red-700" />);
        const button = screen.getByRole('button', { name: 'XRD1' });
        expect(button).toHaveClass('bg-red-700');
        expect(button).not.toHaveClass('bg-neutral-100');
    });
});

describe('ClickableRSEExpression', () => {
    it('renders', () => {
        render(<ClickableRSEExpressionCell value="XRD1|XRD2" />);
        expect(screen.getByText('XRD1|XRD2')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('does not render without value', () => {
        render(<ClickableRSEExpressionCell value="" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each(['XRD1', 'INFN-GENOVA_SCRATCHDISK', 'CERN-PROD_OPENDATA', 'AGLT2-S3_LOCALGROUPDISK'])('opens single RSE page', rseName => {
        render(<ClickableRSEExpressionCell value={rseName} />);
        const button = screen.getByRole('button', { name: rseName });
        button.click();

        expect(spy).toHaveBeenCalledWith(`/rse/${encodeURIComponent(rseName)}`, '_blank', 'noopener,noreferrer');
    });
    it.each(['XRD1|XRD2', 'CERN-S3-LOGS|CERN-PROD_TZERO|MOCK-POSIX'])('opens RSE search panel with specified expression', rseExpression => {
        render(<ClickableRSEExpressionCell value={rseExpression} />);
        const button = screen.getByRole('button', { name: rseExpression });
        button.click();

        expect(spy).toHaveBeenCalledWith(`/rses?expression=${encodeURIComponent(rseExpression)}&autoSearch=true`, '_blank', 'noopener,noreferrer');
    });
    it('supports styling', () => {
        render(<ClickableRSEExpressionCell value="XRD1|XRD2" className="justify-center" />);
        const button = screen.getByRole('button', { name: 'XRD1|XRD2' });
        expect(button).toHaveClass('justify-center');
        expect(button).not.toHaveClass('shrink-0');
    });
});

describe('ClickableDID', () => {
    it('renders', () => {
        render(<ClickableDIDCell value={{ scope: 'test', name: 'dataset1' }} />);
        expect(screen.getByText('test:dataset1')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it.each([{}, { scope: 'test' }, { name: 'dataset' }, { scope: 'test', name: '' }, { scope: '', name: 'dataset1' }])(
        'does not render without proper value',
        didScopeAndName => {
            render(<ClickableDIDCell value={didScopeAndName as { scope: string; name: string }} />);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        },
    );
    it.each([
        { scope: 'test', name: 'dataset1' },
        { scope: 'test', name: 'container' },
        { scope: 'test', name: 'file1' },
        { scope: 'data26_13p6TeV', name: 'data26_13p6TeV.00520310.physics_Main.recon.DAOD_IDTIDE.r17874_tid52556931_00' },
    ])('opens correct link', didScopeAndName => {
        render(<ClickableDIDCell value={didScopeAndName} />);
        const button = screen.getByRole('button');
        button.click();
        const { scope, name } = didScopeAndName;

        expect(spy).toHaveBeenCalledWith(`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`, '_blank', 'noopener,noreferrer');
    });
    it('supports styling', () => {
        render(<ClickableDIDCell value={{ scope: 'test', name: 'dataset1' }} className="p-3 mb-2" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('p-3 mb-2');
        expect(button).not.toHaveClass('mt-2');
    });
});

describe('ClickableRuleId', () => {
    it('renders', () => {
        render(<ClickableRuleIdCell value="ac82c72440da4798bc61d147529ed285" />);
        expect(screen.getByText('ac82c72440da4798bc61d147529ed285')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ac82c72440da4798bc61d147529ed285' })).toBeInTheDocument();
    });
    it('does not render without value', () => {
        render(<ClickableRuleIdCell value="" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each(['ac82c72440da4798bc61d147529ed285', '7eb69ef3986740bc964623ade1a740da', 'd605665d8e5a4dde8f31969fc320d3a8'])(
        'opens correct link',
        ruleId => {
            render(<ClickableRuleIdCell value={ruleId} />);
            const button = screen.getByRole('button', { name: ruleId });
            button.click();

            expect(spy).toHaveBeenCalledWith(`/rule/${encodeURIComponent(ruleId)}`, '_blank', 'noopener,noreferrer');
        },
    );
    it('supports styling', () => {
        render(<ClickableRuleIdCell value="id1" className="md:flex-col" />);
        const button = screen.getByRole('button', { name: 'id1' });
        expect(button).toHaveClass('md:flex-col');
        expect(button).not.toHaveClass('lg:flex-col');
    });
});

describe('ClickableAccountName', () => {
    it('renders', () => {
        render(<ClickableAccountCell value="root" />);
        expect(screen.getByText('root')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('does not render without value', () => {
        render(<ClickableAccountCell value="" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each(['root', 'jdoe', 'my-account'])('opens correct link', accountName => {
        render(<ClickableAccountCell value={accountName} />);
        const button = screen.getByRole('button', { name: accountName });
        button.click();

        expect(spy).toHaveBeenCalledWith(`/account/${encodeURIComponent(accountName)}`, '_blank', 'noopener,noreferrer');
    });
    it('supports styling', () => {
        render(<ClickableAccountCell value="jdoe" className="text-md" />);
        const button = screen.getByRole('button', { name: 'jdoe' });
        expect(button).toHaveClass('text-md');
        expect(button).not.toHaveClass('text-lg');
    });
});

describe('ClickableSubscriptionCell', () => {
    it('renders', () => {
        render(<ClickableSubscriptionCell value="my-subscription" account="jdoe" />);
        expect(screen.getByText('my-subscription')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'my-subscription' })).toBeInTheDocument();
    });
    it.each([
        ['', ''],
        ['jdoe', ''],
        ['', 'my-subscription'],
    ])('does not render without values', (account, name) => {
        render(<ClickableSubscriptionCell value={name} account={account} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each([
        ['jdoe', 'my-subscription'],
        ['root', 'subscribe-rule-1'],
        ['my-special-account', 'foo'],
    ])('opens correct link', (account, name) => {
        render(<ClickableSubscriptionCell value={name} account={account} />);
        const button = screen.getByRole('button');
        button.click();

        expect(spy).toHaveBeenCalledWith(`/subscription/${encodeURIComponent(account)}/${encodeURIComponent(name)}`, '_blank', 'noopener,noreferrer');
    });
    it('supports styling', () => {
        render(<ClickableSubscriptionCell value="subscription" account="my" className="my-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('my-class');
        expect(button).not.toHaveClass('not-my-class');
    });
});
