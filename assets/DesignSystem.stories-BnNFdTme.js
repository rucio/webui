import{j as e}from"./iframe-CbZ9RuD1.js";import{c as r}from"./colors-D788UJep.js";import"./preload-helper-Dp1pzeXC.js";const W={thin:100,extralight:200,light:300,regular:400,medium:500,semibold:600,bold:700,extrabold:800,black:900},q={xs:{size:"0.75rem",lineHeight:"1rem"},sm:{size:"0.875rem",lineHeight:"1.25rem"},base:{size:"1rem",lineHeight:"1.5rem"},lg:{size:"1.125rem",lineHeight:"1.75rem"},xl:{size:"1.25rem",lineHeight:"1.75rem"},"2xl":{size:"1.5rem",lineHeight:"2rem"},"3xl":{size:"1.875rem",lineHeight:"2.25rem"},"4xl":{size:"2.25rem",lineHeight:"2.5rem"},"5xl":{size:"3rem",lineHeight:"1"},"6xl":{size:"3.75rem",lineHeight:"1"},"7xl":{size:"4.5rem",lineHeight:"1"}},n={0:"0px",1:"0.25rem",2:"0.5rem",3:"0.75rem",4:"1rem",5:"1.25rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",14:"3.5rem",16:"4rem",20:"5rem",24:"6rem",28:"7rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem"},D={component:{compact:n[2],cozy:n[4],comfortable:n[6],spacious:n[8]},stack:{tight:n[2],normal:n[4],relaxed:n[6],loose:n[12]},inline:{tight:n[1],normal:n[2],relaxed:n[4]},inset:{none:n[0],xs:n[2],sm:n[3],md:n[4],lg:n[6],xl:n[8],"2xl":n[12]},page:{paddingX:n[4],paddingXLg:n[8],paddingY:n[8],sectionGap:n[16]},form:{fieldGap:n[4],labelGap:n[2],groupGap:n[6]}},m={none:"none",sm:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",default:"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",md:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",lg:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",xl:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)","2xl":"0 25px 50px -12px rgba(0, 0, 0, 0.25)",inner:"inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",brand:"0 0 0 3px color-mix(in srgb, transparent, #8b5cf6 50%)"},M={title:"Design System/Foundations",parameters:{layout:"fullscreen",docs:{description:{component:"The Rucio WebUI design system foundations inspired by Vercel Geist and Apple HIG. Explore our design tokens for colors, typography, spacing, and elevation."}}}},s={render:()=>e.jsx("div",{className:"p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen",children:e.jsxs("div",{className:"max-w-7xl mx-auto space-y-12",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2",children:"Color System"}),e.jsx("p",{className:"text-lg text-neutral-600 dark:text-neutral-400",children:"High-contrast, accessible color palette for light and dark themes"})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Neutral (Slate) - UI Colors"}),e.jsx("div",{className:"grid grid-cols-11 gap-2",children:Object.entries(r.neutral).map(([t,a])=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"h-20 rounded-md border border-neutral-200 dark:border-neutral-700",style:{backgroundColor:a}}),e.jsxs("div",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:[e.jsx("div",{className:"font-mono",children:t}),e.jsx("div",{className:"font-mono text-[10px]",children:a})]})]},t))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Brand (Purple) - Primary Actions"}),e.jsx("div",{className:"grid grid-cols-9 gap-2",children:Object.entries(r.brand).map(([t,a])=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"h-20 rounded-md border border-neutral-200 dark:border-neutral-700",style:{backgroundColor:a}}),e.jsxs("div",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:[e.jsx("div",{className:"font-mono",children:t}),e.jsx("div",{className:"font-mono text-[10px]",children:a})]})]},t))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Semantic Colors"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3",children:"Success (Green)"}),e.jsx("div",{className:"grid grid-cols-9 gap-2",children:Object.entries(r.base.success).map(([t,a])=>e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"h-12 rounded border border-neutral-200 dark:border-neutral-700",style:{backgroundColor:a}}),e.jsx("div",{className:"text-[10px] font-mono text-neutral-600 dark:text-neutral-400",children:t})]},t))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3",children:"Error (Red)"}),e.jsx("div",{className:"grid grid-cols-9 gap-2",children:Object.entries(r.base.error).map(([t,a])=>e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"h-12 rounded border border-neutral-200 dark:border-neutral-700",style:{backgroundColor:a}}),e.jsx("div",{className:"text-[10px] font-mono text-neutral-600 dark:text-neutral-400",children:t})]},t))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3",children:"Warning (Amber)"}),e.jsx("div",{className:"grid grid-cols-9 gap-2",children:Object.entries(r.base.warning).map(([t,a])=>e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"h-12 rounded border border-neutral-200 dark:border-neutral-700",style:{backgroundColor:a}}),e.jsx("div",{className:"text-[10px] font-mono text-neutral-600 dark:text-neutral-400",children:t})]},t))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3",children:"Info (Blue)"}),e.jsx("div",{className:"grid grid-cols-9 gap-2",children:Object.entries(r.base.info).map(([t,a])=>e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"h-12 rounded border border-neutral-200 dark:border-neutral-700",style:{backgroundColor:a}}),e.jsx("div",{className:"text-[10px] font-mono text-neutral-600 dark:text-neutral-400",children:t})]},t))})]})]})]})]})})},l={render:()=>e.jsx("div",{className:"p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen",children:e.jsxs("div",{className:"max-w-7xl mx-auto space-y-12",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2",children:"Typography"}),e.jsx("p",{className:"text-lg text-neutral-600 dark:text-neutral-400",children:"Modern, legible type system optimized for screen reading"})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Font Families"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"font-sans"}),e.jsx("p",{className:"text-2xl font-sans text-neutral-900 dark:text-neutral-100",children:"Inter - The quick brown fox jumps over the lazy dog"})]}),e.jsxs("div",{className:"p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"font-mono"}),e.jsx("p",{className:"text-2xl font-mono text-neutral-900 dark:text-neutral-100",children:"JetBrains Mono - The quick brown fox jumps over the lazy dog"})]})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Type Scale"}),e.jsx("div",{className:"space-y-4",children:Object.entries(q).map(([t,a])=>e.jsxs("div",{className:"flex items-baseline gap-4",children:[e.jsx("div",{className:"w-20 text-sm font-mono text-neutral-600 dark:text-neutral-400",children:t}),e.jsx("div",{className:"flex-1 text-neutral-900 dark:text-neutral-100",style:{fontSize:a.size,lineHeight:a.lineHeight},children:"The quick brown fox jumps over the lazy dog"}),e.jsx("div",{className:"text-sm font-mono text-neutral-500",children:a.size})]},t))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Font Weights"}),e.jsx("div",{className:"space-y-2",children:Object.entries(W).map(([t,a])=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-32 text-sm font-mono text-neutral-600 dark:text-neutral-400",children:t}),e.jsx("div",{className:"flex-1 text-2xl text-neutral-900 dark:text-neutral-100",style:{fontWeight:a},children:"The quick brown fox jumps over the lazy dog"}),e.jsx("div",{className:"text-sm font-mono text-neutral-500",children:a})]},t))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Typography Presets"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"Display"}),e.jsx("div",{className:"text-5xl font-extrabold text-neutral-900 dark:text-neutral-100",children:"Display Text"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"H1"}),e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100",children:"Heading 1"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"H2"}),e.jsx("h2",{className:"text-3xl font-bold text-neutral-900 dark:text-neutral-100",children:"Heading 2"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"H3"}),e.jsx("h3",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100",children:"Heading 3"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"Body"}),e.jsx("p",{className:"text-base text-neutral-700 dark:text-neutral-300",children:"This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"Caption"}),e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:"This is caption text"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2",children:"Code"}),e.jsx("code",{className:"font-mono text-sm bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded",children:"const greeting = 'Hello, world!';"})]})]})]})]})})},d={render:()=>e.jsx("div",{className:"p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen",children:e.jsxs("div",{className:"max-w-7xl mx-auto space-y-12",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2",children:"Spacing System"}),e.jsx("p",{className:"text-lg text-neutral-600 dark:text-neutral-400",children:"8px-based grid for consistent layouts"})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Spacing Scale"}),e.jsx("div",{className:"space-y-4",children:Object.entries(n).filter(([t])=>!isNaN(Number(t))&&Number(t)<=20).map(([t,a])=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-20 text-sm font-mono text-neutral-600 dark:text-neutral-400",children:t}),e.jsx("div",{className:"bg-brand-500 h-8 rounded",style:{width:a}}),e.jsx("div",{className:"text-sm font-mono text-neutral-500",children:a})]},t))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Semantic Spacing"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:Object.entries(D).map(([t,a])=>e.jsxs("div",{className:"p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 capitalize",children:t}),e.jsx("div",{className:"space-y-2",children:Object.entries(a).map(([c,x])=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-24 text-sm font-mono text-neutral-600 dark:text-neutral-400",children:c}),e.jsx("div",{className:"bg-brand-500 h-6 rounded",style:{width:x}}),e.jsx("div",{className:"text-xs font-mono text-neutral-500",children:x})]},c))})]},t))})]})]})})},i={render:()=>e.jsx("div",{className:"p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen",children:e.jsxs("div",{className:"max-w-7xl mx-auto space-y-12",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2",children:"Elevation System"}),e.jsx("p",{className:"text-lg text-neutral-600 dark:text-neutral-400",children:"Subtle shadows for visual depth and hierarchy"})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Shadow Levels"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:Object.entries(m).filter(([t])=>!["none","inner","brand"].includes(t)).map(([t,a])=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"h-32 bg-neutral-0 dark:bg-neutral-800 rounded-lg flex items-center justify-center",style:{boxShadow:a},children:e.jsxs("span",{className:"text-neutral-900 dark:text-neutral-100 font-medium",children:["shadow-",t]})}),e.jsx("p",{className:"text-xs font-mono text-neutral-600 dark:text-neutral-400",children:a})]},t))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4",children:"Brand Shadow"}),e.jsx("div",{className:"p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:e.jsx("div",{className:"h-24 bg-neutral-0 dark:bg-neutral-900 rounded-lg flex items-center justify-center",style:{boxShadow:m.brand},children:e.jsx("span",{className:"text-neutral-900 dark:text-neutral-100 font-medium",children:"Focus Ring (Brand Shadow)"})})})]})]})})},o={render:()=>e.jsx("div",{className:"p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen",children:e.jsxs("div",{className:"max-w-4xl mx-auto space-y-12",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2",children:"Design Principles"}),e.jsx("p",{className:"text-lg text-neutral-600 dark:text-neutral-400",children:"Inspired by Vercel Geist and Apple HIG"})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("h2",{className:"text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3",children:"1. Clarity (Apple HIG)"}),e.jsx("p",{className:"text-base text-neutral-700 dark:text-neutral-300",children:"Everything in the interface should be immediately understandable. Use precise language, clear visual hierarchy, and purposeful design."})]}),e.jsxs("div",{className:"p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("h2",{className:"text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3",children:"2. Simplicity (Vercel Geist)"}),e.jsx("p",{className:"text-base text-neutral-700 dark:text-neutral-300",children:"Embrace minimalism and restraint. Remove unnecessary decoration and focus on content and functionality."})]}),e.jsxs("div",{className:"p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("h2",{className:"text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3",children:"3. Depth (Apple Liquid Glass)"}),e.jsx("p",{className:"text-base text-neutral-700 dark:text-neutral-300",children:"Use subtle layers, translucency, and shadows to create visual hierarchy and guide attention."})]}),e.jsxs("div",{className:"p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("h2",{className:"text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3",children:"4. Accessibility First"}),e.jsx("p",{className:"text-base text-neutral-700 dark:text-neutral-300",children:"Every component must be accessible by default. WCAG AAA compliance with 7:1 contrast ratios, keyboard navigation, and screen reader support."})]}),e.jsxs("div",{className:"p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg",children:[e.jsx("h2",{className:"text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3",children:"5. Performance"}),e.jsx("p",{className:"text-base text-neutral-700 dark:text-neutral-300",children:"Optimized components with efficient rendering, code splitting, and proper memoization for fast, responsive interfaces."})]})]})]})})};var u,p,h,b,v;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Color System</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        High-contrast, accessible color palette for light and dark themes
                    </p>
                </div>

                {/* Neutral Colors */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Neutral (Slate) - UI Colors</h2>
                    <div className="grid grid-cols-11 gap-2">
                        {Object.entries(colors.neutral).map(([key, value]) => <div key={key} className="space-y-2">
                                <div className="h-20 rounded-md border border-neutral-200 dark:border-neutral-700" style={{
              backgroundColor: value
            }} />
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="font-mono">{key}</div>
                                    <div className="font-mono text-[10px]">{value}</div>
                                </div>
                            </div>)}
                    </div>
                </div>

                {/* Brand Colors */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Brand (Purple) - Primary Actions</h2>
                    <div className="grid grid-cols-9 gap-2">
                        {Object.entries(colors.brand).map(([key, value]) => <div key={key} className="space-y-2">
                                <div className="h-20 rounded-md border border-neutral-200 dark:border-neutral-700" style={{
              backgroundColor: value
            }} />
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="font-mono">{key}</div>
                                    <div className="font-mono text-[10px]">{value}</div>
                                </div>
                            </div>)}
                    </div>
                </div>

                {/* Semantic Colors */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Semantic Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Success */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">Success (Green)</h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.success).map(([key, value]) => <div key={key} className="space-y-1">
                                        <div className="h-12 rounded border border-neutral-200 dark:border-neutral-700" style={{
                  backgroundColor: value
                }} />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                    </div>)}
                            </div>
                        </div>

                        {/* Error */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">Error (Red)</h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.error).map(([key, value]) => <div key={key} className="space-y-1">
                                        <div className="h-12 rounded border border-neutral-200 dark:border-neutral-700" style={{
                  backgroundColor: value
                }} />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                    </div>)}
                            </div>
                        </div>

                        {/* Warning */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">Warning (Amber)</h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.warning).map(([key, value]) => <div key={key} className="space-y-1">
                                        <div className="h-12 rounded border border-neutral-200 dark:border-neutral-700" style={{
                  backgroundColor: value
                }} />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                    </div>)}
                            </div>
                        </div>

                        {/* Info */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">Info (Blue)</h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.info).map(([key, value]) => <div key={key} className="space-y-1">
                                        <div className="h-12 rounded border border-neutral-200 dark:border-neutral-700" style={{
                  backgroundColor: value
                }} />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}`,...(h=(p=s.parameters)==null?void 0:p.docs)==null?void 0:h.source},description:{story:`Color Palette

Our color system is built on high-contrast, accessible colors.
All combinations meet WCAG AAA standards (7:1 contrast ratio).`,...(v=(b=s.parameters)==null?void 0:b.docs)==null?void 0:v.description}}};var g,N,k,f,y;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Typography</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">Modern, legible type system optimized for screen reading</p>
                </div>

                {/* Font Families */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Font Families</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">font-sans</p>
                            <p className="text-2xl font-sans text-neutral-900 dark:text-neutral-100">
                                Inter - The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">font-mono</p>
                            <p className="text-2xl font-mono text-neutral-900 dark:text-neutral-100">
                                JetBrains Mono - The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                    </div>
                </div>

                {/* Type Scale */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Type Scale</h2>
                    <div className="space-y-4">
                        {Object.entries(fontSizes).map(([key, value]) => <div key={key} className="flex items-baseline gap-4">
                                <div className="w-20 text-sm font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                <div className="flex-1 text-neutral-900 dark:text-neutral-100" style={{
              fontSize: value.size,
              lineHeight: value.lineHeight
            }}>
                                    The quick brown fox jumps over the lazy dog
                                </div>
                                <div className="text-sm font-mono text-neutral-500">{value.size}</div>
                            </div>)}
                    </div>
                </div>

                {/* Font Weights */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Font Weights</h2>
                    <div className="space-y-2">
                        {Object.entries(fontWeights).map(([key, value]) => <div key={key} className="flex items-center gap-4">
                                <div className="w-32 text-sm font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                <div className="flex-1 text-2xl text-neutral-900 dark:text-neutral-100" style={{
              fontWeight: value
            }}>
                                    The quick brown fox jumps over the lazy dog
                                </div>
                                <div className="text-sm font-mono text-neutral-500">{value}</div>
                            </div>)}
                    </div>
                </div>

                {/* Typography Presets */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Typography Presets</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Display</p>
                            <div className="text-5xl font-extrabold text-neutral-900 dark:text-neutral-100">Display Text</div>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">H1</p>
                            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">Heading 1</h1>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">H2</p>
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Heading 2</h2>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">H3</p>
                            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Heading 3</h3>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Body</p>
                            <p className="text-base text-neutral-700 dark:text-neutral-300">
                                This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Caption</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">This is caption text</p>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Code</p>
                            <code className="font-mono text-sm bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                const greeting = &apos;Hello, world!&apos;;
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}`,...(k=(N=l.parameters)==null?void 0:N.docs)==null?void 0:k.source},description:{story:`Typography

Our type system uses Inter for UI and JetBrains Mono for code.
Based on a modular scale (1.25) for harmonious proportions.`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.description}}};var j,S,w,z,H;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Spacing System</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">8px-based grid for consistent layouts</p>
                </div>

                {/* Spacing Scale */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Spacing Scale</h2>
                    <div className="space-y-4">
                        {Object.entries(spacing).filter(([key]) => !isNaN(Number(key)) && Number(key) <= 20).map(([key, value]) => <div key={key} className="flex items-center gap-4">
                                    <div className="w-20 text-sm font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                    <div className="bg-brand-500 h-8 rounded" style={{
              width: value
            }} />
                                    <div className="text-sm font-mono text-neutral-500">{value}</div>
                                </div>)}
                    </div>
                </div>

                {/* Semantic Spacing */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Semantic Spacing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(semanticSpacing).map(([category, values]) => <div key={category} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 capitalize">{category}</h3>
                                <div className="space-y-2">
                                    {Object.entries(values).map(([name, value]) => <div key={name} className="flex items-center gap-3">
                                            <div className="w-24 text-sm font-mono text-neutral-600 dark:text-neutral-400">{name}</div>
                                            <div className="bg-brand-500 h-6 rounded" style={{
                  width: value
                }} />
                                            <div className="text-xs font-mono text-neutral-500">{value}</div>
                                        </div>)}
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </div>
}`,...(w=(S=d.parameters)==null?void 0:S.docs)==null?void 0:w.source},description:{story:`Spacing

8px-based spacing scale for consistent layouts.`,...(H=(z=d.parameters)==null?void 0:z.docs)==null?void 0:H.description}}};var C,O,A,T,G;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Elevation System</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">Subtle shadows for visual depth and hierarchy</p>
                </div>

                {/* Shadows */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Shadow Levels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(shadows).filter(([key]) => !['none', 'inner', 'brand'].includes(key)).map(([key, value]) => <div key={key} className="space-y-2">
                                    <div className="h-32 bg-neutral-0 dark:bg-neutral-800 rounded-lg flex items-center justify-center" style={{
              boxShadow: value
            }}>
                                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">shadow-{key}</span>
                                    </div>
                                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">{value}</p>
                                </div>)}
                    </div>
                </div>

                {/* Brand Shadow (Focus Ring) */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Brand Shadow</h2>
                    <div className="p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <div className="h-24 bg-neutral-0 dark:bg-neutral-900 rounded-lg flex items-center justify-center" style={{
            boxShadow: shadows.brand
          }}>
                            <span className="text-neutral-900 dark:text-neutral-100 font-medium">Focus Ring (Brand Shadow)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}`,...(A=(O=i.parameters)==null?void 0:O.docs)==null?void 0:A.source},description:{story:`Shadows & Elevation

Subtle depth through shadows inspired by Apple's Liquid Glass.`,...(G=(T=i.parameters)==null?void 0:T.docs)==null?void 0:G.description}}};var E,I,B,F,P;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Design Principles</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">Inspired by Vercel Geist and Apple HIG</p>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">1. Clarity (Apple HIG)</h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Everything in the interface should be immediately understandable. Use precise language, clear visual hierarchy, and
                            purposeful design.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">2. Simplicity (Vercel Geist)</h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Embrace minimalism and restraint. Remove unnecessary decoration and focus on content and functionality.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">3. Depth (Apple Liquid Glass)</h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Use subtle layers, translucency, and shadows to create visual hierarchy and guide attention.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">4. Accessibility First</h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Every component must be accessible by default. WCAG AAA compliance with 7:1 contrast ratios, keyboard navigation, and
                            screen reader support.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">5. Performance</h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Optimized components with efficient rendering, code splitting, and proper memoization for fast, responsive interfaces.
                        </p>
                    </div>
                </div>
            </div>
        </div>
}`,...(B=(I=o.parameters)==null?void 0:I.docs)==null?void 0:B.source},description:{story:`Design Principles

The foundational principles guiding our design decisions.`,...(P=(F=o.parameters)==null?void 0:F.docs)==null?void 0:P.description}}};const V=["Colors","Typography","Spacing","Elevation","Principles"];export{s as Colors,i as Elevation,o as Principles,d as Spacing,l as Typography,V as __namedExportsOrder,M as default};
