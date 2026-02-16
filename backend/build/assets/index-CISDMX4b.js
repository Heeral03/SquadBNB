import{cy as B,cz as Ue,cA as ze,cB as I,cC as U,cD as L,d7 as w,cE as l,cP as v,dY as Ge,cO as $,dZ as Qe,d_ as b,cV as F,d$ as Ve,e0 as T,dg as ye,cK as N,e1 as Ie,cT as f,d5 as C,cQ as Y,cN as D,cY as Ye,du as K,c$ as k,cM as H,d8 as h,cG as He,cI as Ke,e2 as Le,cJ as Xe,dS as Ne}from"./index-BDcKlTkx.js";const Je=B`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var z=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let R=class extends L{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return l`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${w(this.iconSize)}></wui-icon>
    </button>`}};R.styles=[Ue,ze,Je];z([I()],R.prototype,"icon",void 0);z([I()],R.prototype,"variant",void 0);z([I()],R.prototype,"type",void 0);z([I()],R.prototype,"size",void 0);z([I()],R.prototype,"iconSize",void 0);z([I({type:Boolean})],R.prototype,"fullWidth",void 0);z([I({type:Boolean})],R.prototype,"disabled",void 0);R=z([U("wui-icon-button")],R);const Ze=Symbol(),Pe=Object.getPrototypeOf,Se=new WeakMap,et=e=>e&&(Se.has(e)?Se.get(e):Pe(e)===Object.prototype||Pe(e)===Array.prototype),tt=e=>et(e)&&e[Ze]||null,he={},xe=e=>typeof e=="object"&&e!==null,nt=e=>xe(e)&&!qe.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)&&!(e instanceof Promise),st=(e,t,n,s)=>({deleteProperty(a,i){const o=Reflect.get(a,i);n(i);const c=Reflect.deleteProperty(a,i);return c&&s(["delete",[i],o]),c},set(a,i,o,c){const m=!e()&&Reflect.has(a,i),S=Reflect.get(a,i,c);if(m&&(ve(S,o)||se.has(o)&&ve(S,se.get(o))))return!0;n(i),xe(o)&&(o=tt(o)||o);const W=!ne.has(o)&&at(o)?De(o):o;return t(i,W),Reflect.set(a,i,W,c),s(["set",[i],o,S]),!0}}),ne=new WeakMap,qe=new WeakSet,ue=[1],se=new WeakMap;let ve=Object.is,it=(e,t)=>new Proxy(e,t),at=nt,rt=st;function De(e={}){if(!xe(e))throw new Error("object required");const t=se.get(e);if(t)return t;let n=ue[0];const s=new Set,a=(g,E=++ue[0])=>{n!==E&&(i=n=E,s.forEach(y=>y(g,E)))};let i=n;const o=(g=ue[0])=>(i!==g&&(i=g,m.forEach(([E])=>{const y=E[1](g);y>n&&(n=y)})),n),c=g=>(E,y)=>{const _=[...E];_[1]=[g,..._[1]],a(_,y)},m=new Map,S=(g,E)=>{const y=!qe.has(E)&&ne.get(E);if(y){if((he?"production":void 0)!=="production"&&m.has(g))throw new Error("prop listener already exists");if(s.size){const _=y[2](c(g));m.set(g,[y,_])}else m.set(g,[y])}},W=g=>{var E;const y=m.get(g);y&&(m.delete(g),(E=y[1])==null||E.call(y))},X=g=>(s.add(g),s.size===1&&m.forEach(([y,_],ee)=>{if((he?"production":void 0)!=="production"&&_)throw new Error("remove already exists");const je=y[2](c(ee));m.set(ee,[y,je])}),()=>{s.delete(g),s.size===0&&m.forEach(([y,_],ee)=>{_&&(_(),m.set(ee,[y]))})});let J=!0;const ce=rt(()=>J,S,W,a),Z=it(e,ce);se.set(e,Z);const Me=[e,o,X];return ne.set(Z,Me),Reflect.ownKeys(e).forEach(g=>{const E=Object.getOwnPropertyDescriptor(e,g);"value"in E&&E.writable&&(Z[g]=e[g])}),J=!1,Z}function Fe(e,t,n){const s=ne.get(e);(he?"production":void 0)!=="production"&&!s&&console.warn("Please use proxy object");let a;const i=[],o=s[2];let c=!1;const S=o(W=>{i.push(W),a||(a=Promise.resolve().then(()=>{a=void 0,c&&t(i.splice(0))}))});return c=!0,()=>{c=!1,S()}}function ot(e,t,n,s){let a=e[t];return Fe(e,()=>{const i=e[t];Object.is(a,i)||n(a=i)})}const d={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS",UNABLE_TO_GET_TOKEN_BALANCES:"UNABLE_TO_GET_TOKEN_BALANCES",UNABLE_TO_GET_QUOTE:"UNABLE_TO_GET_QUOTE",UNABLE_TO_GET_QUOTE_STATUS:"UNABLE_TO_GET_QUOTE_STATUS",INVALID_RECIPIENT_ADDRESS_FOR_ASSET:"INVALID_RECIPIENT_ADDRESS_FOR_ASSET"},M={[d.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[d.INVALID_RECIPIENT]:"Invalid recipient address",[d.INVALID_ASSET]:"Invalid asset specified",[d.INVALID_AMOUNT]:"Invalid payment amount",[d.INVALID_RECIPIENT_ADDRESS_FOR_ASSET]:"Invalid recipient address for the asset selected",[d.UNKNOWN_ERROR]:"Unknown payment error occurred",[d.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[d.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[d.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[d.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[d.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[d.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[d.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status",[d.UNABLE_TO_GET_TOKEN_BALANCES]:"Unable to get token balances",[d.UNABLE_TO_GET_QUOTE]:"Unable to get quote. Please choose a different token",[d.UNABLE_TO_GET_QUOTE_STATUS]:"Unable to get quote status"};class p extends Error{get message(){return M[this.code]}constructor(t,n){super(M[t]),this.name="AppKitPayError",this.code=t,this.details=n,Error.captureStackTrace&&Error.captureStackTrace(this,p)}}const ct="https://rpc.walletconnect.org/v1/json-rpc",Te="reown_test";function ut(){const{chainNamespace:e}=b.parseCaipNetworkId(u.state.paymentAsset.network);if(!F.isAddress(u.state.recipient,e))throw new p(d.INVALID_RECIPIENT_ADDRESS_FOR_ASSET,`Provide valid recipient address for namespace "${e}"`)}async function lt(e,t,n){if(t!==v.CHAIN.EVM)throw new p(d.INVALID_CHAIN_NAMESPACE);if(!n.fromAddress)throw new p(d.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");const s=typeof n.amount=="string"?parseFloat(n.amount):n.amount;if(isNaN(s))throw new p(d.INVALID_PAYMENT_CONFIG);const a=e.metadata?.decimals??18,i=$.parseUnits(s.toString(),a);if(typeof i!="bigint")throw new p(d.GENERIC_PAYMENT_ERROR);return await $.sendTransaction({chainNamespace:t,to:n.recipient,address:n.fromAddress,value:i,data:"0x"})??void 0}async function dt(e,t){if(!t.fromAddress)throw new p(d.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");const n=e.asset,s=t.recipient,a=Number(e.metadata.decimals),i=$.parseUnits(t.amount.toString(),a);if(i===void 0)throw new p(d.GENERIC_PAYMENT_ERROR);return await $.writeContract({fromAddress:t.fromAddress,tokenAddress:n,args:[s,i],method:"transfer",abi:Qe.getERC20Abi(n),chainNamespace:v.CHAIN.EVM})??void 0}async function pt(e,t){if(e!==v.CHAIN.SOLANA)throw new p(d.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new p(d.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");const n=typeof t.amount=="string"?parseFloat(t.amount):t.amount;if(isNaN(n)||n<=0)throw new p(d.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{if(!Ge.getProvider(e))throw new p(d.GENERIC_PAYMENT_ERROR,"No Solana provider available.");const a=await $.sendTransaction({chainNamespace:v.CHAIN.SOLANA,to:t.recipient,value:n,tokenMint:t.tokenMint});if(!a)throw new p(d.GENERIC_PAYMENT_ERROR,"Transaction failed.");return a}catch(s){throw s instanceof p?s:new p(d.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${s}`)}}async function ht({sourceToken:e,toToken:t,amount:n,recipient:s}){const a=$.parseUnits(n,e.metadata.decimals),i=$.parseUnits(n,t.metadata.decimals);return Promise.resolve({type:fe,origin:{amount:a?.toString()??"0",currency:e},destination:{amount:i?.toString()??"0",currency:t},fees:[{id:"service",label:"Service Fee",amount:"0",currency:t}],steps:[{requestId:fe,type:"deposit",deposit:{amount:a?.toString()??"0",currency:e.asset,receiver:s}}],timeInSeconds:6})}function me(e){if(!e)return null;const t=e.steps[0];return!t||t.type!==vt?null:t}function le(e,t=0){if(!e)return[];const n=e.steps.filter(a=>a.type===Tt),s=n.filter((a,i)=>i+1>t);return n.length>0&&n.length<3?s:[]}const be=new Ve({baseUrl:F.getApiUrl(),clientId:null});class mt extends Error{}function ft(){const e=ye.getSnapshot().projectId;return`${ct}?projectId=${e}`}function Ae(){const{projectId:e,sdkType:t,sdkVersion:n}=ye.state;return{projectId:e,st:t||"appkit",sv:n||"html-wagmi-4.2.2"}}async function Ee(e,t){const n=ft(),{sdkType:s,sdkVersion:a,projectId:i}=ye.getSnapshot(),o={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:s,sv:a,projectId:i}},m=await(await fetch(n,{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}})).json();if(m.error)throw new mt(m.error.message);return m}async function ke(e){return(await Ee("reown_getExchanges",e)).result}async function _e(e){return(await Ee("reown_getExchangePayUrl",e)).result}async function gt(e){return(await Ee("reown_getExchangeBuyStatus",e)).result}async function wt(e){const t=N.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:n,chainNamespace:s}=b.parseCaipNetworkId(e.sourceToken.network),{chainId:a,chainNamespace:i}=b.parseCaipNetworkId(e.toToken.network),o=e.sourceToken.asset==="native"?Ie(s):e.sourceToken.asset,c=e.toToken.asset==="native"?Ie(i):e.toToken.asset;return await be.post({path:"/appkit/v1/transfers/quote",body:{user:e.address,originChainId:n.toString(),originCurrency:o,destinationChainId:a.toString(),destinationCurrency:c,recipient:e.recipient,amount:t},params:Ae()})}async function yt(e){const t=T.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),n=T.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&n?ht(e):wt(e)}async function xt(e){return await be.get({path:"/appkit/v1/transfers/status",params:{requestId:e.requestId,...Ae()}})}async function bt(e){return await be.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:Ae()})}const At=["eip155","solana"],Et={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}},Ce={56:"714",204:"714"};function de(e,t){const{chainNamespace:n,chainId:s}=b.parseCaipNetworkId(e),a=Et[n];if(!a)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let i=a.native.assetNamespace,o=a.native.assetReference;return t!=="native"?(i=a.defaultTokenNamespace,o=t):n==="eip155"&&Ce[s]&&(o=Ce[s]),`${`${n}:${s}`}/${i}:${o}`}function It(e){const{chainNamespace:t}=b.parseCaipNetworkId(e);return At.includes(t)}function Nt(e){const n=f.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===e.chainId);let s=e.address;if(!n)throw new Error(`Target network not found for balance chainId "${e.chainId}"`);if(T.isLowerCaseMatch(e.symbol,n.nativeCurrency.symbol))s="native";else if(F.isCaipAddress(s)){const{address:a}=b.parseCaipAddress(s);s=a}else if(!s)throw new Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:n.caipNetworkId,asset:s,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}function Pt(e){return{chainId:e.network,address:`${e.network}:${e.asset}`,symbol:e.metadata.symbol,name:e.metadata.name,iconUrl:e.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:e.metadata.decimals.toString()}}}function ie(e){const t=N.bigNumber(e,{safe:!0});return t.lt(.001)?"<0.001":t.round(4).toString()}function St(e){const n=f.getAllRequestedCaipNetworks().find(s=>s.caipNetworkId===e.network);return n?!!n.testnet:!1}const $e=0,pe="unknown",fe="direct-transfer",vt="deposit",Tt="transaction",r=De({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[v.CHAIN.EVM]:[],[v.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),u={state:r,subscribe(e){return Fe(r,()=>e(r))},subscribeKey(e,t){return ot(r,e,t)},async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),ut(),await this.prepareTokenLogo(),r.isConfigured=!0,Y.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:r.exchanges,configuration:{network:r.paymentAsset.network,asset:r.paymentAsset.asset,recipient:r.recipient,amount:r.amount}}}),await K.open({view:"Pay"})},resetState(){r.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},r.recipient="0x0",r.amount=0,r.isConfigured=!1,r.error=null,r.isPaymentInProgress=!1,r.isLoading=!1,r.currentPayment=void 0,r.selectedExchange=void 0,r.exchangeUrlForQuote=void 0,r.requestId=void 0},resetQuoteState(){r.quote=void 0,r.quoteStatus="waiting",r.quoteError=null,r.isFetchingQuote=!1,r.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new p(d.INVALID_PAYMENT_CONFIG);try{r.choice=e.choice??"pay",r.paymentAsset=e.paymentAsset,r.recipient=e.recipient,r.amount=e.amount,r.openInNewTab=e.openInNewTab??!0,r.redirectUrl=e.redirectUrl,r.payWithExchange=e.payWithExchange,r.error=null}catch(t){throw new p(d.INVALID_PAYMENT_CONFIG,t.message)}},setSelectedPaymentAsset(e){r.selectedPaymentAsset=e},setSelectedExchange(e){r.selectedExchange=e},setRequestId(e){r.requestId=e},setPaymentInProgress(e){r.isPaymentInProgress=e},getPaymentAsset(){return r.paymentAsset},getExchanges(){return r.exchanges},async fetchExchanges(){try{r.isLoading=!0;const e=await ke({page:$e});r.exchanges=e.exchanges.slice(0,2)}catch{throw D.showError(M.UNABLE_TO_GET_EXCHANGES),new p(d.UNABLE_TO_GET_EXCHANGES)}finally{r.isLoading=!1}},async getAvailableExchanges(e){try{const t=e?.asset&&e?.network?de(e.network,e.asset):void 0;return await ke({page:e?.page??$e,asset:t,amount:e?.amount?.toString()})}catch{throw new p(d.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,n=!1){try{const s=Number(t.amount),a=await _e({exchangeId:e,asset:de(t.network,t.asset),amount:s.toString(),recipient:`${t.network}:${t.recipient}`});return Y.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:e},headless:n}}),n&&(this.initiatePayment(),Y.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:r.paymentId||pe,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:e}}})),a}catch(s){throw s instanceof Error&&s.message.includes("is not supported")?new p(d.ASSET_NOT_SUPPORTED):new Error(s.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:n,recipient:s}){const a=await _e({exchangeId:e,asset:de(t.network,t.asset),amount:n.toString(),recipient:s});r.exchangeSessionId=a.sessionId,r.exchangeUrlForQuote=a.url},async openPayUrl(e,t,n=!1){try{const s=await this.getPayUrl(e.exchangeId,t,n);if(!s)throw new p(d.UNABLE_TO_GET_PAY_URL);const i=e.openInNewTab??!0?"_blank":"_self";return F.openHref(s.url,i),s}catch(s){throw s instanceof p?r.error=s.message:r.error=M.GENERIC_PAYMENT_ERROR,new p(d.UNABLE_TO_GET_PAY_URL)}},async onTransfer({chainNamespace:e,fromAddress:t,toAddress:n,amount:s,paymentAsset:a}){if(r.currentPayment={type:"wallet",status:"IN_PROGRESS"},!r.isPaymentInProgress)try{this.initiatePayment();const o=f.getAllRequestedCaipNetworks().find(m=>m.caipNetworkId===a.network);if(!o)throw new Error("Target network not found");const c=f.state.activeCaipNetwork;switch(T.isLowerCaseMatch(c?.caipNetworkId,o.caipNetworkId)||await f.switchActiveNetwork(o),e){case v.CHAIN.EVM:a.asset==="native"&&(r.currentPayment.result=await lt(a,e,{recipient:n,amount:s,fromAddress:t})),a.asset.startsWith("0x")&&(r.currentPayment.result=await dt(a,{recipient:n,amount:s,fromAddress:t})),r.currentPayment.status="SUCCESS";break;case v.CHAIN.SOLANA:r.currentPayment.result=await pt(e,{recipient:n,amount:s,fromAddress:t,tokenMint:a.asset==="native"?void 0:a.asset}),r.currentPayment.status="SUCCESS";break;default:throw new p(d.INVALID_CHAIN_NAMESPACE)}}catch(i){throw i instanceof p?r.error=i.message:r.error=M.GENERIC_PAYMENT_ERROR,r.currentPayment.status="FAILED",D.showError(r.error),i}finally{r.isPaymentInProgress=!1}},async onSendTransaction(e){try{const{namespace:t,transactionStep:n}=e;u.initiatePayment();const a=f.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===r.paymentAsset?.network);if(!a)throw new Error("Target network not found");const i=f.state.activeCaipNetwork;if(T.isLowerCaseMatch(i?.caipNetworkId,a.caipNetworkId)||await f.switchActiveNetwork(a),t===v.CHAIN.EVM){const{from:o,to:c,data:m,value:S}=n.transaction;await $.sendTransaction({address:o,to:c,data:m,value:BigInt(S),chainNamespace:t})}else if(t===v.CHAIN.SOLANA){const{instructions:o}=n.transaction;await $.writeSolanaTransaction({instructions:o})}}catch(t){throw t instanceof p?r.error=t.message:r.error=M.GENERIC_PAYMENT_ERROR,D.showError(r.error),t}finally{r.isPaymentInProgress=!1}},getExchangeById(e){return r.exchanges.find(t=>t.id===e)},validatePayConfig(e){const{paymentAsset:t,recipient:n,amount:s}=e;if(!t)throw new p(d.INVALID_PAYMENT_CONFIG);if(!n)throw new p(d.INVALID_RECIPIENT);if(!t.asset)throw new p(d.INVALID_ASSET);if(s==null||s<=0)throw new p(d.INVALID_AMOUNT)},async handlePayWithExchange(e){try{r.currentPayment={type:"exchange",exchangeId:e};const{network:t,asset:n}=r.paymentAsset,s={network:t,asset:n,amount:r.amount,recipient:r.recipient},a=await this.getPayUrl(e,s);if(!a)throw new p(d.UNABLE_TO_INITIATE_PAYMENT);return r.currentPayment.sessionId=a.sessionId,r.currentPayment.status="IN_PROGRESS",r.currentPayment.exchangeId=e,this.initiatePayment(),{url:a.url,openInNewTab:r.openInNewTab}}catch(t){return t instanceof p?r.error=t.message:r.error=M.GENERIC_PAYMENT_ERROR,r.isPaymentInProgress=!1,D.showError(r.error),null}},async getBuyStatus(e,t){try{const n=await gt({sessionId:t,exchangeId:e});return(n.status==="SUCCESS"||n.status==="FAILED")&&Y.sendEvent({type:"track",event:n.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{message:n.status==="FAILED"?F.parseError(r.error):void 0,source:"pay",paymentId:r.paymentId||pe,configuration:{network:r.paymentAsset.network,asset:r.paymentAsset.asset,recipient:r.recipient,amount:r.amount},currentPayment:{type:"exchange",exchangeId:r.currentPayment?.exchangeId,sessionId:r.currentPayment?.sessionId,result:n.txHash}}}),n}catch{throw new p(d.UNABLE_TO_GET_BUY_STATUS)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}){if(!e)return[];const{address:s}=b.parseCaipAddress(e);let a=t;return n===v.CHAIN.EVM&&(a=void 0),await Ye.getMyTokensWithBalance({address:s,caipNetwork:a})},async fetchTokensFromExchange(){if(!r.selectedExchange)return[];const e=await bt(r.selectedExchange.id),t=Object.values(e.assets).flat();return await Promise.all(t.map(async s=>{const a=Pt(s),{chainNamespace:i}=b.parseCaipNetworkId(a.chainId);let o=a.address;if(F.isCaipAddress(o)){const{address:m}=b.parseCaipAddress(o);o=m}const c=await C.getImageByToken(o??"",i).catch(()=>{});return a.iconUrl=c??"",a}))},async fetchTokens({caipAddress:e,caipNetwork:t,namespace:n}){try{r.isFetchingTokenBalances=!0;const i=await(!!r.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}));r.tokenBalances={...r.tokenBalances,[n]:i}}catch(s){const a=s instanceof Error?s.message:"Unable to get token balances";D.showError(a)}finally{r.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:t,sourceToken:n,toToken:s,recipient:a}){try{u.resetQuoteState(),r.isFetchingQuote=!0;const i=await yt({amount:e,address:r.selectedExchange?void 0:t,sourceToken:n,toToken:s,recipient:a});if(r.selectedExchange){const o=me(i);if(o){const c=`${n.network}:${o.deposit.receiver}`,m=N.formatNumber(o.deposit.amount,{decimals:n.metadata.decimals??0,round:8});await u.generateExchangeUrlForQuote({exchangeId:r.selectedExchange.id,paymentAsset:n,amount:m.toString(),recipient:c})}}r.quote=i}catch(i){let o=M.UNABLE_TO_GET_QUOTE;if(i instanceof Error&&i.cause&&i.cause instanceof Response)try{const c=await i.cause.json();c.error&&typeof c.error=="string"&&(o=c.error)}catch{}throw r.quoteError=o,D.showError(o),new p(d.UNABLE_TO_GET_QUOTE)}finally{r.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===fe){const n=r.selectedExchange,s=r.exchangeSessionId;if(n&&s){switch((await this.getBuyStatus(n.id,s)).status){case"IN_PROGRESS":r.quoteStatus="waiting";break;case"SUCCESS":r.quoteStatus="success",r.isPaymentInProgress=!1;break;case"FAILED":r.quoteStatus="failure",r.isPaymentInProgress=!1;break;case"UNKNOWN":r.quoteStatus="waiting";break;default:r.quoteStatus="waiting";break}return}r.quoteStatus="success";return}const{status:t}=await xt({requestId:e});r.quoteStatus=t}catch{throw r.quoteStatus="failure",new p(d.UNABLE_TO_GET_QUOTE_STATUS)}},initiatePayment(){r.isPaymentInProgress=!0,r.paymentId=crypto.randomUUID()},initializeAnalytics(){r.analyticsSet||(r.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(r.currentPayment?.status&&r.currentPayment.status!=="UNKNOWN"){const t={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[r.currentPayment.status];Y.sendEvent({type:"track",event:t,properties:{message:r.currentPayment.status==="FAILED"?F.parseError(r.error):void 0,source:"pay",paymentId:r.paymentId||pe,configuration:{network:r.paymentAsset.network,asset:r.paymentAsset.asset,recipient:r.recipient,amount:r.amount},currentPayment:{type:r.currentPayment.type,exchangeId:r.currentPayment.exchangeId,sessionId:r.currentPayment.sessionId,result:r.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!r.paymentAsset.metadata.logoURI)try{const{chainNamespace:e}=b.parseCaipNetworkId(r.paymentAsset.network),t=await C.getImageByToken(r.paymentAsset.asset,e);r.paymentAsset.metadata.logoURI=t}catch{}}},kt=B`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`;var G=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let O=class extends L{constructor(){super(),this.unsubscribe=[],this.amount=u.state.amount,this.namespace=void 0,this.paymentAsset=u.state.paymentAsset,this.activeConnectorIds=k.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=u.state.exchanges,this.isLoading=u.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(u.subscribeKey("amount",t=>this.amount=t)),this.unsubscribe.push(k.subscribeKey("activeConnectorIds",t=>this.activeConnectorIds=t)),this.unsubscribe.push(u.subscribeKey("exchanges",t=>this.exchanges=t)),this.unsubscribe.push(u.subscribeKey("isLoading",t=>this.isLoading=t)),u.fetchExchanges(),u.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return l`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){const t=f.state.activeChain;this.namespace=t,this.caipAddress=f.getAccountData(t)?.caipAddress,this.unsubscribe.push(f.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress},t))}paymentDetailsTemplate(){const n=f.getAllRequestedCaipNetworks().find(s=>s.caipNetworkId===this.paymentAsset.network);return l`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${ie(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${n?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${w(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${w(C.getNetworkImage(n))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return It(this.paymentAsset.network)?this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate():l``}connectedWalletTemplate(){const{name:t,image:n}=this.getWalletProperties({namespace:this.namespace});return l`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${w(n)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${t}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return l`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return l`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;const t=this.exchanges.filter(n=>St(this.paymentAsset)?n.id===Te:n.id!==Te);return t.length===0?l`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:t.map(n=>l`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(n)}
          data-testid="exchange-option-${n.id}"
          ?chevron=${!0}
          imageSrc=${w(n.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${n.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return l`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw new Error("Namespace not found");this.caipAddress?H.push("PayQuote"):(await k.connect(),await K.open({view:"PayQuote"}))}onExchangePayment(t){u.setSelectedExchange(t),H.push("PayQuote")}async onDisconnect(){try{await $.disconnect(),await K.open({view:"Pay"})}catch{console.error("Failed to disconnect"),D.showError("Failed to disconnect")}}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};const n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};const s=k.getConnector({id:n,namespace:t});if(!s)return{name:void 0,image:void 0};const a=C.getConnectorImage(s);return{name:s.name,image:a}}};O.styles=kt;G([h()],O.prototype,"amount",void 0);G([h()],O.prototype,"namespace",void 0);G([h()],O.prototype,"paymentAsset",void 0);G([h()],O.prototype,"activeConnectorIds",void 0);G([h()],O.prototype,"caipAddress",void 0);G([h()],O.prototype,"exchanges",void 0);G([h()],O.prototype,"isLoading",void 0);O=G([U("w3m-pay-view")],O);const _t=B`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var V=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const Ct=3,$t=2,Rt=.3,Ot="200px",Ut={"accent-primary":He.tokens.core.backgroundAccentPrimary};let j=class extends L{constructor(){super(...arguments),this.rings=Ct,this.duration=$t,this.opacity=Rt,this.size=Ot,this.variant="accent-primary"}render(){const t=Ut[this.variant];this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${t};
      --pulse-opacity: ${this.opacity};
    `;const n=Array.from({length:this.rings},(s,a)=>this.renderRing(a,this.rings));return l`
      <div class="pulse-container">
        <div class="pulse-rings">${n}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(t,n){const a=`animation-delay: ${t/n*this.duration}s;`;return l`<div class="pulse-ring" style=${a}></div>`}};j.styles=[Ue,_t];V([I({type:Number})],j.prototype,"rings",void 0);V([I({type:Number})],j.prototype,"duration",void 0);V([I({type:Number})],j.prototype,"opacity",void 0);V([I()],j.prototype,"size",void 0);V([I()],j.prototype,"variant",void 0);j=V([U("wui-pulse")],j);const Re=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],Oe=["success","submitted","failure","timeout","refund"],Lt=B`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`;var q=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const qt={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]},Dt=3e3;let P=class extends L{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=u.state.paymentAsset,this.quoteStatus=u.state.quoteStatus,this.quote=u.state.quote,this.amount=u.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=k.state.activeConnectorIds,this.selectedExchange=u.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(u.subscribeKey("quoteStatus",t=>this.quoteStatus=t),u.subscribeKey("quote",t=>this.quote=t),k.subscribeKey("activeConnectorIds",t=>this.activeConnectorIds=t),u.subscribeKey("selectedExchange",t=>this.selectedExchange=t))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){const t=ie(this.amount||"0"),n=this.paymentAsset.metadata.symbol??"Unknown",a=f.getAllRequestedCaipNetworks().find(c=>c.caipNetworkId===this.paymentAsset.network),i=this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund";return this.quoteStatus==="success"||this.quoteStatus==="submitted"?l`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:i?l`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:l`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${w(C.getNetworkImage(a))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${t} ${n}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return l`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){const t=this.getStepsWithStatus();return l`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${t.map(n=>this.renderStep(n))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){const t=this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund",n=this.quoteStatus==="success"||this.quoteStatus==="submitted";if(t)return l`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(n)return l`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;const s=this.quote?.timeInSeconds??0;return l`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${s} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){const n=f.getAllRequestedCaipNetworks().find(o=>{const c=this.quote?.origin.currency.network;if(!c)return!1;const{chainId:m}=b.parseCaipNetworkId(c);return T.isLowerCaseMatch(o.id.toString(),m.toString())}),s=N.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString(),a=ie(s),i=this.quote?.origin.currency.metadata.symbol??"Unknown";return l`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${a}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${i}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${w(C.getNetworkImage(n))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${n?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return l`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Wallet</wui-text>

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){const{image:t}=this.getWalletProperties({namespace:this.namespace}),{address:n}=this.caipAddress?b.parseCaipAddress(this.caipAddress):{},s=this.selectedExchange?.name;return this.selectedExchange?l`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${s}</wui-text>
          <wui-image src=${w(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:l`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${Ke.getTruncateString({string:this.profileName||n||s||"",charsStart:this.profileName?16:4,charsEnd:this.profileName?0:6,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${w(t)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund"?Re.map(n=>({...n,status:"failed"})):Re.map(n=>{const a=(qt[n.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...n,status:a}})}renderStep({title:t,icon:n,status:s}){return l`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${n} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${Le({"step-icon-box":!0,success:s==="completed"})}>
            ${this.renderStatusIndicator(s)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${t}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(t){return t==="completed"?l`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:t==="failed"?l`<wui-icon size="sm" color="error" name="close"></wui-icon>`:t==="pending"?l`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},Dt))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){const t=u.state.requestId;if(!t||Oe.includes(this.quoteStatus))this.stopPolling();else try{await u.fetchQuoteStatus({requestId:t}),Oe.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){const t=f.state.activeChain;this.namespace=t,this.caipAddress=f.getAccountData(t)?.caipAddress,this.profileName=f.getAccountData(t)?.profileName??null,this.unsubscribe.push(f.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress,this.profileName=n?.profileName??null},t))}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};const n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};const s=k.getConnector({id:n,namespace:t});if(!s)return{name:void 0,image:void 0};const a=C.getConnectorImage(s);return{name:s.name,image:a}}};P.styles=Lt;q([h()],P.prototype,"paymentAsset",void 0);q([h()],P.prototype,"quoteStatus",void 0);q([h()],P.prototype,"quote",void 0);q([h()],P.prototype,"amount",void 0);q([h()],P.prototype,"namespace",void 0);q([h()],P.prototype,"caipAddress",void 0);q([h()],P.prototype,"profileName",void 0);q([h()],P.prototype,"activeConnectorIds",void 0);q([h()],P.prototype,"selectedExchange",void 0);P=q([U("w3m-pay-loading-view")],P);const Ft=Xe`
  :host {
    display: block;
  }
`;var Bt=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let ge=class extends L{render(){return l`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};ge.styles=[Ft];ge=Bt([U("w3m-pay-fees-skeleton")],ge);const Wt=B`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var Be=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let ae=class extends L{constructor(){super(),this.unsubscribe=[],this.quote=u.state.quote,this.unsubscribe.push(u.subscribeKey("quote",t=>this.quote=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=N.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return l`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${t} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(n=>this.renderFee(n)):null}
      </wui-flex>
    `}renderFee(t){const n=t.id==="network",s=N.formatNumber(t.amount||"0",{decimals:t.currency.metadata.decimals??0,round:6}).toString();if(n){const i=f.getAllRequestedCaipNetworks().find(o=>T.isLowerCaseMatch(o.caipNetworkId,t.currency.network));return l`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${s} ${t.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${w(C.getNetworkImage(i))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${i?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return l`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${s} ${t.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};ae.styles=[Wt];Be([h()],ae.prototype,"quote",void 0);ae=Be([U("w3m-pay-fees")],ae);const Mt=B`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var We=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let re=class extends L{constructor(){super(),this.unsubscribe=[],this.selectedExchange=u.state.selectedExchange,this.unsubscribe.push(u.subscribeKey("selectedExchange",t=>this.selectedExchange=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=!!this.selectedExchange;return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${t?null:l`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};re.styles=[Mt];We([I({type:Array})],re.prototype,"selectedExchange",void 0);re=We([U("w3m-pay-options-empty")],re);const jt=B`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`;var zt=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let we=class extends L{render(){return l`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return l`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};we.styles=[jt];we=zt([U("w3m-pay-options-skeleton")],we);const Gt=B`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var oe=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const Qt=300;let Q=class extends L{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(n=>n()),this.resizeObserver?.disconnect(),this.shadowRoot?.querySelector(".pay-options-container")?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){const t=this.shadowRoot?.querySelector(".pay-options-container");t&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),t?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(t),this.handleOptionsListScroll())}render(){return l`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(t=>this.payOptionTemplate(t))}
      </wui-flex>
    `}payOptionTemplate(t){const{network:n,metadata:s,asset:a,amount:i="0"}=t,c=f.getAllRequestedCaipNetworks().find(ce=>ce.caipNetworkId===n),m=`${n}:${a}`,S=`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,W=m===S,X=N.bigNumber(i,{safe:!0}),J=X.gt(0);return l`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(t)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${w(s.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${w(C.getNetworkImage(c))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${s.symbol}</wui-text>
            ${J?l`<wui-text variant="sm-regular" color="secondary">
                  ${X.round(6).toString()} ${s.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${W?l`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){const t=this.shadowRoot?.querySelector(".pay-options-container");if(!t)return;t.scrollHeight>Qt?(t.style.setProperty("--options-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),t.style.setProperty("--options-scroll--top-opacity",Ne.interpolate([0,50],[0,1],t.scrollTop).toString()),t.style.setProperty("--options-scroll--bottom-opacity",Ne.interpolate([0,50],[0,1],t.scrollHeight-t.scrollTop-t.offsetHeight).toString())):(t.style.setProperty("--options-mask-image","none"),t.style.setProperty("--options-scroll--top-opacity","0"),t.style.setProperty("--options-scroll--bottom-opacity","0"))}};Q.styles=[Gt];oe([I({type:Array})],Q.prototype,"options",void 0);oe([I()],Q.prototype,"selectedPaymentAsset",void 0);oe([I()],Q.prototype,"onSelect",void 0);Q=oe([U("w3m-pay-options")],Q);const Vt=B`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var A=function(e,t,n,s){var a=arguments.length,i=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const te={eip155:"ethereum",solana:"solana",bip122:"bitcoin",ton:"ton"},Yt={eip155:{icon:te.eip155,label:"EVM"},solana:{icon:te.solana,label:"Solana"},bip122:{icon:te.bip122,label:"Bitcoin"},ton:{icon:te.ton,label:"Ton"}};let x=class extends L{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=u.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=u.state.amount,this.recipient=u.state.recipient,this.activeConnectorIds=k.state.activeConnectorIds,this.selectedPaymentAsset=u.state.selectedPaymentAsset,this.selectedExchange=u.state.selectedExchange,this.isFetchingQuote=u.state.isFetchingQuote,this.quoteError=u.state.quoteError,this.quote=u.state.quote,this.isFetchingTokenBalances=u.state.isFetchingTokenBalances,this.tokenBalances=u.state.tokenBalances,this.isPaymentInProgress=u.state.isPaymentInProgress,this.exchangeUrlForQuote=u.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(u.subscribeKey("paymentAsset",t=>this.paymentAsset=t)),this.unsubscribe.push(u.subscribeKey("tokenBalances",t=>this.onTokenBalancesChanged(t))),this.unsubscribe.push(u.subscribeKey("isFetchingTokenBalances",t=>this.isFetchingTokenBalances=t)),this.unsubscribe.push(k.subscribeKey("activeConnectorIds",t=>this.activeConnectorIds=t)),this.unsubscribe.push(u.subscribeKey("selectedPaymentAsset",t=>this.selectedPaymentAsset=t)),this.unsubscribe.push(u.subscribeKey("isFetchingQuote",t=>this.isFetchingQuote=t)),this.unsubscribe.push(u.subscribeKey("quoteError",t=>this.quoteError=t)),this.unsubscribe.push(u.subscribeKey("quote",t=>this.quote=t)),this.unsubscribe.push(u.subscribeKey("amount",t=>this.amount=t)),this.unsubscribe.push(u.subscribeKey("recipient",t=>this.recipient=t)),this.unsubscribe.push(u.subscribeKey("isPaymentInProgress",t=>this.isPaymentInProgress=t)),this.unsubscribe.push(u.subscribeKey("selectedExchange",t=>this.selectedExchange=t)),this.unsubscribe.push(u.subscribeKey("exchangeUrlForQuote",t=>this.exchangeUrlForQuote=t)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(t=>t())}updated(t){super.updated(t),t.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return l`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){const o=N.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return l`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?l`<wui-text variant="lg-regular" color="primary">
                ${N.bigNumber(o,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:l`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}const t=F.getPlainAddress(this.caipAddress)??"",{name:n,image:s}=this.getWalletProperties({namespace:this.namespace}),{icon:a,label:i}=Yt[this.namespace]??{};return l`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${w(this.profileName)}
          address=${w(t)}
          imageSrc=${w(s)}
          alt=${w(n)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${w(i)}
          address=${w(t)}
          icon=${w(a)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${w(i)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){const t=f.state.activeChain;this.namespace=t,this.caipAddress=f.getAccountData(t)?.caipAddress,this.profileName=f.getAccountData(t)?.profileName??null,this.unsubscribe.push(f.subscribeChainProp("accountState",n=>this.onAccountStateChanged(n),t))}async fetchTokens(){if(this.namespace){let t;if(this.caipAddress){const{chainId:n,chainNamespace:s}=b.parseCaipAddress(this.caipAddress),a=`${s}:${n}`;t=f.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===a)}await u.fetchTokens({caipAddress:this.caipAddress,caipNetwork:t,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){const{address:t}=this.caipAddress?b.parseCaipAddress(this.caipAddress):{};u.fetchQuote({amount:this.amount.toString(),address:t,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};const n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};const s=k.getConnector({id:n,namespace:t});if(!s)return{name:void 0,image:void 0};const a=C.getConnectorImage(s);return{name:s.name,image:a}}paymentOptionsViewTemplate(){return l`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){const t=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return l`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(t.length===0)return l`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;const n={disabled:this.isFetchingQuote};return l`<w3m-pay-options
      class=${Le(n)}
      .options=${t}
      .selectedPaymentAsset=${w(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?l`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:l`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){const t=this.isFetchingQuote||this.isFetchingTokenBalances,n=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,s=N.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?t||n?l`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:l`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:l`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${t||n?l`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:l`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${ie(s)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:t,isDisabled:n})}
      </wui-flex>
    `}actionButtonTemplate(t){const n=le(this.quote),{isLoading:s,isDisabled:a}=t;let i="Pay";return n.length>1&&this.completedTransactionsCount===0&&(i="Approve"),l`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${s||this.isPaymentInProgress}
        ?disabled=${a||this.isPaymentInProgress}
        @click=${()=>{n.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${i}
        ${s?null:l`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(a=>{try{return Nt(a)}catch{return null}}).filter(a=>!!a).filter(a=>{const{chainId:i}=b.parseCaipNetworkId(a.network),{chainId:o}=b.parseCaipNetworkId(this.paymentAsset.network);return T.isLowerCaseMatch(a.asset,this.paymentAsset.asset)?!0:this.selectedExchange?!T.isLowerCaseMatch(i.toString(),o.toString()):!0}):[]}onTokenBalancesChanged(t){this.tokenBalances=t;const[n]=this.getPaymentAssetFromTokenBalances();n&&u.setSelectedPaymentAsset(n)}async onConnectOtherWallet(){await k.connect(),await K.open({view:"PayQuote"})}onAccountStateChanged(t){const{address:n}=this.caipAddress?b.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=t?.caipAddress,this.profileName=t?.profileName??null,n){const{address:s}=this.caipAddress?b.parseCaipAddress(this.caipAddress):{};s?T.isLowerCaseMatch(s,n)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):K.close()}}onSelectedPaymentAssetChanged(t){this.isFetchingQuote||u.setSelectedPaymentAsset(t)}async onTransfer(){const t=me(this.quote);if(t){if(!T.isLowerCaseMatch(this.selectedPaymentAsset?.asset,t.deposit.currency))throw new Error("Quote asset is not the same as the selected payment asset");const s=this.selectedPaymentAsset?.amount??"0",a=N.formatNumber(t.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!N.bigNumber(s).gte(a)){D.showError("Insufficient funds");return}if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){const{address:o}=b.parseCaipAddress(this.caipAddress);await u.onTransfer({chainNamespace:this.namespace,fromAddress:o,toAddress:t.deposit.receiver,amount:a,paymentAsset:this.selectedPaymentAsset}),u.setRequestId(t.requestId),H.push("PayLoading")}}}async onSendTransactions(){const t=this.selectedPaymentAsset?.amount??"0",n=N.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!N.bigNumber(t).gte(n)){D.showError("Insufficient funds");return}const a=le(this.quote),[i]=le(this.quote,this.completedTransactionsCount);i&&this.namespace&&(await u.onSendTransaction({namespace:this.namespace,transactionStep:i}),this.completedTransactionsCount+=1,this.completedTransactionsCount===a.length&&(u.setRequestId(i.requestId),H.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){const t=F.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!t)throw new Error("Could not create popup window");t.location.href=this.exchangeUrlForQuote;const n=me(this.quote);n&&u.setRequestId(n.requestId),u.initiatePayment(),H.push("PayLoading")}}resetAssetsState(){u.setSelectedPaymentAsset(null)}resetQuoteState(){u.resetQuoteState()}};x.styles=Vt;A([h()],x.prototype,"profileName",void 0);A([h()],x.prototype,"paymentAsset",void 0);A([h()],x.prototype,"namespace",void 0);A([h()],x.prototype,"caipAddress",void 0);A([h()],x.prototype,"amount",void 0);A([h()],x.prototype,"recipient",void 0);A([h()],x.prototype,"activeConnectorIds",void 0);A([h()],x.prototype,"selectedPaymentAsset",void 0);A([h()],x.prototype,"selectedExchange",void 0);A([h()],x.prototype,"isFetchingQuote",void 0);A([h()],x.prototype,"quoteError",void 0);A([h()],x.prototype,"quote",void 0);A([h()],x.prototype,"isFetchingTokenBalances",void 0);A([h()],x.prototype,"tokenBalances",void 0);A([h()],x.prototype,"isPaymentInProgress",void 0);A([h()],x.prototype,"exchangeUrlForQuote",void 0);A([h()],x.prototype,"completedTransactionsCount",void 0);x=A([U("w3m-pay-quote-view")],x);export{p as A,u as P,P as W,d as a,x as b,O as c};
