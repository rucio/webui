import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./jsx-runtime-CndCZlyt.js";import{H as n,K as r,ct as i}from"./index.esm-CsSCyxdX.js";import{r as a,t as o}from"./button-CsACwaci.js";var s,c,l;function u(){return(u=e((()=>{s=t(),i(),a(),c={delete:r,edit:n},l=({actions:e})=>(0,s.jsx)(`div`,{className:`flex items-center gap-1 h-full`,children:e.map(e=>{let t=e.icon?c[e.icon]:null;return(0,s.jsxs)(o,{type:`button`,size:`sm`,variant:e.variant??`neutral`,onClick:t=>{t.stopPropagation(),e.onClick()},disabled:e.disabled,className:`h-7 px-2 text-xs`,"aria-label":e.label,title:e.label,children:[t&&(0,s.jsx)(t,{className:`mr-1 h-3.5 w-3.5`,"aria-hidden":`true`}),e.label]},e.label)})}),l.__docgenInfo={description:`A table cell renderer that displays action buttons for row-level operations.
Designed for use with AG-Grid as a custom cell renderer.

@example
\`\`\`tsx
// AG-Grid column definition
{
    headerName: 'Actions',
    cellRenderer: (params) => (
        <ActionCell actions={[
            { label: 'Delete', icon: 'delete', variant: 'error', onClick: () => handleDelete(params.data) },
        ]} />
    ),
}
\`\`\``,methods:[],displayName:`ActionCell`,props:{actions:{required:!0,tsType:{name:`Array`,elements:[{name:`ActionCellButton`}],raw:`ActionCellButton[]`},description:``}}}})))()}export{u as n,l as t};