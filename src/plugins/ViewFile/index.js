import dialog from './dialog.vue'
import { createApp } from 'vue';
import { ElLoading ,ElMessage , ElImage} from 'element-plus'
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
    vm.use(ElImage);
    vm.use(ElLoading);
    const dome = vm.mount(NodeBox);
    return dome;
}

const install = (app)=>{
    const open = ({current=0,fileList=[]}={})=>{
        if(fileList&&fileList.length > 0){
            const dome = createEl(dialog,{fileList});
            dome.open(current);
        }else{
            ElMessage.error('文件列表不能为空')
        }
    } 
    app.config.globalProperties.$viewFile = {
        open,
    };

}
const viewFile = {
    install
}
export default viewFile