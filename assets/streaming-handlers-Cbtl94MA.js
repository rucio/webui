import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Ot as n,on as r}from"./iframe-CpWC1arH.js";import{n as i,t as a}from"./checkbox-BnHbo78g.js";import{i as o,n as s,t as c}from"./core-CVF_imeo.js";var l,u,d,f,p=e((()=>{l=n(),i(),u=t(r()),d=(e,t)=>()=>({doesFilterPass:({model:e,node:t,handlerParams:n})=>{if(!e)return!0;let r=n.getValue(t);return e.includes(r)},getModelAsString:n=>n===null?``:n.length===0?`(0)`:n.length===1?`${t?t(n[0]):String(n[0])}`:n.length>1&&n.length===e.length?`All`:`(${n.length}) ${t?n.map(e=>t(e)).join(`, `):n.join(`, `)}`}),f=({model:e,onModelChange:t,options:n,valueFormatter:r})=>{let i=e??[...n],[o,s]=(0,u.useState)([...n]),c=e=>{let r=i.includes(e)?i.filter(t=>t!==e):[...i,e];r.length===n.length?t(null):t(r)};return(0,l.jsxs)(`div`,{className:`flex flex-col p-3 gap-y-2`,children:[(0,l.jsx)(`input`,{type:`text`,placeholder:`Search...`,className:`ag-input-field-input mb-1`,onChange:e=>s(n.filter(t=>r?r(t).toLowerCase().startsWith(e.target.value.toLowerCase()):String(t).toLowerCase().startsWith(e.target.value.toLowerCase())))}),o.length>0?(0,l.jsxs)(`div`,{className:`flex items-center`,children:[(0,l.jsx)(a,{id:`checkbox-all`,className:`mr-2`,checked:o.every(e=>i.includes(e)),onClick:()=>{o.every(e=>i.includes(e))?t(i.filter(e=>!o.includes(e))):o.length===n.length?t(null):t([...i,...o.filter(e=>!i.includes(e))])}}),(0,l.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-all`,children:`(Select all)`})]}):(0,l.jsx)(`div`,{className:`p-3`,children:`No matches.`}),o.map(e=>(0,l.jsxs)(`div`,{className:`flex items-center`,children:[(0,l.jsx)(a,{id:`checkbox-${String(e)}`,className:`mr-2`,checked:i.includes(e),onClick:()=>c(e)}),(0,l.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-${String(e)}`,children:r?r(e):String(e)})]},String(e)))]})},f.__docgenInfo={description:`Multiple-selection filter for AG Grid tables.

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
\`\`\``,methods:[],displayName:`AgGridMultiSelectFilter`,props:{options:{required:!0,tsType:{name:`Array`,elements:[{name:`T`}],raw:`T[]`},description:``},valueFormatter:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: T) => string`,signature:{arguments:[{type:{name:`T`},name:`value`}],return:{name:`string`}}},description:``}}}})),m,h,g,_,v,y,b,x,S=e((()=>{c(),m=new TextEncoder,h={"Content-Type":`application/json`,"Transfer-Encoding":`chunked`},g=()=>s.json({message:`Unsuccessful validation`},{status:400}),_=(e,t)=>{let n=async({request:e})=>{let{data:n,delay:r,isRequestValid:i}=t;if(i&&!i(e))return g();let a=new ReadableStream({async start(e){for(let t of n){let n=JSON.stringify(t)+`
`;e.enqueue(m.encode(n)),r&&await new Promise(e=>setTimeout(e,r))}e.close()}});return new Response(a,{headers:h})};return t.method===`POST`?o.post(e,n):o.get(e,n)},v=e=>o.get(e,async()=>{let e=new ReadableStream({async start(e){e.enqueue(m.encode(`{test.failing}
bad:formatting`)),e.close()}});return new Response(e,{headers:h})}),y=(e,t)=>o.get(e,async()=>{let e=new ReadableStream({async start(e){let n=t.map(e=>JSON.stringify(e)).join(`
`)+`
`,r=n;r+=`{bad:formatting
`,r+=n,e.enqueue(m.encode(r)),e.close()}});return new Response(e,{headers:h})}),b=e=>{let t=Math.floor(Math.random()*(e.length-1))+1,n=new Set;for(;n.size<t-1;){let t=Math.floor(Math.random()*(e.length-1))+1;n.add(t)}let r=[...n].sort((e,t)=>e-t),i=[],a=0;for(let t of r)i.push(e.slice(a,t)),a=t;return i.push(e.slice(a)),i},x=(e,t)=>o.get(e,async({request:e})=>{let{data:n,delay:r,isRequestValid:i}=t;if(i&&!i(e))return g();let a=new ReadableStream({async start(e){let t=``;for(let e of n)t+=JSON.stringify(e)+`
`;let i=b(t);for(let t of i)e.enqueue(m.encode(t)),r&&await new Promise(e=>setTimeout(e,r));e.close()}});return new Response(a,{headers:h})})}));export{S as a,p as c,y as i,x as n,f as o,_ as r,d as s,v as t};