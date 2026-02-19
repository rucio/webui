import{r,j as e}from"./iframe-CbZ9RuD1.js";import{c as He}from"./index-DSpI4bVK.js";import{c as z}from"./utils-DsKtx5Xo.js";import{K as Le}from"./KeyValueWrapper-p5ZbVku4.js";import"./preload-helper-Dp1pzeXC.js";import"./tw-merge-Ds6tgvmq.js";const Re=He("relative flex w-full",{variants:{orientation:{horizontal:"flex-row border-b border-neutral-200 dark:border-neutral-700",vertical:"flex-col gap-y-2"},fullWidth:{true:"",false:"w-fit"}},defaultVariants:{orientation:"horizontal",fullWidth:!0}}),Ee=He("relative cursor-pointer flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0 dark:focus-visible:ring-offset-neutral-900 motion-reduce:transition-none",{variants:{active:{true:"text-brand-600 dark:text-brand-400",false:"text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"},fullWidth:{true:"flex-1",false:""}},defaultVariants:{active:!1,fullWidth:!0}}),n=({tabNames:t,onSwitch:a,activeIndex:s,orientation:i="horizontal",fullWidth:o=!0,className:d})=>{const[u,W]=r.useState(!1),[Fe,Oe]=r.useState({left:0,width:0,opacity:0}),V=r.useRef([]),Me=(c,l)=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),a(l))};return r.useEffect(()=>{W(!0)},[]),r.useEffect(()=>{if(!u)return;const c=V.current[s];c&&i==="horizontal"&&Oe({left:c.offsetLeft,width:c.offsetWidth,opacity:1})},[s,i,t,u]),e.jsxs(Le,{className:z(Re({orientation:i,fullWidth:o}),d),children:[t.map((c,l)=>{const P=l===s;return e.jsx("div",{ref:D=>{V.current[l]=D},onClick:()=>a(l),onKeyDown:D=>Me(D,l),className:z(Ee({active:P,fullWidth:o})),role:"tab","aria-selected":P,tabIndex:0,children:c},c)}),i==="horizontal"&&e.jsx("div",{className:"absolute bottom-0 h-0.5 bg-brand-600 dark:bg-brand-400 transition-all duration-200 ease-in-out motion-reduce:transition-none",style:Fe})]})};n.__docgenInfo={description:"",methods:[],displayName:"TabSwitcher",props:{tabNames:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},onSwitch:{required:!0,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},activeIndex:{required:!0,tsType:{name:"number"},description:""},className:{required:!1,tsType:{name:"string"},description:""},orientation:{defaultValue:{value:"'horizontal'",computed:!1},required:!1},fullWidth:{defaultValue:{value:"true",computed:!1},required:!1}},composes:["VariantProps"]};const $e={title:"Features/Tabs/TabSwitcher",component:n,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{orientation:{control:"select",options:["horizontal","vertical"],description:"Orientation of the tab layout"},fullWidth:{control:"boolean",description:"Whether tabs should take full width"}},decorators:[t=>e.jsx("div",{className:"w-[600px]",children:e.jsx(t,{})})]},m={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Tab 1","Tab 2","Tab 3"],activeIndex:t,onSwitch:a})}},x={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Overview","Details"],activeIndex:t,onSwitch:a})}},v={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Dashboard","Analytics","Reports","Settings","Users","Data"],activeIndex:t,onSwitch:a})}},h={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Home","Profile","Settings"],activeIndex:t,onSwitch:a,orientation:"horizontal"})}},b={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Dashboard","Analytics","Reports","Settings"],activeIndex:t,onSwitch:a,orientation:"vertical"})}},p={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["First","Second","Third"],activeIndex:t,onSwitch:a,fullWidth:!0})}},f={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Home","About","Contact"],activeIndex:t,onSwitch:a,fullWidth:!1})}},S={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["Profile","Settings","Preferences"],activeIndex:t,onSwitch:a,orientation:"vertical",fullWidth:!1})}},I={render:()=>{const[t,a]=r.useState(0),s=["Overview","Details","Statistics"],i=["Overview content: This is the main overview of the resource.","Details content: Here are the detailed specifications and information.","Statistics content: View analytics and statistical data here."];return e.jsxs("div",{className:"space-y-4 w-full",children:[e.jsx(n,{tabNames:s,activeIndex:t,onSwitch:a}),e.jsx("div",{className:"p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900",children:e.jsx("p",{className:"text-sm",children:i[t]})})]})}},N={render:()=>{const[t,a]=r.useState(0),s=["Recent Activity","Performance","Team Members","Projects"];return e.jsxs("div",{className:"space-y-6 w-full",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Dashboard"}),e.jsx(n,{tabNames:s,activeIndex:t,onSwitch:a})]}),e.jsxs("div",{className:"border border-neutral-200 dark:border-neutral-800 rounded-lg p-6",children:[e.jsx("h3",{className:"font-medium mb-2",children:s[t]}),e.jsxs("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:["Content for ",s[t].toLowerCase()]})]})]})}},w={render:()=>{const[t,a]=r.useState(0),s=["General","Security","Notifications","Privacy"];return e.jsxs("div",{className:"flex gap-4 h-64 w-full",children:[e.jsx("div",{className:"w-48",children:e.jsx(n,{tabNames:s,activeIndex:t,onSwitch:a,orientation:"vertical"})}),e.jsxs("div",{className:"flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6",children:[e.jsxs("h3",{className:"font-medium text-lg mb-4",children:[s[t]," Settings"]}),e.jsxs("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:["Configure your ",s[t].toLowerCase()," preferences"]})]})]})}},g={render:()=>{const[t,a]=r.useState(0),s=["Table","Grid","List","Chart"];return e.jsxs("div",{className:"space-y-4 w-full",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"font-medium",children:"Data View"}),e.jsx(n,{tabNames:s,activeIndex:t,onSwitch:a,fullWidth:!1})]}),e.jsx("div",{className:"border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900",children:e.jsxs("p",{className:"text-neutral-600 dark:text-neutral-400",children:[s[t]," View"]})})]})}},y={render:()=>{const[t,a]=r.useState(0),s=["Posts","About","Photos","Videos","Friends"];return e.jsxs("div",{className:"space-y-6 w-full",children:[e.jsxs("div",{className:"text-center space-y-4 pb-4 border-b border-neutral-200 dark:border-neutral-800",children:[e.jsx("div",{className:"w-20 h-20 bg-brand-600 rounded-full mx-auto"}),e.jsx("h2",{className:"text-xl font-bold",children:"John Doe"}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Software Engineer"})]}),e.jsx(n,{tabNames:s,activeIndex:t,onSwitch:a}),e.jsx("div",{className:"p-6",children:e.jsxs("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:[s[t]," content"]})})]})}},j={render:()=>{const[t,a]=r.useState(0),[s,i]=r.useState([0,0,0]),o=["Counter 1","Counter 2","Counter 3"];return e.jsxs("div",{className:"space-y-4 w-full",children:[e.jsx(n,{tabNames:o,activeIndex:t,onSwitch:a}),e.jsxs("div",{className:"border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center",children:[e.jsx("p",{className:"text-4xl font-bold mb-4",children:s[t]}),e.jsx("button",{onClick:()=>{const d=[...s];d[t]++,i(d)},className:"px-4 py-2 bg-brand-600 text-neutral-100 rounded",children:"Increment"})]})]})}},T={render:()=>{const[t,a]=r.useState(0);return e.jsx(n,{tabNames:["User Management System","Data Analytics Dashboard","System Configuration"],activeIndex:t,onSwitch:a})}},A={render:()=>{const[t,a]=r.useState(0),s=Array.from({length:10},(i,o)=>`Tab ${o+1}`);return e.jsx("div",{className:"w-full overflow-x-auto",children:e.jsx(n,{tabNames:s,activeIndex:t,onSwitch:a,fullWidth:!1})})}},k={parameters:{backgrounds:{default:"dark"}},render:()=>{const[t,a]=r.useState(0),[s,i]=r.useState(0);return e.jsxs("div",{className:"dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-neutral-400",children:"Horizontal Tabs"}),e.jsx(n,{tabNames:["Dashboard","Analytics","Settings"],activeIndex:t,onSwitch:a})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-neutral-400",children:"Vertical Tabs"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(n,{tabNames:["Profile","Security","Notifications"],activeIndex:s,onSwitch:i,orientation:"vertical",fullWidth:!1}),e.jsx("div",{className:"flex-1 border border-neutral-800 rounded-lg p-4",children:e.jsx("p",{className:"text-sm text-neutral-400",children:"Tab content area"})})]})]})]})}},C={render:()=>{const[t,a]=r.useState(0),[s,i]=r.useState(0),[o,d]=r.useState(0),[u,W]=r.useState(0);return e.jsxs("div",{className:"space-y-8 w-full",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium",children:"Horizontal + Full Width"}),e.jsx(n,{tabNames:["One","Two","Three"],activeIndex:t,onSwitch:a,orientation:"horizontal",fullWidth:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium",children:"Horizontal + Fit Content"}),e.jsx(n,{tabNames:["One","Two","Three"],activeIndex:s,onSwitch:i,orientation:"horizontal",fullWidth:!1})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium",children:"Vertical + Full Width"}),e.jsx(n,{tabNames:["One","Two","Three"],activeIndex:o,onSwitch:d,orientation:"vertical",fullWidth:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-medium",children:"Vertical + Fit Content"}),e.jsx(n,{tabNames:["One","Two","Three"],activeIndex:u,onSwitch:W,orientation:"vertical",fullWidth:!1})]})]})}};var H,F,O;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Tab 1', 'Tab 2', 'Tab 3']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...(O=(F=m.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var M,L,R;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Overview', 'Details']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...(R=(L=x.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var E,q,_;v.parameters={...v.parameters,docs:{...(E=v.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings', 'Users', 'Data']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...(_=(q=v.parameters)==null?void 0:q.docs)==null?void 0:_.source}}};var G,K,U;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Home', 'Profile', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="horizontal" />;
  }
}`,...(U=(K=h.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var J,$,B;b.parameters={...b.parameters,docs:{...(J=b.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" />;
  }
}`,...(B=($=b.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var Q,X,Y;p.parameters={...p.parameters,docs:{...(Q=p.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['First', 'Second', 'Third']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={true} />;
  }
}`,...(Y=(X=p.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,te;f.parameters={...f.parameters,docs:{...(Z=f.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Home', 'About', 'Contact']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />;
  }
}`,...(te=(ee=f.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ae,se,re;S.parameters={...S.parameters,docs:{...(ae=S.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Profile', 'Settings', 'Preferences']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" fullWidth={false} />;
  }
}`,...(re=(se=S.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var ne,ie,ce;I.parameters={...I.parameters,docs:{...(ne=I.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = ['Overview', 'Details', 'Statistics'];
    const content = ['Overview content: This is the main overview of the resource.', 'Details content: Here are the detailed specifications and information.', 'Statistics content: View analytics and statistical data here.'];
    return <div className="space-y-4 w-full">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <p className="text-sm">{content[activeIndex]}</p>
                </div>
            </div>;
  }
}`,...(ce=(ie=I.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var oe,de,le;N.parameters={...N.parameters,docs:{...(oe=N.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = ['Recent Activity', 'Performance', 'Team Members', 'Projects'];
    return <div className="space-y-6 w-full">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                    <h3 className="font-medium mb-2">{tabs[activeIndex]}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content for {tabs[activeIndex].toLowerCase()}</p>
                </div>
            </div>;
  }
}`,...(le=(de=N.parameters)==null?void 0:de.docs)==null?void 0:le.source}}};var ue,me,xe;w.parameters={...w.parameters,docs:{...(ue=w.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = ['General', 'Security', 'Notifications', 'Privacy'];
    return <div className="flex gap-4 h-64 w-full">
                <div className="w-48">
                    <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" />
                </div>
                <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                    <h3 className="font-medium text-lg mb-4">{tabs[activeIndex]} Settings</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Configure your {tabs[activeIndex].toLowerCase()} preferences</p>
                </div>
            </div>;
  }
}`,...(xe=(me=w.parameters)==null?void 0:me.docs)==null?void 0:xe.source}}};var ve,he,be;g.parameters={...g.parameters,docs:{...(ve=g.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const modes = ['Table', 'Grid', 'List', 'Chart'];
    return <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Data View</h3>
                    <TabSwitcher tabNames={modes} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                    <p className="text-neutral-600 dark:text-neutral-400">{modes[activeIndex]} View</p>
                </div>
            </div>;
  }
}`,...(be=(he=g.parameters)==null?void 0:he.docs)==null?void 0:be.source}}};var pe,fe,Se;y.parameters={...y.parameters,docs:{...(pe=y.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const sections = ['Posts', 'About', 'Photos', 'Videos', 'Friends'];
    return <div className="space-y-6 w-full">
                <div className="text-center space-y-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="w-20 h-20 bg-brand-600 rounded-full mx-auto" />
                    <h2 className="text-xl font-bold">John Doe</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Software Engineer</p>
                </div>
                <TabSwitcher tabNames={sections} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                <div className="p-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{sections[activeIndex]} content</p>
                </div>
            </div>;
  }
}`,...(Se=(fe=y.parameters)==null?void 0:fe.docs)==null?void 0:Se.source}}};var Ie,Ne,we;j.parameters={...j.parameters,docs:{...(Ie=j.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [counts, setCounts] = useState([0, 0, 0]);
    const tabs = ['Counter 1', 'Counter 2', 'Counter 3'];
    return <div className="space-y-4 w-full">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center">
                    <p className="text-4xl font-bold mb-4">{counts[activeIndex]}</p>
                    <button onClick={() => {
          const newCounts = [...counts];
          newCounts[activeIndex]++;
          setCounts(newCounts);
        }} className="px-4 py-2 bg-brand-600 text-neutral-100 rounded">
                        Increment
                    </button>
                </div>
            </div>;
  }
}`,...(we=(Ne=j.parameters)==null?void 0:Ne.docs)==null?void 0:we.source}}};var ge,ye,je;T.parameters={...T.parameters,docs:{...(ge=T.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['User Management System', 'Data Analytics Dashboard', 'System Configuration']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...(je=(ye=T.parameters)==null?void 0:ye.docs)==null?void 0:je.source}}};var Te,Ae,ke;A.parameters={...A.parameters,docs:{...(Te=A.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = Array.from({
      length: 10
    }, (_, i) => \`Tab \${i + 1}\`);
    return <div className="w-full overflow-x-auto">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />
            </div>;
  }
}`,...(ke=(Ae=A.parameters)==null?void 0:Ae.docs)==null?void 0:ke.source}}};var Ce,We,De;k.parameters={...k.parameters,docs:{...(Ce=k.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: () => {
    const [activeIndex1, setActiveIndex1] = useState(0);
    const [activeIndex2, setActiveIndex2] = useState(0);
    return <div className="dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full">
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Horizontal Tabs</p>
                    <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Settings']} activeIndex={activeIndex1} onSwitch={setActiveIndex1} />
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Vertical Tabs</p>
                    <div className="flex gap-4">
                        <TabSwitcher tabNames={['Profile', 'Security', 'Notifications']} activeIndex={activeIndex2} onSwitch={setActiveIndex2} orientation="vertical" fullWidth={false} />
                        <div className="flex-1 border border-neutral-800 rounded-lg p-4">
                            <p className="text-sm text-neutral-400">Tab content area</p>
                        </div>
                    </div>
                </div>
            </div>;
  }
}`,...(De=(We=k.parameters)==null?void 0:We.docs)==null?void 0:De.source}}};var Ve,Pe,ze;C.parameters={...C.parameters,docs:{...(Ve=C.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => {
    const [h1, setH1] = useState(0);
    const [h2, setH2] = useState(0);
    const [v1, setV1] = useState(0);
    const [v2, setV2] = useState(0);
    return <div className="space-y-8 w-full">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Horizontal + Full Width</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={h1} onSwitch={setH1} orientation="horizontal" fullWidth={true} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Horizontal + Fit Content</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={h2} onSwitch={setH2} orientation="horizontal" fullWidth={false} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Vertical + Full Width</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={v1} onSwitch={setV1} orientation="vertical" fullWidth={true} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Vertical + Fit Content</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={v2} onSwitch={setV2} orientation="vertical" fullWidth={false} />
                </div>
            </div>;
  }
}`,...(ze=(Pe=C.parameters)==null?void 0:Pe.docs)==null?void 0:ze.source}}};const Be=["Default","TwoTabs","ManyTabs","Horizontal","Vertical","FullWidth","FitContent","VerticalFitContent","WithContent","DashboardTabs","SettingsPanel","DataViewModes","ProfileSections","InteractiveCounter","LongTabNames","ScrollableTabs","DarkMode","AllCombinations"];export{C as AllCombinations,k as DarkMode,N as DashboardTabs,g as DataViewModes,m as Default,f as FitContent,p as FullWidth,h as Horizontal,j as InteractiveCounter,T as LongTabNames,v as ManyTabs,y as ProfileSections,A as ScrollableTabs,w as SettingsPanel,x as TwoTabs,b as Vertical,S as VerticalFitContent,I as WithContent,Be as __namedExportsOrder,$e as default};
