"use strict";(self.webpackChunkrucio_webui=self.webpackChunkrucio_webui||[]).push([[5708],{"./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_objectWithoutProperties});var _objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=(0,_objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__.Z)(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}},"./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}__webpack_require__.d(__webpack_exports__,{Z:()=>_objectWithoutPropertiesLoose})},"./src/component-library/features/legacy/Tags/BasicStatusTag.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{BasicTag:()=>BasicTag,__namedExportsOrder:()=>__namedExportsOrder,default:()=>BasicStatusTag_stories});var react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),objectWithoutProperties=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),_excluded=["text","status"],__jsx=react.createElement,BasicStatusTag=function BasicStatusTag(_ref){var _ref$text=_ref.text,text=void 0===_ref$text?"Check this out!":_ref$text,status=_ref.status,_useState=((0,objectWithoutProperties.Z)(_ref,_excluded),(0,react.useState)()),color=_useState[0],setColor=_useState[1];return(0,react.useEffect)((function(){setColor(function colorFn(status){switch(status){case"success":return"bg-base-success-300 dark:bg-base-success-600";case"error":return"bg-base-error-300 dark:bg-base-error-600";case"warning":return"bg-base-warning-300 dark:bg-base-warning-600";case"info":return"bg-base-info-300 dark:bg-base-info-600";default:return"bg-base-success-300 dark:bg-base-sucess-600"}}(status))}),[status]),__jsx("span",{key:status,className:"".concat(color," text-text-1000 dark:text-text-0 font-bold w-6 md:w-24 rounded text-center select-none flex justify-center items-center")},text)};BasicStatusTag.displayName="BasicStatusTag";try{BasicStatusTag.displayName="BasicStatusTag",BasicStatusTag.__docgenInfo={description:"",displayName:"BasicStatusTag",props:{text:{defaultValue:{value:"Check this out!"},description:"",name:"text",required:!1,type:{name:"string"}},status:{defaultValue:null,description:"",name:"status",required:!0,type:{name:"enum",value:[{value:'"error"'},{value:'"success"'},{value:'"warning"'},{value:'"info"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/component-library/features/legacy/Tags/BasicStatusTag.tsx#BasicStatusTag"]={docgenInfo:BasicStatusTag.__docgenInfo,name:"BasicStatusTag",path:"src/component-library/features/legacy/Tags/BasicStatusTag.tsx#BasicStatusTag"})}catch(__react_docgen_typescript_loader_error){}var BasicStatusTag_stories_jsx=react.createElement;const BasicStatusTag_stories={title:"Components/Tags",component:BasicStatusTag};var Template=function Template(args){return BasicStatusTag_stories_jsx(BasicStatusTag,args)};Template.displayName="Template";var BasicTag=Template.bind({});BasicTag.args={text:"No Quota",status:"error"},BasicTag.parameters={...BasicTag.parameters,docs:{...BasicTag.parameters?.docs,source:{originalSource:"args => <B {...args} />",...BasicTag.parameters?.docs?.source}}};const __namedExportsOrder=["BasicTag"]}}]);