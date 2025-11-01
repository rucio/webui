import type { Meta, StoryObj } from '@storybook/react';
import { RucioLogo } from './RucioLogo';

const meta = {
  title: 'Atoms/Branding/RucioLogo',
  component: RucioLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'number', min: 50, max: 500, step: 10 },
      description: 'Width of the logo in pixels',
    },
    height: {
      control: { type: 'number', min: 50, max: 500, step: 10 },
      description: 'Height of the logo in pixels',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes (use text-* for color)',
    },
  },
} satisfies Meta<typeof RucioLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default RucioLogo with standard sizing (194x194)
 */
export const Default: Story = {
  args: {
    className: 'text-neutral-900',
  },
};

/**
 * Logo for light theme (dark fill)
 */
export const LightTheme: Story = {
  args: {
    className: 'text-neutral-900',
    width: 194,
    height: 194,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

/**
 * Logo for dark theme (light fill)
 */
export const DarkTheme: Story = {
  args: {
    className: 'text-neutral-100',
    width: 194,
    height: 194,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Theme-aware logo using Tailwind dark mode classes
 */
export const ThemeAware: Story = {
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 194,
    height: 194,
  },
  render: (args) => (
    <div className="p-8 rounded-lg bg-neutral-50 dark:bg-neutral-900">
      <RucioLogo {...args} />
      <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 text-center">
        Toggle theme to see the logo adapt
      </p>
    </div>
  ),
};

/**
 * Small logo (ideal for login page - 146x146)
 */
export const LoginPageSize: Story = {
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 146,
    height: 146,
  },
};

/**
 * Medium logo (common header size)
 */
export const HeaderSize: Story = {
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 90,
    height: 90,
  },
};

/**
 * Small logo (compact navigation)
 */
export const CompactSize: Story = {
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 48,
    height: 48,
  },
};

/**
 * Logo with custom brand color
 */
export const BrandColor: Story = {
  args: {
    className: 'text-brand-500',
    width: 146,
    height: 146,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

/**
 * Logo with error color (for error states)
 */
export const ErrorState: Story = {
  args: {
    className: 'text-base-error-600',
    width: 146,
    height: 146,
  },
};

/**
 * Responsive logo sizes comparison
 */
export const ResponsiveSizes: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Mobile (120x120)
        </h3>
        <RucioLogo
          className="text-neutral-900 dark:text-neutral-100"
          width={120}
          height={120}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Tablet/Desktop (146x146)
        </h3>
        <RucioLogo
          className="text-neutral-900 dark:text-neutral-100"
          width={146}
          height={146}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Large (194x194)
        </h3>
        <RucioLogo
          className="text-neutral-900 dark:text-neutral-100"
          width={194}
          height={194}
        />
      </div>
    </div>
  ),
};

/**
 * Light vs Dark comparison
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {/* Light theme */}
      <div className="flex flex-col items-center p-8 bg-neutral-50 rounded-lg">
        <RucioLogo className="text-neutral-900" width={146} height={146} />
        <p className="mt-4 text-sm text-neutral-700 font-medium">Light Theme</p>
      </div>

      {/* Dark theme */}
      <div className="flex flex-col items-center p-8 bg-neutral-900 rounded-lg">
        <RucioLogo className="text-neutral-100" width={146} height={146} />
        <p className="mt-4 text-sm text-neutral-300 font-medium">Dark Theme</p>
      </div>
    </div>
  ),
};
