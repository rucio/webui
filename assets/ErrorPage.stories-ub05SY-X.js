import{r as Se,j as e}from"./iframe-CbZ9RuD1.js";import{L as Ee}from"./link-CLCsOSg8.js";import{P as Le}from"./PageContainer-BuffACpx.js";import{S as Me}from"./Section-CsFqdCyz.js";import{R as Ue}from"./RucioLogo-je1npqWy.js";import{H as Te}from"./Heading-BBK5GD02.js";import{B as x}from"./button-CTUPBRYB.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./list-toasts-CqaY5F_J.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";import"./useToast-YXabfrDf.js";const p=Se.forwardRef(({heading:g="Something went wrong",errorMessage:we="An unexpected error occurred while processing your request.",errorDigest:m,onRetry:h,returnUrl:ke="/dashboard",returnLabel:b="Return to Dashboard",logoSize:y=100,className:ve,helpText:f="If this error persists, please contact your system administrator or check the browser console for more details."},De)=>e.jsx(Le,{ref:De,centered:!0,className:`min-h-screen flex items-center justify-center ${ve||""}`,children:e.jsx(Me,{className:"max-w-2xl mx-auto text-center",role:"alert","aria-live":"assertive","aria-label":"Application error",children:e.jsxs("div",{className:"flex flex-col items-center space-y-6",children:[e.jsx(Ue,{width:y,height:y,className:"text-base-error-500 dark:text-base-error-400","aria-label":"Rucio Logo"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(Te,{text:g,size:"lg",className:"text-base-error-500 dark:text-base-error-400"}),e.jsx("p",{className:"text-base text-neutral-600 dark:text-neutral-400",children:we}),m&&e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-500 font-mono",children:["Error ID: ",m]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center mt-4",children:[h&&e.jsx(x,{variant:"default",size:"default",onClick:h,className:"w-full sm:w-auto","aria-label":"Try again and reload the page",children:"Try Again"}),e.jsx(Ee,{href:ke,className:"w-full sm:w-auto",children:e.jsx(x,{variant:"neutral",size:"default",className:"w-full","aria-label":b,children:b})})]}),f&&e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-500 mt-8",children:f})]})})}));p.displayName="ErrorPage";p.__docgenInfo={description:`ErrorPage component

A full-page error state with the Rucio logo, error message, and action buttons.
Used by Next.js error boundaries and can be used in Storybook for testing.

@component
@example
\`\`\`tsx
// Default usage
<ErrorPage errorMessage="Failed to load data" onRetry={() => window.location.reload()} />

// Custom heading and return URL
<ErrorPage
  heading="Network Error"
  errorMessage="Unable to connect to server"
  returnUrl="/home"
  returnLabel="Return to Home"
/>
\`\`\``,methods:[],displayName:"ErrorPage",props:{heading:{required:!1,tsType:{name:"string"},description:`Error heading text
@default "Something went wrong"`,defaultValue:{value:"'Something went wrong'",computed:!1}},errorMessage:{required:!1,tsType:{name:"string"},description:"Error message to display",defaultValue:{value:"'An unexpected error occurred while processing your request.'",computed:!1}},errorDigest:{required:!1,tsType:{name:"string"},description:"Error digest/ID for tracking"},onRetry:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:'Callback function when "Try Again" is clicked'},returnUrl:{required:!1,tsType:{name:"string"},description:`URL to navigate to when "Return" button is clicked
@default "/dashboard"`,defaultValue:{value:"'/dashboard'",computed:!1}},returnLabel:{required:!1,tsType:{name:"string"},description:`Label for the return button
@default "Return to Dashboard"`,defaultValue:{value:"'Return to Dashboard'",computed:!1}},logoSize:{required:!1,tsType:{name:"number"},description:`Size of the logo
@default 100`,defaultValue:{value:"100",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes for the container"},helpText:{required:!1,tsType:{name:"string"},description:"Help text to display at the bottom",defaultValue:{value:"'If this error persists, please contact your system administrator or check the browser console for more details.'",computed:!1}}}};const We={title:"Pages/System/ErrorPage",component:p,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{heading:{control:"text",description:"Error heading text"},errorMessage:{control:"text",description:"Error message to display"},errorDigest:{control:"text",description:"Error digest/ID for tracking"},onRetry:{action:"retry clicked",description:"Callback when Try Again is clicked"},returnUrl:{control:"text",description:"URL to navigate to when return button is clicked"},returnLabel:{control:"text",description:"Label for the return button"},logoSize:{control:{type:"range",min:50,max:200,step:10},description:"Size of the Rucio logo"},helpText:{control:"text",description:"Help text to display at the bottom"}}},r={args:{heading:"Something went wrong",errorMessage:"An unexpected error occurred while processing your request.",onRetry:()=>console.log("Retry clicked"),returnUrl:"/dashboard",returnLabel:"Return to Dashboard",logoSize:100}},o={args:{heading:"Something went wrong",errorMessage:"Failed to fetch data from the server.",errorDigest:"abc123xyz789",onRetry:()=>console.log("Retry clicked"),returnUrl:"/dashboard",returnLabel:"Return to Dashboard"}},t={args:{heading:"Network Error",errorMessage:"Unable to connect to the Rucio server. Please check your internet connection.",onRetry:()=>console.log("Retry clicked"),returnUrl:"/home",returnLabel:"Return to Home"}},a={args:{heading:"Authentication Failed",errorMessage:"Your session has expired. Please log in again to continue.",returnUrl:"/auth/login",returnLabel:"Go to Login"}},s={args:{heading:"Access Denied",errorMessage:"You don't have permission to access this resource.",returnUrl:"/dashboard",returnLabel:"Return to Dashboard"}},n={args:{heading:"Data Not Found",errorMessage:"The requested data could not be found. It may have been deleted or moved.",onRetry:()=>console.log("Retry clicked"),returnUrl:"/dashboard",returnLabel:"Return to Dashboard"}},i={args:{heading:"Server Error",errorMessage:"The server encountered an error while processing your request. Please try again later.",errorDigest:"srv-error-500-xyz",onRetry:()=>console.log("Retry clicked"),returnUrl:"/dashboard",returnLabel:"Return to Dashboard"}},c={args:{heading:"Something went wrong",errorMessage:"An unexpected error occurred.",onRetry:()=>console.log("Retry clicked"),helpText:"For assistance, please contact support@rucio.cern.ch or check our status page."}},d={args:{heading:"Something went wrong",errorMessage:"An unexpected error occurred while processing your request.",errorDigest:"dark-mode-123",onRetry:()=>console.log("Retry clicked"),returnUrl:"/dashboard",returnLabel:"Return to Dashboard"},parameters:{backgrounds:{default:"dark"}},decorators:[g=>e.jsx("div",{className:"dark",children:e.jsx(g,{})})]},l={args:{heading:"Page Unavailable",errorMessage:"This page is currently unavailable.",returnUrl:"/dashboard",returnLabel:"Return to Dashboard",helpText:""}},u={args:{heading:"Configuration Error",errorMessage:"The application encountered a configuration error. This might be due to missing environment variables, invalid configuration files, or incompatible settings. Please review your configuration and ensure all required settings are properly defined.",errorDigest:"config-err-001",onRetry:()=>console.log("Retry clicked"),returnUrl:"/dashboard",returnLabel:"Return to Dashboard"}};var R,w,k,v,D;r.parameters={...r.parameters,docs:{...(R=r.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'An unexpected error occurred while processing your request.',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard',
    logoSize: 100
  }
}`,...(k=(w=r.parameters)==null?void 0:w.docs)==null?void 0:k.source},description:{story:"Default error page with standard error message",...(D=(v=r.parameters)==null?void 0:v.docs)==null?void 0:D.description}}};var S,E,L,M,U;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'Failed to fetch data from the server.',
    errorDigest: 'abc123xyz789',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...(L=(E=o.parameters)==null?void 0:E.docs)==null?void 0:L.source},description:{story:"Error with error digest/ID",...(U=(M=o.parameters)==null?void 0:M.docs)==null?void 0:U.description}}};var T,N,P,q,A;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    heading: 'Network Error',
    errorMessage: 'Unable to connect to the Rucio server. Please check your internet connection.',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/home',
    returnLabel: 'Return to Home'
  }
}`,...(P=(N=t.parameters)==null?void 0:N.docs)==null?void 0:P.source},description:{story:"Network error",...(A=(q=t.parameters)==null?void 0:q.docs)==null?void 0:A.description}}};var j,z,C,F,H;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    heading: 'Authentication Failed',
    errorMessage: 'Your session has expired. Please log in again to continue.',
    returnUrl: '/auth/login',
    returnLabel: 'Go to Login'
  }
}`,...(C=(z=a.parameters)==null?void 0:z.docs)==null?void 0:C.source},description:{story:"Authentication error",...(H=(F=a.parameters)==null?void 0:F.docs)==null?void 0:H.description}}};var I,V,Y,_,B;s.parameters={...s.parameters,docs:{...(I=s.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    heading: 'Access Denied',
    errorMessage: "You don't have permission to access this resource.",
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...(Y=(V=s.parameters)==null?void 0:V.docs)==null?void 0:Y.source},description:{story:"Permission denied error",...(B=(_=s.parameters)==null?void 0:_.docs)==null?void 0:B.description}}};var G,W,O,$,J;n.parameters={...n.parameters,docs:{...(G=n.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    heading: 'Data Not Found',
    errorMessage: 'The requested data could not be found. It may have been deleted or moved.',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...(O=(W=n.parameters)==null?void 0:W.docs)==null?void 0:O.source},description:{story:"Data not found error",...(J=($=n.parameters)==null?void 0:$.docs)==null?void 0:J.description}}};var K,Q,X,Z,ee;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    heading: 'Server Error',
    errorMessage: 'The server encountered an error while processing your request. Please try again later.',
    errorDigest: 'srv-error-500-xyz',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...(X=(Q=i.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:"Server error",...(ee=(Z=i.parameters)==null?void 0:Z.docs)==null?void 0:ee.description}}};var re,oe,te,ae,se;c.parameters={...c.parameters,docs:{...(re=c.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'An unexpected error occurred.',
    onRetry: () => console.log('Retry clicked'),
    helpText: 'For assistance, please contact support@rucio.cern.ch or check our status page.'
  }
}`,...(te=(oe=c.parameters)==null?void 0:oe.docs)==null?void 0:te.source},description:{story:"Custom help text",...(se=(ae=c.parameters)==null?void 0:ae.docs)==null?void 0:se.description}}};var ne,ie,ce,de,le;d.parameters={...d.parameters,docs:{...(ne=d.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'An unexpected error occurred while processing your request.',
    errorDigest: 'dark-mode-123',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>]
}`,...(ce=(ie=d.parameters)==null?void 0:ie.docs)==null?void 0:ce.source},description:{story:"Error page in dark mode",...(le=(de=d.parameters)==null?void 0:de.docs)==null?void 0:le.description}}};var ue,ge,pe,me,he;l.parameters={...l.parameters,docs:{...(ue=l.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    heading: 'Page Unavailable',
    errorMessage: 'This page is currently unavailable.',
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard',
    helpText: ''
  }
}`,...(pe=(ge=l.parameters)==null?void 0:ge.docs)==null?void 0:pe.source},description:{story:"Minimal error (no retry button)",...(he=(me=l.parameters)==null?void 0:me.docs)==null?void 0:he.description}}};var be,ye,fe,xe,Re;u.parameters={...u.parameters,docs:{...(be=u.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    heading: 'Configuration Error',
    errorMessage: 'The application encountered a configuration error. This might be due to missing environment variables, invalid configuration files, or incompatible settings. Please review your configuration and ensure all required settings are properly defined.',
    errorDigest: 'config-err-001',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...(fe=(ye=u.parameters)==null?void 0:ye.docs)==null?void 0:fe.source},description:{story:"Error with longer message",...(Re=(xe=u.parameters)==null?void 0:xe.docs)==null?void 0:Re.description}}};const Oe=["Default","WithErrorDigest","NetworkError","AuthenticationError","PermissionDenied","NotFound","ServerError","CustomHelpText","DarkMode","MinimalError","LongErrorMessage"];export{a as AuthenticationError,c as CustomHelpText,d as DarkMode,r as Default,u as LongErrorMessage,l as MinimalError,t as NetworkError,n as NotFound,s as PermissionDenied,i as ServerError,o as WithErrorDigest,Oe as __namedExportsOrder,We as default};
