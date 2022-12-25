import { createApp } from 'vue';
import store from '@/store';
import element from 'element-plus';
import Dialog from './Dialog.vue';
import Pagination from '@/components/Pagination'
import { Folder, FolderOpened } from '@element-plus/icons-vue'
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
    vm.use(element);
    vm.component('Folder',Folder)
    vm.component('Pagination',Pagination)
    vm.component('FolderOpened',FolderOpened)
    const dome = vm.mount(nodeData);
    return dome;
}

export const open = ({fileCat='',onSubmitSuccess = null,onAfterConfirm=null} = {})=>{
    const dome = createEl(Dialog,{fileCat, onSubmitSuccess,onAfterConfirm });
    dome.open();
}

const install = (app)=>{
    app.config.globalProperties.$CloudFile = {
        open
    };
}

const CloudFile = {
    install,
}

export default CloudFile;