import{r as c,j as t}from"./iframe-CW9-_HYS.js";import{T as W}from"./ToastedTemplate-D86UrxdT.js";import{k as R}from"./table-fixtures-CYu47AcK.js";import{D as _,S as q,u as D,g as I}from"./streaming-handlers-b88KKoEr.js";import{R as i}from"./RuleStateBadge-BAWFEWhj.js";import{R as o}from"./rucio-DwhGwk4W.js";import{b as s}from"./badge-cell-DGxqM9TI.js";import{C as Q}from"./ClickableCell-DqJL_nlM.js";import{H as M}from"./Heading-CuhxiBzz.js";import{u as G,Q as H}from"./useQuery-0oFJ3NNY.js";import{I as V}from"./InfoField-B8dFR66T.js";import{W as b}from"./WarningField-BeOti8S3.js";import{g as j}from"./index-D7cXXlPK.js";import{Q as O,g as k}from"./single-handlers-CBT38xIR.js";import"./preload-helper-Dp1pzeXC.js";import"./useToast-CidfTvTK.js";import"./Toaster-B7kGKkaG.js";import"./index-vscuIXpL.js";import"./index-EU4VEQCY.js";import"./index-D1mrQCGS.js";import"./index-DfvfBRvX.js";import"./index-zIJ3W_2m.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-DWUw-EzS.js";import"./iconBase-_tCx069T.js";import"./Skeleton-CE5uc2hp.js";import"./index-DfmtFgSt.js";import"./LoadingSpinner-Blb2vFxO.js";import"./list-toasts-CqaY5F_J.js";import"./Badge-BBZTtNoB.js";import"./Field-DPVrUdUM.js";const U=e=>t.jsx(Q,{href:`/subscription/${e.account}/${e.value}`,children:e.value}),F=e=>{const a=c.useRef(null),r=175,[d]=c.useState([{headerName:"Name",field:"name",flex:5,minWidth:300,pinned:"left",cellRenderer:U,cellRendererParams:{account:e.account},filter:!0,filterParams:_},{headerName:"OK",field:"state_ok",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.OK},filter:"agNumberColumnFilter"},{headerName:"Replicating",field:"state_replicating",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.REPLICATING},filter:"agNumberColumnFilter"},{headerName:"Stuck",field:"state_stuck",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.STUCK},filter:"agNumberColumnFilter"},{headerName:"Suspended",field:"state_suspended",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.SUSPENDED},filter:"agNumberColumnFilter"},{headerName:"Waiting Approval",field:"state_waiting_approval",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.WAITING_APPROVAL},filter:"agNumberColumnFilter"},{headerName:"Inject",field:"state_inject",minWidth:r,headerComponent:i,headerComponentParams:{className:s,value:o.INJECT},filter:"agNumberColumnFilter"}]);return t.jsx(q,{columnDefs:d,tableRef:a,...e})};F.__docgenInfo={description:"",methods:[],displayName:"ListSubscriptionTable",props:{streamingHook:{required:!0,tsType:{name:"UseStreamReader",elements:[{name:"SubscriptionRuleStatesViewModel"}],raw:"UseStreamReader<SubscriptionRuleStatesViewModel>"},description:""},onGridReady:{required:!0,tsType:{name:"signature",type:"function",raw:"(event: GridReadyEvent) => void",signature:{arguments:[{type:{name:"GridReadyEvent"},name:"event"}],return:{name:"void"}}},description:""},account:{required:!0,tsType:{name:"string"},description:""}}};const p=e=>{var h;const{gridApi:a,onGridReady:r,streamingHook:d,startStreaming:P}=D(e.initialData),f=c.useRef(!1),A=async()=>(await fetch("/api/feature/get-site-header")).json(),{data:u,error:g,isFetching:E}=G({queryKey:["subscription-account"],queryFn:A,retry:!1,refetchOnWindowFocus:!1,enabled:!e.accountFilter}),n=e.accountFilter||((h=u==null?void 0:u.activeAccount)==null?void 0:h.rucioAccount);return c.useEffect(()=>{const S=e.autoSearch!==!1;if(!f.current&&S&&!e.initialData&&a&&n){f.current=!0;const w=`/api/feature/list-subscription-rule-states?account=${encodeURIComponent(n)}`;P(w)}},[a,n]),!e.accountFilter&&E?t.jsx(V,{children:t.jsx("span",{children:"Loading account information..."})}):!e.accountFilter&&(g||!u||!u.activeAccount)?(console.log(g),t.jsx(b,{children:t.jsx("span",{children:"Failed to load account information"})})):n?t.jsxs("div",{className:"flex flex-col space-y-3 w-full",children:[t.jsxs(M,{size:"sm",className:"text-neutral-600 dark:text-neutral-400",children:["for account ",n]}),t.jsx("div",{className:"rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]",children:t.jsx(F,{streamingHook:d,onGridReady:r,account:n})})]}):t.jsx(b,{children:t.jsx("span",{children:"No account specified"})})};p.__docgenInfo={description:"",methods:[],displayName:"ListSubscription",props:{initialData:{required:!1,tsType:{name:"Array",elements:[{name:"SubscriptionRuleStatesViewModel"}],raw:"SubscriptionRuleStatesViewModel[]"},description:""},accountFilter:{required:!1,tsType:{name:"string"},description:""},autoSearch:{required:!1,tsType:{name:"boolean"},description:""}}};const Re={title:"Components/Pages/Subscription/List",component:p,parameters:{docs:{disable:!0}}},L=e=>{const a=new O,[r,d]=c.useState(!0);return c.useEffect(()=>{setTimeout(()=>{d(!1)},500)},[]),r?t.jsx("div",{children:"Loading the mocking engine..."}):t.jsx(H,{client:a,children:t.jsx(W,{children:t.jsx(p,{...e})})})},l=L.bind({});l.args={initialData:Array.from({length:50},()=>R())};l.decorators=[j([k("/api/feature/get-site-header",{getData:()=>({activeAccount:{rucioAccount:"jdoe"}})})])];const m=L.bind({});m.decorators=[j([I("/api/feature/list-subscription-rule-states",{data:Array.from({length:500},R),delay:5}),k("/api/feature/get-site-header",{getData:()=>({activeAccount:{rucioAccount:"jdoe"}})})])];var C,y,v;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`args => {
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
}`,...(x=(T=m.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};const je=["InitialDataNoEndpoint","RegularStreaming"];export{l as InitialDataNoEndpoint,m as RegularStreaming,je as __namedExportsOrder,Re as default};
