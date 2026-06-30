import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Kt as n,bt as r}from"./iframe-C47sd5GD.js";import{n as i,t as a}from"./utils-BlOR3gwo.js";import{n as o,t as s}from"./dist-Bwk7AIxR.js";import{n as c,t as l}from"./KeyValueWrapper-Dx1NLU6Z.js";var u,d,f,p,m,h=e((()=>{u=r(),d=t(n()),o(),i(),c(),f=s(`relative flex w-full`,{variants:{orientation:{horizontal:`flex-row border-b border-neutral-200 dark:border-neutral-700`,vertical:`flex-col gap-y-2`},fullWidth:{true:``,false:`w-fit`}},defaultVariants:{orientation:`horizontal`,fullWidth:!0}}),p=s(`relative cursor-pointer flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0 dark:focus-visible:ring-offset-neutral-900 motion-reduce:transition-none`,{variants:{active:{true:`text-brand-600 dark:text-brand-400`,false:`text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100`},fullWidth:{true:`flex-1`,false:``}},defaultVariants:{active:!1,fullWidth:!0}}),m=({tabNames:e,onSwitch:t,activeIndex:n,orientation:r=`horizontal`,fullWidth:i=!0,className:o})=>{let[s,c]=d.useState(!1),[m,h]=d.useState({left:0,width:0,opacity:0}),g=d.useRef([]),_=(e,n)=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),t(n))};return d.useEffect(()=>{c(!0)},[]),d.useEffect(()=>{if(!s)return;let e=g.current[n];e&&r===`horizontal`&&h({left:e.offsetLeft,width:e.offsetWidth,opacity:1})},[n,r,e,s]),(0,u.jsxs)(l,{className:a(f({orientation:r,fullWidth:i}),o),children:[e.map((e,r)=>{let o=r===n;return(0,u.jsx)(`div`,{ref:e=>{g.current[r]=e},onClick:()=>t(r),onKeyDown:e=>_(e,r),className:a(p({active:o,fullWidth:i})),role:`tab`,"aria-selected":o,tabIndex:0,children:e},e)}),r===`horizontal`&&(0,u.jsx)(`div`,{className:`absolute bottom-0 h-0.5 bg-brand-600 dark:bg-brand-400 transition-all duration-200 ease-in-out motion-reduce:transition-none`,style:m})]})},m.__docgenInfo={description:``,methods:[],displayName:`TabSwitcher`,props:{tabNames:{required:!0,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``},onSwitch:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(index: number) => void`,signature:{arguments:[{type:{name:`number`},name:`index`}],return:{name:`void`}}},description:``},activeIndex:{required:!0,tsType:{name:`number`},description:``},className:{required:!1,tsType:{name:`string`},description:``},orientation:{defaultValue:{value:`'horizontal'`,computed:!1},required:!1},fullWidth:{defaultValue:{value:`true`,computed:!1},required:!1}},composes:[`VariantProps`]}})),g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;e((()=>{g=r(),_=t(n()),h(),v={title:`Features/Tabs/TabSwitcher`,component:m,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{orientation:{control:`select`,options:[`horizontal`,`vertical`],description:`Orientation of the tab layout`},fullWidth:{control:`boolean`,description:`Whether tabs should take full width`}},decorators:[e=>(0,g.jsx)(`div`,{className:`w-[600px]`,children:(0,g.jsx)(e,{})})]},y={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Tab 1`,`Tab 2`,`Tab 3`],activeIndex:e,onSwitch:t})}},b={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Overview`,`Details`],activeIndex:e,onSwitch:t})}},x={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Dashboard`,`Analytics`,`Reports`,`Settings`,`Users`,`Data`],activeIndex:e,onSwitch:t})}},S={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Home`,`Profile`,`Settings`],activeIndex:e,onSwitch:t,orientation:`horizontal`})}},C={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Dashboard`,`Analytics`,`Reports`,`Settings`],activeIndex:e,onSwitch:t,orientation:`vertical`})}},w={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`First`,`Second`,`Third`],activeIndex:e,onSwitch:t,fullWidth:!0})}},T={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Home`,`About`,`Contact`],activeIndex:e,onSwitch:t,fullWidth:!1})}},E={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`Profile`,`Settings`,`Preferences`],activeIndex:e,onSwitch:t,orientation:`vertical`,fullWidth:!1})}},D={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,g.jsx)(m,{tabNames:[`Overview`,`Details`,`Statistics`],activeIndex:e,onSwitch:t}),(0,g.jsx)(`div`,{className:`p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900`,children:(0,g.jsx)(`p`,{className:`text-sm`,children:[`Overview content: This is the main overview of the resource.`,`Details content: Here are the detailed specifications and information.`,`Statistics content: View analytics and statistical data here.`][e]})})]})}},O={render:()=>{let[e,t]=(0,_.useState)(0),n=[`Recent Activity`,`Performance`,`Team Members`,`Projects`];return(0,g.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Dashboard`}),(0,g.jsx)(m,{tabNames:n,activeIndex:e,onSwitch:t})]}),(0,g.jsxs)(`div`,{className:`border border-neutral-200 dark:border-neutral-800 rounded-lg p-6`,children:[(0,g.jsx)(`h3`,{className:`font-medium mb-2`,children:n[e]}),(0,g.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Content for `,n[e].toLowerCase()]})]})]})}},k={render:()=>{let[e,t]=(0,_.useState)(0),n=[`General`,`Security`,`Notifications`,`Privacy`];return(0,g.jsxs)(`div`,{className:`flex gap-4 h-64 w-full`,children:[(0,g.jsx)(`div`,{className:`w-48`,children:(0,g.jsx)(m,{tabNames:n,activeIndex:e,onSwitch:t,orientation:`vertical`})}),(0,g.jsxs)(`div`,{className:`flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6`,children:[(0,g.jsxs)(`h3`,{className:`font-medium text-lg mb-4`,children:[n[e],` Settings`]}),(0,g.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Configure your `,n[e].toLowerCase(),` preferences`]})]})]})}},A={render:()=>{let[e,t]=(0,_.useState)(0),n=[`Table`,`Grid`,`List`,`Chart`];return(0,g.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,g.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,g.jsx)(`h3`,{className:`font-medium`,children:`Data View`}),(0,g.jsx)(m,{tabNames:n,activeIndex:e,onSwitch:t,fullWidth:!1})]}),(0,g.jsx)(`div`,{className:`border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900`,children:(0,g.jsxs)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:[n[e],` View`]})})]})}},j={render:()=>{let[e,t]=(0,_.useState)(0),n=[`Posts`,`About`,`Photos`,`Videos`,`Friends`];return(0,g.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,g.jsxs)(`div`,{className:`text-center space-y-4 pb-4 border-b border-neutral-200 dark:border-neutral-800`,children:[(0,g.jsx)(`div`,{className:`w-20 h-20 bg-brand-600 rounded-full mx-auto`}),(0,g.jsx)(`h2`,{className:`text-xl font-bold`,children:`John Doe`}),(0,g.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Software Engineer`})]}),(0,g.jsx)(m,{tabNames:n,activeIndex:e,onSwitch:t}),(0,g.jsx)(`div`,{className:`p-6`,children:(0,g.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[n[e],` content`]})})]})}},M={render:()=>{let[e,t]=(0,_.useState)(0),[n,r]=(0,_.useState)([0,0,0]);return(0,g.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,g.jsx)(m,{tabNames:[`Counter 1`,`Counter 2`,`Counter 3`],activeIndex:e,onSwitch:t}),(0,g.jsxs)(`div`,{className:`border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center`,children:[(0,g.jsx)(`p`,{className:`text-4xl font-bold mb-4`,children:n[e]}),(0,g.jsx)(`button`,{onClick:()=>{let t=[...n];t[e]++,r(t)},className:`px-4 py-2 bg-brand-600 text-neutral-100 rounded`,children:`Increment`})]})]})}},N={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(m,{tabNames:[`User Management System`,`Data Analytics Dashboard`,`System Configuration`],activeIndex:e,onSwitch:t})}},P={render:()=>{let[e,t]=(0,_.useState)(0);return(0,g.jsx)(`div`,{className:`w-full overflow-x-auto`,children:(0,g.jsx)(m,{tabNames:Array.from({length:10},(e,t)=>`Tab ${t+1}`),activeIndex:e,onSwitch:t,fullWidth:!1})})}},F={render:()=>{let[e,t]=(0,_.useState)(0),[n,r]=(0,_.useState)(0);return(0,g.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full`,children:[(0,g.jsxs)(`div`,{className:`space-y-4`,children:[(0,g.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Horizontal Tabs`}),(0,g.jsx)(m,{tabNames:[`Dashboard`,`Analytics`,`Settings`],activeIndex:e,onSwitch:t})]}),(0,g.jsxs)(`div`,{className:`space-y-4`,children:[(0,g.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Vertical Tabs`}),(0,g.jsxs)(`div`,{className:`flex gap-4`,children:[(0,g.jsx)(m,{tabNames:[`Profile`,`Security`,`Notifications`],activeIndex:n,onSwitch:r,orientation:`vertical`,fullWidth:!1}),(0,g.jsx)(`div`,{className:`flex-1 border border-neutral-800 rounded-lg p-4`,children:(0,g.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Tab content area`})})]})]})]})},globals:{backgrounds:{value:`dark`}}},I={render:()=>{let[e,t]=(0,_.useState)(0),[n,r]=(0,_.useState)(0),[i,a]=(0,_.useState)(0),[o,s]=(0,_.useState)(0);return(0,g.jsxs)(`div`,{className:`space-y-8 w-full`,children:[(0,g.jsxs)(`div`,{className:`space-y-2`,children:[(0,g.jsx)(`h3`,{className:`text-sm font-medium`,children:`Horizontal + Full Width`}),(0,g.jsx)(m,{tabNames:[`One`,`Two`,`Three`],activeIndex:e,onSwitch:t,orientation:`horizontal`,fullWidth:!0})]}),(0,g.jsxs)(`div`,{className:`space-y-2`,children:[(0,g.jsx)(`h3`,{className:`text-sm font-medium`,children:`Horizontal + Fit Content`}),(0,g.jsx)(m,{tabNames:[`One`,`Two`,`Three`],activeIndex:n,onSwitch:r,orientation:`horizontal`,fullWidth:!1})]}),(0,g.jsxs)(`div`,{className:`space-y-2`,children:[(0,g.jsx)(`h3`,{className:`text-sm font-medium`,children:`Vertical + Full Width`}),(0,g.jsx)(m,{tabNames:[`One`,`Two`,`Three`],activeIndex:i,onSwitch:a,orientation:`vertical`,fullWidth:!0})]}),(0,g.jsxs)(`div`,{className:`space-y-2`,children:[(0,g.jsx)(`h3`,{className:`text-sm font-medium`,children:`Vertical + Fit Content`}),(0,g.jsx)(m,{tabNames:[`One`,`Two`,`Three`],activeIndex:o,onSwitch:s,orientation:`vertical`,fullWidth:!1})]})]})}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Tab 1', 'Tab 2', 'Tab 3']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Overview', 'Details']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings', 'Users', 'Data']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Home', 'Profile', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="horizontal" />;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" />;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['First', 'Second', 'Third']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={true} />;
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Home', 'About', 'Contact']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />;
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Profile', 'Settings', 'Preferences']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" fullWidth={false} />;
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['User Management System', 'Data Analytics Dashboard', 'System Configuration']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = Array.from({
      length: 10
    }, (_, i) => \`Tab \${i + 1}\`);
    return <div className="w-full overflow-x-auto">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />
            </div>;
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
  },
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L=[`Default`,`TwoTabs`,`ManyTabs`,`Horizontal`,`Vertical`,`FullWidth`,`FitContent`,`VerticalFitContent`,`WithContent`,`DashboardTabs`,`SettingsPanel`,`DataViewModes`,`ProfileSections`,`InteractiveCounter`,`LongTabNames`,`ScrollableTabs`,`DarkMode`,`AllCombinations`]}))();export{I as AllCombinations,F as DarkMode,O as DashboardTabs,A as DataViewModes,y as Default,T as FitContent,w as FullWidth,S as Horizontal,M as InteractiveCounter,N as LongTabNames,x as ManyTabs,j as ProfileSections,P as ScrollableTabs,k as SettingsPanel,b as TwoTabs,C as Vertical,E as VerticalFitContent,D as WithContent,L as __namedExportsOrder,v as default};