import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./utils-BlOR3gwo.js";import{V as i,rt as a,z as o}from"./index.esm-D2i2AtEp.js";var s,c,l,u,d=e((()=>{s=t(),a(),n(),c={delete:i,edit:o},l={default:r(`text-neutral-600 dark:text-neutral-400`,`hover:text-brand-600 dark:hover:text-brand-400`,`hover:bg-brand-100 dark:hover:bg-brand-900/30`),error:r(`text-neutral-600 dark:text-neutral-400`,`hover:text-base-error-600 dark:hover:text-base-error-400`,`hover:bg-base-error-100 dark:hover:bg-base-error-900/30`)},u=({actions:e})=>(0,s.jsx)(`div`,{className:`flex items-center gap-1 h-full`,children:e.map(e=>{let t=e.icon?c[e.icon]:null,n=e.variant||`default`;return(0,s.jsxs)(`button`,{type:`button`,onClick:t=>{t.stopPropagation(),e.onClick()},onKeyDown:t=>{(t.key===`Enter`||t.key===` `)&&(t.preventDefault(),t.stopPropagation(),e.onClick())},disabled:e.disabled,className:r(`inline-flex items-center gap-1`,`rounded px-2 py-1`,`text-xs font-medium`,`transition-colors duration-150`,`focus:outline-none focus:ring-2 focus:ring-brand-500`,`disabled:opacity-50 disabled:pointer-events-none`,l[n]),"aria-label":e.label,title:e.label,children:[t&&(0,s.jsx)(t,{className:`h-3.5 w-3.5`,"aria-hidden":`true`}),(0,s.jsx)(`span`,{children:e.label})]},e.label)})}),u.__docgenInfo={description:`A table cell renderer that displays action buttons for row-level operations.
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
\`\`\``,methods:[],displayName:`ActionCell`,props:{actions:{required:!0,tsType:{name:`Array`,elements:[{name:`ActionCellButton`}],raw:`ActionCellButton[]`},description:``}}}})),f,p,m,h,g,_,v,y,b;e((()=>{f=t(),d(),p={title:`Components/Table/ActionCell`,component:u,parameters:{layout:`centered`},tags:[`autodocs`]},m={args:{actions:[{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete clicked!`)}]}},h={args:{actions:[{label:`Edit`,icon:`edit`,variant:`default`,onClick:()=>alert(`Edit clicked!`)}]}},g={args:{actions:[{label:`Edit`,icon:`edit`,variant:`default`,onClick:()=>alert(`Edit clicked!`)},{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete clicked!`)}]}},_={args:{actions:[{label:`Edit`,icon:`edit`,variant:`default`,onClick:()=>{},disabled:!0},{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete clicked!`)}]}},v={render:()=>(0,f.jsxs)(`div`,{className:`space-y-4`,children:[(0,f.jsx)(`h3`,{className:`text-lg font-semibold text-neutral-900 dark:text-neutral-100`,children:`RSE Attributes Table`}),(0,f.jsxs)(`table`,{className:`min-w-full divide-y divide-neutral-200 dark:divide-neutral-700`,children:[(0,f.jsx)(`thead`,{className:`bg-neutral-100 dark:bg-neutral-800`,children:(0,f.jsxs)(`tr`,{children:[(0,f.jsx)(`th`,{className:`px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase`,children:`Key`}),(0,f.jsx)(`th`,{className:`px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase`,children:`Value`}),(0,f.jsx)(`th`,{className:`px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase`,children:`Actions`})]})}),(0,f.jsx)(`tbody`,{className:`bg-neutral-0 dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700`,children:[{key:`fts`,value:`https://fts3.cern.ch:8446`},{key:`site`,value:`CERN`},{key:`tier`,value:`0`}].map(e=>(0,f.jsxs)(`tr`,{children:[(0,f.jsx)(`td`,{className:`px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100`,children:e.key}),(0,f.jsx)(`td`,{className:`px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300`,children:e.value}),(0,f.jsx)(`td`,{className:`px-6 py-4`,children:(0,f.jsx)(u,{actions:[{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete ${e.key}`)}]})})]},e.key))})]})]})},y={render:()=>(0,f.jsx)(`div`,{className:`dark p-4 bg-neutral-900 rounded-lg`,children:(0,f.jsxs)(`div`,{className:`flex gap-8`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`p`,{className:`text-xs text-neutral-400 mb-2`,children:`Default`}),(0,f.jsx)(u,{actions:[{label:`Edit`,icon:`edit`,variant:`default`,onClick:()=>{}}]})]}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`p`,{className:`text-xs text-neutral-400 mb-2`,children:`Error`}),(0,f.jsx)(u,{actions:[{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>{}}]})]}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`p`,{className:`text-xs text-neutral-400 mb-2`,children:`Multiple`}),(0,f.jsx)(u,{actions:[{label:`Edit`,icon:`edit`,variant:`default`,onClick:()=>{}},{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>{}}]})]})]})}),globals:{backgrounds:{value:`dark`}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => alert('Edit clicked!')
    }]
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => alert('Edit clicked!')
    }, {
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => {},
      disabled: true
    }, {
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">RSE Attributes Table</h3>
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-100 dark:bg-neutral-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">Key</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-neutral-0 dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {[{
          key: 'fts',
          value: 'https://fts3.cern.ch:8446'
        }, {
          key: 'site',
          value: 'CERN'
        }, {
          key: 'tier',
          value: '0'
        }].map(attr => <tr key={attr.key}>
                            <td className="px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100">{attr.key}</td>
                            <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">{attr.value}</td>
                            <td className="px-6 py-4">
                                <ActionCell actions={[{
              label: 'Delete',
              icon: 'delete',
              variant: 'error',
              onClick: () => alert(\`Delete \${attr.key}\`)
            }]} />
                            </td>
                        </tr>)}
                </tbody>
            </table>
        </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark p-4 bg-neutral-900 rounded-lg">
            <div className="flex gap-8">
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Default</p>
                    <ActionCell actions={[{
          label: 'Edit',
          icon: 'edit',
          variant: 'default',
          onClick: () => {}
        }]} />
                </div>
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Error</p>
                    <ActionCell actions={[{
          label: 'Delete',
          icon: 'delete',
          variant: 'error',
          onClick: () => {}
        }]} />
                </div>
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Multiple</p>
                    <ActionCell actions={[{
          label: 'Edit',
          icon: 'edit',
          variant: 'default',
          onClick: () => {}
        }, {
          label: 'Delete',
          icon: 'delete',
          variant: 'error',
          onClick: () => {}
        }]} />
                </div>
            </div>
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...y.parameters?.docs?.source}}},b=[`SingleDeleteAction`,`SingleEditAction`,`MultipleActions`,`DisabledAction`,`InTableContext`,`DarkMode`]}))();export{y as DarkMode,_ as DisabledAction,v as InTableContext,g as MultipleActions,m as SingleDeleteAction,h as SingleEditAction,b as __namedExportsOrder,p as default};