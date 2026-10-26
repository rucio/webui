import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./react-DZrhAQ_7.js";import{t as n}from"./jsx-runtime-CndCZlyt.js";import{r,t as i}from"./input-CulfB0Jv.js";import{m as a,n as o,t as s}from"./rucio-CT8PoFzM.js";import{i as c,t as l}from"./account-validation-DtKInHsj.js";import{n as u,t as d}from"./FieldSelect-DUJv3rBv.js";import{n as f,t as p}from"./SearchButton-DW15JBU2.js";var m,h,g,_,v,y;function b(){return(b=e((()=>{m=n(),r(),u(),f(),a(),c(),h=`accounts-filter-name-error`,g={account:``,type:`ALL`,identity:``},_=e=>e===``||l.test(e),v=[{value:`ALL`,label:`All`},...s.map(e=>({value:e,label:o[e]}))],y=({filters:e,onChange:t,onSearch:n,onStop:r,isRunning:a})=>{let o=!_(e.account),s=e=>{e.preventDefault(),o||n()};return(0,m.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,m.jsxs)(`div`,{className:`flex flex-col gap-3 md:flex-row md:items-end`,children:[(0,m.jsxs)(`div`,{className:`flex-1 space-y-1`,children:[(0,m.jsx)(`label`,{htmlFor:`accounts-filter-name`,className:`text-sm text-neutral-900 dark:text-neutral-100`,children:`Name`}),(0,m.jsx)(i,{id:`accounts-filter-name`,value:e.account,onChange:n=>t({...e,account:n.target.value}),onEnterKey:s,placeholder:`e.g., jdoe*`,error:o,"aria-invalid":o,"aria-describedby":o?h:void 0})]}),(0,m.jsxs)(`div`,{className:`space-y-1 md:w-44`,children:[(0,m.jsx)(`label`,{htmlFor:`accounts-filter-type`,className:`text-sm text-neutral-900 dark:text-neutral-100`,children:`Type`}),(0,m.jsx)(d,{id:`accounts-filter-type`,value:e.type,onValueChange:n=>t({...e,type:n}),options:v})]}),(0,m.jsxs)(`div`,{className:`flex-1 space-y-1`,children:[(0,m.jsx)(`label`,{htmlFor:`accounts-filter-identity`,className:`text-sm text-neutral-900 dark:text-neutral-100`,children:`Identity`}),(0,m.jsx)(i,{id:`accounts-filter-identity`,value:e.identity,onChange:n=>t({...e,identity:n.target.value}),onEnterKey:s,placeholder:`CN=... or username`})]}),(0,m.jsx)(p,{isRunning:a,onSearch:s,onStop:e=>{e.preventDefault(),r()},className:`md:w-40`})]}),o&&(0,m.jsx)(`p`,{id:h,role:`alert`,className:`text-xs text-base-error-600 dark:text-base-error-400`,children:`Use up to 25 lowercase letters, digits, hyphens, underscores or * wildcards`})]})},y.__docgenInfo={description:``,methods:[],displayName:`ListAccountsFilters`,props:{filters:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
    account: string;
    /** An \`AccountType\` value, or \`ALL\`. */
    type: string;
    identity: string;
}`,signature:{properties:[{key:`account`,value:{name:`string`,required:!0}},{key:`type`,value:{name:`string`,required:!0},description:"An `AccountType` value, or `ALL`."},{key:`identity`,value:{name:`string`,required:!0}}]}},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(filters: AccountFilters) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
    account: string;
    /** An \`AccountType\` value, or \`ALL\`. */
    type: string;
    identity: string;
}`,signature:{properties:[{key:`account`,value:{name:`string`,required:!0}},{key:`type`,value:{name:`string`,required:!0},description:"An `AccountType` value, or `ALL`."},{key:`identity`,value:{name:`string`,required:!0}}]}},name:`filters`}],return:{name:`void`}}},description:``},onSearch:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onStop:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},isRunning:{required:!0,tsType:{name:`boolean`},description:``}}}})))()}var x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{x=n(),S=t(),b(),C=({initial:e=g,isRunning:t=!1})=>{let[n,r]=(0,S.useState)(e);return(0,x.jsx)(y,{filters:n,onChange:r,onSearch:()=>{},onStop:()=>{},isRunning:t})},w={title:`Components/Pages/Account/List/ListAccountsFilters`,component:C,tags:[`autodocs`]},T={},E={args:{initial:{account:`j*`,type:`GROUP`,identity:`CN=jdoe`}}},D={args:{initial:{...g,account:`Bad Name!`}}},O={args:{isRunning:!0}},k=[`Empty`,`Prefilled`,`InvalidName`,`Running`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    initial: {
      account: 'j*',
      type: 'GROUP',
      identity: 'CN=jdoe'
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    initial: {
      ...EMPTY_FILTERS,
      account: 'Bad Name!'
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    isRunning: true
  }
}`,...O.parameters?.docs?.source}}}})))()}A();export{T as Empty,D as InvalidName,E as Prefilled,O as Running,k as __namedExportsOrder,w as default};