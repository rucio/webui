import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./utils-BlOR3gwo.js";import{R as i,V as a,k as o,rt as s}from"./index.esm-D2i2AtEp.js";import{n as c,t as l}from"./button-CuJSqrUQ.js";var u,d,f=e((()=>{u=t(),n(),d=({children:e,className:t,...n})=>(0,u.jsx)(`div`,{className:r(`flex flex-wrap items-center gap-2`,`rounded-lg`,`bg-neutral-100/50 dark:bg-neutral-800/50`,`border border-neutral-200 dark:border-neutral-700`,`px-4 py-3`,t),role:`toolbar`,"aria-label":`Actions`,...n,children:e}),d.__docgenInfo={description:`A horizontal action bar for detail pages. Place between the page heading and tabs/content.
Renders action buttons in a responsive flex row with consistent spacing.

@example
\`\`\`tsx
<DetailActions>
    <Button variant="error" onClick={() => setDeleteOpen(true)}>Delete Rule</Button>
    <Button variant="default" onClick={() => setBoostOpen(true)}>Boost Rule</Button>
</DetailActions>
\`\`\``,methods:[],displayName:`DetailActions`,props:{children:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``}}}})),p,m,h,g,_,v,y,b;e((()=>{p=t(),f(),c(),s(),m={title:`Features/Mutations/DetailActions`,component:d,parameters:{layout:`padded`},tags:[`autodocs`],decorators:[e=>(0,p.jsx)(`div`,{className:`max-w-4xl mx-auto`,children:(0,p.jsx)(e,{})})]},h={render:()=>(0,p.jsxs)(d,{children:[(0,p.jsxs)(l,{variant:`error`,size:`sm`,children:[(0,p.jsx)(a,{className:`mr-1.5 h-4 w-4`}),`Delete Rule`]}),(0,p.jsxs)(l,{variant:`default`,size:`sm`,children:[(0,p.jsx)(i,{className:`mr-1.5 h-4 w-4`}),`Boost Rule`]}),(0,p.jsxs)(l,{variant:`neutral`,size:`sm`,children:[(0,p.jsx)(o,{className:`mr-1.5 h-4 w-4`}),`Update Priority`]})]})},g={render:()=>(0,p.jsx)(d,{children:(0,p.jsx)(l,{variant:`default`,size:`sm`,children:`Add Attribute`})})},_={render:()=>(0,p.jsx)(d,{children:(0,p.jsxs)(l,{variant:`error`,size:`sm`,children:[(0,p.jsx)(a,{className:`mr-1.5 h-4 w-4`}),`Delete`]})})},v={render:()=>(0,p.jsxs)(`div`,{className:`flex flex-col space-y-6 w-full`,children:[(0,p.jsx)(`header`,{children:(0,p.jsx)(`h1`,{className:`text-4xl font-bold text-neutral-900 dark:text-neutral-100`,children:`abc123def456-rule-id`})}),(0,p.jsxs)(d,{children:[(0,p.jsxs)(l,{variant:`error`,size:`sm`,children:[(0,p.jsx)(a,{className:`mr-1.5 h-4 w-4`}),`Delete Rule`]}),(0,p.jsxs)(l,{variant:`default`,size:`sm`,children:[(0,p.jsx)(i,{className:`mr-1.5 h-4 w-4`}),`Boost Rule`]}),(0,p.jsxs)(l,{variant:`neutral`,size:`sm`,children:[(0,p.jsx)(o,{className:`mr-1.5 h-4 w-4`}),`Update Priority`]})]}),(0,p.jsx)(`div`,{className:`rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6`,children:(0,p.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 text-sm`,children:`Tab content / metadata would appear below`})})]})},y={render:()=>(0,p.jsx)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900`,children:(0,p.jsxs)(d,{children:[(0,p.jsxs)(l,{variant:`error`,size:`sm`,children:[(0,p.jsx)(a,{className:`mr-1.5 h-4 w-4`}),`Delete Rule`]}),(0,p.jsxs)(l,{variant:`default`,size:`sm`,children:[(0,p.jsx)(i,{className:`mr-1.5 h-4 w-4`}),`Boost Rule`]}),(0,p.jsxs)(l,{variant:`neutral`,size:`sm`,children:[(0,p.jsx)(o,{className:`mr-1.5 h-4 w-4`}),`Update Priority`]})]})}),globals:{backgrounds:{value:`dark`}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <DetailActions>
            <Button variant="error" size="sm">
                <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                Delete Rule
            </Button>
            <Button variant="default" size="sm">
                <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" />
                Boost Rule
            </Button>
            <Button variant="neutral" size="sm">
                <HiOutlineAdjustments className="mr-1.5 h-4 w-4" />
                Update Priority
            </Button>
        </DetailActions>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <DetailActions>
            <Button variant="default" size="sm">
                Add Attribute
            </Button>
        </DetailActions>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <DetailActions>
            <Button variant="error" size="sm">
                <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                Delete
            </Button>
        </DetailActions>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col space-y-6 w-full">
            <header>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">abc123def456-rule-id</h1>
            </header>
            <DetailActions>
                <Button variant="error" size="sm">
                    <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                    Delete Rule
                </Button>
                <Button variant="default" size="sm">
                    <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" />
                    Boost Rule
                </Button>
                <Button variant="neutral" size="sm">
                    <HiOutlineAdjustments className="mr-1.5 h-4 w-4" />
                    Update Priority
                </Button>
            </DetailActions>
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6">
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Tab content / metadata would appear below</p>
            </div>
        </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark p-8 rounded-lg bg-neutral-900">
            <DetailActions>
                <Button variant="error" size="sm">
                    <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                    Delete Rule
                </Button>
                <Button variant="default" size="sm">
                    <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" />
                    Boost Rule
                </Button>
                <Button variant="neutral" size="sm">
                    <HiOutlineAdjustments className="mr-1.5 h-4 w-4" />
                    Update Priority
                </Button>
            </DetailActions>
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...y.parameters?.docs?.source}}},b=[`RuleActions`,`RSEActions`,`SingleAction`,`InPageContext`,`DarkMode`]}))();export{y as DarkMode,v as InPageContext,g as RSEActions,h as RuleActions,_ as SingleAction,b as __namedExportsOrder,m as default};