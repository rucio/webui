import{i as e}from"./preload-helper-DID7B_--.js";import{n as t,t as n}from"./Login-CZbGutBc.js";var r,i,a,o,s,c,l,u,d;e((()=>{t(),r={title:`Demos/01_Login`,component:n},i={name:`CERN`,url:`https://login.cern.ch/adfs/oauth2/authorize`,clientId:`1234567890`,clientSecret:`1234567890`,authorizationUrl:`https://login.cern.ch/adfs/oauth2/authorize`,tokenUrl:`https://login.cern.ch/adfs/oauth2/token`,refreshTokenUrl:`https://login.cern.ch/adfs/oauth2/token`,redirectUrl:`https://login.cern.ch/adfs/oauth2/authorize`},a={name:`Indigo IAM`,url:`https://accounts.google.com/o/oauth2/v2/auth`,clientId:`1234567890`,clientSecret:`1234567890`,authorizationUrl:`https://accounts.google.com/o/oauth2/v2/auth`,tokenUrl:`https://oauth2.googleapis.com/token`,redirectUrl:`https://accounts.google.com/o/oauth2/v2/auth`},o={name:`ATLAS`,shortName:`atl`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!1,oidcProviders:[i]},s={name:`CMS`,shortName:`cms`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!1,oidcProviders:[i,a]},c={name:`LHCb`,shortName:`lhcb`,logoUrl:`https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png`,oidcEnabled:!1,oidcProviders:[i]},l={args:{loginViewModel:{status:`success`,userpassEnabled:!0,x509Enabled:!1,oidcEnabled:!1,oidcProviders:[i],multiVOEnabled:!1,voList:[o,s],isLoggedIn:!1,accountsAvailable:void 0,accountActive:void 0,rucioAuthHost:`https://rucio.cern.ch`},authViewModel:{status:`success`,message:``,rucioAccount:``,rucioMultiAccount:``,rucioAuthType:``,rucioAuthToken:``,rucioIdentity:``,rucioAuthTokenExpires:``,role:void 0}}},u={args:{loginViewModel:{status:`success`,userpassEnabled:!0,x509Enabled:!0,oidcEnabled:!1,oidcProviders:[i],multiVOEnabled:!0,voList:[o,s,c],isLoggedIn:!1,accountsAvailable:void 0,accountActive:void 0,rucioAuthHost:`https://rucio.cern.ch`},authViewModel:{status:`success`,message:``,rucioAccount:``,rucioMultiAccount:``,rucioAuthType:``,rucioAuthToken:``,rucioIdentity:``,rucioAuthTokenExpires:``,role:void 0}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d=[`ABasicLogin`,`ABasicMultiVOLogin`]}))();export{l as ABasicLogin,u as ABasicMultiVOLogin,d as __namedExportsOrder,r as default};