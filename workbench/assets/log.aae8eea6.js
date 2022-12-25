var ce=Object.defineProperty;var M=Object.getOwnPropertySymbols;var _e=Object.prototype.hasOwnProperty,me=Object.prototype.propertyIsEnumerable;var Y=(_,n,i)=>n in _?ce(_,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):_[n]=i,z=(_,n)=>{for(var i in n||(n={}))_e.call(n,i)&&Y(_,i,n[i]);if(M)for(var i of M(n))me.call(n,i)&&Y(_,i,n[i]);return _};import{_ as fe,g as h,q as be,a6 as ge,a1 as ve,r,a7 as K,o as c,i as k,S as y,U as Q,j as e,w as o,k as l,a8 as he,C as E,G as F,c as w,m as O,t as j,J as d,l as A,I as we}from"./vendor.2b5961b2.js";import{g as je}from"./job.b77cdb66.js";import{s as G}from"./index.341eca8d.js";function ye(_){return G({url:"/schedule/job/log/list",method:"get",params:_})}function ke(_){return G({url:"/schedule/job/log/"+_,method:"delete"})}function Ve(){return G({url:"/schedule/job/log/clean",method:"delete"})}const xe={class:"app-container"},Ce=d("\u641C\u7D22"),Ne=d("\u91CD\u7F6E"),Se=d("\u5220\u9664"),De=d("\u6E05\u7A7A"),Le=d("\u5BFC\u51FA"),Te=d("\u5173\u95ED"),Ge=d("\u8BE6\u7EC6"),Ue={key:0},Ie={key:1},$e={class:"dialog-footer"},qe=d("\u5173 \u95ED"),Re=fe({name:"JobLog"}),Ke=Object.assign(Re,{setup(_){const{proxy:n}=we(),{sys_common_status:i,sys_job_group:U}=n.useDict("sys_common_status","sys_job_group"),I=h([]),V=h(!1),N=h(!0),S=h(!0),D=h([]),$=h(!0),L=h(0),x=h([]),H=be(),W=ge({form:{},queryParams:{pageNum:1,pageSize:10,dictName:void 0,dictType:void 0,status:void 0}}),{queryParams:u,form:m,rules:Je}=ve(W);function g(){N.value=!0,ye(n.addDateRange(u.value,x.value)).then(s=>{I.value=s.rows,L.value=s.total,N.value=!1})}function X(){const s={path:"/monitor/job"};n.$tab.closeOpenPage(s)}function T(){u.value.pageNum=1,g()}function Z(){x.value=[],n.resetForm("queryRef"),T()}function ee(s){D.value=s.map(a=>a.jobLogId),$.value=!s.length}function oe(s){V.value=!0,m.value=s}function te(s){n.$modal.confirm('\u662F\u5426\u786E\u8BA4\u5220\u9664\u8C03\u5EA6\u65E5\u5FD7\u7F16\u53F7\u4E3A"'+D.value+'"\u7684\u6570\u636E\u9879?').then(function(){return ke(D.value)}).then(()=>{g(),n.$modal.msgSuccess("\u5220\u9664\u6210\u529F")}).catch(()=>{})}function le(){n.$modal.confirm("\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u6240\u6709\u8C03\u5EA6\u65E5\u5FD7\u6570\u636E\u9879?").then(function(){return Ve()}).then(()=>{g(),n.$modal.msgSuccess("\u6E05\u7A7A\u6210\u529F")}).catch(()=>{})}function ae(){n.download("schedule/job/log/export",z({},u.value),`job_log_${new Date().getTime()}.xlsx`)}return(()=>{const s=H.query.jobId;s!==void 0&&s!=0?je(s).then(a=>{u.value.jobName=a.data.jobName,u.value.jobGroup=a.data.jobGroup,g()}):g()})(),g(),(s,a)=>{const ne=r("el-input"),p=r("el-form-item"),q=r("el-option"),R=r("el-select"),ue=r("el-date-picker"),v=r("el-button"),J=r("el-form"),f=r("el-col"),se=r("right-toolbar"),P=r("el-row"),b=r("el-table-column"),B=r("dict-tag"),re=r("el-table"),de=r("pagination"),ie=r("el-dialog"),C=K("hasPermi"),pe=K("loading");return c(),k("div",xe,[y(e(J,{model:l(u),ref:"queryRef",inline:!0,"label-width":"68px"},{default:o(()=>[e(p,{label:"\u4EFB\u52A1\u540D\u79F0",prop:"jobName"},{default:o(()=>[e(ne,{modelValue:l(u).jobName,"onUpdate:modelValue":a[0]||(a[0]=t=>l(u).jobName=t),placeholder:"\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0",clearable:"",style:{width:"240px"},onKeyup:he(T,["enter"])},null,8,["modelValue","onKeyup"])]),_:1}),e(p,{label:"\u4EFB\u52A1\u7EC4\u540D",prop:"jobGroup"},{default:o(()=>[e(R,{modelValue:l(u).jobGroup,"onUpdate:modelValue":a[1]||(a[1]=t=>l(u).jobGroup=t),placeholder:"\u8BF7\u9009\u62E9\u4EFB\u52A1\u7EC4\u540D",clearable:"",style:{width:"240px"}},{default:o(()=>[(c(!0),k(E,null,F(l(U),t=>(c(),w(q,{key:t.value,label:t.label,value:t.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),e(p,{label:"\u6267\u884C\u72B6\u6001",prop:"status"},{default:o(()=>[e(R,{modelValue:l(u).status,"onUpdate:modelValue":a[2]||(a[2]=t=>l(u).status=t),placeholder:"\u8BF7\u9009\u62E9\u6267\u884C\u72B6\u6001",clearable:"",style:{width:"240px"}},{default:o(()=>[(c(!0),k(E,null,F(l(i),t=>(c(),w(q,{key:t.value,label:t.label,value:t.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),e(p,{label:"\u6267\u884C\u65F6\u95F4",style:{width:"308px"}},{default:o(()=>[e(ue,{modelValue:x.value,"onUpdate:modelValue":a[3]||(a[3]=t=>x.value=t),"value-format":"YYYY-MM-DD",type:"daterange","range-separator":"-","start-placeholder":"\u5F00\u59CB\u65E5\u671F","end-placeholder":"\u7ED3\u675F\u65E5\u671F"},null,8,["modelValue"])]),_:1}),e(p,null,{default:o(()=>[e(v,{type:"primary",icon:"Search",onClick:T},{default:o(()=>[Ce]),_:1}),e(v,{icon:"Refresh",onClick:Z},{default:o(()=>[Ne]),_:1})]),_:1})]),_:1},8,["model"]),[[Q,S.value]]),e(P,{gutter:10,class:"mb8"},{default:o(()=>[e(f,{span:1.5},{default:o(()=>[y((c(),w(v,{type:"danger",plain:"",icon:"Delete",disabled:$.value,onClick:te},{default:o(()=>[Se]),_:1},8,["disabled"])),[[C,["monitor:job:remove"]]])]),_:1},8,["span"]),e(f,{span:1.5},{default:o(()=>[y((c(),w(v,{type:"danger",plain:"",icon:"Delete",onClick:le},{default:o(()=>[De]),_:1})),[[C,["monitor:job:remove"]]])]),_:1},8,["span"]),e(f,{span:1.5},{default:o(()=>[y((c(),w(v,{type:"warning",plain:"",icon:"Download",onClick:ae},{default:o(()=>[Le]),_:1})),[[C,["monitor:job:export"]]])]),_:1},8,["span"]),e(f,{span:1.5},{default:o(()=>[e(v,{type:"warning",plain:"",icon:"Close",onClick:X},{default:o(()=>[Te]),_:1})]),_:1},8,["span"]),e(se,{showSearch:S.value,"onUpdate:showSearch":a[4]||(a[4]=t=>S.value=t),onQueryTable:g},null,8,["showSearch"])]),_:1}),y((c(),w(re,{data:I.value,onSelectionChange:ee},{default:o(()=>[e(b,{type:"selection",width:"55",align:"center"}),e(b,{label:"\u65E5\u5FD7\u7F16\u53F7",width:"80",align:"center",prop:"jobLogId"}),e(b,{label:"\u4EFB\u52A1\u540D\u79F0",align:"center",prop:"jobName","show-overflow-tooltip":!0}),e(b,{label:"\u4EFB\u52A1\u7EC4\u540D",align:"center",prop:"jobGroup","show-overflow-tooltip":!0},{default:o(t=>[e(B,{options:l(U),value:t.row.jobGroup},null,8,["options","value"])]),_:1}),e(b,{label:"\u8C03\u7528\u76EE\u6807\u5B57\u7B26\u4E32",align:"center",prop:"invokeTarget","show-overflow-tooltip":!0}),e(b,{label:"\u65E5\u5FD7\u4FE1\u606F",align:"center",prop:"jobMessage","show-overflow-tooltip":!0}),e(b,{label:"\u6267\u884C\u72B6\u6001",align:"center",prop:"status"},{default:o(t=>[e(B,{options:l(i),value:t.row.status},null,8,["options","value"])]),_:1}),e(b,{label:"\u6267\u884C\u65F6\u95F4",align:"center",prop:"createTime",width:"180"},{default:o(t=>[O("span",null,j(s.parseTime(t.row.createTime)),1)]),_:1}),e(b,{label:"\u64CD\u4F5C",align:"center","class-name":"small-padding fixed-width"},{default:o(t=>[y((c(),w(v,{type:"text",icon:"View",onClick:Pe=>oe(t.row)},{default:o(()=>[Ge]),_:2},1032,["onClick"])),[[C,["monitor:job:query"]]])]),_:1})]),_:1},8,["data"])),[[pe,N.value]]),y(e(de,{total:L.value,page:l(u).pageNum,"onUpdate:page":a[5]||(a[5]=t=>l(u).pageNum=t),limit:l(u).pageSize,"onUpdate:limit":a[6]||(a[6]=t=>l(u).pageSize=t),onPagination:g},null,8,["total","page","limit"]),[[Q,L.value>0]]),e(ie,{title:"\u8C03\u5EA6\u65E5\u5FD7\u8BE6\u7EC6",modelValue:V.value,"onUpdate:modelValue":a[8]||(a[8]=t=>V.value=t),width:"700px","append-to-body":""},{footer:o(()=>[O("div",$e,[e(v,{onClick:a[7]||(a[7]=t=>V.value=!1)},{default:o(()=>[qe]),_:1})])]),default:o(()=>[e(J,{model:l(m),"label-width":"100px"},{default:o(()=>[e(P,null,{default:o(()=>[e(f,{span:12},{default:o(()=>[e(p,{label:"\u65E5\u5FD7\u5E8F\u53F7\uFF1A"},{default:o(()=>[d(j(l(m).jobLogId),1)]),_:1}),e(p,{label:"\u4EFB\u52A1\u540D\u79F0\uFF1A"},{default:o(()=>[d(j(l(m).jobName),1)]),_:1})]),_:1}),e(f,{span:12},{default:o(()=>[e(p,{label:"\u4EFB\u52A1\u5206\u7EC4\uFF1A"},{default:o(()=>[d(j(l(m).jobGroup),1)]),_:1}),e(p,{label:"\u6267\u884C\u65F6\u95F4\uFF1A"},{default:o(()=>[d(j(l(m).createTime),1)]),_:1})]),_:1}),e(f,{span:24},{default:o(()=>[e(p,{label:"\u8C03\u7528\u65B9\u6CD5\uFF1A"},{default:o(()=>[d(j(l(m).invokeTarget),1)]),_:1})]),_:1}),e(f,{span:24},{default:o(()=>[e(p,{label:"\u65E5\u5FD7\u4FE1\u606F\uFF1A"},{default:o(()=>[d(j(l(m).jobMessage),1)]),_:1})]),_:1}),e(f,{span:24},{default:o(()=>[e(p,{label:"\u6267\u884C\u72B6\u6001\uFF1A"},{default:o(()=>[l(m).status==0?(c(),k("div",Ue,"\u6B63\u5E38")):l(m).status==1?(c(),k("div",Ie,"\u5931\u8D25")):A("",!0)]),_:1})]),_:1}),e(f,{span:24},{default:o(()=>[l(m).status==1?(c(),w(p,{key:0,label:"\u5F02\u5E38\u4FE1\u606F\uFF1A"},{default:o(()=>[d(j(l(m).exceptionInfo),1)]),_:1})):A("",!0)]),_:1})]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}});export{Ke as default};
