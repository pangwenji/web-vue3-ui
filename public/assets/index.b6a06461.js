import{_ as h}from"./index.a83617fe.js";import{o as s,i as n,l,v as u,x as _,p as k,m as p,t as x,n as f}from"./vendor.d1385716.js";const a=[{name:"HTML",id:"HTML"},{name:"CSS",id:"CSS"},{name:"Java",id:"Java"},{name:"JavaScript",id:"JavaScript"}],v={name:"AtDialog",props:{visible:Boolean,position:Object,queryString:String},data(){return{users:[],index:-1,mockList:a}},watch:{queryString(e){e?this.mockList=a.filter(({name:t})=>t.startsWith(e)):this.mockList=a.slice(0)}},mounted(){document.addEventListener("keyup",this.keyDownHandler)},destroyed(){document.removeEventListener("keyup",this.keyDownHandler)},methods:{keyDownHandler(e){if(e.code==="Escape"){this.$emit("onHide");return}if(e.code==="ArrowDown"&&(this.index>=this.mockList.length-1?this.index=0:this.index=this.index+1),e.code==="ArrowUp"&&(this.index<=0?this.index=this.mockList.length-1:this.index=this.index-1),e.code==="Enter"&&this.mockList.length){const t={name:this.mockList[this.index].name,id:this.mockList[this.index].id};this.$emit("onPickUser",t),this.index=-1}},clickAt(e,t){const i={name:t.name,id:t.id};this.$emit("onPickUser",i),this.index=-1},hoverAt(e){this.index=e}}},y={key:0,class:"empty"},L=["onClick","onMouseenter"],g={class:"name"};function S(e,t,i,w,o,d){return s(),n("div",{class:"wrapper",style:f({position:"fixed",top:i.position.y+"px",left:i.position.x+"px"})},[o.mockList.length?l("",!0):(s(),n("div",y,"\u65E0\u641C\u7D22\u7ED3\u679C")),(s(!0),n(u,null,_(o.mockList,(r,c)=>(s(),n("div",{key:r.id,class:k(["item",{active:c===o.index}]),ref_for:!0,ref:"usersRef",onClick:m=>d.clickAt(m,r),onMouseenter:m=>d.hoverAt(c)},[p("div",g,x(r.name),1)],42,L))),128))],4)}var C=h(v,[["render",S],["__scopeId","data-v-32b3c719"]]);export{C as default};