import{L as a}from"./Login-D39AGm3w.js";import"./iframe-CW9-_HYS.js";import"./preload-helper-Dp1pzeXC.js";import"./button-uonugc8c.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-DWUw-EzS.js";import"./iconBase-_tCx069T.js";import"./input-Pe1M6Jdo.js";import"./select-BdoeMeyv.js";import"./index-vscuIXpL.js";import"./index-EU4VEQCY.js";import"./index-D1mrQCGS.js";import"./index-DfvfBRvX.js";import"./Combination-C7xDWU_D.js";import"./index-Cd40vaJY.js";import"./index-ZDVb7sJw.js";import"./index-CC9cG0nH.js";import"./index-hSNaI0NW.js";import"./Alert-Dtl0nzFb.js";import"./index.esm-UCqdMbxd.js";import"./proxy-0TP5XkBx.js";import"./use-reduced-motion-CGditCrG.js";import"./RucioLogo-CJgKc0dy.js";import"./auth-models-DGfjT_QB.js";import"./link-CzcqeJGl.js";import"./index-VYHQg3QW.js";import"./warning-C20GYw-A.js";const R={title:"Demos/01_Login",component:a},t={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},u={name:"Indigo IAM",url:"https://accounts.google.com/o/oauth2/v2/auth",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://accounts.google.com/o/oauth2/v2/auth",tokenUrl:"https://oauth2.googleapis.com/token",redirectUrl:"https://accounts.google.com/o/oauth2/v2/auth"},e={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[t]},n={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[t,u]},r={name:"LHCb",shortName:"lhcb",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[t]},o={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[t],multiVOEnabled:!0,voList:[e,n,r],isLoggedIn:!1,accountActive:void 0,accountsAvailable:void 0,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"success",message:"",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}},play:async({container:l})=>{e.oidcEnabled=!0,n.oidcEnabled=!0,r.oidcEnabled=!0}};var i,c,s;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    loginViewModel: {
      status: 'success',
      userpassEnabled: true,
      x509Enabled: true,
      oidcEnabled: true,
      oidcProviders: [cernOIDCProvider],
      multiVOEnabled: true,
      voList: [voAtlas, voCMS, voLHCb],
      isLoggedIn: false,
      accountActive: undefined,
      accountsAvailable: undefined,
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
  },
  play: async ({
    container
  }) => {
    voAtlas.oidcEnabled = true;
    voCMS.oidcEnabled = true;
    voLHCb.oidcEnabled = true;
  }
}`,...(s=(c=o.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};const j=["AMultiVOOIDCEnabledLogin"];export{o as AMultiVOOIDCEnabledLogin,j as __namedExportsOrder,R as default};
