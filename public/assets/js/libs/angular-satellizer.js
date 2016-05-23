/**
 * Satellizer 0.12.4
 * (c) 2014-2015 Sahat Yalkabov
 * License: MIT
 */
!function(e,t,n){"use strict";t.module("satellizer",[]).constant("SatellizerConfig",{httpInterceptor:!0,withCredentials:!0,tokenRoot:null,cordova:!1,baseUrl:"/",loginUrl:"/auth/login",signupUrl:"/auth/signup",unlinkUrl:"/auth/unlink/",tokenName:"token",tokenPrefix:"satellizer",authHeader:"Authorization",authToken:"Bearer",storageType:"localStorage",providers:{facebook:{name:"facebook",url:"/auth/facebook",authorizationEndpoint:"https://www.facebook.com/v2.3/dialog/oauth",redirectUri:(e.location.origin||e.location.protocol+"//"+e.location.host)+"/",requiredUrlParams:["display","scope"],scope:["email"],scopeDelimiter:",",display:"popup",type:"2.0",popupOptions:{width:580,height:400}},google:{name:"google",url:"/auth/google",authorizationEndpoint:"https://accounts.google.com/o/oauth2/auth",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,requiredUrlParams:["scope"],optionalUrlParams:["display"],scope:["profile","email"],scopePrefix:"openid",scopeDelimiter:" ",display:"popup",type:"2.0",popupOptions:{width:452,height:633}},github:{name:"github",url:"/auth/github",authorizationEndpoint:"https://github.com/login/oauth/authorize",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,optionalUrlParams:["scope"],scope:["user:email"],scopeDelimiter:" ",type:"2.0",popupOptions:{width:1020,height:618}},linkedin:{name:"linkedin",url:"/auth/linkedin",authorizationEndpoint:"https://www.linkedin.com/uas/oauth2/authorization",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,requiredUrlParams:["state"],scope:["r_emailaddress"],scopeDelimiter:" ",state:"STATE",type:"2.0",popupOptions:{width:527,height:582}},twitter:{name:"twitter",url:"/auth/twitter",authorizationEndpoint:"https://api.twitter.com/oauth/authenticate",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,type:"1.0",popupOptions:{width:495,height:645}},twitch:{name:"twitch",url:"/auth/twitch",authorizationEndpoint:"https://api.twitch.tv/kraken/oauth2/authorize",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,requiredUrlParams:["scope"],scope:["user_read"],scopeDelimiter:" ",display:"popup",type:"2.0",popupOptions:{width:500,height:560}},live:{name:"live",url:"/auth/live",authorizationEndpoint:"https://login.live.com/oauth20_authorize.srf",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,requiredUrlParams:["display","scope"],scope:["wl.emails"],scopeDelimiter:" ",display:"popup",type:"2.0",popupOptions:{width:500,height:560}},yahoo:{name:"yahoo",url:"/auth/yahoo",authorizationEndpoint:"https://api.login.yahoo.com/oauth2/request_auth",redirectUri:e.location.origin||e.location.protocol+"//"+e.location.host,scope:[],scopeDelimiter:",",type:"2.0",popupOptions:{width:559,height:519}}}}).provider("$auth",["SatellizerConfig",function(e){Object.defineProperties(this,{httpInterceptor:{get:function(){return e.httpInterceptor},set:function(t){e.httpInterceptor=t}},baseUrl:{get:function(){return e.baseUrl},set:function(t){e.baseUrl=t}},loginUrl:{get:function(){return e.loginUrl},set:function(t){e.loginUrl=t}},signupUrl:{get:function(){return e.signupUrl},set:function(t){e.signupUrl=t}},tokenRoot:{get:function(){return e.tokenRoot},set:function(t){e.tokenRoot=t}},tokenName:{get:function(){return e.tokenName},set:function(t){e.tokenName=t}},tokenPrefix:{get:function(){return e.tokenPrefix},set:function(t){e.tokenPrefix=t}},unlinkUrl:{get:function(){return e.unlinkUrl},set:function(t){e.unlinkUrl=t}},authHeader:{get:function(){return e.authHeader},set:function(t){e.authHeader=t}},authToken:{get:function(){return e.authToken},set:function(t){e.authToken=t}},withCredentials:{get:function(){return e.withCredentials},set:function(t){e.withCredentials=t}},cordova:{get:function(){return e.cordova},set:function(t){e.cordova=t}},storageType:{get:function(){return e.storageType},set:function(t){e.storageType=t}}}),t.forEach(Object.keys(e.providers),function(n){this[n]=function(o){return t.extend(e.providers[n],o)}},this);var n=function(n){e.providers[n.name]=e.providers[n.name]||{},t.extend(e.providers[n.name],n)};this.oauth1=function(t){n(t),e.providers[t.name].type="1.0"},this.oauth2=function(t){n(t),e.providers[t.name].type="2.0"},this.$get=["$q","SatellizerShared","SatellizerLocal","SatellizerOauth",function(e,t,n,o){var r={};return r.login=function(e,t){return n.login(e,t)},r.signup=function(e,t){return n.signup(e,t)},r.logout=function(){return t.logout()},r.authenticate=function(e,t){return o.authenticate(e,t)},r.link=function(e,t){return o.authenticate(e,t)},r.unlink=function(e,t){return o.unlink(e,t)},r.isAuthenticated=function(){return t.isAuthenticated()},r.getToken=function(){return t.getToken()},r.setToken=function(e){t.setToken({access_token:e})},r.removeToken=function(){return t.removeToken()},r.getPayload=function(){return t.getPayload()},r.setStorageType=function(e){return t.setStorageType(e)},r}]}]).factory("SatellizerShared",["$q","$window","SatellizerConfig","SatellizerStorage",function(n,o,r,i){var a={},u=r.tokenPrefix?[r.tokenPrefix,r.tokenName].join("_"):r.tokenName;return a.getToken=function(){return i.get(u)},a.getPayload=function(){var t=i.get(u);if(t&&3===t.split(".").length){var n=t.split(".")[1],o=n.replace("-","+").replace("_","/");return JSON.parse(decodeURIComponent(escape(e.atob(o))))}},a.setToken=function(e){var n,o=e&&e.access_token;if(o&&(t.isObject(o)&&t.isObject(o.data)?e=o:t.isString(o)&&(n=o)),!n&&e){var a=r.tokenRoot&&r.tokenRoot.split(".").reduce(function(e,t){return e[t]},e.data);n=a?a[r.tokenName]:e.data[r.tokenName]}if(!n){var l=r.tokenRoot?r.tokenRoot+"."+r.tokenName:r.tokenName;throw new Error('Expecting a token named "'+l+'" but instead got: '+JSON.stringify(e.data))}i.set(u,n)},a.removeToken=function(){i.remove(u)},a.isAuthenticated=function(){var e=i.get(u);if(e){if(3===e.split(".").length){var t=e.split(".")[1],n=t.replace("-","+").replace("_","/"),r=JSON.parse(o.atob(n)).exp;if(r){var a=Math.round((new Date).getTime()/1e3)>=r;return a?(i.remove(u),!1):!0}return!0}return!0}return!1},a.logout=function(){return i.remove(u),n.when()},a.setStorageType=function(e){r.storageType=e},a}]).factory("SatellizerOauth",["$q","$http","SatellizerConfig","SatellizerUtils","SatellizerShared","SatellizerOauth1","SatellizerOauth2",function(e,t,n,o,r,i,a){var u={};return u.authenticate=function(t,o){var u="1.0"===n.providers[t].type?new i:new a,l=e.defer();return u.open(n.providers[t],o||{}).then(function(e){r.setToken(e,!1),l.resolve(e)})["catch"](function(e){l.reject(e)}),l.promise},u.unlink=function(e,r){return r=r||{},r.url=n.baseUrl?o.joinUrl(n.baseUrl,n.unlinkUrl):n.unlinkUrl,r.data={provider:e}||r.data,r.method=r.method||"POST",t(r)},u}]).factory("SatellizerLocal",["$http","SatellizerUtils","SatellizerShared","SatellizerConfig",function(e,t,n,o){var r={};return r.login=function(r,i){return i=i||{},i.url=o.baseUrl?t.joinUrl(o.baseUrl,o.loginUrl):o.loginUrl,i.data=r||i.data,i.method=i.method||"POST",e(i).then(function(e){return n.setToken(e),e})},r.signup=function(n,r){return r=r||{},r.url=o.baseUrl?t.joinUrl(o.baseUrl,o.signupUrl):o.signupUrl,r.data=n||r.data,r.method=r.method||"POST",e(r)},r}]).factory("SatellizerOauth2",["$q","$http","$window","SatellizerPopup","SatellizerUtils","SatellizerConfig","SatellizerStorage",function(e,n,o,r,i,a,u){return function(){var o={},l={defaultUrlParams:["response_type","client_id","redirect_uri"],responseType:"code",responseParams:{code:"code",clientId:"clientId",redirectUri:"redirectUri"}};return o.open=function(n,p){l=i.merge(n,l);var c,s,h=l.name+"_state";return t.isFunction(l.state)?u.set(h,l.state()):t.isString(l.state)&&u.set(h,l.state),c=[l.authorizationEndpoint,o.buildQueryString()].join("?"),s=a.cordova?r.open(c,l.name,l.popupOptions,l.redirectUri).eventListener(l.redirectUri):r.open(c,l.name,l.popupOptions,l.redirectUri).pollPopup(),s.then(function(t){return"token"===l.responseType?t:t.state&&t.state!==u.get(h)?e.reject('OAuth "state" mismatch'):o.exchangeForToken(t,p)})},o.exchangeForToken=function(e,o){var r=t.extend({},o);t.forEach(l.responseParams,function(t,n){switch(n){case"code":r[t]=e.code;break;case"clientId":r[t]=l.clientId;break;case"redirectUri":r[t]=l.redirectUri;break;default:r[t]=e[n]}}),e.state&&(r.state=e.state);var u=a.baseUrl?i.joinUrl(a.baseUrl,l.url):l.url;return n.post(u,r,{withCredentials:a.withCredentials})},o.buildQueryString=function(){var e=[],n=["defaultUrlParams","requiredUrlParams","optionalUrlParams"];return t.forEach(n,function(n){t.forEach(l[n],function(n){var o=i.camelCase(n),r=t.isFunction(l[n])?l[n]():l[o];if("state"===n){var a=l.name+"_state";r=encodeURIComponent(u.get(a))}"scope"===n&&Array.isArray(r)&&(r=r.join(l.scopeDelimiter),l.scopePrefix&&(r=[l.scopePrefix,r].join(l.scopeDelimiter))),e.push([n,r])})}),e.map(function(e){return e.join("=")}).join("&")},o}}]).factory("SatellizerOauth1",["$q","$http","SatellizerPopup","SatellizerConfig","SatellizerUtils",function(e,n,o,r,i){return function(){var e={},a={url:null,name:null,popupOptions:null,redirectUri:null,authorizationEndpoint:null};return e.open=function(u,l){t.extend(a,u);var p,c=r.baseUrl?i.joinUrl(r.baseUrl,a.url):a.url;return r.cordova||(p=o.open("",a.name,a.popupOptions,a.redirectUri)),n.post(c,a).then(function(t){r.cordova?p=o.open([a.authorizationEndpoint,e.buildQueryString(t.data)].join("?"),a.name,a.popupOptions,a.redirectUri):p.popupWindow.location=[a.authorizationEndpoint,e.buildQueryString(t.data)].join("?");var n=r.cordova?p.eventListener(a.redirectUri):p.pollPopup();return n.then(function(t){return e.exchangeForToken(t,l)})})},e.exchangeForToken=function(e,o){var u=t.extend({},o,e),l=r.baseUrl?i.joinUrl(r.baseUrl,a.url):a.url;return n.post(l,u,{withCredentials:r.withCredentials})},e.buildQueryString=function(e){var n=[];return t.forEach(e,function(e,t){n.push(encodeURIComponent(t)+"="+encodeURIComponent(e))}),n.join("&")},e}}]).factory("SatellizerPopup",["$q","$interval","$window","SatellizerConfig","SatellizerUtils",function(o,r,i,a,u){var l={};return l.url="",l.popupWindow=null,l.open=function(t,n,o){l.url=t;var r=l.stringifyOptions(l.prepareOptions(o)),i=a.cordova?"_blank":n;return l.popupWindow=e.open(t,i,r),e.popup=l.popupWindow,l.popupWindow&&l.popupWindow.focus&&l.popupWindow.focus(),l},l.eventListener=function(e){var n=o.defer();return l.popupWindow.addEventListener("loadstart",function(o){if(0===o.url.indexOf(e)){var r=document.createElement("a");if(r.href=o.url,r.search||r.hash){var i=r.search.substring(1).replace(/\/$/,""),a=r.hash.substring(1).replace(/\/$/,""),p=u.parseQueryString(a),c=u.parseQueryString(i);t.extend(c,p),c.error||n.resolve(c),l.popupWindow.close()}}}),l.popupWindow.addEventListener("loaderror",function(){n.reject("Authorization Failed")}),n.promise},l.pollPopup=function(){var e=o.defer(),i=r(function(){try{var o=document.location.host,a=l.popupWindow.location.host;if(a===o&&(l.popupWindow.location.search||l.popupWindow.location.hash)){var p=l.popupWindow.location.search.substring(1).replace(/\/$/,""),c=l.popupWindow.location.hash.substring(1).replace(/[\/$]/,""),s=u.parseQueryString(c),h=u.parseQueryString(p);t.extend(h,s),h.error||e.resolve(h),l.popupWindow.close(),r.cancel(i)}}catch(d){}(!l.popupWindow||l.popupWindow.closed||l.popupWindow.closed===n)&&r.cancel(i)},50);return e.promise},l.prepareOptions=function(e){e=e||{};var n=e.width||500,o=e.height||500;return t.extend({width:n,height:o,left:i.screenX+(i.outerWidth-n)/2,top:i.screenY+(i.outerHeight-o)/2.5},e)},l.stringifyOptions=function(e){var n=[];return t.forEach(e,function(e,t){n.push(t+"="+e)}),n.join(",")},l}]).service("SatellizerUtils",function(){this.camelCase=function(e){return e.replace(/([\:\-\_]+(.))/g,function(e,t,n,o){return o?n.toUpperCase():n})},this.parseQueryString=function(e){var n,o,r={};return t.forEach((e||"").split("&"),function(e){e&&(o=e.split("="),n=decodeURIComponent(o[0]),r[n]=t.isDefined(o[1])?decodeURIComponent(o[1]):!0)}),r},this.joinUrl=function(e,t){if(/^(?:[a-z]+:)?\/\//i.test(t))return t;var n=[e,t].join("/"),o=function(e){return e.replace(/[\/]+/g,"/").replace(/\/\?/g,"?").replace(/\/\#/g,"#").replace(/\:\//g,"://")};return o(n)},this.merge=function(e,t){var n={};for(var o in e)e.hasOwnProperty(o)&&(n[o]=o in t&&"object"==typeof e[o]&&null!==o?this.merge(e[o],t[o]):e[o]);for(o in t)if(t.hasOwnProperty(o)){if(o in n)continue;n[o]=t[o]}return n}}).factory("SatellizerStorage",["$window","SatellizerConfig",function(e,t){var o=function(){try{var n=t.storageType in e&&null!==e[t.storageType];if(n){var o=Math.random().toString(36).substring(7);e[t.storageType].setItem(o,""),e[t.storageType].removeItem(o)}return n}catch(r){return!1}}();return o||console.warn("Satellizer Warning: "+t.storageType+" is not available."),{get:function(r){return o?e[t.storageType].getItem(r):n},set:function(r,i){return o?e[t.storageType].setItem(r,i):n},remove:function(r){return o?e[t.storageType].removeItem(r):n}}}]).factory("SatellizerInterceptor",["$q","SatellizerConfig","SatellizerStorage","SatellizerShared",function(e,t,n,o){return{request:function(e){if(e.skipAuthorization)return e;if(o.isAuthenticated()&&t.httpInterceptor){var r=t.tokenPrefix?t.tokenPrefix+"_"+t.tokenName:t.tokenName,i=n.get(r);t.authHeader&&t.authToken&&(i=t.authToken+" "+i),e.headers[t.authHeader]=i}return e},responseError:function(t){return e.reject(t)}}}]).config(["$httpProvider",function(e){e.interceptors.push("SatellizerInterceptor")}])}(window,window.angular);