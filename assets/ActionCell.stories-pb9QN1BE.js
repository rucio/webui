import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./jsx-runtime-CndCZlyt.js";import{n,t as r}from"./ActionCell-B1c_LjiV.js";var i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{i=t(),n(),a={title:`Components/Table/ActionCell`,component:r,parameters:{layout:`centered`},tags:[`autodocs`]},o={args:{actions:[{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete clicked!`)}]}},s={args:{actions:[{label:`Edit`,icon:`edit`,variant:`neutral`,onClick:()=>alert(`Edit clicked!`)}]}},c={args:{actions:[{label:`Edit`,icon:`edit`,variant:`neutral`,onClick:()=>alert(`Edit clicked!`)},{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete clicked!`)}]}},l={args:{actions:[{label:`Edit`,icon:`edit`,variant:`neutral`,onClick:()=>{},disabled:!0},{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete clicked!`)}]}},u={render:()=>(0,i.jsxs)(`div`,{className:`space-y-4`,children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold text-neutral-900 dark:text-neutral-100`,children:`RSE Attributes Table`}),(0,i.jsxs)(`table`,{className:`min-w-full divide-y divide-neutral-200 dark:divide-neutral-700`,children:[(0,i.jsx)(`thead`,{className:`bg-neutral-100 dark:bg-neutral-800`,children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{className:`px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase`,children:`Key`}),(0,i.jsx)(`th`,{className:`px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase`,children:`Value`}),(0,i.jsx)(`th`,{className:`px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase`,children:`Actions`})]})}),(0,i.jsx)(`tbody`,{className:`bg-neutral-0 dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700`,children:[{key:`fts`,value:`https://fts3.cern.ch:8446`},{key:`site`,value:`CERN`},{key:`tier`,value:`0`}].map(e=>(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100`,children:e.key}),(0,i.jsx)(`td`,{className:`px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300`,children:e.value}),(0,i.jsx)(`td`,{className:`px-6 py-4`,children:(0,i.jsx)(r,{actions:[{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>alert(`Delete ${e.key}`)}]})})]},e.key))})]})]})},d={render:()=>(0,i.jsx)(`div`,{className:`dark p-4 bg-neutral-900 rounded-lg`,children:(0,i.jsxs)(`div`,{className:`flex gap-8`,children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{className:`text-xs text-neutral-400 mb-2`,children:`Neutral`}),(0,i.jsx)(r,{actions:[{label:`Edit`,icon:`edit`,variant:`neutral`,onClick:()=>{}}]})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{className:`text-xs text-neutral-400 mb-2`,children:`Error`}),(0,i.jsx)(r,{actions:[{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>{}}]})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{className:`text-xs text-neutral-400 mb-2`,children:`Multiple`}),(0,i.jsx)(r,{actions:[{label:`Edit`,icon:`edit`,variant:`neutral`,onClick:()=>{}},{label:`Delete`,icon:`delete`,variant:`error`,onClick:()=>{}}]})]})]})}),globals:{backgrounds:{value:`dark`}}},f=[`SingleDeleteAction`,`SingleEditAction`,`MultipleActions`,`DisabledAction`,`InTableContext`,`DarkMode`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'neutral',
      onClick: () => alert('Edit clicked!')
    }]
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'neutral',
      onClick: () => alert('Edit clicked!')
    }, {
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'neutral',
      onClick: () => {},
      disabled: true
    }, {
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark p-4 bg-neutral-900 rounded-lg">
            <div className="flex gap-8">
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Neutral</p>
                    <ActionCell actions={[{
          label: 'Edit',
          icon: 'edit',
          variant: 'neutral',
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
          variant: 'neutral',
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
      value: 'dark'
    }
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{d as DarkMode,l as DisabledAction,u as InTableContext,c as MultipleActions,o as SingleDeleteAction,s as SingleEditAction,f as __namedExportsOrder,a as default};