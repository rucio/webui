import{i as e}from"./preload-helper-DID7B_--.js";import{n as t,t as n}from"./Login-zAe5HyEU.js";var r,i,a,o,s,c,l,u,d;e((()=>{t(),r={title:`Demos/01_Login`,component:n},i={name:`CERN`,url:`https://login.cern.ch/adfs/oauth2/authorize`,clientId:`1234567890`,clientSecret:`1234567890`,authorizationUrl:`https://login.cern.ch/adfs/oauth2/authorize`,tokenUrl:`https://login.cern.ch/adfs/oauth2/token`,refreshTokenUrl:`https://login.cern.ch/adfs/oauth2/token`,redirectUrl:`https://login.cern.ch/adfs/oauth2/authorize`},a={name:`Indigo IAM`,url:`https://accounts.google.com/o/oauth2/v2/auth`,iconUrl:`/experiment-logo.png`,clientId:`1234567890`,clientSecret:`1234567890`,authorizationUrl:`https://accounts.google.com/o/oauth2/v2/auth`,tokenUrl:`https://oauth2.googleapis.com/token`,redirectUrl:`https://accounts.google.com/o/oauth2/v2/auth`},o={name:`ATLAS`,shortName:`atl`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!0,oidcProviders:[i]},s={name:`CMS`,shortName:`cms`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!0,oidcProviders:[i,a]},c={name:`LHCb`,shortName:`lhcb`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!0,oidcProviders:[i]},l={args:{loginViewModel:{status:`success`,userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!0,oidcProviders:[i],multiVOEnabled:!0,voList:[o,s,c],isLoggedIn:!1,accountActive:void 0,accountsAvailable:void 0,rucioAuthHost:`https://rucio.cern.ch`},authViewModel:{status:`success`,message:``,rucioAccount:``,rucioMultiAccount:``,rucioAuthType:``,rucioAuthToken:``,rucioIdentity:``,rucioAuthTokenExpires:``,role:void 0}},play:async({container:e})=>{o.oidcEnabled=!0,s.oidcEnabled=!0,c.oidcEnabled=!0}},u={args:{loginViewModel:{status:`success`,userpassEnabled:!1,x509Enabled:!1,oidcEnabled:!0,oidcProviders:[i,a],multiVOEnabled:!1,voList:[s],isLoggedIn:!1,accountActive:void 0,accountsAvailable:void 0,rucioAuthHost:`https://rucio.cern.ch`},authViewModel:{status:`success`,message:``,rucioAccount:``,rucioMultiAccount:``,rucioAuthType:``,rucioAuthToken:``,rucioIdentity:``,rucioAuthTokenExpires:``,role:void 0}}},d=[`AMultiVOOIDCEnabledLogin`,`BOIDCOnlyLogin`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    loginViewModel: {
      status: 'success',
      userpassEnabled: false,
      x509Enabled: false,
      oidcEnabled: true,
      oidcProviders: [cernOIDCProvider, IndigoIAMProvider],
      multiVOEnabled: false,
      voList: [voCMS],
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
  }
}`,...u.parameters?.docs?.source},description:{story:`A deployment that authenticates purely through OIDC: userpass and x509 are both
off, so the only login options are the configured providers. Indigo IAM renders
its configured iconUrl, CERN falls back to the default icon.`,...u.parameters?.docs?.description}}}}))();export{l as AMultiVOOIDCEnabledLogin,u as BOIDCOnlyLogin,d as __namedExportsOrder,r as default};