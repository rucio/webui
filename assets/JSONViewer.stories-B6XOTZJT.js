import{j as e}from"./iframe-CbZ9RuD1.js";import{J as t}from"./JSONViewer-DaA7J4vW.js";import"./preload-helper-Dp1pzeXC.js";import"./github-DHfBN4si.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";import"./index.esm-CDVKQKGR.js";import"./index--6AZhPao.js";import"./index-YEY9OEgd.js";import"./index-BVAf5DAB.js";import"./index-_REj2qAT.js";import"./index-Dwd-kS-d.js";import"./Combination-C2wgG2I7.js";import"./index-CI9TgWTM.js";import"./useToast-YXabfrDf.js";import"./tw-merge-Ds6tgvmq.js";import"./XMarkIcon-Co96hGar.js";const Ut={title:"Features/JSON/JSONViewer",component:t,parameters:{layout:"centered"},tags:["autodocs"],decorators:[a=>e.jsx("div",{className:"w-[800px]",children:e.jsx(a,{})})]},St=JSON.stringify({name:"John Doe",age:30,active:!0}),r=JSON.stringify({user:{id:12345,name:"John Doe",email:"john@example.com",preferences:{theme:"dark",notifications:!0,language:"en"}},metadata:{created:"2024-01-15T10:30:00Z",updated:"2024-01-20T14:45:00Z"}}),bt=JSON.stringify({scope:["data15_13TeV","data15_14TeV"],account:["root"],datatype:"AOD",excluded_pattern:"calibration",asynchronous:!1}),o=JSON.stringify([{copies:1,rse_expression:"tier=1&disk=1",weight:null,lifetime:604800,locked:!1,subscription_id:"f47ac10b-58cc-4372-a567-0e02b2c3d479",source_replica_expression:null,activity:"User Subscriptions",notify:"N"},{copies:2,rse_expression:"cloud=US",weight:null,lifetime:null,locked:!0,subscription_id:"a67bc20c-69dd-5483-b678-1f13c3d4e580",source_replica_expression:"tier=0",activity:"Data Brokering",notify:"Y"}]),ft=JSON.stringify(["apple","banana","cherry","date","elderberry"]),E=JSON.stringify({dataset:{name:"data15_13TeV.00276262.physics_Main.merge.AOD.r7562_p2521",scope:"data15_13TeV",type:"DATASET",bytes:3487234987,length:1543,did_type:"DATASET",is_open:!1,monotonic:!1,obsolete:!1,hidden:!1,suppressed:!1,purge_replicas:!0,metadata:{project:"data15_13TeV",run_number:276262,stream_name:"physics_Main",prod_step:"merge",datatype:"AOD",provenance:"merge"},rules:[{id:"rule1",rse:"CERN-PROD_DATADISK",state:"OK",copies:1},{id:"rule2",rse:"LBNL_ATLAS_DATADISK",state:"REPLICATING",copies:2},{id:"rule3",rse:"TOKYO-LCG2_DATADISK",state:"OK",copies:1}]}}),Nt="{ invalid json, missing quotes: true }",i={args:{value:St,showCopyButton:!0,showRawToggle:!0}},l={args:{value:r,showCopyButton:!0,showRawToggle:!0}},c={args:{value:ft,showCopyButton:!0,showRawToggle:!0}},u={args:{value:Nt,showCopyButton:!0,showRawToggle:!0}},p={args:{value:JSON.stringify({}),showCopyButton:!0,showRawToggle:!0}},d={args:{value:JSON.stringify([]),showCopyButton:!0,showRawToggle:!0}},m={args:{value:r,showCopyButton:!1,showRawToggle:!0}},g={args:{value:r,showCopyButton:!0,showRawToggle:!1}},h={args:{value:r,showCopyButton:!1,showRawToggle:!1}},w={args:{value:E,showCopyButton:!0,showRawToggle:!0,maxHeight:"300px"}},x={args:{value:bt,showCopyButton:!0,showRawToggle:!0},parameters:{docs:{description:{story:"Example of a subscription filter JSON used in Rucio subscriptions."}}}},v={args:{value:o,showCopyButton:!0,showRawToggle:!0},parameters:{docs:{description:{story:"Example of replication rules JSON used in Rucio subscriptions."}}}},y={args:{value:E,showCopyButton:!0,showRawToggle:!0,maxHeight:"500px"},parameters:{docs:{description:{story:"Example of DID metadata with scrollable content."}}}},S={args:{value:r,showCopyButton:!0,showRawToggle:!0},parameters:{backgrounds:{default:"dark"}},decorators:[a=>e.jsx("div",{className:"dark p-8 rounded-lg bg-neutral-900 w-[800px]",children:e.jsx(a,{})})]},b={args:{value:JSON.stringify({longString:"This is a very long string that should wrap properly within the JSON viewer component without breaking the layout or causing horizontal scroll issues when the content is too wide for the container",anotherProperty:"normal value"}),showCopyButton:!0,showRawToggle:!0}},f={args:{value:JSON.stringify({unicode:"你好世界",emoji:"🚀 🎉 ⚡",quotes:'She said "Hello"',backslash:"C:\\Users\\Documents",newlines:`Line 1
Line 2
Line 3`,tabs:"Column1	Column2	Column3"}),showCopyButton:!0,showRawToggle:!0}},N={args:{value:JSON.stringify({trueValue:!0,falseValue:!1,nullValue:null,undefinedBehavior:void 0,zeroValue:0,emptyString:""}),showCopyButton:!0,showRawToggle:!0}},C={args:{value:JSON.stringify({string:"text",number:42,float:3.14159,boolean:!0,null:null,array:[1,2,3],object:{nested:"value"},largeNumber:9007199254740991,negativeNumber:-273.15,scientificNotation:6022e20}),showCopyButton:!0,showRawToggle:!0}},O={render:()=>e.jsxs("div",{className:"space-y-6 w-[800px]",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"All Features Enabled"}),e.jsx(t,{value:r,showCopyButton:!0,showRawToggle:!0})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Copy Only"}),e.jsx(t,{value:r,showCopyButton:!0,showRawToggle:!1})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Toggle Only"}),e.jsx(t,{value:r,showCopyButton:!1,showRawToggle:!0})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Minimal (No Controls)"}),e.jsx(t,{value:r,showCopyButton:!1,showRawToggle:!1})]})]})},Ct=JSON.stringify({level1:{level2:{level3:{level4:{level5:{deepValue:"You found me!",moreData:[1,2,3,4,5]},anotherBranch:{data:"Additional content"}}}}},topLevel:"Easy to see"}),Ot=JSON.stringify(Array.from({length:50},(a,s)=>({id:`item-${s}`,name:`Item ${s}`,status:s%3===0?"active":s%3===1?"pending":"inactive",metadata:{created:new Date(2024,0,s+1).toISOString(),score:Math.random()*100}}))),n=JSON.stringify({subscription:{id:"f47ac10b-58cc-4372-a567-0e02b2c3d479",account:"root",name:"data15_13TeV_subscription",filter:{scope:["data15_13TeV","data15_14TeV","data16_13TeV"],account:["root","dataprep"],datatype:"AOD",excluded_pattern:"calibration.*",project:["data15_13TeV"],asynchronous:!1,split_rule:!0},replication_rules:[{copies:1,rse_expression:"tier=1&disk=1",weight:null,lifetime:604800,locked:!1,subscription_id:"f47ac10b-58cc-4372-a567-0e02b2c3d479",source_replica_expression:null,activity:"User Subscriptions",notify:"N",comments:"Primary copy for T1 sites",grouping:"DATASET",purge_replicas:!1},{copies:2,rse_expression:"cloud=US&type=DATADISK",weight:null,lifetime:null,locked:!0,subscription_id:"f47ac10b-58cc-4372-a567-0e02b2c3d479",source_replica_expression:"tier=0",activity:"Data Brokering",notify:"Y",comments:"US cloud distribution",grouping:"ALL",purge_replicas:!0},{copies:1,rse_expression:"cloud=CERN&tape=1",weight:10,lifetime:null,locked:!0,subscription_id:"f47ac10b-58cc-4372-a567-0e02b2c3d479",source_replica_expression:null,activity:"Data Consolidation",notify:"N",comments:"Long-term tape storage",grouping:"DATASET",purge_replicas:!1}],state:"ACTIVE",created_at:"2024-01-15T10:30:00Z",updated_at:"2024-01-20T14:45:00Z",lifetime:null,comments:"Automatic subscription for data15 datasets",retroactive:!1,priority:3}}),T={args:{value:o,mode:"interactive",expandDepth:2,showCopyButton:!0},parameters:{docs:{description:{story:"Explicitly using interactive mode with expandable tree structure. Click on chevrons to expand/collapse nested objects."}}}},B={args:{value:Ct,mode:"interactive",expandDepth:3,showCopyButton:!0},parameters:{docs:{description:{story:"Interactive mode with deeply nested objects (5 levels). Initial expand depth is 3 levels."}}}},J={args:{value:Ot,mode:"interactive",expandDepth:1,showCopyButton:!0,maxHeight:"400px"},parameters:{docs:{description:{story:"Interactive mode with large array (50 items). Scrollable content with expand/collapse for each item."}}}},D={args:{value:n,mode:"interactive",expandDepth:2,showCopyButton:!0,maxHeight:"500px"},parameters:{docs:{description:{story:"Real-world example: Complex subscription with filter and multiple replication rules."}}}},R={args:{value:St,mode:"auto",showCopyButton:!0},parameters:{docs:{description:{story:"Auto mode detects simple JSON and uses static syntax highlighting view."}}}},j={args:{value:o,mode:"auto",showCopyButton:!0},parameters:{docs:{description:{story:"Auto mode detects complex JSON (array with 2+ items) and uses interactive tree view."}}}},A={args:{value:bt,mode:"auto",showCopyButton:!0},parameters:{docs:{description:{story:"Auto mode with subscription filter - likely uses static view due to flat structure."}}}},_={args:{value:E,mode:"auto",showCopyButton:!0,maxHeight:"400px"},parameters:{docs:{description:{story:"Auto mode with nested DID metadata - uses interactive view due to depth and complexity."}}}},k={args:{value:n,mode:"interactive",expandDepth:2,showCopyButton:!0,maxHeight:"500px"},parameters:{backgrounds:{default:"dark"}},decorators:[a=>e.jsx("div",{className:"dark p-8 rounded-lg bg-neutral-900 w-[800px]",children:e.jsx(a,{})})]},V={render:()=>e.jsxs("div",{className:"space-y-6 w-[800px]",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Static Mode (Syntax Highlighting)"}),e.jsx(t,{value:o,mode:"static",showCopyButton:!0,showRawToggle:!0})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Interactive Mode (Expandable Tree)"}),e.jsx(t,{value:o,mode:"interactive",expandDepth:2,showCopyButton:!0})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Auto Mode (Detects Best View)"}),e.jsx(t,{value:o,mode:"auto",showCopyButton:!0})]})]}),parameters:{docs:{description:{story:"Side-by-side comparison of static, interactive, and auto modes with the same JSON data."}}}},I={render:()=>e.jsxs("div",{className:"space-y-6 w-[800px]",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Expand Depth: 1"}),e.jsx(t,{value:n,mode:"interactive",expandDepth:1,showCopyButton:!0,maxHeight:"300px"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Expand Depth: 2"}),e.jsx(t,{value:n,mode:"interactive",expandDepth:2,showCopyButton:!0,maxHeight:"300px"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100",children:"Expand Depth: 3"}),e.jsx(t,{value:n,mode:"interactive",expandDepth:3,showCopyButton:!0,maxHeight:"300px"})]})]}),parameters:{docs:{description:{story:"Demonstrates different initial expand depths for interactive tree view."}}}};var M,H,L;i.parameters={...i.parameters,docs:{...(M=i.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: simpleJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(L=(H=i.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var F,K,U;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(U=(K=l.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var W,P,z;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    value: arrayJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(z=(P=c.parameters)==null?void 0:P.docs)==null?void 0:z.source}}};var Y,Z,q;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    value: invalidJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(q=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:q.source}}};var G,$,Q;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({}),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(Q=($=p.parameters)==null?void 0:$.docs)==null?void 0:Q.source}}};var X,ee,te;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify([]),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(te=(ee=d.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var re,ae,oe;m.parameters={...m.parameters,docs:{...(re=m.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: false,
    showRawToggle: true
  }
}`,...(oe=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var se,ne,ie;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: true,
    showRawToggle: false
  }
}`,...(ie=(ne=g.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var le,ce,ue;h.parameters={...h.parameters,docs:{...(le=h.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: false,
    showRawToggle: false
  }
}`,...(ue=(ce=h.parameters)==null?void 0:ce.docs)==null?void 0:ue.source}}};var pe,de,me;w.parameters={...w.parameters,docs:{...(pe=w.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    value: largeJSON,
    showCopyButton: true,
    showRawToggle: true,
    maxHeight: '300px'
  }
}`,...(me=(de=w.parameters)==null?void 0:de.docs)==null?void 0:me.source}}};var ge,he,we;x.parameters={...x.parameters,docs:{...(ge=x.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    value: subscriptionFilter,
    showCopyButton: true,
    showRawToggle: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a subscription filter JSON used in Rucio subscriptions.'
      }
    }
  }
}`,...(we=(he=x.parameters)==null?void 0:he.docs)==null?void 0:we.source}}};var xe,ve,ye;v.parameters={...v.parameters,docs:{...(xe=v.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    value: replicationRules,
    showCopyButton: true,
    showRawToggle: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of replication rules JSON used in Rucio subscriptions.'
      }
    }
  }
}`,...(ye=(ve=v.parameters)==null?void 0:ve.docs)==null?void 0:ye.source}}};var Se,be,fe;y.parameters={...y.parameters,docs:{...(Se=y.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    value: largeJSON,
    showCopyButton: true,
    showRawToggle: true,
    maxHeight: '500px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of DID metadata with scrollable content.'
      }
    }
  }
}`,...(fe=(be=y.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};var Ne,Ce,Oe;S.parameters={...S.parameters,docs:{...(Ne=S.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: true,
    showRawToggle: true
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark p-8 rounded-lg bg-neutral-900 w-[800px]">
                <Story />
            </div>]
}`,...(Oe=(Ce=S.parameters)==null?void 0:Ce.docs)==null?void 0:Oe.source}}};var Te,Be,Je;b.parameters={...b.parameters,docs:{...(Te=b.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({
      longString: 'This is a very long string that should wrap properly within the JSON viewer component without breaking the layout or causing horizontal scroll issues when the content is too wide for the container',
      anotherProperty: 'normal value'
    }),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(Je=(Be=b.parameters)==null?void 0:Be.docs)==null?void 0:Je.source}}};var De,Re,je;f.parameters={...f.parameters,docs:{...(De=f.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({
      unicode: '你好世界',
      emoji: '🚀 🎉 ⚡',
      quotes: 'She said "Hello"',
      backslash: 'C:\\\\Users\\\\Documents',
      newlines: 'Line 1\\nLine 2\\nLine 3',
      tabs: 'Column1\\tColumn2\\tColumn3'
    }),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(je=(Re=f.parameters)==null?void 0:Re.docs)==null?void 0:je.source}}};var Ae,_e,ke;N.parameters={...N.parameters,docs:{...(Ae=N.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({
      trueValue: true,
      falseValue: false,
      nullValue: null,
      undefinedBehavior: undefined,
      // Will be omitted in JSON
      zeroValue: 0,
      emptyString: ''
    }),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(ke=(_e=N.parameters)==null?void 0:_e.docs)==null?void 0:ke.source}}};var Ve,Ie,Ee;C.parameters={...C.parameters,docs:{...(Ve=C.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({
      string: 'text',
      number: 42,
      float: 3.14159,
      boolean: true,
      null: null,
      array: [1, 2, 3],
      object: {
        nested: 'value'
      },
      largeNumber: 9007199254740991,
      negativeNumber: -273.15,
      scientificNotation: 6.022e23
    }),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...(Ee=(Ie=C.parameters)==null?void 0:Ie.docs)==null?void 0:Ee.source}}};var Me,He,Le;O.parameters={...O.parameters,docs:{...(Me=O.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-[800px]">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">All Features Enabled</h3>
                <JSONViewer value={nestedJSON} showCopyButton showRawToggle />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Copy Only</h3>
                <JSONViewer value={nestedJSON} showCopyButton showRawToggle={false} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Toggle Only</h3>
                <JSONViewer value={nestedJSON} showCopyButton={false} showRawToggle />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Minimal (No Controls)</h3>
                <JSONViewer value={nestedJSON} showCopyButton={false} showRawToggle={false} />
            </div>
        </div>
}`,...(Le=(He=O.parameters)==null?void 0:He.docs)==null?void 0:Le.source}}};var Fe,Ke,Ue;T.parameters={...T.parameters,docs:{...(Fe=T.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    value: replicationRules,
    mode: 'interactive',
    expandDepth: 2,
    showCopyButton: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Explicitly using interactive mode with expandable tree structure. Click on chevrons to expand/collapse nested objects.'
      }
    }
  }
}`,...(Ue=(Ke=T.parameters)==null?void 0:Ke.docs)==null?void 0:Ue.source}}};var We,Pe,ze;B.parameters={...B.parameters,docs:{...(We=B.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    value: deeplyNestedJSON,
    mode: 'interactive',
    expandDepth: 3,
    showCopyButton: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive mode with deeply nested objects (5 levels). Initial expand depth is 3 levels.'
      }
    }
  }
}`,...(ze=(Pe=B.parameters)==null?void 0:Pe.docs)==null?void 0:ze.source}}};var Ye,Ze,qe;J.parameters={...J.parameters,docs:{...(Ye=J.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  args: {
    value: largeArrayJSON,
    mode: 'interactive',
    expandDepth: 1,
    showCopyButton: true,
    maxHeight: '400px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive mode with large array (50 items). Scrollable content with expand/collapse for each item.'
      }
    }
  }
}`,...(qe=(Ze=J.parameters)==null?void 0:Ze.docs)==null?void 0:qe.source}}};var Ge,$e,Qe;D.parameters={...D.parameters,docs:{...(Ge=D.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  args: {
    value: complexSubscriptionJSON,
    mode: 'interactive',
    expandDepth: 2,
    showCopyButton: true,
    maxHeight: '500px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Complex subscription with filter and multiple replication rules.'
      }
    }
  }
}`,...(Qe=($e=D.parameters)==null?void 0:$e.docs)==null?void 0:Qe.source}}};var Xe,et,tt;R.parameters={...R.parameters,docs:{...(Xe=R.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    value: simpleJSON,
    mode: 'auto',
    showCopyButton: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto mode detects simple JSON and uses static syntax highlighting view.'
      }
    }
  }
}`,...(tt=(et=R.parameters)==null?void 0:et.docs)==null?void 0:tt.source}}};var rt,at,ot;j.parameters={...j.parameters,docs:{...(rt=j.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  args: {
    value: replicationRules,
    mode: 'auto',
    showCopyButton: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto mode detects complex JSON (array with 2+ items) and uses interactive tree view.'
      }
    }
  }
}`,...(ot=(at=j.parameters)==null?void 0:at.docs)==null?void 0:ot.source}}};var st,nt,it;A.parameters={...A.parameters,docs:{...(st=A.parameters)==null?void 0:st.docs,source:{originalSource:`{
  args: {
    value: subscriptionFilter,
    mode: 'auto',
    showCopyButton: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto mode with subscription filter - likely uses static view due to flat structure.'
      }
    }
  }
}`,...(it=(nt=A.parameters)==null?void 0:nt.docs)==null?void 0:it.source}}};var lt,ct,ut;_.parameters={..._.parameters,docs:{...(lt=_.parameters)==null?void 0:lt.docs,source:{originalSource:`{
  args: {
    value: largeJSON,
    mode: 'auto',
    showCopyButton: true,
    maxHeight: '400px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto mode with nested DID metadata - uses interactive view due to depth and complexity.'
      }
    }
  }
}`,...(ut=(ct=_.parameters)==null?void 0:ct.docs)==null?void 0:ut.source}}};var pt,dt,mt;k.parameters={...k.parameters,docs:{...(pt=k.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  args: {
    value: complexSubscriptionJSON,
    mode: 'interactive',
    expandDepth: 2,
    showCopyButton: true,
    maxHeight: '500px'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark p-8 rounded-lg bg-neutral-900 w-[800px]">
                <Story />
            </div>]
}`,...(mt=(dt=k.parameters)==null?void 0:dt.docs)==null?void 0:mt.source}}};var gt,ht,wt;V.parameters={...V.parameters,docs:{...(gt=V.parameters)==null?void 0:gt.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-[800px]">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Static Mode (Syntax Highlighting)</h3>
                <JSONViewer value={replicationRules} mode="static" showCopyButton showRawToggle />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Interactive Mode (Expandable Tree)</h3>
                <JSONViewer value={replicationRules} mode="interactive" expandDepth={2} showCopyButton />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Auto Mode (Detects Best View)</h3>
                <JSONViewer value={replicationRules} mode="auto" showCopyButton />
            </div>
        </div>,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of static, interactive, and auto modes with the same JSON data.'
      }
    }
  }
}`,...(wt=(ht=V.parameters)==null?void 0:ht.docs)==null?void 0:wt.source}}};var xt,vt,yt;I.parameters={...I.parameters,docs:{...(xt=I.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-[800px]">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Expand Depth: 1</h3>
                <JSONViewer value={complexSubscriptionJSON} mode="interactive" expandDepth={1} showCopyButton maxHeight="300px" />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Expand Depth: 2</h3>
                <JSONViewer value={complexSubscriptionJSON} mode="interactive" expandDepth={2} showCopyButton maxHeight="300px" />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Expand Depth: 3</h3>
                <JSONViewer value={complexSubscriptionJSON} mode="interactive" expandDepth={3} showCopyButton maxHeight="300px" />
            </div>
        </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different initial expand depths for interactive tree view.'
      }
    }
  }
}`,...(yt=(vt=I.parameters)==null?void 0:vt.docs)==null?void 0:yt.source}}};const Wt=["SimpleObject","NestedObject","ArrayData","InvalidJSON","EmptyObject","EmptyArray","WithoutCopyButton","WithoutRawToggle","MinimalControls","WithMaxHeight","SubscriptionFilter","ReplicationRules","DIDMetadata","DarkMode","VeryLongString","SpecialCharacters","BooleanAndNull","MixedDataTypes","ComparisonAllVariations","InteractiveModeExplicit","InteractiveDeepNesting","InteractiveLargeArray","InteractiveComplexSubscription","AutoModeSimpleObject","AutoModeComplexObject","AutoModeSubscriptionFilter","AutoModeNestedData","InteractiveDarkMode","ComparisonStaticVsInteractive","InteractiveExpandDepthVariations"];export{c as ArrayData,j as AutoModeComplexObject,_ as AutoModeNestedData,R as AutoModeSimpleObject,A as AutoModeSubscriptionFilter,N as BooleanAndNull,O as ComparisonAllVariations,V as ComparisonStaticVsInteractive,y as DIDMetadata,S as DarkMode,d as EmptyArray,p as EmptyObject,D as InteractiveComplexSubscription,k as InteractiveDarkMode,B as InteractiveDeepNesting,I as InteractiveExpandDepthVariations,J as InteractiveLargeArray,T as InteractiveModeExplicit,u as InvalidJSON,h as MinimalControls,C as MixedDataTypes,l as NestedObject,v as ReplicationRules,i as SimpleObject,f as SpecialCharacters,x as SubscriptionFilter,b as VeryLongString,w as WithMaxHeight,m as WithoutCopyButton,g as WithoutRawToggle,Wt as __namedExportsOrder,Ut as default};
