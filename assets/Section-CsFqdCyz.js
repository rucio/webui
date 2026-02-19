import{r as i,j as p}from"./iframe-CbZ9RuD1.js";import{c as l}from"./index-DSpI4bVK.js";import{c}from"./utils-DsKtx5Xo.js";const m=l("w-full",{variants:{variant:{default:"",subtle:"bg-neutral-50 dark:bg-neutral-900",bordered:"border border-neutral-200 dark:border-neutral-800 rounded-lg",elevated:"bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm"},spacing:{none:"",sm:"py-4 md:py-6",md:"py-6 md:py-8",lg:"py-8 md:py-12",xl:"py-12 md:py-16"},padding:{none:"",sm:"px-4 md:px-6",md:"px-6 md:px-8",lg:"px-8 md:px-12"}},defaultVariants:{variant:"default",spacing:"md",padding:"none"}}),e=i.forwardRef(({className:a,variant:n,spacing:r,padding:t,children:s,...o},d)=>p.jsx("section",{ref:d,className:c(m({variant:n,spacing:r,padding:t}),a),...o,children:s}));e.displayName="Section";e.__docgenInfo={description:`Section component for semantic page structure and consistent spacing

@example
\`\`\`tsx
<Section spacing="lg" aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
  <p>Content</p>
</Section>
\`\`\``,methods:[],displayName:"Section",props:{"aria-label":{required:!1,tsType:{name:"string"},description:"ARIA label for the section"},"aria-labelledby":{required:!1,tsType:{name:"string"},description:"ARIA labelledby for the section"}},composes:["VariantProps"]};export{e as S};
