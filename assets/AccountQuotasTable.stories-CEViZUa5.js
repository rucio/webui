import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./jsx-runtime-CndCZlyt.js";import{n,t as r}from"./Toaster-puS0tlJr.js";import{n as i,t as a}from"./AccountQuotasTable-4GKy7DZR.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{o=t(),i(),n(),s={title:`Components/Pages/Account/Details/AccountQuotasTable`,component:a,decorators:[e=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{className:`h-96`,children:(0,o.jsx)(e,{})}),(0,o.jsx)(r,{})]})]},c={args:{locality:`local`,canManage:!0,quotas:[{rse:`CERN-PROD_DATADISK`,bytesLimit:0x9184e72a000,bytesUsed:42e11,files:1520,bytesRemaining:58e11},{rse:`BNL-OSG2_DATADISK`,bytesLimit:-1,bytesUsed:21e11,files:800,bytesRemaining:null},{rse:`DESY-HH_SCRATCHDISK`,bytesLimit:null,bytesUsed:3e11,files:42,bytesRemaining:null},{rse:`TOKYO-LCG2_DATADISK`,bytesLimit:0xe8d4a51000,bytesUsed:95e10,files:120,bytesRemaining:5e10},{rse:`IN2P3-CC_DATADISK`,bytesLimit:0xe8d4a51000,bytesUsed:12e11,files:300,bytesRemaining:-2e11}]}},l={args:{locality:`global`,canManage:!0,quotas:[{rseExpression:`tier=1&type=DATADISK`,resolvedRses:[`BNL-OSG2_DATADISK`,`IN2P3-CC_DATADISK`,`TOKYO-LCG2_DATADISK`],bytesLimit:5e13,bytesUsed:425e10,files:1220,bytesRemaining:4575e10},{rseExpression:`country=ch`,resolvedRses:[`CERN-PROD_DATADISK`],bytesLimit:-1,bytesUsed:42e11,files:1520,bytesRemaining:null}]}},u={args:{...c.args,canManage:!1}},d=[`Local`,`Global`,`ReadOnly`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    locality: 'local',
    canManage: true,
    quotas: [{
      rse: 'CERN-PROD_DATADISK',
      bytesLimit: 10e12,
      bytesUsed: 4.2e12,
      files: 1520,
      bytesRemaining: 5.8e12
    }, {
      rse: 'BNL-OSG2_DATADISK',
      bytesLimit: -1,
      bytesUsed: 2.1e12,
      files: 800,
      bytesRemaining: null
    }, {
      rse: 'DESY-HH_SCRATCHDISK',
      bytesLimit: null,
      bytesUsed: 3e11,
      files: 42,
      bytesRemaining: null
    }, {
      rse: 'TOKYO-LCG2_DATADISK',
      bytesLimit: 1e12,
      bytesUsed: 9.5e11,
      files: 120,
      bytesRemaining: 5e10
    }, {
      rse: 'IN2P3-CC_DATADISK',
      bytesLimit: 1e12,
      bytesUsed: 1.2e12,
      files: 300,
      bytesRemaining: -2e11
    }]
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    locality: 'global',
    canManage: true,
    quotas: [{
      rseExpression: 'tier=1&type=DATADISK',
      resolvedRses: ['BNL-OSG2_DATADISK', 'IN2P3-CC_DATADISK', 'TOKYO-LCG2_DATADISK'],
      bytesLimit: 50e12,
      bytesUsed: 4.25e12,
      files: 1220,
      bytesRemaining: 45.75e12
    }, {
      rseExpression: 'country=ch',
      resolvedRses: ['CERN-PROD_DATADISK'],
      bytesLimit: -1,
      bytesUsed: 4.2e12,
      files: 1520,
      bytesRemaining: null
    }]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Local.args,
    canManage: false
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as Global,c as Local,u as ReadOnly,d as __namedExportsOrder,s as default};