import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./checkbox-Cqoo1F29.js";var a,o,s,c;function l(){return(l=e((()=>{a=n(),r(),o=t(),s=(e,t)=>()=>({doesFilterPass:({model:e,node:t,handlerParams:n})=>{if(!e)return!0;let r=n.getValue(t);return e.includes(r)},getModelAsString:n=>n===null?``:n.length===0?`(0)`:n.length===1?`${t?t(n[0]):String(n[0])}`:n.length>1&&n.length===e.length?`All`:`(${n.length}) ${t?n.map(e=>t(e)).join(`, `):n.join(`, `)}`}),c=({model:e,onModelChange:t,options:n,valueFormatter:r})=>{let s=e??[...n],[c,l]=(0,o.useState)([...n]),u=e=>{let r=s.includes(e)?s.filter(t=>t!==e):[...s,e];r.length===n.length?t(null):t(r)};return(0,a.jsxs)(`div`,{className:`flex flex-col p-3 gap-y-2`,children:[(0,a.jsx)(`input`,{type:`text`,placeholder:`Search...`,className:`ag-input-field-input mb-1`,onChange:e=>l(n.filter(t=>r?r(t).toLowerCase().startsWith(e.target.value.toLowerCase()):String(t).toLowerCase().startsWith(e.target.value.toLowerCase())))}),c.length>0?(0,a.jsxs)(`div`,{className:`flex items-center`,children:[(0,a.jsx)(i,{id:`checkbox-all`,className:`mr-2`,checked:c.every(e=>s.includes(e)),onClick:()=>{c.every(e=>s.includes(e))?t(s.filter(e=>!c.includes(e))):c.length===n.length?t(null):t([...s,...c.filter(e=>!s.includes(e))])}}),(0,a.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-all`,children:`(Select all)`})]}):(0,a.jsx)(`div`,{className:`p-3`,children:`No matches.`}),c.map(e=>(0,a.jsxs)(`div`,{className:`flex items-center`,children:[(0,a.jsx)(i,{id:`checkbox-${String(e)}`,className:`mr-2`,checked:s.includes(e),onClick:()=>u(e)}),(0,a.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-${String(e)}`,children:r?r(e):String(e)})]},String(e)))]})},c.__docgenInfo={description:`Multiple-selection filter for AG Grid tables.

@example
\`\`\`
const [columnDefs] = useState([
        ...
        {
            headerName: 'State',
            field: 'state',
            ...
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(
                        replicaStateOptions,
                        replicaStateValueFormatter
                    ),
            },
            filterParams: {
                options: replicaStateOptions,
                valueFormatter: replicaStateValueFormatter,
            },
        },
    ]);

    ...

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} enableFilterHandlers />;
\`\`\``,methods:[],displayName:`AgGridMultiSelectFilter`,props:{options:{required:!0,tsType:{name:`Array`,elements:[{name:`T`}],raw:`T[]`},description:``},valueFormatter:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: T) => string`,signature:{arguments:[{type:{name:`T`},name:`value`}],return:{name:`string`}}},description:``}}}})))()}export{s as n,l as r,c as t};