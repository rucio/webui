import{L as d}from"./Login-D1Afvomq.js";import"./iframe-DMIragWs.js";import"./preload-helper-Dp1pzeXC.js";import"./button-BWb-p93B.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-B91PWC8E.js";import"./iconBase-DmEhsc0g.js";import"./input-DHFDbkT-.js";import"./select-DxdGkeyN.js";import"./index-BrTmSpkE.js";import"./index-CIzH_78Z.js";import"./index-oOAg5sMk.js";import"./index-DYoRx_Z9.js";import"./Combination-QG2ElpMT.js";import"./index-D_GwO8R2.js";import"./index-BzTWRdGd.js";import"./index-CXcdJVwx.js";import"./index-7i_HNxQ4.js";import"./Alert-B7iYpwRv.js";import"./index-UXBszWoi.js";import"./proxy-CxXrm490.js";import"./use-reduced-motion-D1K2y-Oo.js";import"./warning-C20GYw-A.js";import"./RucioLogo-DvP4bYGx.js";import"./auth-models-DGfjT_QB.js";import"./link-vteavk6M.js";const j={title:"Demos/01_Login",component:d},o={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},p={name:"Indigo IAM",url:"https://accounts.google.com/o/oauth2/v2/auth",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://accounts.google.com/o/oauth2/v2/auth",tokenUrl:"https://oauth2.googleapis.com/token",redirectUrl:"https://accounts.google.com/o/oauth2/v2/auth"},u={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!1,oidcProviders:[o]},l={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!1,oidcProviders:[o,p]},h={name:"LHCb",shortName:"lhcb",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!1,oidcProviders:[o]},t={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!1,oidcEnabled:!1,oidcProviders:[o],multiVOEnabled:!1,voList:[u,l],isLoggedIn:!1,accountsAvailable:void 0,accountActive:void 0,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"success",message:"",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}}},e={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!1,oidcProviders:[o],multiVOEnabled:!0,voList:[u,l,h],isLoggedIn:!1,accountsAvailable:void 0,accountActive:void 0,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"success",message:"",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}}};var n,i,s;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    loginViewModel: {
      status: 'success',
      userpassEnabled: true,
      x509Enabled: false,
      oidcEnabled: false,
      oidcProviders: [cernOIDCProvider],
      multiVOEnabled: false,
      voList: [voAtlas, voCMS],
      isLoggedIn: false,
      accountsAvailable: undefined,
      accountActive: undefined,
      rucioAuthHost: 'https://rucio.cern.ch'
    },
    authViewModel: {
      status: 'success',
      message: '',
      rucioAccount: '',
      rucioMultiAccount: '',
      rucioAuthType: '',
      rucioAuthToken: '',
      rucioIdentity: '',
      rucioAuthTokenExpires: '',
      role: undefined
    }
  }
}`,...(s=(i=t.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};var r,c,a;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    loginViewModel: {
      status: 'success',
      userpassEnabled: true,
      x509Enabled: true,
      oidcEnabled: false,
      oidcProviders: [cernOIDCProvider],
      multiVOEnabled: true,
      voList: [voAtlas, voCMS, voLHCb],
      isLoggedIn: false,
      accountsAvailable: undefined,
      accountActive: undefined,
      rucioAuthHost: 'https://rucio.cern.ch'
    },
    authViewModel: {
      status: 'success',
      message: '',
      rucioAccount: '',
      rucioMultiAccount: '',
      rucioAuthType: '',
      rucioAuthToken: '',
      rucioIdentity: '',
      rucioAuthTokenExpires: '',
      role: undefined
    }
  }
}`,...(a=(c=e.parameters)==null?void 0:c.docs)==null?void 0:a.source}}};const q=["ABasicLogin","ABasicMultiVOLogin"];export{t as ABasicLogin,e as ABasicMultiVOLogin,q as __namedExportsOrder,j as default};
