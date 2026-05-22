class i{constructor(s){this.toast=s,this.invalidCount=0}isValid(s){if(s.status==="success")return!0;this.invalidCount++;const t=this.invalidCount>1?"s":"";return this.toast({variant:"error",title:`Failed to resolve ${this.invalidCount} element${t}`,description:s.message||"Please see the console for details."}),console.error(`Invalid element
Status: ${s.status}
Message: ${s.message}`),!1}reset(){this.invalidCount=0}}export{i as B};
