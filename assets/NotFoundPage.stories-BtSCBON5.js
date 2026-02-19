import{j as e,r as Re}from"./iframe-CbZ9RuD1.js";import{L as Te}from"./link-CLCsOSg8.js";import{P as Ae}from"./PageContainer-BuffACpx.js";import{R as je}from"./RucioLogo-je1npqWy.js";import{m as r}from"./proxy-vEXAzVUV.js";import{u as Ue}from"./use-reduced-motion-CgJySeb8.js";import{H as Be}from"./Heading-BBK5GD02.js";import{B as Pe}from"./button-CTUPBRYB.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./list-toasts-CqaY5F_J.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";import"./useToast-YXabfrDf.js";function ve(){const o=Ue(),y=[{size:500,initialX:"5%",initialY:"10%",color:"from-brand-500/10 to-brand-600/5",duration:20,movement:{x:[0,50,-50,0],y:[0,-40,40,0]}},{size:400,initialX:"85%",initialY:"15%",color:"from-brand-400/10 to-brand-500/5",duration:25,movement:{x:[0,-40,40,0],y:[0,50,-50,0]}},{size:450,initialX:"10%",initialY:"75%",color:"from-brand-600/10 to-brand-700/5",duration:22,movement:{x:[0,40,-40,0],y:[0,-50,50,0]}},{size:350,initialX:"80%",initialY:"80%",color:"from-brand-500/8 to-brand-600/4",duration:28,movement:{x:[0,-50,50,0],y:[0,-40,40,0]}},{size:300,initialX:"50%",initialY:"5%",color:"from-brand-400/8 to-brand-500/4",duration:24,movement:{x:[0,30,-30,0],y:[0,40,-40,0]}}],b=[{size:4,duration:40,delay:0,orbitRadius:200,blur:2,posX:"15%",posY:"25%"},{size:3,duration:35,delay:5,orbitRadius:300,blur:1.5,posX:"80%",posY:"30%"},{size:5,duration:45,delay:10,orbitRadius:250,blur:2.5,posX:"20%",posY:"70%"},{size:4,duration:50,delay:15,orbitRadius:280,blur:2,posX:"75%",posY:"65%"},{size:3,duration:38,delay:8,orbitRadius:220,blur:1.5,posX:"50%",posY:"15%"}],f=[{d:"M 50 100 Q 300 50, 600 150 T 1200 200",strokeWidth:.4,duration:3,delay:0},{d:"M 1400 150 Q 1100 300, 800 250 T 200 500",strokeWidth:.4,duration:3.5,delay:.5},{d:"M 100 700 Q 500 600, 900 700 T 1500 650",strokeWidth:.4,duration:4,delay:1},{d:"M 1500 800 Q 1000 750, 600 850 T 100 900",strokeWidth:.4,duration:3.8,delay:1.5},{d:"M 750 50 Q 600 250, 850 400 T 750 700",strokeWidth:.3,duration:4.2,delay:.8}];return o?e.jsx("div",{className:"fixed inset-0 -z-10 bg-gradient-to-br from-neutral-50 via-brand-50/30 to-neutral-100 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-950"}):e.jsxs("div",{className:"fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-black dark:via-neutral-950 dark:to-neutral-900",children:[e.jsx(r.div,{className:"absolute inset-0 opacity-[0.03] dark:opacity-[0.05]",initial:{opacity:0},animate:{opacity:.03},transition:{duration:2},children:e.jsxs("svg",{width:"100%",height:"100%",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("defs",{children:e.jsx("pattern",{id:"grid",width:"80",height:"80",patternUnits:"userSpaceOnUse",children:e.jsx("path",{d:"M 80 0 L 0 0 0 80",fill:"none",stroke:"currentColor",strokeWidth:"0.5",className:"text-brand-500 dark:text-brand-400"})})}),e.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"})]})}),e.jsx("svg",{className:"absolute inset-0 w-full h-full pointer-events-none",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1600 1000",preserveAspectRatio:"xMidYMid slice",children:f.map((t,a)=>e.jsx(r.path,{d:t.d,fill:"none",stroke:"currentColor",strokeWidth:t.strokeWidth,className:"text-brand-500/5 dark:text-brand-400/20",initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:1},transition:{pathLength:{duration:t.duration,delay:t.delay,ease:"easeInOut"},opacity:{duration:1,delay:t.delay}}},a))}),y.map((t,a)=>e.jsx(r.div,{className:`absolute rounded-full blur-3xl bg-gradient-to-br ${t.color}`,style:{width:t.size,height:t.size,left:t.initialX,top:t.initialY},initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1,x:t.movement.x,y:t.movement.y},transition:{opacity:{duration:1,delay:a*.2},scale:{duration:1,delay:a*.2},x:{duration:t.duration,repeat:1/0,ease:"easeInOut",delay:a*.5},y:{duration:t.duration,repeat:1/0,ease:"easeInOut",delay:a*.5}}},`orb-${a}`)),b.map((t,a)=>e.jsx(r.div,{className:"absolute",style:{left:t.posX,top:t.posY,width:t.orbitRadius*2,height:t.orbitRadius*2,marginLeft:-t.orbitRadius,marginTop:-t.orbitRadius},initial:{opacity:0},animate:{opacity:[0,1,1,0],rotate:360},transition:{opacity:{duration:2,times:[0,.1,.9,1],delay:t.delay},rotate:{duration:t.duration,repeat:1/0,ease:"linear",delay:t.delay}},children:e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-brand-500/40 dark:bg-brand-400/40",style:{width:t.size,height:t.size,filter:`blur(${t.blur}px)`}})},`particle-${a}`)),e.jsxs("svg",{className:"absolute inset-0 w-full h-full pointer-events-none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx(r.line,{x1:"5%",y1:"10%",x2:"85%",y2:"15%",stroke:"currentColor",strokeWidth:"0.25",className:"text-brand-500/3 dark:text-brand-400/8",initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:.2},transition:{pathLength:{duration:2,delay:1.5,ease:"easeInOut"},opacity:{duration:1,delay:1.5}}}),e.jsx(r.line,{x1:"85%",y1:"15%",x2:"80%",y2:"80%",stroke:"currentColor",strokeWidth:"0.25",className:"text-brand-500/3 dark:text-brand-400/8",initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:.2},transition:{pathLength:{duration:2,delay:2,ease:"easeInOut"},opacity:{duration:1,delay:2}}}),e.jsx(r.line,{x1:"80%",y1:"80%",x2:"10%",y2:"75%",stroke:"currentColor",strokeWidth:"0.25",className:"text-brand-500/3 dark:text-brand-400/8",initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:.2},transition:{pathLength:{duration:2,delay:2.5,ease:"easeInOut"},opacity:{duration:1,delay:2.5}}}),e.jsx(r.line,{x1:"10%",y1:"75%",x2:"5%",y2:"10%",stroke:"currentColor",strokeWidth:"0.25",className:"text-brand-500/3 dark:text-brand-400/8",initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:.2},transition:{pathLength:{duration:2,delay:3,ease:"easeInOut"},opacity:{duration:1,delay:3}}}),e.jsx(r.line,{x1:"50%",y1:"5%",x2:"10%",y2:"75%",stroke:"currentColor",strokeWidth:"0.25",className:"text-brand-500/3 dark:text-brand-400/8",initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:.2},transition:{pathLength:{duration:2.5,delay:3.5,ease:"easeInOut"},opacity:{duration:1,delay:3.5}}})]})]})}ve.__docgenInfo={description:`Animated background with floating orbs, path drawing effects, and orbiting particles
Features subtle motion that enhances without distracting
Respects prefers-reduced-motion accessibility preference`,methods:[],displayName:"AnimatedBackground"};const x=Re.forwardRef(({code:o="404",heading:y="Page not found",message:b="The page you're looking for doesn't exist or has been moved.",returnUrl:f="/",returnLabel:t="Return to Home",logoSize:a=146,showAnimatedBackground:we=!0,className:Le},Ne)=>e.jsxs("div",{ref:Ne,className:`relative min-h-screen ${Le||""}`,children:[we&&e.jsx(ve,{}),e.jsx(Ae,{centered:!0,className:"relative z-10 min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-8 text-center",role:"alert","aria-live":"polite","aria-label":"Page not found",children:[e.jsx(je,{width:a,height:a,className:"text-brand-500 dark:text-brand-400","aria-label":"Rucio Logo"}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h1",{className:"text-neutral-900 dark:text-neutral-100 text-6xl sm:text-7xl md:text-8xl font-bold",children:o}),e.jsx(Be,{text:y,size:"md",className:"text-neutral-700 dark:text-neutral-300"})]}),e.jsx("p",{className:"text-base text-neutral-600 dark:text-neutral-400 max-w-md",children:b}),e.jsx(Te,{href:f,className:"mt-4",children:e.jsx(Pe,{variant:"default",size:"lg","aria-label":t,children:t})})]})})]}));x.displayName="NotFoundPage";x.__docgenInfo={description:`NotFoundPage component

A full-page 404 error state with the Rucio logo, animated background, and navigation.
Used by Next.js for non-existent routes and can be used in Storybook for testing.

@component
@example
\`\`\`tsx
// Default usage
<NotFoundPage />

// Custom message and return URL
<NotFoundPage
  heading="Resource Not Found"
  message="The dataset you're looking for could not be found."
  returnUrl="/datasets"
  returnLabel="Browse Datasets"
/>

// Without animated background
<NotFoundPage showAnimatedBackground={false} />
\`\`\``,methods:[],displayName:"NotFoundPage",props:{code:{required:!1,tsType:{name:"string"},description:`The 404 code to display
@default "404"`,defaultValue:{value:"'404'",computed:!1}},heading:{required:!1,tsType:{name:"string"},description:`Heading text below the 404 code
@default "Page not found"`,defaultValue:{value:"'Page not found'",computed:!1}},message:{required:!1,tsType:{name:"string"},description:`Help message to display
@default "The page you're looking for doesn't exist or has been moved."`,defaultValue:{value:`"The page you're looking for doesn't exist or has been moved."`,computed:!1}},returnUrl:{required:!1,tsType:{name:"string"},description:`URL to navigate to when return button is clicked
@default "/"`,defaultValue:{value:"'/'",computed:!1}},returnLabel:{required:!1,tsType:{name:"string"},description:`Label for the return button
@default "Return to Home"`,defaultValue:{value:"'Return to Home'",computed:!1}},logoSize:{required:!1,tsType:{name:"number"},description:`Size of the logo
@default 146`,defaultValue:{value:"146",computed:!1}},showAnimatedBackground:{required:!1,tsType:{name:"boolean"},description:`Whether to show animated background
@default true`,defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes for the container"}}};const Qe={title:"Pages/System/NotFoundPage",component:x,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{code:{control:"text",description:"The error code to display"},heading:{control:"text",description:"Heading text below the error code"},message:{control:"text",description:"Help message to display"},returnUrl:{control:"text",description:"URL to navigate to when return button is clicked"},returnLabel:{control:"text",description:"Label for the return button"},logoSize:{control:{type:"range",min:50,max:300,step:10},description:"Size of the Rucio logo"},showAnimatedBackground:{control:"boolean",description:"Whether to show animated background"}}},n={args:{code:"404",heading:"Page not found",message:"The page you're looking for doesn't exist or has been moved.",returnUrl:"/",returnLabel:"Return to Home",logoSize:146,showAnimatedBackground:!0}},s={args:{code:"404",heading:"Page not found",message:"The page you're looking for doesn't exist or has been moved.",returnUrl:"/",returnLabel:"Return to Home",showAnimatedBackground:!1}},i={args:{code:"403",heading:"Access Forbidden",message:"You don't have permission to access this resource.",returnUrl:"/dashboard",returnLabel:"Return to Dashboard",showAnimatedBackground:!0}},d={args:{code:"410",heading:"Resource Gone",message:"This resource is no longer available and has been permanently removed.",returnUrl:"/",returnLabel:"Return to Home",showAnimatedBackground:!0}},u={args:{code:"404",heading:"Dataset Not Found",message:"The dataset you are looking for could not be found. It may have been deleted or the name is incorrect.",returnUrl:"/datasets",returnLabel:"Browse Datasets",showAnimatedBackground:!0}},l={args:{code:"404",heading:"Rule Not Found",message:"The replication rule you are looking for does not exist or has been removed.",returnUrl:"/rules",returnLabel:"View All Rules",showAnimatedBackground:!0}},c={args:{code:"503",heading:"Under Maintenance",message:"The system is currently undergoing maintenance. Please check back later.",returnUrl:"/",returnLabel:"Try Again",showAnimatedBackground:!0}},m={args:{code:"404",heading:"Not Found",message:"This page doesn't exist.",returnUrl:"/",returnLabel:"Go Back",logoSize:100,showAnimatedBackground:!1}},g={args:{code:"404",heading:"Page not found",message:"The page you're looking for doesn't exist or has been moved.",returnUrl:"/",returnLabel:"Return to Home",showAnimatedBackground:!0},parameters:{backgrounds:{default:"dark"}},decorators:[o=>e.jsx("div",{className:"dark",children:e.jsx(o,{})})]},p={args:{code:"404",heading:"Page not found",message:"We couldn't find the page you're looking for. This might be because the URL is incorrect, the page has been moved, or it no longer exists. Please check the URL and try again, or use the navigation to find what you're looking for.",returnUrl:"/",returnLabel:"Return to Home",showAnimatedBackground:!0}},h={args:{code:"404",heading:"Not Found",message:"Page does not exist.",returnUrl:"/",returnLabel:"Home",logoSize:80,showAnimatedBackground:!1}};var k,v,w,L,N;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Page not found',
    message: "The page you're looking for doesn't exist or has been moved.",
    returnUrl: '/',
    returnLabel: 'Return to Home',
    logoSize: 146,
    showAnimatedBackground: true
  }
}`,...(w=(v=n.parameters)==null?void 0:v.docs)==null?void 0:w.source},description:{story:"Default 404 page with animated background",...(N=(L=n.parameters)==null?void 0:L.docs)==null?void 0:N.description}}};var R,T,A,j,U;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Page not found',
    message: "The page you're looking for doesn't exist or has been moved.",
    returnUrl: '/',
    returnLabel: 'Return to Home',
    showAnimatedBackground: false
  }
}`,...(A=(T=s.parameters)==null?void 0:T.docs)==null?void 0:A.source},description:{story:"404 page without animated background",...(U=(j=s.parameters)==null?void 0:j.docs)==null?void 0:U.description}}};var B,P,z,S,F;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    code: '403',
    heading: 'Access Forbidden',
    message: "You don't have permission to access this resource.",
    returnUrl: '/dashboard',
    returnLabel: 'Return to Dashboard',
    showAnimatedBackground: true
  }
}`,...(z=(P=i.parameters)==null?void 0:P.docs)==null?void 0:z.source},description:{story:"Custom 403 Forbidden page",...(F=(S=i.parameters)==null?void 0:S.docs)==null?void 0:F.description}}};var H,M,W,C,D;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    code: '410',
    heading: 'Resource Gone',
    message: 'This resource is no longer available and has been permanently removed.',
    returnUrl: '/',
    returnLabel: 'Return to Home',
    showAnimatedBackground: true
  }
}`,...(W=(M=d.parameters)==null?void 0:M.docs)==null?void 0:W.source},description:{story:"Custom 410 Gone page",...(D=(C=d.parameters)==null?void 0:C.docs)==null?void 0:D.description}}};var I,Y,X,O,V;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Dataset Not Found',
    message: 'The dataset you are looking for could not be found. It may have been deleted or the name is incorrect.',
    returnUrl: '/datasets',
    returnLabel: 'Browse Datasets',
    showAnimatedBackground: true
  }
}`,...(X=(Y=u.parameters)==null?void 0:Y.docs)==null?void 0:X.source},description:{story:"Custom dataset not found page",...(V=(O=u.parameters)==null?void 0:O.docs)==null?void 0:V.description}}};var q,G,_,Q,$;l.parameters={...l.parameters,docs:{...(q=l.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Rule Not Found',
    message: 'The replication rule you are looking for does not exist or has been removed.',
    returnUrl: '/rules',
    returnLabel: 'View All Rules',
    showAnimatedBackground: true
  }
}`,...(_=(G=l.parameters)==null?void 0:G.docs)==null?void 0:_.source},description:{story:"Custom rule not found page",...($=(Q=l.parameters)==null?void 0:Q.docs)==null?void 0:$.description}}};var E,J,K,Z,ee;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    code: '503',
    heading: 'Under Maintenance',
    message: 'The system is currently undergoing maintenance. Please check back later.',
    returnUrl: '/',
    returnLabel: 'Try Again',
    showAnimatedBackground: true
  }
}`,...(K=(J=c.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Maintenance mode page",...(ee=(Z=c.parameters)==null?void 0:Z.docs)==null?void 0:ee.description}}};var te,ae,re,oe,ne;m.parameters={...m.parameters,docs:{...(te=m.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Not Found',
    message: "This page doesn't exist.",
    returnUrl: '/',
    returnLabel: 'Go Back',
    logoSize: 100,
    showAnimatedBackground: false
  }
}`,...(re=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:re.source},description:{story:"Compact version with smaller elements",...(ne=(oe=m.parameters)==null?void 0:oe.docs)==null?void 0:ne.description}}};var se,ie,de,ue,le;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Page not found',
    message: "The page you're looking for doesn't exist or has been moved.",
    returnUrl: '/',
    returnLabel: 'Return to Home',
    showAnimatedBackground: true
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>]
}`,...(de=(ie=g.parameters)==null?void 0:ie.docs)==null?void 0:de.source},description:{story:"404 page in dark mode",...(le=(ue=g.parameters)==null?void 0:ue.docs)==null?void 0:le.description}}};var ce,me,ge,pe,he;p.parameters={...p.parameters,docs:{...(ce=p.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Page not found',
    message: "We couldn't find the page you're looking for. This might be because the URL is incorrect, the page has been moved, or it no longer exists. Please check the URL and try again, or use the navigation to find what you're looking for.",
    returnUrl: '/',
    returnLabel: 'Return to Home',
    showAnimatedBackground: true
  }
}`,...(ge=(me=p.parameters)==null?void 0:me.docs)==null?void 0:ge.source},description:{story:"Custom message with longer text",...(he=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:he.description}}};var ye,be,fe,xe,ke;h.parameters={...h.parameters,docs:{...(ye=h.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    code: '404',
    heading: 'Not Found',
    message: 'Page does not exist.',
    returnUrl: '/',
    returnLabel: 'Home',
    logoSize: 80,
    showAnimatedBackground: false
  }
}`,...(fe=(be=h.parameters)==null?void 0:be.docs)==null?void 0:fe.source},description:{story:"Simple 404 with minimal styling",...(ke=(xe=h.parameters)==null?void 0:xe.docs)==null?void 0:ke.description}}};const $e=["Default","WithoutAnimation","Forbidden","Gone","DatasetNotFound","RuleNotFound","Maintenance","Compact","DarkMode","LongMessage","Minimal"];export{m as Compact,g as DarkMode,u as DatasetNotFound,n as Default,i as Forbidden,d as Gone,p as LongMessage,c as Maintenance,h as Minimal,l as RuleNotFound,s as WithoutAnimation,$e as __namedExportsOrder,Qe as default};
