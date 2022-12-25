<template>
<el-scrollbar height="100%" class="session_drawer-scrollbar" view-class="scrollbar-view">
    <template v-if="sessions.length > 0">
        <template v-for="(item,index) in sessions" :key="index">
            <SessionItem @click="handleClick(item)" :sessionData="formatData(item)" :disremind="item.disremind" :isStickOnTop="item.stickTopInfo?.isStickOnTop">
                <template #contextmenuItem>
                    <v-contextmenu-item @click="handleSettop(item)" v-if="item.stickTopInfo?.isStickOnTop">取消置顶</v-contextmenu-item>
                    <v-contextmenu-item @click="handleSettop(item)" v-else>置顶</v-contextmenu-item>
                    <v-contextmenu-item @click="handleOpenDisremind(item)" v-if="!item.disremind">消息免打扰</v-contextmenu-item>
                    <v-contextmenu-item @click="handleOpenDisremind(item)" v-else>关闭免打扰</v-contextmenu-item>
                    <v-contextmenu-item @click="handleResetSessionUnread(item)">已读</v-contextmenu-item>
                    <v-contextmenu-item @click="handleDelete(item)">删除</v-contextmenu-item>
                    <!-- <v-contextmenu-item @click="(InformDialogRef.isShow = true)">举报</v-contextmenu-item> -->
                </template>
            </SessionItem>
        </template>
    </template>
    <template v-else>
        <Empty description="暂无会话消息"></Empty>
    </template>
    <div class="read-msg-btn" @click="handleResetAllSessionUnread">一键已读</div>
</el-scrollbar>
<informDialog ref="InformDialogRef"></informDialog>
</template>
<script>
import { computed, defineComponent } from '@vue/runtime-core'
import informDialog from '@/components/informDialog'
import { useStore } from 'vuex'
import { getJsonData } from '../util.js'
import SessionItem from  './SessionItem.vue'
import { ElMessageBox } from 'element-plus'
const components = {
    SessionItem,
    informDialog
}
const emits = ['openDialog','createTeam','createGroup','settingTeam','closeDialog','resetGroupName'];
const setup = (prop,{ emit })=>{
    const store = useStore();
    const muteList = computed(()=>store.state.IM.muteList);
    const InformDialogRef = ref();
    const formatData = (item)=>{
        const lastMsg = item.lastMsg;
        const data = {
            unread: item.unread,
            updateTime:item.updateTime,
            nickname: item.options?.name,
            avatar: item.options?.avatar,
            context:''
        }
        if(!lastMsg){
            data.context = '-'
            return data
        }
        if(lastMsg.type == 'delete'){
            data.context = '-'
            return data
        }
        if(lastMsg.status == 'sendFailed'){
            data.context = '消息发送失败'
            return data
        }
        if(lastMsg && lastMsg.flow == 'in' && item.scene == 'team'){
            data.context += `${lastMsg.fromNick}：`
        }
        switch(lastMsg.type){
            case 'custom':
                // context修改为content
                data.context = lastMsg.attach.context ? lastMsg.attach.context : lastMsg.attach.content;
                break;
            case 'text':
                const body = getJsonData(lastMsg.body)
                data.context += body.context? body.context : body.content;
                break;
            case 'image':
                data.context += `[图片]${lastMsg.attach.name}`
                break;
            case 'video':
                data.context += `[视频]${lastMsg.attach.name}`
                break;
            case 'audio':
                data.context += `[音频]${lastMsg.attach.name}`
                break;
            case 'file':
                data.context += `[文件]${lastMsg.attach.name}`
                break;
            case 'geo':
                data.context += `[地理位置]${lastMsg.attach.name}`
                break;
            case 'custom':
                data.context += `[自定义消息]`
                break;
            case 'tip':
                const tipBody = JSON.parse(lastMsg.body);
                if(lastMsg.flow == 'in'){
                    if(lastMsg.scene == 'p2p'){
                        data.context += `对方`
                    }
                }else{
                    data.context += `你`
                }
                if(tipBody.type == 'recall'){ // 消息撤回
                    data.context += '撤回了一条消息'
                }else if(tipBody.type == 'urge'){ // 消息撤回
                    data.context += '发送了催一催'
                }
                break;
            case 'notification':
                data.context = '[群通知]'
                if(lastMsg.attach.type == 'acceptTeamInvite'){
                    data.context += `欢迎“${lastMsg.fromNick}”加入群聊`;
                }else if(lastMsg.attach.type == 'removeTeamMembers'){
                    const attach = lastMsg.attach;
                    const accounts = attach.accounts;
                    const users = attach.users;
                    const names = [];
                    users.forEach(item => {
                        if(accounts.indexOf(item.account) > -1){
                            names.push(item.nick)
                        }
                    });
                    data.context += `“${names.join('、')}”被群主踢出群聊`;
                }else if(lastMsg.attach.type == 'leaveTeam'){
                    data.context += `“${lastMsg.fromNick}”已退出群聊`;
                }else if(lastMsg.attach.type == 'transferTeam'){
                    const attach = lastMsg.attach;
                    const users = attach.users;
                    const account = attach.account;
                    let name = '';
                    for(const item of users){
                        if(item.account == account){
                            name = item.nick;
                            break;
                        }
                    }
                    data.context += `“${name}”成为了群主`;
                }else if(lastMsg.attach.type == 'dismissTeam'){
                    data.context += "该群已被群主解散";
                }else if(lastMsg.attach.type == 'addTeamMembers'){
                    const fromNick = lastMsg.fromNick;
                    data.context += `${fromNick}更新了群信息`
                }else{
                    const fromNick = lastMsg.fromNick;
                    data.context += `${fromNick}更新了群信息`
                }
                break;

        }
        return data;
    }
    // 是否静音
    const getDisremind = (item)=>{

    }
    // 会话置顶
    const handleSettop = (item)=>{
        store.dispatch('IM/handleSettopSession',item)
    }
    // 消息免打扰
    const handleOpenDisremind = (item)=>{
        const disremind = item.disremind;
        store.dispatch('IM/handleSetDisremind',{account: item.to,scene:item.scene,disremind: !disremind})
    }
    // 删除会话
    const handleDelete = (item)=>{
        const title = '删除会话'
        const content = `确定要删除会话“${item.options.name}”吗？`
        ElMessageBox.confirm(content, title, {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose:true,
            center: true,
            beforeClose(action, instance, done){
                if(action === 'confirm'){
                    instance.confirmButtonLoading = true
                     store.dispatch('IM/handleDeleteSession',item).then(res=>{
                        done();
                        ElMessage.success('删除成功');
                    }).catch(err=>{
                        done();
                    })
                }else{
                    if(instance.confirmButtonLoading){ return }
                    done()
                }
            },
        })
    }
    // 一键已读
    const handleResetAllSessionUnread = ()=>{
        store.dispatch('IM/handleResetAllSessionUnread')
    }
    // 已读
    const handleResetSessionUnread = (session)=>{
        store.dispatch('IM/handleResetSessionUnread',session)
    }
    // 获取所有会话
    const sessions = computed(() =>{
        const data = [];
        muteList.value.forEach(item=>{
            if(item.isMuted){
                data.push(item.account)
            }
        });
        return store.state.IM.sessions.map(item=>{
            if(item.scene == 'p2p'){
                const disremind = data.indexOf(item.to) > -1;
                item.disremind = disremind
            }else{
                item.disremind = item.options.disremind
            }
            return item;
        })
    });
    // 点击会话
    const handleClick = (item)=>{
        if(item.lastMsg?.attach?.type == 'dismissTeam'){
            item.options.valid = false;
        }
        const data = {
            scene: item.scene,
            account: item.to,
            options: item.options,
        }
        emit('openDialog',data)
    }   
    return{
        sessions,
        muteList,
        formatData,
        handleClick,
        handleSettop,
        handleDelete,
        getDisremind,
        InformDialogRef,
        handleOpenDisremind,
        handleResetSessionUnread,
        handleResetAllSessionUnread
    }
}
export default defineComponent({
    name:'TabbarAll',
    setup,
    emits,
    components
})
</script>
<style scoped lang="scss">
.read-msg-btn{
    font-size: 14px;
    color: white;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: rgba(255,255,255,0.19);
    border-radius: 18px;
    border: 1px solid rgba(223,223,223,0.3);
    position: absolute;
    bottom: 20px;
    left: 50%;
    cursor: pointer;
    transform: translateX(-50%);
}
</style>