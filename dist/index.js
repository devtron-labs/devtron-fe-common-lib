var e=6e4,t=process.env.REACT_APP_ORCHESTRATOR_ROOT,n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},n(e,t)};function r(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,s)}c((r=r.apply(e,t||[])).next())}))}function o(e,t){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(s){return function(c){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,s[0]&&(i=0)),i;)try{if(n=1,r&&(o=2&s[0]?r.return:s[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;switch(r=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return i.label++,{value:s[1],done:!1};case 5:i.label++,r=s[1],s=[0];continue;case 7:s=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==s[0]&&2!==s[0])){i=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){i.label=s[1];break}if(6===s[0]&&i.label<o[1]){i.label=o[1],o=s;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(s);break}o[2]&&i.ops.pop(),i.trys.pop();continue}s=t.call(e,i)}catch(e){s=[6,e],r=0}finally{n=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,c])}}}var a=function(e){this.code=e.code||0,this.userMessage=e.userMessage||"",this.internalMessage=e.internalMessage||"",this.moreInfo=e.moreInfo||""},i=function(e){function t(n){var r=e.call(this)||this;r.code=n.code;var o=n.errors.reduce((function(e,t){return e+="".concat(t.internalMessage||t.userMessage)}),"");return r.name="[".concat(n.code.toString(),"]"),r.message=o,r.errors=n.errors.map((function(e){return new a(e)})),Object.setPrototypeOf(r,t.prototype),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}(t,e),t}(Error),s={100:"Continue",101:"Switching Protocols",102:"Processing(WebDAV)",200:"OK",201:"Created",202:"Accepted",203:"Non - Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi - Status(WebDAV)",208:"Already Reported(WebDAV)",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect(experimental)",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request - URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",418:"I'm a teapot",420:"Enhance Your Calm(Twitter)",422:"Unprocessable Entity(WebDAV)",423:"Locked(WebDAV)",424:"Failed Dependency(WebDAV)",425:"Reserved for WebDAV",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",444:"No Response(Nginx)",449:"Retry With(Microsoft)",450:"Blocked by Windows Parental Controls(Microsoft)",451:"Unavailable For Legal Reasons",499:"Client Closed Request(Nginx)",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates(Experimental)",507:"Insufficient Storage(WebDAV)",508:"Loop Detected(WebDAV)",509:"Bandwidth Limit Exceeded(Apache)",510:"Not Extended",511:"Network Authentication Required",598:"Network read timeout error",599:"Network connect timeout error"};function c(e,t){return r(this,void 0,void 0,(function(){var n,r,a,c;return o(this,(function(o){switch(o.label){case 0:return n=t.status,r=t.statusText||s[n],a=new i({code:n,errors:[]}),"application/json"===e?[3,1]:(r="".concat(s[n],". Please try again."),[3,3]);case 1:return[4,t.json()];case 2:(c=o.sent()).errors&&(a.errors=c.errors),o.label=3;case 3:throw a.errors=a.errors.length>0?a.errors:[{code:n,internalMessage:r,userMessage:r}],a}}))}))}function u(e,n,a,s,u,l){return void 0===u&&(u=!1),r(this,void 0,void 0,(function(){var d,f=this;return o(this,(function(p){return(d={method:n,signal:s,body:a?JSON.stringify(a):void 0}).credentials="include",[2,fetch("".concat(t,"/").concat(e),l?{method:n,body:a}:d).then((function(e){return r(f,void 0,void 0,(function(){var t;return o(this,(function(n){switch(n.label){case 0:if(t=e.headers.get("Content-Type"),401!==e.status)return[3,1];if(u)throw new i({code:401,errors:[{code:401,internalMessage:"Please login again",userMessage:"Please login again"}]});return[2,{code:401,status:"Unauthorized",result:[]}];case 1:return e.status>=300&&e.status<=599?[4,c(t,e)]:[3,3];case 2:return[2,n.sent()];case 3:if("application/json"===t)return[2,e.json().then((function(e){if(e.code>=300&&e.code<=599)throw new i({code:e.code,errors:e.errors});return e}))];if("octet-stream"===t||"application/octet-stream"===t)return[2,e];n.label=4;case 4:return[2]}}))}))}),(function(e){var t={code:0,userMessage:e.message,internalMessage:e.message,moreInfo:e.message};throw new i({code:0,errors:[t]})}))]}))}))}function l(e,t,n,r,o){var a=new AbortController,s=a.signal,c=new Promise((function(e,t){var n=(null==r?void 0:r.timeout)?r.timeout:6e4;setTimeout((function(){a.abort(),t({code:408,errors:[{code:408,internalMessage:"Request cancelled",userMessage:"Request Cancelled"}]})}),n)}));return Promise.race([u(e,t,n,(null==r?void 0:r.signal)||s,(null==r?void 0:r.preventAutoLogout)||!1,o),c]).catch((function(e){throw e instanceof i?e:new i({code:408,errors:[{code:408,internalMessage:"That took longer than expected.",userMessage:"That took longer than expected."}]})}))}var d=function(e,t,n,r){return l(e,"POST",t,n,r)},f=function(e,t,n){return l(e,"PUT",t,n)},p=function(e,t){return l(e,"GET",null,t)},h=function(e,t,n){return l(e,"DELETE",t,n)};export{t as Host,e as RequestTimeout,a as ServerError,i as ServerErrors,p as get,d as post,f as put,h as trash};
