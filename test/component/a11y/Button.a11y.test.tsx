/**
 * Accessibility tests for Button component
 * Tests WCAG 2.2 Level AAA compliance including:
 * - Automated axe scans
 * - Keyboard navigation
 * - ARIA attributes
 * - Focus management
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Button } from '@/component-library/atoms/form/button';

describe('Button Accessibility', () => {
    describe('Automated Accessibility Scans', () => {
        it('should have no accessibility violations in default state', async () => {
            const { container } = render(<Button>Click me</Button>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations when disabled', async () => {
            const { container } = render(<Button disabled>Disabled</Button>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with variant styles', async () => {
            const { container } = render(
                <div>
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with different sizes', async () => {
            const { container } = render(
                <div>
                    <Button size="default">Default</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">Icon</Button>
                </div>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Keyboard Navigation', () => {
        it('should be focusable via keyboard', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');

            button.focus();
            expect(button).toHaveFocus();
        });

        it('should be activatable with Enter key', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            button.focus();
            await user.keyboard('{Enter}');

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should be activatable with Space key', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            button.focus();
            await user.keyboard(' ');

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should not be focusable when disabled', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');

            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('disabled');
        });
    });

    describe('ARIA Attributes', () => {
        it('should have accessible name from button text', () => {
            render(<Button>Submit Form</Button>);
            const button = screen.getByRole('button');

            expect(button).toHaveAccessibleName('Submit Form');
        });

        it('should support aria-label', () => {
            render(<Button aria-label="Close dialog">X</Button>);
            const button = screen.getByRole('button');

            expect(button).toHaveAccessibleName('Close dialog');
        });

        it('should support aria-describedby', () => {
            render(
                <div>
                    <Button aria-describedby="button-description">Action</Button>
                    <span id="button-description">This performs an important action</span>
                </div>,
            );

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-describedby', 'button-description');
        });
    });

    describe('Focus Management', () => {
        it('should have visible focus indicator', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');

            button.focus();

            // The button should have focus styles applied
            expect(button).toHaveFocus();
            expect(button.className).toMatch(/focus-visible/);
        });

        it('should maintain focus after being clicked', async () => {
            const user = userEvent.setup();
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');

            await user.click(button);

            expect(button).toHaveFocus();
        });
    });

    describe('Screen Reader Support', () => {
        it('should announce button role', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');

            expect(button.tagName).toBe('BUTTON');
        });

        it('should announce disabled state', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');

            expect(button).toHaveAttribute('disabled');
        });

        it('should support icon buttons with aria-label', () => {
            render(
                <Button aria-label="Settings" size="icon">
                    <span aria-hidden="true">⚙️</span>
                </Button>,
            );

            const button = screen.getByRole('button');
            expect(button).toHaveAccessibleName('Settings');

            // Icon should be hidden from screen readers
            const icon = button.querySelector('[aria-hidden="true"]');
            expect(icon).toBeInTheDocument();
        });
    });
});
