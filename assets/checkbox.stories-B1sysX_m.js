import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Kt as n,bt as r}from"./iframe-C47sd5GD.js";import{n as i,t as a}from"./checkbox-C-TYct-h.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{o=r(),s=t(n()),i(),c={title:`Atoms/Form/Checkbox`,component:a,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{checked:{control:`select`,options:[!0,!1,`indeterminate`],description:`The checked state of the checkbox`},disabled:{control:`boolean`,description:`Whether the checkbox is disabled`}}},l={args:{checked:!1}},u={args:{checked:!0}},d={args:{checked:`indeterminate`}},f={args:{disabled:!0,checked:!1}},p={args:{disabled:!0,checked:!0}},m={render:()=>(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`terms`}),(0,o.jsx)(`label`,{htmlFor:`terms`,className:`text-sm font-medium cursor-pointer`,children:`Accept terms and conditions`})]})},h={render:()=>(0,o.jsxs)(`div`,{className:`flex items-start gap-2`,children:[(0,o.jsx)(a,{id:`marketing`,className:`mt-1`}),(0,o.jsxs)(`div`,{className:`grid gap-1.5 leading-none`,children:[(0,o.jsx)(`label`,{htmlFor:`marketing`,className:`text-sm font-medium cursor-pointer`,children:`Marketing emails`}),(0,o.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Receive emails about new products and features.`})]})]})},g={render:()=>{let[e,t]=(0,s.useState)(!1);return(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`interactive`,checked:e,onCheckedChange:e=>t(e===!0)}),(0,o.jsx)(`label`,{htmlFor:`interactive`,className:`text-sm font-medium cursor-pointer`,children:e?`Checked!`:`Click me`})]})}},_={render:()=>{let[e,t]=(0,s.useState)(`indeterminate`),[n,r]=(0,s.useState)(!0),[i,c]=(0,s.useState)(!1),[l,u]=(0,s.useState)(!1);return s.useEffect(()=>{t(n&&i&&l?!0:!n&&!i&&!l?!1:`indeterminate`)},[n,i,l]),(0,o.jsxs)(`div`,{className:`space-y-3`,children:[(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`parent`,checked:e,onCheckedChange:e=>{let t=e===!0;r(t),c(t),u(t)}}),(0,o.jsx)(`label`,{htmlFor:`parent`,className:`text-sm font-medium cursor-pointer`,children:`Select All`})]}),(0,o.jsxs)(`div`,{className:`ml-6 space-y-2`,children:[(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`child1`,checked:n,onCheckedChange:e=>r(e===!0)}),(0,o.jsx)(`label`,{htmlFor:`child1`,className:`text-sm cursor-pointer`,children:`Option 1`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`child2`,checked:i,onCheckedChange:e=>c(e===!0)}),(0,o.jsx)(`label`,{htmlFor:`child2`,className:`text-sm cursor-pointer`,children:`Option 2`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`child3`,checked:l,onCheckedChange:e=>u(e===!0)}),(0,o.jsx)(`label`,{htmlFor:`child3`,className:`text-sm cursor-pointer`,children:`Option 3`})]})]})]})}},v={render:()=>(0,o.jsxs)(`form`,{className:`space-y-4`,children:[(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`remember`}),(0,o.jsx)(`label`,{htmlFor:`remember`,className:`text-sm font-medium cursor-pointer`,children:`Remember me`})]}),(0,o.jsxs)(`div`,{className:`flex items-start gap-2`,children:[(0,o.jsx)(a,{id:`terms-form`,className:`mt-1`}),(0,o.jsxs)(`div`,{className:`grid gap-1.5 leading-none`,children:[(0,o.jsx)(`label`,{htmlFor:`terms-form`,className:`text-sm font-medium cursor-pointer`,children:`I agree to the terms and conditions`}),(0,o.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`By checking this box, you agree to our Terms of Service and Privacy Policy.`})]})]})]})},y={render:()=>(0,o.jsxs)(`div`,{className:`space-y-4`,children:[(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{checked:!1}),(0,o.jsx)(`span`,{className:`text-sm`,children:`Unchecked`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{checked:!0}),(0,o.jsx)(`span`,{className:`text-sm`,children:`Checked`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{checked:`indeterminate`}),(0,o.jsx)(`span`,{className:`text-sm`,children:`Indeterminate`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{disabled:!0,checked:!1}),(0,o.jsx)(`span`,{className:`text-sm text-neutral-500`,children:`Disabled unchecked`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{disabled:!0,checked:!0}),(0,o.jsx)(`span`,{className:`text-sm text-neutral-500`,children:`Disabled checked`})]})]})},b={render:()=>(0,o.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 space-y-4`,children:[(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`dark-unchecked`,checked:!1}),(0,o.jsx)(`label`,{htmlFor:`dark-unchecked`,className:`text-sm cursor-pointer`,children:`Unchecked`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`dark-checked`,checked:!0}),(0,o.jsx)(`label`,{htmlFor:`dark-checked`,className:`text-sm cursor-pointer`,children:`Checked`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`dark-indeterminate`,checked:`indeterminate`}),(0,o.jsx)(`label`,{htmlFor:`dark-indeterminate`,className:`text-sm cursor-pointer`,children:`Indeterminate`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(a,{id:`dark-disabled`,disabled:!0,checked:!0}),(0,o.jsx)(`label`,{htmlFor:`dark-disabled`,className:`text-sm text-neutral-500 cursor-pointer`,children:`Disabled`})]})]}),globals:{backgrounds:{value:`dark`}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    checked: 'indeterminate'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: false
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                Accept terms and conditions
            </label>
        </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-start gap-2">
            <Checkbox id="marketing" className="mt-1" />
            <div className="grid gap-1.5 leading-none">
                <label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                    Marketing emails
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Receive emails about new products and features.</p>
            </div>
        </div>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <div className="flex items-center gap-2">
                <Checkbox id="interactive" checked={checked} onCheckedChange={value => setChecked(value === true)} />
                <label htmlFor="interactive" className="text-sm font-medium cursor-pointer">
                    {checked ? 'Checked!' : 'Click me'}
                </label>
            </div>;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [parentChecked, setParentChecked] = useState<boolean | 'indeterminate'>('indeterminate');
    const [child1Checked, setChild1Checked] = useState(true);
    const [child2Checked, setChild2Checked] = useState(false);
    const [child3Checked, setChild3Checked] = useState(false);
    React.useEffect(() => {
      const allChecked = child1Checked && child2Checked && child3Checked;
      const allUnchecked = !child1Checked && !child2Checked && !child3Checked;
      if (allChecked) {
        setParentChecked(true);
      } else if (allUnchecked) {
        setParentChecked(false);
      } else {
        setParentChecked('indeterminate');
      }
    }, [child1Checked, child2Checked, child3Checked]);
    const handleParentChange = (value: boolean | 'indeterminate') => {
      const newValue = value === true;
      setChild1Checked(newValue);
      setChild2Checked(newValue);
      setChild3Checked(newValue);
    };
    return <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="parent" checked={parentChecked} onCheckedChange={handleParentChange} />
                    <label htmlFor="parent" className="text-sm font-medium cursor-pointer">
                        Select All
                    </label>
                </div>
                <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <Checkbox id="child1" checked={child1Checked} onCheckedChange={value => setChild1Checked(value === true)} />
                        <label htmlFor="child1" className="text-sm cursor-pointer">
                            Option 1
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="child2" checked={child2Checked} onCheckedChange={value => setChild2Checked(value === true)} />
                        <label htmlFor="child2" className="text-sm cursor-pointer">
                            Option 2
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="child3" checked={child3Checked} onCheckedChange={value => setChild3Checked(value === true)} />
                        <label htmlFor="child3" className="text-sm cursor-pointer">
                            Option 3
                        </label>
                    </div>
                </div>
            </div>;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <form className="space-y-4">
            <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                    Remember me
                </label>
            </div>
            <div className="flex items-start gap-2">
                <Checkbox id="terms-form" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms-form" className="text-sm font-medium cursor-pointer">
                        I agree to the terms and conditions
                    </label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        By checking this box, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </form>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Checkbox checked={false} />
                <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox checked={true} />
                <span className="text-sm">Checked</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox checked="indeterminate" />
                <span className="text-sm">Indeterminate</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox disabled checked={false} />
                <span className="text-sm text-neutral-500">Disabled unchecked</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox disabled checked={true} />
                <span className="text-sm text-neutral-500">Disabled checked</span>
            </div>
        </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
                <Checkbox id="dark-unchecked" checked={false} />
                <label htmlFor="dark-unchecked" className="text-sm cursor-pointer">
                    Unchecked
                </label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="dark-checked" checked={true} />
                <label htmlFor="dark-checked" className="text-sm cursor-pointer">
                    Checked
                </label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="dark-indeterminate" checked="indeterminate" />
                <label htmlFor="dark-indeterminate" className="text-sm cursor-pointer">
                    Indeterminate
                </label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="dark-disabled" disabled checked={true} />
                <label htmlFor="dark-disabled" className="text-sm text-neutral-500 cursor-pointer">
                    Disabled
                </label>
            </div>
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...b.parameters?.docs?.source}}},x=[`Unchecked`,`Checked`,`Indeterminate`,`Disabled`,`DisabledChecked`,`WithLabel`,`WithDescription`,`Interactive`,`IndeterminateInteractive`,`InForm`,`AllStates`,`DarkMode`]}))();export{y as AllStates,u as Checked,b as DarkMode,f as Disabled,p as DisabledChecked,v as InForm,d as Indeterminate,_ as IndeterminateInteractive,g as Interactive,l as Unchecked,h as WithDescription,m as WithLabel,x as __namedExportsOrder,c as default};