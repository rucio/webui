import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Kt as n,bt as r}from"./iframe-C47sd5GD.js";import{n as i,u as a}from"./rucio-yGyZc0Jt.js";import{a as o,b as ee,g as s,i as c,o as l,x as u}from"./table-fixtures-DCRGtM8o.js";import{r as te,t as d}from"./useToast-OUoBmcVg.js";import{a as ne,c as re,l as f,o as p,t as m}from"./modern-wunwAQAK.js";import{n as h,t as g}from"./ToastedTemplate-D8lMrfJU.js";import{a as _,c as v,l as y,n as ie,t as ae,u as oe}from"./useTableStreaming-CySD8BLu.js";import{n as se,t as ce}from"./BaseViewModelValidator-B8yN3WWU.js";import{n as le,t as ue}from"./ListDIDMeta-BYxLaZc3.js";import{n as de,t as fe}from"./DIDSearchPanel-DnqQLQyq.js";import{o as b,s as pe}from"./core-6DIMNDHd.js";import{a as me,r as x}from"./streaming-handlers-BlaYzJdv.js";import{n as he,t as S}from"./single-handlers-ymy__a4Q.js";import{n as ge,t as _e}from"./error-handlers-BHD6Vui_.js";var C,w,T,ve=e((()=>{C=r(),w=t(n()),oe(),v(),T=e=>{let t=(0,w.useRef)(null),[n]=(0,w.useState)([{headerName:`Identifier`,valueGetter:e=>e.data?.scope+`:`+e.data?.name,flex:1,minWidth:250,filter:!0,filterParams:_}]);return(0,C.jsx)(y,{columnDefs:n,rowSelection:{mode:`singleRow`,enableClickSelection:!0},tableRef:t,...e})},T.__docgenInfo={description:``,methods:[],displayName:`ListDIDTable`,props:{streamingHook:{required:!0,tsType:{name:`UseStreamReader`,elements:[{name:`DIDViewModel`}],raw:`UseStreamReader<DIDViewModel>`},description:``},onSelectionChanged:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: SelectionChangedEvent) => void`,signature:{arguments:[{type:{name:`SelectionChangedEvent`},name:`event`}],return:{name:`void`}}},description:``},onGridReady:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(event: GridReadyEvent) => void`,signature:{arguments:[{type:{name:`GridReadyEvent`},name:`event`}],return:{name:`void`}}},description:``}}}})),E,D,O,ye=e((()=>{E=r(),a(),D=t(n()),u(),d(),m(),ve(),se(),le(),ae(),de(),O=e=>{let{toast:t}=te(),n=new ce(t),{onGridReady:r,streamingHook:a,startStreaming:o,stopStreaming:s,gridApi:c}=ie(e.initialData),l=(0,D.useRef)(!1);(0,D.useEffect)(()=>{if(!l.current&&e.autoSearch&&c&&e.firstPattern){l.current=!0;let t=e.firstPattern.split(`:`);if(t.length===2){let[n,r]=t;o(`/api/feature/list-dids?`+new URLSearchParams({query:e.firstPattern,type:e.initialType??i.DATASET}))}}},[c]);let[u,d]=(0,D.useState)(null),f=e=>{let t=e.api.getSelectedRows();t.length===1?d(t[0]):d(null)},p=async()=>{if(u!==null){let e=`/api/feature/get-did-meta?`+new URLSearchParams({scope:u.scope,name:u.name}),t=await fetch(e);if(!t.ok)throw Error(t.statusText);let r=await t.json();if(n.isValid(r))return r}return null},m=[`meta`],{data:h,error:g,isFetching:_,refetch:v}=ne({queryKey:m,queryFn:p,enabled:!1,retry:!1}),y=re();return(0,D.useEffect)(()=>{(async()=>{await y.cancelQueries({queryKey:m}),v()})()},[u]),(0,D.useEffect)(()=>{g!==null&&t({variant:`error`,title:`Fatal error`,description:`Cannot retrieve metadata.`})},[g]),(0,E.jsxs)(`div`,{className:`flex flex-col space-y-6 w-full`,children:[(0,E.jsx)(`div`,{className:`rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6`,children:(0,E.jsx)(fe,{isRunning:a.status===ee.RUNNING,startStreaming:o,stopStreaming:s,initialPattern:e.firstPattern,autoSearch:e.autoSearch,initialType:e.initialType,onSearchStart:e.onSearchStart})}),(0,E.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-20rem)]`,children:[(0,E.jsx)(`div`,{className:`lg:flex-1 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[60vh] lg:h-full`,children:(0,E.jsx)(T,{streamingHook:a,onSelectionChanged:f,onGridReady:r})}),(0,E.jsx)(`div`,{className:`w-full lg:w-96 shrink-0 lg:h-full`,children:(0,E.jsx)(ue,{meta:h,isLoading:_,hasError:g!==null})})]})]})},O.__docgenInfo={description:``,methods:[],displayName:`ListDID`,props:{firstPattern:{required:!1,tsType:{name:`string`},description:``},initialData:{required:!1,tsType:{name:`Array`,elements:[{name:`DIDViewModel`}],raw:`DIDViewModel[]`},description:``},autoSearch:{required:!1,tsType:{name:`boolean`},description:``},initialType:{required:!1,tsType:{name:`DIDType`},description:``},onSearchStart:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(params: DIDSearchParams) => void`,signature:{arguments:[{type:{name:`DIDSearchParams`},name:`params`}],return:{name:`void`}}},description:``}}}})),k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{k=r(),ye(),s(),h(),m(),pe(),me(),he(),a(),ge(),A={title:`Components/Pages/DID/List`,component:O,parameters:{docs:{disable:!0}}},j=e=>(0,k.jsx)(p,{client:new f,children:(0,k.jsx)(g,{children:(0,k.jsx)(O,{...e})})}),M=`/api/feature/list-dids`,N=`/api/feature/get-did-meta`,P=Array.from({length:50},o),F=Array.from({length:200},o),I=Array.from({length:5e4},o),L=j.bind({}),L.args={firstPattern:`test:file`},R=j.bind({}),R.args={firstPattern:`test`},z=j.bind({}),z.args={firstPattern:`test:file:line`},B=j.bind({}),B.args={firstPattern:`regular:streaming`},B.decorators=[b([x(M,{data:F}),S(N,{getData:()=>c()})])],V=[c(i.FILE),c(i.DATASET),c(i.CONTAINER)],H=()=>{let e=0;return()=>{let t=V[e];return e++,e===V.length&&(e=0),t}},U=j.bind({}),U.args={firstPattern:`slow:meta`},U.decorators=[b([x(M,{data:F}),S(N,{getData:H(),getDelay:()=>1e3})])],W=[2e3,1e3,500],G=()=>{let e=0;return()=>{let t=W[e];return e++,e===W.length&&(e=0),t}},K=j.bind({}),K.args={firstPattern:`irregular:delay`},K.decorators=[b([x(M,{data:F}),S(N,{getData:H(),getDelay:G()})])],q=j.bind({}),q.args={initialData:P},J={scope:``,name:``,did_type:i.UNKNOWN,...l()},Y=j.bind({}),Y.args={initialData:Array.from({length:50},()=>J)},X=j.bind({}),X.args={firstPattern:`huge:streaming`},X.decorators=[b([x(M,{data:I,delay:1}),S(N,{getData:()=>c(),getDelay:()=>100})])],Z=j.bind({}),Z.args={initialData:P},Z.decorators=[b([S(N,{getData:()=>l()})])],Q=j.bind({}),Q.args={initialData:P},Q.decorators=[b([_e(N,{statusCode:500,message:`Internal error`})])],L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`args => {
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
}`,...B.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`args => {
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
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...q.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`args => {
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
}`,...Q.parameters?.docs?.source}}},$=[`ValidInitialPatternNoEndpoint`,`InvalidInitialPatternNoDelimiter`,`InvalidInitialPatternTwoDelimiters`,`RegularStreaming`,`SlowMeta`,`IrregularDelayMeta`,`InitialData`,`BadInitialData`,`HugeStreaming`,`MetaInvalidModel`,`MetaResponseError`]}))();export{Y as BadInitialData,X as HugeStreaming,q as InitialData,R as InvalidInitialPatternNoDelimiter,z as InvalidInitialPatternTwoDelimiters,K as IrregularDelayMeta,Z as MetaInvalidModel,Q as MetaResponseError,B as RegularStreaming,U as SlowMeta,L as ValidInitialPatternNoEndpoint,$ as __namedExportsOrder,A as default};