
import { createApp } from 'vue';
import store from '@/store'
import router from '@/router'
import spaceNotEnoughDialog from '@/plugins/spaceNotEnough/index.vue'
import {ElButton, ElDialog, ElForm, ElFormItem, ElIcon, ElImage, ElInput, ElLoading} from "element-plus";

const nodeData = {
    space: null,
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
    }});
    vm.use(ElIcon);
    vm.use(ElForm);
    vm.use(ElInput);
    vm.use(ElButton);
    vm.use(ElFormItem);
    vm.use(ElDialog);
    vm.use(ElImage);
    vm.use(ElLoading);
    vm.use(router);
    vm.use(store);
    const dome = vm.mount(nodeData[nodeName]);
    return dome;
}

// 打开空间不足弹窗
export const openSpaceNotEnough = ()=>{
    const dome = createEl(spaceNotEnoughDialog,{},'spaceNotEnoughDialog');
    dome.open();
}


const install = (app)=>{
    app.config.globalProperties.$spaceNotEnough = {
        openSpaceNotEnough,
    };
}
const spaceNotEnough = {
    install,
    openSpaceNotEnough
}
export default spaceNotEnough;
