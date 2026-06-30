import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./LoadingPage-YEtwEpta.js";var i,a,o,s,c,l,u,d,f,p,m,h;e((()=>{i=t(),n(),a={title:`Pages/System/LoadingPage`,component:r,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{message:{control:`text`,description:`Loading message to display`},logoSize:{control:{type:`range`,min:50,max:300,step:10},description:`Size of the Rucio logo`},spinnerSize:{control:`select`,options:[`sm`,`default`,`md`,`lg`,`xl`],description:`Size of the loading spinner`},showOrbitAnimation:{control:`boolean`,description:`Whether to show animated orbit effects`}}},o={args:{message:`Loading Rucio WebUI...`,logoSize:146,spinnerSize:`xl`,showOrbitAnimation:!0}},s={args:{message:`Loading your data...`,logoSize:146,spinnerSize:`xl`,showOrbitAnimation:!0}},c={args:{message:`Loading Rucio WebUI...`,logoSize:146,spinnerSize:`xl`,showOrbitAnimation:!1}},l={args:{message:`Loading...`,logoSize:100,spinnerSize:`lg`,showOrbitAnimation:!0}},u={args:{message:`Loading Rucio WebUI...`,logoSize:200,spinnerSize:`xl`,showOrbitAnimation:!0}},d={args:{message:`Loading Rucio WebUI...`,logoSize:146,spinnerSize:`xl`,showOrbitAnimation:!0},decorators:[e=>(0,i.jsx)(`div`,{className:`dark`,children:(0,i.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},f={args:{message:`Loading dashboard...`,logoSize:146,spinnerSize:`xl`,showOrbitAnimation:!0}},p={args:{message:`Fetching datasets...`,logoSize:120,spinnerSize:`lg`,showOrbitAnimation:!0}},m={args:{message:`Loading...`,logoSize:80,spinnerSize:`md`,showOrbitAnimation:!1}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...o.parameters?.docs?.source},description:{story:`Default loading page with animated orbit effects`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading your data...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...s.parameters?.docs?.source},description:{story:`Loading page with custom message`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: false
  }
}`,...c.parameters?.docs?.source},description:{story:`Simple loading without orbit animations`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading...',
    logoSize: 100,
    spinnerSize: 'lg',
    showOrbitAnimation: true
  }
}`,...l.parameters?.docs?.source},description:{story:`Loading page with smaller logo and spinner`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 200,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Loading page with larger elements and full animations`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading Rucio WebUI...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...d.parameters?.docs?.source},description:{story:`Loading page in dark mode with full animations`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading dashboard...',
    logoSize: 146,
    spinnerSize: 'xl',
    showOrbitAnimation: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Loading page for specific features`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Fetching datasets...',
    logoSize: 120,
    spinnerSize: 'lg',
    showOrbitAnimation: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Loading page for data operations`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Loading...',
    logoSize: 80,
    spinnerSize: 'md',
    showOrbitAnimation: false
  }
}`,...m.parameters?.docs?.source},description:{story:`Minimal loading state without orbit effects`,...m.parameters?.docs?.description}}},h=[`Default`,`CustomMessage`,`WithoutOrbitAnimation`,`Compact`,`Large`,`DarkMode`,`FeatureLoading`,`DataLoading`,`Minimal`]}))();export{l as Compact,s as CustomMessage,d as DarkMode,p as DataLoading,o as Default,f as FeatureLoading,u as Large,m as Minimal,c as WithoutOrbitAnimation,h as __namedExportsOrder,a as default};