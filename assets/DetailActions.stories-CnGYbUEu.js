import{j as e}from"./iframe-CW9-_HYS.js";import{c as O}from"./utils-DsKtx5Xo.js";import{B as t}from"./button-uonugc8c.js";import{I as l,J as c,K as u}from"./index.esm-DWUw-EzS.js";import"./preload-helper-Dp1pzeXC.js";import"./tw-merge-Ds6tgvmq.js";import"./index-DSpI4bVK.js";import"./iconBase-_tCx069T.js";const r=({children:d,className:z,...k})=>e.jsx("div",{className:O("flex flex-wrap items-center gap-2","rounded-lg","bg-neutral-100/50 dark:bg-neutral-800/50","border border-neutral-200 dark:border-neutral-700","px-4 py-3",z),role:"toolbar","aria-label":"Actions",...k,children:d});r.__docgenInfo={description:`A horizontal action bar for detail pages. Place between the page heading and tabs/content.
Renders action buttons in a responsive flex row with consistent spacing.

@example
\`\`\`tsx
<DetailActions>
    <Button variant="error" onClick={() => setDeleteOpen(true)}>Delete Rule</Button>
    <Button variant="default" onClick={() => setBoostOpen(true)}>Boost Rule</Button>
</DetailActions>
\`\`\``,methods:[],displayName:"DetailActions",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const I={title:"Features/Mutations/DetailActions",component:r,parameters:{layout:"padded"},tags:["autodocs"],decorators:[d=>e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsx(d,{})})]},a={render:()=>e.jsxs(r,{children:[e.jsxs(t,{variant:"error",size:"sm",children:[e.jsx(l,{className:"mr-1.5 h-4 w-4"}),"Delete Rule"]}),e.jsxs(t,{variant:"default",size:"sm",children:[e.jsx(c,{className:"mr-1.5 h-4 w-4"}),"Boost Rule"]}),e.jsxs(t,{variant:"neutral",size:"sm",children:[e.jsx(u,{className:"mr-1.5 h-4 w-4"}),"Update Priority"]})]})},n={render:()=>e.jsx(r,{children:e.jsx(t,{variant:"default",size:"sm",children:"Add Attribute"})})},s={render:()=>e.jsx(r,{children:e.jsxs(t,{variant:"error",size:"sm",children:[e.jsx(l,{className:"mr-1.5 h-4 w-4"}),"Delete"]})})},i={render:()=>e.jsxs("div",{className:"flex flex-col space-y-6 w-full",children:[e.jsx("header",{children:e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100",children:"abc123def456-rule-id"})}),e.jsxs(r,{children:[e.jsxs(t,{variant:"error",size:"sm",children:[e.jsx(l,{className:"mr-1.5 h-4 w-4"}),"Delete Rule"]}),e.jsxs(t,{variant:"default",size:"sm",children:[e.jsx(c,{className:"mr-1.5 h-4 w-4"}),"Boost Rule"]}),e.jsxs(t,{variant:"neutral",size:"sm",children:[e.jsx(u,{className:"mr-1.5 h-4 w-4"}),"Update Priority"]})]}),e.jsx("div",{className:"rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6",children:e.jsx("p",{className:"text-neutral-600 dark:text-neutral-400 text-sm",children:"Tab content / metadata would appear below"})})]})},o={render:()=>e.jsx("div",{className:"dark p-8 rounded-lg bg-neutral-900",children:e.jsxs(r,{children:[e.jsxs(t,{variant:"error",size:"sm",children:[e.jsx(l,{className:"mr-1.5 h-4 w-4"}),"Delete Rule"]}),e.jsxs(t,{variant:"default",size:"sm",children:[e.jsx(c,{className:"mr-1.5 h-4 w-4"}),"Boost Rule"]}),e.jsxs(t,{variant:"neutral",size:"sm",children:[e.jsx(u,{className:"mr-1.5 h-4 w-4"}),"Update Priority"]})]})}),globals:{backgrounds:{value:"dark"}}};var m,p,x;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(x=(p=a.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var h,g,j;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <DetailActions>
            <Button variant="default" size="sm">
                Add Attribute
            </Button>
        </DetailActions>
}`,...(j=(g=n.parameters)==null?void 0:g.docs)==null?void 0:j.source}}};var B,v,b;s.parameters={...s.parameters,docs:{...(B=s.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <DetailActions>
            <Button variant="error" size="sm">
                <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                Delete
            </Button>
        </DetailActions>
}`,...(b=(v=s.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var N,w,A;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(A=(w=i.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};var f,D,R;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(R=(D=o.parameters)==null?void 0:D.docs)==null?void 0:R.source}}};const L=["RuleActions","RSEActions","SingleAction","InPageContext","DarkMode"];export{o as DarkMode,i as InPageContext,n as RSEActions,a as RuleActions,s as SingleAction,L as __namedExportsOrder,I as default};
