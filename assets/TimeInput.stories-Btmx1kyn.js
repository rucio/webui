import{j as t,r as g}from"./iframe-CbZ9RuD1.js";import{T as m}from"./TimeInput-CUCbVHI4.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-CDVKQKGR.js";import"./iconBase-BDSQWw1B.js";const z={title:"Components/Legacy/Input/TimeInput",component:m,parameters:{layout:"centered",docs:{description:{component:"A time input component that follows the Rucio WebUI design system. Supports both 12-hour and 24-hour formats with optional seconds."}}},tags:["autodocs"],argTypes:{onchange:{action:"time changed"},initialtime:{control:"text",description:"Initial time value in HH:MM:SS format"},disabled:{control:"boolean"},placeholder:{control:"text"},showSeconds:{control:"boolean",description:"Whether to show seconds input"}}},s={args:{placeholder:"Select time",showSeconds:!0,onchange:e=>console.log("Time changed:",e)}},a={args:{initialtime:"14:30:00",showSeconds:!0,onchange:e=>console.log("Time changed:",e)}},n={args:{placeholder:"Select time",showSeconds:!1,onchange:e=>console.log("Time changed:",e)}},o={args:{initialtime:"09:00:00",disabled:!0,showSeconds:!0,onchange:e=>console.log("Time changed:",e)}},i={args:{onchange:e=>console.log("Time changed:",e)},render:()=>{const[e,l]=g.useState("12:00:00");return t.jsxs("div",{className:"w-80 space-y-4",children:[t.jsx(m,{onchange:r=>l(r),initialtime:e,showSeconds:!0}),t.jsxs("div",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:["Selected time: ",t.jsx("strong",{children:e||"None"})]})]})}},c={args:{initialtime:"18:45:30",showSeconds:!0,onchange:e=>console.log("Time changed:",e)},parameters:{backgrounds:{default:"dark"}},decorators:[e=>t.jsx("div",{className:"dark",children:t.jsx(e,{})})]},d={args:{onchange:e=>console.log("Time changed:",e)},render:()=>{const[e,l]=g.useState("09:00:00"),[r,R]=g.useState("17:00:00");return t.jsxs("div",{className:"w-96 p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4",children:[t.jsxs("div",{children:[t.jsx("label",{htmlFor:"start-time",className:"text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block",children:"Start Time"}),t.jsx(m,{id:"start-time",onchange:l,initialtime:e,showSeconds:!1})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"end-time",className:"text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block",children:"End Time"}),t.jsx(m,{id:"end-time",onchange:R,initialtime:r,showSeconds:!1})]}),t.jsxs("div",{className:"text-sm text-neutral-700 dark:text-neutral-300 pt-2 border-t border-neutral-200 dark:border-neutral-700",children:["Working hours: ",t.jsx("strong",{children:e})," to ",t.jsx("strong",{children:r})]})]})}};var u,h,p;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    placeholder: 'Select time',
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...(p=(h=s.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var S,x,T;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    initialtime: '14:30:00',
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...(T=(x=a.parameters)==null?void 0:x.docs)==null?void 0:T.source}}};var b,k,w;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    placeholder: 'Select time',
    showSeconds: false,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...(w=(k=n.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var v,f,j;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    initialtime: '09:00:00',
    disabled: true,
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...(j=(f=o.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var N,I,y;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    onchange: (time: string) => console.log('Time changed:', time)
  },
  render: () => {
    const [time, setTime] = useState<string>('12:00:00');
    return <div className="w-80 space-y-4">
                <TimeInput onchange={newTime => setTime(newTime)} initialtime={time} showSeconds={true} />
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                    Selected time: <strong>{time || 'None'}</strong>
                </div>
            </div>;
  }
}`,...(y=(I=i.parameters)==null?void 0:I.docs)==null?void 0:y.source}}};var E,W,D;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    initialtime: '18:45:30',
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>]
}`,...(D=(W=c.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};var F,M,H;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    onchange: (time: string) => console.log('Time changed:', time)
  },
  render: () => {
    const [startTime, setStartTime] = useState<string>('09:00:00');
    const [endTime, setEndTime] = useState<string>('17:00:00');
    return <div className="w-96 p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
                <div>
                    <label htmlFor="start-time" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        Start Time
                    </label>
                    <TimeInput id="start-time" onchange={setStartTime} initialtime={startTime} showSeconds={false} />
                </div>
                <div>
                    <label htmlFor="end-time" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        End Time
                    </label>
                    <TimeInput id="end-time" onchange={setEndTime} initialtime={endTime} showSeconds={false} />
                </div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    Working hours: <strong>{startTime}</strong> to <strong>{endTime}</strong>
                </div>
            </div>;
  }
}`,...(H=(M=d.parameters)==null?void 0:M.docs)==null?void 0:H.source}}};const B=["Default","WithInitialTime","WithoutSeconds","Disabled","Interactive","DarkMode","InForm"];export{c as DarkMode,s as Default,o as Disabled,d as InForm,i as Interactive,a as WithInitialTime,n as WithoutSeconds,B as __namedExportsOrder,z as default};
