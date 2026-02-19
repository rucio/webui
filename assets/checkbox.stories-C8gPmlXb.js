import{j as e,r,R as le}from"./iframe-CbZ9RuD1.js";import{C as s}from"./checkbox-Dm_TBBEE.js";import"./preload-helper-Dp1pzeXC.js";import"./index-YEY9OEgd.js";import"./index-BVAf5DAB.js";import"./index-jI6H8jZ4.js";import"./index-CzukIY3d.js";import"./index-CI9TgWTM.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";const Ne={title:"Atoms/Form/Checkbox",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{checked:{control:"select",options:[!0,!1,"indeterminate"],description:"The checked state of the checkbox"},disabled:{control:"boolean",description:"Whether the checkbox is disabled"}}},m={args:{checked:!1}},o={args:{checked:!0}},h={args:{checked:"indeterminate"}},k={args:{disabled:!0,checked:!1}},p={args:{disabled:!0,checked:!0}},x={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"terms"}),e.jsx("label",{htmlFor:"terms",className:"text-sm font-medium cursor-pointer",children:"Accept terms and conditions"})]})},u={render:()=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(s,{id:"marketing",className:"mt-1"}),e.jsxs("div",{className:"grid gap-1.5 leading-none",children:[e.jsx("label",{htmlFor:"marketing",className:"text-sm font-medium cursor-pointer",children:"Marketing emails"}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Receive emails about new products and features."})]})]})},C={render:()=>{const[d,t]=r.useState(!1);return e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"interactive",checked:d,onCheckedChange:c=>t(c===!0)}),e.jsx("label",{htmlFor:"interactive",className:"text-sm font-medium cursor-pointer",children:d?"Checked!":"Click me"})]})}},b={render:()=>{const[d,t]=r.useState("indeterminate"),[c,f]=r.useState(!0),[n,j]=r.useState(!1),[l,F]=r.useState(!1);le.useEffect(()=>{t(c&&n&&l?!0:!c&&!n&&!l?!1:"indeterminate")},[c,n,l]);const ne=a=>{const i=a===!0;f(i),j(i),F(i)};return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"parent",checked:d,onCheckedChange:ne}),e.jsx("label",{htmlFor:"parent",className:"text-sm font-medium cursor-pointer",children:"Select All"})]}),e.jsxs("div",{className:"ml-6 space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"child1",checked:c,onCheckedChange:a=>f(a===!0)}),e.jsx("label",{htmlFor:"child1",className:"text-sm cursor-pointer",children:"Option 1"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"child2",checked:n,onCheckedChange:a=>j(a===!0)}),e.jsx("label",{htmlFor:"child2",className:"text-sm cursor-pointer",children:"Option 2"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"child3",checked:l,onCheckedChange:a=>F(a===!0)}),e.jsx("label",{htmlFor:"child3",className:"text-sm cursor-pointer",children:"Option 3"})]})]})]})}},g={render:()=>e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"remember"}),e.jsx("label",{htmlFor:"remember",className:"text-sm font-medium cursor-pointer",children:"Remember me"})]}),e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(s,{id:"terms-form",className:"mt-1"}),e.jsxs("div",{className:"grid gap-1.5 leading-none",children:[e.jsx("label",{htmlFor:"terms-form",className:"text-sm font-medium cursor-pointer",children:"I agree to the terms and conditions"}),e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"By checking this box, you agree to our Terms of Service and Privacy Policy."})]})]})]})},v={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{checked:!1}),e.jsx("span",{className:"text-sm",children:"Unchecked"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{checked:!0}),e.jsx("span",{className:"text-sm",children:"Checked"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{checked:"indeterminate"}),e.jsx("span",{className:"text-sm",children:"Indeterminate"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{disabled:!0,checked:!1}),e.jsx("span",{className:"text-sm text-neutral-500",children:"Disabled unchecked"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{disabled:!0,checked:!0}),e.jsx("span",{className:"text-sm text-neutral-500",children:"Disabled checked"})]})]})},N={parameters:{backgrounds:{default:"dark"}},render:()=>e.jsxs("div",{className:"dark p-8 rounded-lg bg-neutral-900 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"dark-unchecked",checked:!1}),e.jsx("label",{htmlFor:"dark-unchecked",className:"text-sm cursor-pointer",children:"Unchecked"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"dark-checked",checked:!0}),e.jsx("label",{htmlFor:"dark-checked",className:"text-sm cursor-pointer",children:"Checked"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"dark-indeterminate",checked:"indeterminate"}),e.jsx("label",{htmlFor:"dark-indeterminate",className:"text-sm cursor-pointer",children:"Indeterminate"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{id:"dark-disabled",disabled:!0,checked:!0}),e.jsx("label",{htmlFor:"dark-disabled",className:"text-sm text-neutral-500 cursor-pointer",children:"Disabled"})]})]})};var S,y,I;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...(I=(y=m.parameters)==null?void 0:y.docs)==null?void 0:I.source}}};var D,P,U;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(U=(P=o.parameters)==null?void 0:P.docs)==null?void 0:U.source}}};var R,w,A;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    checked: 'indeterminate'
  }
}`,...(A=(w=h.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};var O,E,V;k.parameters={...k.parameters,docs:{...(O=k.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: false
  }
}`,...(V=(E=k.parameters)==null?void 0:E.docs)==null?void 0:V.source}}};var W,M,T;p.parameters={...p.parameters,docs:{...(W=p.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: true
  }
}`,...(T=(M=p.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var B,L,_;x.parameters={...x.parameters,docs:{...(B=x.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                Accept terms and conditions
            </label>
        </div>
}`,...(_=(L=x.parameters)==null?void 0:L.docs)==null?void 0:_.source}}};var q,z,G;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex items-start gap-2">
            <Checkbox id="marketing" className="mt-1" />
            <div className="grid gap-1.5 leading-none">
                <label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                    Marketing emails
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Receive emails about new products and features.</p>
            </div>
        </div>
}`,...(G=(z=u.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var H,J,K;C.parameters={...C.parameters,docs:{...(H=C.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <div className="flex items-center gap-2">
                <Checkbox id="interactive" checked={checked} onCheckedChange={value => setChecked(value === true)} />
                <label htmlFor="interactive" className="text-sm font-medium cursor-pointer">
                    {checked ? 'Checked!' : 'Click me'}
                </label>
            </div>;
  }
}`,...(K=(J=C.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Y;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(Y=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;g.parameters={...g.parameters,docs:{...(Z=g.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(ee=($=g.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var se,ae,ce;v.parameters={...v.parameters,docs:{...(se=v.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(ce=(ae=v.parameters)==null?void 0:ae.docs)==null?void 0:ce.source}}};var te,re,de;N.parameters={...N.parameters,docs:{...(te=N.parameters)==null?void 0:te.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
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
        </div>
}`,...(de=(re=N.parameters)==null?void 0:re.docs)==null?void 0:de.source}}};const fe=["Unchecked","Checked","Indeterminate","Disabled","DisabledChecked","WithLabel","WithDescription","Interactive","IndeterminateInteractive","InForm","AllStates","DarkMode"];export{v as AllStates,o as Checked,N as DarkMode,k as Disabled,p as DisabledChecked,g as InForm,h as Indeterminate,b as IndeterminateInteractive,C as Interactive,m as Unchecked,u as WithDescription,x as WithLabel,fe as __namedExportsOrder,Ne as default};
