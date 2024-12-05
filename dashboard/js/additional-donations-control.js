(()=>{"use strict";var e,t={6472:(e,t,n)=>{var o=n(9804),i=n.n(o),r=n(9845),a=n(9340),s=n(9497),l=n(6819),c=function(e,t,n,o){var i,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,n,a):i(t,n))||a);return r>3&&a&&Object.defineProperty(t,n,a),a};const u=new r.SpeedcontrolUtilBrowser(nodecg),d={additionalDonations:nodecg.Replicant("additionalDonations"),assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),commentatorsNew:nodecg.Replicant("commentatorsNew"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationReaderNew:nodecg.Replicant("donationReaderNew"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),lowerThird:nodecg.Replicant("lowerThird"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:u.runDataActiveRun,runDataActiveRunSurrounding:u.runDataActiveRunSurrounding,runDataArray:u.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:u.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let p,f=class extends l.hw{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){a.Ay.set(this.reps,e,i()(t))}setReplicant({name:e,val:t}){a.Ay.set(this.reps,e,i()(t)),d[e].value=i()(t)}};c([l.sM],f.prototype,"setState",null),c([l.sM],f.prototype,"setReplicant",null),f=c([(0,l.nV)({name:"ReplicantModule",namespaced:!0})],f);const h=(0,s.MF)("ReplicantModule");var g=n(582),m=n(1524),v=n(305),y=(n(7980),n(8010),n(6577),n(8969));n(9493);var b=n(9643),A=n(3300),R=n(5651);const k=a.Ay.extend({name:"rippleable",directives:{ripple:R.A},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(e={}){return this.ripple?(e.staticClass="v-input--selection-controls__ripple",e.directives=e.directives||[],e.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",e)):null}}});var w=n(7290);const $=a.Ay.extend({name:"comparable",props:{valueComparator:{type:Function,default:w.bD}}});var x=n(3041);function O(e){e.preventDefault()}const D=(0,x.A)(A.A,k,$).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const e=this.value,t=this.internalValue;return this.isMultiple?!!Array.isArray(t)&&t.some((t=>this.valueComparator(t,e))):void 0===this.trueValue||void 0===this.falseValue?e?this.valueComparator(e,t):Boolean(t):this.valueComparator(t,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(e){this.lazyValue=e,this.hasColor=e}},methods:{genLabel(){const e=A.A.options.methods.genLabel.call(this);return e?(e.data.on={click:O},e):e},genInput(e,t){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:e,type:e},t),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:O},ref:"input"})},onClick(e){this.onChange(),this.$emit("click",e)},onChange(){if(!this.isInteractive)return;const e=this.value;let t=this.internalValue;if(this.isMultiple){Array.isArray(t)||(t=[]);const n=t.length;t=t.filter((t=>!this.valueComparator(t,e))),t.length===n&&t.push(e)}else t=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(t,this.trueValue)?this.falseValue:this.trueValue:e?this.valueComparator(t,e)?null:e:!t;this.validate(!0,t),this.internalValue=t,this.hasColor=t},onFocus(e){this.isFocused=!0,this.$emit("focus",e)},onBlur(e){this.isFocused=!1,this.$emit("blur",e)},onKeydown(e){}}}).extend({name:"v-checkbox",props:{indeterminate:Boolean,indeterminateIcon:{type:String,default:"$checkboxIndeterminate"},offIcon:{type:String,default:"$checkboxOff"},onIcon:{type:String,default:"$checkboxOn"}},data(){return{inputIndeterminate:this.indeterminate}},computed:{classes(){return{...A.A.options.computed.classes.call(this),"v-input--selection-controls":!0,"v-input--checkbox":!0,"v-input--indeterminate":this.inputIndeterminate}},computedIcon(){return this.inputIndeterminate?this.indeterminateIcon:this.isActive?this.onIcon:this.offIcon},validationState(){if(!this.isDisabled||this.inputIndeterminate)return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0}},watch:{indeterminate(e){this.$nextTick((()=>this.inputIndeterminate=e))},inputIndeterminate(e){this.$emit("update:indeterminate",e)},isActive(){this.indeterminate&&(this.inputIndeterminate=!1)}},methods:{genCheckbox(){const{title:e,...t}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(b.A,this.setTextColor(this.validationState,{props:{dense:this.dense,dark:this.dark,light:this.light}}),this.computedIcon),this.genInput("checkbox",{...t,"aria-checked":this.inputIndeterminate?"mixed":this.isActive.toString()}),this.genRipple(this.setTextColor(this.rippleState))])},genDefaultSlot(){return[this.genCheckbox(),this.genLabel()]}}});var P=n(4789),S=n(4363),C=n(2156);const j=(0,x.A)(S.A,C.A,P.A).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...C.A.options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...P.A.options.computed.classes.call(this)}},styles(){const e={...P.A.options.computed.styles.call(this)};return this.img&&(e.background=`url("${this.img}") center center / cover no-repeat`),e}},methods:{genProgress(){const e=S.A.options.methods.genProgress.call(this);return e?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[e]):null}},render(e){const{tag:t,data:n}=this.generateRouteLink();return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),e(t,this.setBackgroundColor(this.color,n),[this.genProgress(),(0,w.$c)(this)])}});let _=class extends a.Ay{};_=function(e,t,n,o){var i,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,n,a):i(t,n))||a);return r>3&&a&&Object.defineProperty(t,n,a),a}([v.default],_);const I=_;var M=n(5637);const T=(0,M.A)(I,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(j,{style:{"text-align":"center",padding:"5px","margin-top":"10px","white-space":"nowrap",overflow:"hidden"}},[e._t("default")],2)}),[],!1,null,null,null).exports;var V=n(3578),B=function(e,t,n,o){var i,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,n,a):i(t,n))||a);return r>3&&a&&Object.defineProperty(t,n,a),a};a.Ay.use(V.Ay);let L=class extends l.hw{get reps(){return this.context.rootState.ReplicantModule.reps}toggleItem({key:e,active:t}){const n=i()(p.repsTyped.additionalDonations),o=n.findIndex((t=>t.key===e));o>=0?n[o].active=t:n.push({key:e,active:t}),p.setReplicant({name:"additionalDonations",val:n})}};B([l.sM],L.prototype,"toggleItem",null),L=B([(0,l.nV)({name:"OurModule"})],L);const E=new V.il({strict:!1,state:{},modules:{ReplicantModule:f,OurModule:L}}),F=E,N=(0,l.f_)(L,E);var W=function(e,t,n,o){var i,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,n,a):i(t,n))||a);return r>3&&a&&Object.defineProperty(t,n,a),a};let z=class extends a.Ay{get toggle(){return this.donation.active}set toggle(e){N.toggleItem({key:this.donation.key,active:e}),nodecg.sendMessage("additionalDonationToggle",{key:this.donation.key,active:e})}};var H;W([(H={type:Object,required:!0},void 0===H&&(H={}),function(e,t){(0,y.A)(H,e,t),(0,v.createDecorator)((function(e,t){(e.props||(e.props={}))[t]=H}))(e,t)})],z.prototype,"donation",void 0),z=W([(0,v.default)({components:{MediaCard:T}})],z);const U=z,q=(0,M.A)(U,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{staticClass:"d-flex"},[e._v("\n  "+e._s(e.donation.description)+" - $"+e._s(e.donation.amount)+"\n  - "),t(D,{staticClass:"ma-0 pa-0 ml-1",model:{value:e.toggle,callback:function(t){e.toggle=t},expression:"toggle"}})],1)}),[],!1,null,null,null).exports;var K=function(e,t,n,o){var i,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,n,a):i(t,n))||a);return r>3&&a&&Object.defineProperty(t,n,a),a};let Z=class extends a.Ay{constructor(){super(...arguments),this.additionalDonationsCfg=nodecg.bundleConfig.additionalDonations}formatAmount(e){return e.toLocaleString("en-US",{maximumFractionDigits:0})}get additionalDonationsMapped(){return this.additionalDonationsCfg.map((e=>{var t,n;return{key:e.key,description:e.description,amount:e.amount,active:null!==(n=null===(t=this.additionalDonations.find((t=>t.key===e.key)))||void 0===t?void 0:t.active)&&void 0!==n&&n}}))}};K([h.State((e=>e.reps.additionalDonations))],Z.prototype,"additionalDonations",void 0),Z=K([(0,v.default)({components:{Donation:q}})],Z);const G=Z,J=(0,M.A)(G,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(m.A,[t("div",{staticClass:"mb-2"},e._l(e.additionalDonationsMapped,(function(e){return t("donation",{key:e.key,attrs:{donation:e}})})),1)])}),[],!1,null,null,null).exports;(function(e){return t=this,n=void 0,i=function*(){Object.keys(d).forEach((t=>{d[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((e=>d[e]))),p=(0,l.f_)(f,e)},new((o=void 0)||(o=Promise))((function(e,r){function a(e){try{l(i.next(e))}catch(e){r(e)}}function s(e){try{l(i.throw(e))}catch(e){r(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(a,s)}l((i=i.apply(t,n||[])).next())}));var t,n,o,i})(F).then((()=>{new a.Ay({vuetify:g.A,store:F,el:"#App",render:e=>e(J)})}))},8969:(e,t,n)=>{n.d(t,{A:()=>i});var o="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function i(e,t,n){if(o&&!Array.isArray(e)&&"function"!=typeof e&&!e.hasOwnProperty("type")&&void 0===e.type){var i=Reflect.getMetadata("design:type",t,n);i!==Object&&(e.type=i)}}},208:(e,t,n)=>{n.d(t,{mM:()=>r,vt:()=>a});var o=n(9437),i=n(5596);(0,o.o)("carousel-transition"),(0,o.o)("carousel-reverse-transition"),(0,o.o)("tab-transition"),(0,o.o)("tab-reverse-transition"),(0,o.o)("menu-transition"),(0,o.o)("fab-transition","center center","out-in"),(0,o.o)("dialog-transition"),(0,o.o)("dialog-bottom-transition"),(0,o.o)("dialog-top-transition");const r=(0,o.o)("fade-transition"),a=((0,o.o)("scale-transition"),(0,o.o)("scroll-x-transition"),(0,o.o)("scroll-x-reverse-transition"),(0,o.o)("scroll-y-transition"),(0,o.o)("scroll-y-reverse-transition"),(0,o.o)("slide-x-transition"));(0,o.o)("slide-x-reverse-transition"),(0,o.o)("slide-y-transition"),(0,o.o)("slide-y-reverse-transition"),(0,o.b)("expand-transition",(0,i.A)()),(0,o.b)("expand-x-transition",(0,i.A)("",!0))},1509:(e,t,n)=>{n.d(t,{P:()=>a});var o=n(9340),i=n(7290);const r={absolute:Boolean,bottom:Boolean,fixed:Boolean,left:Boolean,right:Boolean,top:Boolean};function a(e=[]){return o.Ay.extend({name:"positionable",props:e.length?(0,i.fF)(r,e):r})}a()},4442:(e,t,n)=>{n.d(t,{W:()=>a});var o=n(9340),i=n(7098);function r(e,t){return()=>(0,i.OP)(`The ${e} component must be used inside a ${t}`)}function a(e,t,n){const i=t&&n?{register:r(t,n),unregister:r(t,n)}:null;return o.Ay.extend({name:"registrable-inject",inject:{[e]:{default:i}}})}},7503:(e,t,n)=>{n.d(t,{I:()=>s});var o=n(5247),i=n(9868),r=n(6943);function a(e,t={}){const n={container:document.scrollingElement||document.body||document.documentElement,duration:500,offset:0,easing:"easeInOutCubic",appOffset:!0,...t},o=(0,r.M)(n.container);if(n.appOffset&&a.framework.application){const e=o.classList.contains("v-navigation-drawer"),t=o.classList.contains("v-navigation-drawer--clipped"),{bar:i,top:r}=a.framework.application;n.offset+=i,e&&!t||(n.offset+=r)}const s=performance.now();let l;l="number"==typeof e?(0,r.A)(e)-n.offset:(0,r.A)(e)-(0,r.A)(o)-n.offset;const c=o.scrollTop;if(l===c)return Promise.resolve(l);const u="function"==typeof n.easing?n.easing:i[n.easing];if(!u)throw new TypeError(`Easing function "${n.easing}" not found.`);return new Promise((e=>requestAnimationFrame((function t(i){const r=i-s,a=Math.abs(n.duration?Math.min(r/n.duration,1):1);o.scrollTop=Math.floor(c+(l-c)*u(a));const d=(o===document.body?document.documentElement.clientHeight:o.clientHeight)+o.scrollTop>=o.scrollHeight;if(1===a||l>o.scrollTop&&d)return e(l);requestAnimationFrame(t)}))))}a.framework={},a.init=()=>{};class s extends o.k{constructor(){return super(),a}}s.property="goTo"},7098:(e,t,n)=>{n.d(t,{OP:()=>r,yA:()=>a});var o=n(4823);function i(e,t,n){if(!o.A.config.silent){if(n&&(t={_isVue:!0,$parent:n,$options:t}),t){if(t.$_alreadyWarned=t.$_alreadyWarned||[],t.$_alreadyWarned.includes(e))return;t.$_alreadyWarned.push(e)}return`[Vuetify] ${e}`+(t?function(e){if(e._isVue&&e.$parent){const t=[];let n=0;for(;e;){if(t.length>0){const o=t[t.length-1];if(o.constructor===e.constructor){n++,e=e.$parent;continue}n>0&&(t[t.length-1]=[o,n],n=0)}t.push(e),e=e.$parent}return"\n\nfound in\n\n"+t.map(((e,t)=>`${0===t?"---\x3e ":" ".repeat(5+2*t)}${Array.isArray(e)?`${c(e[0])}... (${e[1]} recursive calls)`:c(e)}`)).join("\n")}return`\n\n(found in ${c(e)})`}(t):"")}}function r(e,t,n){const o=i(e,t,n);null!=o&&console.warn(o)}function a(e,t,n){const o=i(e,t,n);null!=o&&console.error(o)}const s=/(?:^|[-_])(\w)/g,l=e=>e.replace(s,(e=>e.toUpperCase())).replace(/[-_]/g,"");function c(e,t){if(e.$root===e)return"<Root>";const n="function"==typeof e&&null!=e.cid?e.options:e._isVue?e.$options||e.constructor.options:e||{};let o=n.name||n._componentTag;const i=n.__file;if(!o&&i){const e=i.match(/([^/\\]+)\.vue$/);o=e&&e[1]}return(o?`<${l(o)}>`:"<Anonymous>")+(i&&!1!==t?` at ${i}`:"")}},7290:(e,t,n)=>{n.d(t,{$c:()=>y,BN:()=>v,D9:()=>A,Dg:()=>l,HP:()=>f,LJ:()=>i,PT:()=>g,Zb:()=>m,bD:()=>r,fF:()=>s,g8:()=>p,kW:()=>c,no:()=>a,qE:()=>b,uP:()=>d});let o=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{o=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function i(e,t,n){const o=t.length-1;if(o<0)return void 0===e?n:e;for(let i=0;i<o;i++){if(null==e)return n;e=e[t[i]]}return null==e||void 0===e[t[o]]?n:e[t[o]]}function r(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>r(e[n],t[n])))}function a(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:i(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function s(e,t){const n={};for(let o=0;o<t.length;o++){const i=t[o];void 0!==e[i]&&(n[i]=e[i])}return n}function l(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function c(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(e){return null!==e&&"object"==typeof e}const d=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function p(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=a(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function f(e){return Object.keys(e)}const h=/-(\w)/g,g=e=>e.replace(h,((e,t)=>t?t.toUpperCase():""));function m(e){return e.charAt(0).toUpperCase()+e.slice(1)}function v(e){return null!=e?Array.isArray(e)?e:[e]:[]}function y(e,t="default",n,o=!1){const i=c(t);return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):e.$scopedSlots.hasOwnProperty(i)?e.$scopedSlots[i](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!o?!e.$slots.hasOwnProperty(i)||n&&!o?void 0:e.$slots[i]:e.$slots[t]}function b(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function A(e={},t={}){for(const n in t){const o=e[n],i=t[n];u(o)&&u(i)?e[n]=A(o,i):e[n]=i}return e}},8459:(e,t,n)=>{n.d(t,{Ay:()=>a});var o=n(7290);const i={styleList:/;(?![^(]*\))/g,styleProp:/:(.*)/};function r(e){const t={};for(const n of e.split(i.styleList)){let[e,r]=n.split(i.styleProp);e=e.trim(),e&&("string"==typeof r&&(r=r.trim()),t[(0,o.PT)(e)]=r)}return t}function a(){const e={};let t,n=arguments.length;for(;n--;)for(t of Object.keys(arguments[n]))switch(t){case"class":case"directives":arguments[n][t]&&(e[t]=(i=e[t],(r=arguments[n][t])?i&&i?(0,o.BN)(i).concat(r):r:i));break;case"style":arguments[n][t]&&(e[t]=s(e[t],arguments[n][t]));break;case"staticClass":if(!arguments[n][t])break;void 0===e[t]&&(e[t]=""),e[t]&&(e[t]+=" "),e[t]+=arguments[n][t].trim();break;case"on":case"nativeOn":arguments[n][t]&&(e[t]=l(e[t],arguments[n][t]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[n][t])break;e[t]||(e[t]={}),e[t]={...arguments[n][t],...e[t]};break;default:e[t]||(e[t]=arguments[n][t])}var i,r;return e}function s(e,t){return e?t?(e=(0,o.BN)("string"==typeof e?r(e):e)).concat("string"==typeof t?r(t):t):e:t}function l(...e){if(!e[0])return e[1];if(!e[1])return e[0];const t={};for(let n=2;n--;){const o=e[n];for(const e in o)o[e]&&(t[e]?t[e]=[].concat(o[e],t[e]):t[e]=o[e])}return t}}},n={};function o(e){var i=n[e];if(void 0!==i)return i.exports;var r=n[e]={exports:{}};return t[e].call(r.exports,r,r.exports,o),r.exports}o.m=t,e=[],o.O=(t,n,i,r)=>{if(!n){var a=1/0;for(u=0;u<e.length;u++){for(var[n,i,r]=e[u],s=!0,l=0;l<n.length;l++)(!1&r||a>=r)&&Object.keys(o.O).every((e=>o.O[e](n[l])))?n.splice(l--,1):(s=!1,r<a&&(a=r));if(s){e.splice(u--,1);var c=i();void 0!==c&&(t=c)}}return t}r=r||0;for(var u=e.length;u>0&&e[u-1][2]>r;u--)e[u]=e[u-1];e[u]=[n,i,r]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={10:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var i,r,[a,s,l]=n,c=0;if(a.some((t=>0!==e[t]))){for(i in s)o.o(s,i)&&(o.m[i]=s[i]);if(l)var u=l(o)}for(t&&t(n);c<a.length;c++)r=a[c],o.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var i=o.O(void 0,[938,425,919,125],(()=>o(6472)));i=o.O(i)})();