import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Kt as n,bt as r}from"./iframe-C47sd5GD.js";import{n as i,t as a}from"./button-CuJSqrUQ.js";import{r as o,t as s}from"./input-sbwFF1TT.js";import{n as c,t as l}from"./MutationDialog-BspMxSCi.js";var u,d,f,p,m,h,g,_,v,y;e((()=>{u=r(),d=t(n()),c(),o(),i(),f={title:`Features/Mutations/MutationDialog`,component:l,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{submitVariant:{control:`select`,options:[`default`,`success`,`error`,`neutral`],description:`Variant of the submit button`},loading:{control:`boolean`,description:`Shows loading state on submit button`}}},p=e=>{let[t,n]=(0,d.useState)(!1),{triggerLabel:r=`Open Dialog`,...i}=e;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(a,{onClick:()=>n(!0),children:r}),(0,u.jsx)(l,{open:t,onOpenChange:n,...i})]})},m={render:()=>(0,u.jsx)(p,{title:`Confirm Action`,description:`Are you sure you want to proceed?`,onSubmit:()=>alert(`Submitted!`),submitLabel:`Confirm`,children:(0,u.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`This is the dialog content area. You can place any form fields or messages here.`})})},h={render:()=>(0,u.jsx)(p,{title:`Delete Item`,description:`This action cannot be undone.`,onSubmit:()=>alert(`Deleted!`),submitLabel:`Delete`,submitVariant:`error`,triggerLabel:`Open Destructive Dialog`,children:(0,u.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`Are you sure you want to permanently delete this item?`})})},g={render:()=>{let[e,t]=(0,d.useState)(``);return(0,u.jsx)(p,{title:`Rename Dataset`,description:`Enter a new name for this dataset.`,onSubmit:()=>alert(`New name: ${e}`),submitLabel:`Rename`,submitVariant:`success`,triggerLabel:`Rename Dataset`,children:(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`label`,{htmlFor:`dataset-name`,className:`block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2`,children:[`New name `,(0,u.jsx)(`span`,{className:`text-base-error-600`,children:`*`})]}),(0,u.jsx)(s,{id:`dataset-name`,value:e,onChange:e=>t(e.target.value),placeholder:`Enter dataset name`})]})})}},_={render:()=>(0,u.jsx)(p,{title:`Processing`,description:`Please wait while the operation completes.`,onSubmit:()=>{},submitLabel:`Save`,loading:!0,triggerLabel:`Open Loading Dialog`,children:(0,u.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`The operation is in progress...`})})},v={render:()=>(0,u.jsx)(`div`,{className:`dark`,children:(0,u.jsx)(p,{title:`Dark Mode Dialog`,description:`This dialog is displayed in dark mode.`,onSubmit:()=>alert(`Submitted!`),submitLabel:`Confirm`,triggerLabel:`Open in Dark Mode`,children:(0,u.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`Content renders correctly in dark mode.`})})}),globals:{backgrounds:{value:`dark`}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Confirm Action" description="Are you sure you want to proceed?" onSubmit={() => alert('Submitted!')} submitLabel="Confirm">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">This is the dialog content area. You can place any form fields or messages here.</p>
        </DialogWrapper>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Delete Item" description="This action cannot be undone." onSubmit={() => alert('Deleted!')} submitLabel="Delete" submitVariant="error" triggerLabel="Open Destructive Dialog">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Are you sure you want to permanently delete this item?</p>
        </DialogWrapper>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Processing" description="Please wait while the operation completes." onSubmit={() => {}} submitLabel="Save" loading={true} triggerLabel="Open Loading Dialog">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">The operation is in progress...</p>
        </DialogWrapper>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Default`,`Destructive`,`WithFormFields`,`Loading`,`DarkMode`]}))();export{v as DarkMode,m as Default,h as Destructive,_ as Loading,g as WithFormFields,y as __namedExportsOrder,f as default};