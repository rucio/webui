import{L as s}from"./Login-Dq6vd2Kn.js";import{s as a}from"./utils-DsKtx5Xo.js";import"./iframe-CYzR_2Pj.js";import"./preload-helper-Dp1pzeXC.js";import"./button-G8Xmfo90.js";import"./index-DSpI4bVK.js";import"./index.esm-Jurny2OC.js";import"./iconBase-BSp4gafK.js";import"./input-BKbGJ5dW.js";import"./select-CUzEtcFR.js";import"./index-XI8BcS_X.js";import"./index-C02K-P7G.js";import"./index-CGXKTZtt.js";import"./index-BqJkGV6w.js";import"./Combination-BMLKYx5K.js";import"./index-Dese5ljI.js";import"./index-CuQbuEUw.js";import"./index-gyuNh8HX.js";import"./index-fD2mheAg.js";import"./Alert-B2IufoC_.js";import"./index.esm-BMXm3Nuc.js";import"./proxy-8VXCveDn.js";import"./use-reduced-motion-C4Z7Q0hG.js";import"./RucioLogo-BPJ0v8BS.js";import"./auth-models-DGfjT_QB.js";import"./link-BDdksEUf.js";import"./index-DoWriR-r.js";import"./warning-C20GYw-A.js";import"./tw-merge-Ds6tgvmq.js";const{within:u,userEvent:l}=__STORYBOOK_MODULE_TEST__,Y={title:"Demos/01_Login",component:s},o={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},d={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[o]},p={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[o]},t={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[o],multiVOEnabled:!0,voList:[d,p],accountsAvailable:void 0,accountActive:void 0,isLoggedIn:!1,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"multiple_accounts",message:"mayank,ddmadmin,tester",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}},play:async({canvasElement:i})=>{const c=u(i).getByRole("button",{name:/undefined/});await a(2e3),await l.click(c)}};var e,n,r;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    loginViewModel: {
      status: 'success',
      userpassEnabled: true,
      x509Enabled: true,
      oidcEnabled: true,
      oidcProviders: [cernOIDCProvider],
      multiVOEnabled: true,
      voList: [voAtlas, voCMS],
      accountsAvailable: undefined,
      accountActive: undefined,
      isLoggedIn: false,
      rucioAuthHost: 'https://rucio.cern.ch'
    },
    authViewModel: {
      status: 'multiple_accounts',
      message: 'mayank,ddmadmin,tester',
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
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('button', {
      name: /undefined/
    });
    await sleep(2000);
    await userEvent.click(select);
  }
}`,...(r=(n=t.parameters)==null?void 0:n.docs)==null?void 0:r.source}}};const j=["Playbook_Multi_Account"];export{t as Playbook_Multi_Account,j as __namedExportsOrder,Y as default};
