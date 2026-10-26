import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{i as r,m as i,n as a,t as o}from"./rucio-CT8PoFzM.js";import{n as s,r as c,t as l}from"./useStreamReader-D1-UWsFs.js";import{n as u,t as d}from"./Toaster-puS0tlJr.js";import{n as f,t as p}from"./AccountTypeBadge-C69sAIGs.js";import{r as m,t as h}from"./CopyableCell-DrlBeD2_.js";import{o as g,t as _}from"./ClickableCellsCollection-BVQJwHXU.js";import{i as v,r as y}from"./filter-parameters-cVHAYZDt.js";import{n as b,t as x}from"./NullBadge-DWIXk7lt.js";import{n as S,r as C,t as w}from"./badge-cell-BP9GAuX5.js";import{n as T,r as E,t as D}from"./AgGridMultiSelectFilter-xTer4wSe.js";import{n as O,t as k}from"./StreamedTable-BcBnt3hB.js";var A,j,M,N;function P(){return(P=e((()=>{A=n(),j=t(),i(),O(),g(),m(),C(),v(),E(),f(),b(),M=e=>e.value?(0,A.jsx)(h,{text:e.value}):(0,A.jsx)(x,{label:`none`,className:`my-2`}),N=e=>{let t=(0,j.useRef)(null),n=[...o],r=e=>a[e],[i]=(0,j.useState)([{headerName:`Account`,field:`account`,flex:3,minWidth:220,pinned:`left`,cellRenderer:_,filter:!0,filterParams:y,sort:`asc`},{headerName:`Type`,field:`accountType`,flex:1,minWidth:125,cellStyle:S,cellRenderer:p,cellRendererParams:{className:w},filter:{component:D,handler:T(n,r)},filterParams:{options:n,valueFormatter:r}},{headerName:`Email`,field:`email`,flex:3,minWidth:220,cellRenderer:M,filter:!0,filterParams:y}]);return(0,A.jsx)(k,{columnDefs:i,tableRef:t,...e,enableFilterHandlers:!0})},M.__docgenInfo={description:``,methods:[],displayName:`AccountEmailCell`,props:{value:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``}}},N.__docgenInfo={description:``,methods:[],displayName:`ListAccountsTable`,props:{streamingHook:{required:!0,tsType:{name:`UseStreamReader`,elements:[{name:`AccountListItemViewModel`}],raw:`UseStreamReader<AccountListItemViewModel>`},description:``},onGridReady:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: GridReadyEvent) => void`,signature:{arguments:[{type:{name:`GridReadyEvent`},name:`event`}],return:{name:`void`}}},description:``}}}})))()}var F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{F=n(),P(),i(),c(),u(),I=[{status:`success`,account:`jdoe`,accountType:r.USER,email:`jdoe@example.com`},{status:`success`,account:`atlas-phys`,accountType:r.GROUP,email:null},{status:`success`,account:`transfer-bot`,accountType:r.SERVICE,email:`ops@example.com`},{status:`success`,account:`root`,accountType:r.USER,email:null}],L=(e={})=>({status:s.STOPPED,error:void 0,start:()=>{},stop:()=>{},...e}),R=e=>t=>t.api.setGridOption(`rowData`,e),z={title:`Components/Pages/Account/List/ListAccountsTable`,component:N,decorators:[e=>(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(`div`,{className:`h-96`,children:(0,F.jsx)(e,{})}),(0,F.jsx)(d,{})]})]},B={args:{streamingHook:L(),onGridReady:R(I)}},V={args:{streamingHook:L(),onGridReady:R([])}},H={args:{streamingHook:L({error:{type:l.NETWORK_ERROR,message:`Could not reach the Rucio server.`}}),onGridReady:R([])}},U=[`Default`,`Empty`,`StreamError`],B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    streamingHook: hook(),
    onGridReady: fill(rows)
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    streamingHook: hook(),
    onGridReady: fill([])
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    streamingHook: hook({
      error: {
        type: StreamingErrorType.NETWORK_ERROR,
        message: 'Could not reach the Rucio server.'
      }
    }),
    onGridReady: fill([])
  }
}`,...H.parameters?.docs?.source}}}})))()}W();export{B as Default,V as Empty,H as StreamError,U as __namedExportsOrder,z as default};