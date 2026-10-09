import {
    ClickableDIDCell,
    ClickableRSECell,
    ClickableRSEExpressionCell,
    ClickableRuleIdCell,
} from '@/component-library/features/table/cells/DifferentClickableCells';
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
});

describe('ClickableDID', () => {
    it('renders', () => {
        render(<ClickableDIDCell value={['test', 'dataset1']} />);
        expect(screen.getByText('test:dataset1')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it.each([[[]], [['test']], [['test', '']], [['', 'dataset1']]])('does not render without proper value', didScopeAndName => {
        render(<ClickableDIDCell value={didScopeAndName} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each([
        [['test', 'dataset1']],
        [['test', 'container']],
        [['test', 'file1']],
        [['data26_13p6TeV', 'data26_13p6TeV.00520310.physics_Main.recon.DAOD_IDTIDE.r17874_tid52556931_00']],
    ])('opens correct link', didScopeAndName => {
        render(<ClickableDIDCell value={didScopeAndName} />);
        const button = screen.getByRole('button');
        button.click();
        const [scope, name] = didScopeAndName;

        expect(spy).toHaveBeenCalledWith(`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`, '_blank', 'noopener,noreferrer');
    });
});

describe('ClickableRuleId', () => {
    it('renders', () => {
        render(<ClickableRuleIdCell value="ac82c72440da4798bc61d147529ed285" />);
        expect(screen.getByText('ac82c72440da4798bc61d147529ed285')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ac82c72440da4798bc61d147529ed285' })).toBeInTheDocument();
    });
    it('does not render wothout value', () => {
        render(<ClickableRuleIdCell value="" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it.each(['ac82c72440da4798bc61d147529ed285', '7eb69ef3986740bc964623ade1a740da', 'd605665d8e5a4dde8f31969fc320d3a8'])(
        'opens correct link',
        ruleId => {
            render(<ClickableRuleIdCell value={ruleId} />);
            const button = screen.getByRole('button', { name: ruleId });
            button.click();

            expect(spy).toHaveBeenCalledWith(`/rule/${ruleId}`, '_blank', 'noopener,noreferrer');
        },
    );
});
