import{i as e}from"./preload-helper-DID7B_--.js";import{n as t,r as n}from"./utils-BlOR3gwo.js";import{n as r,t as i}from"./Login-CZbGutBc.js";var a,o,s,c,l,u,d,f;e((()=>{r(),t(),{within:a,userEvent:o}=__STORYBOOK_MODULE_TEST__,s={title:`Demos/01_Login`,component:i},c={name:`CERN`,url:`https://login.cern.ch/adfs/oauth2/authorize`,clientId:`1234567890`,clientSecret:`1234567890`,authorizationUrl:`https://login.cern.ch/adfs/oauth2/authorize`,tokenUrl:`https://login.cern.ch/adfs/oauth2/token`,refreshTokenUrl:`https://login.cern.ch/adfs/oauth2/token`,redirectUrl:`https://login.cern.ch/adfs/oauth2/authorize`},l={name:`ATLAS`,shortName:`atl`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!0,oidcProviders:[c]},u={name:`CMS`,shortName:`cms`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!0,oidcProviders:[c]},d={args:{loginViewModel:{status:`success`,userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[c],multiVOEnabled:!0,voList:[l,u],accountsAvailable:void 0,accountActive:void 0,isLoggedIn:!1,rucioAuthHost:`https://rucio.cern.ch`},authViewModel:{status:`multiple_accounts`,message:`mayank,ddmadmin,tester`,rucioAccount:``,rucioMultiAccount:``,rucioAuthType:``,rucioAuthToken:``,rucioIdentity:``,rucioAuthTokenExpires:``,role:void 0}},play:async({canvasElement:e})=>{let t=a(e).getByRole(`button`,{name:/undefined/});await n(2e3),await o.click(t)}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f=[`Playbook_Multi_Account`]}))();export{d as Playbook_Multi_Account,f as __namedExportsOrder,s as default};