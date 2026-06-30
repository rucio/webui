import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./JSONViewer-BdCtDitX.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K;e((()=>{i=t(),n(),a={title:`Features/JSON/JSONViewer`,component:r,parameters:{layout:`centered`},tags:[`autodocs`],decorators:[e=>(0,i.jsx)(`div`,{className:`w-[800px]`,children:(0,i.jsx)(e,{})})]},o=JSON.stringify({name:`John Doe`,age:30,active:!0}),s=JSON.stringify({user:{id:12345,name:`John Doe`,email:`john@example.com`,preferences:{theme:`dark`,notifications:!0,language:`en`}},metadata:{created:`2024-01-15T10:30:00Z`,updated:`2024-01-20T14:45:00Z`}}),c=JSON.stringify({scope:[`data15_13TeV`,`data15_14TeV`],account:[`root`],datatype:`AOD`,excluded_pattern:`calibration`,asynchronous:!1}),l=JSON.stringify([{copies:1,rse_expression:`tier=1&disk=1`,weight:null,lifetime:604800,locked:!1,subscription_id:`f47ac10b-58cc-4372-a567-0e02b2c3d479`,source_replica_expression:null,activity:`User Subscriptions`,notify:`N`},{copies:2,rse_expression:`cloud=US`,weight:null,lifetime:null,locked:!0,subscription_id:`a67bc20c-69dd-5483-b678-1f13c3d4e580`,source_replica_expression:`tier=0`,activity:`Data Brokering`,notify:`Y`}]),u=JSON.stringify([`apple`,`banana`,`cherry`,`date`,`elderberry`]),d=JSON.stringify({dataset:{name:`data15_13TeV.00276262.physics_Main.merge.AOD.r7562_p2521`,scope:`data15_13TeV`,type:`DATASET`,bytes:3487234987,length:1543,did_type:`DATASET`,is_open:!1,monotonic:!1,obsolete:!1,hidden:!1,suppressed:!1,purge_replicas:!0,metadata:{project:`data15_13TeV`,run_number:276262,stream_name:`physics_Main`,prod_step:`merge`,datatype:`AOD`,provenance:`merge`},rules:[{id:`rule1`,rse:`CERN-PROD_DATADISK`,state:`OK`,copies:1},{id:`rule2`,rse:`LBNL_ATLAS_DATADISK`,state:`REPLICATING`,copies:2},{id:`rule3`,rse:`TOKYO-LCG2_DATADISK`,state:`OK`,copies:1}]}}),f=`{ invalid json, missing quotes: true }`,p={args:{value:o,showCopyButton:!0,showRawToggle:!0}},m={args:{value:s,showCopyButton:!0,showRawToggle:!0}},h={args:{value:u,showCopyButton:!0,showRawToggle:!0}},g={args:{value:f,showCopyButton:!0,showRawToggle:!0}},_={args:{value:JSON.stringify({}),showCopyButton:!0,showRawToggle:!0}},v={args:{value:JSON.stringify([]),showCopyButton:!0,showRawToggle:!0}},y={args:{value:s,showCopyButton:!1,showRawToggle:!0}},b={args:{value:s,showCopyButton:!0,showRawToggle:!1}},x={args:{value:s,showCopyButton:!1,showRawToggle:!1}},S={args:{value:d,showCopyButton:!0,showRawToggle:!0,maxHeight:`300px`}},C={args:{value:c,showCopyButton:!0,showRawToggle:!0},parameters:{docs:{description:{story:`Example of a subscription filter JSON used in Rucio subscriptions.`}}}},w={args:{value:l,showCopyButton:!0,showRawToggle:!0},parameters:{docs:{description:{story:`Example of replication rules JSON used in Rucio subscriptions.`}}}},T={args:{value:d,showCopyButton:!0,showRawToggle:!0,maxHeight:`500px`},parameters:{docs:{description:{story:`Example of DID metadata with scrollable content.`}}}},E={args:{value:s,showCopyButton:!0,showRawToggle:!0},decorators:[e=>(0,i.jsx)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 w-[800px]`,children:(0,i.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},D={args:{value:JSON.stringify({longString:`This is a very long string that should wrap properly within the JSON viewer component without breaking the layout or causing horizontal scroll issues when the content is too wide for the container`,anotherProperty:`normal value`}),showCopyButton:!0,showRawToggle:!0}},O={args:{value:JSON.stringify({unicode:`你好世界`,emoji:`🚀 🎉 ⚡`,quotes:`She said "Hello"`,backslash:`C:\\Users\\Documents`,newlines:`Line 1
Line 2
Line 3`,tabs:`Column1	Column2	Column3`}),showCopyButton:!0,showRawToggle:!0}},k={args:{value:JSON.stringify({trueValue:!0,falseValue:!1,nullValue:null,undefinedBehavior:void 0,zeroValue:0,emptyString:``}),showCopyButton:!0,showRawToggle:!0}},A={args:{value:JSON.stringify({string:`text`,number:42,float:3.14159,boolean:!0,null:null,array:[1,2,3],object:{nested:`value`},largeNumber:9007199254740991,negativeNumber:-273.15,scientificNotation:6022e20}),showCopyButton:!0,showRawToggle:!0}},j={render:()=>(0,i.jsxs)(`div`,{className:`space-y-6 w-[800px]`,children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`All Features Enabled`}),(0,i.jsx)(r,{value:s,showCopyButton:!0,showRawToggle:!0})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Copy Only`}),(0,i.jsx)(r,{value:s,showCopyButton:!0,showRawToggle:!1})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Toggle Only`}),(0,i.jsx)(r,{value:s,showCopyButton:!1,showRawToggle:!0})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Minimal (No Controls)`}),(0,i.jsx)(r,{value:s,showCopyButton:!1,showRawToggle:!1})]})]})},M=JSON.stringify({level1:{level2:{level3:{level4:{level5:{deepValue:`You found me!`,moreData:[1,2,3,4,5]},anotherBranch:{data:`Additional content`}}}}},topLevel:`Easy to see`}),N=JSON.stringify(Array.from({length:50},(e,t)=>({id:`item-${t}`,name:`Item ${t}`,status:t%3==0?`active`:t%3==1?`pending`:`inactive`,metadata:{created:new Date(2024,0,t+1).toISOString(),score:Math.random()*100}}))),P=JSON.stringify({subscription:{id:`f47ac10b-58cc-4372-a567-0e02b2c3d479`,account:`root`,name:`data15_13TeV_subscription`,filter:{scope:[`data15_13TeV`,`data15_14TeV`,`data16_13TeV`],account:[`root`,`dataprep`],datatype:`AOD`,excluded_pattern:`calibration.*`,project:[`data15_13TeV`],asynchronous:!1,split_rule:!0},replication_rules:[{copies:1,rse_expression:`tier=1&disk=1`,weight:null,lifetime:604800,locked:!1,subscription_id:`f47ac10b-58cc-4372-a567-0e02b2c3d479`,source_replica_expression:null,activity:`User Subscriptions`,notify:`N`,comments:`Primary copy for T1 sites`,grouping:`DATASET`,purge_replicas:!1},{copies:2,rse_expression:`cloud=US&type=DATADISK`,weight:null,lifetime:null,locked:!0,subscription_id:`f47ac10b-58cc-4372-a567-0e02b2c3d479`,source_replica_expression:`tier=0`,activity:`Data Brokering`,notify:`Y`,comments:`US cloud distribution`,grouping:`ALL`,purge_replicas:!0},{copies:1,rse_expression:`cloud=CERN&tape=1`,weight:10,lifetime:null,locked:!0,subscription_id:`f47ac10b-58cc-4372-a567-0e02b2c3d479`,source_replica_expression:null,activity:`Data Consolidation`,notify:`N`,comments:`Long-term tape storage`,grouping:`DATASET`,purge_replicas:!1}],state:`ACTIVE`,created_at:`2024-01-15T10:30:00Z`,updated_at:`2024-01-20T14:45:00Z`,lifetime:null,comments:`Automatic subscription for data15 datasets`,retroactive:!1,priority:3}}),F={args:{value:l,mode:`interactive`,expandDepth:2,showCopyButton:!0},parameters:{docs:{description:{story:`Explicitly using interactive mode with expandable tree structure. Click on chevrons to expand/collapse nested objects.`}}}},I={args:{value:M,mode:`interactive`,expandDepth:3,showCopyButton:!0},parameters:{docs:{description:{story:`Interactive mode with deeply nested objects (5 levels). Initial expand depth is 3 levels.`}}}},L={args:{value:N,mode:`interactive`,expandDepth:1,showCopyButton:!0,maxHeight:`400px`},parameters:{docs:{description:{story:`Interactive mode with large array (50 items). Scrollable content with expand/collapse for each item.`}}}},R={args:{value:P,mode:`interactive`,expandDepth:2,showCopyButton:!0,maxHeight:`500px`},parameters:{docs:{description:{story:`Real-world example: Complex subscription with filter and multiple replication rules.`}}}},z={args:{value:o,mode:`auto`,showCopyButton:!0},parameters:{docs:{description:{story:`Auto mode detects simple JSON and uses static syntax highlighting view.`}}}},B={args:{value:l,mode:`auto`,showCopyButton:!0},parameters:{docs:{description:{story:`Auto mode detects complex JSON (array with 2+ items) and uses interactive tree view.`}}}},V={args:{value:c,mode:`auto`,showCopyButton:!0},parameters:{docs:{description:{story:`Auto mode with subscription filter - likely uses static view due to flat structure.`}}}},H={args:{value:d,mode:`auto`,showCopyButton:!0,maxHeight:`400px`},parameters:{docs:{description:{story:`Auto mode with nested DID metadata - uses interactive view due to depth and complexity.`}}}},U={args:{value:P,mode:`interactive`,expandDepth:2,showCopyButton:!0,maxHeight:`500px`},decorators:[e=>(0,i.jsx)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900 w-[800px]`,children:(0,i.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},W={render:()=>(0,i.jsxs)(`div`,{className:`space-y-6 w-[800px]`,children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Static Mode (Syntax Highlighting)`}),(0,i.jsx)(r,{value:l,mode:`static`,showCopyButton:!0,showRawToggle:!0})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Interactive Mode (Expandable Tree)`}),(0,i.jsx)(r,{value:l,mode:`interactive`,expandDepth:2,showCopyButton:!0})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Auto Mode (Detects Best View)`}),(0,i.jsx)(r,{value:l,mode:`auto`,showCopyButton:!0})]})]}),parameters:{docs:{description:{story:`Side-by-side comparison of static, interactive, and auto modes with the same JSON data.`}}}},G={render:()=>(0,i.jsxs)(`div`,{className:`space-y-6 w-[800px]`,children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Expand Depth: 1`}),(0,i.jsx)(r,{value:P,mode:`interactive`,expandDepth:1,showCopyButton:!0,maxHeight:`300px`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Expand Depth: 2`}),(0,i.jsx)(r,{value:P,mode:`interactive`,expandDepth:2,showCopyButton:!0,maxHeight:`300px`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100`,children:`Expand Depth: 3`}),(0,i.jsx)(r,{value:P,mode:`interactive`,expandDepth:3,showCopyButton:!0,maxHeight:`300px`})]})]}),parameters:{docs:{description:{story:`Demonstrates different initial expand depths for interactive tree view.`}}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    value: simpleJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    value: arrayJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    value: invalidJSON,
    showCopyButton: true,
    showRawToggle: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({}),
    showCopyButton: true,
    showRawToggle: true
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify([]),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: false,
    showRawToggle: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: true,
    showRawToggle: false
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: false,
    showRawToggle: false
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    value: largeJSON,
    showCopyButton: true,
    showRawToggle: true,
    maxHeight: '300px'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    value: nestedJSON,
    showCopyButton: true,
    showRawToggle: true
  },
  decorators: [Story => <div className="dark p-8 rounded-lg bg-neutral-900 w-[800px]">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    value: JSON.stringify({
      longString: 'This is a very long string that should wrap properly within the JSON viewer component without breaking the layout or causing horizontal scroll issues when the content is too wide for the container',
      anotherProperty: 'normal value'
    }),
    showCopyButton: true,
    showRawToggle: true
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    value: complexSubscriptionJSON,
    mode: 'interactive',
    expandDepth: 2,
    showCopyButton: true,
    maxHeight: '500px'
  },
  decorators: [Story => <div className="dark p-8 rounded-lg bg-neutral-900 w-[800px]">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},K=`SimpleObject.NestedObject.ArrayData.InvalidJSON.EmptyObject.EmptyArray.WithoutCopyButton.WithoutRawToggle.MinimalControls.WithMaxHeight.SubscriptionFilter.ReplicationRules.DIDMetadata.DarkMode.VeryLongString.SpecialCharacters.BooleanAndNull.MixedDataTypes.ComparisonAllVariations.InteractiveModeExplicit.InteractiveDeepNesting.InteractiveLargeArray.InteractiveComplexSubscription.AutoModeSimpleObject.AutoModeComplexObject.AutoModeSubscriptionFilter.AutoModeNestedData.InteractiveDarkMode.ComparisonStaticVsInteractive.InteractiveExpandDepthVariations`.split(`.`)}))();export{h as ArrayData,B as AutoModeComplexObject,H as AutoModeNestedData,z as AutoModeSimpleObject,V as AutoModeSubscriptionFilter,k as BooleanAndNull,j as ComparisonAllVariations,W as ComparisonStaticVsInteractive,T as DIDMetadata,E as DarkMode,v as EmptyArray,_ as EmptyObject,R as InteractiveComplexSubscription,U as InteractiveDarkMode,I as InteractiveDeepNesting,G as InteractiveExpandDepthVariations,L as InteractiveLargeArray,F as InteractiveModeExplicit,g as InvalidJSON,x as MinimalControls,A as MixedDataTypes,m as NestedObject,w as ReplicationRules,p as SimpleObject,O as SpecialCharacters,C as SubscriptionFilter,D as VeryLongString,S as WithMaxHeight,y as WithoutCopyButton,b as WithoutRawToggle,K as __namedExportsOrder,a as default};