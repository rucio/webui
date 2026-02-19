import{j as e}from"./iframe-CbZ9RuD1.js";import{I as a,T as I}from"./input-DudEH1ht.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";const Be={title:"Atoms/Form/Input",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","error"],description:"Visual style variant of the input"},error:{control:"boolean",description:"Shows error state styling"},disabled:{control:"boolean",description:"Disables the input"},type:{control:"select",options:["text","email","password","number","date","tel","url","search"],description:"HTML input type"}},decorators:[Re=>e.jsx("div",{className:"w-[400px]",children:e.jsx(Re,{})})]},r={args:{placeholder:"Enter text..."}},s={args:{defaultValue:"Sample text"}},t={render:()=>e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium mb-2",children:"Email Address"}),e.jsx(a,{id:"email",type:"email",placeholder:"you@example.com"})]})},l={args:{type:"text",placeholder:"Enter text..."}},o={args:{type:"email",placeholder:"you@example.com"}},d={args:{type:"password",placeholder:"Enter password..."}},n={args:{type:"number",placeholder:"0"}},m={args:{type:"date"}},i={args:{type:"search",placeholder:"Search..."}},c={args:{type:"tel",placeholder:"+1 (555) 123-4567"}},p={args:{type:"url",placeholder:"https://example.com"}},u={render:()=>e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email-error",className:"block text-sm font-medium mb-2",children:"Email Address"}),e.jsx(a,{id:"email-error",type:"email",error:!0,placeholder:"you@example.com",defaultValue:"invalid-email"}),e.jsx("p",{className:"mt-2 text-sm text-base-error-600 dark:text-base-error-500",children:"Please enter a valid email address."})]})},b={args:{disabled:!0,placeholder:"Disabled input..."}},x={args:{readOnly:!0,defaultValue:"Read-only value"}},h={render:()=>e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"login-email",className:"block text-sm font-medium mb-2",children:"Email"}),e.jsx(a,{id:"login-email",type:"email",placeholder:"you@example.com"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"login-password",className:"block text-sm font-medium mb-2",children:"Password"}),e.jsx(a,{id:"login-password",type:"password",placeholder:"Enter password"})]})]})},v={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"valid-input",className:"block text-sm font-medium mb-2",children:"Valid Input"}),e.jsx(a,{id:"valid-input",defaultValue:"valid@email.com"}),e.jsx("p",{className:"mt-2 text-sm text-base-success-600 dark:text-base-success-500",children:"Email is valid!"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"invalid-input",className:"block text-sm font-medium mb-2",children:"Invalid Input"}),e.jsx(a,{id:"invalid-input",error:!0,defaultValue:"invalid-email"}),e.jsx("p",{className:"mt-2 text-sm text-base-error-600 dark:text-base-error-500",children:"Please enter a valid email."})]})]})},g={parameters:{backgrounds:{default:"dark"}},render:()=>e.jsxs("div",{className:"dark p-8 rounded-lg bg-neutral-900 space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"dark-email",className:"block text-sm font-medium mb-2",children:"Email"}),e.jsx(a,{id:"dark-email",type:"email",placeholder:"you@example.com"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"dark-error",className:"block text-sm font-medium mb-2",children:"Email (Error)"}),e.jsx(a,{id:"dark-error",type:"email",error:!0,placeholder:"you@example.com"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"dark-disabled",className:"block text-sm font-medium mb-2",children:"Disabled"}),e.jsx(a,{id:"dark-disabled",disabled:!0,placeholder:"Disabled input"})]})]})},y={render:()=>e.jsx(I,{placeholder:"Enter your message..."})},j={render:()=>e.jsxs("div",{children:[e.jsx("label",{htmlFor:"message",className:"block text-sm font-medium mb-2",children:"Message"}),e.jsx(I,{id:"message",placeholder:"Enter your message..."})]})},k={render:()=>e.jsxs("div",{children:[e.jsx("label",{htmlFor:"message-error",className:"block text-sm font-medium mb-2",children:"Message"}),e.jsx(I,{id:"message-error",error:!0,placeholder:"Enter your message..."}),e.jsx("p",{className:"mt-2 text-sm text-base-error-600 dark:text-base-error-500",children:"Message is required."})]})},f={render:()=>e.jsx(I,{disabled:!0,placeholder:"Disabled textarea..."})},N={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"input-text",className:"block text-sm font-medium mb-2",children:"Text"}),e.jsx(a,{id:"input-text",type:"text",placeholder:"Text input"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"input-email",className:"block text-sm font-medium mb-2",children:"Email"}),e.jsx(a,{id:"input-email",type:"email",placeholder:"Email input"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"input-password",className:"block text-sm font-medium mb-2",children:"Password"}),e.jsx(a,{id:"input-password",type:"password",placeholder:"Password input"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"input-number",className:"block text-sm font-medium mb-2",children:"Number"}),e.jsx(a,{id:"input-number",type:"number",placeholder:"Number input"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"input-date",className:"block text-sm font-medium mb-2",children:"Date"}),e.jsx(a,{id:"input-date",type:"date"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"input-search",className:"block text-sm font-medium mb-2",children:"Search"}),e.jsx(a,{id:"input-search",type:"search",placeholder:"Search input"})]})]})};var E,S,F;r.parameters={...r.parameters,docs:{...(E=r.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...(F=(S=r.parameters)==null?void 0:S.docs)==null?void 0:F.source}}};var w,T,D;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    defaultValue: 'Sample text'
  }
}`,...(D=(T=s.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var V,P,L;t.parameters={...t.parameters,docs:{...(V=t.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
            </label>
            <Input id="email" type="email" placeholder="you@example.com" />
        </div>
}`,...(L=(P=t.parameters)==null?void 0:P.docs)==null?void 0:L.source}}};var M,W,A;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter text...'
  }
}`,...(A=(W=l.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var R,O,q;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'you@example.com'
  }
}`,...(q=(O=o.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var U,_,H;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password...'
  }
}`,...(H=(_=d.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var z,B,C;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: '0'
  }
}`,...(C=(B=n.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};var G,J,K;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    type: 'date'
  }
}`,...(K=(J=m.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Y;i.parameters={...i.parameters,docs:{...(Q=i.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
}`,...(Y=(X=i.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;c.parameters={...c.parameters,docs:{...(Z=c.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    type: 'tel',
    placeholder: '+1 (555) 123-4567'
  }
}`,...(ee=($=c.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var ae,re,se;p.parameters={...p.parameters,docs:{...(ae=p.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    type: 'url',
    placeholder: 'https://example.com'
  }
}`,...(se=(re=p.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var te,le,oe;u.parameters={...u.parameters,docs:{...(te=u.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="email-error" className="block text-sm font-medium mb-2">
                Email Address
            </label>
            <Input id="email-error" type="email" error placeholder="you@example.com" defaultValue="invalid-email" />
            <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Please enter a valid email address.</p>
        </div>
}`,...(oe=(le=u.parameters)==null?void 0:le.docs)==null?void 0:oe.source}}};var de,ne,me;b.parameters={...b.parameters,docs:{...(de=b.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Disabled input...'
  }
}`,...(me=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:me.source}}};var ie,ce,pe;x.parameters={...x.parameters,docs:{...(ie=x.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    defaultValue: 'Read-only value'
  }
}`,...(pe=(ce=x.parameters)==null?void 0:ce.docs)==null?void 0:pe.source}}};var ue,be,xe;h.parameters={...h.parameters,docs:{...(ue=h.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <form className="space-y-4">
            <div>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <Input id="login-email" type="email" placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                    Password
                </label>
                <Input id="login-password" type="password" placeholder="Enter password" />
            </div>
        </form>
}`,...(xe=(be=h.parameters)==null?void 0:be.docs)==null?void 0:xe.source}}};var he,ve,ge;v.parameters={...v.parameters,docs:{...(he=v.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <div>
                <label htmlFor="valid-input" className="block text-sm font-medium mb-2">
                    Valid Input
                </label>
                <Input id="valid-input" defaultValue="valid@email.com" />
                <p className="mt-2 text-sm text-base-success-600 dark:text-base-success-500">Email is valid!</p>
            </div>
            <div>
                <label htmlFor="invalid-input" className="block text-sm font-medium mb-2">
                    Invalid Input
                </label>
                <Input id="invalid-input" error defaultValue="invalid-email" />
                <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Please enter a valid email.</p>
            </div>
        </div>
}`,...(ge=(ve=v.parameters)==null?void 0:ve.docs)==null?void 0:ge.source}}};var ye,je,ke;g.parameters={...g.parameters,docs:{...(ye=g.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: () => <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4">
            <div>
                <label htmlFor="dark-email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <Input id="dark-email" type="email" placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="dark-error" className="block text-sm font-medium mb-2">
                    Email (Error)
                </label>
                <Input id="dark-error" type="email" error placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="dark-disabled" className="block text-sm font-medium mb-2">
                    Disabled
                </label>
                <Input id="dark-disabled" disabled placeholder="Disabled input" />
            </div>
        </div>
}`,...(ke=(je=g.parameters)==null?void 0:je.docs)==null?void 0:ke.source}}};var fe,Ne,Ie;y.parameters={...y.parameters,docs:{...(fe=y.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Enter your message..." />
}`,...(Ie=(Ne=y.parameters)==null?void 0:Ne.docs)==null?void 0:Ie.source}}};var Ee,Se,Fe;j.parameters={...j.parameters,docs:{...(Ee=j.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
            </label>
            <Textarea id="message" placeholder="Enter your message..." />
        </div>
}`,...(Fe=(Se=j.parameters)==null?void 0:Se.docs)==null?void 0:Fe.source}}};var we,Te,De;k.parameters={...k.parameters,docs:{...(we=k.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="message-error" className="block text-sm font-medium mb-2">
                Message
            </label>
            <Textarea id="message-error" error placeholder="Enter your message..." />
            <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Message is required.</p>
        </div>
}`,...(De=(Te=k.parameters)==null?void 0:Te.docs)==null?void 0:De.source}}};var Ve,Pe,Le;f.parameters={...f.parameters,docs:{...(Ve=f.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <Textarea disabled placeholder="Disabled textarea..." />
}`,...(Le=(Pe=f.parameters)==null?void 0:Pe.docs)==null?void 0:Le.source}}};var Me,We,Ae;N.parameters={...N.parameters,docs:{...(Me=N.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <div>
                <label htmlFor="input-text" className="block text-sm font-medium mb-2">
                    Text
                </label>
                <Input id="input-text" type="text" placeholder="Text input" />
            </div>
            <div>
                <label htmlFor="input-email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <Input id="input-email" type="email" placeholder="Email input" />
            </div>
            <div>
                <label htmlFor="input-password" className="block text-sm font-medium mb-2">
                    Password
                </label>
                <Input id="input-password" type="password" placeholder="Password input" />
            </div>
            <div>
                <label htmlFor="input-number" className="block text-sm font-medium mb-2">
                    Number
                </label>
                <Input id="input-number" type="number" placeholder="Number input" />
            </div>
            <div>
                <label htmlFor="input-date" className="block text-sm font-medium mb-2">
                    Date
                </label>
                <Input id="input-date" type="date" />
            </div>
            <div>
                <label htmlFor="input-search" className="block text-sm font-medium mb-2">
                    Search
                </label>
                <Input id="input-search" type="search" placeholder="Search input" />
            </div>
        </div>
}`,...(Ae=(We=N.parameters)==null?void 0:We.docs)==null?void 0:Ae.source}}};const Ce=["Default","WithValue","WithLabel","TextInput","EmailInput","PasswordInput","NumberInput","DateInput","SearchInput","TelephoneInput","URLInput","ErrorState","DisabledState","ReadOnlyState","LoginForm","WithValidation","DarkMode","TextareaDefault","TextareaWithLabel","TextareaError","TextareaDisabled","AllInputTypes"];export{N as AllInputTypes,g as DarkMode,m as DateInput,r as Default,b as DisabledState,o as EmailInput,u as ErrorState,h as LoginForm,n as NumberInput,d as PasswordInput,x as ReadOnlyState,i as SearchInput,c as TelephoneInput,l as TextInput,y as TextareaDefault,f as TextareaDisabled,k as TextareaError,j as TextareaWithLabel,p as URLInput,t as WithLabel,v as WithValidation,s as WithValue,Ce as __namedExportsOrder,Be as default};
