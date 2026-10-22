import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./utils-DIvWIhxb.js";import{n as a,t as o}from"./dist-BZZowMi5.js";function s({className:e,percentage:t=0,size:n,variant:r,indeterminate:a=!1,showLabel:o=!1,...s}){let d=Math.min(Math.max(t,0),100);return(0,c.jsxs)(`div`,{className:`w-full space-y-1`,children:[(0,c.jsx)(`div`,{className:i(l({size:n}),e),role:`progressbar`,"aria-valuenow":a?void 0:d,"aria-valuemin":0,"aria-valuemax":100,"aria-label":a?`Loading`:`${d}% complete`,...s,children:(0,c.jsx)(`div`,{className:i(u({variant:r,indeterminate:a})),style:{width:a?`100%`:`${d}%`}})}),o&&!a&&(0,c.jsxs)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400 text-right`,children:[d,`%`]})]})}var c,l,u;function d(){return(d=e((()=>{c=n(),a(),r(),l=o(`rounded-full w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-900/10 dark:border-none overflow-hidden`,{variants:{size:{sm:`h-1.5`,md:`h-2.5`,lg:`h-4`}},defaultVariants:{size:`md`}}),u=o(`h-full rounded-full transition-all duration-300 ease-in-out`,{variants:{variant:{default:`bg-brand-600/80 dark:bg-brand-600/60`,success:`bg-base-success-600/80 dark:bg-base-success-600/60`,error:`bg-base-error-600/80 dark:bg-base-error-600/60`,warning:`bg-base-warning-600/80 dark:bg-base-warning-600/60`},indeterminate:{true:`animate-pulse`,false:``}},defaultVariants:{variant:`success`,indeterminate:!1}}),s.__docgenInfo={description:``,methods:[],displayName:`ProgressBar`,props:{percentage:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`0`,computed:!1}},variant:{required:!1,tsType:{name:`union`,raw:`'default' | 'success' | 'error' | 'warning'`,elements:[{name:`literal`,value:`'default'`},{name:`literal`,value:`'success'`},{name:`literal`,value:`'error'`},{name:`literal`,value:`'warning'`}]},description:``},indeterminate:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},showLabel:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}},composes:[`VariantProps`]}})))()}var f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{f=n(),p=t(),d(),m={title:`Atoms/Misc/ProgressBar`,component:s,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{percentage:{control:{type:`range`,min:0,max:100,step:1},description:`Progress percentage (0-100)`},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Size of the progress bar`},variant:{control:`select`,options:[`default`,`success`,`error`,`warning`],description:`Color variant of the progress bar`},indeterminate:{control:`boolean`,description:`Show indeterminate loading state`},showLabel:{control:`boolean`,description:`Show percentage label`}},decorators:[e=>(0,f.jsx)(`div`,{className:`w-[400px]`,children:(0,f.jsx)(e,{})})]},h={args:{percentage:50}},g={args:{percentage:75,showLabel:!0}},_={args:{percentage:60,size:`sm`}},v={args:{percentage:60,size:`md`}},y={args:{percentage:60,size:`lg`}},b={render:()=>(0,f.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Small`}),(0,f.jsx)(s,{percentage:60,size:`sm`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Medium (default)`}),(0,f.jsx)(s,{percentage:60,size:`md`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Large`}),(0,f.jsx)(s,{percentage:60,size:`lg`})]})]})},x={args:{percentage:70,variant:`default`}},S={args:{percentage:100,variant:`success`}},C={args:{percentage:25,variant:`error`}},w={args:{percentage:50,variant:`warning`}},T={render:()=>(0,f.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Default`}),(0,f.jsx)(s,{percentage:70,variant:`default`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Success`}),(0,f.jsx)(s,{percentage:100,variant:`success`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Warning`}),(0,f.jsx)(s,{percentage:50,variant:`warning`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Error`}),(0,f.jsx)(s,{percentage:25,variant:`error`})]})]})},E={args:{indeterminate:!0}},D={render:()=>(0,f.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Default`}),(0,f.jsx)(s,{indeterminate:!0,variant:`default`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Success`}),(0,f.jsx)(s,{indeterminate:!0,variant:`success`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Warning`}),(0,f.jsx)(s,{indeterminate:!0,variant:`warning`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Error`}),(0,f.jsx)(s,{indeterminate:!0,variant:`error`})]})]})},O={render:()=>(0,f.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,f.jsx)(`div`,{className:`space-y-2`,children:(0,f.jsx)(s,{percentage:0,showLabel:!0})}),(0,f.jsx)(`div`,{className:`space-y-2`,children:(0,f.jsx)(s,{percentage:25,showLabel:!0})}),(0,f.jsx)(`div`,{className:`space-y-2`,children:(0,f.jsx)(s,{percentage:50,showLabel:!0})}),(0,f.jsx)(`div`,{className:`space-y-2`,children:(0,f.jsx)(s,{percentage:75,showLabel:!0})}),(0,f.jsx)(`div`,{className:`space-y-2`,children:(0,f.jsx)(s,{percentage:100,showLabel:!0})})]})},k={render:()=>{let[e,t]=(0,p.useState)(0);return(0,p.useEffect)(()=>{let e=setInterval(()=>{t(e=>e>=100?0:e+1)},50);return()=>clearInterval(e)},[]),(0,f.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,f.jsx)(s,{percentage:e,showLabel:!0}),(0,f.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400 text-center`,children:[`Auto-incrementing progress (`,e,`%)`]})]})}},A={render:()=>{let[e,t]=(0,p.useState)(0);return(0,p.useEffect)(()=>{let e=setInterval(()=>{t(e=>e>=100?100:e+2)},100);return()=>clearInterval(e)},[]),(0,f.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`h3`,{className:`text-sm font-medium mb-2`,children:`Uploading file.pdf`}),(0,f.jsx)(s,{percentage:e,variant:`default`,showLabel:!0})]}),e===100&&(0,f.jsx)(`p`,{className:`text-sm text-base-success-600 dark:text-base-success-500`,children:`Upload complete!`})]})}},j={render:()=>(0,f.jsx)(`div`,{className:`space-y-4 w-full`,children:(0,f.jsxs)(`div`,{children:[(0,f.jsxs)(`div`,{className:`flex justify-between items-center mb-2`,children:[(0,f.jsx)(`h3`,{className:`text-sm font-medium`,children:`dataset-2024.csv`}),(0,f.jsx)(`span`,{className:`text-xs text-neutral-600 dark:text-neutral-400`,children:`45 MB / 100 MB`})]}),(0,f.jsx)(s,{percentage:45,variant:`default`})]})})},M={render:()=>{let e=[`Upload`,`Processing`,`Complete`],t=2/e.length*100;return(0,f.jsxs)(`div`,{className:`space-y-4 w-full`,children:[(0,f.jsx)(`div`,{className:`flex justify-between text-sm`,children:e.map((e,t)=>(0,f.jsx)(`span`,{className:t<=1?`text-brand-600 font-medium`:`text-neutral-400`,children:e},e))}),(0,f.jsx)(s,{percentage:t,variant:`default`}),(0,f.jsxs)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400 text-center`,children:[`Step `,2,` of `,e.length]})]})}},N={render:()=>(0,f.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 space-y-6 w-full`,children:[(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Default`}),(0,f.jsx)(s,{percentage:70,variant:`default`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Success`}),(0,f.jsx)(s,{percentage:100,variant:`success`,showLabel:!0})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Warning`}),(0,f.jsx)(s,{percentage:50,variant:`warning`,showLabel:!0})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Error`}),(0,f.jsx)(s,{percentage:25,variant:`error`,showLabel:!0})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Indeterminate`}),(0,f.jsx)(s,{indeterminate:!0,variant:`default`})]})]}),globals:{backgrounds:{value:`dark`}}},P={render:()=>(0,f.jsx)(`div`,{className:`space-y-4 w-full`,children:(0,f.jsxs)(`div`,{children:[(0,f.jsxs)(`div`,{className:`flex justify-between items-center mb-2`,children:[(0,f.jsx)(`h3`,{className:`text-sm font-medium`,children:`Processing dataset`}),(0,f.jsx)(`span`,{className:`text-xs text-neutral-600 dark:text-neutral-400`,children:`1,234 / 5,000 records`})]}),(0,f.jsx)(s,{percentage:25,variant:`default`}),(0,f.jsx)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400 mt-1`,children:`Estimated time remaining: 5 minutes`})]})})},F={render:()=>(0,f.jsxs)(`div`,{className:`space-y-6 w-full`,children:[(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsxs)(`div`,{className:`flex justify-between text-sm`,children:[(0,f.jsx)(`span`,{children:`CPU Usage`}),(0,f.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,children:`45%`})]}),(0,f.jsx)(s,{percentage:45,variant:`default`,size:`sm`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsxs)(`div`,{className:`flex justify-between text-sm`,children:[(0,f.jsx)(`span`,{children:`Memory Usage`}),(0,f.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,children:`78%`})]}),(0,f.jsx)(s,{percentage:78,variant:`warning`,size:`sm`})]}),(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsxs)(`div`,{className:`flex justify-between text-sm`,children:[(0,f.jsx)(`span`,{children:`Disk Usage`}),(0,f.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,children:`92%`})]}),(0,f.jsx)(s,{percentage:92,variant:`error`,size:`sm`})]})]})},I=[`Default`,`WithLabel`,`Small`,`Medium`,`Large`,`AllSizes`,`DefaultVariant`,`Success`,`Error`,`Warning`,`AllVariants`,`Indeterminate`,`IndeterminateWithVariants`,`DifferentPercentages`,`Animated`,`FileUpload`,`Download`,`MultiStep`,`DarkMode`,`WithDescription`,`StackedProgress`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 50
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 75,
    showLabel: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 60,
    size: 'sm'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 60,
    size: 'md'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 60,
    size: 'lg'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 70,
    variant: 'default'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 100,
    variant: 'success'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 25,
    variant: 'error'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    percentage: 50,
    variant: 'warning'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    indeterminate: true
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">dataset-2024.csv</h3>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">45 MB / 100 MB</span>
                </div>
                <ProgressBar percentage={45} variant="default" />
            </div>
        </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}}})))()}L();export{b as AllSizes,T as AllVariants,k as Animated,N as DarkMode,h as Default,x as DefaultVariant,O as DifferentPercentages,j as Download,C as Error,A as FileUpload,E as Indeterminate,D as IndeterminateWithVariants,y as Large,v as Medium,M as MultiStep,_ as Small,F as StackedProgress,S as Success,w as Warning,P as WithDescription,g as WithLabel,I as __namedExportsOrder,m as default};