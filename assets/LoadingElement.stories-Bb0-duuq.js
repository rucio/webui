import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./LoadingElement-DtjbVN2b.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{i=t(),n(),a={title:`Atoms/Loading/LoadingElement`,component:r,parameters:{layout:`padded`,docs:{description:{component:`LoadingElement is a properly centered loading indicator that wraps LoadingSpinner. Use this component instead of LoadingSpinner directly to ensure consistent loading states across the application.`}}},tags:[`autodocs`],argTypes:{context:{control:`select`,options:[`page`,`section`,`card`,`inline`,`fullscreen`],description:`The context in which the loading element is used`},size:{control:`select`,options:[`sm`,`md`,`lg`,`xl`],description:`Size of the spinner`},variant:{control:`select`,options:[`default`,`neutral`,`success`,`error`,`warning`],description:`Color variant of the spinner`},text:{control:`text`,description:`Text to display below the spinner`},description:{control:`text`,description:`Description text to display below the main text`}}},o={args:{}},s={args:{context:`page`,size:`lg`,text:`Loading page...`,description:`Please wait while we fetch your data`},parameters:{layout:`fullscreen`}},c={args:{context:`section`,size:`md`},decorators:[e=>(0,i.jsx)(`div`,{className:`border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:(0,i.jsx)(e,{})})]},l={args:{context:`card`,size:`md`,text:`Loading data...`},decorators:[e=>(0,i.jsx)(`div`,{className:`w-64 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4`,children:(0,i.jsx)(e,{})})]},u={args:{context:`inline`,size:`sm`,text:`Processing...`},render:e=>(0,i.jsxs)(`div`,{className:`p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:[(0,i.jsx)(`p`,{className:`text-sm mb-2`,children:`Your request is being processed:`}),(0,i.jsx)(r,{...e})]})},d={args:{context:`section`,size:`lg`,text:`Loading application data...`}},f={args:{context:`section`,size:`lg`,text:`Loading application`,description:`This may take a few moments. Please wait...`}},p={args:{size:`sm`,context:`inline`,text:`Loading...`}},m={args:{size:`md`,context:`section`,text:`Loading data...`},decorators:[e=>(0,i.jsx)(`div`,{className:`h-64 border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:(0,i.jsx)(e,{})})]},h={args:{size:`lg`,context:`page`,text:`Loading application`,description:`Please wait...`}},g={args:{size:`xl`,context:`fullscreen`,text:`Initializing`,description:`Setting up your environment...`},parameters:{layout:`fullscreen`}},_={args:{variant:`default`,context:`section`,text:`Default loading`},decorators:[e=>(0,i.jsx)(`div`,{className:`h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:(0,i.jsx)(e,{})})]},v={args:{variant:`success`,context:`section`,text:`Processing successfully...`},decorators:[e=>(0,i.jsx)(`div`,{className:`h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:(0,i.jsx)(e,{})})]},y={args:{variant:`error`,context:`section`,text:`Retrying...`},decorators:[e=>(0,i.jsx)(`div`,{className:`h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:(0,i.jsx)(e,{})})]},b={args:{variant:`warning`,context:`section`,text:`Processing with warnings...`},decorators:[e=>(0,i.jsx)(`div`,{className:`h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg`,children:(0,i.jsx)(e,{})})]},x={name:`RSE Details Page Loading`,args:{context:`page`,size:`lg`,text:`Loading RSE details...`},parameters:{layout:`fullscreen`},decorators:[e=>(0,i.jsx)(`main`,{className:`min-h-screen bg-neutral-0 dark:bg-neutral-900`,children:(0,i.jsx)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10`,children:(0,i.jsx)(e,{})})})]},S={name:`Dashboard Widget Loading`,args:{context:`card`,size:`md`,text:`Loading widget data...`},decorators:[e=>(0,i.jsx)(`div`,{className:`w-96 h-64 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6`,children:(0,i.jsx)(e,{})})]},C={name:`Header Loading`,args:{context:`inline`,size:`sm`},decorators:[e=>(0,i.jsx)(`header`,{className:`h-14 bg-neutral-0 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6`,children:(0,i.jsx)(e,{})})]},w={args:{context:`section`,size:`lg`,text:`Loading in dark mode...`,description:`Please wait while we load your data`},decorators:[e=>(0,i.jsx)(`div`,{className:`dark h-64 bg-neutral-900 rounded-lg border border-neutral-700`,children:(0,i.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},T={name:`❌ Old vs ✅ New Pattern`,render:()=>(0,i.jsxs)(`div`,{className:`grid grid-cols-2 gap-8`,children:[(0,i.jsxs)(`div`,{className:`space-y-4`,children:[(0,i.jsx)(`h3`,{className:`text-sm font-semibold text-base-error-600`,children:`❌ Old Pattern (Avoid)`}),(0,i.jsxs)(`div`,{className:`border border-neutral-200 dark:border-neutral-700 rounded-lg h-48 p-4`,children:[(0,i.jsx)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400 mb-2`,children:`Not centered, inconsistent:`}),(0,i.jsx)(`div`,{className:`text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded`,children:`<LoadingSpinner />`})]})]}),(0,i.jsxs)(`div`,{className:`space-y-4`,children:[(0,i.jsx)(`h3`,{className:`text-sm font-semibold text-base-success-600`,children:`✅ New Pattern (Use This)`}),(0,i.jsxs)(`div`,{className:`border border-neutral-200 dark:border-neutral-700 rounded-lg h-48`,children:[(0,i.jsx)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400 p-2`,children:`Properly centered, consistent:`}),(0,i.jsx)(r,{context:`section`,className:`h-32`}),(0,i.jsx)(`div`,{className:`text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded-b-lg`,children:`<LoadingElement context="section" />`})]})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'page',
    size: 'lg',
    text: 'Loading page...',
    description: 'Please wait while we fetch your data'
  },
  parameters: {
    layout: 'fullscreen'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'md'
  },
  decorators: [Story => <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'card',
    size: 'md',
    text: 'Loading data...'
  },
  decorators: [Story => <div className="w-64 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                <Story />
            </div>]
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'inline',
    size: 'sm',
    text: 'Processing...'
  },
  render: args => <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-sm mb-2">Your request is being processed:</p>
            <LoadingElement {...args} />
        </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'lg',
    text: 'Loading application data...'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'lg',
    text: 'Loading application',
    description: 'This may take a few moments. Please wait...'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    context: 'inline',
    text: 'Loading...'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md',
    context: 'section',
    text: 'Loading data...'
  },
  decorators: [Story => <div className="h-64 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    context: 'page',
    text: 'Loading application',
    description: 'Please wait...'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'xl',
    context: 'fullscreen',
    text: 'Initializing',
    description: 'Setting up your environment...'
  },
  parameters: {
    layout: 'fullscreen'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    context: 'section',
    text: 'Default loading'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    context: 'section',
    text: 'Processing successfully...'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    context: 'section',
    text: 'Retrying...'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    context: 'section',
    text: 'Processing with warnings...'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'RSE Details Page Loading',
  args: {
    context: 'page',
    size: 'lg',
    text: 'Loading RSE details...'
  },
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [Story => <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <Story />
                </div>
            </main>]
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Dashboard Widget Loading',
  args: {
    context: 'card',
    size: 'md',
    text: 'Loading widget data...'
  },
  decorators: [Story => <div className="w-96 h-64 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <Story />
            </div>]
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Header Loading',
  args: {
    context: 'inline',
    size: 'sm'
  },
  decorators: [Story => <header className="h-14 bg-neutral-0 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6">
                <Story />
            </header>]
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'lg',
    text: 'Loading in dark mode...',
    description: 'Please wait while we load your data'
  },
  decorators: [Story => <div className="dark h-64 bg-neutral-900 rounded-lg border border-neutral-700">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: '❌ Old vs ✅ New Pattern',
  render: () => <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-base-error-600">❌ Old Pattern (Avoid)</h3>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg h-48 p-4">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Not centered, inconsistent:</p>
                    <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded">{'<LoadingSpinner />'}</div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-base-success-600">✅ New Pattern (Use This)</h3>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg h-48">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 p-2">Properly centered, consistent:</p>
                    <LoadingElement context="section" className="h-32" />
                    <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded-b-lg">
                        {'<LoadingElement context="section" />'}
                    </div>
                </div>
            </div>
        </div>
}`,...T.parameters?.docs?.source}}},E=[`Default`,`PageContext`,`SectionContext`,`CardContext`,`InlineContext`,`WithText`,`WithTextAndDescription`,`SmallSize`,`MediumSize`,`LargeSize`,`ExtraLargeSize`,`DefaultVariant`,`SuccessVariant`,`ErrorVariant`,`WarningVariant`,`RSEDetailsLoading`,`DashboardWidgetLoading`,`HeaderLoading`,`DarkMode`,`ComparisonWithOldPattern`]}))();export{l as CardContext,T as ComparisonWithOldPattern,w as DarkMode,S as DashboardWidgetLoading,o as Default,_ as DefaultVariant,y as ErrorVariant,g as ExtraLargeSize,C as HeaderLoading,u as InlineContext,h as LargeSize,m as MediumSize,s as PageContext,x as RSEDetailsLoading,c as SectionContext,p as SmallSize,v as SuccessVariant,b as WarningVariant,d as WithText,f as WithTextAndDescription,E as __namedExportsOrder,a as default};