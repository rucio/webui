import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./checkbox-Bh8ZjCgL.js";import{i as a,n as o,r as s,t as c}from"./HttpResponse-DrkeJQzv.js";var l,u,d,f;function p(){return(p=e((()=>{l=n(),r(),u=t(),d=(e,t)=>()=>({doesFilterPass:({model:e,node:t,handlerParams:n})=>{if(!e)return!0;let r=n.getValue(t);return e.includes(r)},getModelAsString:n=>n===null?``:n.length===0?`(0)`:n.length===1?`${t?t(n[0]):String(n[0])}`:n.length>1&&n.length===e.length?`All`:`(${n.length}) ${t?n.map(e=>t(e)).join(`, `):n.join(`, `)}`}),f=({model:e,onModelChange:t,options:n,valueFormatter:r})=>{let a=e??[...n],[o,s]=(0,u.useState)([...n]),c=e=>{let r=a.includes(e)?a.filter(t=>t!==e):[...a,e];r.length===n.length?t(null):t(r)};return(0,l.jsxs)(`div`,{className:`flex flex-col p-3 gap-y-2`,children:[(0,l.jsx)(`input`,{type:`text`,placeholder:`Search...`,className:`ag-input-field-input mb-1`,onChange:e=>s(n.filter(t=>r?r(t).toLowerCase().startsWith(e.target.value.toLowerCase()):String(t).toLowerCase().startsWith(e.target.value.toLowerCase())))}),o.length>0?(0,l.jsxs)(`div`,{className:`flex items-center`,children:[(0,l.jsx)(i,{id:`checkbox-all`,className:`mr-2`,checked:o.every(e=>a.includes(e)),onClick:()=>{o.every(e=>a.includes(e))?t(a.filter(e=>!o.includes(e))):o.length===n.length?t(null):t([...a,...o.filter(e=>!a.includes(e))])}}),(0,l.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-all`,children:`(Select all)`})]}):(0,l.jsx)(`div`,{className:`p-3`,children:`No matches.`}),o.map(e=>(0,l.jsxs)(`div`,{className:`flex items-center`,children:[(0,l.jsx)(i,{id:`checkbox-${String(e)}`,className:`mr-2`,checked:a.includes(e),onClick:()=>c(e)}),(0,l.jsx)(`label`,{className:`hover:cursor-pointer`,htmlFor:`checkbox-${String(e)}`,children:r?r(e):String(e)})]},String(e)))]})},f.__docgenInfo={description:`Multiple-selection filter for AG Grid tables.

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
\`\`\``,methods:[],displayName:`AgGridMultiSelectFilter`,props:{options:{required:!0,tsType:{name:`Array`,elements:[{name:`T`}],raw:`T[]`},description:``},valueFormatter:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: T) => string`,signature:{arguments:[{type:{name:`T`},name:`value`}],return:{name:`string`}}},description:``}}}})))()}var m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a(),o(),m=new TextEncoder,h={"Content-Type":`application/json`,"Transfer-Encoding":`chunked`},g=()=>c.json({message:`Unsuccessful validation`},{status:400}),_=(e,t)=>{let n=async({request:e})=>{let{data:n,delay:r,isRequestValid:i}=t;if(i&&!i(e))return g();let a=new ReadableStream({async start(e){for(let t of n){let n=JSON.stringify(t)+`
`;e.enqueue(m.encode(n)),r&&await new Promise(e=>setTimeout(e,r))}e.close()}});return new Response(a,{headers:h})};return t.method===`POST`?s.post(e,n):s.get(e,n)},v=e=>s.get(e,async()=>{let e=new ReadableStream({async start(e){e.enqueue(m.encode(`{test.failing}
bad:formatting`)),e.close()}});return new Response(e,{headers:h})}),y=(e,t)=>s.get(e,async()=>{let e=new ReadableStream({async start(e){let n=t.map(e=>JSON.stringify(e)).join(`
`)+`
`,r=n;r+=`{bad:formatting
`,r+=n,e.enqueue(m.encode(r)),e.close()}});return new Response(e,{headers:h})}),b=e=>{let t=Math.floor(Math.random()*(e.length-1))+1,n=new Set;for(;n.size<t-1;){let t=Math.floor(Math.random()*(e.length-1))+1;n.add(t)}let r=[...n].sort((e,t)=>e-t),i=[],a=0;for(let t of r)i.push(e.slice(a,t)),a=t;return i.push(e.slice(a)),i},x=(e,t)=>s.get(e,async({request:e})=>{let{data:n,delay:r,isRequestValid:i}=t;if(i&&!i(e))return g();let a=new ReadableStream({async start(e){let t=``;for(let e of n)t+=JSON.stringify(e)+`
`;let i=b(t);for(let t of i)e.enqueue(m.encode(t)),r&&await new Promise(e=>setTimeout(e,r));e.close()}});return new Response(a,{headers:h})})})))()}export{S as a,p as c,y as i,x as n,f as o,_ as r,d as s,v as t};