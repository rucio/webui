import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,u as i}from"./rucio-CA_IBUce.js";import{a,b as o,g as ee,i as s,o as c,x as l}from"./table-fixtures-Dk3SMO9i.js";import{n as u,t as te}from"./LoadingSpinner-rJh-4z2j.js";import{r as ne,t as d}from"./useToast-CRIT78yc.js";import{n as f,r as re,t as p}from"./QueryClientProvider-OcdqK2i_.js";import{n as ie,t as m}from"./useQuery-DWUiilJF.js";import{n as ae,t as oe}from"./queryClient-DIj1eP1H.js";import{n as h,t as se}from"./DIDTypeBadge-D9eiwnMc.js";import{n as g,t as ce}from"./ToastedTemplate-Dw5DULSR.js";import{a as le,c as _,l as v,n as ue,o as de,s as fe,t as pe,u as me}from"./useTableStreaming-D4I5BlA7.js";import{n as he,r as ge,t as _e}from"./badge-cell-BP9GAuX5.js";import{a as ve,c as ye,o as be,r as y,s as xe}from"./streaming-handlers-Cw4qHbbr.js";import{n as Se,t as Ce}from"./BaseViewModelValidator-TRzRT57d.js";import{n as we,t as Te}from"./ListDIDMeta-DM2wOvIS.js";import{n as Ee,t as De}from"./DIDSearchPanel-Cy4t7Vi1.js";import{a as b,o as Oe}from"./HttpResponse-DrkeJQzv.js";import{n as ke,t as x}from"./single-handlers-CQ0K52u6.js";import{n as Ae,t as je}from"./error-handlers-DWFKD2ib.js";var S,C,w,Me,Ne,T;function E(){return(E=e((()=>{S=n(),i(),u(),me(),l(),C={[r.CONTAINER]:`containers`,[r.DATASET]:`datasets`,[r.FILE]:`files`},w={"refine-wildcard":{primary:`Please refine the DID name.`,secondary:`Wildcard searches on files are not supported. Narrow the name, or search the File type directly.`},"no-results":{primary:`No DIDs matched this query.`,secondary:`Containers, datasets and files were all searched.`},"files-skipped":{primary:`Files were not searched.`,secondary:`Wildcard searches on files are not supported. Search the File type directly to include them.`}},Me=e=>{let t=e.map(e=>C[e]??String(e).toLowerCase());return t.length<=1?t.join(``):`${t.slice(0,-1).join(`, `)} and ${t[t.length-1]}`},Ne=e=>{if(e.kind!==`progress`||!e.progress)return null;let t=Me(e.progress.types);return e.progress.state===`searching`?`Searching ${t}...`:e.progress.state===`empty`?`No ${t} matched.`:`Found ${t}.`},T=({records:e,status:t,error:n})=>{if(n)return(0,S.jsx)(v,{error:n,status:t});let r=[...e].reverse().find(e=>e.kind===`notice`);if(r?.notice){let e=w[r.notice.code];return(0,S.jsxs)(`div`,{className:`flex flex-col items-center gap-1 text-center px-4`,children:[(0,S.jsx)(`p`,{className:`text-sm font-medium text-neutral-700 dark:text-neutral-100`,children:e?.primary??r.notice.message}),e?.secondary&&(0,S.jsx)(`p`,{className:`text-xs text-neutral-500 dark:text-neutral-400`,children:e.secondary})]})}if(t===o.RUNNING){let t=[...e].reverse().map(Ne).find(Boolean);return(0,S.jsxs)(`div`,{className:`flex flex-col items-center gap-2 text-center px-4`,children:[(0,S.jsx)(te,{}),t&&(0,S.jsx)(`p`,{className:`text-sm text-neutral-700 dark:text-neutral-100`,children:t})]})}return(0,S.jsx)(v,{error:n,status:t})},T.__docgenInfo={description:`The table's empty state during and after an All search.

The cascade reports which type it is looking at as it goes; that belongs where
the results will land, not as standing text elsewhere on the page. Showing only
the current step keeps it reading as activity rather than as a log that never
clears. Anything the cascade has no opinion on falls through to the standard
streaming overlay.`,methods:[],displayName:`DIDSearchOverlay`,props:{records:{required:!0,tsType:{name:`Array`,elements:[{name:`ListDIDsViewModel`}],raw:`ListDIDsViewModel[]`},description:``},status:{required:!0,tsType:{name:`StreamingStatus`},description:``},error:{required:!1,tsType:{name:`StreamingError`},description:``}}}})))()}function Pe(e){let t=[r.CONTAINER,r.DATASET,r.FILE],n={headerName:`Identifier`,valueGetter:e=>e.data?.scope+`:`+e.data?.name,flex:1,minWidth:250,filter:!0,filterParams:le};return e?[n,{headerName:`Type`,field:`did_type`,cellRenderer:se,minWidth:180,cellStyle:he,cellRendererParams:{className:_e},filter:{component:be,handler:xe(t)},filterParams:{options:t}}]:[n]}var D,O,k;function A(){return(A=e((()=>{D=n(),O=t(),_(),de(),h(),ge(),E(),i(),ye(),k=e=>{let t=(0,O.useRef)(null),{showTypeColumn:n,searchRecords:r,...i}=e,a=(0,O.useMemo)(()=>Pe(n??!1),[n]);return(0,O.useEffect)(()=>{let e=t.current?.api;e&&(r??[]).some(e=>e.kind===`notice`)&&e.getDisplayedRowCount()===0&&e.showNoRowsOverlay()},[r,e.streamingHook.status]),(0,D.jsx)(fe,{columnDefs:a,rowSelection:{mode:`singleRow`,enableClickSelection:!0},tableRef:t,noRowsOverlayComponent:t=>(0,D.jsx)(T,{records:r??[],status:e.streamingHook.status,error:e.streamingHook.error,...t}),enableFilterHandlers:!0,...i})},k.__docgenInfo={description:``,methods:[],displayName:`ListDIDTable`,props:{streamingHook:{required:!0,tsType:{name:`UseStreamReader`,elements:[{name:`DIDViewModel`}],raw:`UseStreamReader<DIDViewModel>`},description:``},onSelectionChanged:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: SelectionChangedEvent) => void`,signature:{arguments:[{type:{name:`SelectionChangedEvent`},name:`event`}],return:{name:`void`}}},description:``},onGridReady:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: GridReadyEvent) => void`,signature:{arguments:[{type:{name:`GridReadyEvent`},name:`event`}],return:{name:`void`}}},description:``},showTypeColumn:{required:!1,tsType:{name:`boolean`},description:`Show the DID type per row. True when the search was not pinned to one type.`},searchRecords:{required:!1,tsType:{name:`Array`,elements:[{name:`ListDIDsViewModel`}],raw:`ListDIDsViewModel[]`},description:`Progress and notice records from an All search, rendered as the empty state.`}}}})))()}var j,M,N;function Fe(){return(Fe=e((()=>{j=n(),i(),M=t(),l(),d(),m(),f(),A(),Se(),we(),pe(),Ee(),E(),N=e=>{let{toast:t}=ne(),n=new Ce(t),[i,a]=(0,M.useState)([]),[ee,s]=(0,M.useState)(e.initialType??r.ALL),{onGridReady:c,streamingHook:l,startStreaming:u,stopStreaming:te,gridApi:d}=ue(e.initialData,{onMetaRecord:e=>{let n=e;a(e=>[...e,n]);let r=n.kind===`notice`?n.notice?.code:void 0;(r===`refine-wildcard`||r===`files-skipped`)&&t({variant:`warning`,title:w[r].primary,description:w[r].secondary})}}),f=(0,M.useRef)(!1);(0,M.useEffect)(()=>{if(!f.current&&e.autoSearch&&d&&e.firstPattern){f.current=!0;let t=e.firstPattern.split(`:`);if(t.length===2){let[n,i]=t,a=`/api/feature/list-dids?`+new URLSearchParams({query:e.firstPattern,type:e.initialType??r.ALL});u(a)}}},[d]);let[p,m]=(0,M.useState)(null),ae=e=>{let t=e.api.getSelectedRows();t.length===1?m(t[0]):m(null)},oe=async()=>{if(p!==null){let e=`/api/feature/get-did-meta?`+new URLSearchParams({scope:p.scope,name:p.name}),t=await fetch(e);if(!t.ok)throw Error(t.statusText);let r=await t.json();if(n.isValid(r))return r}return null},h=[`meta`],{data:se,error:g,isFetching:ce,refetch:le}=ie({queryKey:h,queryFn:oe,enabled:!1,retry:!1}),_=re();return(0,M.useEffect)(()=>{(async()=>{await _.cancelQueries({queryKey:h}),le()})()},[p]),(0,M.useEffect)(()=>{g!==null&&t({variant:`error`,title:`Fatal error`,description:`Cannot retrieve metadata.`})},[g]),(0,j.jsxs)(`div`,{className:`flex flex-col space-y-6 w-full`,children:[(0,j.jsx)(`div`,{className:`rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs p-6`,children:(0,j.jsx)(De,{isRunning:l.status===o.RUNNING,startStreaming:u,stopStreaming:te,initialPattern:e.firstPattern,autoSearch:e.autoSearch,initialType:e.initialType,onSearchStart:t=>{a([]),s(t.type),e.onSearchStart?.(t)}})}),(0,j.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-20rem)]`,children:[(0,j.jsx)(`div`,{className:`lg:flex-1 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-[60vh] lg:h-full`,children:(0,j.jsx)(k,{streamingHook:l,onSelectionChanged:ae,onGridReady:c,showTypeColumn:ee===r.ALL,searchRecords:i})}),(0,j.jsx)(`div`,{className:`w-full lg:w-96 shrink-0 lg:h-full`,children:(0,j.jsx)(Te,{meta:se,isLoading:ce,hasError:g!==null})})]})]})},N.__docgenInfo={description:``,methods:[],displayName:`ListDID`,props:{firstPattern:{required:!1,tsType:{name:`string`},description:``},initialData:{required:!1,tsType:{name:`Array`,elements:[{name:`DIDViewModel`}],raw:`DIDViewModel[]`},description:``},autoSearch:{required:!1,tsType:{name:`boolean`},description:``},initialType:{required:!1,tsType:{name:`DIDType`},description:``},onSearchStart:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(params: DIDSearchParams) => void`,signature:{arguments:[{type:{name:`DIDSearchParams`},name:`params`}],return:{name:`void`}}},description:``}}}})))()}var P,Ie,F,I,L,R,z,Le,B,V,H,U,W,G,K,q,Re,J,Y,ze,X,Z,Q,$,Be;function Ve(){return(Ve=e((()=>{P=n(),Fe(),ee(),g(),ae(),f(),Oe(),ve(),ke(),i(),Ae(),Ie={title:`Components/Pages/DID/List`,component:N,parameters:{docs:{disable:!0}}},F=e=>{let t=new oe;return(0,P.jsx)(p,{client:t,children:(0,P.jsx)(ce,{children:(0,P.jsx)(N,{...e})})})},I=`/api/feature/list-dids`,L=`/api/feature/get-did-meta`,R=Array.from({length:50},a),z=Array.from({length:200},a),Le=Array.from({length:5e4},a),B=F.bind({}),B.args={firstPattern:`test:file`},V=F.bind({}),V.args={firstPattern:`test`},H=F.bind({}),H.args={firstPattern:`test:file:line`},U=F.bind({}),U.args={firstPattern:`regular:streaming`},U.decorators=[b([y(I,{data:z}),x(L,{getData:()=>s()})])],W=[s(r.FILE),s(r.DATASET),s(r.CONTAINER)],G=()=>{let e=0;return()=>{let t=W[e];return e++,e===W.length&&(e=0),t}},K=F.bind({}),K.args={firstPattern:`slow:meta`},K.decorators=[b([y(I,{data:z}),x(L,{getData:G(),getDelay:()=>1e3})])],q=[2e3,1e3,500],Re=()=>{let e=0;return()=>{let t=q[e];return e++,e===q.length&&(e=0),t}},J=F.bind({}),J.args={firstPattern:`irregular:delay`},J.decorators=[b([y(I,{data:z}),x(L,{getData:G(),getDelay:Re()})])],Y=F.bind({}),Y.args={initialData:R},ze={scope:``,name:``,did_type:r.UNKNOWN,...c()},X=F.bind({}),X.args={initialData:Array.from({length:50},()=>ze)},Z=F.bind({}),Z.args={firstPattern:`huge:streaming`},Z.decorators=[b([y(I,{data:Le,delay:1}),x(L,{getData:()=>s(),getDelay:()=>100})])],Q=F.bind({}),Q.args={initialData:R},Q.decorators=[b([x(L,{getData:()=>c()})])],$=F.bind({}),$.args={initialData:R},$.decorators=[b([je(L,{statusCode:500,message:`Internal error`})])],Be=[`ValidInitialPatternNoEndpoint`,`InvalidInitialPatternNoDelimiter`,`InvalidInitialPatternTwoDelimiters`,`RegularStreaming`,`SlowMeta`,`IrregularDelayMeta`,`InitialData`,`BadInitialData`,`HugeStreaming`,`MetaInvalidModel`,`MetaResponseError`],B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`args => {
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...U.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`args => {
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
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...$.parameters?.docs?.source}}}})))()}Ve();export{X as BadInitialData,Z as HugeStreaming,Y as InitialData,V as InvalidInitialPatternNoDelimiter,H as InvalidInitialPatternTwoDelimiters,J as IrregularDelayMeta,Q as MetaInvalidModel,$ as MetaResponseError,U as RegularStreaming,K as SlowMeta,B as ValidInitialPatternNoEndpoint,Be as __namedExportsOrder,Ie as default};