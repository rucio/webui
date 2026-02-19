import{j as e}from"./iframe-CbZ9RuD1.js";import{c as d}from"./index-DSpI4bVK.js";import{c as m}from"./utils-DsKtx5Xo.js";import{L as u}from"./LoadingSpinner-DNn-SVom.js";const p=d("flex items-center justify-center",{variants:{context:{page:"min-h-screen w-full",section:"w-full h-full min-h-[20rem]",card:"w-full h-32",inline:"inline-flex",fullscreen:"h-screen w-screen"},withText:{true:"flex-col gap-4",false:""}},defaultVariants:{context:"section",withText:!1}}),x=({className:l,context:i,withText:s,size:r="md",variant:o="default",text:n,description:t,...c})=>{const a=!!(n||t);return e.jsxs("div",{className:m(p({context:i,withText:a||s}),l),role:"status","aria-live":"polite",...c,children:[e.jsx(u,{size:r,variant:o}),a&&e.jsxs("div",{className:"text-center space-y-1",children:[n&&e.jsx("p",{className:"text-sm font-medium text-neutral-900 dark:text-neutral-100",children:n}),t&&e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:t})]})]})};x.__docgenInfo={description:`LoadingElement - A properly centered loading indicator

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
\`\`\``,methods:[],displayName:"LoadingElement",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},description:"Size of the spinner",defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'neutral' | 'success' | 'error' | 'warning'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'neutral'"},{name:"literal",value:"'success'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:"Variant/color of the spinner",defaultValue:{value:"'default'",computed:!1}},text:{required:!1,tsType:{name:"string"},description:"Text to display below the spinner"},description:{required:!1,tsType:{name:"string"},description:"Description text to display below the main text"}},composes:["VariantProps"]};export{x as L};
