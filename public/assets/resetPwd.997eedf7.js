import{j as P}from"./user.22d0d2a8.js";import{a7 as g,g as b,r as n,o as V,c as x,w as r,j as s,k as a,L as w,R as y}from"./vendor.d1385716.js";import"./index.a83617fe.js";const h=w("\u4FDD\u5B58"),q=w("\u5173\u95ED"),R={setup(v){const{proxy:u}=y(),e=g({oldPassword:void 0,newPassword:void 0,confirmPassword:void 0}),i=b({oldPassword:[{required:!0,message:"\u65E7\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],newPassword:[{required:!0,message:"\u65B0\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"},{min:6,max:20,message:"\u957F\u5EA6\u5728 6 \u5230 20 \u4E2A\u5B57\u7B26",trigger:"blur"}],confirmPassword:[{required:!0,message:"\u786E\u8BA4\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"},{required:!0,validator:(p,o,d)=>{e.newPassword!==o?d(new Error("\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4")):d()},trigger:"blur"}]});function f(){u.$refs.pwdRef.validate(p=>{p&&P(e.oldPassword,e.newPassword).then(o=>{u.$modal.msgSuccess("\u4FEE\u6539\u6210\u529F")})})}function c(){u.$tab.closePage()}return(p,o)=>{const d=n("el-input"),t=n("el-form-item"),m=n("el-button"),_=n("el-form");return V(),x(_,{ref:"pwdRef",model:a(e),rules:i.value,"label-width":"80px"},{default:r(()=>[s(t,{label:"\u65E7\u5BC6\u7801",prop:"oldPassword"},{default:r(()=>[s(d,{modelValue:a(e).oldPassword,"onUpdate:modelValue":o[0]||(o[0]=l=>a(e).oldPassword=l),placeholder:"\u8BF7\u8F93\u5165\u65E7\u5BC6\u7801",type:"password","show-password":""},null,8,["modelValue"])]),_:1}),s(t,{label:"\u65B0\u5BC6\u7801",prop:"newPassword"},{default:r(()=>[s(d,{modelValue:a(e).newPassword,"onUpdate:modelValue":o[1]||(o[1]=l=>a(e).newPassword=l),placeholder:"\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801",type:"password","show-password":""},null,8,["modelValue"])]),_:1}),s(t,{label:"\u786E\u8BA4\u5BC6\u7801",prop:"confirmPassword"},{default:r(()=>[s(d,{modelValue:a(e).confirmPassword,"onUpdate:modelValue":o[2]||(o[2]=l=>a(e).confirmPassword=l),placeholder:"\u8BF7\u786E\u8BA4\u5BC6\u7801",type:"password","show-password":""},null,8,["modelValue"])]),_:1}),s(t,null,{default:r(()=>[s(m,{type:"primary",onClick:f},{default:r(()=>[h]),_:1}),s(m,{type:"danger",onClick:c},{default:r(()=>[q]),_:1})]),_:1})]),_:1},8,["model","rules"])}}};export{R as default};
