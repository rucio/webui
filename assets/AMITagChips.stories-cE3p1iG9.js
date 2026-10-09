import{i as e}from"./preload-helper-DID7B_--.js";import{Ot as t}from"./iframe-CpWC1arH.js";import{n,t as r}from"./AMITagChips-BKVYrqBe.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a=e=>`https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=${e}`,o={title:`Features/AMI/AMITagChips`,component:r,parameters:{layout:`centered`,docs:{description:{component:"ATLAS only (flag `dids.ami_tags`). AMI tags parsed from a DID name. Each chip links to AMI in a new tab; hover or focus shows the tag details fetched from AMI."}}},tags:[`autodocs`],decorators:[e=>(0,i.jsx)(`div`,{className:`p-16 min-w-[320px]`,children:(0,i.jsx)(e,{})})]},s={args:{tags:[`f1723`,`m2281`],infos:[{tag:`f1723`,url:a(`f1723`),found:!0,productionStep:`recon`,baseRelease:`Athena_24.0.146`,transformation:`Reco_tf.py`,description:`f1720 (recon) with 24.0.146`},{tag:`m2281`,url:a(`m2281`),found:!0,productionStep:`merge`,baseRelease:`Athena_24.0.128`,transformation:`AODMerge_tf.py`,description:`m2272 with 24.0.128 for first 2026 run`,created:`2026-02-09 18:04:58`}]}},c={args:{tags:[`e8514`,`s4162`,`r15540`,`p6266`],isLoading:!0}},l={args:{tags:[`f99999999`],infos:[{tag:`f99999999`,url:a(`f99999999`),found:!1}]}},u={args:{tags:[`f1723`,`m2281`],infos:[{tag:`f1723`,url:a(`f1723`),found:null},{tag:`m2281`,url:a(`m2281`),found:null}]}},d=[`Found`,`Loading`,`NotFound`,`AMIUnavailable`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    tags: ['f1723', 'm2281'],
    infos: [{
      tag: 'f1723',
      url: url('f1723'),
      found: true,
      productionStep: 'recon',
      baseRelease: 'Athena_24.0.146',
      transformation: 'Reco_tf.py',
      description: 'f1720 (recon) with 24.0.146'
    }, {
      tag: 'm2281',
      url: url('m2281'),
      found: true,
      productionStep: 'merge',
      baseRelease: 'Athena_24.0.128',
      transformation: 'AODMerge_tf.py',
      description: 'm2272 with 24.0.128 for first 2026 run',
      created: '2026-02-09 18:04:58'
    }]
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    tags: ['e8514', 's4162', 'r15540', 'p6266'],
    isLoading: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    tags: ['f99999999'],
    infos: [{
      tag: 'f99999999',
      url: url('f99999999'),
      found: false
    }]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    tags: ['f1723', 'm2281'],
    infos: [{
      tag: 'f1723',
      url: url('f1723'),
      found: null
    }, {
      tag: 'm2281',
      url: url('m2281'),
      found: null
    }]
  }
}`,...u.parameters?.docs?.source}}}}))();export{u as AMIUnavailable,s as Found,c as Loading,l as NotFound,d as __namedExportsOrder,o as default};