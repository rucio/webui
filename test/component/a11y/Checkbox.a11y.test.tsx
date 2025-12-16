/**
 * Accessibility tests for Checkbox component
 * Tests WCAG 2.2 Level AAA compliance including:
 * - Automated axe scans
 * - Label association
 * - Keyboard navigation (Space to toggle)
 * - ARIA attributes
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@/component-library/atoms/form/checkbox';

describe('Checkbox Accessibility', () => {
    describe('Automated Accessibility Scans', () => {
        it('should have no violations with associated label', async () => {
            const { container } = render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label htmlFor="terms">Accept terms and conditions</label>
                </div>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no violations when checked', async () => {
            const { container } = render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="checked" checked />
                    <label htmlFor="checked">Checked option</label>
                </div>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no violations when disabled', async () => {
            const { container } = render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="disabled" disabled />
                    <label htmlFor="disabled">Disabled option</label>
                </div>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no violations with aria-label', async () => {
            const { container } = render(<Checkbox aria-label="Subscribe to newsletter" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Label Association', () => {
        it('should be associated with label via htmlFor', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="option1" />
                    <label htmlFor="option1">Option 1</label>
                </div>,
            );

            const checkbox = screen.getByLabelText('Option 1');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).toHaveAttribute('id', 'option1');
        });

        it('should have accessible name from aria-label', () => {
            render(<Checkbox aria-label="Enable notifications" />);

            const checkbox = screen.getByLabelText('Enable notifications');
            expect(checkbox).toBeInTheDocument();
        });

        it('should support aria-labelledby', () => {
            render(
                <div>
                    <span id="checkbox-label">Marketing emails</span>
                    <Checkbox aria-labelledby="checkbox-label" />
                </div>,
            );

            const checkbox = screen.getByLabelText('Marketing emails');
            expect(checkbox).toHaveAttribute('aria-labelledby', 'checkbox-label');
        });
    });

    describe('Keyboard Navigation', () => {
        it('should be focusable via keyboard', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="keyboard" />
                    <label htmlFor="keyboard">Keyboard test</label>
                </div>,
            );

            const checkbox = screen.getByLabelText('Keyboard test');
            checkbox.focus();
            expect(checkbox).toHaveFocus();
        });

        it('should toggle with Space key', async () => {
            const user = userEvent.setup();
            const handleChange = jest.fn();

            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="toggle" onCheckedChange={handleChange} />
                    <label htmlFor="toggle">Toggle me</label>
                </div>,
            );

            const checkbox = screen.getByLabelText('Toggle me');
            checkbox.focus();

            // Press Space to check
            await user.keyboard(' ');
            expect(handleChange).toHaveBeenCalledWith(true);
        });

        it('should not be focusable when disabled', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="disabled" disabled />
                    <label htmlFor="disabled">Disabled</label>
                </div>,
            );

            const checkbox = screen.getByLabelText('Disabled');
            expect(checkbox).toBeDisabled();
        });
    });

    describe('ARIA Attributes', () => {
        it('should have correct role', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox" />
                    <label htmlFor="checkbox">Checkbox</label>
                </div>,
            );

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeInTheDocument();
        });

        it('should announce checked state', () => {
            const { rerender } = render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="checked" checked={false} />
                    <label htmlFor="checked">Toggleable</label>
                </div>,
            );

            let checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-checked', 'false');

            rerender(
                <div className="flex items-center space-x-2">
                    <Checkbox id="checked" checked={true} />
                    <label htmlFor="checked">Toggleable</label>
                </div>,
            );

            checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-checked', 'true');
        });

        it('should support indeterminate state', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="indeterminate" checked="indeterminate" />
                    <label htmlFor="indeterminate">Indeterminate</label>
                </div>,
            );

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
        });

        it('should support aria-describedby for help text', () => {
            render(
                <div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="subscribe" aria-describedby="subscribe-help" />
                        <label htmlFor="subscribe">Subscribe</label>
                    </div>
                    <span id="subscribe-help">You can unsubscribe at any time</span>
                </div>,
            );

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-describedby', 'subscribe-help');
        });
    });

    describe('Required State', () => {
        it('should support required attribute', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="required" required />
                    <label htmlFor="required">
                        Required <span aria-label="required">*</span>
                    </label>
                </div>,
            );

            const checkbox = screen.getByRole('checkbox');
            // Radix UI Checkbox renders as a button, so we check aria-required instead of native required
            expect(checkbox).toHaveAttribute('aria-required', 'true');
        });

        it('should support aria-required', () => {
            render(
                <div className="flex items-center space-x-2">
                    <Checkbox id="aria-required" aria-required="true" />
                    <label htmlFor="aria-required">Required field</label>
                </div>,
            );

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-required', 'true');
        });
    });

    describe('Error State', () => {
        it('should have no violations with error message', async () => {
            const { container } = render(
                <div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="error" aria-invalid="true" aria-describedby="error-message" />
                        <label htmlFor="error">Terms and conditions</label>
                    </div>
                    <span id="error-message" role="alert" className="text-base-error-600">
                        You must accept the terms and conditions
                    </span>
                </div>,
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should announce error state', () => {
            render(
                <div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="invalid" aria-invalid="true" aria-describedby="error" />
                        <label htmlFor="invalid">Accept terms</label>
                    </div>
                    <span id="error" role="alert">
                        Required field
                    </span>
                </div>,
            );

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-invalid', 'true');
            expect(checkbox).toHaveAttribute('aria-describedby', 'error');
        });
    });

    describe('Group Context', () => {
        it('should work within fieldset with legend', async () => {
            const { container } = render(
                <fieldset>
                    <legend>Select your interests</legend>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="sports" />
                        <label htmlFor="sports">Sports</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="music" />
                        <label htmlFor="music">Music</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="art" />
                        <label htmlFor="art">Art</label>
                    </div>
                </fieldset>,
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should work with role="group" and aria-labelledby', async () => {
            const { container } = render(
                <div role="group" aria-labelledby="group-label">
                    <span id="group-label">Notification preferences</span>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email" />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="sms" />
                        <label htmlFor="sms">SMS</label>
                    </div>
                </div>,
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
