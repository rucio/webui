import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Kt as n,bt as r}from"./iframe-C47sd5GD.js";import{n as i,t as a}from"./RucioLogo-Deih0VEv.js";import{n as o,t as s}from"./button-CuJSqrUQ.js";import{n as c,r as l}from"./Heading-Bfo-tNbb.js";import{t as u}from"./link-DMY69hqT.js";import{n as d,t as f}from"./PageContainer-D-BGL4pS.js";import{n as p,t as m}from"./Section-Bc761S0j.js";var h,g,_,v,y=e((()=>{h=r(),g=t(n()),_=t(u()),d(),p(),i(),l(),o(),v=g.forwardRef(({heading:e=`Something went wrong`,errorMessage:t=`An unexpected error occurred while processing your request.`,errorDigest:n,onRetry:r,returnUrl:i=`/dashboard`,returnLabel:o=`Return to Dashboard`,logoSize:l=100,className:u,helpText:d=`If this error persists, please contact your system administrator or check the browser console for more details.`},p)=>(0,h.jsx)(f,{ref:p,centered:!0,className:`min-h-screen flex items-center justify-center ${u||``}`,children:(0,h.jsx)(m,{className:`max-w-2xl mx-auto text-center`,role:`alert`,"aria-live":`assertive`,"aria-label":`Application error`,children:(0,h.jsxs)(`div`,{className:`flex flex-col items-center space-y-6`,children:[(0,h.jsx)(a,{width:l,height:l,className:`text-base-error-500 dark:text-base-error-400`,"aria-label":`Rucio Logo`}),(0,h.jsxs)(`div`,{className:`space-y-2`,children:[(0,h.jsx)(c,{text:e,size:`lg`,className:`text-base-error-500 dark:text-base-error-400`}),(0,h.jsx)(`p`,{className:`text-base text-neutral-600 dark:text-neutral-400`,children:t}),n&&(0,h.jsxs)(`p`,{className:`text-sm text-neutral-500 dark:text-neutral-500 font-mono`,children:[`Error ID: `,n]})]}),(0,h.jsxs)(`div`,{className:`flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center mt-4`,children:[r&&(0,h.jsx)(s,{variant:`default`,size:`default`,onClick:r,className:`w-full sm:w-auto`,"aria-label":`Try again and reload the page`,children:`Try Again`}),(0,h.jsx)(_.default,{href:i,className:`w-full sm:w-auto`,children:(0,h.jsx)(s,{variant:`neutral`,size:`default`,className:`w-full`,"aria-label":o,children:o})})]}),d&&(0,h.jsx)(`p`,{className:`text-sm text-neutral-500 dark:text-neutral-500 mt-8`,children:d})]})})})),v.displayName=`ErrorPage`,v.__docgenInfo={description:`ErrorPage component

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
\`\`\``,methods:[],displayName:`ErrorPage`,props:{heading:{required:!1,tsType:{name:`string`},description:`Error heading text
@default "Something went wrong"`,defaultValue:{value:`'Something went wrong'`,computed:!1}},errorMessage:{required:!1,tsType:{name:`string`},description:`Error message to display`,defaultValue:{value:`'An unexpected error occurred while processing your request.'`,computed:!1}},errorDigest:{required:!1,tsType:{name:`string`},description:`Error digest/ID for tracking`},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Callback function when "Try Again" is clicked`},returnUrl:{required:!1,tsType:{name:`string`},description:`URL to navigate to when "Return" button is clicked
@default "/dashboard"`,defaultValue:{value:`'/dashboard'`,computed:!1}},returnLabel:{required:!1,tsType:{name:`string`},description:`Label for the return button
@default "Return to Dashboard"`,defaultValue:{value:`'Return to Dashboard'`,computed:!1}},logoSize:{required:!1,tsType:{name:`number`},description:`Size of the logo
@default 100`,defaultValue:{value:`100`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes for the container`},helpText:{required:!1,tsType:{name:`string`},description:`Help text to display at the bottom`,defaultValue:{value:`'If this error persists, please contact your system administrator or check the browser console for more details.'`,computed:!1}}}}})),b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{b=r(),y(),x={title:`Pages/System/ErrorPage`,component:v,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{heading:{control:`text`,description:`Error heading text`},errorMessage:{control:`text`,description:`Error message to display`},errorDigest:{control:`text`,description:`Error digest/ID for tracking`},onRetry:{action:`retry clicked`,description:`Callback when Try Again is clicked`},returnUrl:{control:`text`,description:`URL to navigate to when return button is clicked`},returnLabel:{control:`text`,description:`Label for the return button`},logoSize:{control:{type:`range`,min:50,max:200,step:10},description:`Size of the Rucio logo`},helpText:{control:`text`,description:`Help text to display at the bottom`}}},S={args:{heading:`Something went wrong`,errorMessage:`An unexpected error occurred while processing your request.`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`,logoSize:100}},C={args:{heading:`Something went wrong`,errorMessage:`Failed to fetch data from the server.`,errorDigest:`abc123xyz789`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`}},w={args:{heading:`Network Error`,errorMessage:`Unable to connect to the Rucio server. Please check your internet connection.`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/home`,returnLabel:`Return to Home`}},T={args:{heading:`Authentication Failed`,errorMessage:`Your session has expired. Please log in again to continue.`,returnUrl:`/auth/login`,returnLabel:`Go to Login`}},E={args:{heading:`Access Denied`,errorMessage:`You don't have permission to access this resource.`,returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`}},D={args:{heading:`Data Not Found`,errorMessage:`The requested data could not be found. It may have been deleted or moved.`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`}},O={args:{heading:`Server Error`,errorMessage:`The server encountered an error while processing your request. Please try again later.`,errorDigest:`srv-error-500-xyz`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`}},k={args:{heading:`Something went wrong`,errorMessage:`An unexpected error occurred.`,onRetry:()=>console.log(`Retry clicked`),helpText:`For assistance, please contact support@rucio.cern.ch or check our status page.`}},A={args:{heading:`Something went wrong`,errorMessage:`An unexpected error occurred while processing your request.`,errorDigest:`dark-mode-123`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`},decorators:[e=>(0,b.jsx)(`div`,{className:`dark`,children:(0,b.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},j={args:{heading:`Page Unavailable`,errorMessage:`This page is currently unavailable.`,returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`,helpText:``}},M={args:{heading:`Configuration Error`,errorMessage:`The application encountered a configuration error. This might be due to missing environment variables, invalid configuration files, or incompatible settings. Please review your configuration and ensure all required settings are properly defined.`,errorDigest:`config-err-001`,onRetry:()=>console.log(`Retry clicked`),returnUrl:`/dashboard`,returnLabel:`Return to Dashboard`}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'An unexpected error occurred while processing your request.',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard',
    logoSize: 100
  }
}`,...S.parameters?.docs?.source},description:{story:`Default error page with standard error message`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'Failed to fetch data from the server.',
    errorDigest: 'abc123xyz789',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...C.parameters?.docs?.source},description:{story:`Error with error digest/ID`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Network Error',
    errorMessage: 'Unable to connect to the Rucio server. Please check your internet connection.',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/home',
    returnLabel: 'Return to Home'
  }
}`,...w.parameters?.docs?.source},description:{story:`Network error`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Authentication Failed',
    errorMessage: 'Your session has expired. Please log in again to continue.',
    returnUrl: '/auth/login',
    returnLabel: 'Go to Login'
  }
}`,...T.parameters?.docs?.source},description:{story:`Authentication error`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Access Denied',
    errorMessage: "You don't have permission to access this resource.",
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...E.parameters?.docs?.source},description:{story:`Permission denied error`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Data Not Found',
    errorMessage: 'The requested data could not be found. It may have been deleted or moved.',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...D.parameters?.docs?.source},description:{story:`Data not found error`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Server Error',
    errorMessage: 'The server encountered an error while processing your request. Please try again later.',
    errorDigest: 'srv-error-500-xyz',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...O.parameters?.docs?.source},description:{story:`Server error`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'An unexpected error occurred.',
    onRetry: () => console.log('Retry clicked'),
    helpText: 'For assistance, please contact support@rucio.cern.ch or check our status page.'
  }
}`,...k.parameters?.docs?.source},description:{story:`Custom help text`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Something went wrong',
    errorMessage: 'An unexpected error occurred while processing your request.',
    errorDigest: 'dark-mode-123',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...A.parameters?.docs?.source},description:{story:`Error page in dark mode`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Page Unavailable',
    errorMessage: 'This page is currently unavailable.',
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard',
    helpText: ''
  }
}`,...j.parameters?.docs?.source},description:{story:`Minimal error (no retry button)`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Configuration Error',
    errorMessage: 'The application encountered a configuration error. This might be due to missing environment variables, invalid configuration files, or incompatible settings. Please review your configuration and ensure all required settings are properly defined.',
    errorDigest: 'config-err-001',
    onRetry: () => console.log('Retry clicked'),
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard'
  }
}`,...M.parameters?.docs?.source},description:{story:`Error with longer message`,...M.parameters?.docs?.description}}},N=[`Default`,`WithErrorDigest`,`NetworkError`,`AuthenticationError`,`PermissionDenied`,`NotFound`,`ServerError`,`CustomHelpText`,`DarkMode`,`MinimalError`,`LongErrorMessage`]}))();export{T as AuthenticationError,k as CustomHelpText,A as DarkMode,S as Default,M as LongErrorMessage,j as MinimalError,w as NetworkError,D as NotFound,E as PermissionDenied,O as ServerError,C as WithErrorDigest,N as __namedExportsOrder,x as default};