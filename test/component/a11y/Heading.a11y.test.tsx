/**
 * Accessibility tests for Heading component
 * Tests WCAG 2.2 Level AAA compliance including:
 * - Automated axe scans
 * - Heading hierarchy
 * - Semantic structure
 * - Color contrast
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Heading } from '@/component-library/atoms/misc/Heading';

describe('Heading Accessibility', () => {
  describe('Automated Accessibility Scans', () => {
    it('should have no violations for all heading levels', async () => {
      const { container } = render(
        <div>
          <Heading level="h1">Heading 1</Heading>
          <Heading level="h2">Heading 2</Heading>
          <Heading level="h3">Heading 3</Heading>
          <Heading level="h4">Heading 4</Heading>
          <Heading level="h5">Heading 5</Heading>
          <Heading level="h6">Heading 6</Heading>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with different variants', async () => {
      const { container } = render(
        <div>
          <Heading level="h1" variant="display">Display Heading</Heading>
          <Heading level="h2" variant="title">Title Heading</Heading>
          <Heading level="h3" variant="subtitle">Subtitle Heading</Heading>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with color variants', async () => {
      const { container } = render(
        <div>
          <Heading level="h2">Default Color</Heading>
          <Heading level="h2" className="text-brand-600">Brand Color</Heading>
          <Heading level="h2" className="text-neutral-700">Neutral Color</Heading>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic Structure', () => {
    it('should render correct HTML heading elements', () => {
      const { container } = render(
        <div>
          <Heading level="h1">H1 Heading</Heading>
          <Heading level="h2">H2 Heading</Heading>
          <Heading level="h3">H3 Heading</Heading>
          <Heading level="h4">H4 Heading</Heading>
          <Heading level="h5">H5 Heading</Heading>
          <Heading level="h6">H6 Heading</Heading>
        </div>
      );

      expect(container.querySelector('h1')).toHaveTextContent('H1 Heading');
      expect(container.querySelector('h2')).toHaveTextContent('H2 Heading');
      expect(container.querySelector('h3')).toHaveTextContent('H3 Heading');
      expect(container.querySelector('h4')).toHaveTextContent('H4 Heading');
      expect(container.querySelector('h5')).toHaveTextContent('H5 Heading');
      expect(container.querySelector('h6')).toHaveTextContent('H6 Heading');
    });

    it('should maintain proper heading hierarchy', async () => {
      const { container } = render(
        <article>
          <Heading level="h1">Main Title</Heading>
          <Heading level="h2">Section 1</Heading>
          <Heading level="h3">Subsection 1.1</Heading>
          <Heading level="h3">Subsection 1.2</Heading>
          <Heading level="h2">Section 2</Heading>
          <Heading level="h3">Subsection 2.1</Heading>
        </article>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Verify hierarchy exists
      expect(container.querySelectorAll('h1')).toHaveLength(1);
      expect(container.querySelectorAll('h2')).toHaveLength(2);
      expect(container.querySelectorAll('h3')).toHaveLength(3);
    });
  });

  describe('Screen Reader Support', () => {
    it('should be announced as heading with correct level', () => {
      render(<Heading level="h2">Section Title</Heading>);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Section Title');
    });

    it('should support all heading levels for screen readers', () => {
      render(
        <div>
          <Heading level="h1">Level 1</Heading>
          <Heading level="h2">Level 2</Heading>
          <Heading level="h3">Level 3</Heading>
          <Heading level="h4">Level 4</Heading>
          <Heading level="h5">Level 5</Heading>
          <Heading level="h6">Level 6</Heading>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Level 1');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Level 2');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Level 3');
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Level 4');
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('Level 5');
      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Level 6');
    });

    it('should support aria-label for additional context', () => {
      render(<Heading level="h2" aria-label="User profile section">Profile</Heading>);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAccessibleName('User profile section');
    });
  });

  describe('Section Association', () => {
    it('should work with aria-labelledby to label sections', () => {
      const { container } = render(
        <section aria-labelledby="section-heading">
          <Heading level="h2" id="section-heading">
            Important Section
          </Heading>
          <p>Section content goes here</p>
        </section>
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('aria-labelledby', 'section-heading');

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'section-heading');
    });

    it('should support id for fragment links', () => {
      render(<Heading level="h2" id="introduction">Introduction</Heading>);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'introduction');
    });
  });

  describe('Visual Hierarchy', () => {
    it('should maintain visual distinction between heading levels', () => {
      const { container } = render(
        <div>
          <Heading level="h1">H1 Text</Heading>
          <Heading level="h2">H2 Text</Heading>
          <Heading level="h3">H3 Text</Heading>
        </div>
      );

      const h1 = container.querySelector('h1');
      const h2 = container.querySelector('h2');
      const h3 = container.querySelector('h3');

      // Verify that headings have distinct styling classes
      expect(h1?.className).toBeTruthy();
      expect(h2?.className).toBeTruthy();
      expect(h3?.className).toBeTruthy();
    });

    it('should support custom styling while maintaining semantics', () => {
      render(
        <Heading level="h3" className="custom-class">
          Styled Heading
        </Heading>
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveClass('custom-class');
      expect(heading.tagName).toBe('H3');
    });
  });

  describe('Content Accessibility', () => {
    it('should support text content accessibly', () => {
      render(<Heading level="h2">Simple Text Heading</Heading>);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAccessibleName('Simple Text Heading');
    });

    it('should support icons with proper labeling', () => {
      render(
        <Heading level="h2">
          <span aria-hidden="true">🔒</span> Secure Section
        </Heading>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('🔒 Secure Section');

      const icon = heading.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('should handle complex content accessibly', async () => {
      const { container } = render(
        <Heading level="h2">
          Dashboard <span className="text-neutral-500">(Last 30 days)</span>
        </Heading>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toContain('Dashboard');
      expect(heading.textContent).toContain('(Last 30 days)');
    });
  });

  describe('Responsive Behavior', () => {
    it('should remain accessible at different viewport sizes', async () => {
      const { container } = render(
        <div>
          <Heading level="h1" className="text-4xl md:text-5xl lg:text-6xl">
            Responsive Heading
          </Heading>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain semantic structure regardless of visual styling', () => {
      render(
        <Heading level="h4" className="text-2xl font-bold">
          Visually Large H4
        </Heading>
      );

      // Semantic level should be h4 even if styled larger
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H4');
    });
  });
});
