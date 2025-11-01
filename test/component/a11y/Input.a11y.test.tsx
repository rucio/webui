/**
 * Accessibility tests for Input component
 * Tests WCAG 2.2 Level AAA compliance including:
 * - Automated axe scans
 * - Label association
 * - Error messages
 * - ARIA attributes
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Input } from '@/component-library/atoms/form/input';

describe('Input Accessibility', () => {
  describe('Automated Accessibility Scans', () => {
    it('should have no violations with associated label', async () => {
      const { container } = render(
        <div>
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with aria-label', async () => {
      const { container } = render(<Input aria-label="Email address" type="email" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when disabled', async () => {
      const { container } = render(
        <div>
          <label htmlFor="disabled-input">Disabled Input</label>
          <Input id="disabled-input" disabled />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with placeholder', async () => {
      const { container } = render(
        <div>
          <label htmlFor="name">Name</label>
          <Input id="name" placeholder="Enter your name" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Label Association', () => {
    it('should be associated with label via htmlFor', () => {
      render(
        <div>
          <label htmlFor="username">Username</label>
          <Input id="username" />
        </div>
      );

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should support implicit label association', () => {
      render(
        <label>
          Email
          <Input type="email" />
        </label>
      );

      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('should have accessible name from aria-label', () => {
      render(<Input aria-label="Search" type="search" />);

      const input = screen.getByLabelText('Search');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should have no violations with error state', async () => {
      const { container } = render(
        <div>
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
          <span id="email-error" role="alert">
            Please enter a valid email address
          </span>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should announce error messages via aria-describedby', () => {
      render(
        <div>
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" aria-invalid="true" aria-describedby="password-error" />
          <span id="password-error">Password must be at least 8 characters</span>
        </div>
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'password-error');
    });

    it('should support aria-errormessage', () => {
      render(
        <div>
          <label htmlFor="confirm">Confirm Password</label>
          <Input id="confirm" type="password" aria-invalid="true" aria-errormessage="confirm-error" />
          <span id="confirm-error" role="alert">
            Passwords do not match
          </span>
        </div>
      );

      const input = screen.getByLabelText('Confirm Password');
      expect(input).toHaveAttribute('aria-errormessage', 'confirm-error');
    });
  });

  describe('Required Fields', () => {
    it('should have no violations with required attribute', async () => {
      const { container } = render(
        <div>
          <label htmlFor="required-field">
            Required Field <span aria-label="required">*</span>
          </label>
          <Input id="required-field" required aria-required="true" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should announce required state', () => {
      render(
        <div>
          <label htmlFor="name">Name</label>
          <Input id="name" required />
        </div>
      );

      const input = screen.getByLabelText('Name');
      expect(input).toBeRequired();
    });

    it('should support aria-required', () => {
      render(
        <div>
          <label htmlFor="email">Email</label>
          <Input id="email" aria-required="true" />
        </div>
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable', () => {
      render(
        <div>
          <label htmlFor="input">Input</label>
          <Input id="input" />
        </div>
      );

      const input = screen.getByLabelText('Input');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(
        <div>
          <label htmlFor="disabled">Disabled</label>
          <Input id="disabled" disabled />
        </div>
      );

      const input = screen.getByLabelText('Disabled');
      expect(input).toBeDisabled();
    });
  });

  describe('Help Text', () => {
    it('should associate help text via aria-describedby', () => {
      render(
        <div>
          <label htmlFor="username">Username</label>
          <Input id="username" aria-describedby="username-help" />
          <span id="username-help">Must be at least 3 characters</span>
        </div>
      );

      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('aria-describedby', 'username-help');
    });

    it('should support multiple describedby references', () => {
      render(
        <div>
          <label htmlFor="password">Password</label>
          <Input id="password" aria-describedby="password-help password-requirements" />
          <span id="password-help">Choose a strong password</span>
          <span id="password-requirements">At least 8 characters with numbers and symbols</span>
        </div>
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('aria-describedby', 'password-help password-requirements');
    });
  });

  describe('Input Types', () => {
    it('should support various input types accessibly', async () => {
      const { container } = render(
        <div>
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" />

          <label htmlFor="password">Password</label>
          <Input id="password" type="password" />

          <label htmlFor="search">Search</label>
          <Input id="search" type="search" />

          <label htmlFor="tel">Phone</label>
          <Input id="tel" type="tel" />

          <label htmlFor="url">Website</label>
          <Input id="url" type="url" />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText('Search')).toHaveAttribute('type', 'search');
      expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel');
      expect(screen.getByLabelText('Website')).toHaveAttribute('type', 'url');
    });
  });
});
