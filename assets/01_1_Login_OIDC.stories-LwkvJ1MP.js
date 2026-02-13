import{L as a}from"./Login-BEpVMBU7.js";import"./iframe-D3itC1ZD.js";import"./preload-helper-Dp1pzeXC.js";import"./button-KZmkFsSo.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-BLhtrR_Z.js";import"./iconBase-CyJfUsJ7.js";import"./input-B5WNM0bX.js";import"./select-BINuWD8L.js";import"./index-f6iBqKF3.js";import"./index-CyALaL67.js";import"./index-CZ1NtYay.js";import"./index-BQHhvC2J.js";import"./Combination-BEV5JikG.js";import"./index-CSVpBGN-.js";import"./index-D6Hxs465.js";import"./index-rqCMH3c7.js";import"./index-CameSFv3.js";import"./Alert-yAtNxjk1.js";import"./index-CnwLT0in.js";import"./proxy-_U9XG71r.js";import"./use-reduced-motion-Ct6dGo-6.js";import"./warning-C20GYw-A.js";import"./RucioLogo-B6fr3jhM.js";import"./auth-models-DGfjT_QB.js";import"./link-B3TV3aYa.js";const N={title:"Demos/01_Login",component:a},t={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},u={name:"Indigo IAM",url:"https://accounts.google.com/o/oauth2/v2/auth",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://accounts.google.com/o/oauth2/v2/auth",tokenUrl:"https://oauth2.googleapis.com/token",redirectUrl:"https://accounts.google.com/o/oauth2/v2/auth"},e={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[t]},n={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[t,u]},r={name:"LHCb",shortName:"lhcb",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[t]},o={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[t],multiVOEnabled:!0,voList:[e,n,r],isLoggedIn:!1,accountActive:void 0,accountsAvailable:void 0,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"success",message:"",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}},play:async({container:l})=>{e.oidcEnabled=!0,n.oidcEnabled=!0,r.oidcEnabled=!0}};var i,c,s;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(s=(c=o.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};const R=["AMultiVOOIDCEnabledLogin"];export{o as AMultiVOOIDCEnabledLogin,R as __namedExportsOrder,N as default};
