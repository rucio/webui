import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,r,t as i}from"./input-sbwFF1TT.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k;e((()=>{a=t(),r(),o={title:`Atoms/Form/Input`,component:i,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`error`],description:`Visual style variant of the input`},error:{control:`boolean`,description:`Shows error state styling`},disabled:{control:`boolean`,description:`Disables the input`},type:{control:`select`,options:[`text`,`email`,`password`,`number`,`date`,`tel`,`url`,`search`],description:`HTML input type`}},decorators:[e=>(0,a.jsx)(`div`,{className:`w-[400px]`,children:(0,a.jsx)(e,{})})]},s={args:{placeholder:`Enter text...`}},c={args:{defaultValue:`Sample text`}},l={render:()=>(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`email`,className:`block text-sm font-medium mb-2`,children:`Email Address`}),(0,a.jsx)(i,{id:`email`,type:`email`,placeholder:`you@example.com`})]})},u={args:{type:`text`,placeholder:`Enter text...`}},d={args:{type:`email`,placeholder:`you@example.com`}},f={args:{type:`password`,placeholder:`Enter password...`}},p={args:{type:`number`,placeholder:`0`}},m={args:{type:`date`}},h={args:{type:`search`,placeholder:`Search...`}},g={args:{type:`tel`,placeholder:`+1 (555) 123-4567`}},_={args:{type:`url`,placeholder:`https://example.com`}},v={render:()=>(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`email-error`,className:`block text-sm font-medium mb-2`,children:`Email Address`}),(0,a.jsx)(i,{id:`email-error`,type:`email`,error:!0,placeholder:`you@example.com`,defaultValue:`invalid-email`}),(0,a.jsx)(`p`,{className:`mt-2 text-sm text-base-error-600 dark:text-base-error-500`,children:`Please enter a valid email address.`})]})},y={args:{disabled:!0,placeholder:`Disabled input...`}},b={args:{readOnly:!0,defaultValue:`Read-only value`}},x={render:()=>(0,a.jsxs)(`form`,{className:`space-y-4`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`login-email`,className:`block text-sm font-medium mb-2`,children:`Email`}),(0,a.jsx)(i,{id:`login-email`,type:`email`,placeholder:`you@example.com`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`login-password`,className:`block text-sm font-medium mb-2`,children:`Password`}),(0,a.jsx)(i,{id:`login-password`,type:`password`,placeholder:`Enter password`})]})]})},S={render:()=>(0,a.jsxs)(`div`,{className:`space-y-4`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`valid-input`,className:`block text-sm font-medium mb-2`,children:`Valid Input`}),(0,a.jsx)(i,{id:`valid-input`,defaultValue:`valid@email.com`}),(0,a.jsx)(`p`,{className:`mt-2 text-sm text-base-success-600 dark:text-base-success-500`,children:`Email is valid!`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`invalid-input`,className:`block text-sm font-medium mb-2`,children:`Invalid Input`}),(0,a.jsx)(i,{id:`invalid-input`,error:!0,defaultValue:`invalid-email`}),(0,a.jsx)(`p`,{className:`mt-2 text-sm text-base-error-600 dark:text-base-error-500`,children:`Please enter a valid email.`})]})]})},C={render:()=>(0,a.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 space-y-4`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`dark-email`,className:`block text-sm font-medium mb-2`,children:`Email`}),(0,a.jsx)(i,{id:`dark-email`,type:`email`,placeholder:`you@example.com`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`dark-error`,className:`block text-sm font-medium mb-2`,children:`Email (Error)`}),(0,a.jsx)(i,{id:`dark-error`,type:`email`,error:!0,placeholder:`you@example.com`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`dark-disabled`,className:`block text-sm font-medium mb-2`,children:`Disabled`}),(0,a.jsx)(i,{id:`dark-disabled`,disabled:!0,placeholder:`Disabled input`})]})]}),globals:{backgrounds:{value:`dark`}}},w={render:()=>(0,a.jsx)(n,{placeholder:`Enter your message...`})},T={render:()=>(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`message`,className:`block text-sm font-medium mb-2`,children:`Message`}),(0,a.jsx)(n,{id:`message`,placeholder:`Enter your message...`})]})},E={render:()=>(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`message-error`,className:`block text-sm font-medium mb-2`,children:`Message`}),(0,a.jsx)(n,{id:`message-error`,error:!0,placeholder:`Enter your message...`}),(0,a.jsx)(`p`,{className:`mt-2 text-sm text-base-error-600 dark:text-base-error-500`,children:`Message is required.`})]})},D={render:()=>(0,a.jsx)(n,{disabled:!0,placeholder:`Disabled textarea...`})},O={render:()=>(0,a.jsxs)(`div`,{className:`space-y-4`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`input-text`,className:`block text-sm font-medium mb-2`,children:`Text`}),(0,a.jsx)(i,{id:`input-text`,type:`text`,placeholder:`Text input`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`input-email`,className:`block text-sm font-medium mb-2`,children:`Email`}),(0,a.jsx)(i,{id:`input-email`,type:`email`,placeholder:`Email input`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`input-password`,className:`block text-sm font-medium mb-2`,children:`Password`}),(0,a.jsx)(i,{id:`input-password`,type:`password`,placeholder:`Password input`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`input-number`,className:`block text-sm font-medium mb-2`,children:`Number`}),(0,a.jsx)(i,{id:`input-number`,type:`number`,placeholder:`Number input`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`input-date`,className:`block text-sm font-medium mb-2`,children:`Date`}),(0,a.jsx)(i,{id:`input-date`,type:`date`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`label`,{htmlFor:`input-search`,className:`block text-sm font-medium mb-2`,children:`Search`}),(0,a.jsx)(i,{id:`input-search`,type:`search`,placeholder:`Search input`})]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'Sample text'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
            </label>
            <Input id="email" type="email" placeholder="you@example.com" />
        </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter text...'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'you@example.com'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password...'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: '0'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'date'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'tel',
    placeholder: '+1 (555) 123-4567'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'url',
    placeholder: 'https://example.com'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="email-error" className="block text-sm font-medium mb-2">
                Email Address
            </label>
            <Input id="email-error" type="email" error placeholder="you@example.com" defaultValue="invalid-email" />
            <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Please enter a valid email address.</p>
        </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Disabled input...'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    defaultValue: 'Read-only value'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Enter your message..." />
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
            </label>
            <Textarea id="message" placeholder="Enter your message..." />
        </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <div>
            <label htmlFor="message-error" className="block text-sm font-medium mb-2">
                Message
            </label>
            <Textarea id="message-error" error placeholder="Enter your message..." />
            <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Message is required.</p>
        </div>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea disabled placeholder="Disabled textarea..." />
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k=[`Default`,`WithValue`,`WithLabel`,`TextInput`,`EmailInput`,`PasswordInput`,`NumberInput`,`DateInput`,`SearchInput`,`TelephoneInput`,`URLInput`,`ErrorState`,`DisabledState`,`ReadOnlyState`,`LoginForm`,`WithValidation`,`DarkMode`,`TextareaDefault`,`TextareaWithLabel`,`TextareaError`,`TextareaDisabled`,`AllInputTypes`]}))();export{O as AllInputTypes,C as DarkMode,m as DateInput,s as Default,y as DisabledState,d as EmailInput,v as ErrorState,x as LoginForm,p as NumberInput,f as PasswordInput,b as ReadOnlyState,h as SearchInput,g as TelephoneInput,u as TextInput,w as TextareaDefault,D as TextareaDisabled,E as TextareaError,T as TextareaWithLabel,_ as URLInput,l as WithLabel,S as WithValidation,c as WithValue,k as __namedExportsOrder,o as default};