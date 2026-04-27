import{j as n}from"./iframe-CW9-_HYS.js";import{f as p}from"./index.esm-DWUw-EzS.js";import{c as d}from"./utils-DsKtx5Xo.js";import{u as h}from"./useToast-CidfTvTK.js";import{c as u,e as y}from"./list-toasts-CqaY5F_J.js";const x=({text:o,children:r,className:l,showIcon:c=!0})=>{const{toast:i}=h(),a=t=>{t.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{i(u)}).catch(()=>{i(y)})},s=t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),a(t))};return n.jsxs("div",{className:d("flex items-center gap-1 cursor-pointer",l),onClick:a,onKeyDown:s,role:"button",tabIndex:0,children:[c&&n.jsx(p,{className:"flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"}),r||n.jsx("span",{children:o})]})},b=({text:o,href:r,children:l,className:c,showIcon:i=!0})=>{const{toast:a}=h(),s=e=>{e.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{a(u)}).catch(()=>{a(y)})},t=e=>{(e.target===e.currentTarget||e.target.tagName!=="svg")&&window.open(r,"_blank","noopener,noreferrer")},m=e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.stopPropagation(),s(e))},f=e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),window.open(r,"_blank","noopener,noreferrer"))};return n.jsxs("div",{className:d("flex items-center gap-1",c),children:[i&&n.jsx(p,{className:"flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer",onClick:s,onKeyDown:m,role:"button",tabIndex:0,title:"Copy to clipboard"}),n.jsx("div",{className:"cursor-pointer hover:underline",onClick:t,onKeyDown:f,role:"button",tabIndex:0,children:l||n.jsx("span",{children:o})})]})};x.__docgenInfo={description:`A table cell component that allows copying its content to clipboard on click.
Displays a copy icon and shows a toast notification when content is copied.

@example
\`\`\`tsx
<CopyableCell text="scope:dataset_name">
  scope:dataset_name
</CopyableCell>
\`\`\``,methods:[],displayName:"CopyableCell",props:{text:{required:!0,tsType:{name:"string"},description:"The text to be copied to clipboard when clicked"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to display in the cell. If not provided, the text prop will be displayed"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes to apply to the cell container"},showIcon:{required:!1,tsType:{name:"boolean"},description:"Whether to show the copy icon. Defaults to true",defaultValue:{value:"true",computed:!1}}}};b.__docgenInfo={description:`A table cell component that combines copy-to-clipboard functionality with a clickable link.
The copy icon copies the text to clipboard, while clicking the content navigates to the href.

@example
\`\`\`tsx
<CopyableLinkCell
  text="scope:dataset_name"
  href="/did/scope/dataset_name"
>
  scope:dataset_name
</CopyableLinkCell>
\`\`\``,methods:[],displayName:"CopyableLinkCell",props:{text:{required:!0,tsType:{name:"string"},description:"The text to be copied to clipboard when clicked"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to display in the cell. If not provided, the text prop will be displayed"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes to apply to the cell container"},showIcon:{required:!1,tsType:{name:"boolean"},description:"Whether to show the copy icon. Defaults to true",defaultValue:{value:"true",computed:!1}},href:{required:!0,tsType:{name:"string"},description:"The URL to navigate to when the link is clicked"}}};export{x as C,b as a};
