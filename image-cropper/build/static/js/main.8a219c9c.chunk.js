(this["webpackJsonpimage-crop"]=this["webpackJsonpimage-crop"]||[]).push([[0],{29:function(e,n,t){},49:function(e,n,t){"use strict";t.r(n);var a=t(0),s=t.n(a),i=t(20),c=t.n(i),o=t(23),l=t(2),r=t(11),d=t(12),u=t(8),p=t(14),g=t(13),j=(t(29),t(21)),m=t.n(j),f=t(1),h=null,b=null,v=null;function O(){null===b?(clearInterval(v),v=null):null===b||b.closed?null!==b&&b.closed&&(clearInterval(v),h.focus(),h.close({message:"child was closed"}),v=null,b=null):b.focus()}var x=function(e){Object(p.a)(t,e);var n=Object(g.a)(t);function t(e){var a;return Object(r.a)(this,t),(a=n.call(this,e)).onClickHandler=a.onClickHandler.bind(Object(u.a)(a)),h=window.self,a}return Object(d.a)(t,[{key:"onClickHandler",value:function(){var e=this.props,n=e.url,t=e.name,a=e.opts,s=e.croppedImage,i=e.allImages;!b||b.closed?(b=h.open(n,t,a),setTimeout((function(){b.opener.postMessage({message:"Opening Popup",croppedImage:s,allAssets:i},"*")}),0),null===v&&(v=setInterval(O,2e3))):b.focus()}},{key:"render",value:function(){var e=this.props.children;return Object(f.jsx)("button",{className:"choose_btn",type:"choose_btn",onClick:this.onClickHandler,children:e})}}]),t}(s.a.Component);x.defaultProps={name:"Popup",opts:"dependent=".concat(1,", alwaysOnTop=",0,", alwaysRaised=",1,", width=",900,", height=",590,", left=",250,", top=",120)};var y=t(22),I=t.n(y),w=function(e){Object(p.a)(t,e);var n=Object(g.a)(t);function t(e){var a;return Object(r.a)(this,t),(a=n.call(this,e)).removeVideo=function(e){var n=e.currentTarget.dataset.id,t=a.state.croppedImage;t.splice(t.findIndex((function(e){return e.uid===n})),1),a.saveExtensionData(t)},a.dragulaDecorator=function(e){if(e){m()([e],{copySortSource:!0})}},a.extension={},a.state={message:"",croppedImage:[],allImages:[],config:{}},a.sonResponse=a.sonResponse.bind(Object(u.a)(a)),a.isEmpty=a.isEmpty.bind(Object(u.a)(a)),a}return Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=this;I.a.init().then((function(t){var a=t.field.getData(),s=t.stack.Asset.Query();t.window.enableAutoResizing(),console.log("initialVideos",a),s.regex("content_type","image/*").find().then((function(n){e.setState({allImages:n})})).catch((function(e){console.log(e)})),null===a||void 0===a||e.isEmpty(a)?e.setState({config:t.config},(function(){e.extension=t,t.window.enableAutoResizing(),window.addEventListener("message",n,!1)})):e.setState({config:t.config,croppedImage:a},(function(){e.extension=t,t.window.enableAutoResizing(),window.addEventListener("message",n,!1)}))}));var n=function(n){var t=n.data,a=e.state,s=a.croppedImage,i=a.allImages,c=a.config;t.getConfig?n.source.postMessage({message:"Sending Config files",config:c,croppedImage:s,allImages:i},n.origin):t.croppedImage&&e.saveExtensionData(t.croppedImage)}}},{key:"saveExtensionData",value:function(e){var n=[];e.forEach((function(e){n.push(e)})),console.log("saveExtensionData",e,n),this.extension.field.setData(n),this.setState({croppedImage:e})}},{key:"sonResponse",value:function(e,n){e&&this.setState({message:n.message})}},{key:"isEmpty",value:function(e){for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n))return!1;return!0}},{key:"bytesToSize",value:function(e){if(0===e)return"0 Bytes";var n=parseInt(Math.floor(Math.log(e)/Math.log(1024)));return Math.round(e/Math.pow(1024,n),2)+" "+["Bytes","KB","MB","GB","TB"][n]}},{key:"render",value:function(){var e=this,n=this.state,t=n.croppedImage,a=n.config,s=n.allImages;return console.log("this.state parent",this.state),Object(f.jsx)("header",{className:"App-header",children:Object(f.jsxs)("div",{className:"wrapper",children:[Object(f.jsxs)("div",{className:"container",children:[Object(f.jsx)("div",{className:"reference-loading",style:{display:"none"},children:Object(f.jsxs)("div",{className:"loading-flash",children:[Object(f.jsx)("div",{}),Object(f.jsx)("div",{}),Object(f.jsx)("div",{}),Object(f.jsx)("div",{})]})}),Object(f.jsx)("div",{className:"main",children:Object(f.jsx)("div",{className:"selected-item",children:Object(f.jsx)("div",{className:"row selected-list",children:Object(f.jsx)("ul",{className:"drag1",ref:this.dragulaDecorator,children:null===t||void 0===t?void 0:t.map((function(n,t){return Object(f.jsx)("li",{id:n.uid,children:Object(f.jsxs)("div",{className:"file",children:[Object(f.jsx)("a",{href:n.croppedUrl,target:"_blank",className:"fileimage",children:Object(f.jsx)("span",{className:"fileimg",children:Object(f.jsx)("img",{src:n.croppedUrl})})}),Object(f.jsx)("span",{children:n.fileName}),Object(f.jsx)("span",{className:"file-size",children:e.bytesToSize(n.fileSize)}),Object(f.jsx)("div",{className:"file-action trash","data-id":n.uid,onClick:e.removeVideo.bind(e),children:Object(f.jsx)("span",{className:"close-icon"})})]})},t)}))})})})})]}),Object(f.jsx)(x,{url:a.redirectUrl,bridge:this.sonResponse,croppedImage:t,allImages:s,children:"Crop Image"})]})})}}]),t}(s.a.Component);var k=function(){return Object(f.jsx)("div",{className:"App",children:Object(f.jsx)(o.a,{children:Object(f.jsx)(l.c,{children:Object(f.jsx)(l.a,{exact:!0,path:"/",component:w})})})})},N=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,50)).then((function(n){var t=n.getCLS,a=n.getFID,s=n.getFCP,i=n.getLCP,c=n.getTTFB;t(e),a(e),s(e),i(e),c(e)}))};c.a.render(Object(f.jsx)(s.a.StrictMode,{children:Object(f.jsx)(k,{})}),document.getElementById("root")),N()}},[[49,1,2]]]);