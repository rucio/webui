import{r as c,j as e,R as Ye,u as _e,s as Oe}from"./iframe-CbZ9RuD1.js";import{c as x}from"./utils-DsKtx5Xo.js";import{z as Be}from"./index-CY5-pjTU.js";import{v as Ke,w as Ze,x as qe,f as et,y as tt,z as rt,A as at,B as st,i as nt}from"./index.esm-Bh9o6rCW.js";import{L as W}from"./link-CLCsOSg8.js";import{I as it}from"./input-DudEH1ht.js";import{a as $e,c as ot,e as lt,d as ct,n as dt,b as ut}from"./navigation-BOezXZQt.js";import{n as Q}from"./image-DZ-qLyqj.js";import{c as mt}from"./index.esm-CDVKQKGR.js";import{t as ht}from"./tw-merge-Ds6tgvmq.js";import{L as xt}from"./LoadingElement-C0Dl0LYY.js";import{W as pt}from"./WarningField-D_GotWnc.js";import"./tips-data-C91Rf-jO.js";import{m as G}from"./proxy-vEXAzVUV.js";import{R as gt}from"./auth-models-DGfjT_QB.js";import"./preload-helper-Dp1pzeXC.js";import"./iconBase-BDSQWw1B.js";import"./index-DSpI4bVK.js";import"./LoadingSpinner-DNn-SVom.js";import"./Field-CSa0GJHY.js";const H={name:"DIDs",parameter:"Pattern",getHref:t=>$e({pattern:t.length>0?t:void 0})},S={name:"RSEs",parameter:"Expression",getHref:t=>ot(t.length>0?t:void 0)},$={name:"Rules",parameter:"ID",getHref:t=>t.length===0?"/rule/list":lt(t)},z=(t,a)=>({name:"DIDs",parameter:`Search ${a}`,getHref:s=>$e({pattern:s.length>0?s:void 0,type:t})}),bt=t=>{const a=s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),t.onMouseDown())};return e.jsx("div",{className:x("w-full py-1 px-3 hover:cursor-pointer",t.isHighlighted?"md:bg-brand-500 md:bg-opacity-25 md:hover:bg-opacity-40 md:text-neutral-900 md:dark:text-neutral-100 md:font-normal text-brand-500 font-bold":"md:hover:bg-neutral-200 md:dark:bg-neutral-800 md:hover:dark:bg-neutral-600 hover:text-brand-500 md:hover:text-neutral-900 md:hover:dark:text-neutral-100"),onMouseDown:t.onMouseDown,onKeyDown:a,role:"button",tabIndex:0,children:t.children})},ft=c.forwardRef(function(a,s){return e.jsx("div",{className:x("md:w-[36rem] w-full flex flex-col md:text-left text-center","md:absolute relative md:mt-2 mt-4","md:rounded-md md:border md:border-neutral-900 md:dark:border-neutral-100 md:border-opacity-10 md:dark:border-opacity-10","md:bg-neutral-100 md:dark:bg-neutral-800","z-[100]"),children:e.jsx("nav",{className:"w-full h-full flex flex-col items-start",children:a.searchLocations.map((n,r)=>e.jsx(bt,{onMouseDown:()=>a.proceedTo(n),isHighlighted:a.highlightedIndex===r,children:e.jsxs("span",{className:"flex items-center min-w-0",children:[e.jsx("span",{className:"flex-shrink-0",children:n.parameter})," ",e.jsx("i",{className:"truncate mx-1",children:a.searchQuery})," ",e.jsxs("span",{className:"flex-shrink-0",children:["in ",n.name]})]})},n.name))})})}),X=()=>{const[t,a]=c.useState(!1),[s,n]=c.useState(""),[r,i]=c.useState("Ctrl + K"),[o,d]=c.useState([H,S,$]),[h,p]=c.useState(-1),v=c.useRef(null),N=c.useRef(null),w=m=>{var u,b;!((u=v.current)!=null&&u.contains(m.target))&&!((b=N.current)!=null&&b.contains(m.target))&&a(!1)};c.useEffect(()=>{const m=navigator.platform.toUpperCase().indexOf("MAC")>=0||navigator.userAgent.toUpperCase().indexOf("MAC")>=0;i(m?"⌘ K":"Ctrl + K")},[]),c.useEffect(()=>{const m=u=>{var b;(u.metaKey||u.ctrlKey)&&u.key==="k"&&(u.preventDefault(),(b=N.current)==null||b.focus())};return document.addEventListener("keydown",m),()=>document.removeEventListener("keydown",m)},[]),c.useEffect(()=>(document.addEventListener("mousedown",w),()=>document.removeEventListener("mousedown",w)),[v]);const Qe=m=>{const u=m.target.value,b=ct(u);u.length===0?d([H,S,$]):d(b==="did"?[z("dataset","Dataset"),z("file","File"),z("container","Container")]:b==="rse"?[S]:b==="rule"?[$,S,H]:[S,H]),p(0),n(u)},J=m=>{dt(m.getHref(s))},Ge=m=>{m.key==="ArrowDown"?p(u=>u<o.length-1?u+1:u):m.key==="ArrowUp"?p(u=>u>0?u-1:0):m.key==="Enter"&&h>=0&&J(o[h])};return e.jsxs("span",{className:"relative",children:[e.jsx(it,{placeholder:r,onFocus:()=>a(!0),onBlur:()=>a(!1),onChange:Qe,onKeyDown:Ge,ref:N,className:"h-9"}),t&&e.jsx(ft,{searchQuery:s,ref:v,searchLocations:o,highlightedIndex:h,proceedTo:J})]})};X.__docgenInfo={description:"",methods:[],displayName:"Searchbar"};class l extends Error{constructor(a,s){var r;a instanceof Error?super(void 0,{cause:{err:a,...a.cause,...s}}):typeof a=="string"?(s instanceof Error&&(s={err:s,...s.cause}),super(a,s)):super(void 0,a),this.name=this.constructor.name,this.type=this.constructor.type??"AuthError",this.kind=this.constructor.kind??"error",(r=Error.captureStackTrace)==null||r.call(Error,this,this.constructor);const n=`https://errors.authjs.dev#${this.type.toLowerCase()}`;this.message+=`${this.message?". ":""}Read more at ${n}`}}class y extends l{}y.kind="signIn";class vt extends l{}vt.type="AdapterError";class kt extends l{}kt.type="AccessDenied";class yt extends l{}yt.type="CallbackRouteError";class jt extends l{}jt.type="ErrorPageLoop";class Nt extends l{}Nt.type="EventError";class wt extends l{}wt.type="InvalidCallbackUrl";class St extends y{constructor(){super(...arguments),this.code="credentials"}}St.type="CredentialsSignin";class Ht extends l{}Ht.type="InvalidEndpoints";class Et extends l{}Et.type="InvalidCheck";class At extends l{}At.type="JWTSessionError";class Ct extends l{}Ct.type="MissingAdapter";class Tt extends l{}Tt.type="MissingAdapterMethods";class Mt extends l{}Mt.type="MissingAuthorize";class Dt extends l{}Dt.type="MissingSecret";class Ut extends y{}Ut.type="OAuthAccountNotLinked";class Lt extends y{}Lt.type="OAuthCallbackError";class Rt extends l{}Rt.type="OAuthProfileParseError";class Ft extends l{}Ft.type="SessionTokenError";class It extends y{}It.type="OAuthSignInError";class Pt extends y{}Pt.type="EmailSignInError";class _t extends l{}_t.type="SignOutError";class Ot extends l{}Ot.type="UnknownAction";class Bt extends l{}Bt.type="UnsupportedStrategy";class Kt extends l{}Kt.type="InvalidProvider";class $t extends l{}$t.type="UntrustedHost";class zt extends l{}zt.type="Verification";class Vt extends y{}Vt.type="MissingCSRF";class Wt extends l{}Wt.type="DuplicateConditionalUI";class Xt extends l{}Xt.type="MissingWebAuthnAutocomplete";class Jt extends l{}Jt.type="WebAuthnVerificationError";class Qt extends y{}Qt.type="AccountNotLinked";class Gt extends l{}Gt.type="ExperimentalFeatureNotEnabled";class Yt extends l{}async function Zt(t,a,s,n={}){var i;const r=`${ze(a)}/${t}`;try{const o={headers:{"Content-Type":"application/json",...(i=n==null?void 0:n.headers)!=null&&i.cookie?{cookie:n.headers.cookie}:{}}};n!=null&&n.body&&(o.body=JSON.stringify(n.body),o.method="POST");const d=await fetch(r,o),h=await d.json();if(!d.ok)throw h;return h}catch(o){return s.error(new Yt(o.message,o)),null}}function ze(t){return typeof window>"u"?`${t.baseUrlServer}${t.basePathServer}`:t.basePath}function E(t){const a=new URL("http://localhost:3000/api/auth");t&&!t.startsWith("http")&&(t=`https://${t}`);const s=new URL(t||a),n=(s.pathname==="/"?a.pathname:s.pathname).replace(/\/$/,""),r=`${s.origin}${n}`;return{origin:s.origin,host:s.host,path:n,base:r,toString:()=>r}}var k={};const B={baseUrl:E(k.NEXTAUTH_URL??k.VERCEL_URL).origin,basePath:E(k.NEXTAUTH_URL).path,baseUrlServer:E(k.NEXTAUTH_URL_INTERNAL??k.NEXTAUTH_URL??k.VERCEL_URL).origin,basePathServer:E(k.NEXTAUTH_URL_INTERNAL??k.NEXTAUTH_URL).path,_lastSync:0,_session:void 0,_getSession:()=>{}};let V=null;function qt(){return typeof BroadcastChannel>"u"?{postMessage:()=>{},addEventListener:()=>{},removeEventListener:()=>{},name:"next-auth",onmessage:null,onmessageerror:null,close:()=>{},dispatchEvent:()=>!1}:new BroadcastChannel("next-auth")}function er(){return V===null&&(V=qt()),V}const tr={debug:console.debug,error:console.error,warn:console.warn};var Z,q;const Y=(q=(Z=c).createContext)==null?void 0:q.call(Z,void 0);function Ve(t){if(!Y)throw new Error("React Context is unavailable in Server Components");const a=c.useContext(Y),{required:s,onUnauthenticated:n}={},r=s&&a.status==="unauthenticated";return c.useEffect(()=>{if(r){const i=`${B.basePath}/signin?${new URLSearchParams({error:"SessionRequired",callbackUrl:window.location.href})}`;n?n():window.location.href=i}},[r,n]),r?{data:a.data,update:a.update,status:"loading"}:a}async function rr(){const t=await Zt("csrf",B,tr);return(t==null?void 0:t.csrfToken)??""}async function We(t){const{redirect:a=!0,redirectTo:s=(t==null?void 0:t.callbackUrl)??window.location.href}=t??{},n=ze(B),r=await rr(),o=await(await fetch(`${n}/signout`,{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1"},body:new URLSearchParams({csrfToken:r,callbackUrl:s})})).json();if(er().postMessage({event:"session",data:{trigger:"signout"}}),a){const d=o.url??s;window.location.href=d,d.includes("#")&&window.location.reload();return}return await B._getSession({event:"storage"}),o}const ar=t=>{const{update:a}=Ve(),s=_e(),n=async r=>{try{await a({account:r}),s.refresh()}catch(i){console.error("Failed to switch account:",i)}};return e.jsx("div",{className:"flex flex-col",children:t.accountList.map(r=>e.jsxs("button",{className:x("text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer","dark:text-neutral-300 dark:hover:bg-neutral-600","flex items-center justify-between py-2 px-1 space-x-4","text-right"),onClick:()=>n(r),children:[e.jsx(Ze,{className:"text-2xl text-neutral-900 dark:text-neutral-100 shrink-0"}),e.jsxs("span",{children:[e.jsx("span",{children:"Switch to "}),e.jsx("b",{className:"text-neutral-800 dark:text-neutral-100",children:r})]})]},"profile-"+r))})},sr=()=>{const t=async()=>{try{await We({callbackUrl:"/auth/login"})}catch(s){console.error("Failed to sign out:",s)}},a=s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),t())};return e.jsxs("div",{className:x("text-neutral-800 hover:bg-base-error-500 hover:bg-opacity-40 hover:cursor-pointer","dark:text-neutral-100","flex items-center justify-between py-2 px-1 space-x-4","text-right"),onClick:t,onKeyDown:a,role:"button",tabIndex:0,children:[e.jsxs("span",{children:["Sign ",e.jsx("b",{children:"out"})," of all accounts"]}),e.jsx(Ke,{className:"dark:text-neutral-100 text-2xl text-neutral-900 shrink-0"})]})},nr=()=>e.jsxs(W,{className:x("text-neutral-800 hover:bg-base-success-500 hover:bg-opacity-40 hover:cursor-pointer","dark:text-neutral-100","flex items-center justify-between py-2 px-1 space-x-4","text-right"),href:"/auth/login",prefetch:!1,children:[e.jsxs("span",{children:["Sign ",e.jsx("b",{children:"in to"})," another account"]}),e.jsx(qe,{className:"dark:text-neutral-100 text-2xl text-neutral-900 shrink-0"})]}),Xe=t=>{const a=t.accountsPossible.length!==1,{update:s}=Ve(),n=_e(),r=async()=>{try{if(t.accountsPossible.length===1){await We({callbackUrl:"/auth/login"});return}await s({removeAccount:t.accountActive}),n.refresh()}catch(i){console.error("Failed to sign out:",i)}};return e.jsxs("div",{className:x("divide-y divide-neutral-300 dark:divide-neutral-700","w-64 sm:w-fit p-2","absolute top-[52px] right-2","rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10","bg-neutral-100 dark:bg-neutral-800","z-[100]"),onMouseEnter:i=>i.preventDefault(),ref:t.menuRef,children:[e.jsxs("div",{className:ht("text-neutral-600 hover:cursor-pointer","dark:text-neutral-300","flex justify-between items-center py-4 px-1 space-x-4","text-right"),children:[e.jsxs("span",{className:"text-xl",children:[e.jsx("span",{children:"Hello, "}),e.jsx("b",{className:"text-neutral-900 dark:text-neutral-100",children:t.accountActive}),"!"]}),e.jsx("button",{className:x("bg-neutral-200 dark:bg-neutral-700 hover:bg-base-error-500 hover:bg-opacity-40 dark:hover:bg-base-error-500 dark:hover:bg-opacity-40","p-1 rounded-md"),onClick:r,title:"Sign out of this account",children:e.jsx(Ke,{className:"text-2xl text-neutral-900 dark:text-neutral-100 shrink-0"})})]}),a&&e.jsx(ar,{accountList:t.accountsPossible.filter(i=>i!==t.accountActive)}),e.jsx(nr,{}),a&&e.jsx(sr,{})]})},Je=({siteHeader:t})=>{var o,d;const[a,s]=Ye.useState(!1),n=c.useRef(null),r=c.useRef(null),i=h=>{var p,v;!((p=r.current)!=null&&p.contains(h.target))&&!((v=n.current)!=null&&v.contains(h.target))&&s(!1)};return c.useEffect(()=>{document.addEventListener("mousedown",i)},[r,n]),e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center",onClick:()=>s(!a),ref:n,children:e.jsx(mt,{className:"text-2xl"})}),a&&e.jsx(Xe,{accountActive:((o=t.activeAccount)==null?void 0:o.rucioAccount)??"",accountsPossible:((d=t.availableAccounts)==null?void 0:d.map(h=>h.rucioAccount))??[],menuRef:r})]})};Xe.__docgenInfo={description:"",methods:[],displayName:"AccountDropdown",props:{menuRef:{required:!0,tsType:{name:"RefObject",elements:[{name:"union",raw:"HTMLDivElement | null",elements:[{name:"HTMLDivElement"},{name:"null"}]}],raw:"RefObject<HTMLDivElement | null>"},description:""},accountActive:{required:!0,tsType:{name:"string"},description:""},accountsPossible:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""}}};Je.__docgenInfo={description:"",methods:[],displayName:"AccountButton",props:{siteHeader:{required:!0,tsType:{name:"SiteHeaderViewModel"},description:""}}};const ir=c.createContext(void 0),or=()=>{const t=c.useContext(ir);if(t===void 0)throw new Error("useTips must be used within a TipsProvider");return t},K=({item:t,pathname:a,onClick:s})=>{const r=`hover:text-brand-500 transition-colors duration-150 ${t.path===a&&"text-brand-500 font-semibold"}`;return e.jsx(W,{href:t.path??"/",className:x(r,"relative"),onClick:s,children:t.title})},lr=({menuItems:t})=>{const a=Oe(),s=r=>e.jsx("div",{className:x("absolute left-0 w-max","hidden group-hover:block","bg-neutral-100 dark:bg-neutral-800","rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10"),children:e.jsx("div",{className:"flex flex-col space-y-2 px-4 py-2",children:r.map(i=>e.jsx(K,{item:i,pathname:a},i.path))})}),n=r=>r.children?r.children.some(i=>i.path===a):!1;return e.jsx("nav",{className:"hidden md:flex items-center space-x-8 relative","aria-label":"Main navigation",children:t.map(r=>{const i=r.title.toLowerCase(),o=r.path===a||n(r),d=`hover:text-brand-500 transition-colors duration-150 ${o&&"text-brand-500 font-semibold"}`;return r.path?e.jsxs("div",{className:"relative",children:[e.jsx(K,{item:r,pathname:a}),o&&e.jsx(G.div,{layoutId:"desktop-nav-underline",className:"absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-500",initial:!1,transition:{type:"spring",stiffness:380,damping:30}})]},r.path):e.jsxs("div",{className:"relative group",children:[e.jsxs("div",{className:x(d,"cursor-pointer"),children:[e.jsx("span",{children:r.title}),e.jsx(et,{className:"inline pl-1 h-5 w-5","aria-hidden":"true"})]}),r.children&&s(r.children),o&&e.jsx(G.div,{layoutId:"desktop-nav-underline",className:"absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-500",initial:!1,transition:{type:"spring",stiffness:380,damping:30}})]},i)})})},cr=({menuItems:t})=>{const a=Oe(),[s,n]=c.useState(!1);return e.jsxs("div",{className:"flex md:hidden",children:[e.jsx("button",{className:"rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center",onClick:()=>n(r=>!r),"aria-label":"Toggle mobile menu","aria-expanded":s,"aria-controls":"mobile-menu",children:e.jsx(st,{className:"h-5 w-5"})}),s&&e.jsxs("div",{className:"fixed inset-x-0 top-0 h-screen w-screen z-50",role:"dialog","aria-modal":"true",children:[e.jsx("div",{className:"absolute inset-0 bg-neutral-1000 bg-opacity-50",onClick:()=>n(!1),"aria-hidden":"true"}),e.jsxs("div",{id:"mobile-menu",className:"absolute top-0 right-0 h-full w-[85%] max-w-sm bg-neutral-0 dark:bg-neutral-900 shadow-xl p-6 overflow-y-auto flex flex-col space-y-6",children:[e.jsx("button",{onClick:()=>n(!1),className:"self-end p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500","aria-label":"Close mobile menu",children:e.jsx(nt,{className:"h-6 w-6 text-neutral-900 dark:text-neutral-100"})}),e.jsx("div",{className:"md:hidden block",children:e.jsx(X,{})}),e.jsx("nav",{className:"flex flex-col items-start space-y-4 text-lg","aria-label":"Mobile navigation",children:t.map(r=>{var i;return r.path?e.jsx(K,{item:r,pathname:a,onClick:()=>n(!1)},r.path):(i=r.children)==null?void 0:i.map(o=>e.jsx(K,{item:o,pathname:a,onClick:()=>n(!1)},o.path))})})]})]})]})},dr=()=>{const{resolvedTheme:t,setTheme:a}=Be(),[s,n]=c.useState(!1),r=()=>{a(t==="dark"?"light":"dark")};c.useEffect(()=>{n(!0)},[]);const i=o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),r())};return s?e.jsx("div",{className:"rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center flex",onClick:r,onKeyDown:i,role:"button",tabIndex:0,"aria-label":"Toggle theme",children:t==="dark"?e.jsx(rt,{className:"h-6 w-6"}):e.jsx(at,{className:"h-6 w-6"})}):e.jsx("div",{className:"w-10 h-6"})},ur=()=>{const{openPanel:t,dismissedTips:a,allTips:s}=or(),n=s.length-a.size,r=i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),t())};return e.jsxs("div",{className:"rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center flex relative cursor-pointer",onClick:t,onKeyDown:r,role:"button",tabIndex:0,"aria-label":`Tips and help${n>0?` (${n} available)`:""}`,children:[e.jsx(tt,{className:"h-6 w-6"}),n>0&&e.jsx("span",{className:x("absolute -top-1 -right-1","flex items-center justify-center","h-4 w-4 text-[10px] font-medium","bg-brand-500 text-white","rounded-full"),children:n>9?"9+":n})]})},j=({siteHeader:t,siteHeaderError:a,isSiteHeaderFetching:s})=>{var w;const n=ut((w=t==null?void 0:t.activeAccount)==null?void 0:w.rucioAccount),r=[{title:"Dashboard",path:"/dashboard"},{title:"DIDs",path:"/did/list"},{title:"RSEs",path:"/rse/list"},{title:"Subscriptions",path:n},{title:"Rules",children:[{title:"List Rules",path:"/rule/list"},{title:"Create a rule",path:"/rule/create"}]}],{resolvedTheme:i}=Be(),[o,d]=c.useState(!1);c.useEffect(()=>{d(!0)},[]);const h=o&&i==="dark"?"/logo_dark.svg":"/logo_light.svg",p=36,v=o&&i==="dark"?"linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)":"linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",N=()=>s?e.jsx(xt,{context:"inline",size:"sm"}):a||!t?e.jsx(pt,{children:e.jsx("span",{children:"Error retrieving site header"})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(W,{className:"w-12 h-full stroke-white fill-white",href:"/dashboard",children:e.jsx(Q,{src:h,alt:"Rucio Logo",width:p,height:p,style:{height:"auto"},suppressHydrationWarning:!0})}),e.jsx("a",{className:"w-12 h-full",href:t.projectUrl,children:e.jsx(Q,{src:"/experiment-logo.png",alt:"Experiment Logo",width:p,height:p,style:{height:"auto"}})}),e.jsx("div",{className:"pl-1 md:block hidden",children:e.jsx(X,{})})]}),e.jsx("div",{children:e.jsx(lr,{menuItems:r})}),e.jsxs("div",{className:"flex h-full",children:[e.jsx(ur,{}),e.jsx(dr,{}),e.jsx(Je,{siteHeader:t}),e.jsx(cr,{menuItems:r})]})]});return e.jsxs(e.Fragment,{children:[e.jsx("a",{href:"#main-content",className:"sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded focus:shadow-lg",children:"Skip to main content"}),e.jsxs("header",{role:"banner",className:x("sticky top-0 h-14 z-10 relative","bg-neutral-0/95 dark:bg-neutral-900/95 backdrop-blur-lg","border-b border-neutral-200 dark:border-neutral-800","p-2 flex flex-row justify-between items-center","text-neutral-900 dark:text-neutral-100","shadow-md dark:shadow-xl"),children:[e.jsx("div",{className:"absolute inset-0 pointer-events-none",style:{background:v},suppressHydrationWarning:!0}),e.jsx("div",{className:"relative z-10 flex flex-row justify-between items-center w-full",children:N()})]})]})};j.__docgenInfo={description:"",methods:[],displayName:"HeaderClient",props:{siteHeader:{required:!1,tsType:{name:"SiteHeaderViewModel"},description:""},siteHeaderError:{required:!0,tsType:{name:"unknown"},description:""},isSiteHeaderFetching:{required:!0,tsType:{name:"boolean"},description:""}}};const Dr={title:"Features/Layout/HeaderClient",component:j,parameters:{layout:"fullscreen"},tags:["autodocs"]},f=t=>({rucioIdentity:"mock-identity",rucioAccount:t,rucioVO:"mock-vo",role:gt.USER,country:"Switzerland"}),g={status:"success",activeAccount:f("jdoe"),availableAccounts:[f("jdoe")],homeUrl:"https://rucio.cern.ch",projectUrl:"https://home.cern"},A={args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},C={args:{siteHeader:{...g,activeAccount:f("alice"),availableAccounts:[f("alice")]},siteHeaderError:null,isSiteHeaderFetching:!1}},T={args:{siteHeader:{...g,activeAccount:f("alice"),availableAccounts:[f("alice"),f("bob"),f("charlie"),f("diana")]},siteHeaderError:null,isSiteHeaderFetching:!1}},M={args:{siteHeader:void 0,siteHeaderError:null,isSiteHeaderFetching:!0}},D={args:{siteHeader:void 0,siteHeaderError:new globalThis.Error("Failed to fetch header data"),isSiteHeaderFetching:!1}},U={render:t=>e.jsxs("div",{children:[e.jsx(j,{...t}),e.jsxs("main",{id:"main-content",tabIndex:-1,className:"p-8",children:[e.jsx("h1",{className:"text-3xl font-bold mb-4",children:"Main Content"}),e.jsxs("p",{className:"text-neutral-600 dark:text-neutral-400 mb-4",children:["Press ",e.jsx("kbd",{className:"px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-sm",children:"Tab"}),' key to reveal the "Skip to main content" link at the top of the page.']}),e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsx("h2",{className:"text-xl font-semibold mb-2",children:"Accessibility Feature"}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"The skip link allows keyboard users to bypass the navigation and jump directly to the main content."})]})]})]}),args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},L={parameters:{viewport:{defaultViewport:"mobile1"}},args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},R={parameters:{viewport:{defaultViewport:"mobile1"}},render:t=>e.jsxs("div",{children:[e.jsx(j,{...t}),e.jsxs("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-400",children:[e.jsx("p",{children:"Click the hamburger menu icon (☰) to open the mobile navigation."}),e.jsx("p",{className:"mt-2",children:"The mobile menu features:"}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1",children:[e.jsx("li",{children:"Full-screen overlay"}),e.jsx("li",{children:"Close button (X)"}),e.jsx("li",{children:"Search bar integration"}),e.jsx("li",{children:"Vertical navigation links"})]})]})]}),args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},F={parameters:{viewport:{defaultViewport:"tablet"}},args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},I={parameters:{backgrounds:{default:"dark"}},render:t=>e.jsxs("div",{className:"dark bg-neutral-900 min-h-screen",children:[e.jsx(j,{...t}),e.jsxs("main",{className:"p-8",children:[e.jsx("h1",{className:"text-3xl font-bold text-neutral-100 mb-4",children:"Dark Mode"}),e.jsx("p",{className:"text-neutral-400",children:"Header with dark mode styling"})]})]}),args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},P={render:t=>e.jsxs("div",{className:"min-h-screen flex flex-col",children:[e.jsx(j,{...t}),e.jsxs("main",{id:"main-content",tabIndex:-1,className:"flex-1 p-8",children:[e.jsx("h1",{className:"text-4xl font-bold mb-4",children:"Dashboard"}),e.jsx("p",{className:"text-neutral-600 dark:text-neutral-400 mb-8",children:"Full page layout demonstrating header integration"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8",children:[1,2,3].map(a=>e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsxs("h3",{className:"font-semibold mb-2",children:["Card ",a]}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Dashboard content"})]},a))}),e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Data Table"}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Table content would go here"})]})]})]}),args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},_={render:t=>e.jsxs("div",{children:[e.jsx(j,{...t}),e.jsxs("main",{className:"p-8",children:[e.jsx("h1",{className:"text-3xl font-bold mb-4",children:"Responsive Behavior"}),e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Breakpoints"}),e.jsxs("ul",{className:"space-y-2 text-sm text-neutral-600 dark:text-neutral-400",children:[e.jsxs("li",{children:["• Mobile (","<","975px): Hamburger menu with full-screen overlay"]}),e.jsx("li",{children:"• Desktop (≥975px): Horizontal navigation bar with dropdown menus"}),e.jsxs("li",{children:["• Search bar: Hidden on mobile (","<","768px), visible on tablet+ (≥768px)"]})]}),e.jsxs("div",{className:"mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded",children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Try it:"}),e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:"Resize your browser window to see the navigation adapt between mobile and desktop layouts."})]})]})]})]}),args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}},O={render:t=>e.jsxs("div",{children:[e.jsx(j,{...t}),e.jsxs("main",{id:"main-content",tabIndex:-1,className:"p-8",children:[e.jsx("h1",{className:"text-3xl font-bold mb-6",children:"Accessibility Features"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsx("h2",{className:"text-xl font-semibold mb-3",children:"Skip to Main Content"}),e.jsxs("p",{className:"text-sm text-neutral-600 dark:text-neutral-400 mb-2",children:["Press ",e.jsx("kbd",{className:"px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-xs",children:"Tab"})," to reveal the skip link that allows keyboard users to bypass navigation."]})]}),e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsx("h2",{className:"text-xl font-semibold mb-3",children:"ARIA Attributes"}),e.jsxs("ul",{className:"list-disc ml-6 text-sm text-neutral-600 dark:text-neutral-400 space-y-1",children:[e.jsxs("li",{children:[e.jsx("code",{children:'role="banner"'})," on header element"]}),e.jsxs("li",{children:[e.jsx("code",{children:'aria-label="Main navigation"'})," on nav element"]}),e.jsxs("li",{children:[e.jsx("code",{children:"aria-expanded"})," on mobile menu button"]}),e.jsxs("li",{children:[e.jsx("code",{children:"aria-controls"})," linking button to menu"]}),e.jsxs("li",{children:[e.jsx("code",{children:'role="dialog"'})," and ",e.jsx("code",{children:'aria-modal="true"'})," on mobile overlay"]}),e.jsxs("li",{children:[e.jsx("code",{children:'aria-hidden="true"'})," on decorative icons"]})]})]}),e.jsxs("div",{className:"bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg",children:[e.jsx("h2",{className:"text-xl font-semibold mb-3",children:"Keyboard Navigation"}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"All interactive elements are keyboard accessible via Tab, Shift+Tab, and Enter keys."})]})]})]})]}),args:{siteHeader:g,siteHeaderError:null,isSiteHeaderFetching:!1}};var ee,te,re;A.parameters={...A.parameters,docs:{...(ee=A.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(re=(te=A.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var ae,se,ne;C.parameters={...C.parameters,docs:{...(ae=C.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    siteHeader: {
      ...mockSiteHeader,
      activeAccount: getMockUser('alice'),
      availableAccounts: [getMockUser('alice')]
    },
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(ne=(se=C.parameters)==null?void 0:se.docs)==null?void 0:ne.source}}};var ie,oe,le;T.parameters={...T.parameters,docs:{...(ie=T.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    siteHeader: {
      ...mockSiteHeader,
      activeAccount: getMockUser('alice'),
      availableAccounts: [getMockUser('alice'), getMockUser('bob'), getMockUser('charlie'), getMockUser('diana')]
    },
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(le=(oe=T.parameters)==null?void 0:oe.docs)==null?void 0:le.source}}};var ce,de,ue;M.parameters={...M.parameters,docs:{...(ce=M.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    siteHeader: undefined,
    siteHeaderError: null,
    isSiteHeaderFetching: true
  }
}`,...(ue=(de=M.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,he,xe;D.parameters={...D.parameters,docs:{...(me=D.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    siteHeader: undefined,
    siteHeaderError: new globalThis.Error('Failed to fetch header data'),
    isSiteHeaderFetching: false
  }
}`,...(xe=(he=D.parameters)==null?void 0:he.docs)==null?void 0:xe.source}}};var pe,ge,be;U.parameters={...U.parameters,docs:{...(pe=U.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: args => <div>
            <HeaderClient {...args} />
            <main id="main-content" tabIndex={-1} className="p-8">
                <h1 className="text-3xl font-bold mb-4">Main Content</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-sm">Tab</kbd> key to reveal the "Skip to main
                    content" link at the top of the page.
                </p>
                <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Accessibility Feature</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        The skip link allows keyboard users to bypass the navigation and jump directly to the main content.
                    </p>
                </div>
            </main>
        </div>,
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(be=(ge=U.parameters)==null?void 0:ge.docs)==null?void 0:be.source}}};var fe,ve,ke;L.parameters={...L.parameters,docs:{...(fe=L.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(ke=(ve=L.parameters)==null?void 0:ve.docs)==null?void 0:ke.source}}};var ye,je,Ne;R.parameters={...R.parameters,docs:{...(ye=R.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: args => <div>
            <HeaderClient {...args} />
            <div className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>Click the hamburger menu icon (☰) to open the mobile navigation.</p>
                <p className="mt-2">The mobile menu features:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Full-screen overlay</li>
                    <li>Close button (X)</li>
                    <li>Search bar integration</li>
                    <li>Vertical navigation links</li>
                </ul>
            </div>
        </div>,
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(Ne=(je=R.parameters)==null?void 0:je.docs)==null?void 0:Ne.source}}};var we,Se,He;F.parameters={...F.parameters,docs:{...(we=F.parameters)==null?void 0:we.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  },
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(He=(Se=F.parameters)==null?void 0:Se.docs)==null?void 0:He.source}}};var Ee,Ae,Ce;I.parameters={...I.parameters,docs:{...(Ee=I.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: args => <div className="dark bg-neutral-900 min-h-screen">
            <HeaderClient {...args} />
            <main className="p-8">
                <h1 className="text-3xl font-bold text-neutral-100 mb-4">Dark Mode</h1>
                <p className="text-neutral-400">Header with dark mode styling</p>
            </main>
        </div>,
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(Ce=(Ae=I.parameters)==null?void 0:Ae.docs)==null?void 0:Ce.source}}};var Te,Me,De;P.parameters={...P.parameters,docs:{...(Te=P.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: args => <div className="min-h-screen flex flex-col">
            <HeaderClient {...args} />
            <main id="main-content" tabIndex={-1} className="flex-1 p-8">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">Full page layout demonstrating header integration</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => <div key={i} className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                            <h3 className="font-semibold mb-2">Card {i}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Dashboard content</p>
                        </div>)}
                </div>

                <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Data Table</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Table content would go here</p>
                </div>
            </main>
        </div>,
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(De=(Me=P.parameters)==null?void 0:Me.docs)==null?void 0:De.source}}};var Ue,Le,Re;_.parameters={..._.parameters,docs:{...(Ue=_.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: args => <div>
            <HeaderClient {...args} />
            <main className="p-8">
                <h1 className="text-3xl font-bold mb-4">Responsive Behavior</h1>
                <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Breakpoints</h2>
                    <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <li>• Mobile ({'<'}975px): Hamburger menu with full-screen overlay</li>
                        <li>• Desktop (≥975px): Horizontal navigation bar with dropdown menus</li>
                        <li>• Search bar: Hidden on mobile ({'<'}768px), visible on tablet+ (≥768px)</li>
                    </ul>

                    <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
                        <p className="text-sm font-medium mb-2">Try it:</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Resize your browser window to see the navigation adapt between mobile and desktop layouts.
                        </p>
                    </div>
                </div>
            </main>
        </div>,
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(Re=(Le=_.parameters)==null?void 0:Le.docs)==null?void 0:Re.source}}};var Fe,Ie,Pe;O.parameters={...O.parameters,docs:{...(Fe=O.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: args => <div>
            <HeaderClient {...args} />
            <main id="main-content" tabIndex={-1} className="p-8">
                <h1 className="text-3xl font-bold mb-6">Accessibility Features</h1>

                <div className="space-y-6">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Skip to Main Content</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                            Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-xs">Tab</kbd> to reveal the skip link that
                            allows keyboard users to bypass navigation.
                        </p>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">ARIA Attributes</h2>
                        <ul className="list-disc ml-6 text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li>
                                <code>role="banner"</code> on header element
                            </li>
                            <li>
                                <code>aria-label="Main navigation"</code> on nav element
                            </li>
                            <li>
                                <code>aria-expanded</code> on mobile menu button
                            </li>
                            <li>
                                <code>aria-controls</code> linking button to menu
                            </li>
                            <li>
                                <code>role="dialog"</code> and <code>aria-modal="true"</code> on mobile overlay
                            </li>
                            <li>
                                <code>aria-hidden="true"</code> on decorative icons
                            </li>
                        </ul>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Keyboard Navigation</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            All interactive elements are keyboard accessible via Tab, Shift+Tab, and Enter keys.
                        </p>
                    </div>
                </div>
            </main>
        </div>,
  args: {
    siteHeader: mockSiteHeader,
    siteHeaderError: null,
    isSiteHeaderFetching: false
  }
}`,...(Pe=(Ie=O.parameters)==null?void 0:Ie.docs)==null?void 0:Pe.source}}};const Ur=["Default","SingleAccount","MultipleAccounts","Loading","Error","WithMainContent","Mobile","MobileWithMenu","Tablet","DarkMode","FullPageLayout","ResponsiveBehavior","AccessibilityFeatures"];export{O as AccessibilityFeatures,I as DarkMode,A as Default,D as Error,P as FullPageLayout,M as Loading,L as Mobile,R as MobileWithMenu,T as MultipleAccounts,_ as ResponsiveBehavior,C as SingleAccount,F as Tablet,U as WithMainContent,Ur as __namedExportsOrder,Dr as default};
