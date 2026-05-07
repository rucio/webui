import{j as e,r as v}from"./iframe-CW9-_HYS.js";import{M as y}from"./MutationDialog-BEx-tAIQ.js";import{I as C}from"./input-Pe1M6Jdo.js";import{B as M}from"./button-uonugc8c.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CK4im6IW.js";import"./index-EU4VEQCY.js";import"./index-vscuIXpL.js";import"./index-Cd40vaJY.js";import"./index-DfvfBRvX.js";import"./Combination-C7xDWU_D.js";import"./index-zIJ3W_2m.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./XMarkIcon-B3YiSwSe.js";import"./index-DSpI4bVK.js";import"./index.esm-DWUw-EzS.js";import"./iconBase-_tCx069T.js";const K={title:"Features/Mutations/MutationDialog",component:y,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{submitVariant:{control:"select",options:["default","success","error","neutral"],description:"Variant of the submit button"},loading:{control:"boolean",description:"Shows loading state on submit button"}}},t=a=>{const[m,r]=v.useState(!1),{triggerLabel:w="Open Dialog",...W}=a;return e.jsxs(e.Fragment,{children:[e.jsx(M,{onClick:()=>r(!0),children:w}),e.jsx(y,{open:m,onOpenChange:r,...W})]})},s={render:()=>e.jsx(t,{title:"Confirm Action",description:"Are you sure you want to proceed?",onSubmit:()=>alert("Submitted!"),submitLabel:"Confirm",children:e.jsx("p",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"This is the dialog content area. You can place any form fields or messages here."})})},n={render:()=>e.jsx(t,{title:"Delete Item",description:"This action cannot be undone.",onSubmit:()=>alert("Deleted!"),submitLabel:"Delete",submitVariant:"error",triggerLabel:"Open Destructive Dialog",children:e.jsx("p",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"Are you sure you want to permanently delete this item?"})})},o={render:()=>{const[a,m]=v.useState("");return e.jsx(t,{title:"Rename Dataset",description:"Enter a new name for this dataset.",onSubmit:()=>alert(`New name: ${a}`),submitLabel:"Rename",submitVariant:"success",triggerLabel:"Rename Dataset",children:e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"dataset-name",className:"block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2",children:["New name ",e.jsx("span",{className:"text-base-error-600",children:"*"})]}),e.jsx(C,{id:"dataset-name",value:a,onChange:r=>m(r.target.value),placeholder:"Enter dataset name"})]})})}},i={render:()=>e.jsx(t,{title:"Processing",description:"Please wait while the operation completes.",onSubmit:()=>{},submitLabel:"Save",loading:!0,triggerLabel:"Open Loading Dialog",children:e.jsx("p",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"The operation is in progress..."})})},l={render:()=>e.jsx("div",{className:"dark",children:e.jsx(t,{title:"Dark Mode Dialog",description:"This dialog is displayed in dark mode.",onSubmit:()=>alert("Submitted!"),submitLabel:"Confirm",triggerLabel:"Open in Dark Mode",children:e.jsx("p",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"Content renders correctly in dark mode."})})}),globals:{backgrounds:{value:"dark"}}};var d,c,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Confirm Action" description="Are you sure you want to proceed?" onSubmit={() => alert('Submitted!')} submitLabel="Confirm">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">This is the dialog content area. You can place any form fields or messages here.</p>
        </DialogWrapper>
}`,...(p=(c=s.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,g,b;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Delete Item" description="This action cannot be undone." onSubmit={() => alert('Deleted!')} submitLabel="Delete" submitVariant="error" triggerLabel="Open Destructive Dialog">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Are you sure you want to permanently delete this item?</p>
        </DialogWrapper>
}`,...(b=(g=n.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var x,h,D;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const [name, setName] = useState('');
    return <DialogWrapper title="Rename Dataset" description="Enter a new name for this dataset." onSubmit={() => alert(\`New name: \${name}\`)} submitLabel="Rename" submitVariant="success" triggerLabel="Rename Dataset">
                <div>
                    <label htmlFor="dataset-name" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        New name <span className="text-base-error-600">*</span>
                    </label>
                    <Input id="dataset-name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter dataset name" />
                </div>
            </DialogWrapper>;
  }
}`,...(D=(h=o.parameters)==null?void 0:h.docs)==null?void 0:D.source}}};var k,S,f;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Processing" description="Please wait while the operation completes." onSubmit={() => {}} submitLabel="Save" loading={true} triggerLabel="Open Loading Dialog">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">The operation is in progress...</p>
        </DialogWrapper>
}`,...(f=(S=i.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var L,N,j;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="dark">
            <DialogWrapper title="Dark Mode Dialog" description="This dialog is displayed in dark mode." onSubmit={() => alert('Submitted!')} submitLabel="Confirm" triggerLabel="Open in Dark Mode">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Content renders correctly in dark mode.</p>
            </DialogWrapper>
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...(j=(N=l.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};const Q=["Default","Destructive","WithFormFields","Loading","DarkMode"];export{l as DarkMode,s as Default,n as Destructive,i as Loading,o as WithFormFields,Q as __namedExportsOrder,K as default};
