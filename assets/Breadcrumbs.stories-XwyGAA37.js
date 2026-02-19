import{r as W,j as e,R as ia}from"./iframe-CbZ9RuD1.js";import{c as sa}from"./index-DSpI4bVK.js";import{c as m}from"./utils-DsKtx5Xo.js";import{r as da,q as ma,s as ra,t as la,u as ta}from"./index.esm-Bh9o6rCW.js";import{L as M}from"./link-CLCsOSg8.js";import"./preload-helper-Dp1pzeXC.js";import"./tw-merge-Ds6tgvmq.js";import"./iconBase-BDSQWw1B.js";const ha=sa("flex items-center flex-wrap gap-2 text-sm",{variants:{size:{sm:"text-xs",md:"text-sm",lg:"text-base"}},defaultVariants:{size:"md"}}),z=sa("transition-colors",{variants:{active:{true:"text-neutral-900 dark:text-neutral-100 font-medium",false:"text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-500"}}}),s=W.forwardRef(({className:a,size:o,items:l,separator:E,showHomeIcon:T=!1,maxItems:t,homeHref:n="/",...na},oa)=>{const F=E??e.jsx(ma,{className:"h-4 w-4 text-neutral-400 dark:text-neutral-600"});let c=l;if(t&&l.length>t){const r=l.slice(0,1),i=l.slice(-(t-2));c=[...r,{label:"...",href:void 0},...i]}return e.jsx("nav",{ref:oa,"aria-label":"Breadcrumb",className:m(ha({size:o}),a),...na,children:e.jsxs("ol",{className:"flex items-center flex-wrap gap-2",children:[T&&e.jsxs(e.Fragment,{children:[e.jsx("li",{children:e.jsx(M,{href:n,className:m(z({active:!1})),children:e.jsx(da,{className:"h-4 w-4","aria-label":"Home"})})}),c.length>0&&e.jsx("li",{"aria-hidden":"true",children:F})]}),c.map((r,i)=>{const d=i===c.length-1,ca=r.label==="...";return e.jsxs(W.Fragment,{children:[e.jsx("li",{children:ca?e.jsx("span",{className:"text-neutral-600 dark:text-neutral-400","aria-label":"More items",children:r.label}):r.href&&!d?e.jsxs(M,{href:r.href,className:m(z({active:!1})),children:[r.icon&&e.jsx("span",{className:"mr-1",children:r.icon}),r.label]}):e.jsxs("span",{className:m(z({active:d})),"aria-current":d?"page":void 0,children:[r.icon&&e.jsx("span",{className:"mr-1",children:r.icon}),r.label]})}),!d&&e.jsx("li",{"aria-hidden":"true",children:F})]},i)})]})})});s.displayName="Breadcrumbs";s.__docgenInfo={description:`Breadcrumbs navigation component for hierarchical navigation

@example
\`\`\`tsx
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Datasets', href: '/datasets' },
    { label: 'Dataset Details' }
  ]}
/>
\`\`\``,methods:[],displayName:"Breadcrumbs",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:""},separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},showHomeIcon:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},maxItems:{required:!1,tsType:{name:"number"},description:""},homeHref:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'/'",computed:!1}}},composes:["Omit","VariantProps"]};const Na={title:"Features/Layout/Breadcrumbs",component:s,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Size of breadcrumb text"},showHomeIcon:{control:"boolean",description:"Show home icon at start"},maxItems:{control:"number",description:"Maximum items to show before collapsing"}}},h={args:{items:[{label:"Dashboard",href:"/dashboard"},{label:"Current Page"}]}},b={args:{items:[{label:"Dashboard",href:"/dashboard"},{label:"Datasets",href:"/datasets"},{label:"Dataset Details"}]}},u={args:{items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Project Alpha",href:"/projects/alpha"},{label:"Settings"}]}},p={args:{items:[{label:"Home",href:"/"},{label:"RSEs",href:"/rse"},{label:"CERN",href:"/rse/cern"},{label:"Tape Storage",href:"/rse/cern/tape"},{label:"Configuration"}]}},f={args:{showHomeIcon:!0,items:[{label:"Datasets",href:"/datasets"},{label:"Physics",href:"/datasets/physics"},{label:"ATLAS Data"}]}},g={args:{showHomeIcon:!0,items:[{label:"DIDs",href:"/did"},{label:"List",href:"/did/list"},{label:"Physics",href:"/did/list/physics"},{label:"ATLAS",href:"/did/list/physics/atlas"},{label:"Dataset Details"}]}},x={args:{size:"sm",items:[{label:"Dashboard",href:"/dashboard"},{label:"Datasets",href:"/datasets"},{label:"Details"}]}},v={args:{size:"md",items:[{label:"Dashboard",href:"/dashboard"},{label:"Datasets",href:"/datasets"},{label:"Details"}]}},j={args:{size:"lg",items:[{label:"Dashboard",href:"/dashboard"},{label:"Datasets",href:"/datasets"},{label:"Details"}]}},D={args:{items:[{label:"Datasets",href:"/datasets",icon:e.jsx(ra,{className:"h-4 w-4"})},{label:"Physics",href:"/datasets/physics",icon:e.jsx(la,{className:"h-4 w-4"})},{label:"Data File",icon:e.jsx(ta,{className:"h-4 w-4"})}]}},N={args:{maxItems:4,items:[{label:"Home",href:"/"},{label:"Level 1",href:"/level1"},{label:"Level 2",href:"/level2"},{label:"Level 3",href:"/level3"},{label:"Level 4",href:"/level4"},{label:"Level 5",href:"/level5"},{label:"Current Page"}]}},y={args:{showHomeIcon:!0,maxItems:3,items:[{label:"Projects",href:"/projects"},{label:"Alpha",href:"/projects/alpha"},{label:"Beta",href:"/projects/beta"},{label:"Gamma",href:"/projects/gamma"},{label:"Delta",href:"/projects/delta"},{label:"Settings"}]}},L={render:()=>e.jsx("div",{className:"p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:e.jsx(s,{items:[{label:"DIDs",href:"/did/list"},{label:"user.jdoe",href:"/did/list/user.jdoe"},{label:"dataset.physics.2024",href:"/did/list/user.jdoe/dataset.physics.2024"},{label:"Details"}]})})},S={render:()=>e.jsx("div",{className:"p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:e.jsx(s,{showHomeIcon:!0,items:[{label:"RSEs",href:"/rse/list"},{label:"CERN-PROD",href:"/rse/CERN-PROD"},{label:"Configuration"}]})})},P={render:()=>e.jsx("div",{className:"p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:e.jsx(s,{items:[{label:"Rules",href:"/rule/list"},{label:"Create Rule",href:"/rule/create"},{label:"Select DIDs"}]})})},w={render:()=>e.jsx("div",{className:"p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:e.jsx(s,{maxItems:5,items:[{label:"Data",href:"/data"},{label:"2024",href:"/data/2024"},{label:"Physics",href:"/data/2024/physics"},{label:"ATLAS",href:"/data/2024/physics/atlas"},{label:"Simulation",href:"/data/2024/physics/atlas/simulation"},{label:"Run 42",href:"/data/2024/physics/atlas/simulation/run42"},{label:"Event 1337"}]})})},H={render:()=>{const[a,o]=ia.useState(["Home","Projects","Alpha"]),l=a.map((t,n)=>({label:t,href:n<a.length-1?`/${a.slice(1,n+1).join("/")}`:void 0})),E=()=>{const n=["Beta","Gamma","Delta","Epsilon"][a.length-3]||"New Level";o([...a,n])},T=()=>{a.length>2&&o(a.slice(0,-1))};return e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:e.jsx(s,{items:l})}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx("button",{onClick:E,className:"px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700",children:"Add Level"}),e.jsx("button",{onClick:T,disabled:a.length<=2,className:"px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed",children:"Remove Level"})]}),e.jsxs("div",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:["Current path: ",a.join(" / ")]})]})}},k={parameters:{backgrounds:{default:"dark"}},render:()=>e.jsx("div",{className:"dark bg-neutral-900 p-8",children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-neutral-400 mb-2",children:"Default"}),e.jsx(s,{items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Alpha"}]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-neutral-400 mb-2",children:"With Home Icon"}),e.jsx(s,{showHomeIcon:!0,items:[{label:"Datasets",href:"/datasets"},{label:"Physics",href:"/datasets/physics"},{label:"ATLAS Data"}]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-neutral-400 mb-2",children:"With Icons"}),e.jsx(s,{items:[{label:"Data",href:"/data",icon:e.jsx(ra,{className:"h-4 w-4"})},{label:"Physics",href:"/data/physics",icon:e.jsx(la,{className:"h-4 w-4"})},{label:"File.dat",icon:e.jsx(ta,{className:"h-4 w-4"})}]})]})]})})},I={render:()=>e.jsxs("div",{className:"max-w-sm p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:[e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400 mb-4",children:"Resize viewport to see how long labels handle mobile widths"}),e.jsx(s,{items:[{label:"Very Long Dashboard Name",href:"/dashboard"},{label:"Extended Datasets Collection",href:"/datasets"},{label:"Extremely Long Dataset Details Page Title"}]})]})},A={render:()=>e.jsx("div",{className:"space-y-6",children:["sm","md","lg"].map(a=>e.jsxs("div",{className:"p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400 mb-2 uppercase",children:a}),e.jsx(s,{size:a,items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Alpha"}]})]},a))})},R={args:{separator:e.jsx("span",{className:"text-neutral-400 mx-1",children:"/"}),items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Alpha"}]}},C={args:{separator:e.jsx("span",{className:"text-neutral-400 mx-1",children:"→"}),items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Alpha"}]}},B={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg",children:e.jsx(s,{items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Alpha"}],"aria-label":"Main navigation breadcrumb"})}),e.jsxs("div",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:[e.jsx("p",{children:"Accessibility features:"}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1",children:[e.jsx("li",{children:"Uses semantic <nav> and <ol> elements"}),e.jsx("li",{children:'aria-label="Breadcrumb" on nav element'}),e.jsx("li",{children:'aria-current="page" on current page'}),e.jsx("li",{children:'aria-hidden="true" on decorative separators'}),e.jsx("li",{children:"Keyboard navigable links"})]})]})]})};var V,q,O;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Dashboard',
      href: '/dashboard'
    }, {
      label: 'Current Page'
    }]
  }
}`,...(O=(q=h.parameters)==null?void 0:q.docs)==null?void 0:O.source}}};var G,_,K;b.parameters={...b.parameters,docs:{...(G=b.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(K=(_=b.parameters)==null?void 0:_.docs)==null?void 0:K.source}}};var U,$,J;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(J=($=u.parameters)==null?void 0:$.docs)==null?void 0:J.source}}};var Q,X,Y;p.parameters={...p.parameters,docs:{...(Q=p.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(Y=(X=p.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;f.parameters={...f.parameters,docs:{...(Z=f.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(ae=(ee=f.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var se,re,le;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    showHomeIcon: true,
    items: [{
      label: 'DIDs',
      href: '/did'
    }, {
      label: 'List',
      href: '/did/list'
    }, {
      label: 'Physics',
      href: '/did/list/physics'
    }, {
      label: 'ATLAS',
      href: '/did/list/physics/atlas'
    }, {
      label: 'Dataset Details'
    }]
  }
}`,...(le=(re=g.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var te,ne,oe;x.parameters={...x.parameters,docs:{...(te=x.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(oe=(ne=x.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ce,ie,de;v.parameters={...v.parameters,docs:{...(ce=v.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(de=(ie=v.parameters)==null?void 0:ie.docs)==null?void 0:de.source}}};var me,he,be;j.parameters={...j.parameters,docs:{...(me=j.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(be=(he=j.parameters)==null?void 0:he.docs)==null?void 0:be.source}}};var ue,pe,fe;D.parameters={...D.parameters,docs:{...(ue=D.parameters)==null?void 0:ue.docs,source:{originalSource:`{
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
}`,...(fe=(pe=D.parameters)==null?void 0:pe.docs)==null?void 0:fe.source}}};var ge,xe,ve;N.parameters={...N.parameters,docs:{...(ge=N.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
}`,...(ve=(xe=N.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var je,De,Ne;y.parameters={...y.parameters,docs:{...(je=y.parameters)==null?void 0:je.docs,source:{originalSource:`{
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
}`,...(Ne=(De=y.parameters)==null?void 0:De.docs)==null?void 0:Ne.source}}};var ye,Le,Se;L.parameters={...L.parameters,docs:{...(ye=L.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs items={[{
      label: 'DIDs',
      href: '/did/list'
    }, {
      label: 'user.jdoe',
      href: '/did/list/user.jdoe'
    }, {
      label: 'dataset.physics.2024',
      href: '/did/list/user.jdoe/dataset.physics.2024'
    }, {
      label: 'Details'
    }]} />
        </div>
}`,...(Se=(Le=L.parameters)==null?void 0:Le.docs)==null?void 0:Se.source}}};var Pe,we,He;S.parameters={...S.parameters,docs:{...(Pe=S.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs showHomeIcon items={[{
      label: 'RSEs',
      href: '/rse/list'
    }, {
      label: 'CERN-PROD',
      href: '/rse/CERN-PROD'
    }, {
      label: 'Configuration'
    }]} />
        </div>
}`,...(He=(we=S.parameters)==null?void 0:we.docs)==null?void 0:He.source}}};var ke,Ie,Ae;P.parameters={...P.parameters,docs:{...(ke=P.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs items={[{
      label: 'Rules',
      href: '/rule/list'
    }, {
      label: 'Create Rule',
      href: '/rule/create'
    }, {
      label: 'Select DIDs'
    }]} />
        </div>
}`,...(Ae=(Ie=P.parameters)==null?void 0:Ie.docs)==null?void 0:Ae.source}}};var Re,Ce,Be;w.parameters={...w.parameters,docs:{...(Re=w.parameters)==null?void 0:Re.docs,source:{originalSource:`{
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
}`,...(Be=(Ce=w.parameters)==null?void 0:Ce.docs)==null?void 0:Be.source}}};var Ee,Te,ze;H.parameters={...H.parameters,docs:{...(Ee=H.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
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
}`,...(ze=(Te=H.parameters)==null?void 0:Te.docs)==null?void 0:ze.source}}};var Fe,We,Me;k.parameters={...k.parameters,docs:{...(Fe=k.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
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
        </div>
}`,...(Me=(We=k.parameters)==null?void 0:We.docs)==null?void 0:Me.source}}};var Ve,qe,Oe;I.parameters={...I.parameters,docs:{...(Ve=I.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
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
}`,...(Oe=(qe=I.parameters)==null?void 0:qe.docs)==null?void 0:Oe.source}}};var Ge,_e,Ke;A.parameters={...A.parameters,docs:{...(Ge=A.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
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
}`,...(Ke=(_e=A.parameters)==null?void 0:_e.docs)==null?void 0:Ke.source}}};var Ue,$e,Je;R.parameters={...R.parameters,docs:{...(Ue=R.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
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
}`,...(Je=($e=R.parameters)==null?void 0:$e.docs)==null?void 0:Je.source}}};var Qe,Xe,Ye;C.parameters={...C.parameters,docs:{...(Qe=C.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
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
}`,...(Ye=(Xe=C.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.source}}};var Ze,ea,aa;B.parameters={...B.parameters,docs:{...(Ze=B.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
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
}`,...(aa=(ea=B.parameters)==null?void 0:ea.docs)==null?void 0:aa.source}}};const ya=["TwoLevels","ThreeLevels","FourLevels","FiveLevels","WithHomeIcon","WithHomeIconAndManyLevels","Small","Medium","Large","WithIcons","Collapsed","CollapsedWithHomeIcon","DatasetPath","RSENavigation","RuleCreation","DeepHierarchy","Interactive","DarkMode","LongLabels","AllSizes","CustomSeparator","ArrowSeparator","WithARIA"];export{A as AllSizes,C as ArrowSeparator,N as Collapsed,y as CollapsedWithHomeIcon,R as CustomSeparator,k as DarkMode,L as DatasetPath,w as DeepHierarchy,p as FiveLevels,u as FourLevels,H as Interactive,j as Large,I as LongLabels,v as Medium,S as RSENavigation,P as RuleCreation,x as Small,b as ThreeLevels,h as TwoLevels,B as WithARIA,f as WithHomeIcon,g as WithHomeIconAndManyLevels,D as WithIcons,ya as __namedExportsOrder,Na as default};
