import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./Section-Bc761S0j.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;e((()=>{i=t(),n(),a={title:`Features/Layout/Section`,component:r,parameters:{layout:`padded`},tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`subtle`,`bordered`,`elevated`],description:`Visual variant of the section`},spacing:{control:`select`,options:[`none`,`sm`,`md`,`lg`,`xl`],description:`Vertical spacing (padding-y)`},padding:{control:`select`,options:[`none`,`sm`,`md`,`lg`],description:`Horizontal padding (padding-x)`}}},o={args:{children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Section Title`}),(0,i.jsx)(`p`,{children:`Default section with medium spacing and no background.`})]})}},s={args:{variant:`subtle`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Subtle Section`}),(0,i.jsx)(`p`,{children:`Section with subtle background color.`})]})}},c={args:{variant:`bordered`,padding:`md`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Bordered Section`}),(0,i.jsx)(`p`,{children:`Section with border and rounded corners.`})]})}},l={args:{variant:`elevated`,padding:`md`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Elevated Section`}),(0,i.jsx)(`p`,{children:`Section with background and shadow elevation.`})]})}},u={args:{spacing:`none`,variant:`subtle`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`No Spacing`}),(0,i.jsx)(`p`,{children:`Section with no vertical padding.`})]})}},d={args:{spacing:`sm`,variant:`subtle`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Small Spacing`}),(0,i.jsx)(`p`,{children:`Compact vertical spacing (16px mobile, 24px desktop).`})]})}},f={args:{spacing:`md`,variant:`subtle`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Medium Spacing`}),(0,i.jsx)(`p`,{children:`Standard vertical spacing (24px mobile, 32px desktop) - default.`})]})}},p={args:{spacing:`lg`,variant:`subtle`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Large Spacing`}),(0,i.jsx)(`p`,{children:`Spacious vertical spacing (32px mobile, 48px desktop).`})]})}},m={args:{spacing:`xl`,variant:`subtle`,children:(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Extra Large Spacing`}),(0,i.jsx)(`p`,{children:`Very spacious vertical spacing (48px mobile, 64px desktop).`})]})}},h={render:()=>(0,i.jsxs)(r,{spacing:`lg`,"aria-labelledby":`features-heading`,children:[(0,i.jsx)(`h2`,{id:`features-heading`,className:`text-3xl font-bold mb-6`,children:`Features`}),(0,i.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-6`,children:[1,2,3].map(e=>(0,i.jsxs)(`div`,{className:`p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg`,children:[(0,i.jsxs)(`h3`,{className:`font-semibold mb-2`,children:[`Feature `,e]}),(0,i.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Description of feature `,e]})]},e))})]})},g={render:()=>(0,i.jsx)(r,{variant:`subtle`,spacing:`xl`,padding:`md`,children:(0,i.jsxs)(`div`,{className:`text-center max-w-3xl mx-auto`,children:[(0,i.jsx)(`h1`,{className:`text-5xl font-bold mb-6`,children:`Welcome to Rucio`}),(0,i.jsx)(`p`,{className:`text-xl text-neutral-600 dark:text-neutral-400 mb-8`,children:`Scientific Data Management at scale`}),(0,i.jsxs)(`div`,{className:`flex gap-4 justify-center`,children:[(0,i.jsx)(`button`,{className:`px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700`,children:`Get Started`}),(0,i.jsx)(`button`,{className:`px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800`,children:`Learn More`})]})]})})},_={render:()=>(0,i.jsxs)(r,{spacing:`md`,"aria-labelledby":`about-heading`,children:[(0,i.jsx)(`h2`,{id:`about-heading`,className:`text-2xl font-bold mb-4`,children:`About`}),(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 mb-4`,children:`This is a standard content section with default styling. It uses semantic HTML (<section> tag) and proper ARIA labeling for accessibility.`}),(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`The section automatically handles responsive spacing, adjusting padding based on viewport size using Tailwind CSS.`})]})},v={render:()=>(0,i.jsxs)(r,{variant:`elevated`,spacing:`lg`,padding:`lg`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-6`,children:`Dashboard Cards`}),(0,i.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`,children:[1,2,3,4].map(e=>(0,i.jsxs)(`div`,{className:`p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700`,children:[(0,i.jsxs)(`div`,{className:`text-3xl font-bold text-brand-600 dark:text-brand-500 mb-2`,children:[e*25,`%`]}),(0,i.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Metric `,e]})]},e))})]})},y={render:()=>(0,i.jsxs)(`div`,{children:[(0,i.jsxs)(r,{variant:`default`,spacing:`lg`,padding:`md`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Section 1`}),(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`Default background section.`})]}),(0,i.jsxs)(r,{variant:`subtle`,spacing:`lg`,padding:`md`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Section 2`}),(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`Subtle background section.`})]}),(0,i.jsxs)(r,{variant:`default`,spacing:`lg`,padding:`md`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Section 3`}),(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`Back to default background.`})]})]})},b={render:()=>(0,i.jsxs)(r,{variant:`subtle`,spacing:`lg`,padding:`lg`,children:[(0,i.jsx)(`h2`,{className:`text-3xl font-bold mb-6`,children:`Parent Section`}),(0,i.jsxs)(r,{variant:`bordered`,spacing:`md`,padding:`md`,className:`mb-6`,children:[(0,i.jsx)(`h3`,{className:`text-xl font-semibold mb-3`,children:`Nested Section 1`}),(0,i.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Sections can be nested for complex layouts.`})]}),(0,i.jsxs)(r,{variant:`bordered`,spacing:`md`,padding:`md`,children:[(0,i.jsx)(`h3`,{className:`text-xl font-semibold mb-3`,children:`Nested Section 2`}),(0,i.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Each maintains its own spacing and styling.`})]})]})},x={render:()=>(0,i.jsxs)(`div`,{children:[(0,i.jsx)(r,{variant:`subtle`,spacing:`xl`,padding:`md`,children:(0,i.jsxs)(`div`,{className:`text-center`,children:[(0,i.jsx)(`h1`,{className:`text-4xl font-bold mb-4`,children:`Full Page Layout`}),(0,i.jsx)(`p`,{className:`text-xl text-neutral-600 dark:text-neutral-400`,children:`Example of multiple sections composing a complete page`})]})}),(0,i.jsxs)(r,{spacing:`lg`,padding:`md`,"aria-labelledby":`features`,children:[(0,i.jsx)(`h2`,{id:`features`,className:`text-2xl font-bold mb-6`,children:`Features`}),(0,i.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-6`,children:[1,2,3].map(e=>(0,i.jsxs)(`div`,{className:`p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg`,children:[(0,i.jsxs)(`h3`,{className:`font-semibold mb-2`,children:[`Feature `,e]}),(0,i.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Description`})]},e))})]}),(0,i.jsx)(r,{variant:`subtle`,spacing:`lg`,padding:`md`,children:(0,i.jsxs)(`div`,{className:`text-center`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Ready to get started?`}),(0,i.jsx)(`button`,{className:`px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700`,children:`Start Now`})]})})]})},S={render:()=>(0,i.jsxs)(`div`,{className:`dark bg-neutral-900 p-8`,children:[(0,i.jsxs)(r,{variant:`default`,spacing:`md`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold text-neutral-100 mb-4`,children:`Default in Dark Mode`}),(0,i.jsx)(`p`,{className:`text-neutral-400`,children:`No background in dark mode.`})]}),(0,i.jsxs)(r,{variant:`subtle`,spacing:`md`,className:`mt-8`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold text-neutral-100 mb-4`,children:`Subtle in Dark Mode`}),(0,i.jsx)(`p`,{className:`text-neutral-400`,children:`Darker background (neutral-900).`})]}),(0,i.jsxs)(r,{variant:`bordered`,spacing:`md`,padding:`md`,className:`mt-8`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold text-neutral-100 mb-4`,children:`Bordered in Dark Mode`}),(0,i.jsx)(`p`,{className:`text-neutral-400`,children:`Border with neutral-800.`})]}),(0,i.jsxs)(r,{variant:`elevated`,spacing:`md`,padding:`md`,className:`mt-8`,children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold text-neutral-100 mb-4`,children:`Elevated in Dark Mode`}),(0,i.jsx)(`p`,{className:`text-neutral-400`,children:`Background neutral-800 with shadow.`})]})]}),globals:{backgrounds:{value:`dark`}}},C={render:()=>(0,i.jsx)(`div`,{className:`space-y-8`,children:[`default`,`subtle`,`bordered`,`elevated`].map(e=>(0,i.jsxs)(r,{variant:e,spacing:`md`,padding:e==="default"?`none`:`md`,children:[(0,i.jsx)(`h3`,{className:`font-semibold mb-2 capitalize`,children:e}),(0,i.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Section variant: `,e]})]},e))})},w={render:()=>(0,i.jsxs)(`div`,{children:[(0,i.jsxs)(r,{spacing:`md`,"aria-labelledby":`main-content`,children:[(0,i.jsx)(`h2`,{id:`main-content`,className:`text-2xl font-bold mb-4`,children:`Main Content`}),(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`This section uses aria-labelledby to associate it with the heading.`})]}),(0,i.jsx)(r,{spacing:`md`,"aria-label":`Additional information`,className:`mt-8`,children:(0,i.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`This section uses aria-label for sections without visible headings.`})})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Section Title</h2>
                <p>Default section with medium spacing and no background.</p>
            </div>
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'subtle',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Subtle Section</h2>
                <p>Section with subtle background color.</p>
            </div>
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'bordered',
    padding: 'md',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Bordered Section</h2>
                <p>Section with border and rounded corners.</p>
            </div>
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    padding: 'md',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Elevated Section</h2>
                <p>Section with background and shadow elevation.</p>
            </div>
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    spacing: 'none',
    variant: 'subtle',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">No Spacing</h2>
                <p>Section with no vertical padding.</p>
            </div>
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    spacing: 'sm',
    variant: 'subtle',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Small Spacing</h2>
                <p>Compact vertical spacing (16px mobile, 24px desktop).</p>
            </div>
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    spacing: 'md',
    variant: 'subtle',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Medium Spacing</h2>
                <p>Standard vertical spacing (24px mobile, 32px desktop) - default.</p>
            </div>
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    spacing: 'lg',
    variant: 'subtle',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Large Spacing</h2>
                <p>Spacious vertical spacing (32px mobile, 48px desktop).</p>
            </div>
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    spacing: 'xl',
    variant: 'subtle',
    children: <div>
                <h2 className="text-2xl font-bold mb-4">Extra Large Spacing</h2>
                <p>Very spacious vertical spacing (48px mobile, 64px desktop).</p>
            </div>
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Section spacing="lg" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-3xl font-bold mb-6">
                Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h3 className="font-semibold mb-2">Feature {i}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Description of feature {i}</p>
                    </div>)}
            </div>
        </Section>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Section variant="subtle" spacing="xl" padding="md">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Welcome to Rucio</h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">Scientific Data Management at scale</p>
                <div className="flex gap-4 justify-center">
                    <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Get Started</button>
                    <button className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        Learn More
                    </button>
                </div>
            </div>
        </Section>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Section spacing="md" aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-bold mb-4">
                About
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                This is a standard content section with default styling. It uses semantic HTML (&lt;section&gt; tag) and proper ARIA labeling for
                accessibility.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
                The section automatically handles responsive spacing, adjusting padding based on viewport size using Tailwind CSS.
            </p>
        </Section>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Section variant="elevated" spacing="lg" padding="lg">
            <h2 className="text-2xl font-bold mb-6">Dashboard Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div className="text-3xl font-bold text-brand-600 dark:text-brand-500 mb-2">{i * 25}%</div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Metric {i}</p>
                    </div>)}
            </div>
        </Section>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            <Section variant="default" spacing="lg" padding="md">
                <h2 className="text-2xl font-bold mb-4">Section 1</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Default background section.</p>
            </Section>

            <Section variant="subtle" spacing="lg" padding="md">
                <h2 className="text-2xl font-bold mb-4">Section 2</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Subtle background section.</p>
            </Section>

            <Section variant="default" spacing="lg" padding="md">
                <h2 className="text-2xl font-bold mb-4">Section 3</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Back to default background.</p>
            </Section>
        </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Section variant="subtle" spacing="lg" padding="lg">
            <h2 className="text-3xl font-bold mb-6">Parent Section</h2>

            <Section variant="bordered" spacing="md" padding="md" className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Nested Section 1</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Sections can be nested for complex layouts.</p>
            </Section>

            <Section variant="bordered" spacing="md" padding="md">
                <h3 className="text-xl font-semibold mb-3">Nested Section 2</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Each maintains its own spacing and styling.</p>
            </Section>
        </Section>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            {/* Hero Section */}
            <Section variant="subtle" spacing="xl" padding="md">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Full Page Layout</h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400">Example of multiple sections composing a complete page</p>
                </div>
            </Section>

            {/* Features Section */}
            <Section spacing="lg" padding="md" aria-labelledby="features">
                <h2 id="features" className="text-2xl font-bold mb-6">
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <h3 className="font-semibold mb-2">Feature {i}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Description</p>
                        </div>)}
                </div>
            </Section>

            {/* CTA Section */}
            <Section variant="subtle" spacing="lg" padding="md">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                    <button className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Start Now</button>
                </div>
            </Section>
        </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark bg-neutral-900 p-8">
            <Section variant="default" spacing="md">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Default in Dark Mode</h2>
                <p className="text-neutral-400">No background in dark mode.</p>
            </Section>

            <Section variant="subtle" spacing="md" className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Subtle in Dark Mode</h2>
                <p className="text-neutral-400">Darker background (neutral-900).</p>
            </Section>

            <Section variant="bordered" spacing="md" padding="md" className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Bordered in Dark Mode</h2>
                <p className="text-neutral-400">Border with neutral-800.</p>
            </Section>

            <Section variant="elevated" spacing="md" padding="md" className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Elevated in Dark Mode</h2>
                <p className="text-neutral-400">Background neutral-800 with shadow.</p>
            </Section>
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
            {(['default', 'subtle', 'bordered', 'elevated'] as const).map(variant => <Section key={variant} variant={variant} spacing="md" padding={variant !== 'default' ? 'md' : 'none'}>
                    <h3 className="font-semibold mb-2 capitalize">{variant}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Section variant: {variant}</p>
                </Section>)}
        </div>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            <Section spacing="md" aria-labelledby="main-content">
                <h2 id="main-content" className="text-2xl font-bold mb-4">
                    Main Content
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">This section uses aria-labelledby to associate it with the heading.</p>
            </Section>

            <Section spacing="md" aria-label="Additional information" className="mt-8">
                <p className="text-neutral-600 dark:text-neutral-400">This section uses aria-label for sections without visible headings.</p>
            </Section>
        </div>
}`,...w.parameters?.docs?.source}}},T=[`Default`,`Subtle`,`Bordered`,`Elevated`,`NoSpacing`,`SmallSpacing`,`MediumSpacing`,`LargeSpacing`,`ExtraLargeSpacing`,`WithHeading`,`HeroSection`,`ContentSection`,`CardGrid`,`AlternatingBackground`,`NestedSections`,`FullPageLayout`,`DarkMode`,`AllVariants`,`WithARIA`]}))();export{C as AllVariants,y as AlternatingBackground,c as Bordered,v as CardGrid,_ as ContentSection,S as DarkMode,o as Default,l as Elevated,m as ExtraLargeSpacing,x as FullPageLayout,g as HeroSection,p as LargeSpacing,f as MediumSpacing,b as NestedSections,u as NoSpacing,d as SmallSpacing,s as Subtle,w as WithARIA,h as WithHeading,T as __namedExportsOrder,a as default};