import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./utils-BlOR3gwo.js";import{n as i,t as a}from"./dist-Bwk7AIxR.js";import{n as o,t as s}from"./LoadingSpinner-BvKB7cky.js";var c,l,u,d=e((()=>{c=t(),i(),n(),o(),l=a(`flex items-center justify-center`,{variants:{context:{page:`min-h-screen w-full`,section:`w-full h-full min-h-[20rem]`,card:`w-full h-32`,inline:`inline-flex`,fullscreen:`h-screen w-screen`},withText:{true:`flex-col gap-4`,false:``}},defaultVariants:{context:`section`,withText:!1}}),u=({className:e,context:t,withText:n,size:i=`md`,variant:a=`default`,text:o,description:u,...d})=>{let f=!!(o||u);return(0,c.jsxs)(`div`,{className:r(l({context:t,withText:f||n}),e),role:`status`,"aria-live":`polite`,...d,children:[(0,c.jsx)(s,{size:i,variant:a}),f&&(0,c.jsxs)(`div`,{className:`text-center space-y-1`,children:[o&&(0,c.jsx)(`p`,{className:`text-sm font-medium text-neutral-900 dark:text-neutral-100`,children:o}),u&&(0,c.jsx)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400`,children:u})]})]})},u.__docgenInfo={description:`LoadingElement - A properly centered loading indicator

This component wraps LoadingSpinner with appropriate centering for different contexts.
Use this instead of using LoadingSpinner directly to ensure consistent loading states
across the application.

@example
\`\`\`tsx
// Full page loading
<LoadingElement context="page" text="Loading data..." />

// Section/card loading
<LoadingElement context="section" size="lg" />

// Inline loading
<LoadingElement context="inline" size="sm" text="Processing..." />
\`\`\``,methods:[],displayName:`LoadingElement`,props:{size:{required:!1,tsType:{name:`union`,raw:`'sm' | 'md' | 'lg' | 'xl'`,elements:[{name:`literal`,value:`'sm'`},{name:`literal`,value:`'md'`},{name:`literal`,value:`'lg'`},{name:`literal`,value:`'xl'`}]},description:`Size of the spinner`,defaultValue:{value:`'md'`,computed:!1}},variant:{required:!1,tsType:{name:`union`,raw:`'default' | 'neutral' | 'success' | 'error' | 'warning'`,elements:[{name:`literal`,value:`'default'`},{name:`literal`,value:`'neutral'`},{name:`literal`,value:`'success'`},{name:`literal`,value:`'error'`},{name:`literal`,value:`'warning'`}]},description:`Variant/color of the spinner`,defaultValue:{value:`'default'`,computed:!1}},text:{required:!1,tsType:{name:`string`},description:`Text to display below the spinner`},description:{required:!1,tsType:{name:`string`},description:`Description text to display below the main text`}},composes:[`VariantProps`]}}));export{d as n,u as t};