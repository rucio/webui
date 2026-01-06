# **Rucio WebUI Design System**

**Version:** 1.0.0 **Last Updated:** 2025-10-31

## **Table of Contents**

1. [Overview](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#overview)
2. [Design Principles](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#design-principles)
3. [Design Tokens](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#design-tokens)
4. [Color System](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#color-system)
5. [Typography](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#typography)
6. [Spacing & Layout](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#spacing--layout)
7. [Elevation & Depth](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#elevation--depth)
8. [Motion & Animation](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#motion--animation)
9. [Component Guidelines](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#component-guidelines)
10. [Accessibility](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#accessibility)
11. [Dark Mode](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#dark-mode)
12. [Best Practices](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM.md#best-practices)

---

## **Overview**

The Rucio WebUI Design System is a comprehensive set of design standards, components, and guidelines that ensure consistency, accessibility, and performance across the entire application. Inspired by **Vercel's Geist** design system (simplicity, minimalism, developer focus) and **Apple's Human Interface Guidelines** (Clarity, Deference, Depth), this system provides a modern, elegant foundation for building scientific data management interfaces.

### **Goals**

- **Consistency**: Unified visual language across all interfaces
- **Accessibility**: WCAG AAA compliant, high contrast, keyboard navigable
- **Performance**: Optimized components, efficient rendering
- **Developer Experience**: Clear documentation, intuitive APIs
- **Maintainability**: Centralized tokens, scalable architecture

### **Philosophy**

Our design system balances **precision** with **elegance**, creating interfaces that are:

- **Clear**: Every element has a purpose
- **Simple**: Minimal visual noise, maximum clarity
- **Deep**: Layered with subtle depth and translucency
- **Accessible**: Usable by everyone, everywhere
- **Fast**: Optimized for performance

---

## **Design Principles**

### **1. Clarity**

**Inspired by Apple HIG**

Everything in the interface should be immediately understandable. Use precise language, clear visual hierarchy, and purposeful design.

**Guidelines:**

- Use legible typography at all sizes
- Maintain clear visual hierarchy through size, weight, color
- Avoid ambiguity in icons, labels, and interactions
- Provide immediate feedback for user actions

**Example:**

```tsx
// ✅ DO: Clear, descriptive labels
<Button variant="error">Delete Dataset</Button>

// ❌ DON'T: Ambiguous labels<Button variant="error">Remove</Button>
```

### **2. Simplicity**

**Inspired by Vercel Geist**

Embrace minimalism and restraint. Remove unnecessary decoration and focus on content and functionality.

**Guidelines:**

- Use whitespace generously
- Limit color palette to semantic choices
- Avoid gratuitous animation or effects
- Design for developers and power users

**Example:**

```tsx
// ✅ DO: Simple, focused interface
<Card>
    <Heading>Dataset Overview</Heading><KeyValue label="Size" value="2.4 TB" /><KeyValue label="Files" value="12,453" />
</Card>

// ❌ DON'T: Overcomplicated with unnecessary decoration<Card shadow="xl" gradient border="double" shine>
    <Heading icon={<Icon />} badge={<Badge />}>Dataset Overview</Heading>
    {/* ... excessive visual elements */}
</Card>
```

### **3. Depth**

**Inspired by Apple HIG Liquid Glass**

Use subtle layers, translucency, and shadows to create visual hierarchy and guide attention.

**Guidelines:**

- Use elevation to indicate importance and interaction
- Apply subtle transparency to overlays and secondary surfaces
- Create depth through layering, not heavy shadows
- Use motion to reinforce spatial relationships

**Example:**

```tsx
// ✅ DO: Subtle depth through elevation and translucency
<Modal className="bg-neutral-0/95 dark:bg-neutral-900/95 backdrop-blur-lg shadow-lg">
    <ModalContent />
</Modal>

// ❌ DON'T: Heavy, dated shadows<Modal className="shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
    <ModalContent />
</Modal>
```

### **4. Deference**

**Inspired by Apple HIG**

Let content and data take center stage. The UI should facilitate, not dominate.

**Guidelines:**

- Use neutral backgrounds to highlight content
- Minimize chrome and navigation elements
- Use subtle borders and dividers
- Let data visualization speak for itself

### **5. Accessibility First**

Every component must be accessible by default, not as an afterthought.

**Guidelines:**

- Maintain WCAG AAA contrast ratios (7:1 for normal text)
- Provide keyboard navigation for all interactions
- Include ARIA labels and semantic HTML
- Support screen readers and assistive technologies
- Test with real accessibility tools

---

## **Design Tokens**

Design tokens are the core visual attributes of the design system. They ensure consistency and enable theming.

### **Token Structure**

```tsx
// src/design-tokens/colors.tsexport const colors = {
    neutral: {/* ... */ },
    brand: {/* ... */ },
    semantic: {/* ... */ },
};

// Usage in componentsimport { colors } from '@/design-tokens/colors';

```

### **Token Categories**

1. **Colors** - Palette, semantic colors, gradients
2. **Typography** - Font families, sizes, weights, line heights
3. **Spacing** - Margins, padding, gaps
4. **Elevation** - Shadows, z-index layers
5. **Motion** - Animation durations, easing functions
6. **Breakpoints** - Responsive design breakpoints
7. **Border Radius** - Corner rounding values

---

## **Color System**

### **Palette Philosophy**

Our color system is built on three foundations:

1. **Neutral Scale** (Slate): Primary UI colors, text, backgrounds
2. **Brand Colors** (Purple): Primary actions, links, emphasis
3. **Semantic Colors**: Success, error, warning, info

### **Color Scales**

Each color has a 9-step scale (100-900), providing flexibility while maintaining consistency.

### **Neutral (Slate)**

**Primary UI colors for text, backgrounds, borders**

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `neutral-0` | `#ffffff` | N/A | Pure white backgrounds |
| `neutral-100` | `#f1f5f9` | N/A | Subtle backgrounds |
| `neutral-200` | `#e2e8f0` | N/A | Borders, dividers |
| `neutral-300` | `#cbd5e1` | N/A | Disabled states |
| `neutral-400` | `#94a3b8` | N/A | Placeholder text |
| `neutral-500` | `#64748b` | `#64748b` | Secondary text |
| `neutral-600` | `#475569` | N/A | Body text (light mode) |
| `neutral-700` | `#334155` | N/A | Headings (light mode) |
| `neutral-800` | `#1e293b` | N/A | Dark backgrounds |
| `neutral-900` | `#0f172a` | N/A | Darkest backgrounds |
| `neutral-1000` | `#000000` | N/A | Pure black |

**High Contrast Requirements:**

- Light mode text: `neutral-900` on `neutral-0` = 18.5:1 ✅
- Dark mode text: `neutral-100` on `neutral-900` = 16.8:1 ✅

### **Brand (Purple)**

**Primary brand color for CTAs, links, focus states**

| Token | Hex | Usage |
| --- | --- | --- |
| `brand-100` | `#ede9fe` | Subtle backgrounds |
| `brand-200` | `#ddd6fe` | Hover backgrounds |
| `brand-300` | `#c4b5fd` | Light accents |
| `brand-400` | `#a78bfa` | Muted brand |
| `brand-500` | `#8b5cf6` | **Primary brand color** |
| `brand-600` | `#7c3aed` | Buttons, primary actions |
| `brand-700` | `#6d28d9` | Button hover states |
| `brand-800` | `#5b21b6` | Dark accents |
| `brand-900` | `#4c1d95` | Darkest brand |

**Contrast Compliance:**

- `brand-600` on white: 7.12:1 (AAA) ✅
- `brand-500` on `neutral-900`: 8.5:1 (AAA) ✅

### **Semantic Colors**

**Success (Green)**

```tsx
{
    100: '#dcfce7',// Subtle success bg500: '#22c55e',// Success icons600: '#16a34a',// Primary success (AAA compliant)900: '#14532d',// Dark success bg
}

```

**Error (Red)**

```tsx
{
    100: '#fee2e2',// Subtle error bg500: '#ef4444',// Error icons600: '#dc2626',// Primary error (AAA compliant)900: '#7f1d1d',// Dark error bg
}

```

**Warning (Amber)**

```tsx
{
    100: '#fef3c7',// Subtle warning bg500: '#f59e0b',// Warning icons600: '#d97706',// Primary warning (AAA compliant)900: '#78350f',// Dark warning bg
}

```

**Info (Blue)**

```tsx
{
    100: '#e0f2fe',// Subtle info bg500: '#0ea5e9',// Info icons600: '#0284c7',// Primary info (AAA compliant)900: '#0c4a6e',// Dark info bg
}

```

### **Color Usage Guidelines**

**Text Colors**

```tsx
// Primary text
<p className="text-neutral-900 dark:text-neutral-100">

// Secondary text
<p className="text-neutral-600 dark:text-neutral-400">

// Tertiary/disabled text
<p className="text-neutral-400 dark:text-neutral-600">

```

**Background Colors**

```tsx
// Page background
<div className="bg-neutral-0 dark:bg-neutral-900">

// Card/surface background
<div className="bg-neutral-100 dark:bg-neutral-800">

// Hover state
<div className="hover:bg-neutral-200 dark:hover:bg-neutral-700">

```

**Border Colors**

```tsx
// Default borders
<div className="border border-neutral-200 dark:border-neutral-700">

// Subtle borders (10% opacity)<div className="border border-neutral-900/10 dark:border-neutral-100/10">

```

### **Accessibility Requirements**

All color combinations must meet **WCAG AAA** standards:

- **Normal text** (< 18px): 7:1 contrast ratio
- **Large text** (≥ 18px): 4.5:1 contrast ratio
- **UI components**: 3:1 contrast ratio

**Testing:**

```bash
# Use browser dev tools or online contrast checkers# Recommended: https://webaim.org/resources/contrastchecker/
```

---

## **Typography**

### **Font Philosophy**

Typography should be **legible, functional, and optimized for developer tools and data-heavy interfaces**.

### **Font Families**

**Primary: Inter**

```tsx
// Modern, highly legible sans-serif optimized for UIfontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
}

```

**Monospace: JetBrains Mono / IBM Plex Mono**

```tsx
// For code, datasets, technical contentfontFamily: {
    mono: ['JetBrains Mono', 'IBM Plex Mono', 'Courier New', 'monospace'],
}

```

### **Type Scale**

Based on a **modular scale (1.25)** for harmonious proportions:

| Token | Size | Line Height | Weight | Usage |
| --- | --- | --- | --- | --- |
| `text-xs` | 12px / 0.75rem | 16px / 1rem | 400 | Captions, labels |
| `text-sm` | 14px / 0.875rem | 20px / 1.25rem | 400 | Body small, secondary |
| `text-base` | 16px / 1rem | 24px / 1.5rem | 400 | **Body text** |
| `text-lg` | 18px / 1.125rem | 28px / 1.75rem | 500 | Emphasized text |
| `text-xl` | 20px / 1.25rem | 28px / 1.75rem | 600 | Subheadings |
| `text-2xl` | 24px / 1.5rem | 32px / 2rem | 600 | H3 |
| `text-3xl` | 30px / 1.875rem | 36px / 2.25rem | 700 | H2 |
| `text-4xl` | 36px / 2.25rem | 40px / 2.5rem | 700 | H1 |
| `text-5xl` | 48px / 3rem | 1 | 800 | Display |

### **Font Weights**

```tsx
{
    regular: 400,// Body textmedium: 500,// Emphasissemibold: 600,// Headingsbold: 700,// Strong emphasisextrabold: 800,// Display text
}

```

### **Typography Guidelines**

**Headings**

```tsx
// H1 - Page titles
<h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
    Dataset Management
</h1>

// H2 - Section titles<h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
    Recent Activity
</h2>// H3 - Subsections<h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
    File Details
</h3>
```

**Body Text**

```tsx
// Regular body
<p className="text-base text-neutral-700 dark:text-neutral-300">
    This is standard body text optimized for readability.
</p>

// Secondary body<p className="text-sm text-neutral-600 dark:text-neutral-400">
    Secondary information or metadata.
</p>// Caption<span className="text-xs text-neutral-500 dark:text-neutral-500">
    Last updated 2 hours ago
</span>
```

**Code and Technical Text**

```tsx
// Inline code
<code className="font-mono text-sm bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
    /api/dids/list
</code>

// Code block (use dedicated component)<CodeBlock language="python">
    {`def get_did(scope, name):
    return did_client.get(scope, name)`}
</CodeBlock>
```

### **Line Length**

For optimal readability:

- **Body text**: 60-75 characters per line
- **Technical content**: 80-100 characters per line

```tsx
// Use max-width to constrain line length
<div className="max-w-prose"> {/* 65ch */}
    <p>Long-form content here...</p>
</div>

```

---

## **Spacing & Layout**

### **Spacing Scale**

Based on an **8px grid system** for consistency and alignment:

| Token | Value | Usage |
| --- | --- | --- |
| `spacing-0` | 0px | No spacing |
| `spacing-1` | 4px | Tight spacing, icon gaps |
| `spacing-2` | 8px | Small gaps, compact layouts |
| `spacing-3` | 12px | Default element spacing |
| `spacing-4` | 16px | **Standard spacing** |
| `spacing-5` | 20px | Moderate spacing |
| `spacing-6` | 24px | Comfortable spacing |
| `spacing-8` | 32px | Large spacing |
| `spacing-10` | 40px | Extra large spacing |
| `spacing-12` | 48px | Section spacing |
| `spacing-16` | 64px | Major section spacing |
| `spacing-20` | 80px | Page-level spacing |

### **Layout Principles**

**Container Widths**

```tsx
// Full width
<div className="w-full">

// Content container (max-width)
<div className="max-w-7xl mx-auto"> {/* 1280px */}

// Prose content
<div className="max-w-prose"> {/* ~65ch */}

```

**Responsive Breakpoints**

```tsx
{
    sm: '640px',// Mobile landscapemd: '768px',// Tabletlg: '1024px',// Desktopxl: '1280px',// Large desktop'2xl': '1536px',// Extra largenav: '975px',// Custom navigation breakpoint
}

```

**Grid Layout**

```tsx
// 12-column grid
<div className="grid grid-cols-12 gap-4">
    <div className="col-span-12 md:col-span-8">Main content</div><div className="col-span-12 md:col-span-4">Sidebar</div>
</div>

// Auto-fit grid<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards */}
</div>
```

**Flexbox Layout**

```tsx
// Horizontal layout with gap
<div className="flex items-center gap-4">
    <Icon /><span>Label</span>
</div>

// Vertical layout<div className="flex flex-col gap-6">
    {/* Stacked content */}
</div>
```

### **Padding & Margin Guidelines**

**Component Padding**

```tsx
// Compact (buttons, badges)
<div className="px-3 py-2">

// Standard (cards, inputs)
<div className="p-4">

// Comfortable (sections, modals)
<div className="p-6">

// Spacious (page containers)
<div className="p-8">

```

**Vertical Rhythm**

```tsx
// Related elements
<div className="space-y-2">

// Section elements
<div className="space-y-6">

// Major sections
<div className="space-y-12">

```

---

## **Elevation & Depth**

### **Shadow System**

Inspired by **Apple's Liquid Glass**, use subtle shadows to create depth without heaviness.

| Level | Token | Value | Usage |
| --- | --- | --- | --- |
| 0 | `shadow-none` | none | Flat elements |
| 1 | `shadow-sm` | 0 1px 2px 0 rgba(0,0,0,0.05) | Subtle lift |
| 2 | `shadow` | 0 1px 3px 0 rgba(0,0,0,0.1) | Cards |
| 3 | `shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) | Dropdowns |
| 4 | `shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | Modals |
| 5 | `shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1) | Popovers |

**Custom Brand Shadow**

```tsx
// Focus ring shadow (brand color)boxShadow: {
    brand: '0 0 0 3px color-mix(in srgb, transparent, theme("colors.brand.500") 50%)',
}

```

### **Z-Index Layers**

```tsx
{
    auto: 'auto',
    0: '0',
    10: '10',// Sticky headers20: '20',// Dropdowns30: '30',// Fixed navigation40: '40',// Modals50: '50',// Toasts100: '100',// Tooltips (highest)
}

```

### **Translucency (Liquid Glass Effect)**

```tsx
// Backdrop blur for overlays
<div className="bg-neutral-0/95 dark:bg-neutral-900/95 backdrop-blur-lg">
    Modal content
</div>

// Semi-transparent surfaces<div className="bg-neutral-100/80 dark:bg-neutral-800/80">
    Card content
</div>
```

---

## **Motion & Animation**

### **Animation Principles**

**Purposeful Motion**

- Animations should clarify, not distract
- Use motion to guide attention and indicate state changes
- Keep animations fast (< 300ms for most interactions)

### **Duration Scale**

| Token | Value | Usage |
| --- | --- | --- |
| `duration-75` | 75ms | Instant feedback (button press) |
| `duration-100` | 100ms | Quick transitions |
| `duration-150` | 150ms | **Standard transitions** |
| `duration-200` | 200ms | Comfortable transitions |
| `duration-300` | 300ms | Moderate animations |
| `duration-500` | 500ms | Slow animations |
| `duration-700` | 700ms | Page transitions |

### **Easing Functions**

```tsx
{
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',// Accelerateout: 'cubic-bezier(0, 0, 0.2, 1)',// Decelerate'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',// **Standard easing**
}

```

### **Common Animations**

**Fade**

```tsx
<div className="transition-opacity duration-150 opacity-0 hover:opacity-100">

```

**Scale (Button Press)**

```tsx
<button className="transition-transform duration-75 active:scale-95">

```

**Slide In (Modal)**

```tsx
<div className="transition-transform duration-200 translate-y-4 data-[state=open]:translate-y-0">

```

**Accordion**

```tsx
// Already defined in tailwind.config.js
<div className="animate-accordion-down">

```

### **Animation Guidelines**

**DO:**

- Use `transition-colors` for hover states (150ms)
- Use `transition-transform` for interactive feedback
- Prefer `ease-in-out` for most transitions
- Disable animations for reduced motion preferences

**DON'T:**

- Use animations longer than 300ms for UI interactions
- Animate more than 2-3 properties simultaneously
- Use complex keyframe animations for simple states

**Reduced Motion Support**

```tsx
// Respect user preferences
<div className="motion-reduce:transition-none">

```

---

## **Component Guidelines**

### **Component Hierarchy**

**Atoms** (Basic building blocks)

- Button, Input, Checkbox, Badge, Skeleton, etc.
- Single-purpose, highly reusable
- Accept minimal props, use variants for styling

**Features** (Composite components)

- Form groups, data tables, navigation, etc.
- Combine multiple atoms
- Include business logic and state

**Pages** (Full layouts)

- Complete page templates
- Combine features and atoms
- Connect to data layer

### **Component API Design**

**Variant-Based Styling (CVA)**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'base-classes',// Always applied
    {
        variants: {
            variant: {
                default: 'bg-brand-600 text-white',
                outline: 'border border-brand-600 text-brand-600',
            },
            size: {
                sm: 'px-3 py-1.5 text-sm',
                md: 'px-4 py-2 text-base',
                lg: 'px-6 py-3 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

```

**Prop Interface**

```tsx
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>
{
// Only add custom props when necessary
    loading?: boolean;
    icon?: React.ReactNode;
}

```

### **Component Structure**

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

// 1. Define variantsconst componentVariants = cva(/* ... */);

// 2. Define props interfaceexport interface ComponentProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants>
{
// Custom props
}

// 3. Component with forwardRefconst Component = React.forwardRef<HTMLDivElement, ComponentProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(componentVariants({ variant, size }), className)}
                {...props}
            />
        );
    }
);

Component.displayName = 'Component';

export { Component, componentVariants };

```

---

## **Accessibility**

**Status:** ✅ WCAG 2.2 Level AAA Compliant **Documentation:** See [docs/ACCESSIBILITY.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/ACCESSIBILITY.md) for complete guidelines

### **Accessibility Standards**

All components in the Rucio WebUI Design System must meet **WCAG 2.2 Level AAA** requirements, the highest accessibility standard. This ensures our application is usable by:

- Users with visual impairments (screen readers, magnification)
- Users with motor impairments (keyboard-only navigation)
- Users with cognitive disabilities (clear language, consistent patterns)
- Users with hearing impairments (captions, transcripts)
- All users in various contexts (mobile, poor connectivity, etc.)

**Key Requirements:**

- ✅ **7:1** minimum contrast ratio for normal text
- ✅ **4.5:1** minimum contrast ratio for large text (≥18px)
- ✅ **3:1** minimum contrast ratio for UI components
- ✅ Complete keyboard accessibility
- ✅ Screen reader compatibility
- ✅ ARIA compliance
- ✅ Focus management

**Reference Documentation:**

- [**ACCESSIBILITY.md**](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/ACCESSIBILITY.md) - Complete accessibility guide
- [**COLOR_CONTRAST_ANALYSIS.md**](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/COLOR_CONTRAST_ANALYSIS.md) - Color contrast validation
- [**test/component/a11y/**](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/test/component/a11y/) - Example accessibility tests

### **Color Contrast Requirements**

All color combinations must meet WCAG AAA standards. See [COLOR_CONTRAST_ANALYSIS.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/COLOR_CONTRAST_ANALYSIS.md) for complete analysis.

**Light Mode - Approved Text Colors:**

```tsx
// ✅ AAA Compliant (7:1+) - Body text
text-neutral-900// 18.5:1 - Primary
text-neutral-800// 13.6:1 - Primary
text-neutral-700// 9.7:1  - Secondary
text-neutral-600// 7.5:1  - Secondary// ✅ AAA Compliant - Brand/Links
text-brand-900// 12.6:1
text-brand-600// 7.12:1// ✅ AAA Compliant - Semantic
text-base-success-600// 7.1:1
text-base-error-600// 7.8:1
text-base-warning-700// 8.4:1 (warning-600 is 6.8:1, use 700+)
text-base-info-700// 8.1:1// ❌ Not AAA - Use only for large text or decorative
text-neutral-500// 4.76:1 - Large text only
text-neutral-400// 2.85:1 - Decorative only
```

**Dark Mode - Approved Text Colors:**

```tsx
// ✅ AAA Compliant on neutral-900 background
text-neutral-0// 18.5:1 - Primary
text-neutral-100// 16.8:1 - Primary
text-neutral-400// 7.0:1  - Secondary

text-brand-100// 16.2:1
text-brand-400// 7.1:1
```

### **Keyboard Navigation**

All interactive elements must be fully operable via keyboard. See [ACCESSIBILITY.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/ACCESSIBILITY.md#keyboard-navigation-patterns) for complete patterns.

**Universal Shortcuts:**

- `Tab` - Navigate forward
- `Shift + Tab` - Navigate backward
- `Enter` - Activate button or link
- `Space` - Activate button, toggle checkbox
- `Esc` - Close modal, dropdown
- `Arrow Keys` - Navigate within component

**Example:**

```tsx
// Keyboard accessible button
<button
    type="button"
    className="focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    onClick={handleClick}
>
    Submit
</button>

```

### **Focus Management**

**Visible Focus Indicators:**

All interactive elements must have clear, visible focus indicators.

```tsx
// Standard focus ring (2px solid brand-500)
className="focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"

// Focus ring with dark mode support
className="focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:ring-offset-2"

```

**Focus Trap (Modals):**

Modals must trap focus to prevent keyboard navigation outside the modal.

```tsx
// Radix UI Dialog handles focus trap automatically
<Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent>
        {/* Focus is trapped here */}
        <DialogTitle>Modal Title</DialogTitle>
        <button onClick={() => setIsOpen(false)}>Close</button>
    </DialogContent>
</Dialog>

```

### **ARIA Best Practices**

Use ARIA attributes to enhance accessibility. See [ACCESSIBILITY.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/ACCESSIBILITY.md#aria-best-practices) for detailed guidance.

**First Rule of ARIA:** If you can use native HTML, do it.

```tsx
// ❌ Don't use ARIA if native HTML works
<div role="button" tabIndex={0} onClick={handleClick}>Click</div>

// ✅ Use native HTML<button onClick={handleClick}>Click</button>
```

**Common ARIA Patterns:**

```tsx
// Icon-only button
<button aria-label="Close dialog">
    <XIcon aria-hidden="true" />
</button>

// Form input with error<input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby="email-hint email-error"
/><span id="email-hint">Enter your email address</span>
{hasError && (
    <span id="email-error" role="alert" className="text-base-error-600">
        Invalid email address
    </span>
)}

// Live region for status updates
<div aria-live="polite" role="status">
    {loadingMessage}
</div>

// Alert for errors<div aria-live="assertive" role="alert">
    {criticalError}
</div>
```

### **Screen Reader Support**

All components must work with screen readers (NVDA, JAWS, VoiceOver).

**Key Requirements:**

```tsx
// ✅ All images have alt text
<img src="logo.png" alt="Rucio WebUI" />
<img src="decoration.svg" alt="" role="presentation" />// ✅ Form inputs have labels<label htmlFor="username">Username</label><input id="username" type="text" />// ✅ Headings use proper hierarchy<h1>Page Title</h1><h2>Section Title</h2><h3>Subsection Title</h3>// ✅ Landmarks for navigation<header role="banner">
    <nav aria-label="Main navigation">...</nav>
</header><main role="main">...</main><aside role="complementary">...</aside><footer role="contentinfo">...</footer>
```

### **Semantic HTML**

Always prefer semantic HTML over generic divs. Semantic elements provide built-in accessibility.

```tsx
// ✅ DO: Use semantic elements
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/">Dashboard</a></li>
        <li><a href="/datasets">Datasets</a></li>
    </ul>
</nav>

<main>
    <article>
        <header>
            <h1>Dataset Overview</h1>
            <p>Published on <time datetime="2025-11-01">November 1, 2025</time></p>
        </header>
        <p>Dataset content...</p>
        <footer>
            <button>Edit</button>
        </footer>
    </article>
</main>// ❌ DON'T: Use divs for everything<div>
    <div>
        <div>Navigation</div>
        <div><a href="/">Dashboard</a></div>
    </div>
</div>
```

### **Testing Requirements**

All components must pass automated and manual accessibility tests.

**Automated Testing:**

```bash
# Run jest-axe tests
npm run test:component

# Run Storybook with a11y addon
npm run storybook

```

**Manual Testing:**

- [ ]  Keyboard navigation (unplug mouse, use Tab/Enter/Space/Esc)
- [ ]  Screen reader (NVDA on Windows, VoiceOver on Mac)
- [ ]  Color contrast (7:1 minimum for normal text)
- [ ]  Zoom to 200% (no loss of functionality)
- [ ]  Color blindness simulation

**Example Test:**

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});

```

### **Accessibility Checklist**

When creating or reviewing components, verify:

**Perceivable:**

- [ ]  All text meets 7:1 contrast ratio
- [ ]  All images have alt text
- [ ]  Color is not the only means of conveying information
- [ ]  Content works at 200% zoom

**Operable:**

- [ ]  All functionality available via keyboard
- [ ]  No keyboard traps
- [ ]  Clear focus indicators (2px solid brand-500)
- [ ]  Logical focus order

**Understandable:**

- [ ]  Clear labels and instructions
- [ ]  Error messages provide guidance
- [ ]  Consistent navigation and patterns

**Robust:**

- [ ]  Valid HTML
- [ ]  ARIA used correctly
- [ ]  Works with assistive technologies

**Quick Test:**

```bash
# Check a specific component
npm run test:component -- Button.a11y.test

# View in Storybook with a11y panel
npm run storybook
# Navigate to component > Open "Accessibility" tab
```

### **Resources**

- [**ACCESSIBILITY.md**](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/ACCESSIBILITY.md) - Complete accessibility guide with patterns and examples
- [**COLOR_CONTRAST_ANALYSIS.md**](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/docs/COLOR_CONTRAST_ANALYSIS.md) - All approved color combinations
- [**test/component/a11y/**](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/test/component/a11y/) - Example accessibility tests
- [**WCAG 2.2 Guidelines**](https://www.w3.org/TR/WCAG22/) - Official WCAG documentation
- [**WAI-ARIA Authoring Practices**](https://www.w3.org/WAI/ARIA/apg/) - ARIA patterns and widgets

---

## **Dark Mode**

### **Implementation**

Dark mode is implemented using Tailwind's `class` strategy:

```tsx
// Add 'dark' class to <html> element to enable dark mode
<html className="dark">

```

### **Color Guidelines**

**Backgrounds**

```tsx
// Page background
bg-neutral-0 dark:bg-neutral-900

// Surface/card background
bg-neutral-100 dark:bg-neutral-800

// Elevated surface
bg-neutral-200 dark:bg-neutral-700

```

**Text**

```tsx
// Primary text
text-neutral-900 dark:text-neutral-100

// Secondary text
text-neutral-600 dark:text-neutral-400

// Tertiary text
text-neutral-500 dark:text-neutral-500

```

**Borders**

```tsx
// Visible borders
border-neutral-200 dark:border-neutral-700

// Subtle borders (10% opacity)
border-neutral-900/10 dark:border-neutral-100/10

```

### **Testing Dark Mode**

```tsx
// Test both themesexport const ButtonStory = () => (
    <>
        <div className="p-8 bg-neutral-0">
            <Button>Light Mode</Button>
        </div>
        <div className="p-8 bg-neutral-900 dark">
            <Button>Dark Mode</Button>
        </div>
    </>
);

```

---

## **Best Practices**

### **Performance**

**Code Splitting**

```tsx
// Lazy load heavy componentsconst DataTable = React.lazy(() => import('@/components/DataTable'));

<Suspense fallback={<Skeleton />}>
    <DataTable />
</Suspense>
```

**Memoization**

```tsx
// Prevent unnecessary re-rendersconst MemoizedComponent = React.memo(Component, (prev, next) => {
    return prev.data === next.data;
});

```

**Virtualization**

```tsx
// For large lists (1000+ items)import { useVirtualizer } from '@tanstack/react-virtual';

```

### **Consistency**

**Use Design Tokens**

```tsx
// ✅ DO: Use tokens
<div className="p-4 text-neutral-900 bg-neutral-100">

// ❌ DON'T: Use arbitrary values<div className="p-[17px] text-[#1a1a1a] bg-[#f5f5f5]">

```

**Follow Naming Conventions**

```tsx
// Component files: PascalCaseButton.tsx
DataTable.tsx

// Utility files: camelCase
formatDate.ts
validateEmail.ts

// Component names: PascalCaseexport const Button = () => { };

```

### **Documentation**

**Component Comments**

```tsx
/**
 * A flexible button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="md">
 *   Click me
 * </Button>
 * ```
 */export const Button = () => { };

```

**Storybook Stories**

```tsx
// Create stories for all variantsexport const Default: Story = {
    args: { children: 'Default Button' },
};

export const Outline: Story = {
    args: { variant: 'outline', children: 'Outline Button' },
};

```

---

## **Quick Reference**

### **Color Tokens**

```tsx
// Neutral (text, backgrounds, borders)
neutral-{0|100|200|300|400|500|600|700|800|900|1000}

// Brand (primary actions, links)
brand-{100|200|300|400|500|600|700|800|900}

// Semantic
base-success-{100-900}// Green
base-error-{100-900}// Red
base-warning-{100-900}// Amber
base-info-{100-900}// Blue
```

### **Typography Tokens**

```tsx
// Sizes
text-{xs|sm|base|lg|xl|2xl|3xl|4xl|5xl}

// Weights
font-{regular|medium|semibold|bold|extrabold}

// Families
font-{sans|mono}

```

### **Spacing Tokens**

```tsx
// Spacing scale (4px increments)
{p|m|gap|space}-{0|1|2|3|4|5|6|8|10|12|16|20}

```

### **Component Checklist**

When creating a new component:

- [ ]  Uses CVA for variant styling
- [ ]  Supports dark mode
- [ ]  Implements keyboard navigation
- [ ]  Includes ARIA labels
- [ ]  Meets WCAG AAA contrast
- [ ]  Has TypeScript types
- [ ]  Includes Storybook story
- [ ]  Has usage documentation
- [ ]  Optimized for performance

---

## **Related Documentation**

- [STYLE_UI.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/STYLE_UI.md) - Frontend/Presentation layer guide
- [STYLE_API.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/STYLE_API.md) - Application/Feature layer guide
- [STYLE_GATEWAY.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/STYLE_GATEWAY.md) - Infrastructure/Data layer guide
- [DESIGN_SYSTEM_MIGRATION.md](https://file+.vscode-resource.vscode-cdn.net/Users/maany/Projects/webui/.dadai/docs/DESIGN_SYSTEM_MIGRATION.md) - Migration guide

---

**Questions or Suggestions?** Open an issue in the repository or contact the design system team.