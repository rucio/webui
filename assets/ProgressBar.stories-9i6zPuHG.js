import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./ProgressBar-D_d3Iirm.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{a=n(),o=t(),r(),s={title:`Atoms/Misc/ProgressBar`,component:i,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{percentage:{control:{type:`range`,min:0,max:100,step:1},description:`Progress percentage (0-100)`},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Size of the progress bar`},variant:{control:`select`,options:[`default`,`success`,`error`,`warning`],description:`Color variant of the progress bar`},indeterminate:{control:`boolean`,description:`Show indeterminate loading state`},showLabel:{control:`boolean`,description:`Show percentage label`}},decorators:[e=>(0,a.jsx)(`div`,{className:`w-[400px]`,children:(0,a.jsx)(e,{})})]},c={args:{percentage:50}},l={args:{percentage:75,showLabel:!0}},u={args:{percentage:60,size:`sm`}},d={args:{percentage:60,size:`md`}},f={args:{percentage:60,size:`lg`}},p={render:()=>(0,a.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Small`}),(0,a.jsx)(i,{percentage:60,size:`sm`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Medium (default)`}),(0,a.jsx)(i,{percentage:60,size:`md`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Large`}),(0,a.jsx)(i,{percentage:60,size:`lg`})]})]})},m={args:{percentage:70,variant:`default`}},h={args:{percentage:100,variant:`success`}},g={args:{percentage:25,variant:`error`}},_={args:{percentage:50,variant:`warning`}},v={render:()=>(0,a.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Default`}),(0,a.jsx)(i,{percentage:70,variant:`default`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Success`}),(0,a.jsx)(i,{percentage:100,variant:`success`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Warning`}),(0,a.jsx)(i,{percentage:50,variant:`warning`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Error`}),(0,a.jsx)(i,{percentage:25,variant:`error`})]})]})},y={args:{indeterminate:!0}},b={render:()=>(0,a.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Default`}),(0,a.jsx)(i,{indeterminate:!0,variant:`default`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Success`}),(0,a.jsx)(i,{indeterminate:!0,variant:`success`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Warning`}),(0,a.jsx)(i,{indeterminate:!0,variant:`warning`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Error`}),(0,a.jsx)(i,{indeterminate:!0,variant:`error`})]})]})},x={render:()=>(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsx)(`div`,{className:`space-y-2`,children:(0,a.jsx)(i,{percentage:0,showLabel:!0})}),(0,a.jsx)(`div`,{className:`space-y-2`,children:(0,a.jsx)(i,{percentage:25,showLabel:!0})}),(0,a.jsx)(`div`,{className:`space-y-2`,children:(0,a.jsx)(i,{percentage:50,showLabel:!0})}),(0,a.jsx)(`div`,{className:`space-y-2`,children:(0,a.jsx)(i,{percentage:75,showLabel:!0})}),(0,a.jsx)(`div`,{className:`space-y-2`,children:(0,a.jsx)(i,{percentage:100,showLabel:!0})})]})},S={render:()=>{let[e,t]=(0,o.useState)(0);return(0,o.useEffect)(()=>{let e=setInterval(()=>{t(e=>e>=100?0:e+1)},50);return()=>clearInterval(e)},[]),(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsx)(i,{percentage:e,showLabel:!0}),(0,a.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400 text-center`,children:[`Auto-incrementing progress (`,e,`%)`]})]})}},C={render:()=>{let[e,t]=(0,o.useState)(0);return(0,o.useEffect)(()=>{let e=setInterval(()=>{t(e=>e>=100?100:e+2)},100);return()=>clearInterval(e)},[]),(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium mb-2`,children:`Uploading file.pdf`}),(0,a.jsx)(i,{percentage:e,variant:`default`,showLabel:!0})]}),e===100&&(0,a.jsx)(`p`,{className:`text-sm text-base-success-600 dark:text-base-success-500`,children:`Upload complete!`})]})}},w={render:()=>(0,a.jsx)(`div`,{className:`space-y-4 w-full`,children:(0,a.jsxs)(`div`,{children:[(0,a.jsxs)(`div`,{className:`flex justify-between items-center mb-2`,children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium`,children:`dataset-2024.csv`}),(0,a.jsx)(`span`,{className:`text-xs text-neutral-600 dark:text-neutral-400`,children:`45 MB / 100 MB`})]}),(0,a.jsx)(i,{percentage:45,variant:`default`})]})})},T={render:()=>{let e=[`Upload`,`Processing`,`Complete`],t=2/e.length*100;return(0,a.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,a.jsx)(`div`,{className:`flex justify-between text-sm`,children:e.map((e,t)=>(0,a.jsx)(`span`,{className:t<=1?`text-brand-600 font-medium`:`text-neutral-400`,children:e},e))}),(0,a.jsx)(i,{percentage:t,variant:`default`}),(0,a.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400 text-center`,children:[`Step `,2,` of `,e.length]})]})}},E={render:()=>(0,a.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Default`}),(0,a.jsx)(i,{percentage:70,variant:`default`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Success`}),(0,a.jsx)(i,{percentage:100,variant:`success`,showLabel:!0})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Warning`}),(0,a.jsx)(i,{percentage:50,variant:`warning`,showLabel:!0})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Error`}),(0,a.jsx)(i,{percentage:25,variant:`error`,showLabel:!0})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Indeterminate`}),(0,a.jsx)(i,{indeterminate:!0,variant:`default`})]})]}),globals:{backgrounds:{value:`dark`}}},D={render:()=>(0,a.jsx)(`div`,{className:`space-y-4 w-full`,children:(0,a.jsxs)(`div`,{children:[(0,a.jsxs)(`div`,{className:`flex justify-between items-center mb-2`,children:[(0,a.jsx)(`h3`,{className:`text-sm font-medium`,children:`Processing dataset`}),(0,a.jsx)(`span`,{className:`text-xs text-neutral-600 dark:text-neutral-400`,children:`1,234 / 5,000 records`})]}),(0,a.jsx)(i,{percentage:25,variant:`default`}),(0,a.jsx)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400 mt-1`,children:`Estimated time remaining: 5 minutes`})]})})},O={render:()=>(0,a.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsxs)(`div`,{className:`flex justify-between text-sm`,children:[(0,a.jsx)(`span`,{children:`CPU Usage`}),(0,a.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,children:`45%`})]}),(0,a.jsx)(i,{percentage:45,variant:`default`,size:`sm`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsxs)(`div`,{className:`flex justify-between text-sm`,children:[(0,a.jsx)(`span`,{children:`Memory Usage`}),(0,a.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,children:`78%`})]}),(0,a.jsx)(i,{percentage:78,variant:`warning`,size:`sm`})]}),(0,a.jsxs)(`div`,{className:`space-y-2`,children:[(0,a.jsxs)(`div`,{className:`flex justify-between text-sm`,children:[(0,a.jsx)(`span`,{children:`Disk Usage`}),(0,a.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,children:`92%`})]}),(0,a.jsx)(i,{percentage:92,variant:`error`,size:`sm`})]})]})},k=[`Default`,`WithLabel`,`Small`,`Medium`,`Large`,`AllSizes`,`DefaultVariant`,`Success`,`Error`,`Warning`,`AllVariants`,`Indeterminate`,`IndeterminateWithVariants`,`DifferentPercentages`,`Animated`,`FileUpload`,`Download`,`MultiStep`,`DarkMode`,`WithDescription`,`StackedProgress`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 50
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 75,
    showLabel: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 60,
    size: 'sm'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 60,
    size: 'md'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 60,
    size: 'lg'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Small</p>
                <ProgressBar percentage={60} size="sm" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium (default)</p>
                <ProgressBar percentage={60} size="md" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Large</p>
                <ProgressBar percentage={60} size="lg" />
            </div>
        </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 70,
    variant: 'default'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 100,
    variant: 'success'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 25,
    variant: 'error'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 50,
    variant: 'warning'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Default</p>
                <ProgressBar percentage={70} variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Success</p>
                <ProgressBar percentage={100} variant="success" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Warning</p>
                <ProgressBar percentage={50} variant="warning" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Error</p>
                <ProgressBar percentage={25} variant="error" />
            </div>
        </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    indeterminate: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Default</p>
                <ProgressBar indeterminate variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Success</p>
                <ProgressBar indeterminate variant="success" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Warning</p>
                <ProgressBar indeterminate variant="warning" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Error</p>
                <ProgressBar indeterminate variant="error" />
            </div>
        </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-full">
            <div className="space-y-2">
                <ProgressBar percentage={0} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={25} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={50} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={75} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={100} showLabel />
            </div>
        </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }, []);
    return <div className="space-y-4 w-full">
                <ProgressBar percentage={progress} showLabel />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">Auto-incrementing progress ({progress}%)</p>
            </div>;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }, []);
    return <div className="space-y-4 w-full">
                <div>
                    <h3 className="text-sm font-medium mb-2">Uploading file.pdf</h3>
                    <ProgressBar percentage={progress} variant="default" showLabel />
                </div>
                {progress === 100 && <p className="text-sm text-base-success-600 dark:text-base-success-500">Upload complete!</p>}
            </div>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">dataset-2024.csv</h3>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">45 MB / 100 MB</span>
                </div>
                <ProgressBar percentage={45} variant="default" />
            </div>
        </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const steps = ['Upload', 'Processing', 'Complete'];
    const currentStep = 1;
    const progressPercentage = (currentStep + 1) / steps.length * 100;
    return <div className="space-y-4 w-full">
                <div className="flex justify-between text-sm">
                    {steps.map((step, index) => <span key={step} className={index <= currentStep ? 'text-brand-600 font-medium' : 'text-neutral-400'}>
                            {step}
                        </span>)}
                </div>
                <ProgressBar percentage={progressPercentage} variant="default" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>;
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark p-8 rounded-lg bg-neutral-900 space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Default</p>
                <ProgressBar percentage={70} variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Success</p>
                <ProgressBar percentage={100} variant="success" showLabel />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Warning</p>
                <ProgressBar percentage={50} variant="warning" showLabel />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Error</p>
                <ProgressBar percentage={25} variant="error" showLabel />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Indeterminate</p>
                <ProgressBar indeterminate variant="default" />
            </div>
        </div>,
  globals: {
    backgrounds: {
      value: 'dark'
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Processing dataset</h3>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">1,234 / 5,000 records</span>
                </div>
                <ProgressBar percentage={25} variant="default" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Estimated time remaining: 5 minutes</p>
            </div>
        </div>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full">
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className="text-neutral-600 dark:text-neutral-400">45%</span>
                </div>
                <ProgressBar percentage={45} variant="default" size="sm" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="text-neutral-600 dark:text-neutral-400">78%</span>
                </div>
                <ProgressBar percentage={78} variant="warning" size="sm" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span className="text-neutral-600 dark:text-neutral-400">92%</span>
                </div>
                <ProgressBar percentage={92} variant="error" size="sm" />
            </div>
        </div>
}`,...O.parameters?.docs?.source}}}})))()}A();export{p as AllSizes,v as AllVariants,S as Animated,E as DarkMode,c as Default,m as DefaultVariant,x as DifferentPercentages,w as Download,g as Error,C as FileUpload,y as Indeterminate,b as IndeterminateWithVariants,f as Large,d as Medium,T as MultiStep,u as Small,O as StackedProgress,h as Success,_ as Warning,D as WithDescription,l as WithLabel,k as __namedExportsOrder,s as default};