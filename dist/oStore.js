const c={debounce:!1,debounceTime:1e3,debounceFields:[],unobservedFields:[]};function n(n,t){let c=null;return(...e)=>{c&&clearTimeout(c),c=setTimeout(()=>{c=null,n(...e)},t)}}const oStore=(e={},n,t)=>{n=n.rerender?{fn:n.rerender,instance:n}:{fn:n,instance:null};return new Proxy(e,d(n,{...c,...t}))},d=(c,t)=>{const{debounceTime:e,debounceFields:o,unobservedFields:r}=t;let u=t["debounce"];o.length&&(u=!0);const l=n(()=>{i(c)},e);return{deleteProperty:function(e,n){return delete e[n],c(),!0},get:function(e,n){return-1<["[object Object]","[object Array]"].indexOf(Object.prototype.toString.call(e[n]))?new Proxy(e[n],d(c,t)):e[n]},set:function(e,n,t){return e[n]===t||(e[n]=t,r.includes(n)||(u&&(!o.length||o.includes(n))?l():i(c)),!0)}}},i=e=>{var n=document.activeElement.id;e.fn.call(e.instance);const t=document.getElementById(n);t&&t.focus()};export default oStore;
//# sourceMappingURL=oStore.js.map