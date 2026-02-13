import{L as s}from"./Login-BEpVMBU7.js";import{s as a}from"./utils-DsKtx5Xo.js";import"./iframe-D3itC1ZD.js";import"./preload-helper-Dp1pzeXC.js";import"./button-KZmkFsSo.js";import"./index-DSpI4bVK.js";import"./index.esm-BLhtrR_Z.js";import"./iconBase-CyJfUsJ7.js";import"./input-B5WNM0bX.js";import"./select-BINuWD8L.js";import"./index-f6iBqKF3.js";import"./index-CyALaL67.js";import"./index-CZ1NtYay.js";import"./index-BQHhvC2J.js";import"./Combination-BEV5JikG.js";import"./index-CSVpBGN-.js";import"./index-D6Hxs465.js";import"./index-rqCMH3c7.js";import"./index-CameSFv3.js";import"./Alert-yAtNxjk1.js";import"./index-CnwLT0in.js";import"./proxy-_U9XG71r.js";import"./use-reduced-motion-Ct6dGo-6.js";import"./warning-C20GYw-A.js";import"./RucioLogo-B6fr3jhM.js";import"./auth-models-DGfjT_QB.js";import"./link-B3TV3aYa.js";import"./tw-merge-Ds6tgvmq.js";const{within:u,userEvent:l}=__STORYBOOK_MODULE_TEST__,K={title:"Demos/01_Login",component:s},o={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},d={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[o]},p={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[o]},t={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[o],multiVOEnabled:!0,voList:[d,p],accountsAvailable:void 0,accountActive:void 0,isLoggedIn:!1,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"multiple_accounts",message:"mayank,ddmadmin,tester",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}},play:async({canvasElement:i})=>{const c=u(i).getByRole("button",{name:/undefined/});await a(2e3),await l.click(c)}};var e,n,r;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
