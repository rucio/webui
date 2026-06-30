import{i as e,l as t}from"./preload-helper-DID7B_--.js";import{Kt as n,bt as r}from"./iframe-C47sd5GD.js";import{n as i,t as a}from"./utils-BlOR3gwo.js";import{b as o,l as s,m as c,p as l,rt as u,y as d}from"./index.esm-D2i2AtEp.js";import{n as f,t as p}from"./dist-Bwk7AIxR.js";import{t as m}from"./link-DMY69hqT.js";var h,g,_,v,y,b,x=e((()=>{h=r(),g=t(n()),f(),i(),u(),_=t(m()),v=p(`flex items-center flex-wrap gap-2 text-sm`,{variants:{size:{sm:`text-xs`,md:`text-sm`,lg:`text-base`}},defaultVariants:{size:`md`}}),y=p(`transition-colors`,{variants:{active:{true:`text-neutral-900 dark:text-neutral-100 font-medium`,false:`text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-500`}}}),b=g.forwardRef(({className:e,size:t,items:n,separator:r,showHomeIcon:i=!1,maxItems:c,homeHref:l=`/`,...u},d)=>{let f=r??(0,h.jsx)(s,{className:`h-4 w-4 text-neutral-400 dark:text-neutral-600`}),p=n;if(c&&n.length>c){let e=n.slice(0,1),t=n.slice(-(c-2));p=[...e,{label:`...`,href:void 0},...t]}return(0,h.jsx)(`nav`,{ref:d,"aria-label":`Breadcrumb`,className:a(v({size:t}),e),...u,children:(0,h.jsxs)(`ol`,{className:`flex items-center flex-wrap gap-2`,children:[i&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`li`,{children:(0,h.jsx)(_.default,{href:l,className:a(y({active:!1})),children:(0,h.jsx)(o,{className:`h-4 w-4`,"aria-label":`Home`})})}),p.length>0&&(0,h.jsx)(`li`,{"aria-hidden":`true`,children:f})]}),p.map((e,t)=>{let n=t===p.length-1,r=e.label===`...`;return(0,h.jsxs)(g.Fragment,{children:[(0,h.jsx)(`li`,{children:r?(0,h.jsx)(`span`,{className:`text-neutral-600 dark:text-neutral-400`,"aria-label":`More items`,children:e.label}):e.href&&!n?(0,h.jsxs)(_.default,{href:e.href,className:a(y({active:!1})),children:[e.icon&&(0,h.jsx)(`span`,{className:`mr-1`,children:e.icon}),e.label]}):(0,h.jsxs)(`span`,{className:a(y({active:n})),"aria-current":n?`page`:void 0,children:[e.icon&&(0,h.jsx)(`span`,{className:`mr-1`,children:e.icon}),e.label]})}),!n&&(0,h.jsx)(`li`,{"aria-hidden":`true`,children:f})]},t)})]})})}),b.displayName=`Breadcrumbs`,b.__docgenInfo={description:`Breadcrumbs navigation component for hierarchical navigation

@example
\`\`\`tsx
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Datasets', href: '/datasets' },
    { label: 'Dataset Details' }
  ]}
/>
\`\`\``,methods:[],displayName:`Breadcrumbs`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`BreadcrumbItem`}],raw:`BreadcrumbItem[]`},description:``},separator:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},showHomeIcon:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},maxItems:{required:!1,tsType:{name:`number`},description:``},homeHref:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'/'`,computed:!1}}},composes:[`Omit`,`VariantProps`]}})),S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J;e((()=>{S=r(),C=t(n()),x(),u(),w={title:`Features/Layout/Breadcrumbs`,component:b,parameters:{layout:`padded`},tags:[`autodocs`],argTypes:{size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Size of breadcrumb text`},showHomeIcon:{control:`boolean`,description:`Show home icon at start`},maxItems:{control:`number`,description:`Maximum items to show before collapsing`}}},T={args:{items:[{label:`Dashboard`,href:`/dashboard`},{label:`Current Page`}]}},E={args:{items:[{label:`Dashboard`,href:`/dashboard`},{label:`Datasets`,href:`/datasets`},{label:`Dataset Details`}]}},D={args:{items:[{label:`Home`,href:`/`},{label:`Projects`,href:`/projects`},{label:`Project Alpha`,href:`/projects/alpha`},{label:`Settings`}]}},O={args:{items:[{label:`Home`,href:`/`},{label:`RSEs`,href:`/rse`},{label:`CERN`,href:`/rse/cern`},{label:`Tape Storage`,href:`/rse/cern/tape`},{label:`Configuration`}]}},k={args:{showHomeIcon:!0,items:[{label:`Datasets`,href:`/datasets`},{label:`Physics`,href:`/datasets/physics`},{label:`ATLAS Data`}]}},A={args:{showHomeIcon:!0,items:[{label:`DIDs`,href:`/did`},{label:`List`,href:`/dids`},{label:`Physics`,href:`/dids/physics`},{label:`ATLAS`,href:`/dids/physics/atlas`},{label:`Dataset Details`}]}},j={args:{size:`sm`,items:[{label:`Dashboard`,href:`/dashboard`},{label:`Datasets`,href:`/datasets`},{label:`Details`}]}},M={args:{size:`md`,items:[{label:`Dashboard`,href:`/dashboard`},{label:`Datasets`,href:`/datasets`},{label:`Details`}]}},N={args:{size:`lg`,items:[{label:`Dashboard`,href:`/dashboard`},{label:`Datasets`,href:`/datasets`},{label:`Details`}]}},P={args:{items:[{label:`Datasets`,href:`/datasets`,icon:(0,S.jsx)(l,{className:`h-4 w-4`})},{label:`Physics`,href:`/datasets/physics`,icon:(0,S.jsx)(d,{className:`h-4 w-4`})},{label:`Data File`,icon:(0,S.jsx)(c,{className:`h-4 w-4`})}]}},F={args:{maxItems:4,items:[{label:`Home`,href:`/`},{label:`Level 1`,href:`/level1`},{label:`Level 2`,href:`/level2`},{label:`Level 3`,href:`/level3`},{label:`Level 4`,href:`/level4`},{label:`Level 5`,href:`/level5`},{label:`Current Page`}]}},I={args:{showHomeIcon:!0,maxItems:3,items:[{label:`Projects`,href:`/projects`},{label:`Alpha`,href:`/projects/alpha`},{label:`Beta`,href:`/projects/beta`},{label:`Gamma`,href:`/projects/gamma`},{label:`Delta`,href:`/projects/delta`},{label:`Settings`}]}},L={render:()=>(0,S.jsx)(`div`,{className:`p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:(0,S.jsx)(b,{items:[{label:`DIDs`,href:`/dids`},{label:`user.jdoe`,href:`/dids/user.jdoe`},{label:`dataset.physics.2024`,href:`/dids/user.jdoe/dataset.physics.2024`},{label:`Details`}]})})},R={render:()=>(0,S.jsx)(`div`,{className:`p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:(0,S.jsx)(b,{showHomeIcon:!0,items:[{label:`RSEs`,href:`/rses`},{label:`CERN-PROD`,href:`/rse/CERN-PROD`},{label:`Configuration`}]})})},z={render:()=>(0,S.jsx)(`div`,{className:`p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:(0,S.jsx)(b,{items:[{label:`Rules`,href:`/rules`},{label:`Create Rule`,href:`/rule/create`},{label:`Select DIDs`}]})})},B={render:()=>(0,S.jsx)(`div`,{className:`p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:(0,S.jsx)(b,{maxItems:5,items:[{label:`Data`,href:`/data`},{label:`2024`,href:`/data/2024`},{label:`Physics`,href:`/data/2024/physics`},{label:`ATLAS`,href:`/data/2024/physics/atlas`},{label:`Simulation`,href:`/data/2024/physics/atlas/simulation`},{label:`Run 42`,href:`/data/2024/physics/atlas/simulation/run42`},{label:`Event 1337`}]})})},V={render:()=>{let[e,t]=C.useState([`Home`,`Projects`,`Alpha`]),n=e.map((t,n)=>({label:t,href:n<e.length-1?`/${e.slice(1,n+1).join(`/`)}`:void 0}));return(0,S.jsxs)(`div`,{className:`space-y-6`,children:[(0,S.jsx)(`div`,{className:`p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:(0,S.jsx)(b,{items:n})}),(0,S.jsxs)(`div`,{className:`flex gap-4`,children:[(0,S.jsx)(`button`,{onClick:()=>{let n=[`Beta`,`Gamma`,`Delta`,`Epsilon`][e.length-3]||`New Level`;t([...e,n])},className:`px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700`,children:`Add Level`}),(0,S.jsx)(`button`,{onClick:()=>{e.length>2&&t(e.slice(0,-1))},disabled:e.length<=2,className:`px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed`,children:`Remove Level`})]}),(0,S.jsxs)(`div`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[`Current path: `,e.join(` / `)]})]})}},H={render:()=>(0,S.jsx)(`div`,{className:`dark bg-neutral-900 p-8`,children:(0,S.jsxs)(`div`,{className:`space-y-6`,children:[(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`p`,{className:`text-sm text-neutral-400 mb-2`,children:`Default`}),(0,S.jsx)(b,{items:[{label:`Home`,href:`/`},{label:`Projects`,href:`/projects`},{label:`Alpha`}]})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`p`,{className:`text-sm text-neutral-400 mb-2`,children:`With Home Icon`}),(0,S.jsx)(b,{showHomeIcon:!0,items:[{label:`Datasets`,href:`/datasets`},{label:`Physics`,href:`/datasets/physics`},{label:`ATLAS Data`}]})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`p`,{className:`text-sm text-neutral-400 mb-2`,children:`With Icons`}),(0,S.jsx)(b,{items:[{label:`Data`,href:`/data`,icon:(0,S.jsx)(l,{className:`h-4 w-4`})},{label:`Physics`,href:`/data/physics`,icon:(0,S.jsx)(d,{className:`h-4 w-4`})},{label:`File.dat`,icon:(0,S.jsx)(c,{className:`h-4 w-4`})}]})]})]})}),globals:{backgrounds:{value:`dark`}}},U={render:()=>(0,S.jsxs)(`div`,{className:`max-w-sm p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:[(0,S.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400 mb-4`,children:`Resize viewport to see how long labels handle mobile widths`}),(0,S.jsx)(b,{items:[{label:`Very Long Dashboard Name`,href:`/dashboard`},{label:`Extended Datasets Collection`,href:`/datasets`},{label:`Extremely Long Dataset Details Page Title`}]})]})},W={render:()=>(0,S.jsx)(`div`,{className:`space-y-6`,children:[`sm`,`md`,`lg`].map(e=>(0,S.jsxs)(`div`,{className:`p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:[(0,S.jsx)(`p`,{className:`text-xs text-neutral-600 dark:text-neutral-400 mb-2 uppercase`,children:e}),(0,S.jsx)(b,{size:e,items:[{label:`Home`,href:`/`},{label:`Projects`,href:`/projects`},{label:`Alpha`}]})]},e))})},G={args:{separator:(0,S.jsx)(`span`,{className:`text-neutral-400 mx-1`,children:`/`}),items:[{label:`Home`,href:`/`},{label:`Projects`,href:`/projects`},{label:`Alpha`}]}},K={args:{separator:(0,S.jsx)(`span`,{className:`text-neutral-400 mx-1`,children:`→`}),items:[{label:`Home`,href:`/`},{label:`Projects`,href:`/projects`},{label:`Alpha`}]}},q={render:()=>(0,S.jsxs)(`div`,{className:`space-y-4`,children:[(0,S.jsx)(`div`,{className:`p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg`,children:(0,S.jsx)(b,{items:[{label:`Home`,href:`/`},{label:`Projects`,href:`/projects`},{label:`Alpha`}],"aria-label":`Main navigation breadcrumb`})}),(0,S.jsxs)(`div`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:[(0,S.jsx)(`p`,{children:`Accessibility features:`}),(0,S.jsxs)(`ul`,{className:`list-disc ml-6 mt-2 space-y-1`,children:[(0,S.jsx)(`li`,{children:`Uses semantic <nav> and <ol> elements`}),(0,S.jsx)(`li`,{children:`aria-label="Breadcrumb" on nav element`}),(0,S.jsx)(`li`,{children:`aria-current="page" on current page`}),(0,S.jsx)(`li`,{children:`aria-hidden="true" on decorative separators`}),(0,S.jsx)(`li`,{children:`Keyboard navigable links`})]})]})]})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Dashboard',
      href: '/dashboard'
    }, {
      label: 'Current Page'
    }]
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Dashboard',
      href: '/dashboard'
    }, {
      label: 'Datasets',
      href: '/datasets'
    }, {
      label: 'Dataset Details'
    }]
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Projects',
      href: '/projects'
    }, {
      label: 'Project Alpha',
      href: '/projects/alpha'
    }, {
      label: 'Settings'
    }]
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'RSEs',
      href: '/rse'
    }, {
      label: 'CERN',
      href: '/rse/cern'
    }, {
      label: 'Tape Storage',
      href: '/rse/cern/tape'
    }, {
      label: 'Configuration'
    }]
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    showHomeIcon: true,
    items: [{
      label: 'Datasets',
      href: '/datasets'
    }, {
      label: 'Physics',
      href: '/datasets/physics'
    }, {
      label: 'ATLAS Data'
    }]
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    showHomeIcon: true,
    items: [{
      label: 'DIDs',
      href: '/did'
    }, {
      label: 'List',
      href: '/dids'
    }, {
      label: 'Physics',
      href: '/dids/physics'
    }, {
      label: 'ATLAS',
      href: '/dids/physics/atlas'
    }, {
      label: 'Dataset Details'
    }]
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    items: [{
      label: 'Dashboard',
      href: '/dashboard'
    }, {
      label: 'Datasets',
      href: '/datasets'
    }, {
      label: 'Details'
    }]
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md',
    items: [{
      label: 'Dashboard',
      href: '/dashboard'
    }, {
      label: 'Datasets',
      href: '/datasets'
    }, {
      label: 'Details'
    }]
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    items: [{
      label: 'Dashboard',
      href: '/dashboard'
    }, {
      label: 'Datasets',
      href: '/datasets'
    }, {
      label: 'Details'
    }]
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Datasets',
      href: '/datasets',
      icon: <HiDatabase className="h-4 w-4" />
    }, {
      label: 'Physics',
      href: '/datasets/physics',
      icon: <HiFolder className="h-4 w-4" />
    }, {
      label: 'Data File',
      icon: <HiDocument className="h-4 w-4" />
    }]
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    maxItems: 4,
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Level 1',
      href: '/level1'
    }, {
      label: 'Level 2',
      href: '/level2'
    }, {
      label: 'Level 3',
      href: '/level3'
    }, {
      label: 'Level 4',
      href: '/level4'
    }, {
      label: 'Level 5',
      href: '/level5'
    }, {
      label: 'Current Page'
    }]
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    showHomeIcon: true,
    maxItems: 3,
    items: [{
      label: 'Projects',
      href: '/projects'
    }, {
      label: 'Alpha',
      href: '/projects/alpha'
    }, {
      label: 'Beta',
      href: '/projects/beta'
    }, {
      label: 'Gamma',
      href: '/projects/gamma'
    }, {
      label: 'Delta',
      href: '/projects/delta'
    }, {
      label: 'Settings'
    }]
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs items={[{
      label: 'DIDs',
      href: '/dids'
    }, {
      label: 'user.jdoe',
      href: '/dids/user.jdoe'
    }, {
      label: 'dataset.physics.2024',
      href: '/dids/user.jdoe/dataset.physics.2024'
    }, {
      label: 'Details'
    }]} />
        </div>
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs showHomeIcon items={[{
      label: 'RSEs',
      href: '/rses'
    }, {
      label: 'CERN-PROD',
      href: '/rse/CERN-PROD'
    }, {
      label: 'Configuration'
    }]} />
        </div>
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs items={[{
      label: 'Rules',
      href: '/rules'
    }, {
      label: 'Create Rule',
      href: '/rule/create'
    }, {
      label: 'Select DIDs'
    }]} />
        </div>
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs maxItems={5} items={[{
      label: 'Data',
      href: '/data'
    }, {
      label: '2024',
      href: '/data/2024'
    }, {
      label: 'Physics',
      href: '/data/2024/physics'
    }, {
      label: 'ATLAS',
      href: '/data/2024/physics/atlas'
    }, {
      label: 'Simulation',
      href: '/data/2024/physics/atlas/simulation'
    }, {
      label: 'Run 42',
      href: '/data/2024/physics/atlas/simulation/run42'
    }, {
      label: 'Event 1337'
    }]} />
        </div>
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPath, setCurrentPath] = React.useState(['Home', 'Projects', 'Alpha']);
    const items = currentPath.map((label, index) => ({
      label,
      href: index < currentPath.length - 1 ? \`/\${currentPath.slice(1, index + 1).join('/')}\` : undefined
    }));
    const addLevel = () => {
      const newLevels = ['Beta', 'Gamma', 'Delta', 'Epsilon'];
      const nextLevel = newLevels[currentPath.length - 3] || 'New Level';
      setCurrentPath([...currentPath, nextLevel]);
    };
    const removeLevel = () => {
      if (currentPath.length > 2) {
        setCurrentPath(currentPath.slice(0, -1));
      }
    };
    return <div className="space-y-6">
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <Breadcrumbs items={items} />
                </div>

                <div className="flex gap-4">
                    <button onClick={addLevel} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">
                        Add Level
                    </button>
                    <button onClick={removeLevel} disabled={currentPath.length <= 2} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        Remove Level
                    </button>
                </div>

                <div className="text-sm text-neutral-600 dark:text-neutral-400">Current path: {currentPath.join(' / ')}</div>
            </div>;
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <div className="dark bg-neutral-900 p-8">
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-neutral-400 mb-2">Default</p>
                    <Breadcrumbs items={[{
          label: 'Home',
          href: '/'
        }, {
          label: 'Projects',
          href: '/projects'
        }, {
          label: 'Alpha'
        }]} />
                </div>

                <div>
                    <p className="text-sm text-neutral-400 mb-2">With Home Icon</p>
                    <Breadcrumbs showHomeIcon items={[{
          label: 'Datasets',
          href: '/datasets'
        }, {
          label: 'Physics',
          href: '/datasets/physics'
        }, {
          label: 'ATLAS Data'
        }]} />
                </div>

                <div>
                    <p className="text-sm text-neutral-400 mb-2">With Icons</p>
                    <Breadcrumbs items={[{
          label: 'Data',
          href: '/data',
          icon: <HiDatabase className="h-4 w-4" />
        }, {
          label: 'Physics',
          href: '/data/physics',
          icon: <HiFolder className="h-4 w-4" />
        }, {
          label: 'File.dat',
          icon: <HiDocument className="h-4 w-4" />
        }]} />
                </div>
            </div>
        </div>,
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Resize viewport to see how long labels handle mobile widths</p>
            <Breadcrumbs items={[{
      label: 'Very Long Dashboard Name',
      href: '/dashboard'
    }, {
      label: 'Extended Datasets Collection',
      href: '/datasets'
    }, {
      label: 'Extremely Long Dataset Details Page Title'
    }]} />
        </div>
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
            {(['sm', 'md', 'lg'] as const).map(size => <div key={size} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 uppercase">{size}</p>
                    <Breadcrumbs size={size} items={[{
        label: 'Home',
        href: '/'
      }, {
        label: 'Projects',
        href: '/projects'
      }, {
        label: 'Alpha'
      }]} />
                </div>)}
        </div>
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    separator: <span className="text-neutral-400 mx-1">/</span>,
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Projects',
      href: '/projects'
    }, {
      label: 'Alpha'
    }]
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    separator: <span className="text-neutral-400 mx-1">→</span>,
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Projects',
      href: '/projects'
    }, {
      label: 'Alpha'
    }]
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <Breadcrumbs items={[{
        label: 'Home',
        href: '/'
      }, {
        label: 'Projects',
        href: '/projects'
      }, {
        label: 'Alpha'
      }]} aria-label="Main navigation breadcrumb" />
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p>Accessibility features:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Uses semantic &lt;nav&gt; and &lt;ol&gt; elements</li>
                    <li>aria-label="Breadcrumb" on nav element</li>
                    <li>aria-current="page" on current page</li>
                    <li>aria-hidden="true" on decorative separators</li>
                    <li>Keyboard navigable links</li>
                </ul>
            </div>
        </div>
}`,...q.parameters?.docs?.source}}},J=[`TwoLevels`,`ThreeLevels`,`FourLevels`,`FiveLevels`,`WithHomeIcon`,`WithHomeIconAndManyLevels`,`Small`,`Medium`,`Large`,`WithIcons`,`Collapsed`,`CollapsedWithHomeIcon`,`DatasetPath`,`RSENavigation`,`RuleCreation`,`DeepHierarchy`,`Interactive`,`DarkMode`,`LongLabels`,`AllSizes`,`CustomSeparator`,`ArrowSeparator`,`WithARIA`]}))();export{W as AllSizes,K as ArrowSeparator,F as Collapsed,I as CollapsedWithHomeIcon,G as CustomSeparator,H as DarkMode,L as DatasetPath,B as DeepHierarchy,O as FiveLevels,D as FourLevels,V as Interactive,N as Large,U as LongLabels,M as Medium,R as RSENavigation,z as RuleCreation,j as Small,E as ThreeLevels,T as TwoLevels,q as WithARIA,k as WithHomeIcon,A as WithHomeIconAndManyLevels,P as WithIcons,J as __namedExportsOrder,w as default};