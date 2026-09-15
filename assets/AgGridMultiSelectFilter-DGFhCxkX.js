import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{kt as n,on as r}from"./iframe-B1_WYtkJ.js";import{n as i,t as a}from"./checkbox-CsSJxlED.js";var o,s,c,l,u=e((()=>{o=n(),i(),s=t(r()),c=(e,t)=>()=>({doesFilterPass:({model:e,node:t,handlerParams:n})=>{if(!e)return!0;let r=n.getValue(t);return e.includes(r)},getModelAsString:n=>n===null?``:n.length===0?`(0)`:n.length===1?`${t?t(n[0]):String(n[0])}`:n.length>1&&n.length===e.length?`All`:`(${n.length}) ${t?n.map(e=>t(e)).join(`, `):n.join(`, `)}`}),l=({model:e,onModelChange:t,options:n,valueFormatter:r})=>{let i=e??[...n],[c,l]=(0,s.useState)([...n]),u=e=>{let r=i.includes(e)?i.filter(t=>t!==e):[...i,e];r.length===n.length?t(null):t(r)};return(0,o.jsxs)(`div`,{className:`flex flex-col p-3 gap-y-2`,children:[(0,o.jsx)(`input`,{type:`text`,placeholder:`Search...`,className:`ag-input-field-input mb-1`,onChange:e=>l(n.filter(t=>r?r(t).toLowerCase().startsWith(e.target.value.toLowerCase()):String(t).toLowerCase().startsWith(e.target.value.toLowerCase())))}),c.length>0?(0,o.jsxs)(`div`,{className:`flex items-center`,children:[(0,o.jsx)(a,{id:`checkbox-all`,className:`mr-2`,checked:c.every(e=>i.includes(e)),onClick:()=>{c.every(e=>i.includes(e))?t(i.filter(e=>!c.includes(e))):c.length===n.length?t(null):t([...i,...c.filter(e=>!i.includes(e))])}}),(0,o.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-all`,children:`(Select all)`})]}):(0,o.jsx)(`div`,{className:`p-3`,children:`No matches.`}),c.map(e=>(0,o.jsxs)(`div`,{className:`flex items-center`,children:[(0,o.jsx)(a,{id:`checkbox-${String(e)}`,className:`mr-2`,checked:i.includes(e),onClick:()=>u(e)}),(0,o.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-${String(e)}`,children:r?r(e):String(e)})]},String(e)))]})},l.__docgenInfo={description:`Multiple-selection filter for AG Grid tables.

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
\`\`\``,methods:[],displayName:`AgGridMultiSelectFilter`,props:{options:{required:!0,tsType:{name:`Array`,elements:[{name:`T`}],raw:`T[]`},description:``},valueFormatter:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: T) => string`,signature:{arguments:[{type:{name:`T`},name:`value`}],return:{name:`string`}}},description:``}}}}));export{c as n,u as r,l as t};