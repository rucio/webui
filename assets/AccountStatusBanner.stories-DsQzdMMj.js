import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{m as t,r as n}from"./rucio-CT8PoFzM.js";import{n as r,t as i}from"./AccountStatusBanner-D1myU-kw.js";var a,o,s,c,l,u;function d(){return(d=e((()=>{r(),t(),a={title:`Components/Pages/Account/Details/AccountStatusBanner`,component:i,tags:[`autodocs`]},o={args:{status:n.SUSPENDED,suspendedAt:`2026-10-01T09:30:00Z`,canReactivate:!0}},s={args:{status:n.DELETED,deletedAt:`2026-10-05T14:00:00Z`,canReactivate:!0}},c={args:{status:n.SUSPENDED,suspendedAt:`2026-10-01T09:30:00Z`,canReactivate:!1}},l={args:{status:n.SUSPENDED,suspendedAt:`2026-10-01T09:30:00Z`,canReactivate:!0,busy:!0}},u=[`Suspended`,`Deleted`,`SuspendedReadOnly`,`Busy`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    status: AccountStatus.SUSPENDED,
    suspendedAt: '2026-10-01T09:30:00Z',
    canReactivate: true
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    status: AccountStatus.DELETED,
    deletedAt: '2026-10-05T14:00:00Z',
    canReactivate: true
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    status: AccountStatus.SUSPENDED,
    suspendedAt: '2026-10-01T09:30:00Z',
    canReactivate: false
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    status: AccountStatus.SUSPENDED,
    suspendedAt: '2026-10-01T09:30:00Z',
    canReactivate: true,
    busy: true
  }
}`,...l.parameters?.docs?.source}}}})))()}d();export{l as Busy,s as Deleted,o as Suspended,c as SuspendedReadOnly,u as __namedExportsOrder,a as default};