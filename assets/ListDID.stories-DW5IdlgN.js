import{r as i,j as r}from"./iframe-CW9-_HYS.js";import{a as S}from"./rucio-DwhGwk4W.js";import{D as Re,S as Ne,u as je,a as ke,g as E}from"./streaming-handlers-b88KKoEr.js";import{u as Ae}from"./useToast-CidfTvTK.js";import{u as Ve,a as _e,Q as Fe}from"./useQuery-0oFJ3NNY.js";import{B as Ge,g as u}from"./index-D7cXXlPK.js";import{L as Ue}from"./ListDIDMeta-DQn27o0w.js";import{D as Oe}from"./DIDSearchPanel-Fndh9SPh.js";import{e as R,b as h,g as he}from"./table-fixtures-CYu47AcK.js";import{T as Be}from"./ToastedTemplate-D86UrxdT.js";import{Q as He,g as v}from"./single-handlers-CBT38xIR.js";import{g as Ke}from"./error-handlers-D2VmmSpc.js";import"./preload-helper-Dp1pzeXC.js";import"./index.esm-DWUw-EzS.js";import"./iconBase-_tCx069T.js";import"./Skeleton-CE5uc2hp.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index-vscuIXpL.js";import"./index-DfmtFgSt.js";import"./LoadingSpinner-Blb2vFxO.js";import"./list-toasts-CqaY5F_J.js";import"./Field-DPVrUdUM.js";import"./text-formatters-wJd6s3Vd.js";import"./DateWithTooltip-BQW6dl4Z.js";import"./index-BYI7UAI7.js";import"./index-EU4VEQCY.js";import"./index-DfvfBRvX.js";import"./Combination-C7xDWU_D.js";import"./index-Cd40vaJY.js";import"./index-ZDVb7sJw.js";import"./index-CC9cG0nH.js";import"./index-zIJ3W_2m.js";import"./Divider-BdfdYZco.js";import"./checkbox-kGOKnzdb.js";import"./index-hSNaI0NW.js";import"./DIDTypeBadge-DhPx1zTZ.js";import"./Badge-BBZTtNoB.js";import"./DIDAvailabilityBadge-CwnKGPjn.js";import"./LoadingElement-BwEW01A3.js";import"./KeyValueRow-CCRMgME5.js";import"./KeyValueWrapper-BJbLohGM.js";import"./select-BdoeMeyv.js";import"./index-D1mrQCGS.js";import"./input-Pe1M6Jdo.js";import"./SearchButton-BypYt3JG.js";import"./button-uonugc8c.js";import"./index.esm-DoIcUV9t.js";import"./DateInput-DAvL5-cK.js";import"./index-tFTlz-ru.js";import"./warning-C20GYw-A.js";import"./TimeInput-B1jjMlg4.js";import"./Alert-Dtl0nzFb.js";import"./Toaster-B7kGKkaG.js";const ve=e=>{const a=i.useRef(null),[M]=i.useState([{headerName:"Identifier",valueGetter:P=>{var g,y;return((g=P.data)==null?void 0:g.scope)+":"+((y=P.data)==null?void 0:y.name)},flex:1,minWidth:250,filter:!0,filterParams:Re}]);return r.jsx(Ne,{columnDefs:M,rowSelection:{mode:"singleRow",enableClickSelection:!0},tableRef:a,...e})};ve.__docgenInfo={description:"",methods:[],displayName:"ListDIDTable",props:{streamingHook:{required:!0,tsType:{name:"UseStreamReader",elements:[{name:"DIDViewModel"}],raw:"UseStreamReader<DIDViewModel>"},description:""},onSelectionChanged:{required:!0,tsType:{name:"signature",type:"function",raw:"(event: SelectionChangedEvent) => void",signature:{arguments:[{type:{name:"SelectionChangedEvent"},name:"event"}],return:{name:"void"}}},description:""},onGridReady:{required:!0,tsType:{name:"signature",type:"function",raw:"(event: GridReadyEvent) => void",signature:{arguments:[{type:{name:"GridReadyEvent"},name:"event"}],return:{name:"void"}}},description:""}}};const N=e=>{const{toast:a}=Ae(),M=new Ge(a),{onGridReady:P,streamingHook:g,startStreaming:y,stopStreaming:we,gridApi:A}=je(e.initialData),V=i.useRef(!1);i.useEffect(()=>{if(!V.current&&e.autoSearch&&A&&e.firstPattern){V.current=!0;const n=e.firstPattern.split(":");if(n.length===2){const[q,L]=n,Le="/api/feature/list-dids?"+new URLSearchParams({query:e.firstPattern,type:e.initialType??S.DATASET});y(Le)}}},[A]);const[w,_]=i.useState(null),Qe=Q=>{const n=Q.api.getSelectedRows();n.length===1?_(n[0]):_(null)},qe=async()=>{if(w!==null){const n="/api/feature/get-did-meta?"+new URLSearchParams({scope:w.scope,name:w.name}),q=await fetch(n);if(!q.ok)throw new Error(q.statusText);const L=await q.json();if(M.isValid(L))return L}return null},F=["meta"],{data:Ee,error:x,isFetching:be,refetch:Me}=Ve({queryKey:F,queryFn:qe,enabled:!1,retry:!1}),xe=_e();return i.useEffect(()=>{(async()=>{await xe.cancelQueries({queryKey:F}),Me()})()},[w]),i.useEffect(()=>{x!==null&&a({variant:"error",title:"Fatal error",description:"Cannot retrieve metadata."})},[x]),r.jsxs("div",{className:"flex flex-col space-y-6 w-full",children:[r.jsx("div",{className:"rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6",children:r.jsx(Oe,{isRunning:g.status===ke.RUNNING,startStreaming:y,stopStreaming:we,initialPattern:e.firstPattern,autoSearch:e.autoSearch,initialType:e.initialType,onSearchStart:e.onSearchStart})}),r.jsxs("div",{className:"flex flex-col lg:flex-row gap-6 h-[calc(100vh-20rem)]",children:[r.jsx("div",{className:"flex-1 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-full",children:r.jsx(ve,{streamingHook:g,onSelectionChanged:Qe,onGridReady:P})}),r.jsx("div",{className:"w-full lg:w-96 shrink-0 h-full",children:r.jsx(Ue,{meta:Ee,isLoading:be,hasError:x!==null})})]})]})};N.__docgenInfo={description:"",methods:[],displayName:"ListDID",props:{firstPattern:{required:!1,tsType:{name:"string"},description:""},initialData:{required:!1,tsType:{name:"Array",elements:[{name:"DIDViewModel"}],raw:"DIDViewModel[]"},description:""},autoSearch:{required:!1,tsType:{name:"boolean"},description:""},initialType:{required:!1,tsType:{name:"DIDType"},description:""},onSearchStart:{required:!1,tsType:{name:"signature",type:"function",raw:"(params: DIDSearchParams) => void",signature:{arguments:[{type:{name:"DIDSearchParams"},name:"params"}],return:{name:"void"}}},description:""}}};const Zr={title:"Components/Pages/DID/List",component:N,parameters:{docs:{disable:!0}}},t=e=>{const a=new He;return r.jsx(Fe,{client:a,children:r.jsx(Be,{children:r.jsx(N,{...e})})})},b="/api/feature/list-dids",p="/api/feature/get-did-meta",j=Array.from({length:50},R),k=Array.from({length:200},R),We=Array.from({length:5e4},R),D=t.bind({});D.args={firstPattern:"test:file"};const f=t.bind({});f.args={firstPattern:"test"};const T=t.bind({});T.args={firstPattern:"test:file:line"};const s=t.bind({});s.args={firstPattern:"regular:streaming"};s.decorators=[u([E(b,{data:k}),v(p,{getData:()=>h()})])];const G=[h(S.FILE),h(S.DATASET),h(S.CONTAINER)],Pe=()=>{let e=0;return()=>{const a=G[e];return e++,e===G.length&&(e=0),a}},o=t.bind({});o.args={firstPattern:"slow:meta"};o.decorators=[u([E(b,{data:k}),v(p,{getData:Pe(),getDelay:()=>1e3})])];const U=[2e3,1e3,500],ze=()=>{let e=0;return()=>{const a=U[e];return e++,e===U.length&&(e=0),a}},l=t.bind({});l.args={firstPattern:"irregular:delay"};l.decorators=[u([E(b,{data:k}),v(p,{getData:Pe(),getDelay:ze()})])];const C=t.bind({});C.args={initialData:j};const Je={scope:"",name:"",did_type:S.UNKNOWN,...he()},I=t.bind({});I.args={initialData:Array.from({length:50},()=>Je)};const d=t.bind({});d.args={firstPattern:"huge:streaming"};d.decorators=[u([E(b,{data:We,delay:1}),v(p,{getData:()=>h(),getDelay:()=>100})])];const m=t.bind({});m.args={initialData:j};m.decorators=[u([v(p,{getData:()=>he()})])];const c=t.bind({});c.args={initialData:j};c.decorators=[u([Ke(p,{statusCode:500,message:"Internal error"})])];var O,B,H;D.parameters={...D.parameters,docs:{...(O=D.parameters)==null?void 0:O.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(H=(B=D.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};var K,W,z;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(z=(W=f.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};var J,X,Y;T.parameters={...T.parameters,docs:{...(J=T.parameters)==null?void 0:J.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(Y=(X=T.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;s.parameters={...s.parameters,docs:{...(Z=s.parameters)==null?void 0:Z.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(ee=($=s.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var re,te,ae;o.parameters={...o.parameters,docs:{...(re=o.parameters)==null?void 0:re.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(ae=(te=o.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var ne,ie,se;l.parameters={...l.parameters,docs:{...(ne=l.parameters)==null?void 0:ne.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(se=(ie=l.parameters)==null?void 0:ie.docs)==null?void 0:se.source}}};var oe,le,de;C.parameters={...C.parameters,docs:{...(oe=C.parameters)==null?void 0:oe.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(de=(le=C.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var me,ce,ue;I.parameters={...I.parameters,docs:{...(me=I.parameters)==null?void 0:me.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(ue=(ce=I.parameters)==null?void 0:ce.docs)==null?void 0:ue.source}}};var pe,ge,ye;d.parameters={...d.parameters,docs:{...(pe=d.parameters)==null?void 0:pe.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(ye=(ge=d.parameters)==null?void 0:ge.docs)==null?void 0:ye.source}}};var De,fe,Te;m.parameters={...m.parameters,docs:{...(De=m.parameters)==null?void 0:De.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(Te=(fe=m.parameters)==null?void 0:fe.docs)==null?void 0:Te.source}}};var Ce,Ie,Se;c.parameters={...c.parameters,docs:{...(Ce=c.parameters)==null?void 0:Ce.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(Se=(Ie=c.parameters)==null?void 0:Ie.docs)==null?void 0:Se.source}}};const $r=["ValidInitialPatternNoEndpoint","InvalidInitialPatternNoDelimiter","InvalidInitialPatternTwoDelimiters","RegularStreaming","SlowMeta","IrregularDelayMeta","InitialData","BadInitialData","HugeStreaming","MetaInvalidModel","MetaResponseError"];export{I as BadInitialData,d as HugeStreaming,C as InitialData,f as InvalidInitialPatternNoDelimiter,T as InvalidInitialPatternTwoDelimiters,l as IrregularDelayMeta,m as MetaInvalidModel,c as MetaResponseError,s as RegularStreaming,o as SlowMeta,D as ValidInitialPatternNoEndpoint,$r as __namedExportsOrder,Zr as default};
