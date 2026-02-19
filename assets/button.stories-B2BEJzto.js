import{j as e}from"./iframe-CbZ9RuD1.js";import{H as j,a as Se,b as Ne}from"./index.esm-Bh9o6rCW.js";import{B as r}from"./button-CTUPBRYB.js";import"./preload-helper-Dp1pzeXC.js";import"./iconBase-BDSQWw1B.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";const Ce={title:"Atoms/Form/Button",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","success","error","neutral"],description:"Visual style variant of the button"},size:{control:"select",options:["sm","default","lg","icon"],description:"Size of the button"},loading:{control:"boolean",description:"Shows loading spinner and disables the button"},disabled:{control:"boolean",description:"Disables the button"}}},a={args:{children:"Button",variant:"default"}},s={args:{children:"Success",variant:"success"}},n={args:{children:"Delete",variant:"error"}},t={args:{children:"Cancel",variant:"neutral"}},o={args:{children:"Small Button",size:"sm"}},c={args:{children:"Medium Button",size:"default"}},i={args:{children:"Large Button",size:"lg"}},l={args:{size:"icon",children:e.jsx(j,{className:"h-4 w-4"}),"aria-label":"Add item"}},d={args:{children:"Loading",loading:!0}},u={args:{children:"Disabled",disabled:!0}},m={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(j,{className:"mr-2 h-4 w-4"}),"Add Item"]})}},p={args:{children:e.jsxs(e.Fragment,{children:["Save",e.jsx(Ne,{className:"ml-2 h-4 w-4"})]}),variant:"success"}},g={render:()=>e.jsx("div",{className:"flex flex-col gap-4",children:e.jsxs("div",{className:"flex gap-4",children:[e.jsx(r,{variant:"default",children:"Default"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"error",children:"Error"}),e.jsx(r,{variant:"neutral",children:"Neutral"})]})})},h={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(r,{size:"sm",children:"Small"}),e.jsx(r,{size:"default",children:"Medium"}),e.jsx(r,{size:"lg",children:"Large"}),e.jsx(r,{size:"icon","aria-label":"Add",children:e.jsx(j,{className:"h-4 w-4"})})]})},v={render:()=>e.jsx("div",{className:"flex flex-col gap-4",children:e.jsxs("div",{className:"flex gap-4",children:[e.jsx(r,{children:"Normal"}),e.jsx(r,{loading:!0,children:"Loading"}),e.jsx(r,{disabled:!0,children:"Disabled"})]})})},x={parameters:{backgrounds:{default:"dark"}},render:()=>e.jsx("div",{className:"dark p-8 rounded-lg bg-neutral-900",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex gap-4",children:[e.jsx(r,{variant:"default",children:"Default"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"error",children:"Error"}),e.jsx(r,{variant:"neutral",children:"Neutral"})]}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(r,{loading:!0,children:"Loading"}),e.jsx(r,{disabled:!0,children:"Disabled"})]})]})})},f={render:()=>e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(r,{variant:"neutral",children:"Cancel"}),e.jsx(r,{variant:"success",children:"Save Changes"})]})},B={render:()=>e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs(r,{variant:"error",children:[e.jsx(Se,{className:"mr-2 h-4 w-4"}),"Delete Account"]})})};var S,N,b;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'default'
  }
}`,...(b=(N=a.parameters)==null?void 0:N.docs)==null?void 0:b.source}}};var D,z,A;s.parameters={...s.parameters,docs:{...(D=s.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: 'Success',
    variant: 'success'
  }
}`,...(A=(z=s.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var L,w,k;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: 'Delete',
    variant: 'error'
  }
}`,...(k=(w=n.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var H,C,E;t.parameters={...t.parameters,docs:{...(H=t.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    children: 'Cancel',
    variant: 'neutral'
  }
}`,...(E=(C=t.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var I,M,y;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: 'Small Button',
    size: 'sm'
  }
}`,...(y=(M=o.parameters)==null?void 0:M.docs)==null?void 0:y.source}}};var F,P,W;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    children: 'Medium Button',
    size: 'default'
  }
}`,...(W=(P=c.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var R,T,V;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: 'Large Button',
    size: 'lg'
  }
}`,...(V=(T=i.parameters)==null?void 0:T.docs)==null?void 0:V.source}}};var _,O,q;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    size: 'icon',
    children: <HiPlus className="h-4 w-4" />,
    'aria-label': 'Add item'
  }
}`,...(q=(O=l.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var G,J,K;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    children: 'Loading',
    loading: true
  }
}`,...(K=(J=d.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,X;u.parameters={...u.parameters,docs:{...(Q=u.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    children: 'Disabled',
    disabled: true
  }
}`,...(X=(U=u.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,$;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    children: <>
                <HiPlus className="mr-2 h-4 w-4" />
                Add Item
            </>
  }
}`,...($=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,re,ae;p.parameters={...p.parameters,docs:{...(ee=p.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    children: <>
                Save
                <HiCheck className="ml-2 h-4 w-4" />
            </>,
    variant: 'success'
  }
}`,...(ae=(re=p.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,ne,te;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <Button variant="default">Default</Button>
                <Button variant="success">Success</Button>
                <Button variant="error">Error</Button>
                <Button variant="neutral">Neutral</Button>
            </div>
        </div>
}`,...(te=(ne=g.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var oe,ce,ie;h.parameters={...h.parameters,docs:{...(oe=h.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Add">
                <HiPlus className="h-4 w-4" />
            </Button>
        </div>
}`,...(ie=(ce=h.parameters)==null?void 0:ce.docs)==null?void 0:ie.source}}};var le,de,ue;v.parameters={...v.parameters,docs:{...(le=v.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <Button>Normal</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
            </div>
        </div>
}`,...(ue=(de=v.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,pe,ge;x.parameters={...x.parameters,docs:{...(me=x.parameters)==null?void 0:me.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: () => <div className="dark p-8 rounded-lg bg-neutral-900">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <Button variant="default">Default</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="error">Error</Button>
                    <Button variant="neutral">Neutral</Button>
                </div>
                <div className="flex gap-4">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                </div>
            </div>
        </div>
}`,...(ge=(pe=x.parameters)==null?void 0:pe.docs)==null?void 0:ge.source}}};var he,ve,xe;f.parameters={...f.parameters,docs:{...(he=f.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <div className="flex justify-end gap-2">
            <Button variant="neutral">Cancel</Button>
            <Button variant="success">Save Changes</Button>
        </div>
}`,...(xe=(ve=f.parameters)==null?void 0:ve.docs)==null?void 0:xe.source}}};var fe,Be,je;B.parameters={...B.parameters,docs:{...(fe=B.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
            <Button variant="error">
                <HiTrash className="mr-2 h-4 w-4" />
                Delete Account
            </Button>
        </div>
}`,...(je=(Be=B.parameters)==null?void 0:Be.docs)==null?void 0:je.source}}};const Ee=["Default","Success","Error","Neutral","Small","Medium","Large","IconButton","Loading","Disabled","WithIconLeft","WithIconRight","AllVariants","AllSizes","AllStates","DarkMode","FormActions","DestructiveAction"];export{h as AllSizes,v as AllStates,g as AllVariants,x as DarkMode,a as Default,B as DestructiveAction,u as Disabled,n as Error,f as FormActions,l as IconButton,i as Large,d as Loading,c as Medium,t as Neutral,o as Small,s as Success,m as WithIconLeft,p as WithIconRight,Ee as __namedExportsOrder,Ce as default};
