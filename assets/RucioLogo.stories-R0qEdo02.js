import{j as e}from"./iframe-CbZ9RuD1.js";import{R as t}from"./RucioLogo-je1npqWy.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";const we={title:"Atoms/Branding/RucioLogo",component:t,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"number",min:50,max:500,step:10},description:"Width of the logo in pixels"},height:{control:{type:"number",min:50,max:500,step:10},description:"Height of the logo in pixels"},className:{control:"text",description:"Additional CSS classes (use text-* for color)"}}},a={args:{className:"text-neutral-900"}},r={args:{className:"text-neutral-900",width:194,height:194},parameters:{backgrounds:{default:"light"}}},s={args:{className:"text-neutral-100",width:194,height:194},parameters:{backgrounds:{default:"dark"}}},n={args:{className:"text-neutral-900 dark:text-neutral-100",width:194,height:194},render:pe=>e.jsxs("div",{className:"p-8 rounded-lg bg-neutral-50 dark:bg-neutral-900",children:[e.jsx(t,{...pe}),e.jsx("p",{className:"mt-4 text-sm text-neutral-700 dark:text-neutral-300 text-center",children:"Toggle theme to see the logo adapt"})]})},o={args:{className:"text-neutral-900 dark:text-neutral-100",width:146,height:146}},i={args:{className:"text-neutral-900 dark:text-neutral-100",width:90,height:90}},c={args:{className:"text-neutral-900 dark:text-neutral-100",width:48,height:48}},d={args:{className:"text-brand-500",width:146,height:146},parameters:{backgrounds:{default:"light"}}},l={args:{className:"text-base-error-600",width:146,height:146}},m={render:()=>e.jsxs("div",{className:"space-y-8 p-8",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium text-neutral-700 dark:text-neutral-300",children:"Mobile (120x120)"}),e.jsx(t,{className:"text-neutral-900 dark:text-neutral-100",width:120,height:120})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium text-neutral-700 dark:text-neutral-300",children:"Tablet/Desktop (146x146)"}),e.jsx(t,{className:"text-neutral-900 dark:text-neutral-100",width:146,height:146})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium text-neutral-700 dark:text-neutral-300",children:"Large (194x194)"}),e.jsx(t,{className:"text-neutral-900 dark:text-neutral-100",width:194,height:194})]})]})},u={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{className:"flex flex-col items-center p-8 bg-neutral-50 rounded-lg",children:[e.jsx(t,{className:"text-neutral-900",width:146,height:146}),e.jsx("p",{className:"mt-4 text-sm text-neutral-700 font-medium",children:"Light Theme"})]}),e.jsxs("div",{className:"flex flex-col items-center p-8 bg-neutral-900 rounded-lg",children:[e.jsx(t,{className:"text-neutral-100",width:146,height:146}),e.jsx("p",{className:"mt-4 text-sm text-neutral-300 font-medium",children:"Dark Theme"})]})]})};var h,p,g,x,N;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-900'
  }
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source},description:{story:"Default RucioLogo with standard sizing (194x194)",...(N=(x=a.parameters)==null?void 0:x.docs)==null?void 0:N.description}}};var k,f,w,v,b;r.parameters={...r.parameters,docs:{...(k=r.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-900',
    width: 194,
    height: 194
  },
  parameters: {
    backgrounds: {
      default: 'light'
    }
  }
}`,...(w=(f=r.parameters)==null?void 0:f.docs)==null?void 0:w.source},description:{story:"Logo for light theme (dark fill)",...(b=(v=r.parameters)==null?void 0:v.docs)==null?void 0:b.description}}};var S,y,L,j,T;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-100',
    width: 194,
    height: 194
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(L=(y=s.parameters)==null?void 0:y.docs)==null?void 0:L.source},description:{story:"Logo for dark theme (light fill)",...(T=(j=s.parameters)==null?void 0:j.docs)==null?void 0:T.description}}};var R,z,D,C,A;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 194,
    height: 194
  },
  render: args => <div className="p-8 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <RucioLogo {...args} />
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 text-center">Toggle theme to see the logo adapt</p>
        </div>
}`,...(D=(z=n.parameters)==null?void 0:z.docs)==null?void 0:D.source},description:{story:"Theme-aware logo using Tailwind dark mode classes",...(A=(C=n.parameters)==null?void 0:C.docs)==null?void 0:A.description}}};var E,B,H,M,P;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 146,
    height: 146
  }
}`,...(H=(B=o.parameters)==null?void 0:B.docs)==null?void 0:H.source},description:{story:"Small logo (ideal for login page - 146x146)",...(P=(M=o.parameters)==null?void 0:M.docs)==null?void 0:P.description}}};var _,O,W,q,F;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 90,
    height: 90
  }
}`,...(W=(O=i.parameters)==null?void 0:O.docs)==null?void 0:W.source},description:{story:"Medium logo (common header size)",...(F=(q=i.parameters)==null?void 0:q.docs)==null?void 0:F.description}}};var G,I,J,K,Q;c.parameters={...c.parameters,docs:{...(G=c.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    className: 'text-neutral-900 dark:text-neutral-100',
    width: 48,
    height: 48
  }
}`,...(J=(I=c.parameters)==null?void 0:I.docs)==null?void 0:J.source},description:{story:"Small logo (compact navigation)",...(Q=(K=c.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var U,V,X,Y,Z;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    className: 'text-brand-500',
    width: 146,
    height: 146
  },
  parameters: {
    backgrounds: {
      default: 'light'
    }
  }
}`,...(X=(V=d.parameters)==null?void 0:V.docs)==null?void 0:X.source},description:{story:"Logo with custom brand color",...(Z=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var $,ee,te,ae,re;l.parameters={...l.parameters,docs:{...($=l.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    className: 'text-base-error-600',
    width: 146,
    height: 146
  }
}`,...(te=(ee=l.parameters)==null?void 0:ee.docs)==null?void 0:te.source},description:{story:"Logo with error color (for error states)",...(re=(ae=l.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var se,ne,oe,ie,ce;m.parameters={...m.parameters,docs:{...(se=m.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-8">
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Mobile (120x120)</h3>
                <RucioLogo className="text-neutral-900 dark:text-neutral-100" width={120} height={120} />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tablet/Desktop (146x146)</h3>
                <RucioLogo className="text-neutral-900 dark:text-neutral-100" width={146} height={146} />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Large (194x194)</h3>
                <RucioLogo className="text-neutral-900 dark:text-neutral-100" width={194} height={194} />
            </div>
        </div>
}`,...(oe=(ne=m.parameters)==null?void 0:ne.docs)==null?void 0:oe.source},description:{story:"Responsive logo sizes comparison",...(ce=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:ce.description}}};var de,le,me,ue,he;u.parameters={...u.parameters,docs:{...(de=u.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-8">
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
}`,...(me=(le=u.parameters)==null?void 0:le.docs)==null?void 0:me.source},description:{story:"Light vs Dark comparison",...(he=(ue=u.parameters)==null?void 0:ue.docs)==null?void 0:he.description}}};const ve=["Default","LightTheme","DarkTheme","ThemeAware","LoginPageSize","HeaderSize","CompactSize","BrandColor","ErrorState","ResponsiveSizes","ThemeComparison"];export{d as BrandColor,c as CompactSize,s as DarkTheme,a as Default,l as ErrorState,i as HeaderSize,r as LightTheme,o as LoginPageSize,m as ResponsiveSizes,n as ThemeAware,u as ThemeComparison,ve as __namedExportsOrder,we as default};
