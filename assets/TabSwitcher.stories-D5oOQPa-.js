import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./TabSwitcher-y27q7UVb.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{a=n(),o=t(),r(),s={title:`Features/Tabs/TabSwitcher`,component:i,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{orientation:{control:`select`,options:[`horizontal`,`vertical`],description:`Orientation of the tab layout`},fullWidth:{control:`boolean`,description:`Whether tabs should take full width`}},decorators:[e=>(0,a.jsx)(`div`,{className:`w-[600px]`,children:(0,a.jsx)(e,{})})]},c={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Tab 1`,`Tab 2`,`Tab 3`],activeIndex:e,onSwitch:t})}},l={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Overview`,`Details`],activeIndex:e,onSwitch:t})}},u={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Dashboard`,`Analytics`,`Reports`,`Settings`,`Users`,`Data`],activeIndex:e,onSwitch:t})}},d={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Home`,`Profile`,`Settings`],activeIndex:e,onSwitch:t,orientation:`horizontal`})}},f={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Dashboard`,`Analytics`,`Reports`,`Settings`],activeIndex:e,onSwitch:t,orientation:`vertical`})}},p={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`First`,`Second`,`Third`],activeIndex:e,onSwitch:t,fullWidth:!0})}},m={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Home`,`About`,`Contact`],activeIndex:e,onSwitch:t,fullWidth:!1})}},h={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`Profile`,`Settings`,`Preferences`],activeIndex:e,onSwitch:t,orientation:`vertical`,fullWidth:!1})}},g={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsx)(i,{tabNames:[`Overview`,`Details`,`Statistics`],activeIndex:e,onSwitch:t}),(0,a.jsx)(`div`,{className:`p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900`,children:(0,a.jsx)(`p`,{className:`text-sm`,children:[`Overview content: This is the main overview of the resource.`,`Details content: Here are the detailed specifications and information.`,`Statistics content: View analytics and statistical data here.`][e]})})]})}},_={render:()=>{let[e,t]=(0,o.useState)(0),n=[`Recent Activity`,`Performance`,`Team Members`,`Projects`];return(0,a.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`h2`,{className:`text-2xl font-bold mb-4`,children:`Dashboard`}),(0,a.jsx)(i,{tabNames:n,activeIndex:e,onSwitch:t})]}),(0,a.jsxs)(`div`,{className:`border border-neutral-200 dark:border-neutral-800 rounded-lg p-6`,children:[(0,a.jsx)(`h3`,{className:`font-medium mb-2`,children:n[e]}),(0,a.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Content for `,n[e].toLowerCase()]})]})]})}},v={render:()=>{let[e,t]=(0,o.useState)(0),n=[`General`,`Security`,`Notifications`,`Privacy`];return(0,a.jsxs)(`div`,{className:`flex gap-4 h-64 w-full`,children:[(0,a.jsx)(`div`,{className:`w-48`,children:(0,a.jsx)(i,{tabNames:n,activeIndex:e,onSwitch:t,orientation:`vertical`})}),(0,a.jsxs)(`div`,{className:`flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6`,children:[(0,a.jsxs)(`h3`,{className:`font-medium text-lg mb-4`,children:[n[e],` Settings`]}),(0,a.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Configure your `,n[e].toLowerCase(),` preferences`]})]})]})}},y={render:()=>{let[e,t]=(0,o.useState)(0),n=[`Table`,`Grid`,`List`,`Chart`];return(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,a.jsx)(`h3`,{className:`font-medium`,children:`Data View`}),(0,a.jsx)(i,{tabNames:n,activeIndex:e,onSwitch:t,fullWidth:!1})]}),(0,a.jsx)(`div`,{className:`border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900`,children:(0,a.jsxs)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:[n[e],` View`]})})]})}},b={render:()=>{let[e,t]=(0,o.useState)(0),n=[`Posts`,`About`,`Photos`,`Videos`,`Friends`];return(0,a.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{className:`text-center space-y-4 pb-4 border-b border-neutral-200 dark:border-neutral-800`,children:[(0,a.jsx)(`div`,{className:`w-20 h-20 bg-brand-600 rounded-full mx-auto`}),(0,a.jsx)(`h2`,{className:`text-xl font-bold`,children:`John Doe`}),(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Software Engineer`})]}),(0,a.jsx)(i,{tabNames:n,activeIndex:e,onSwitch:t}),(0,a.jsx)(`div`,{className:`p-6`,children:(0,a.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[n[e],` content`]})})]})}},x={render:()=>{let[e,t]=(0,o.useState)(0),[n,r]=(0,o.useState)([0,0,0]);return(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsx)(i,{tabNames:[`Counter 1`,`Counter 2`,`Counter 3`],activeIndex:e,onSwitch:t}),(0,a.jsxs)(`div`,{className:`border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center`,children:[(0,a.jsx)(`p`,{className:`text-4xl font-bold mb-4`,children:n[e]}),(0,a.jsx)(`button`,{onClick:()=>{let t=[...n];t[e]++,r(t)},className:`px-4 py-2 bg-brand-600 text-neutral-100 rounded`,children:`Increment`})]})]})}},S={render:()=>{let[e,t]=(0,o.useState)(0);return(0,a.jsx)(i,{tabNames:[`User Management System`,`Data Analytics Dashboard`,`System Configuration`],activeIndex:e,onSwitch:t})}},C={render:()=>{let[e,t]=(0,o.useState)(0),n=Array.from({length:10},(e,t)=>`Tab ${t+1}`);return(0,a.jsx)(`div`,{className:`w-full overflow-x-auto`,children:(0,a.jsx)(i,{tabNames:n,activeIndex:e,onSwitch:t,fullWidth:!1})})}},w={render:()=>{let[e,t]=(0,o.useState)(0),[n,r]=(0,o.useState)(0);return(0,a.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-4`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Horizontal Tabs`}),(0,a.jsx)(i,{tabNames:[`Dashboard`,`Analytics`,`Settings`],activeIndex:e,onSwitch:t})]}),(0,a.jsxs)(`div`,{className:`space-y-4`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Vertical Tabs`}),(0,a.jsxs)(`div`,{className:`flex gap-4`,children:[(0,a.jsx)(i,{tabNames:[`Profile`,`Security`,`Notifications`],activeIndex:n,onSwitch:r,orientation:`vertical`,fullWidth:!1}),(0,a.jsx)(`div`,{className:`flex-1 border border-neutral-800 rounded-lg p-4`,children:(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Tab content area`})})]})]})]})},globals:{backgrounds:{value:`dark`}}},T={render:()=>{let[e,t]=(0,o.useState)(0),[n,r]=(0,o.useState)(0),[s,c]=(0,o.useState)(0),[l,u]=(0,o.useState)(0);return(0,a.jsxs)(`div`,{className:`space-y-8 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium`,children:`Horizontal + Full Width`}),(0,a.jsx)(i,{tabNames:[`One`,`Two`,`Three`],activeIndex:e,onSwitch:t,orientation:`horizontal`,fullWidth:!0})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium`,children:`Horizontal + Fit Content`}),(0,a.jsx)(i,{tabNames:[`One`,`Two`,`Three`],activeIndex:n,onSwitch:r,orientation:`horizontal`,fullWidth:!1})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium`,children:`Vertical + Full Width`}),(0,a.jsx)(i,{tabNames:[`One`,`Two`,`Three`],activeIndex:s,onSwitch:c,orientation:`vertical`,fullWidth:!0})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium`,children:`Vertical + Fit Content`}),(0,a.jsx)(i,{tabNames:[`One`,`Two`,`Three`],activeIndex:l,onSwitch:u,orientation:`vertical`,fullWidth:!1})]})]})}},E=[`Default`,`TwoTabs`,`ManyTabs`,`Horizontal`,`Vertical`,`FullWidth`,`FitContent`,`VerticalFitContent`,`WithContent`,`DashboardTabs`,`SettingsPanel`,`DataViewModes`,`ProfileSections`,`InteractiveCounter`,`LongTabNames`,`ScrollableTabs`,`DarkMode`,`AllCombinations`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Tab 1', 'Tab 2', 'Tab 3']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Overview', 'Details']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings', 'Users', 'Data']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Home', 'Profile', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="horizontal" />;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" />;
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['First', 'Second', 'Third']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={true} />;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Home', 'About', 'Contact']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['Profile', 'Settings', 'Preferences']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" fullWidth={false} />;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={['User Management System', 'Data Analytics Dashboard', 'System Configuration']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = Array.from({
      length: 10
    }, (_, i) => \`Tab \${i + 1}\`);
    return <div className="w-full overflow-x-auto">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />
            </div>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
      value: 'dark'
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}}})))()}D();export{T as AllCombinations,w as DarkMode,_ as DashboardTabs,y as DataViewModes,c as Default,m as FitContent,p as FullWidth,d as Horizontal,x as InteractiveCounter,S as LongTabNames,u as ManyTabs,b as ProfileSections,C as ScrollableTabs,v as SettingsPanel,l as TwoTabs,f as Vertical,h as VerticalFitContent,g as WithContent,E as __namedExportsOrder,s as default};