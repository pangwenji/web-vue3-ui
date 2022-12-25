import dialog from './dialog'
import store from '@/store'
import router from '@/router'
import { createApp } from 'vue';
import { ElLoading , ElImage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElIcon} from 'element-plus'
import { CircleCloseFilled , Loading} from '@element-plus/icons-vue'
let NodeBox
const createEl = (component,options={})=>{
    if(NodeBox){
        document.body.removeChild(NodeBox);
        NodeBox = null;
    }
    NodeBox = document.createElement('div');
    document.body.appendChild(NodeBox);
    const vm = createApp(component,{
        ...options,
        removeNode(){
            document.body.removeChild(NodeBox);
            NodeBox = null;
        }
    });
    vm.use(ElIcon);
    vm.use(ElForm);
    vm.use(ElInput);
    vm.use(ElButton);
    vm.use(ElFormItem);
    vm.use(ElDialog);
    vm.use(ElImage);
    vm.use(ElLoading);
    vm.use(store);
    vm.use(router);
    vm.component("Loading", Loading);
    vm.component("CircleCloseFilled", CircleCloseFilled);
    const dome = vm.mount(NodeBox);
    return dome;
}


export const openLogin = ({onSuccess} = {})=>{
    if(NodeBox){
        return
    }
    const dome = createEl(dialog,{onSuccess});
    dome.open();
} 

const install = (app)=>{
    app.config.globalProperties.$loginDialog = {
        open:openLogin,
    };
}
const loadingDialog = {
    install
}
export default loadingDialog