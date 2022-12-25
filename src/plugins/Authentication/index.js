import { createApp } from 'vue';
import store from '@/store';
import router from '@/router'
import element from 'element-plus';
import { Loading } from '@element-plus/icons-vue'
import RealName from './RealName.vue'
import MemberDialog from './MemberDialog.vue'
let nodeData = null;
const createEl = (component,options)=>{
    if(nodeData){
        document.body.removeChild(nodeData);
        nodeData = null;
    }
    nodeData = document.createElement('div');
    document.body.appendChild(nodeData);
    const vm = createApp(component,{
    ...options,
    removeNode(){
        document.body.removeChild(nodeData);
        nodeData = null;
    }});
    vm.use(store);
    vm.use(router);
    vm.use(element);
    vm.component('Loading',Loading)
    const dome = vm.mount(nodeData);
    return dome;
}


// 判断实名认证和会员认证
export const open = (callBack)=>{
    const member = store.state.user.member; // 会员认证
    const verified = store.state.user.verified; // 是否认证
    if(verified && member && member.state === 1){
        callBack(1)
    }else if(!member || member.state !== 1){
        openMember()
    }else{
        openAuth();
    }
}
// 打开认证
export const openAuth = ({onSubmitSuccess} = {})=>{
    const dome = createEl(RealName,{ onSubmitSuccess });
    dome.open();
}
// 打开会员弹窗
export const openMember = ({onSubmitSuccess = null} = {})=>{
    const dome = createEl(MemberDialog,{ onSubmitSuccess });
    dome.open();
}

const install = (app)=>{
    app.config.globalProperties.$Authentication = {
        open,
        openAuth,
        openMember,
    };
}

const Authentication = {
    install,
}

export default Authentication;
