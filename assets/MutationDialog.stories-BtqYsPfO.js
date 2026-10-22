import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./button-D3VLLGun.js";import{r as a,t as o}from"./input-CulfB0Jv.js";import{n as s,t as c}from"./MutationDialog-D_6cZ1TC.js";var l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{l=n(),u=t(),s(),a(),r(),d={title:`Features/Mutations/MutationDialog`,component:c,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{submitVariant:{control:`select`,options:[`default`,`success`,`error`,`neutral`],description:`Variant of the submit button`},loading:{control:`boolean`,description:`Shows loading state on submit button`}}},f=e=>{let[t,n]=(0,u.useState)(!1),{triggerLabel:r=`Open Dialog`,...a}=e;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(i,{onClick:()=>n(!0),children:r}),(0,l.jsx)(c,{open:t,onOpenChange:n,...a})]})},p={render:()=>(0,l.jsx)(f,{title:`Confirm Action`,description:`Are you sure you want to proceed?`,onSubmit:()=>alert(`Submitted!`),submitLabel:`Confirm`,children:(0,l.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`This is the dialog content area. You can place any form fields or messages here.`})})},m={render:()=>(0,l.jsx)(f,{title:`Delete Item`,description:`This action cannot be undone.`,onSubmit:()=>alert(`Deleted!`),submitLabel:`Delete`,submitVariant:`error`,triggerLabel:`Open Destructive Dialog`,children:(0,l.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`Are you sure you want to permanently delete this item?`})})},h={render:()=>{let[e,t]=(0,u.useState)(``);return(0,l.jsx)(f,{title:`Rename Dataset`,description:`Enter a new name for this dataset.`,onSubmit:()=>alert(`New name: ${e}`),submitLabel:`Rename`,submitVariant:`success`,triggerLabel:`Rename Dataset`,children:(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`label`,{htmlFor:`dataset-name`,className:`block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2`,children:[`New name `,(0,l.jsx)(`span`,{className:`text-base-error-600`,children:`*`})]}),(0,l.jsx)(o,{id:`dataset-name`,value:e,onChange:e=>t(e.target.value),placeholder:`Enter dataset name`})]})})}},g={render:()=>(0,l.jsx)(f,{title:`Processing`,description:`Please wait while the operation completes.`,onSubmit:()=>{},submitLabel:`Save`,loading:!0,triggerLabel:`Open Loading Dialog`,children:(0,l.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`The operation is in progress...`})})},_={render:()=>(0,l.jsx)(`div`,{className:`dark`,children:(0,l.jsx)(f,{title:`Dark Mode Dialog`,description:`This dialog is displayed in dark mode.`,onSubmit:()=>alert(`Submitted!`),submitLabel:`Confirm`,triggerLabel:`Open in Dark Mode`,children:(0,l.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:`Content renders correctly in dark mode.`})})}),globals:{backgrounds:{value:`dark`}}},v=[`Default`,`Destructive`,`WithFormFields`,`Loading`,`DarkMode`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Confirm Action" description="Are you sure you want to proceed?" onSubmit={() => alert('Submitted!')} submitLabel="Confirm">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                This is the dialog content area. You can place any form fields or messages here.
            </p>
        </DialogWrapper>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Delete Item" description="This action cannot be undone." onSubmit={() => alert('Deleted!')} submitLabel="Delete" submitVariant="error" triggerLabel="Open Destructive Dialog">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Are you sure you want to permanently delete this item?</p>
        </DialogWrapper>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <DialogWrapper title="Processing" description="Please wait while the operation completes." onSubmit={() => {}} submitLabel="Save" loading={true} triggerLabel="Open Loading Dialog">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">The operation is in progress...</p>
        </DialogWrapper>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark">
            <DialogWrapper title="Dark Mode Dialog" description="This dialog is displayed in dark mode." onSubmit={() => alert('Submitted!')} submitLabel="Confirm" triggerLabel="Open in Dark Mode">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Content renders correctly in dark mode.</p>
            </DialogWrapper>
        </div>,
  globals: {
    backgrounds: {
      value: 'dark'
    }
  }
}`,..._.parameters?.docs?.source}}}})))()}y();export{_ as DarkMode,p as Default,m as Destructive,g as Loading,h as WithFormFields,v as __namedExportsOrder,d as default};