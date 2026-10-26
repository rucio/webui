import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./jsx-runtime-CndCZlyt.js";import{n,t as r}from"./Toaster-puS0tlJr.js";import{n as i,r as a}from"./account-CC7QbU4_.js";import{n as o,t as s}from"./AccountIdentitiesTable-BD9aAVod.js";var c,l,u,d,f,p;function m(){return(m=e((()=>{c=t(),o(),n(),a(),l={title:`Components/Pages/Account/Details/AccountIdentitiesTable`,component:s,decorators:[e=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`div`,{className:`h-96`,children:(0,c.jsx)(e,{})}),(0,c.jsx)(r,{})]})]},u=[{identity:`CN=Jane Doe,OU=Users,DC=example,DC=org`,type:i.X509,email:`jdoe@example.com`},{identity:`SUB=1234-abcd, ISS=https://iam.example.org/`,type:i.OIDC,email:`jdoe@example.com`},{identity:`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK0wmN/Cr3JXqmLW7u+g9pTh+wyqDHpSQEIQczXkVx9q jdoe@laptop.example.org`,type:i.SSH,email:`jdoe@example.com`},{identity:`jdoe`,type:i.USERPASS,email:`jdoe@example.com`}],d={args:{identities:u,canManage:!0}},f={args:{identities:u,canManage:!1}},p=[`Admin`,`ReadOnly`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    identities,
    canManage: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    identities,
    canManage: false
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as Admin,f as ReadOnly,p as __namedExportsOrder,l as default};