import{a0 as re,q as ce,g as p,a7 as pe,a3 as me,af as _e,r as i,a8 as D,o as f,i as B,U as u,V as F,j as e,w as a,k as o,a9 as L,c as g,m as Y,t as G,v as fe,x as be,L as v,R as ge}from"./vendor.d1385716.js";import{a as ve,b as he,s as we,p as ye,d as Ce}from"./gen.8f8f7933.js";import{m as Ne}from"./index.45f5150f.js";import xe from"./importTable.813b38d5.js";const ke={class:"app-container"},Ve=v("\u641C\u7D22"),Se=v("\u91CD\u7F6E"),$e=v("\u751F\u6210"),Te=v("\u5BFC\u5165"),De=v("\u4FEE\u6539"),Ie=v("\u5220\u9664"),Re=v("\xA0\u590D\u5236"),qe=re({name:"Gen"}),Ee=Object.assign(qe,{setup(Ue){const I=ce(),{proxy:d}=ge(),R=p([]),k=p(!0),V=p(!0),S=p([]),q=p(!0),U=p(!0),$=p(0),j=p([]),w=p([]),P=p(""),Q=pe({queryParams:{pageNum:1,pageSize:10,tableName:void 0,tableComment:void 0},preview:{open:!1,title:"\u4EE3\u7801\u9884\u89C8",data:{},activeName:"domain.java"}}),{queryParams:s,preview:m}=me(Q);_e(()=>{const n=I.query.t;n!=null&&n!=P.value&&(P.value=n,s.value.pageNum=Number(I.query.pageNum),w.value=[],d.resetForm("queryForm"),h())});function h(){k.value=!0,ve(d.addDateRange(s.value,w.value)).then(n=>{R.value=n.rows,$.value=n.total,k.value=!1})}function y(){s.value.pageNum=1,h()}function O(n){const t=n.tableName||j.value;if(t==""){d.$modal.msgError("\u8BF7\u9009\u62E9\u8981\u751F\u6210\u7684\u6570\u636E");return}n.genType==="1"?he(n.tableName).then(T=>{d.$modal.msgSuccess("\u6210\u529F\u751F\u6210\u5230\u81EA\u5B9A\u4E49\u8DEF\u5F84\uFF1A"+n.genPath)}):d.$download.zip("/code/gen/batchGenCode?tables="+t,"ruoyi")}function M(n){const t=n.tableName;d.$modal.confirm('\u786E\u8BA4\u8981\u5F3A\u5236\u540C\u6B65"'+t+'"\u8868\u7ED3\u6784\u5417\uFF1F').then(function(){return we(t)}).then(()=>{d.$modal.msgSuccess("\u540C\u6B65\u6210\u529F")}).catch(()=>{})}function A(){d.$refs.importRef.show()}function H(){w.value=[],d.resetForm("queryRef"),y()}function J(n){ye(n.tableId).then(t=>{m.value.data=t.data,m.value.open=!0,m.value.activeName="domain.java"})}function W(){d.$modal.msgSuccess("\u590D\u5236\u6210\u529F")}function X(n){S.value=n.map(t=>t.tableId),j.value=n.map(t=>t.tableName),q.value=n.length!=1,U.value=!n.length}function z(n){const t=n.tableId||S.value[0];Ne.push({path:"/tool/gen-edit/index/"+t,query:{pageNum:s.value.pageNum}})}function E(n){const t=n.tableId||S.value;d.$modal.confirm('\u662F\u5426\u786E\u8BA4\u5220\u9664\u8868\u7F16\u53F7\u4E3A"'+t+'"\u7684\u6570\u636E\u9879\uFF1F').then(function(){return Ce(t)}).then(()=>{h(),d.$modal.msgSuccess("\u5220\u9664\u6210\u529F")}).catch(()=>{})}return h(),(n,t)=>{const T=i("el-input"),N=i("el-form-item"),Z=i("el-date-picker"),c=i("el-button"),ee=i("el-form"),x=i("el-col"),te=i("right-toolbar"),ae=i("el-row"),b=i("el-table-column"),C=i("el-tooltip"),le=i("el-table"),ne=i("pagination"),oe=i("el-link"),ie=i("el-tab-pane"),se=i("el-tabs"),ue=i("el-dialog"),_=D("hasPermi"),de=D("loading"),K=D("copyText");return f(),B("div",ke,[u(e(ee,{model:o(s),ref:"queryRef",inline:!0,"label-width":"68px"},{default:a(()=>[e(N,{label:"\u8868\u540D\u79F0",prop:"tableName"},{default:a(()=>[e(T,{modelValue:o(s).tableName,"onUpdate:modelValue":t[0]||(t[0]=l=>o(s).tableName=l),placeholder:"\u8BF7\u8F93\u5165\u8868\u540D\u79F0",clearable:"",onKeyup:L(y,["enter"])},null,8,["modelValue","onKeyup"])]),_:1}),e(N,{label:"\u8868\u63CF\u8FF0",prop:"tableComment"},{default:a(()=>[e(T,{modelValue:o(s).tableComment,"onUpdate:modelValue":t[1]||(t[1]=l=>o(s).tableComment=l),placeholder:"\u8BF7\u8F93\u5165\u8868\u63CF\u8FF0",clearable:"",onKeyup:L(y,["enter"])},null,8,["modelValue","onKeyup"])]),_:1}),e(N,{label:"\u521B\u5EFA\u65F6\u95F4",style:{width:"308px"}},{default:a(()=>[e(Z,{modelValue:w.value,"onUpdate:modelValue":t[2]||(t[2]=l=>w.value=l),"value-format":"YYYY-MM-DD",type:"daterange","range-separator":"-","start-placeholder":"\u5F00\u59CB\u65E5\u671F","end-placeholder":"\u7ED3\u675F\u65E5\u671F"},null,8,["modelValue"])]),_:1}),e(N,null,{default:a(()=>[e(c,{type:"primary",icon:"Search",onClick:y},{default:a(()=>[Ve]),_:1}),e(c,{icon:"Refresh",onClick:H},{default:a(()=>[Se]),_:1})]),_:1})]),_:1},8,["model"]),[[F,V.value]]),e(ae,{gutter:10,class:"mb8"},{default:a(()=>[e(x,{span:1.5},{default:a(()=>[u((f(),g(c,{type:"primary",plain:"",icon:"Download",onClick:O},{default:a(()=>[$e]),_:1})),[[_,["tool:gen:code"]]])]),_:1},8,["span"]),e(x,{span:1.5},{default:a(()=>[u((f(),g(c,{type:"info",plain:"",icon:"Upload",onClick:A},{default:a(()=>[Te]),_:1})),[[_,["tool:gen:import"]]])]),_:1},8,["span"]),e(x,{span:1.5},{default:a(()=>[u((f(),g(c,{type:"success",plain:"",icon:"Edit",disabled:q.value,onClick:z},{default:a(()=>[De]),_:1},8,["disabled"])),[[_,["tool:gen:edit"]]])]),_:1},8,["span"]),e(x,{span:1.5},{default:a(()=>[u((f(),g(c,{type:"danger",plain:"",icon:"Delete",disabled:U.value,onClick:E},{default:a(()=>[Ie]),_:1},8,["disabled"])),[[_,["tool:gen:remove"]]])]),_:1},8,["span"]),e(te,{showSearch:V.value,"onUpdate:showSearch":t[3]||(t[3]=l=>V.value=l),onQueryTable:h},null,8,["showSearch"])]),_:1}),u((f(),g(le,{data:R.value,onSelectionChange:X},{default:a(()=>[e(b,{type:"selection",align:"center",width:"55"}),e(b,{label:"\u5E8F\u53F7",type:"index",width:"50",align:"center"},{default:a(l=>[Y("span",null,G((o(s).pageNum-1)*o(s).pageSize+l.$index+1),1)]),_:1}),e(b,{label:"\u8868\u540D\u79F0",align:"center",prop:"tableName","show-overflow-tooltip":!0}),e(b,{label:"\u8868\u63CF\u8FF0",align:"center",prop:"tableComment","show-overflow-tooltip":!0}),e(b,{label:"\u5B9E\u4F53",align:"center",prop:"className","show-overflow-tooltip":!0}),e(b,{label:"\u521B\u5EFA\u65F6\u95F4",align:"center",prop:"createTime",width:"160"}),e(b,{label:"\u66F4\u65B0\u65F6\u95F4",align:"center",prop:"updateTime",width:"160"}),e(b,{label:"\u64CD\u4F5C",align:"center",width:"330","class-name":"small-padding fixed-width"},{default:a(l=>[e(C,{content:"\u9884\u89C8",placement:"top"},{default:a(()=>[u(e(c,{type:"text",icon:"View",onClick:r=>J(l.row)},null,8,["onClick"]),[[_,["tool:gen:preview"]]])]),_:2},1024),e(C,{content:"\u7F16\u8F91",placement:"top"},{default:a(()=>[u(e(c,{type:"text",icon:"Edit",onClick:r=>z(l.row)},null,8,["onClick"]),[[_,["tool:gen:edit"]]])]),_:2},1024),e(C,{content:"\u5220\u9664",placement:"top"},{default:a(()=>[u(e(c,{type:"text",icon:"Delete",onClick:r=>E(l.row)},null,8,["onClick"]),[[_,["tool:gen:remove"]]])]),_:2},1024),e(C,{content:"\u540C\u6B65",placement:"top"},{default:a(()=>[u(e(c,{type:"text",icon:"Refresh",onClick:r=>M(l.row)},null,8,["onClick"]),[[_,["tool:gen:edit"]]])]),_:2},1024),e(C,{content:"\u751F\u6210\u4EE3\u7801",placement:"top"},{default:a(()=>[u(e(c,{type:"text",icon:"Download",onClick:r=>O(l.row)},null,8,["onClick"]),[[_,["tool:gen:code"]]])]),_:2},1024)]),_:1})]),_:1},8,["data"])),[[de,k.value]]),u(e(ne,{total:$.value,page:o(s).pageNum,"onUpdate:page":t[4]||(t[4]=l=>o(s).pageNum=l),limit:o(s).pageSize,"onUpdate:limit":t[5]||(t[5]=l=>o(s).pageSize=l),onPagination:h},null,8,["total","page","limit"]),[[F,$.value>0]]),e(ue,{title:o(m).title,modelValue:o(m).open,"onUpdate:modelValue":t[7]||(t[7]=l=>o(m).open=l),width:"80%",top:"5vh","append-to-body":"","custom-class":"scrollbar"},{default:a(()=>[e(se,{modelValue:o(m).activeName,"onUpdate:modelValue":t[6]||(t[6]=l=>o(m).activeName=l)},{default:a(()=>[(f(!0),B(fe,null,be(o(m).data,(l,r)=>(f(),g(ie,{label:r.substring(r.lastIndexOf("/")+1,r.indexOf(".vm")),name:r.substring(r.lastIndexOf("/")+1,r.indexOf(".vm")),key:r},{default:a(()=>[u((f(),g(oe,{underline:!1,icon:"DocumentCopy",style:{float:"right"}},{default:a(()=>[Re]),_:2},1024)),[[K,l],[K,W,"callback"]]),Y("pre",null,G(l),1)]),_:2},1032,["label","name"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["title","modelValue"]),e(o(xe),{ref:"importRef",onOk:y},null,512)])}}});export{Ee as default};
