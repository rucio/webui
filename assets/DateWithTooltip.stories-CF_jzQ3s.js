import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,r}from"./DateWithTooltip-bFUVjkoa.js";var i,a,o,s,c,l,u,d,f,p,m,h;e((()=>{i=t(),r(),a={title:`Features/Utils/DateWithTooltip`,component:n,parameters:{layout:`centered`,docs:{description:{component:'Renders a short `YYYY/MM/DD` date (UTC) as visible text. Hovering or focusing the element reveals a tooltip with the full `YYYY/MM/DD HH:MM:SS UTC` datetime. Handles `null`/`undefined` inputs gracefully by showing "N/A".'}}},tags:[`autodocs`],decorators:[e=>(0,i.jsx)(`div`,{className:`p-8 min-w-[200px]`,children:(0,i.jsx)(e,{})})]},o={args:{date:`2024-01-15T14:32:05Z`}},s={args:{date:new Date(`2024-06-30T08:00:00Z`)},parameters:{docs:{description:{story:"Accepts a native `Date` object in addition to ISO strings."}}}},c={args:{date:null},parameters:{docs:{description:{story:'When `date` is `null`, the component renders a muted "N/A" placeholder without a tooltip.'}}}},l={args:{date:void 0},parameters:{docs:{description:{story:'When `date` is `undefined`, the component renders a muted "N/A" placeholder without a tooltip.'}}}},u={args:{date:`not-a-date`},parameters:{docs:{description:{story:`Malformed date strings result in "N/A" with no tooltip.`}}}},d={args:{date:`2024-03-21T23:59:59Z`},parameters:{docs:{description:{story:`Hover (or focus via keyboard Tab) over the date to reveal the full timestamp tooltip. The tooltip remains open while the pointer is over either the trigger or the popover content.`}}}},f={args:{date:`2024-07-04T00:00:00Z`},parameters:{docs:{description:{story:`Midnight UTC — the short date and the tooltip date should agree regardless of the viewer's local timezone.`}}}},p={args:{date:`2024-01-15T14:32:05Z`},decorators:[e=>(0,i.jsx)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900`,children:(0,i.jsx)(e,{})})],globals:{backgrounds:{value:`dark`}}},m={render:()=>(0,i.jsxs)(`div`,{className:`space-y-4 p-8`,children:[(0,i.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,i.jsx)(`span`,{className:`text-sm font-semibold text-neutral-700 dark:text-neutral-300`,children:`ISO string`}),(0,i.jsx)(n,{date:`2024-01-15T14:32:05Z`})]}),(0,i.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,i.jsx)(`span`,{className:`text-sm font-semibold text-neutral-700 dark:text-neutral-300`,children:`Date object`}),(0,i.jsx)(n,{date:new Date(`2024-06-30T08:00:00Z`)})]}),(0,i.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,i.jsx)(`span`,{className:`text-sm font-semibold text-neutral-700 dark:text-neutral-300`,children:`null`}),(0,i.jsx)(n,{date:null})]}),(0,i.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,i.jsx)(`span`,{className:`text-sm font-semibold text-neutral-700 dark:text-neutral-300`,children:`undefined`}),(0,i.jsx)(n,{date:void 0})]}),(0,i.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,i.jsx)(`span`,{className:`text-sm font-semibold text-neutral-700 dark:text-neutral-300`,children:`Invalid string`}),(0,i.jsx)(n,{date:`not-a-date`})]})]}),parameters:{docs:{description:{story:`All input variations side-by-side. Hover each valid date to see the full UTC tooltip.`}}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    date: '2024-01-15T14:32:05Z'
  }
}`,...o.parameters?.docs?.source},description:{story:`ISO 8601 string input — the most common usage from API responses.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    date: new Date('2024-06-30T08:00:00Z')
  },
  parameters: {
    docs: {
      description: {
        story: 'Accepts a native \`Date\` object in addition to ISO strings.'
      }
    }
  }
}`,...s.parameters?.docs?.source},description:{story:"Native `Date` object input.",...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    date: null
  },
  parameters: {
    docs: {
      description: {
        story: 'When \`date\` is \`null\`, the component renders a muted "N/A" placeholder without a tooltip.'
      }
    }
  }
}`,...c.parameters?.docs?.source},description:{story:'`null` input — renders "N/A" with muted styling, no interactive tooltip.',...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    date: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'When \`date\` is \`undefined\`, the component renders a muted "N/A" placeholder without a tooltip.'
      }
    }
  }
}`,...l.parameters?.docs?.source},description:{story:"`undefined` input — same fallback behaviour as `null`.",...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'not-a-date'
  },
  parameters: {
    docs: {
      description: {
        story: 'Malformed date strings result in "N/A" with no tooltip.'
      }
    }
  }
}`,...u.parameters?.docs?.source},description:{story:`Invalid / malformed string — renders "N/A".`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    date: '2024-03-21T23:59:59Z'
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover (or focus via keyboard Tab) over the date to reveal the full timestamp tooltip. The tooltip remains open while the pointer is over either the trigger or the popover content.'
      }
    }
  }
}`,...d.parameters?.docs?.source},description:{story:`Hover over the date text to see the full UTC datetime tooltip.
The tooltip stays open as the pointer moves from the trigger into the content.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    date: '2024-07-04T00:00:00Z'
  },
  parameters: {
    docs: {
      description: {
        story: 'Midnight UTC — the short date and the tooltip date should agree regardless of the viewer\\'s local timezone.'
      }
    }
  }
}`,...f.parameters?.docs?.source},description:{story:`A timestamp right at midnight UTC — display date should match tooltip date.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    date: '2024-01-15T14:32:05Z'
  },
  decorators: [Story => <div className="dark p-8 rounded-lg bg-neutral-900">
                <Story />
            </div>],
  globals: {
    backgrounds: {
      value: 'dark'
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 p-8">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">ISO string</span>
                <DateWithTooltip date="2024-01-15T14:32:05Z" />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Date object</span>
                <DateWithTooltip date={new Date('2024-06-30T08:00:00Z')} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">null</span>
                <DateWithTooltip date={null} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">undefined</span>
                <DateWithTooltip date={undefined} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Invalid string</span>
                <DateWithTooltip date="not-a-date" />
            </div>
        </div>,
  parameters: {
    docs: {
      description: {
        story: 'All input variations side-by-side. Hover each valid date to see the full UTC tooltip.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h=[`ISOString`,`DateObject`,`NullDate`,`UndefinedDate`,`InvalidDate`,`HoverToShowTooltip`,`MidnightUTC`,`DarkMode`,`AllVariations`]}))();export{m as AllVariations,p as DarkMode,s as DateObject,d as HoverToShowTooltip,o as ISOString,u as InvalidDate,f as MidnightUTC,c as NullDate,l as UndefinedDate,h as __namedExportsOrder,a as default};