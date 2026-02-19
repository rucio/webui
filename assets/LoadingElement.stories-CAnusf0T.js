import{j as e}from"./iframe-CbZ9RuD1.js";import{L as k}from"./LoadingElement-C0Dl0LYY.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./LoadingSpinner-DNn-SVom.js";const Oe={title:"Atoms/Loading/LoadingElement",component:k,parameters:{layout:"padded",docs:{description:{component:"LoadingElement is a properly centered loading indicator that wraps LoadingSpinner. Use this component instead of LoadingSpinner directly to ensure consistent loading states across the application."}}},tags:["autodocs"],argTypes:{context:{control:"select",options:["page","section","card","inline","fullscreen"],description:"The context in which the loading element is used"},size:{control:"select",options:["sm","md","lg","xl"],description:"Size of the spinner"},variant:{control:"select",options:["default","neutral","success","error","warning"],description:"Color variant of the spinner"},text:{control:"text",description:"Text to display below the spinner"},description:{control:"text",description:"Description text to display below the main text"}}},a={args:{}},t={args:{context:"page",size:"lg",text:"Loading page...",description:"Please wait while we fetch your data"},parameters:{layout:"fullscreen"}},s={args:{context:"section",size:"md"},decorators:[r=>e.jsx("div",{className:"border border-neutral-200 dark:border-neutral-700 rounded-lg",children:e.jsx(r,{})})]},o={args:{context:"card",size:"md",text:"Loading data..."},decorators:[r=>e.jsx("div",{className:"w-64 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4",children:e.jsx(r,{})})]},n={args:{context:"inline",size:"sm",text:"Processing..."},render:r=>e.jsxs("div",{className:"p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg",children:[e.jsx("p",{className:"text-sm mb-2",children:"Your request is being processed:"}),e.jsx(k,{...r})]})},d={args:{context:"section",size:"lg",text:"Loading application data..."}},i={args:{context:"section",size:"lg",text:"Loading application",description:"This may take a few moments. Please wait..."}},c={args:{size:"sm",context:"inline",text:"Loading..."}},l={args:{size:"md",context:"section",text:"Loading data..."},decorators:[r=>e.jsx("div",{className:"h-64 border border-neutral-200 dark:border-neutral-700 rounded-lg",children:e.jsx(r,{})})]},m={args:{size:"lg",context:"page",text:"Loading application",description:"Please wait..."}},u={args:{size:"xl",context:"fullscreen",text:"Initializing",description:"Setting up your environment..."},parameters:{layout:"fullscreen"}},g={args:{variant:"default",context:"section",text:"Default loading"},decorators:[r=>e.jsx("div",{className:"h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg",children:e.jsx(r,{})})]},p={args:{variant:"success",context:"section",text:"Processing successfully..."},decorators:[r=>e.jsx("div",{className:"h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg",children:e.jsx(r,{})})]},x={args:{variant:"error",context:"section",text:"Retrying..."},decorators:[r=>e.jsx("div",{className:"h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg",children:e.jsx(r,{})})]},b={args:{variant:"warning",context:"section",text:"Processing with warnings..."},decorators:[r=>e.jsx("div",{className:"h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg",children:e.jsx(r,{})})]},h={name:"RSE Details Page Loading",args:{context:"page",size:"lg",text:"Loading RSE details..."},parameters:{layout:"fullscreen"},decorators:[r=>e.jsx("main",{className:"min-h-screen bg-neutral-0 dark:bg-neutral-900",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10",children:e.jsx(r,{})})})]},v={name:"Dashboard Widget Loading",args:{context:"card",size:"md",text:"Loading widget data..."},decorators:[r=>e.jsx("div",{className:"w-96 h-64 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6",children:e.jsx(r,{})})]},S={name:"Header Loading",args:{context:"inline",size:"sm"},decorators:[r=>e.jsx("header",{className:"h-14 bg-neutral-0 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6",children:e.jsx(r,{})})]},y={args:{context:"section",size:"lg",text:"Loading in dark mode...",description:"Please wait while we load your data"},parameters:{backgrounds:{default:"dark"}},decorators:[r=>e.jsx("div",{className:"dark h-64 bg-neutral-900 rounded-lg border border-neutral-700",children:e.jsx(r,{})})]},N={name:"❌ Old vs ✅ New Pattern",render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-base-error-600",children:"❌ Old Pattern (Avoid)"}),e.jsxs("div",{className:"border border-neutral-200 dark:border-neutral-700 rounded-lg h-48 p-4",children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 mb-2",children:"Not centered, inconsistent:"}),e.jsx("div",{className:"text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded",children:"<LoadingSpinner />"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-base-success-600",children:"✅ New Pattern (Use This)"}),e.jsxs("div",{className:"border border-neutral-200 dark:border-neutral-700 rounded-lg h-48",children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 p-2",children:"Properly centered, consistent:"}),e.jsx(k,{context:"section",className:"h-32"}),e.jsx("div",{className:"text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded-b-lg",children:'<LoadingElement context="section" />'})]})]})]})};var L,w,f;a.parameters={...a.parameters,docs:{...(L=a.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {}
}`,...(f=(w=a.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var j,z,P;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    context: 'page',
    size: 'lg',
    text: 'Loading page...',
    description: 'Please wait while we fetch your data'
  },
  parameters: {
    layout: 'fullscreen'
  }
}`,...(P=(z=t.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var D,E,C;s.parameters={...s.parameters,docs:{...(D=s.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'md'
  },
  decorators: [Story => <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...(C=(E=s.parameters)==null?void 0:E.docs)==null?void 0:C.source}}};var W,T,R;o.parameters={...o.parameters,docs:{...(W=o.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    context: 'card',
    size: 'md',
    text: 'Loading data...'
  },
  decorators: [Story => <div className="w-64 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                <Story />
            </div>]
}`,...(R=(T=o.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};var V,O,A;n.parameters={...n.parameters,docs:{...(V=n.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    context: 'inline',
    size: 'sm',
    text: 'Processing...'
  },
  render: args => <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-sm mb-2">Your request is being processed:</p>
            <LoadingElement {...args} />
        </div>
}`,...(A=(O=n.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var H,I,M;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'lg',
    text: 'Loading application data...'
  }
}`,...(M=(I=d.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var U,q,Y;i.parameters={...i.parameters,docs:{...(U=i.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'lg',
    text: 'Loading application',
    description: 'This may take a few moments. Please wait...'
  }
}`,...(Y=(q=i.parameters)==null?void 0:q.docs)==null?void 0:Y.source}}};var _,B,F;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    context: 'inline',
    text: 'Loading...'
  }
}`,...(F=(B=c.parameters)==null?void 0:B.docs)==null?void 0:F.source}}};var G,J,K;l.parameters={...l.parameters,docs:{...(G=l.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    size: 'md',
    context: 'section',
    text: 'Loading data...'
  },
  decorators: [Story => <div className="h-64 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Z;m.parameters={...m.parameters,docs:{...(Q=m.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    context: 'page',
    text: 'Loading application',
    description: 'Please wait...'
  }
}`,...(Z=(X=m.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var $,ee,re;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    size: 'xl',
    context: 'fullscreen',
    text: 'Initializing',
    description: 'Setting up your environment...'
  },
  parameters: {
    layout: 'fullscreen'
  }
}`,...(re=(ee=u.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var ae,te,se;g.parameters={...g.parameters,docs:{...(ae=g.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    context: 'section',
    text: 'Default loading'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...(se=(te=g.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var oe,ne,de;p.parameters={...p.parameters,docs:{...(oe=p.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    context: 'section',
    text: 'Processing successfully...'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...(de=(ne=p.parameters)==null?void 0:ne.docs)==null?void 0:de.source}}};var ie,ce,le;x.parameters={...x.parameters,docs:{...(ie=x.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    context: 'section',
    text: 'Retrying...'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...(le=(ce=x.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var me,ue,ge;b.parameters={...b.parameters,docs:{...(me=b.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    context: 'section',
    text: 'Processing with warnings...'
  },
  decorators: [Story => <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>]
}`,...(ge=(ue=b.parameters)==null?void 0:ue.docs)==null?void 0:ge.source}}};var pe,xe,be;h.parameters={...h.parameters,docs:{...(pe=h.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
}`,...(be=(xe=h.parameters)==null?void 0:xe.docs)==null?void 0:be.source}}};var he,ve,Se;v.parameters={...v.parameters,docs:{...(he=v.parameters)==null?void 0:he.docs,source:{originalSource:`{
  name: 'Dashboard Widget Loading',
  args: {
    context: 'card',
    size: 'md',
    text: 'Loading widget data...'
  },
  decorators: [Story => <div className="w-96 h-64 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <Story />
            </div>]
}`,...(Se=(ve=v.parameters)==null?void 0:ve.docs)==null?void 0:Se.source}}};var ye,Ne,ke;S.parameters={...S.parameters,docs:{...(ye=S.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  name: 'Header Loading',
  args: {
    context: 'inline',
    size: 'sm'
  },
  decorators: [Story => <header className="h-14 bg-neutral-0 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6">
                <Story />
            </header>]
}`,...(ke=(Ne=S.parameters)==null?void 0:Ne.docs)==null?void 0:ke.source}}};var Le,we,fe;y.parameters={...y.parameters,docs:{...(Le=y.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    context: 'section',
    size: 'lg',
    text: 'Loading in dark mode...',
    description: 'Please wait while we load your data'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark h-64 bg-neutral-900 rounded-lg border border-neutral-700">
                <Story />
            </div>]
}`,...(fe=(we=y.parameters)==null?void 0:we.docs)==null?void 0:fe.source}}};var je,ze,Pe;N.parameters={...N.parameters,docs:{...(je=N.parameters)==null?void 0:je.docs,source:{originalSource:`{
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
}`,...(Pe=(ze=N.parameters)==null?void 0:ze.docs)==null?void 0:Pe.source}}};const Ae=["Default","PageContext","SectionContext","CardContext","InlineContext","WithText","WithTextAndDescription","SmallSize","MediumSize","LargeSize","ExtraLargeSize","DefaultVariant","SuccessVariant","ErrorVariant","WarningVariant","RSEDetailsLoading","DashboardWidgetLoading","HeaderLoading","DarkMode","ComparisonWithOldPattern"];export{o as CardContext,N as ComparisonWithOldPattern,y as DarkMode,v as DashboardWidgetLoading,a as Default,g as DefaultVariant,x as ErrorVariant,u as ExtraLargeSize,S as HeaderLoading,n as InlineContext,m as LargeSize,l as MediumSize,t as PageContext,h as RSEDetailsLoading,s as SectionContext,c as SmallSize,p as SuccessVariant,b as WarningVariant,d as WithText,i as WithTextAndDescription,Ae as __namedExportsOrder,Oe as default};
