import{u as L,h as f,r as p,o as t,c as m,w as _,m as o,k as s,l as u,i as d,x as g,j as n,t as S,v as x,z as B,A as w}from"./vendor.d1385716.js";import{_ as N}from"./index.45f5150f.js";const T=l=>(B("data-v-fe1b3cfc"),l=l(),w(),l),V=T(()=>o("div",{class:"layout-select-title"},"\u89C6\u56FE\u98CE\u683C",-1)),Y=["onClick"],$={key:0,class:"check"},M=T(()=>o("div",{class:"layout-select-title"},"\u5361\u7247\u5927\u5C0F",-1)),O=["onClick"],U={key:0,class:"check"},D=["title"],F={setup(l){const j=[{title:"\u5361\u7247",icon:"menu-icon",type:"card"},{title:"\u5217\u8868",icon:"list",type:"list"}],b=[{title:"\u5927\u5361\u7247",icon:"menu-big",type:"large"},{title:"\u4E2D\u5361\u7247",icon:"menu-base",type:"base"},{title:"\u5C0F\u5361\u7247",icon:"menu-small",type:"small"}],a=L(),c=f(()=>a.state.project.layoutType),z=f(()=>a.state.project.layoutSize),v=i=>{a.commit("project/SET_LAYOUT_TYPE",i)},A=i=>{a.commit("project/SET_LAYOUT_SIZE",i)};return(i,h)=>{const r=p("svg-icon"),k=p("Check"),C=p("el-icon"),E=p("el-popover");return t(),m(E,{placement:"bottom","hide-after":0,trigger:"contextmenu"},{reference:_(()=>[o("span",{class:"type",onClick:h[0]||(h[0]=e=>v(s(c)=="card"?"list":"card")),title:s(c)=="card"?"\u5361\u7247\u98CE\u683C":"\u5217\u8868\u98CE\u683C"},[s(c)=="card"?(t(),m(r,{key:0,iconClass:"menu-icon"})):u("",!0),s(c)=="list"?(t(),m(r,{key:1,iconClass:"list"})):u("",!0)],8,D)]),default:_(()=>[V,(t(),d(x,null,g(j,(e,y)=>o("div",{class:"layout-select-item",key:y,onClick:I=>v(e.type)},[n(r,{iconClass:e.icon},null,8,["iconClass"]),o("span",null,S(e.title),1),s(c)==e.type?(t(),d("span",$,[n(C,null,{default:_(()=>[n(k)]),_:1})])):u("",!0)],8,Y)),64)),M,(t(),d(x,null,g(b,(e,y)=>o("div",{class:"layout-select-item",key:y,onClick:I=>A(e.type)},[n(r,{iconClass:e.icon},null,8,["iconClass"]),o("span",null,S(e.title),1),s(z)==e.type?(t(),d("span",U,[n(C,null,{default:_(()=>[n(k)]),_:1})])):u("",!0)],8,O)),64))]),_:1})}}};var q=N(F,[["__scopeId","data-v-fe1b3cfc"]]);export{q as default};
