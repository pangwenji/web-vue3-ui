import{u as H,s as J,g as D,h as C,r as p,o as x,i as O,m as e,n as E,p as f,k as L,I as u,t as G,j as o,w as a,v as I,x as P,z as q,A as K}from"./vendor.d1385716.js";import{_ as Q}from"./index.a83617fe.js";const _=s=>(q("data-v-212c54c5"),s=s(),K(),s),U=["onDragleave"],W=["onDrop","onDragend","onDragstart"],X={class:"popover-menu"},Z=_(()=>e("div",{class:"popover-menu-header"}," \u6211\u7684\u9879\u76EE ",-1)),ee={class:"second-menu"},te={class:"second-menu-header"},oe=_(()=>e("span",null,"\u6807\u8BB0",-1)),ne={class:"second-menu-content"},se=["onClick"],re={class:"popover-menu-item"},ae=_(()=>e("span",null,"\u6807\u8BB0",-1)),le={class:"popover-menu-item"},ie=_(()=>e("span",null,"\u6210\u5458\u7BA1\u7406",-1)),ce={class:"popover-menu-item"},pe=_(()=>e("span",null,"\u9080\u8BF7\u6210\u5458",-1)),de={props:{id:{type:[String,Number]},isDragOver:Boolean,active:Boolean,type:String,title:String,signColor:{type:String,default:"success",validator(s){return["success","warning","primary","purple","danger","yellow","none"].includes(s)}}},emits:["update:signColor","onDrop","click","onDragStart","onDragEnd"],setup(s,{emit:d}){const n=s,N=["success","warning","primary","purple","danger","yellow","none"],g=H();J();const i=D(""),y=D(),S=D(),R=()=>{y.value.tooltipRef.onOpen()},b="project-menu-item",B=C(()=>g.state.app.dragEvent),F=C(()=>g.state.project.projectData.id),M=t=>{g.commit("app/DRAG_EVENT",b),t.dataTransfer.setData("text/plain",JSON.stringify({id:n.id,type:n.type})),d("onDragStart",{id:n.id,type:n.type})},T=t=>{d("onDragEnd",{id:n.id,type:n.type})},z=t=>{if(B.value!==b||!n.isDragOver)return;t.preventDefault();const r=t.target.offsetHeight;t.offsetY>r/2?i.value="bottom":i.value="top"},V=t=>{i.value=""},Y=t=>{if(!n.isDragOver)return;const r=t.dataTransfer.getData("text"),v=JSON.parse(r),l={id:n.id,type:n.type},m=i.value;i.value="",d("onDrop",{newObj:l,oldObj:v,position:m})},j=t=>t==n.signColor?"point-active-"+t:"point-color-"+t,k=t=>{d("update:signColor",t)};return(t,r)=>{const v=p("more-filled"),l=p("el-icon"),m=p("circle-close"),h=p("folder"),$=p("arrow-right"),w=p("el-popover");return x(),O(I,null,[e("div",{onDragover:r[0]||(r[0]=u(c=>z(c),["stop"])),onClick:r[1]||(r[1]=c=>d("click")),onDragleave:u(V,["prevent"]),ref_key:"buttonRef",ref:S},[e("div",{class:"project-top-border",style:E("background:"+(i.value=="top"?"#409EFF":"transparent"))},null,4),e("div",{class:f(["project-item",{"project-item-active":L(F)==s.id}]),draggable:!0,onDrop:u(Y,["prevent","stop"]),onDragend:u(T,["prevent","stop"]),onDragstart:u(M,["stop"])},[e("span",{class:f(["point","point-color-"+s.signColor])},null,2),e("span",null,G(s.title),1),e("span",{class:"menu-btn",onClick:R},[o(l,null,{default:a(()=>[o(v)]),_:1})])],42,W),e("div",{class:"project-bottom-border",style:E("background:"+(i.value=="bottom"?"#409EFF":"transparent"))},null,4)],40,U),o(w,{"virtual-ref":S.value,"virtual-triggering":"",trigger:"contextmenu",ref_key:"popoverRefs",ref:y,transition:"none","hide-after":0,offset:0,placement:"right-start",width:"auto"},{default:a(()=>[e("div",X,[Z,o(w,{trigger:"hover",teleported:!1,"show-arrow":!1,"hide-after":200,offset:2,placement:"right-start",width:"auto"},{reference:a(()=>[e("div",re,[o(l,null,{default:a(()=>[o(h)]),_:1}),ae,o(l,{class:"right"},{default:a(()=>[o($)]),_:1})])]),default:a(()=>[e("div",ee,[e("div",te,[oe,e("span",{onClick:r[2]||(r[2]=c=>k("none")),class:f(["second-menu-close",j("none")]),title:"\u53D6\u6D88\u6807\u8BB0"},[o(l,null,{default:a(()=>[o(m)]),_:1})],2)]),e("div",ne,[(x(),O(I,null,P(N,(c,A)=>e("span",{class:f(["point",j(c)]),onClick:ue=>k(c),key:A},null,10,se)),64))])])]),_:1}),e("div",le,[o(l,null,{default:a(()=>[o(h)]),_:1}),ie]),e("div",ce,[o(l,null,{default:a(()=>[o(h)]),_:1}),pe])])]),_:1},8,["virtual-ref"])],64)}}};var fe=Q(de,[["__scopeId","data-v-212c54c5"]]);export{fe as default};
