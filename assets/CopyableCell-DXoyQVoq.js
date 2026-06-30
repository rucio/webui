import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./utils-BlOR3gwo.js";import{I as i,rt as a}from"./index.esm-D2i2AtEp.js";import{i as o,n as s,r as c}from"./list-toasts-C2j1dmnX.js";import{r as l,t as u}from"./useToast-OUoBmcVg.js";var d,f,p,m=e((()=>{d=t(),a(),n(),u(),o(),f=({text:e,children:t,className:n,showIcon:a=!0})=>{let{toast:o}=l(),u=t=>{t.stopPropagation(),navigator.clipboard.writeText(e).then(()=>{o(s)}).catch(()=>{o(c)})};return(0,d.jsxs)(`div`,{className:r(`flex items-center gap-1 cursor-pointer`,n),onClick:u,onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),u(e))},role:`button`,tabIndex:0,children:[a&&(0,d.jsx)(i,{className:`flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200`}),t||(0,d.jsx)(`span`,{children:e})]})},p=({text:e,href:t,children:n,className:a,showIcon:o=!0})=>{let{toast:u}=l(),f=t=>{t.stopPropagation(),navigator.clipboard.writeText(e).then(()=>{u(s)}).catch(()=>{u(c)})};return(0,d.jsxs)(`div`,{className:r(`flex items-center gap-1`,a),children:[o&&(0,d.jsx)(i,{className:`flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer`,onClick:f,onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),e.stopPropagation(),f(e))},role:`button`,tabIndex:0,title:`Copy to clipboard`}),(0,d.jsx)(`div`,{className:`cursor-pointer hover:underline`,onClick:e=>{(e.target===e.currentTarget||e.target.tagName!==`svg`)&&window.open(t,`_blank`,`noopener,noreferrer`)},onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),window.open(t,`_blank`,`noopener,noreferrer`))},role:`button`,tabIndex:0,children:n||(0,d.jsx)(`span`,{children:e})})]})},f.__docgenInfo={description:`A table cell component that allows copying its content to clipboard on click.
Displays a copy icon and shows a toast notification when content is copied.

@example
\`\`\`tsx
<CopyableCell text="scope:dataset_name">
  scope:dataset_name
</CopyableCell>
\`\`\``,methods:[],displayName:`CopyableCell`,props:{text:{required:!0,tsType:{name:`string`},description:`The text to be copied to clipboard when clicked`},children:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:`Content to display in the cell. If not provided, the text prop will be displayed`},className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply to the cell container`},showIcon:{required:!1,tsType:{name:`boolean`},description:`Whether to show the copy icon. Defaults to true`,defaultValue:{value:`true`,computed:!1}}}},p.__docgenInfo={description:`A table cell component that combines copy-to-clipboard functionality with a clickable link.
The copy icon copies the text to clipboard, while clicking the content navigates to the href.

@example
\`\`\`tsx
<CopyableLinkCell
  text="scope:dataset_name"
  href="/did/scope/dataset_name"
>
  scope:dataset_name
</CopyableLinkCell>
\`\`\``,methods:[],displayName:`CopyableLinkCell`,props:{text:{required:!0,tsType:{name:`string`},description:`The text to be copied to clipboard when clicked`},children:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:`Content to display in the cell. If not provided, the text prop will be displayed`},className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply to the cell container`},showIcon:{required:!1,tsType:{name:`boolean`},description:`Whether to show the copy icon. Defaults to true`,defaultValue:{value:`true`,computed:!1}},href:{required:!0,tsType:{name:`string`},description:`The URL to navigate to when the link is clicked`}}}}));export{p as n,m as r,f as t};