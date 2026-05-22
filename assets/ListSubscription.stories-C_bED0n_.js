import{r as c,j as t}from"./iframe-CYzR_2Pj.js";import{T as W}from"./ToastedTemplate-CjBzpWbz.js";import{k as R}from"./table-fixtures-8wyiCRvf.js";import{D as _,S as q,u as D}from"./useTableStreaming-C0yDRlxS.js";import{R as i}from"./RuleStateBadge-DSflIC3h.js";import{R as o}from"./rucio-DwhGwk4W.js";import{b as s}from"./badge-cell-DGxqM9TI.js";import{C as I}from"./ClickableCell-C4z33TtI.js";import{H as Q}from"./Heading-C2R-0nsS.js";import{u as M}from"./useQuery-Cmce0g65.js";import{I as G}from"./InfoField-BBW39AWp.js";import{W as b}from"./WarningField-BOyTptxH.js";import{g as j}from"./index-Be53XX03.js";import{g as H}from"./streaming-handlers-CByfEbgo.js";import{g as k}from"./single-handlers-B7YZXglK.js";import{Q as V}from"./QueryClientProvider-DduKQOyd.js";import{Q as O}from"./queryClient-GNPM50w2.js";import"./preload-helper-Dp1pzeXC.js";import"./useToast-BGK9sOeY.js";import"./Toaster-DzOSBP6E.js";import"./index-XI8BcS_X.js";import"./index-C02K-P7G.js";import"./index-CGXKTZtt.js";import"./index-BqJkGV6w.js";import"./index-oHX1AYWc.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-Jurny2OC.js";import"./iconBase-BSp4gafK.js";import"./Skeleton-DPwwwdn7.js";import"./index-CbweDcIT.js";import"./LoadingSpinner-C1bSIJ0y.js";import"./BaseViewModelValidator-CMVmPsIp.js";import"./list-toasts-CqaY5F_J.js";import"./Badge-D8xwMAG2.js";import"./Field-B6jfgq0d.js";const U=e=>t.jsx(I,{href:`/subscription/${e.account}/${e.value}`,children:e.value}),F=e=>{const a=c.useRef(null),r=175,[d]=c.useState([{headerName:"Name",field:"name",flex:5,minWidth:300,pinned:"left",cellRenderer:U,cellRendererParams:{account:e.account},filter:!0,filterParams:_},{headerName:"OK",field:"state_ok",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.OK},filter:"agNumberColumnFilter"},{headerName:"Replicating",field:"state_replicating",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.REPLICATING},filter:"agNumberColumnFilter"},{headerName:"Stuck",field:"state_stuck",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.STUCK},filter:"agNumberColumnFilter"},{headerName:"Suspended",field:"state_suspended",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.SUSPENDED},filter:"agNumberColumnFilter"},{headerName:"Waiting Approval",field:"state_waiting_approval",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.WAITING_APPROVAL},filter:"agNumberColumnFilter"},{headerName:"Inject",field:"state_inject",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.INJECT},filter:"agNumberColumnFilter"}]);return t.jsx(q,{columnDefs:d,tableRef:a,...e})};F.__docgenInfo={description:"",methods:[],displayName:"ListSubscriptionTable",props:{streamingHook:{required:!0,tsType:{name:"UseStreamReader",elements:[{name:"SubscriptionRuleStatesViewModel"}],raw:"UseStreamReader<SubscriptionRuleStatesViewModel>"},description:""},onGridReady:{required:!0,tsType:{name:"signature",type:"function",raw:"(event: GridReadyEvent) => void",signature:{arguments:[{type:{name:"GridReadyEvent"},name:"event"}],return:{name:"void"}}},description:""},account:{required:!0,tsType:{name:"string"},description:""}}};const p=e=>{var h;const{gridApi:a,onGridReady:r,streamingHook:d,startStreaming:P}=D(e.initialData),f=c.useRef(!1),A=async()=>(await fetch("/api/feature/get-site-header")).json(),{data:u,error:g,isFetching:E}=M({queryKey:["subscription-account"],queryFn:A,retry:!1,refetchOnWindowFocus:!1,enabled:!e.accountFilter}),n=e.accountFilter||((h=u==null?void 0:u.activeAccount)==null?void 0:h.rucioAccount);return c.useEffect(()=>{const S=e.autoSearch!==!1;if(!f.current&&S&&!e.initialData&&a&&n){f.current=!0;const w=`/api/feature/list-subscription-rule-states?account=${encodeURIComponent(n)}`;P(w)}},[a,n]),!e.accountFilter&&E?t.jsx(G,{children:t.jsx("span",{children:"Loading account information..."})}):!e.accountFilter&&(g||!u||!u.activeAccount)?(console.log(g),t.jsx(b,{children:t.jsx("span",{children:"Failed to load account information"})})):n?t.jsxs("div",{className:"flex flex-col space-y-3 w-full",children:[t.jsxs(Q,{size:"sm",className:"text-neutral-600 dark:text-neutral-400",children:["for account ",n]}),t.jsx("div",{className:"rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]",children:t.jsx(F,{streamingHook:d,onGridReady:r,account:n})})]}):t.jsx(b,{children:t.jsx("span",{children:"No account specified"})})};p.__docgenInfo={description:"",methods:[],displayName:"ListSubscription",props:{initialData:{required:!1,tsType:{name:"Array",elements:[{name:"SubscriptionRuleStatesViewModel"}],raw:"SubscriptionRuleStatesViewModel[]"},description:""},accountFilter:{required:!1,tsType:{name:"string"},description:""},autoSearch:{required:!1,tsType:{name:"boolean"},description:""}}};const Le={title:"Components/Pages/Subscription/List",component:p,parameters:{docs:{disable:!0}}},L=e=>{const a=new O,[r,d]=c.useState(!0);return c.useEffect(()=>{setTimeout(()=>{d(!1)},500)},[]),r?t.jsx("div",{children:"Loading the mocking engine..."}):t.jsx(V,{client:a,children:t.jsx(W,{children:t.jsx(p,{...e})})})},l=L.bind({});l.args={initialData:Array.from({length:50},()=>R())};l.decorators=[j([k("/api/feature/get-site-header",{getData:()=>({activeAccount:{rucioAccount:"jdoe"}})})])];const m=L.bind({});m.decorators=[j([H("/api/feature/list-subscription-rule-states",{data:Array.from({length:500},R),delay:5}),k("/api/feature/get-site-header",{getData:()=>({activeAccount:{rucioAccount:"jdoe"}})})])];var C,y,v;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  const [loading, setLoading] = useState(true);

  // Wait for the mocking to be enabled
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  if (loading) {
    return <div>Loading the mocking engine...</div>;
  }
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListSubscription {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(v=(y=l.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var N,T,x;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`args => {
  const queryClient = new QueryClient();
  const [loading, setLoading] = useState(true);

  // Wait for the mocking to be enabled
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  if (loading) {
    return <div>Loading the mocking engine...</div>;
  }
  return <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListSubscription {...args} />
            </ToastedTemplate>
        </QueryClientProvider>;
}`,...(x=(T=m.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};const Pe=["InitialDataNoEndpoint","RegularStreaming"];export{l as InitialDataNoEndpoint,m as RegularStreaming,Pe as __namedExportsOrder,Le as default};
