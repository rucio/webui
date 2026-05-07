import{j as g}from"./iframe-CW9-_HYS.js";import{L as se}from"./LoadingPage-ByumdYXa.js";import"./preload-helper-Dp1pzeXC.js";import"./PageContainer-jwogDXZ6.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./RucioLogo-CJgKc0dy.js";import"./LoadingSpinner-Blb2vFxO.js";import"./Heading-CuhxiBzz.js";import"./list-toasts-CqaY5F_J.js";import"./index.esm-DWUw-EzS.js";import"./iconBase-_tCx069T.js";import"./useToast-CidfTvTK.js";import"./proxy-0TP5XkBx.js";import"./use-reduced-motion-CGditCrG.js";const Le={title:"Pages/System/LoadingPage",component:se,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{message:{control:"text",description:"Loading message to display"},logoSize:{control:{type:"range",min:50,max:300,step:10},description:"Size of the Rucio logo"},spinnerSize:{control:"select",options:["sm","default","md","lg","xl"],description:"Size of the loading spinner"},showOrbitAnimation:{control:"boolean",description:"Whether to show animated orbit effects"}}},e={args:{message:"Loading Rucio WebUI...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0}},o={args:{message:"Loading your data...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0}},s={args:{message:"Loading Rucio WebUI...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!1}},r={args:{message:"Loading...",logoSize:100,spinnerSize:"lg",showOrbitAnimation:!0}},a={args:{message:"Loading Rucio WebUI...",logoSize:200,spinnerSize:"xl",showOrbitAnimation:!0}},i={args:{message:"Loading Rucio WebUI...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0},decorators:[oe=>g.jsx("div",{className:"dark",children:g.jsx(oe,{})})],globals:{backgrounds:{value:"dark"}}},n={args:{message:"Loading dashboard...",logoSize:146,spinnerSize:"xl",showOrbitAnimation:!0}},t={args:{message:"Fetching datasets...",logoSize:120,spinnerSize:"lg",showOrbitAnimation:!0}},m={args:{message:"Loading...",logoSize:80,spinnerSize:"md",showOrbitAnimation:!1}};var c,d,p,l,u;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(p=(d=e.parameters)==null?void 0:d.docs)==null?void 0:p.source},description:{story:"Default loading page with animated orbit effects",...(u=(l=e.parameters)==null?void 0:l.docs)==null?void 0:u.description}}};var S,b,z,h,L;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    message: 'Loading your data...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(z=(b=o.parameters)==null?void 0:b.docs)==null?void 0:z.source},description:{story:"Loading page with custom message",...(L=(h=o.parameters)==null?void 0:h.docs)==null?void 0:L.description}}};var w,f,O,x,A;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: false
  }
}`,...(O=(f=s.parameters)==null?void 0:f.docs)==null?void 0:O.source},description:{story:"Simple loading without orbit animations",...(A=(x=s.parameters)==null?void 0:x.docs)==null?void 0:A.description}}};var y,W,R,k,I;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    message: 'Loading...',
    logoSize: 100,
    spinnerSize: 'lg',
    showOrbitAnimation: true
  }
}`,...(R=(W=r.parameters)==null?void 0:W.docs)==null?void 0:R.source},description:{story:"Loading page with smaller logo and spinner",...(I=(k=r.parameters)==null?void 0:k.docs)==null?void 0:I.description}}};var U,D,M,v,j;a.parameters={...a.parameters,docs:{...(U=a.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 200,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...(M=(D=a.parameters)==null?void 0:D.docs)==null?void 0:M.source},description:{story:"Loading page with larger elements and full animations",...(j=(v=a.parameters)==null?void 0:v.docs)==null?void 0:j.description}}};var C,F,P,E,N;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...(P=(F=i.parameters)==null?void 0:F.docs)==null?void 0:P.source},description:{story:"Loading page in dark mode with full animations",...(N=(E=i.parameters)==null?void 0:E.docs)==null?void 0:N.description}}};var _,T,q,B,G;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(Z=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Minimal loading state without orbit effects",...(ee=($=m.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};const we=["Default","CustomMessage","WithoutOrbitAnimation","Compact","Large","DarkMode","FeatureLoading","DataLoading","Minimal"];export{r as Compact,o as CustomMessage,i as DarkMode,t as DataLoading,e as Default,n as FeatureLoading,a as Large,m as Minimal,s as WithoutOrbitAnimation,we as __namedExportsOrder,Le as default};
