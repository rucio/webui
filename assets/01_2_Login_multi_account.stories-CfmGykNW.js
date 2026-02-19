import{L as s}from"./Login-CwvZlibb.js";import{s as a}from"./utils-DsKtx5Xo.js";import"./iframe-CbZ9RuD1.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CTUPBRYB.js";import"./index-DSpI4bVK.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";import"./input-DudEH1ht.js";import"./select-BSUdR0U-.js";import"./index-BVAf5DAB.js";import"./index-YEY9OEgd.js";import"./index-B5AF9blO.js";import"./index-Dwd-kS-d.js";import"./Combination-C2wgG2I7.js";import"./index-_REj2qAT.js";import"./index-CeuYnBzV.js";import"./index-CzukIY3d.js";import"./index-jI6H8jZ4.js";import"./Alert-DSW6oEjQ.js";import"./index-3wkwrokg.js";import"./proxy-vEXAzVUV.js";import"./use-reduced-motion-CgJySeb8.js";import"./warning-C20GYw-A.js";import"./RucioLogo-je1npqWy.js";import"./auth-models-DGfjT_QB.js";import"./link-CLCsOSg8.js";import"./tw-merge-Ds6tgvmq.js";const{within:u,userEvent:l}=__STORYBOOK_MODULE_TEST__,K={title:"Demos/01_Login",component:s},o={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},d={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[o]},p={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[o]},t={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[o],multiVOEnabled:!0,voList:[d,p],accountsAvailable:void 0,accountActive:void 0,isLoggedIn:!1,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"multiple_accounts",message:"mayank,ddmadmin,tester",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}},play:async({canvasElement:i})=>{const c=u(i).getByRole("button",{name:/undefined/});await a(2e3),await l.click(c)}};var e,n,r;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
}`,...(r=(n=t.parameters)==null?void 0:n.docs)==null?void 0:r.source}}};const Y=["Playbook_Multi_Account"];export{t as Playbook_Multi_Account,Y as __namedExportsOrder,K as default};
