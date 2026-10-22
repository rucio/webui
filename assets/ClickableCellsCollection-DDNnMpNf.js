import{n as e}from"./rolldown-runtime-Bjp52BOI.js";import{t}from"./jsx-runtime-CndCZlyt.js";import{n,t as r}from"./ClickableCell-DdBFXhcg.js";var i,a,o,s,c;function l(){return(l=e((()=>{i=t(),n(),a=e=>e.value?(0,i.jsx)(r,{href:`/rse/${encodeURIComponent(e.value)}`,children:e.value}):null,o=e=>{if(!e.value)return null;let t=/^([A-Z0-9]+([_-][A-Z0-9]+)*)$/.test(e.value)?`/rse/${encodeURIComponent(e.value)}`:`/rses?expression=${encodeURIComponent(e.value)}&autoSearch=true`;return(0,i.jsx)(r,{href:t,children:e.value})},s=e=>{if(!e.value)return null;let[t,n]=e.value;return!t||!n?null:(0,i.jsxs)(r,{href:`/did/${encodeURIComponent(t)}/${encodeURIComponent(n)}`,children:[t,`:`,n]})},c=e=>e.value?(0,i.jsx)(r,{href:`/rule/${e.value}`,children:e.value}):null,a.__docgenInfo={description:`Creates a clickable component for RSE which redirects to its own page.

@param {string} props.value name of the RSE.

@returns Clickable component for RSE or \`null\` if name of the RSE is an empty string.`,methods:[],displayName:`ClickableRSECell`,props:{value:{required:!0,tsType:{name:`string`},description:``}}},o.__docgenInfo={description:`Creates a clickable component for RSE expression, which checks whether the expression:
* is a single RSE name - then it redirects to RSE's own page,
* is the real expression with operators, wildcards etc. - then it redirects to RSE search panel with already filtered RSEs based on the expression.

@param {string} props.value RSE expression.

@returns Clickable component for RSE expression or \`null\`if RSE expression is an empty string.`,methods:[],displayName:`ClickableRSEExpressionCell`,props:{value:{required:!0,tsType:{name:`string`},description:``}}},s.__docgenInfo={description:"Creates a clickable component for DID which redirects to its own page.\n\n@param {string[]} props.value an array which stores `scope` and `name` of the DID, it should look like that: `[scope, name]`.\n\n@returns Clickable component for DID or `null` if either `scope` or `name` is an empty string.",methods:[],displayName:`ClickableDIDCell`,props:{value:{required:!0,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``}}},c.__docgenInfo={description:`Creates a clickable component for Rule which redirects to its own page.

@param {string} props.value ID of a rule.

@returns Clickable component for Rule or \`null\` if rule's ID is an empty string.`,methods:[],displayName:`ClickableRuleIdCell`,props:{value:{required:!0,tsType:{name:`string`},description:``}}}})))()}export{l as a,c as i,a as n,o as r,s as t};