import{j as e}from"./iframe-CW9-_HYS.js";import{D as t}from"./DateWithTooltip-BQW6dl4Z.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BYI7UAI7.js";import"./index-EU4VEQCY.js";import"./index-vscuIXpL.js";import"./index-DfvfBRvX.js";import"./Combination-C7xDWU_D.js";import"./index-Cd40vaJY.js";import"./index-ZDVb7sJw.js";import"./index-CC9cG0nH.js";import"./index-zIJ3W_2m.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./text-formatters-wJd6s3Vd.js";const he={title:"Features/Utils/DateWithTooltip",component:t,parameters:{layout:"centered",docs:{description:{component:'Renders a short `YYYY/MM/DD` date (UTC) as visible text. Hovering or focusing the element reveals a tooltip with the full `YYYY/MM/DD HH:MM:SS UTC` datetime. Handles `null`/`undefined` inputs gracefully by showing "N/A".'}}},tags:["autodocs"],decorators:[p=>e.jsx("div",{className:"p-8 min-w-[200px]",children:e.jsx(p,{})})]},a={args:{date:"2024-01-15T14:32:05Z"}},s={args:{date:new Date("2024-06-30T08:00:00Z")},parameters:{docs:{description:{story:"Accepts a native `Date` object in addition to ISO strings."}}}},r={args:{date:null},parameters:{docs:{description:{story:'When `date` is `null`, the component renders a muted "N/A" placeholder without a tooltip.'}}}},o={args:{date:void 0},parameters:{docs:{description:{story:'When `date` is `undefined`, the component renders a muted "N/A" placeholder without a tooltip.'}}}},n={args:{date:"not-a-date"},parameters:{docs:{description:{story:'Malformed date strings result in "N/A" with no tooltip.'}}}},i={args:{date:"2024-03-21T23:59:59Z"},parameters:{docs:{description:{story:"Hover (or focus via keyboard Tab) over the date to reveal the full timestamp tooltip. The tooltip remains open while the pointer is over either the trigger or the popover content."}}}},d={args:{date:"2024-07-04T00:00:00Z"},parameters:{docs:{description:{story:"Midnight UTC — the short date and the tooltip date should agree regardless of the viewer's local timezone."}}}},l={args:{date:"2024-01-15T14:32:05Z"},decorators:[p=>e.jsx("div",{className:"dark p-8 rounded-lg bg-neutral-900",children:e.jsx(p,{})})],globals:{backgrounds:{value:"dark"}}},c={render:()=>e.jsxs("div",{className:"space-y-4 p-8",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-700 dark:text-neutral-300",children:"ISO string"}),e.jsx(t,{date:"2024-01-15T14:32:05Z"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-700 dark:text-neutral-300",children:"Date object"}),e.jsx(t,{date:new Date("2024-06-30T08:00:00Z")})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-700 dark:text-neutral-300",children:"null"}),e.jsx(t,{date:null})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-700 dark:text-neutral-300",children:"undefined"}),e.jsx(t,{date:void 0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-700 dark:text-neutral-300",children:"Invalid string"}),e.jsx(t,{date:"not-a-date"})]})]}),parameters:{docs:{description:{story:"All input variations side-by-side. Hover each valid date to see the full UTC tooltip."}}}};var m,u,h,g,x;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    date: '2024-01-15T14:32:05Z'
  }
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source},description:{story:"ISO 8601 string input — the most common usage from API responses.",...(x=(g=a.parameters)==null?void 0:g.docs)==null?void 0:x.description}}};var v,f,T,N,y;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(T=(f=s.parameters)==null?void 0:f.docs)==null?void 0:T.source},description:{story:"Native `Date` object input.",...(y=(N=s.parameters)==null?void 0:N.docs)==null?void 0:y.description}}};var b,D,j,S,k;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(j=(D=r.parameters)==null?void 0:D.docs)==null?void 0:j.source},description:{story:'`null` input — renders "N/A" with muted styling, no interactive tooltip.',...(k=(S=r.parameters)==null?void 0:S.docs)==null?void 0:k.description}}};var w,A,M,Z,I;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(M=(A=o.parameters)==null?void 0:A.docs)==null?void 0:M.source},description:{story:"`undefined` input — same fallback behaviour as `null`.",...(I=(Z=o.parameters)==null?void 0:Z.docs)==null?void 0:I.description}}};var U,H,W,C,O;n.parameters={...n.parameters,docs:{...(U=n.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(W=(H=n.parameters)==null?void 0:H.docs)==null?void 0:W.source},description:{story:'Invalid / malformed string — renders "N/A".',...(O=(C=n.parameters)==null?void 0:C.docs)==null?void 0:O.description}}};var Y,z,E,R,V;i.parameters={...i.parameters,docs:{...(Y=i.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(E=(z=i.parameters)==null?void 0:z.docs)==null?void 0:E.source},description:{story:`Hover over the date text to see the full UTC datetime tooltip.
The tooltip stays open as the pointer moves from the trigger into the content.`,...(V=(R=i.parameters)==null?void 0:R.docs)==null?void 0:V.description}}};var _,F,P,q,B;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(P=(F=d.parameters)==null?void 0:F.docs)==null?void 0:P.source},description:{story:"A timestamp right at midnight UTC — display date should match tooltip date.",...(B=(q=d.parameters)==null?void 0:q.docs)==null?void 0:B.description}}};var G,J,K;l.parameters={...l.parameters,docs:{...(G=l.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var L,Q,X;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(X=(Q=c.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const ge=["ISOString","DateObject","NullDate","UndefinedDate","InvalidDate","HoverToShowTooltip","MidnightUTC","DarkMode","AllVariations"];export{c as AllVariations,l as DarkMode,s as DateObject,i as HoverToShowTooltip,a as ISOString,n as InvalidDate,d as MidnightUTC,r as NullDate,o as UndefinedDate,ge as __namedExportsOrder,he as default};
