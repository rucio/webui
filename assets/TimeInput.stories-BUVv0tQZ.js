import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{n as r,t as i}from"./TimeInput-CA3EVB8R.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{a=n(),r(),o=t(),s={title:`Components/Legacy/Input/TimeInput`,component:i,parameters:{layout:`centered`,docs:{description:{component:`A time input component that follows the Rucio WebUI design system. Supports both 12-hour and 24-hour formats with optional seconds.`}}},tags:[`autodocs`],argTypes:{onchange:{action:`time changed`},initialtime:{control:`text`,description:`Initial time value in HH:MM:SS format`},disabled:{control:`boolean`},placeholder:{control:`text`},showSeconds:{control:`boolean`,description:`Whether to show seconds input`}}},c={args:{placeholder:`Select time`,showSeconds:!0,onchange:e=>console.log(`Time changed:`,e)}},l={args:{initialtime:`14:30:00`,showSeconds:!0,onchange:e=>console.log(`Time changed:`,e)}},u={args:{placeholder:`Select time`,showSeconds:!1,onchange:e=>console.log(`Time changed:`,e)}},d={args:{initialtime:`09:00:00`,disabled:!0,showSeconds:!0,onchange:e=>console.log(`Time changed:`,e)}},f={args:{onchange:e=>console.log(`Time changed:`,e)},render:()=>{let[e,t]=(0,o.useState)(`12:00:00`);return(0,a.jsxs)(`div`,{className:`w-80 space-y-4`,children:[(0,a.jsx)(i,{onchange:e=>t(e),initialtime:e,showSeconds:!0}),(0,a.jsxs)(`div`,{className:`text-sm text-neutral-700 dark:text-neutral-300`,children:[`Selected time: `,(0,a.jsx)(`strong`,{children:e||`None`})]})]})}},p={args:{initialtime:`18:45:30`,showSeconds:!0,onchange:e=>console.log(`Time changed:`,e)},decorators:[e=>(0,a.jsx)(`div`,{className:`dark`,children:(0,a.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},m={args:{onchange:e=>console.log(`Time changed:`,e)},render:()=>{let[e,t]=(0,o.useState)(`09:00:00`),[n,r]=(0,o.useState)(`17:00:00`);return(0,a.jsxs)(`div`,{className:`w-96 p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`start-time`,className:`text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block`,children:`Start Time`}),(0,a.jsx)(i,{id:`start-time`,onchange:t,initialtime:e,showSeconds:!1})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`end-time`,className:`text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block`,children:`End Time`}),(0,a.jsx)(i,{id:`end-time`,onchange:r,initialtime:n,showSeconds:!1})]}),(0,a.jsxs)(`div`,{className:`text-sm text-neutral-700 dark:text-neutral-300 pt-2 border-t border-neutral-200 dark:border-neutral-700`,children:[`Working hours: `,(0,a.jsx)(`strong`,{children:e}),` to `,(0,a.jsx)(`strong`,{children:n})]})]})}},h=[`Default`,`WithInitialTime`,`WithoutSeconds`,`Disabled`,`Interactive`,`DarkMode`,`InForm`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Select time',
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    initialtime: '14:30:00',
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Select time',
    showSeconds: false,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    initialtime: '09:00:00',
    disabled: true,
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    initialtime: '18:45:30',
    showSeconds: true,
    onchange: (time: string) => console.log('Time changed:', time)
  },
  decorators: [Story => <div className="dark">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: 'dark'
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}}})))()}g();export{p as DarkMode,c as Default,d as Disabled,m as InForm,f as Interactive,l as WithInitialTime,u as WithoutSeconds,h as __namedExportsOrder,s as default};