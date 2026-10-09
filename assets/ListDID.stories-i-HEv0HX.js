import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Ot as n,on as r}from"./iframe-CpWC1arH.js";import{n as i,u as a}from"./rucio-yGyZc0Jt.js";import{a as o,b as ee,g as te,i as s,o as c,x as l}from"./table-fixtures-nqSXwsR7.js";import{n as ne,t as u}from"./LoadingSpinner-wgLagcnL.js";import{r as re,t as d}from"./useToast-D3cDObhr.js";import{a as ie,c as ae,l as f,o as p,t as m}from"./modern-B-L9_glh.js";import{n as oe,t as h}from"./DIDTypeBadge-Sf5HPsLz.js";import{n as se,t as g}from"./ToastedTemplate-Dm1LnQRN.js";import{a as ce,c as le,l as _,n as ue,o as de,s as fe,t as pe,u as me}from"./useTableStreaming-DTwOJoKZ.js";import{n as he,r as ge,t as _e}from"./badge-cell-DKFTQIA4.js";import{a as ve,c as ye,o as be,r as v,s as xe}from"./streaming-handlers-Cbtl94MA.js";import{n as Se,t as Ce}from"./BaseViewModelValidator-B8yN3WWU.js";import{n as we,t as Te}from"./ListDIDMeta-B-E5UEEl.js";import{n as Ee,t as De}from"./DIDSearchPanel-DigJexzj.js";import{o as y,s as Oe}from"./core-CVF_imeo.js";import{n as ke,t as b}from"./single-handlers-CiIPMYP1.js";import{n as Ae,t as je}from"./error-handlers-BCLt0G_9.js";var x,S,C,w,Me,T,Ne=e((()=>{x=n(),a(),ne(),me(),l(),S={[i.CONTAINER]:`containers`,[i.DATASET]:`datasets`,[i.FILE]:`files`},C={"refine-wildcard":{primary:`Please refine the DID name.`,secondary:`Wildcard searches on files are not supported. Narrow the name, or search the File type directly.`},"no-results":{primary:`No DIDs matched this query.`,secondary:`Containers, datasets and files were all searched.`},"files-skipped":{primary:`Files were not searched.`,secondary:`Wildcard searches on files are not supported. Search the File type directly to include them.`}},w=e=>{let t=e.map(e=>S[e]??String(e).toLowerCase());return t.length<=1?t.join(``):`${t.slice(0,-1).join(`, `)} and ${t[t.length-1]}`},Me=e=>{if(e.kind!==`progress`||!e.progress)return null;let t=w(e.progress.types);return e.progress.state===`searching`?`Searching ${t}...`:e.progress.state===`empty`?`No ${t} matched.`:`Found ${t}.`},T=({records:e,status:t,error:n})=>{if(n)return(0,x.jsx)(_,{error:n,status:t});let r=[...e].reverse().find(e=>e.kind===`notice`);if(r?.notice){let e=C[r.notice.code];return(0,x.jsxs)(`div`,{className:`flex flex-col items-center gap-1 text-center px-4`,children:[(0,x.jsx)(`p`,{className:`text-sm font-medium text-neutral-700 dark:text-neutral-100`,children:e?.primary??r.notice.message}),e?.secondary&&(0,x.jsx)(`p`,{className:`text-xs text-neutral-500 dark:text-neutral-400`,children:e.secondary})]})}if(t===ee.RUNNING){let t=[...e].reverse().map(Me).find(Boolean);return(0,x.jsxs)(`div`,{className:`flex flex-col items-center gap-2 text-center px-4`,children:[(0,x.jsx)(u,{}),t&&(0,x.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-100`,children:t})]})}return(0,x.jsx)(_,{error:n,status:t})},T.__docgenInfo={description:`The table's empty state during and after an All search.

The cascade reports which type it is looking at as it goes; that belongs where
the results will land, not as standing text elsewhere on the page. Showing only
the current step keeps it reading as activity rather than as a log that never
clears. Anything the cascade has no opinion on falls through to the standard
streaming overlay.`,methods:[],displayName:`DIDSearchOverlay`,props:{records:{required:!0,tsType:{name:`Array`,elements:[{name:`ListDIDsViewModel`}],raw:`ListDIDsViewModel[]`},description:``},status:{required:!0,tsType:{name:`StreamingStatus`},description:``},error:{required:!1,tsType:{name:`StreamingError`},description:``}}}}));function Pe(e){let t=[i.CONTAINER,i.DATASET,i.FILE],n={headerName:`Identifier`,valueGetter:e=>e.data?.scope+`:`+e.data?.name,flex:1,minWidth:250,filter:!0,filterParams:ce};return e?[n,{headerName:`Type`,field:`did_type`,cellRenderer:h,minWidth:180,cellStyle:he,cellRendererParams:{className:_e},filter:{component:be,handler:xe(t)},filterParams:{options:t}}]:[n]}var E,D,O,Fe=e((()=>{E=n(),D=t(r()),le(),de(),oe(),ge(),Ne(),a(),ye(),O=e=>{let t=(0,D.useRef)(null),{showTypeColumn:n,searchRecords:r,...i}=e,a=(0,D.useMemo)(()=>Pe(n??!1),[n]);return(0,D.useEffect)(()=>{let e=t.current?.api;e&&(r??[]).some(e=>e.kind===`notice`)&&e.getDisplayedRowCount()===0&&e.showNoRowsOverlay()},[r,e.streamingHook.status]),(0,E.jsx)(fe,{columnDefs:a,rowSelection:{mode:`singleRow`,enableClickSelection:!0},tableRef:t,noRowsOverlayComponent:t=>(0,E.jsx)(T,{records:r??[],status:e.streamingHook.status,error:e.streamingHook.error,...t}),enableFilterHandlers:!0,...i})},O.__docgenInfo={description:``,methods:[],displayName:`ListDIDTable`,props:{streamingHook:{required:!0,tsType:{name:`UseStreamReader`,elements:[{name:`DIDViewModel`}],raw:`UseStreamReader<DIDViewModel>`},description:``},onSelectionChanged:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: SelectionChangedEvent) => void`,signature:{arguments:[{type:{name:`SelectionChangedEvent`},name:`event`}],return:{name:`void`}}},description:``},onGridReady:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: GridReadyEvent) => void`,signature:{arguments:[{type:{name:`GridReadyEvent`},name:`event`}],return:{name:`void`}}},description:``},showTypeColumn:{required:!1,tsType:{name:`boolean`},description:`Show the DID type per row. True when the search was not pinned to one type.`},searchRecords:{required:!1,tsType:{name:`Array`,elements:[{name:`ListDIDsViewModel`}],raw:`ListDIDsViewModel[]`},description:`Progress and notice records from an All search, rendered as the empty state.`}}}})),k,A,j,Ie=e((()=>{k=n(),a(),A=t(r()),l(),d(),m(),Fe(),Se(),we(),pe(),Ee(),Ne(),j=e=>{let{toast:t}=re(),n=new Ce(t),[r,a]=(0,A.useState)([]),[o,te]=(0,A.useState)(e.initialType??i.ALL),{onGridReady:s,streamingHook:c,startStreaming:l,stopStreaming:ne,gridApi:u}=ue(e.initialData,{onMetaRecord:e=>{let n=e;a(e=>[...e,n]);let r=n.kind===`notice`?n.notice?.code:void 0;(r===`refine-wildcard`||r===`files-skipped`)&&t({variant:`warning`,title:C[r].primary,description:C[r].secondary})}}),d=(0,A.useRef)(!1);(0,A.useEffect)(()=>{if(!d.current&&e.autoSearch&&u&&e.firstPattern){d.current=!0;let t=e.firstPattern.split(`:`);if(t.length===2){let[n,r]=t;l(`/api/feature/list-dids?`+new URLSearchParams({query:e.firstPattern,type:e.initialType??i.ALL}))}}},[u]);let[f,p]=(0,A.useState)(null),m=e=>{let t=e.api.getSelectedRows();t.length===1?p(t[0]):p(null)},oe=async()=>{if(f!==null){let e=`/api/feature/get-did-meta?`+new URLSearchParams({scope:f.scope,name:f.name}),t=await fetch(e);if(!t.ok)throw Error(t.statusText);let r=await t.json();if(n.isValid(r))return r}return null},h=[`meta`],{data:se,error:g,isFetching:ce,refetch:le}=ie({queryKey:h,queryFn:oe,enabled:!1,retry:!1}),_=ae();return(0,A.useEffect)(()=>{(async()=>{await _.cancelQueries({queryKey:h}),le()})()},[f]),(0,A.useEffect)(()=>{g!==null&&t({variant:`error`,title:`Fatal error`,description:`Cannot retrieve metadata.`})},[g]),(0,k.jsxs)(`div`,{className:`flex flex-col space-y-6 w-full`,children:[(0,k.jsx)(`div`,{className:`rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs p-6`,children:(0,k.jsx)(De,{isRunning:c.status===ee.RUNNING,startStreaming:l,stopStreaming:ne,initialPattern:e.firstPattern,autoSearch:e.autoSearch,initialType:e.initialType,onSearchStart:t=>{a([]),te(t.type),e.onSearchStart?.(t)}})}),(0,k.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-20rem)]`,children:[(0,k.jsx)(`div`,{className:`lg:flex-1 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-[60vh] lg:h-full`,children:(0,k.jsx)(O,{streamingHook:c,onSelectionChanged:m,onGridReady:s,showTypeColumn:o===i.ALL,searchRecords:r})}),(0,k.jsx)(`div`,{className:`w-full lg:w-96 shrink-0 lg:h-full`,children:(0,k.jsx)(Te,{meta:se,isLoading:ce,hasError:g!==null})})]})]})},j.__docgenInfo={description:``,methods:[],displayName:`ListDID`,props:{firstPattern:{required:!1,tsType:{name:`string`},description:``},initialData:{required:!1,tsType:{name:`Array`,elements:[{name:`DIDViewModel`}],raw:`DIDViewModel[]`},description:``},autoSearch:{required:!1,tsType:{name:`boolean`},description:``},initialType:{required:!1,tsType:{name:`DIDType`},description:``},onSearchStart:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(params: DIDSearchParams) => void`,signature:{arguments:[{type:{name:`DIDSearchParams`},name:`params`}],return:{name:`void`}}},description:``}}}})),M,N,P,F,I,L,R,Le,z,B,V,H,U,W,G,K,Re,q,J,ze,Y,X,Z,Q,$;e((()=>{M=n(),Ie(),te(),se(),m(),Oe(),ve(),ke(),a(),Ae(),N={title:`Components/Pages/DID/List`,component:j,parameters:{docs:{disable:!0}}},P=e=>(0,M.jsx)(p,{client:new f,children:(0,M.jsx)(g,{children:(0,M.jsx)(j,{...e})})}),F=`/api/feature/list-dids`,I=`/api/feature/get-did-meta`,L=Array.from({length:50},o),R=Array.from({length:200},o),Le=Array.from({length:5e4},o),z=P.bind({}),z.args={firstPattern:`test:file`},B=P.bind({}),B.args={firstPattern:`test`},V=P.bind({}),V.args={firstPattern:`test:file:line`},H=P.bind({}),H.args={firstPattern:`regular:streaming`},H.decorators=[y([v(F,{data:R}),b(I,{getData:()=>s()})])],U=[s(i.FILE),s(i.DATASET),s(i.CONTAINER)],W=()=>{let e=0;return()=>{let t=U[e];return e++,e===U.length&&(e=0),t}},G=P.bind({}),G.args={firstPattern:`slow:meta`},G.decorators=[y([v(F,{data:R}),b(I,{getData:W(),getDelay:()=>1e3})])],K=[2e3,1e3,500],Re=()=>{let e=0;return()=>{let t=K[e];return e++,e===K.length&&(e=0),t}},q=P.bind({}),q.args={firstPattern:`irregular:delay`},q.decorators=[y([v(F,{data:R}),b(I,{getData:W(),getDelay:Re()})])],J=P.bind({}),J.args={initialData:L},ze={scope:``,name:``,did_type:i.UNKNOWN,...c()},Y=P.bind({}),Y.args={initialData:Array.from({length:50},()=>ze)},X=P.bind({}),X.args={firstPattern:`huge:streaming`},X.decorators=[y([v(F,{data:Le,delay:1}),b(I,{getData:()=>s(),getDelay:()=>100})])],Z=P.bind({}),Z.args={initialData:L},Z.decorators=[y([b(I,{getData:()=>c()})])],Q=P.bind({}),Q.args={initialData:L},Q.decorators=[y([je(I,{statusCode:500,message:`Internal error`})])],$=[`ValidInitialPatternNoEndpoint`,`InvalidInitialPatternNoDelimiter`,`InvalidInitialPatternTwoDelimiters`,`RegularStreaming`,`SlowMeta`,`IrregularDelayMeta`,`InitialData`,`BadInitialData`,`HugeStreaming`,`MetaInvalidModel`,`MetaResponseError`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`args => {
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
}`,...Q.parameters?.docs?.source}}}}))();export{Y as BadInitialData,X as HugeStreaming,J as InitialData,B as InvalidInitialPatternNoDelimiter,V as InvalidInitialPatternTwoDelimiters,q as IrregularDelayMeta,Z as MetaInvalidModel,Q as MetaResponseError,H as RegularStreaming,G as SlowMeta,z as ValidInitialPatternNoEndpoint,$ as __namedExportsOrder,N as default};