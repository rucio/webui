import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./jsx-runtime-CndCZlyt.js";import{m as n,r}from"./rucio-CT8PoFzM.js";import{n as i,t as a}from"./AccountStatusBadge-DQWIbV_D.js";var o,s,c,l,u;function d(){return(d=e((()=>{o=t(),i(),n(),s={title:`Features/Badges/Account/AccountStatusBadge`,component:a,parameters:{layout:`centered`},tags:[`autodocs`]},c={args:{value:r.ACTIVE}},l={render:()=>(0,o.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:Object.values(r).map(e=>(0,o.jsx)(a,{value:e},e))})},u=[`Default`,`AllValues`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: AccountStatus.ACTIVE
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
            {Object.values(AccountStatus).map(value => <AccountStatusBadge key={value} value={value} />)}
        </div>
}`,...l.parameters?.docs?.source}}}})))()}d();export{l as AllValues,c as Default,u as __namedExportsOrder,s as default};