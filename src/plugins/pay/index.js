import PayDialog from './PayDialog.vue'
import SetPassword from './SetPassword.vue'
import RechargeDialog from './RechargeDialog.vue'
import MemberDialog from './openMemberDialog.vue'
import { createApp } from 'vue';
import store from '@/store'
import ElementPlus from 'element-plus';
import { ElNotification } from 'element-plus'
let RechargeDemo;
const nodeData = {
    pay: null,
    recharge: null
}
const createEl = (component,options,nodeName)=>{
    if(nodeData[nodeName]){
        document.body.removeChild(nodeData[nodeName]);
        nodeData[nodeName] = null;
    }
    nodeData[nodeName] = document.createElement('div');
    document.body.appendChild(nodeData[nodeName]);
    const vm = createApp(component,{
    ...options,
    removeNode(){
        document.body.removeChild(nodeData[nodeName]);
        nodeData[nodeName] = null;
        if(nodeName == 'recharge'){
            RechargeDemo = null
        }
    }});
    vm.use(store);
    vm.use(ElementPlus);
    const dome = vm.mount(nodeData[nodeName]);
    return dome;
}


// 打开支付密码
export const openPay = ({confirm=null,orderNo=null,error=null}={})=>{
    if(store.state.user.passwordStatus == 0){
        openSetPassword({
            onSubmitSuccess:()=>{
                const dome = createEl(PayDialog,{confirm,orderNo,error},'pay');
                dome.open();
            }
        })
    }else{
        const dome = createEl(PayDialog,{confirm,orderNo,error},'pay');
        dome.open();
    }
}
// 打开同钱充值
export const openRecharge = ()=>{
    RechargeDemo = createEl(RechargeDialog,{},'recharge');
    RechargeDemo.open();
}

// 打开设置支付密码
export const openSetPassword = ({ onSubmitSuccess , disabledPhone})=>{
    const dome = createEl(SetPassword,{ onSubmitSuccess, disabledPhone },'password');
    dome.open();
}

// 打开充值会员
export const openOpenMember = ({ onSubmitSuccess,payShow},vipCardState)=>{
    const dome = createEl(MemberDialog,{ onSubmitSuccess,payShow,},'openMember');
    dome.open(vipCardState);
}


const install = (app)=>{
    app.config.globalProperties.$pay = {
        openPay,
        openRecharge,
        openSetPassword,
        openOpenMember,
    };
}
const pay = {
    install,
    openOpenMember
}
export default pay;
