import{j as d}from"./iframe-CbZ9RuD1.js";import{L as re}from"./LoadingPage-BNusrsIT.js";import"./preload-helper-Dp1pzeXC.js";import"./PageContainer-BuffACpx.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./RucioLogo-je1npqWy.js";import"./LoadingSpinner-DNn-SVom.js";import"./Heading-BBK5GD02.js";import"./list-toasts-CqaY5F_J.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";import"./useToast-YXabfrDf.js";import"./proxy-vEXAzVUV.js";import"./use-reduced-motion-CgJySeb8.js";const Le={title:"Pages/System/LoadingPage",component:re,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{message:{control:"text",description:"Loading message to display"},logoSize:{control:{type:"range",min:50,max:300,step:10},description:"Size of the Rucio logo"},spinnerSize:{control:"select",options:["sm","default","md","lg","xl"],description:"Size of the loading spinner"},showOrbitAnimation:{control:"boolean",description:"Whether to show animated orbit effects"}}},e={args:{message:"Loading Rucio WebUI...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0}},o={args:{message:"Loading your data...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0}},r={args:{message:"Loading Rucio WebUI...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!1}},s={args:{message:"Loading...",logoSize:100,spinnerSize:"lg",showOrbitAnimation:!0}},a={args:{message:"Loading Rucio WebUI...",logoSize:200,spinnerSize:"xl",showOrbitAnimation:!0}},i={args:{message:"Loading Rucio WebUI...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0},parameters:{backgrounds:{default:"dark"}},decorators:[oe=>d.jsx("div",{className:"dark",children:d.jsx(oe,{})})]},n={args:{message:"Loading dashboard...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0}},t={args:{message:"Fetching datasets...",logoSize:120,spinnerSize:"lg",showOrbitAnimation:!0}},m={args:{message:"Loading...",logoSize:80,spinnerSize:"md",showOrbitAnimation:!1}};var c,g,p,l,u;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(p=(g=e.parameters)==null?void 0:g.docs)==null?void 0:p.source},description:{story:"Default loading page with animated orbit effects",...(u=(l=e.parameters)==null?void 0:l.docs)==null?void 0:u.description}}};var S,z,b,h,L;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    message: 'Loading your data...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(b=(z=o.parameters)==null?void 0:z.docs)==null?void 0:b.source},description:{story:"Loading page with custom message",...(L=(h=o.parameters)==null?void 0:h.docs)==null?void 0:L.description}}};var f,w,O,x,A;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: false
  }
}`,...(O=(w=r.parameters)==null?void 0:w.docs)==null?void 0:O.source},description:{story:"Simple loading without orbit animations",...(A=(x=r.parameters)==null?void 0:x.docs)==null?void 0:A.description}}};var y,W,R,k,I;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    message: 'Loading...',
    logoSize: 100,
    spinnerSize: 'lg',
    showOrbitAnimation: true
  }
}`,...(R=(W=s.parameters)==null?void 0:W.docs)==null?void 0:R.source},description:{story:"Loading page with smaller logo and spinner",...(I=(k=s.parameters)==null?void 0:k.docs)==null?void 0:I.description}}};var U,D,M,j,C;a.parameters={...a.parameters,docs:{...(U=a.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 200,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(M=(D=a.parameters)==null?void 0:D.docs)==null?void 0:M.source},description:{story:"Loading page with larger elements and full animations",...(C=(j=a.parameters)==null?void 0:j.docs)==null?void 0:C.description}}};var F,v,P,E,N;i.parameters={...i.parameters,docs:{...(F=i.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>]
}`,...(P=(v=i.parameters)==null?void 0:v.docs)==null?void 0:P.source},description:{story:"Loading page in dark mode with full animations",...(N=(E=i.parameters)==null?void 0:E.docs)==null?void 0:N.description}}};var _,T,q,B,G;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    message: 'Loading dashboard...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(q=(T=n.parameters)==null?void 0:T.docs)==null?void 0:q.source},description:{story:"Loading page for specific features",...(G=(B=n.parameters)==null?void 0:B.docs)==null?void 0:G.description}}};var H,J,K,Q,V;t.parameters={...t.parameters,docs:{...(H=t.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    message: 'Fetching datasets...',
    logoSize: 120,
    spinnerSize: 'lg',
    showOrbitAnimation: true
  }
}`,...(K=(J=t.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Loading page for data operations",...(V=(Q=t.parameters)==null?void 0:Q.docs)==null?void 0:V.description}}};var X,Y,Z,$,ee;m.parameters={...m.parameters,docs:{...(X=m.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    message: 'Loading...',
    logoSize: 80,
    spinnerSize: 'md',
    showOrbitAnimation: false
  }
}`,...(Z=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Minimal loading state without orbit effects",...(ee=($=m.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};const fe=["Default","CustomMessage","WithoutOrbitAnimation","Compact","Large","DarkMode","FeatureLoading","DataLoading","Minimal"];export{s as Compact,o as CustomMessage,i as DarkMode,t as DataLoading,e as Default,n as FeatureLoading,a as Large,m as Minimal,r as WithoutOrbitAnimation,fe as __namedExportsOrder,Le as default};
