import{j as e}from"./iframe-CbZ9RuD1.js";import{F as a}from"./Field-CSa0GJHY.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";const Ye={title:"Atoms/Misc/Field",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","subtle","brand","success","error","warning"],description:"Visual variant of the field"},size:{control:"select",options:["sm","md","lg"],description:"Size of the field"},fullWidth:{control:"boolean",description:"Whether the field takes full width"},truncate:{control:"boolean",description:"Whether to truncate long text"}},decorators:[s=>e.jsx("div",{className:"w-[600px]",children:e.jsx(s,{})})]},r={args:{children:"Default field"}},n={args:{children:"Subtle field",variant:"subtle"}},t={args:{children:"Brand field",variant:"brand"}},i={args:{children:"Success field",variant:"success"}},l={args:{children:"Error field",variant:"error"}},d={args:{children:"Warning field",variant:"warning"}},c={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(a,{variant:"default",children:"Default"}),e.jsx(a,{variant:"subtle",children:"Subtle"}),e.jsx(a,{variant:"brand",children:"Brand"}),e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"error",children:"Error"}),e.jsx(a,{variant:"warning",children:"Warning"})]})},m={args:{children:"Small field",size:"sm"}},o={args:{children:"Medium field",size:"md"}},x={args:{children:"Large field",size:"lg"}},u={render:()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(a,{size:"sm",children:"Small"}),e.jsx(a,{size:"md",children:"Medium"}),e.jsx(a,{size:"lg",children:"Large"})]})},p={args:{children:"Fit content",fullWidth:!1}},v={args:{children:"Full width field",fullWidth:!0}},h={args:{children:"This is a very long text that will be truncated with an ellipsis when it exceeds the container width",truncate:!0,className:"max-w-xs"}},g={args:{children:"This is a very long text that will wrap to multiple lines instead of being truncated",truncate:!1,className:"max-w-xs"}},f={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400 w-24",children:"Name:"}),e.jsx(a,{children:"John Doe"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400 w-24",children:"Email:"}),e.jsx(a,{children:"john.doe@example.com"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400 w-24",children:"Role:"}),e.jsx(a,{variant:"brand",children:"Administrator"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400 w-24",children:"Status:"}),e.jsx(a,{variant:"success",children:"Active"})]})]})},j={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 p-2 border-b border-neutral-200 dark:border-neutral-800",children:[e.jsx("span",{className:"text-sm font-medium",children:"ID"}),e.jsx("span",{className:"text-sm font-medium",children:"Name"}),e.jsx("span",{className:"text-sm font-medium",children:"Status"})]}),[1,2,3].map(s=>e.jsxs("div",{className:"grid grid-cols-3 gap-2 p-2",children:[e.jsx(a,{size:"sm",variant:"subtle",children:`#${1e3+s}`}),e.jsxs(a,{size:"sm",children:["Item ",s]}),e.jsx(a,{size:"sm",variant:s%2===0?"success":"warning",children:s%2===0?"Complete":"Pending"})]},s))]})},N={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{size:"sm",variant:"brand",children:"React"}),e.jsx(a,{size:"sm",variant:"brand",children:"TypeScript"}),e.jsx(a,{size:"sm",variant:"brand",children:"Next.js"}),e.jsx(a,{size:"sm",variant:"brand",children:"Tailwind"}),e.jsx(a,{size:"sm",variant:"brand",children:"Storybook"})]})},F={render:()=>e.jsxs("div",{className:"border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4",children:[e.jsx("h3",{className:"text-lg font-bold",children:"Resource Details"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 mb-1",children:"Created"}),e.jsx(a,{children:"2024-03-15"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 mb-1",children:"Modified"}),e.jsx(a,{children:"2024-03-20"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 mb-1",children:"Owner"}),e.jsx(a,{children:"admin@example.com"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 mb-1",children:"Type"}),e.jsx(a,{variant:"brand",children:"Dataset"})]})]})]})},b={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium mb-2",children:"Server Status"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{variant:"success",size:"sm",children:"Online"}),e.jsx(a,{variant:"subtle",size:"sm",children:"127.0.0.1"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium mb-2",children:"Database Status"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{variant:"warning",size:"sm",children:"Maintenance"}),e.jsx(a,{variant:"subtle",size:"sm",children:"postgres.local"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium mb-2",children:"API Status"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{variant:"error",size:"sm",children:"Offline"}),e.jsx(a,{variant:"subtle",size:"sm",children:"api.example.com"})]})]})]})},w={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"File name:"}),e.jsx(a,{truncate:!0,className:"max-w-xs",children:"very-long-filename-that-needs-to-be-truncated-for-display.pdf"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Size:"}),e.jsx(a,{size:"sm",children:"2.4 MB"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Type:"}),e.jsx(a,{size:"sm",variant:"brand",children:"PDF Document"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Status:"}),e.jsx(a,{size:"sm",variant:"success",children:"Uploaded"})]})]})},z={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{children:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsxs("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:[e.jsx("path",{d:"M10 12a2 2 0 100-4 2 2 0 000 4z"}),e.jsx("path",{fillRule:"evenodd",d:"M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",clipRule:"evenodd"})]}),"Visible"]})}),e.jsx(a,{variant:"success",children:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})}),"Verified"]})}),e.jsx(a,{variant:"error",children:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),"Error"]})})]})},S={parameters:{backgrounds:{default:"dark"}},render:()=>e.jsxs("div",{className:"dark p-8 rounded-lg bg-neutral-900 space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm text-neutral-400",children:"Variants"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"default",children:"Default"}),e.jsx(a,{variant:"subtle",children:"Subtle"}),e.jsx(a,{variant:"brand",children:"Brand"}),e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"error",children:"Error"}),e.jsx(a,{variant:"warning",children:"Warning"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm text-neutral-400",children:"Sizes"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{size:"sm",children:"Small"}),e.jsx(a,{size:"md",children:"Medium"}),e.jsx(a,{size:"lg",children:"Large"})]})]})]})},y={render:()=>e.jsx("div",{className:"space-y-6",children:["sm","md","lg"].map(s=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium capitalize",children:s}),e.jsx("div",{className:"flex flex-wrap gap-2",children:["default","subtle","brand","success","error","warning"].map(k=>e.jsx(a,{size:s,variant:k,children:k},k))})]},s))})};var M,D,T;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    children: 'Default field'
  }
}`,...(T=(D=r.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var R,W,L;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: 'Subtle field',
    variant: 'subtle'
  }
}`,...(L=(W=n.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var B,C,E;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: 'Brand field',
    variant: 'brand'
  }
}`,...(E=(C=t.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var A,I,V;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    children: 'Success field',
    variant: 'success'
  }
}`,...(V=(I=i.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var P,O,J;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    children: 'Error field',
    variant: 'error'
  }
}`,...(J=(O=l.parameters)==null?void 0:O.docs)==null?void 0:J.source}}};var K,U,_;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    children: 'Warning field',
    variant: 'warning'
  }
}`,...(_=(U=d.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var $,q,G;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4">
            <Field variant="default">Default</Field>
            <Field variant="subtle">Subtle</Field>
            <Field variant="brand">Brand</Field>
            <Field variant="success">Success</Field>
            <Field variant="error">Error</Field>
            <Field variant="warning">Warning</Field>
        </div>
}`,...(G=(q=c.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var H,Q,X;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    children: 'Small field',
    size: 'sm'
  }
}`,...(X=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;o.parameters={...o.parameters,docs:{...(Y=o.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    children: 'Medium field',
    size: 'md'
  }
}`,...(ee=(Z=o.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ae,se,re;x.parameters={...x.parameters,docs:{...(ae=x.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    children: 'Large field',
    size: 'lg'
  }
}`,...(re=(se=x.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var ne,te,ie;u.parameters={...u.parameters,docs:{...(ne=u.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-4">
            <Field size="sm">Small</Field>
            <Field size="md">Medium</Field>
            <Field size="lg">Large</Field>
        </div>
}`,...(ie=(te=u.parameters)==null?void 0:te.docs)==null?void 0:ie.source}}};var le,de,ce;p.parameters={...p.parameters,docs:{...(le=p.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    children: 'Fit content',
    fullWidth: false
  }
}`,...(ce=(de=p.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var me,oe,xe;v.parameters={...v.parameters,docs:{...(me=v.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    children: 'Full width field',
    fullWidth: true
  }
}`,...(xe=(oe=v.parameters)==null?void 0:oe.docs)==null?void 0:xe.source}}};var ue,pe,ve;h.parameters={...h.parameters,docs:{...(ue=h.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    children: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width',
    truncate: true,
    className: 'max-w-xs'
  }
}`,...(ve=(pe=h.parameters)==null?void 0:pe.docs)==null?void 0:ve.source}}};var he,ge,fe;g.parameters={...g.parameters,docs:{...(he=g.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    children: 'This is a very long text that will wrap to multiple lines instead of being truncated',
    truncate: false,
    className: 'max-w-xs'
  }
}`,...(fe=(ge=g.parameters)==null?void 0:ge.docs)==null?void 0:fe.source}}};var je,Ne,Fe;f.parameters={...f.parameters,docs:{...(je=f.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Name:</span>
                <Field>John Doe</Field>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Email:</span>
                <Field>john.doe@example.com</Field>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Role:</span>
                <Field variant="brand">Administrator</Field>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Status:</span>
                <Field variant="success">Active</Field>
            </div>
        </div>
}`,...(Fe=(Ne=f.parameters)==null?void 0:Ne.docs)==null?void 0:Fe.source}}};var be,we,ze;j.parameters={...j.parameters,docs:{...(be=j.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 p-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm font-medium">ID</span>
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm font-medium">Status</span>
            </div>
            {[1, 2, 3].map(i => <div key={i} className="grid grid-cols-3 gap-2 p-2">
                    <Field size="sm" variant="subtle">
                        {\`#\${1000 + i}\`}
                    </Field>
                    <Field size="sm">Item {i}</Field>
                    <Field size="sm" variant={i % 2 === 0 ? 'success' : 'warning'}>
                        {i % 2 === 0 ? 'Complete' : 'Pending'}
                    </Field>
                </div>)}
        </div>
}`,...(ze=(we=j.parameters)==null?void 0:we.docs)==null?void 0:ze.source}}};var Se,ye,ke;N.parameters={...N.parameters,docs:{...(Se=N.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
            <Field size="sm" variant="brand">
                React
            </Field>
            <Field size="sm" variant="brand">
                TypeScript
            </Field>
            <Field size="sm" variant="brand">
                Next.js
            </Field>
            <Field size="sm" variant="brand">
                Tailwind
            </Field>
            <Field size="sm" variant="brand">
                Storybook
            </Field>
        </div>
}`,...(ke=(ye=N.parameters)==null?void 0:ye.docs)==null?void 0:ke.source}}};var Me,De,Te;F.parameters={...F.parameters,docs:{...(Me=F.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Resource Details</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Created</p>
                    <Field>2024-03-15</Field>
                </div>
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Modified</p>
                    <Field>2024-03-20</Field>
                </div>
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Owner</p>
                    <Field>admin@example.com</Field>
                </div>
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Type</p>
                    <Field variant="brand">Dataset</Field>
                </div>
            </div>
        </div>
}`,...(Te=(De=F.parameters)==null?void 0:De.docs)==null?void 0:Te.source}}};var Re,We,Le;b.parameters={...b.parameters,docs:{...(Re=b.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <div>
                <h4 className="text-sm font-medium mb-2">Server Status</h4>
                <div className="flex gap-2">
                    <Field variant="success" size="sm">
                        Online
                    </Field>
                    <Field variant="subtle" size="sm">
                        127.0.0.1
                    </Field>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-medium mb-2">Database Status</h4>
                <div className="flex gap-2">
                    <Field variant="warning" size="sm">
                        Maintenance
                    </Field>
                    <Field variant="subtle" size="sm">
                        postgres.local
                    </Field>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-medium mb-2">API Status</h4>
                <div className="flex gap-2">
                    <Field variant="error" size="sm">
                        Offline
                    </Field>
                    <Field variant="subtle" size="sm">
                        api.example.com
                    </Field>
                </div>
            </div>
        </div>
}`,...(Le=(We=b.parameters)==null?void 0:We.docs)==null?void 0:Le.source}}};var Be,Ce,Ee;w.parameters={...w.parameters,docs:{...(Be=w.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">File name:</span>
                <Field truncate className="max-w-xs">
                    very-long-filename-that-needs-to-be-truncated-for-display.pdf
                </Field>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Size:</span>
                <Field size="sm">2.4 MB</Field>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Type:</span>
                <Field size="sm" variant="brand">
                    PDF Document
                </Field>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Status:</span>
                <Field size="sm" variant="success">
                    Uploaded
                </Field>
            </div>
        </div>
}`,...(Ee=(Ce=w.parameters)==null?void 0:Ce.docs)==null?void 0:Ee.source}}};var Ae,Ie,Ve;z.parameters={...z.parameters,docs:{...(Ae=z.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
            <Field>
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Visible
                </span>
            </Field>
            <Field variant="success">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                </span>
            </Field>
            <Field variant="error">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Error
                </span>
            </Field>
        </div>
}`,...(Ve=(Ie=z.parameters)==null?void 0:Ie.docs)==null?void 0:Ve.source}}};var Pe,Oe,Je;S.parameters={...S.parameters,docs:{...(Pe=S.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: () => <div className="dark p-8 rounded-lg bg-neutral-900 space-y-6">
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Variants</p>
                <div className="flex flex-wrap gap-2">
                    <Field variant="default">Default</Field>
                    <Field variant="subtle">Subtle</Field>
                    <Field variant="brand">Brand</Field>
                    <Field variant="success">Success</Field>
                    <Field variant="error">Error</Field>
                    <Field variant="warning">Warning</Field>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Sizes</p>
                <div className="flex flex-wrap items-center gap-2">
                    <Field size="sm">Small</Field>
                    <Field size="md">Medium</Field>
                    <Field size="lg">Large</Field>
                </div>
            </div>
        </div>
}`,...(Je=(Oe=S.parameters)==null?void 0:Oe.docs)==null?void 0:Je.source}}};var Ke,Ue,_e;y.parameters={...y.parameters,docs:{...(Ke=y.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
            {(['sm', 'md', 'lg'] as const).map(size => <div key={size} className="space-y-2">
                    <h3 className="text-sm font-medium capitalize">{size}</h3>
                    <div className="flex flex-wrap gap-2">
                        {(['default', 'subtle', 'brand', 'success', 'error', 'warning'] as const).map(variant => <Field key={variant} size={size} variant={variant}>
                                {variant}
                            </Field>)}
                    </div>
                </div>)}
        </div>
}`,...(_e=(Ue=y.parameters)==null?void 0:Ue.docs)==null?void 0:_e.source}}};const Ze=["Default","Subtle","Brand","Success","Error","Warning","AllVariants","Small","Medium","Large","AllSizes","FitContent","FullWidth","TruncatedText","NonTruncatedText","KeyValuePairs","DataTable","Tags","MetadataDisplay","StatusIndicators","FileInfo","WithIcons","DarkMode","AllCombinations"];export{y as AllCombinations,u as AllSizes,c as AllVariants,t as Brand,S as DarkMode,j as DataTable,r as Default,l as Error,w as FileInfo,p as FitContent,v as FullWidth,f as KeyValuePairs,x as Large,o as Medium,F as MetadataDisplay,g as NonTruncatedText,m as Small,b as StatusIndicators,n as Subtle,i as Success,N as Tags,h as TruncatedText,d as Warning,z as WithIcons,Ze as __namedExportsOrder,Ye as default};
