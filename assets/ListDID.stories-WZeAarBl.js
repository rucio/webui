import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{m as r,o as i}from"./rucio-CT8PoFzM.js";import{a,g as o,i as s,o as c}from"./table-fixtures-CtlIA4ga.js";import{n as ee,r as l}from"./useStreamReader-D1-UWsFs.js";import{n as u,t as d}from"./LoadingSpinner-rJh-4z2j.js";import{r as te,t as f}from"./useToast-CRIT78yc.js";import{n as p,r as ne,t as m}from"./QueryClientProvider-OcdqK2i_.js";import{n as re,t as h}from"./useQuery-DWUiilJF.js";import{n as ie,t as ae}from"./queryClient-DIj1eP1H.js";import{i as g,r as oe}from"./filter-parameters-cVHAYZDt.js";import{n as _,r as se,t as ce}from"./badge-cell-BP9GAuX5.js";import{n as le,r as ue,t as de}from"./AgGridMultiSelectFilter-xTer4wSe.js";import{i as fe,n as pe,r as me,t as he}from"./StreamedTable-BcBnt3hB.js";import{n as ge,t as _e}from"./DIDTypeBadge-CR_fSI2O.js";import{n as ve,t as ye}from"./ToastedTemplate-ChQXsPRH.js";import{n as be,t as xe}from"./BaseViewModelValidator-TRzRT57d.js";import{n as Se,t as Ce}from"./ListDIDMeta-BsEJG5xS.js";import{n as we,t as Te}from"./useTableStreaming-BQxsiwCu.js";import{n as Ee,t as De}from"./DIDSearchPanel-B76OQSy5.js";import{a as v,o as Oe}from"./HttpResponse-DrkeJQzv.js";import{a as ke,r as y}from"./streaming-handlers-BN9W6IxU.js";import{n as Ae,t as b}from"./single-handlers-CQ0K52u6.js";import{n as je,t as Me}from"./error-handlers-DWFKD2ib.js";var x,S,C,w,Ne,T;function E(){return(E=e((()=>{x=n(),r(),u(),fe(),l(),S={[i.CONTAINER]:`containers`,[i.DATASET]:`datasets`,[i.FILE]:`files`},C={"refine-wildcard":{primary:`Please refine the DID name.`,secondary:`Wildcard searches on files are not supported. Narrow the name, or search the File type directly.`},"no-results":{primary:`No DIDs matched this query.`,secondary:`Containers, datasets and files were all searched.`},"files-skipped":{primary:`Files were not searched.`,secondary:`Wildcard searches on files are not supported. Search the File type directly to include them.`}},w=e=>{let t=e.map(e=>S[e]??String(e).toLowerCase());return t.length<=1?t.join(``):`${t.slice(0,-1).join(`, `)} and ${t[t.length-1]}`},Ne=e=>{if(e.kind!==`progress`||!e.progress)return null;let t=w(e.progress.types);return e.progress.state===`searching`?`Searching ${t}...`:e.progress.state===`empty`?`No ${t} matched.`:`Found ${t}.`},T=({records:e,status:t,error:n})=>{if(n)return(0,x.jsx)(me,{error:n,status:t});let r=[...e].reverse().find(e=>e.kind===`notice`);if(r?.notice){let e=C[r.notice.code];return(0,x.jsxs)(`div`,{className:`flex flex-col items-center gap-1 text-center px-4`,children:[(0,x.jsx)(`p`,{className:`text-sm font-medium text-neutral-700 dark:text-neutral-100`,children:e?.primary??r.notice.message}),e?.secondary&&(0,x.jsx)(`p`,{className:`text-xs text-neutral-500 dark:text-neutral-400`,children:e.secondary})]})}if(t===ee.RUNNING){let t=[...e].reverse().map(Ne).find(Boolean);return(0,x.jsxs)(`div`,{className:`flex flex-col items-center gap-2 text-center px-4`,children:[(0,x.jsx)(d,{}),t&&(0,x.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-100`,children:t})]})}return(0,x.jsx)(me,{error:n,status:t})},T.__docgenInfo={description:`The table's empty state during and after an All search.

The cascade reports which type it is looking at as it goes; that belongs where
the results will land, not as standing text elsewhere on the page. Showing only
the current step keeps it reading as activity rather than as a log that never
clears. Anything the cascade has no opinion on falls through to the standard
streaming overlay.`,methods:[],displayName:`DIDSearchOverlay`,props:{records:{required:!0,tsType:{name:`Array`,elements:[{name:`ListDIDsViewModel`}],raw:`ListDIDsViewModel[]`},description:``},status:{required:!0,tsType:{name:`StreamingStatus`},description:``},error:{required:!1,tsType:{name:`StreamingError`},description:``}}}})))()}function Pe(e){let t=[i.CONTAINER,i.DATASET,i.FILE],n={headerName:`Identifier`,valueGetter:e=>e.data?.scope+`:`+e.data?.name,flex:1,minWidth:250,filter:!0,filterParams:oe};return e?[n,{headerName:`Type`,field:`did_type`,cellRenderer:_e,minWidth:180,cellStyle:_,cellRendererParams:{className:ce},filter:{component:de,handler:le(t)},filterParams:{options:t}}]:[n]}var D,O,k;function Fe(){return(Fe=e((()=>{D=n(),O=t(),pe(),g(),ge(),se(),E(),r(),ue(),k=e=>{let t=(0,O.useRef)(null),{showTypeColumn:n,searchRecords:r,...i}=e,a=(0,O.useMemo)(()=>Pe(n??!1),[n]);return(0,O.useEffect)(()=>{let e=t.current?.api;e&&(r??[]).some(e=>e.kind===`notice`)&&e.getDisplayedRowCount()===0&&e.showNoRowsOverlay()},[r,e.streamingHook.status]),(0,D.jsx)(he,{columnDefs:a,rowSelection:{mode:`singleRow`,enableClickSelection:!0},tableRef:t,noRowsOverlayComponent:t=>(0,D.jsx)(T,{records:r??[],status:e.streamingHook.status,error:e.streamingHook.error,...t}),enableFilterHandlers:!0,...i})},k.__docgenInfo={description:``,methods:[],displayName:`ListDIDTable`,props:{streamingHook:{required:!0,tsType:{name:`UseStreamReader`,elements:[{name:`DIDViewModel`}],raw:`UseStreamReader<DIDViewModel>`},description:``},onSelectionChanged:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: SelectionChangedEvent) => void`,signature:{arguments:[{type:{name:`SelectionChangedEvent`},name:`event`}],return:{name:`void`}}},description:``},onGridReady:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: GridReadyEvent) => void`,signature:{arguments:[{type:{name:`GridReadyEvent`},name:`event`}],return:{name:`void`}}},description:``},showTypeColumn:{required:!1,tsType:{name:`boolean`},description:`Show the DID type per row. True when the search was not pinned to one type.`},searchRecords:{required:!1,tsType:{name:`Array`,elements:[{name:`ListDIDsViewModel`}],raw:`ListDIDsViewModel[]`},description:`Progress and notice records from an All search, rendered as the empty state.`}}}})))()}var A,j,M;function Ie(){return(Ie=e((()=>{A=n(),r(),j=t(),l(),f(),h(),p(),Fe(),be(),Se(),Te(),Ee(),E(),M=e=>{let{toast:t}=te(),n=new xe(t),[r,a]=(0,j.useState)([]),[o,s]=(0,j.useState)(e.initialType??i.ALL),{onGridReady:c,streamingHook:l,startStreaming:u,stopStreaming:d,gridApi:f}=we(e.initialData,{onMetaRecord:e=>{let n=e;a(e=>[...e,n]);let r=n.kind===`notice`?n.notice?.code:void 0;(r===`refine-wildcard`||r===`files-skipped`)&&t({variant:`warning`,title:C[r].primary,description:C[r].secondary})}}),p=(0,j.useRef)(!1);(0,j.useEffect)(()=>{if(!p.current&&e.autoSearch&&f&&e.firstPattern){p.current=!0;let t=e.firstPattern.split(`:`);if(t.length===2){let[n,r]=t,a=`/api/feature/list-dids?`+new URLSearchParams({query:e.firstPattern,type:e.initialType??i.ALL});u(a)}}},[f]);let[m,h]=(0,j.useState)(null),ie=e=>{let t=e.api.getSelectedRows();t.length===1?h(t[0]):h(null)},ae=async()=>{if(m!==null){let e=`/api/feature/get-did-meta?`+new URLSearchParams({scope:m.scope,name:m.name}),t=await fetch(e);if(!t.ok)throw Error(t.statusText);let r=await t.json();if(n.isValid(r))return r}return null},g=[`meta`],{data:oe,error:_,isFetching:se,refetch:ce}=re({queryKey:g,queryFn:ae,enabled:!1,retry:!1}),le=ne();return(0,j.useEffect)(()=>{(async()=>{await le.cancelQueries({queryKey:g}),ce()})()},[m]),(0,j.useEffect)(()=>{_!==null&&t({variant:`error`,title:`Fatal error`,description:`Cannot retrieve metadata.`})},[_]),(0,A.jsxs)(`div`,{className:`flex flex-col space-y-6 w-full`,children:[(0,A.jsx)(`div`,{className:`rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs p-6`,children:(0,A.jsx)(De,{isRunning:l.status===ee.RUNNING,startStreaming:u,stopStreaming:d,initialPattern:e.firstPattern,autoSearch:e.autoSearch,initialType:e.initialType,onSearchStart:t=>{a([]),s(t.type),e.onSearchStart?.(t)}})}),(0,A.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-20rem)]`,children:[(0,A.jsx)(`div`,{className:`lg:flex-1 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-[60vh] lg:h-full`,children:(0,A.jsx)(k,{streamingHook:l,onSelectionChanged:ie,onGridReady:c,showTypeColumn:o===i.ALL,searchRecords:r})}),(0,A.jsx)(`div`,{className:`w-full lg:w-96 shrink-0 lg:h-full`,children:(0,A.jsx)(Ce,{meta:oe,isLoading:se,hasError:_!==null})})]})]})},M.__docgenInfo={description:``,methods:[],displayName:`ListDID`,props:{firstPattern:{required:!1,tsType:{name:`string`},description:``},initialData:{required:!1,tsType:{name:`Array`,elements:[{name:`DIDViewModel`}],raw:`DIDViewModel[]`},description:``},autoSearch:{required:!1,tsType:{name:`boolean`},description:``},initialType:{required:!1,tsType:{name:`DIDType`},description:``},onSearchStart:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(params: DIDSearchParams) => void`,signature:{arguments:[{type:{name:`DIDSearchParams`},name:`params`}],return:{name:`void`}}},description:``}}}})))()}var N,Le,P,F,I,L,R,Re,z,B,V,H,U,W,G,K,ze,q,J,Be,Y,X,Z,Q,Ve;function $(){return($=e((()=>{N=n(),Ie(),o(),ve(),ie(),p(),Oe(),ke(),Ae(),r(),je(),Le={title:`Components/Pages/DID/List`,component:M,parameters:{docs:{disable:!0}}},P=e=>{let t=new ae;return(0,N.jsx)(m,{client:t,children:(0,N.jsx)(ye,{children:(0,N.jsx)(M,{...e})})})},F=`/api/feature/list-dids`,I=`/api/feature/get-did-meta`,L=Array.from({length:50},a),R=Array.from({length:200},a),Re=Array.from({length:5e4},a),z=P.bind({}),z.args={firstPattern:`test:file`},B=P.bind({}),B.args={firstPattern:`test`},V=P.bind({}),V.args={firstPattern:`test:file:line`},H=P.bind({}),H.args={firstPattern:`regular:streaming`},H.decorators=[v([y(F,{data:R}),b(I,{getData:()=>s()})])],U=[s(i.FILE),s(i.DATASET),s(i.CONTAINER)],W=()=>{let e=0;return()=>{let t=U[e];return e++,e===U.length&&(e=0),t}},G=P.bind({}),G.args={firstPattern:`slow:meta`},G.decorators=[v([y(F,{data:R}),b(I,{getData:W(),getDelay:()=>1e3})])],K=[2e3,1e3,500],ze=()=>{let e=0;return()=>{let t=K[e];return e++,e===K.length&&(e=0),t}},q=P.bind({}),q.args={firstPattern:`irregular:delay`},q.decorators=[v([y(F,{data:R}),b(I,{getData:W(),getDelay:ze()})])],J=P.bind({}),J.args={initialData:L},Be={scope:``,name:``,did_type:i.UNKNOWN,...c()},Y=P.bind({}),Y.args={initialData:Array.from({length:50},()=>Be)},X=P.bind({}),X.args={firstPattern:`huge:streaming`},X.decorators=[v([y(F,{data:Re,delay:1}),b(I,{getData:()=>s(),getDelay:()=>100})])],Z=P.bind({}),Z.args={initialData:L},Z.decorators=[v([b(I,{getData:()=>c()})])],Q=P.bind({}),Q.args={initialData:L},Q.decorators=[v([Me(I,{statusCode:500,message:`Internal error`})])],Ve=[`ValidInitialPatternNoEndpoint`,`InvalidInitialPatternNoDelimiter`,`InvalidInitialPatternTwoDelimiters`,`RegularStreaming`,`SlowMeta`,`IrregularDelayMeta`,`InitialData`,`BadInitialData`,`HugeStreaming`,`MetaInvalidModel`,`MetaResponseError`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...H.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...Q.parameters?.docs?.source}}}})))()}$();export{Y as BadInitialData,X as HugeStreaming,J as InitialData,B as InvalidInitialPatternNoDelimiter,V as InvalidInitialPatternTwoDelimiters,q as IrregularDelayMeta,Z as MetaInvalidModel,Q as MetaResponseError,H as RegularStreaming,G as SlowMeta,z as ValidInitialPatternNoEndpoint,Ve as __namedExportsOrder,Le as default};