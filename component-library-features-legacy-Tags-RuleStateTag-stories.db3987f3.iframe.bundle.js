"use strict";(self.webpackChunkrucio_webui=self.webpackChunkrucio_webui||[]).push([[9845],{"./node_modules/@babel/runtime/helpers/esm/extends.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}__webpack_require__.d(__webpack_exports__,{Z:()=>_extends})},"./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_objectWithoutProperties});var _objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=(0,_objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__.Z)(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}},"./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}__webpack_require__.d(__webpack_exports__,{Z:()=>_objectWithoutPropertiesLoose})},"./src/component-library/features/legacy/Tags/RuleStateTag.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{RuleStateTag:()=>RuleStateTag,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),_lib_core_entity_rucio__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/lib/core/entity/rucio.ts"),_RuleStateTag__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/component-library/features/legacy/Tags/RuleStateTag.tsx"),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement;const __WEBPACK_DEFAULT_EXPORT__={title:"components/Tags",component:_RuleStateTag__WEBPACK_IMPORTED_MODULE_2__.J};var Template=function Template(args){return __jsx(_RuleStateTag__WEBPACK_IMPORTED_MODULE_2__.J,args)};Template.displayName="Template";var RuleStateTag=Template.bind({});RuleStateTag.args={state:_lib_core_entity_rucio__WEBPACK_IMPORTED_MODULE_1__.pJ.OK,tiny:!1},RuleStateTag.parameters={...RuleStateTag.parameters,docs:{...RuleStateTag.parameters?.docs,source:{originalSource:"args => <R {...args} />",...RuleStateTag.parameters?.docs?.source}}};const __namedExportsOrder=["RuleStateTag"]},"./src/component-library/features/legacy/Tags/RuleStateTag.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>RuleStateTag});var _home_runner_work_webui_webui_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),_home_runner_work_webui_webui_node_modules_babel_runtime_helpers_esm_objectWithoutProperties_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),tailwind_merge__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/tailwind-merge/dist/lib/tw-merge.mjs"),_excluded=["state","tiny"],_excluded2=["className"],__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement,RuleStateTag=function RuleStateTag(_ref){var _ref$state=_ref.state,state=void 0===_ref$state?"OK":_ref$state,_ref$tiny=_ref.tiny,tiny=void 0!==_ref$tiny&&_ref$tiny,props=(0,_home_runner_work_webui_webui_node_modules_babel_runtime_helpers_esm_objectWithoutProperties_js__WEBPACK_IMPORTED_MODULE_1__.Z)(_ref,_excluded),className=props.className,otherprops=(0,_home_runner_work_webui_webui_node_modules_babel_runtime_helpers_esm_objectWithoutProperties_js__WEBPACK_IMPORTED_MODULE_1__.Z)(props,_excluded2);return __jsx("span",(0,_home_runner_work_webui_webui_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_2__.Z)({className:(0,tailwind_merge__WEBPACK_IMPORTED_MODULE_3__.m)("OK"===state?"bg-base-success-300 border-base-success-700 dark:bg-base-success-700 dark:border-base-success-200":"Stuck"===state?"bg-base-error-400 border-base-error-700 dark:bg-base-error-700 dark:border-base-error-200":"Replicating"===state?"bg-base-warning-300 border-base-warning-700 dark:bg-base-warning-700 dark:border-base-warning-200":"Suspended"===state?"bg-neutral-300 border-neutral-700 dark:bg-neutral-700 dark:border-neutral-200":"Waiting_Approval"===state?"bg-extra-indigo-300 border-extra-indigo-700 dark:bg-extra-indigo-700 dark:border-extra-indigo-200":"bg-base-info-300 border-base-info-700 dark:bg-base-info-700 dark:border-base-info-200","text-text-1000 dark:text-text-0 underline font-sans",tiny?"w-6 h-6 rounded-full border text-center select-none shrink-0":"w-28 md:w-44 rounded border text-center","flex justify-center items-center",null!=className?className:"")},otherprops),tiny?{Replicating:"R",OK:"O",Stuck:"S",Suspended:"U",Waiting_Approval:"W",Inject:"I"}[state]:{Replicating:"Replicating",OK:"OK",Stuck:"Stuck",Suspended:"Suspended",Waiting_Approval:"Waiting Approval",Inject:"Inject"}[state])};RuleStateTag.displayName="RuleStateTag";try{RuleStateTag.displayName="RuleStateTag",RuleStateTag.__docgenInfo={description:"",displayName:"RuleStateTag",props:{state:{defaultValue:{value:"OK"},description:"",name:"state",required:!1,type:{name:"enum",value:[{value:'"Replicating"'},{value:'"OK"'},{value:'"Stuck"'},{value:'"Suspended"'},{value:'"Waiting_Approval"'},{value:'"Inject"'},{value:'"Unknown"'}]}},tiny:{defaultValue:{value:"false"},description:"",name:"tiny",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/component-library/features/legacy/Tags/RuleStateTag.tsx#RuleStateTag"]={docgenInfo:RuleStateTag.__docgenInfo,name:"RuleStateTag",path:"src/component-library/features/legacy/Tags/RuleStateTag.tsx#RuleStateTag"})}catch(__react_docgen_typescript_loader_error){}},"./src/lib/core/entity/rucio.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ik:()=>LockState,N0:()=>RuleNotification,b9:()=>DIDType,cp:()=>ReplicaState,jG:()=>DIDAvailability,jc:()=>SubscriptionState,mi:()=>RSEType,pJ:()=>RuleState});var DIDAvailability=function(DIDAvailability){return DIDAvailability.AVAILABLE="Available",DIDAvailability.DELETED="Deleted",DIDAvailability.LOST="Lost",DIDAvailability.UNKNOWN="Unknown",DIDAvailability}({}),LockState=function(LockState){return LockState.REPLICATING="R",LockState.OK="O",LockState.STUCK="S",LockState.UNKNOWN="U",LockState}({}),RuleNotification=function(RuleNotification){return RuleNotification.Yes="Y",RuleNotification.No="N",RuleNotification.Close="C",RuleNotification.Progress="P",RuleNotification}({}),DIDType=function(DIDType){return DIDType.DATASET="Dataset",DIDType.CONTAINER="Container",DIDType.COLLECTION="Collection",DIDType.FILE="File",DIDType.ALL="All",DIDType.UNKNOWN="Unknown",DIDType.DERIVED="Derived",DIDType}({}),RSEType=function(RSEType){return RSEType.DISK="DISK",RSEType.TAPE="TAPE",RSEType.UNKNOWN="UNKNOWN",RSEType}({}),ReplicaState=function(ReplicaState){return ReplicaState.AVAILABLE="Available",ReplicaState.UNAVAILABLE="Unavailable",ReplicaState.COPYING="Copying",ReplicaState.BEING_DELETED="Being_Deleted",ReplicaState.BAD="Bad",ReplicaState.TEMPORARY_UNAVAILABLE="Temporary_Unavailable",ReplicaState.UNKNOWN="Unknown",ReplicaState}({}),RuleState=function(RuleState){return RuleState.REPLICATING="Replicating",RuleState.OK="OK",RuleState.STUCK="Stuck",RuleState.SUSPENDED="Suspended",RuleState.WAITING_APPROVAL="Waiting_Approval",RuleState.INJECT="Inject",RuleState.UNKNOWN="Unknown",RuleState}({}),SubscriptionState=function(SubscriptionState){return SubscriptionState.ACTIVE="A",SubscriptionState.INACTIVE="I",SubscriptionState.NEW="N",SubscriptionState.UPDATED="U",SubscriptionState.BROKEN="B",SubscriptionState.UNKNOWN="UNKNOWN",SubscriptionState}({})}}]);