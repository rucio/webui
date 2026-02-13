import{L as d}from"./Login-BEpVMBU7.js";import{s as m}from"./utils-DsKtx5Xo.js";import"./iframe-D3itC1ZD.js";import"./preload-helper-Dp1pzeXC.js";import"./button-KZmkFsSo.js";import"./index-DSpI4bVK.js";import"./index.esm-BLhtrR_Z.js";import"./iconBase-CyJfUsJ7.js";import"./input-B5WNM0bX.js";import"./select-BINuWD8L.js";import"./index-f6iBqKF3.js";import"./index-CyALaL67.js";import"./index-CZ1NtYay.js";import"./index-BQHhvC2J.js";import"./Combination-BEV5JikG.js";import"./index-CSVpBGN-.js";import"./index-D6Hxs465.js";import"./index-rqCMH3c7.js";import"./index-CameSFv3.js";import"./Alert-yAtNxjk1.js";import"./index-CnwLT0in.js";import"./proxy-_U9XG71r.js";import"./use-reduced-motion-Ct6dGo-6.js";import"./warning-C20GYw-A.js";import"./RucioLogo-B6fr3jhM.js";import"./auth-models-DGfjT_QB.js";import"./link-B3TV3aYa.js";import"./tw-merge-Ds6tgvmq.js";const{within:h,userEvent:o}=__STORYBOOK_MODULE_TEST__,q={title:"Demos/01_Login",component:d},n={name:"CERN",url:"https://login.cern.ch/adfs/oauth2/authorize",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://login.cern.ch/adfs/oauth2/authorize",tokenUrl:"https://login.cern.ch/adfs/oauth2/token",refreshTokenUrl:"https://login.cern.ch/adfs/oauth2/token",redirectUrl:"https://login.cern.ch/adfs/oauth2/authorize"},g={name:"Google",url:"https://accounts.google.com/o/oauth2/v2/auth",clientId:"1234567890",clientSecret:"1234567890",authorizationUrl:"https://accounts.google.com/o/oauth2/v2/auth",tokenUrl:"https://oauth2.googleapis.com/token",redirectUrl:"https://accounts.google.com/o/oauth2/v2/auth"},v={name:"ATLAS",shortName:"atl",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[n]},b={name:"CMS",shortName:"cms",logoUrl:"https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",oidcEnabled:!0,oidcProviders:[n,g]},e={args:{loginViewModel:{status:"success",userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[n],multiVOEnabled:!0,voList:[v,b],isLoggedIn:!1,accountsAvailable:void 0,accountActive:void 0,rucioAuthHost:"https://rucio.cern.ch"},authViewModel:{status:"success",message:"",rucioAccount:"",rucioMultiAccount:"",rucioAuthType:"",rucioAuthToken:"",rucioIdentity:"",rucioAuthTokenExpires:"",role:void 0}},play:async({canvasElement:i})=>{const t=h(i),c=t.getByRole("button",{name:/Userpass/});await o.click(c);const u=t.getByRole("textbox",{name:/Username/});await o.type(u,"mayank",{delay:100});const l=t.getByLabelText(/Password/);await o.type(l,"password",{delay:100});const p=t.getByRole("button",{name:/Login/});await o.click(p),await m(2e3)}};var s,a,r;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    loginViewModel: {
      status: 'success',
      userpassEnabled: true,
      x509Enabled: true,
      oidcEnabled: true,
      oidcProviders: [cernOIDCProvider],
      multiVOEnabled: true,
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
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const userpassButton = canvas.getByRole('button', {
      name: /Userpass/
    });
    await userEvent.click(userpassButton);
    const usernameTextbox = canvas.getByRole('textbox', {
      name: /Username/
    });
    await userEvent.type(usernameTextbox, 'mayank', {
      delay: 100
    });
    const passwordTextbox = canvas.getByLabelText(/Password/);
    await userEvent.type(passwordTextbox, 'password', {
      delay: 100
    });
    const loginButton = canvas.getByRole('button', {
      name: /Login/
    });
    await userEvent.click(loginButton);
    await sleep(2000);
  }
}`,...(r=(a=e.parameters)==null?void 0:a.docs)==null?void 0:r.source}}};const F=["Playbook_InitLogin"];export{e as Playbook_InitLogin,F as __namedExportsOrder,q as default};
