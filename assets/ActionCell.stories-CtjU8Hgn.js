import{j as e}from"./iframe-CW9-_HYS.js";import{L as R,I}from"./index.esm-DWUw-EzS.js";import{c as u}from"./utils-DsKtx5Xo.js";import"./preload-helper-Dp1pzeXC.js";import"./iconBase-_tCx069T.js";import"./tw-merge-Ds6tgvmq.js";const G={delete:I,edit:R},_={default:u("text-neutral-600 dark:text-neutral-400","hover:text-brand-600 dark:hover:text-brand-400","hover:bg-brand-100 dark:hover:bg-brand-900/30"),error:u("text-neutral-600 dark:text-neutral-400","hover:text-base-error-600 dark:hover:text-base-error-400","hover:bg-base-error-100 dark:hover:bg-base-error-900/30")},l=({actions:a})=>e.jsx("div",{className:"flex items-center gap-1 h-full",children:a.map(t=>{const x=t.icon?G[t.icon]:null,T=t.variant||"default";return e.jsxs("button",{type:"button",onClick:r=>{r.stopPropagation(),t.onClick()},onKeyDown:r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),r.stopPropagation(),t.onClick())},disabled:t.disabled,className:u("inline-flex items-center gap-1","rounded px-2 py-1","text-xs font-medium","transition-colors duration-150","focus:outline-none focus:ring-2 focus:ring-brand-500","disabled:opacity-50 disabled:pointer-events-none",_[T]),"aria-label":t.label,title:t.label,children:[x&&e.jsx(x,{className:"h-3.5 w-3.5","aria-hidden":"true"}),e.jsx("span",{children:t.label})]},t.label)})});l.__docgenInfo={description:`A table cell renderer that displays action buttons for row-level operations.
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
\`\`\``,methods:[],displayName:"ActionCell",props:{actions:{required:!0,tsType:{name:"Array",elements:[{name:"ActionCellButton"}],raw:"ActionCellButton[]"},description:""}}};const $={title:"Components/Table/ActionCell",component:l,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{actions:[{label:"Delete",icon:"delete",variant:"error",onClick:()=>alert("Delete clicked!")}]}},i={args:{actions:[{label:"Edit",icon:"edit",variant:"default",onClick:()=>alert("Edit clicked!")}]}},s={args:{actions:[{label:"Edit",icon:"edit",variant:"default",onClick:()=>alert("Edit clicked!")},{label:"Delete",icon:"delete",variant:"error",onClick:()=>alert("Delete clicked!")}]}},d={args:{actions:[{label:"Edit",icon:"edit",variant:"default",onClick:()=>{},disabled:!0},{label:"Delete",icon:"delete",variant:"error",onClick:()=>alert("Delete clicked!")}]}},o={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold text-neutral-900 dark:text-neutral-100",children:"RSE Attributes Table"}),e.jsxs("table",{className:"min-w-full divide-y divide-neutral-200 dark:divide-neutral-700",children:[e.jsx("thead",{className:"bg-neutral-100 dark:bg-neutral-800",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase",children:"Key"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase",children:"Value"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase",children:"Actions"})]})}),e.jsx("tbody",{className:"bg-neutral-0 dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700",children:[{key:"fts",value:"https://fts3.cern.ch:8446"},{key:"site",value:"CERN"},{key:"tier",value:"0"}].map(a=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100",children:a.key}),e.jsx("td",{className:"px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300",children:a.value}),e.jsx("td",{className:"px-6 py-4",children:e.jsx(l,{actions:[{label:"Delete",icon:"delete",variant:"error",onClick:()=>alert(`Delete ${a.key}`)}]})})]},a.key))})]})]})},c={render:()=>e.jsx("div",{className:"dark p-4 bg-neutral-900 rounded-lg",children:e.jsxs("div",{className:"flex gap-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-400 mb-2",children:"Default"}),e.jsx(l,{actions:[{label:"Edit",icon:"edit",variant:"default",onClick:()=>{}}]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-400 mb-2",children:"Error"}),e.jsx(l,{actions:[{label:"Delete",icon:"delete",variant:"error",onClick:()=>{}}]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-neutral-400 mb-2",children:"Multiple"}),e.jsx(l,{actions:[{label:"Edit",icon:"edit",variant:"default",onClick:()=>{}},{label:"Delete",icon:"delete",variant:"error",onClick:()=>{}}]})]})]})}),globals:{backgrounds:{value:"dark"}}};var p,m,b;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Delete',
      icon: 'delete',
      variant: 'error',
      onClick: () => alert('Delete clicked!')
    }]
  }
}`,...(b=(m=n.parameters)==null?void 0:m.docs)==null?void 0:b.source}}};var k,v,h;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    actions: [{
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => alert('Edit clicked!')
    }]
  }
}`,...(h=(v=i.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var f,g,y;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(y=(g=s.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var C,N,D;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(D=(N=d.parameters)==null?void 0:N.docs)==null?void 0:D.source}}};var j,A,E;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(E=(A=o.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var S,w,M;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(M=(w=c.parameters)==null?void 0:w.docs)==null?void 0:M.source}}};const q=["SingleDeleteAction","SingleEditAction","MultipleActions","DisabledAction","InTableContext","DarkMode"];export{c as DarkMode,d as DisabledAction,o as InTableContext,s as MultipleActions,n as SingleDeleteAction,i as SingleEditAction,q as __namedExportsOrder,$ as default};
