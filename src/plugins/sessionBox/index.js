import sessionDialog from './sessionDialog.vue'
import { getUserImAccount } from '@/api/IM.js'
import { createApp } from 'vue';
import store from '@/store'
import router from '@/router'
import Empty from '@/components/Empty'
import SvgIcon from '@/components/SvgIcon'
import contextmenu from '../contextmenu'
import ElementPlus from 'element-plus'
import * as ElementIcon from '@element-plus/icons-vue'
import ViewFile from '@/plugins/ViewFile'
import { openLogin } from '@/plugins/loginDialog'
let NodeBox;
let sessionDemo;
const createEl = (component,options={})=>{
    if(NodeBox){
        // document.body.removeChild(NodeBox);
        // NodeBox = null;
    }
    NodeBox = document.createElement('div');
    document.body.appendChild(NodeBox);
    const vm = createApp(component,{
        ...options,
        removeNode(){
            // document.body.removeChild(NodeBox);
            // NodeBox = null;
            // sessionDemo = null;
        }
    });
    vm.component('Empty',Empty)
    vm.component('SvgIcon',SvgIcon)
    for(const key in ElementIcon){
        vm.component(key,ElementIcon[key])
    }
    vm.use(contextmenu);
    vm.use(ViewFile);
    vm.use(store);
    vm.use(router);
    vm.use(ElementPlus);
    return vm.mount(NodeBox);
}

export const open = ({}={})=>{
    if(!store.state.IM.im){
        openLogin();
        return
    }
    if(!sessionDemo){
        sessionDemo = createEl(sessionDialog,{});
        // sessionDemo.config.globalProperties.$sessionBox = $sessionBox
    }
    sessionDemo.open();
}
export const openDialog = ({account,name,avatar,userId,success,error})=>{
    if(!store.state.IM.im){
        openLogin();
        return
    }
    if(userId == store.state.user.userId || account == store.state.IM.account){
        return
    }
    if(account){
        if(!sessionDemo){
            sessionDemo = createEl(sessionDialog,{});
            // sessionDemo.config.globalProperties.$sessionBox = $sessionBox
        }
        sessionDemo.openDialog({account,options:{name,avatar}});
        success&&success();
        return
    }
    if(userId){
        getUserImAccount({userId}).then(res=>{
            if(!sessionDemo){
                sessionDemo = createEl(sessionDialog,{});
                // sessionDemo.config.globalProperties.$sessionBox = $sessionBox
            }

            const { imAccountId }  = res.data;
            name = name || res.data.name;
            avatar = avatar || res.data.avatar;
            sessionDemo.openDialog({account: imAccountId ,options:{name,avatar}});
            success&&success();
        }).catch(err=>{
            error&&error();
        })
    }
}
export const openDrawer = ({}={})=>{
    if(!store.state.IM.im){
        openLogin();
        return
    }
    if(!sessionDemo){
        sessionDemo = createEl(sessionDialog,{});
        // sessionDemo.config.globalProperties.$sessionBox = $sessionBox
    }
    sessionDemo.openDrawer();
}

export const unMounted = ()=>{
    if(NodeBox){
        document.body.removeChild(NodeBox);
        NodeBox = null;
        sessionDemo = null;
    }
    store.commit('IM/clearAllData','handleDisconnect')
}

const $sessionBox = {
    open,
    unMounted,
    openDialog,
    openDrawer,
};

const install = (app)=>{
    app.config.globalProperties.$sessionBox = $sessionBox
}
const sessionBox = {
    install
}
export default sessionBox