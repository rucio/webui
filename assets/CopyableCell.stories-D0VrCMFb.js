import{j as e}from"./iframe-CbZ9RuD1.js";import{h as F}from"./index.esm-Bh9o6rCW.js";import{c as G}from"./utils-DsKtx5Xo.js";import{u as P}from"./useToast-YXabfrDf.js";import{c as z,e as H}from"./list-toasts-CqaY5F_J.js";import{T as Q}from"./Toaster-CU-bfwMZ.js";import"./preload-helper-Dp1pzeXC.js";import"./iconBase-BDSQWw1B.js";import"./tw-merge-Ds6tgvmq.js";import"./index-BVAf5DAB.js";import"./index-YEY9OEgd.js";import"./index-B5AF9blO.js";import"./index-Dwd-kS-d.js";import"./index-CI9TgWTM.js";import"./index-DSpI4bVK.js";const n=({text:s,children:m,className:y,showIcon:b=!0})=>{const{toast:x}=P(),r=a=>{a.stopPropagation(),navigator.clipboard.writeText(s).then(()=>{x(z)}).catch(()=>{x(H)})},h=a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),r(a))};return e.jsxs("div",{className:G("flex items-center gap-1 cursor-pointer",y),onClick:r,onKeyDown:h,role:"button",tabIndex:0,children:[b&&e.jsx(F,{className:"flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"}),m||e.jsx("span",{children:s})]})},o=({text:s,href:m,children:y,className:b,showIcon:x=!0})=>{const{toast:r}=P(),h=t=>{t.stopPropagation(),navigator.clipboard.writeText(s).then(()=>{r(z)}).catch(()=>{r(H)})},a=t=>{(t.target===t.currentTarget||t.target.tagName!=="svg")&&window.open(m,"_blank","noopener,noreferrer")},U=t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.stopPropagation(),h(t))},J=t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),window.open(m,"_blank","noopener,noreferrer"))};return e.jsxs("div",{className:G("flex items-center gap-1",b),children:[x&&e.jsx(F,{className:"flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer",onClick:h,onKeyDown:U,role:"button",tabIndex:0,title:"Copy to clipboard"}),e.jsx("div",{className:"cursor-pointer hover:underline",onClick:a,onKeyDown:J,role:"button",tabIndex:0,children:y||e.jsx("span",{children:s})})]})};n.__docgenInfo={description:`A table cell component that allows copying its content to clipboard on click.
Displays a copy icon and shows a toast notification when content is copied.

@example
\`\`\`tsx
<CopyableCell text="scope:dataset_name">
  scope:dataset_name
</CopyableCell>
\`\`\``,methods:[],displayName:"CopyableCell",props:{text:{required:!0,tsType:{name:"string"},description:"The text to be copied to clipboard when clicked"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to display in the cell. If not provided, the text prop will be displayed"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes to apply to the cell container"},showIcon:{required:!1,tsType:{name:"boolean"},description:"Whether to show the copy icon. Defaults to true",defaultValue:{value:"true",computed:!1}}}};o.__docgenInfo={description:`A table cell component that combines copy-to-clipboard functionality with a clickable link.
The copy icon copies the text to clipboard, while clicking the content navigates to the href.

@example
\`\`\`tsx
<CopyableLinkCell
  text="scope:dataset_name"
  href="/did/page/scope/dataset_name"
>
  scope:dataset_name
</CopyableLinkCell>
\`\`\``,methods:[],displayName:"CopyableLinkCell",props:{text:{required:!0,tsType:{name:"string"},description:"The text to be copied to clipboard when clicked"},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content to display in the cell. If not provided, the text prop will be displayed"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes to apply to the cell container"},showIcon:{required:!1,tsType:{name:"boolean"},description:"Whether to show the copy icon. Defaults to true",defaultValue:{value:"true",computed:!1}},href:{required:!0,tsType:{name:"string"},description:"The URL to navigate to when the link is clicked"}}};const me={title:"Components/Table/CopyableCell",decorators:[s=>e.jsxs("div",{className:"p-4",children:[e.jsx(s,{}),e.jsx(Q,{})]})],parameters:{docs:{description:{component:`CopyableCell components provide click-to-copy functionality for table cells.
They display content with an optional copy icon and show toast notifications when content is copied.`}}}},l={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Click anywhere on the cell to copy"}),e.jsx("table",{className:"border-collapse",children:e.jsxs("tbody",{children:[e.jsx("tr",{children:e.jsx("td",{className:"border p-2",children:e.jsx(n,{text:"user.scope:dataset_name_001",children:"user.scope:dataset_name_001"})})}),e.jsx("tr",{children:e.jsx("td",{className:"border p-2",children:e.jsx(n,{text:"mc16_13TeV:AOD.123456._000001.pool.root.1",children:"mc16_13TeV:AOD.123456._000001.pool.root.1"})})})]})})]})},i={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Copy functionality without visible icon"}),e.jsx("table",{className:"border-collapse",children:e.jsx("tbody",{children:e.jsx("tr",{children:e.jsx("td",{className:"border p-2",children:e.jsx(n,{text:"user.scope:dataset_name_002",showIcon:!1,children:"user.scope:dataset_name_002"})})})})})]})},d={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Click the icon to copy, click the text to navigate (opens in new tab)"}),e.jsx("table",{className:"border-collapse",children:e.jsxs("tbody",{children:[e.jsx("tr",{children:e.jsx("td",{className:"border p-2",children:e.jsx(o,{text:"user.scope:dataset_name_003",href:"/did/page/user.scope/dataset_name_003",children:"user.scope:dataset_name_003"})})}),e.jsx("tr",{children:e.jsx("td",{className:"border p-2",children:e.jsx(o,{text:"data18_13TeV:AOD.987654._000002.pool.root.1",href:"/did/page/data18_13TeV/AOD.987654._000002.pool.root.1",children:"data18_13TeV:AOD.987654._000002.pool.root.1"})})})]})})]})},c={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"DIDs Table with Copy Functionality"}),e.jsxs("table",{className:"min-w-full divide-y divide-gray-200 dark:divide-gray-700",children:[e.jsx("thead",{className:"bg-gray-50 dark:bg-gray-800",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"DID"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Type"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Size"})]})}),e.jsxs("tbody",{className:"bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700",children:[e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx(o,{text:"user.jdoe:MyDataset.v1",href:"/did/page/user.jdoe/MyDataset.v1",children:"user.jdoe:MyDataset.v1"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("span",{className:"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800",children:"Dataset"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:"2.5 GB"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx(o,{text:"mc16_13TeV:AOD.28395012._000001.pool.root.1",href:"/did/page/mc16_13TeV/AOD.28395012._000001.pool.root.1",children:"mc16_13TeV:AOD.28395012._000001.pool.root.1"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("span",{className:"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800",children:"File"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:"1.2 GB"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx(o,{text:"data18_13TeV:physics_Main.period_A",href:"/did/page/data18_13TeV/physics_Main.period_A",children:"data18_13TeV:physics_Main.period_A"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("span",{className:"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800",children:"Container"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:"15.8 TB"})]})]})]})]})},p={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Custom styled CopyableCells"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{text:"user.scope:highlighted_dataset",className:"bg-yellow-100 dark:bg-yellow-900 p-2 rounded",children:"user.scope:highlighted_dataset"}),e.jsx(n,{text:"user.scope:important_dataset",className:"text-red-600 dark:text-red-400 font-bold p-2",children:"user.scope:important_dataset"}),e.jsx(n,{text:"user.scope:large_dataset",className:"text-lg p-2 border-l-4 border-blue-500",children:"user.scope:large_dataset"})]})]})};var u,g,C,_,f;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <h3 className="text-lg font-semibold">Click anywhere on the cell to copy</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <CopyableCell text="user.scope:dataset_name_001">user.scope:dataset_name_001</CopyableCell>
                        </td>
                    </tr>
                    <tr>
                        <td className="border p-2">
                            <CopyableCell text="mc16_13TeV:AOD.123456._000001.pool.root.1">mc16_13TeV:AOD.123456._000001.pool.root.1</CopyableCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
}`,...(C=(g=l.parameters)==null?void 0:g.docs)==null?void 0:C.source},description:{story:"Basic CopyableCell that copies text to clipboard when clicked",...(f=(_=l.parameters)==null?void 0:_.docs)==null?void 0:f.description}}};var w,N,j,k,v;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <h3 className="text-lg font-semibold">Copy functionality without visible icon</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <CopyableCell text="user.scope:dataset_name_002" showIcon={false}>
                                user.scope:dataset_name_002
                            </CopyableCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
}`,...(j=(N=i.parameters)==null?void 0:N.docs)==null?void 0:j.source},description:{story:"CopyableCell without the copy icon",...(v=(k=i.parameters)==null?void 0:k.docs)==null?void 0:v.description}}};var T,D,A,V,L;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <h3 className="text-lg font-semibold">Click the icon to copy, click the text to navigate (opens in new tab)</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <CopyableLinkCell text="user.scope:dataset_name_003" href="/did/page/user.scope/dataset_name_003">
                                user.scope:dataset_name_003
                            </CopyableLinkCell>
                        </td>
                    </tr>
                    <tr>
                        <td className="border p-2">
                            <CopyableLinkCell text="data18_13TeV:AOD.987654._000002.pool.root.1" href="/did/page/data18_13TeV/AOD.987654._000002.pool.root.1">
                                data18_13TeV:AOD.987654._000002.pool.root.1
                            </CopyableLinkCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
}`,...(A=(D=d.parameters)==null?void 0:D.docs)==null?void 0:A.source},description:{story:"CopyableLinkCell combines copy functionality with navigation",...(L=(V=d.parameters)==null?void 0:V.docs)==null?void 0:L.description}}};var I,O,M,S,R;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <h3 className="text-lg font-semibold">DIDs Table with Copy Functionality</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <CopyableLinkCell text="user.jdoe:MyDataset.v1" href="/did/page/user.jdoe/MyDataset.v1">
                                user.jdoe:MyDataset.v1
                            </CopyableLinkCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Dataset</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.5 GB</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <CopyableLinkCell text="mc16_13TeV:AOD.28395012._000001.pool.root.1" href="/did/page/mc16_13TeV/AOD.28395012._000001.pool.root.1">
                                mc16_13TeV:AOD.28395012._000001.pool.root.1
                            </CopyableLinkCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">File</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.2 GB</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <CopyableLinkCell text="data18_13TeV:physics_Main.period_A" href="/did/page/data18_13TeV/physics_Main.period_A">
                                data18_13TeV:physics_Main.period_A
                            </CopyableLinkCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Container
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15.8 TB</td>
                    </tr>
                </tbody>
            </table>
        </div>
}`,...(M=(O=c.parameters)==null?void 0:O.docs)==null?void 0:M.source},description:{story:"Multiple CopyableCells in a table demonstrating real-world usage",...(R=(S=c.parameters)==null?void 0:S.docs)==null?void 0:R.description}}};var q,B,E,K,W;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom styled CopyableCells</h3>
            <div className="space-y-2">
                <CopyableCell text="user.scope:highlighted_dataset" className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                    user.scope:highlighted_dataset
                </CopyableCell>
                <CopyableCell text="user.scope:important_dataset" className="text-red-600 dark:text-red-400 font-bold p-2">
                    user.scope:important_dataset
                </CopyableCell>
                <CopyableCell text="user.scope:large_dataset" className="text-lg p-2 border-l-4 border-blue-500">
                    user.scope:large_dataset
                </CopyableCell>
            </div>
        </div>
}`,...(E=(B=p.parameters)==null?void 0:B.docs)==null?void 0:E.source},description:{story:"Demonstrating custom styling with className prop",...(W=(K=p.parameters)==null?void 0:K.docs)==null?void 0:W.description}}};const xe=["BasicCopyableCell","WithoutIcon","LinkWithCopy","InTableContext","CustomStyling"];export{l as BasicCopyableCell,p as CustomStyling,c as InTableContext,d as LinkWithCopy,i as WithoutIcon,xe as __namedExportsOrder,me as default};
