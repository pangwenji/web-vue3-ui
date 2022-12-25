<template>
    <div class="message-item-box">
        <div class="message-time" v-if="showMsgTime(messageData,prevMsg)">{{showMsgTime(messageData,prevMsg)}}</div>
        <div class="message-item-container" v-if="type == 'NO_SYSTEM'">
            <!-- 聊天气泡 -->
            <template v-if="messageData.type !== 'notification' && messageData.type !== 'tip' && messageData.type !== 'advanced'">
                <!-- 对方头像 -->
                <div class="message-item-left">
                    <el-avatar :size="36" :src="messageData.options?.avatar" v-if="messageData.flow == 'in'"></el-avatar>
                </div>
                <!-- 消息气泡 -->
                <div class="message-item-content" :class="{self:messageData.flow == 'out'}">
                    <div class="message-bubble" v-if="bubbleType == 'bubble'" :class="{primary: messageData.type !== 'image' && messageData.type !== 'video' && messageData.type !== 'audio' }" v-contextmenu:contextmenuRef>
                        <template v-if="messageData.type == 'text'">
                            <pre>{{getMessageBody?.context || getMessageBody?.content}}</pre>
                        </template>
                        <template v-else-if="messageData.type == 'image'">
                            <el-image :draggable="false" fit="cover" style="height: 120px; border-radius: 12px; min-width: 120px; max-width: 100%;"
                                @click="handleViewImage(messageData.attach.url,messageData.attach.name)" :src="messageData.attach.url" />
                        </template>
                        <template v-else-if="messageData.type == 'audio'">
                            <div class="message-audio-box">
                                <!-- <audio :src="messageData.attach.url" hidden></audio> -->
                                <div class="message-audio-icon" @click="handleViewAudio(messageData.attach.url,messageData.attach.name)">
                                    <!-- <svg-icon color="#fff" style="margin-right: 10px;" :size="12" iconClass="video-play"></svg-icon> -->
                                </div>
                                <div class="message-audio-info">
                                    <div class="name">{{messageData.attach.name}}</div>
                                    <div class="desc">
                                        <span>{{secondToDate(messageData.attach.dur/1000)}}</span>
                                        <span style="margin-left: 6px;">{{messageData.attach.container}}</span>
                                    </div>
                                </div>
                                <!-- <svg-icon color="#fff" style="margin-right: 10px;" :size="12" iconClass="video-pause"></svg-icon> -->
                            </div>
                        </template>
                        <template v-else-if="messageData.type == 'video'">
                            <video :draggable="false" style="height: 120px; min-width: 120px; border-radius: 12px; max-width: 100%;"
                                @click.stop="handleViewVideo(messageData.attach.url,messageData.attach.name)" :src="messageData.attach.url" />
                            <div class="video_action-icon" @click.stop="handleViewVideo(messageData.attach.url,messageData.attach.name)">
                                <!-- <svg-icon color="#fff" :size="24" iconClass="video-pause"></svg-icon> -->
                                <svg-icon color="#fff" :size="24" iconClass="video-play"></svg-icon>
                            </div>
                        </template>
                        <template v-else-if="messageData.type == 'file'">
                            文件
                        </template>
                        <div class="message-bubble-state">
                            <component :is="getStatusContent(messageData)" :key="messageData.status + msgReceiptTime"></component>
                        </div>
                    </div>
                    <div class="message-card" v-else-if="bubbleType == 'card'">
                        <div class="message-card-title">雇主合作邀请通知</div>
                        <div class="message-card-content">
                            招募名称：{{getMessageBody?.data.title || '-'}}
                        </div>
                        <div class="message-card-content">
                            开始时间：{{getMessageBody?.data.createTime || '-'}}
                        </div>
                        <div class="message-card-content">
                            截止日期：{{getMessageBody?.data.endDate || '-'}}
                        </div>
                        <div class="message-card-footer" @click="handleToRecruitDetail">
                            <span>查看详情</span>
                            <span><SvgIcon iconClass="icon_right"></SvgIcon></span>
                        </div>
                    </div>
                </div>
                <!-- 我的头像信息 -->
                <div class="message-item-right">
                    <el-avatar :size="36" :src="myAvatar" v-if="messageData.flow == 'out'"></el-avatar>
                </div>
            </template>
            
            <!-- 群通知消息 -->
            <div class="message-system-content" v-else-if="messageData.type == 'notification' ">
                <div class="bubble">{{notificationContext(messageData)}}</div>
            </div>

            <!-- tip消息 -->
            <div class="message-system-content" v-else-if="messageData.type == 'tip'">
                <div class="bubble">{{tipMessageContext(messageData)}}</div>
            </div>
        </div>
        <template v-else>
            <component :is="getContent(messageData.attach)" :key="messageData.idClient"></component>
        </template>

    </div>
    <v-contextmenu :width="50" ref="contextmenuRef" :disabled="messageData.flow !== 'out' || showContextmenu">
        <!-- <v-contextmenu-item>转发</v-contextmenu-item> -->
        <v-contextmenu-item @click="handleRecall" :disabled="disabledRecall(messageData.time)">撤回</v-contextmenu-item>
        <v-contextmenu-item @click="handleDelete">删除</v-contextmenu-item>
    </v-contextmenu>
</template>
<script>
import { useStore } from 'vuex';
import SvgIcon from '@/components/SvgIcon';
import { computed, defineComponent, getCurrentInstance, h } from 'vue';
import { setDateFormat, getJsonData, secondToDate } from '../util';
import FileType from '@/components/FileType'
import { ElMessage } from 'element-plus';
import MessageTemplates from './templates'
import { useRouter } from 'vue-router';
const components = {
    SvgIcon,
    FileType
}
const props = {
    //聊天对象账号
    to: {
        type: String,
        default: '',
    },
    //聊天对象类型
    type: {
        type: String,
        default: 'NO_SYSTEM',
    },
    //聊天对象的头像
    avatar: {
        type: String,
        default: 'NO_SYSTEM',
    },
    //上一条消息内容
    prevMsg: {
        type: Object,
        default: null,
    },
    //收到最后一条消息的已读回执时间戳
    msgReceiptTime: {
        type: [Number, String],
        default: null,
    },
    //是否显示右键菜单
    showContextmenu: {
        type: Boolean,
        default: false
    },
    //当前消息数据
    messageData: {
        type: Object,
        default: () => {
            return {}
        }
    }
}
const emits = ['onRecall', 'onChangeSession']
const setup = (prop, { emit }) => {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const contextmenuRef = ref();
    const sessionItem = computed(()=>store.state.IM.sessionItem);
    const myAvatar = computed(() => store.state.user.avatar);
    const getMessageBody = computed(()=>{
        const type = prop.messageData.type;
        if(type == 'text'){
           return getJsonData(prop.messageData.body)
        }else{
            return null;
        }
    })
    const bubbleType = computed(()=>{
        const type = prop.messageData.type;
        if(type == 'text'){
            const data = getJsonData(prop.messageData.body);
            if(data.txtType == 1){ // 邀请报名卡片
                return 'card'
            }else{
                return 'bubble'
            }
        }else{
            return 'bubble'
        }
    })
    // 渲染卡片节点
    const getContent = (attach) => {
        const key = prop.type;
        const mataData = getJsonData(attach.mataData);//其他数据
        const renderFunction = MessageTemplates[key];
        const node = renderFunction(attach, mataData)
        return node
    }

    // 渲染状态节点
    const getStatusContent = (messageData) => {
        if (messageData.status == 'sending') { //发送中
            return h('span', {}, '发送中')
        } else if (messageData.status == 'sent' && messageData.scene == 'p2p') { //已发送
            if(messageData.scene == 'p2p'){
                if (prop.msgReceiptTime >= messageData.time) {
                    return h('span', {}, '已读')
                } else {
                    return h('span', { style:{color:'#3468FE'} }, '未读')
                }
            }
        } else if (messageData.status == 'read' && messageData.scene == 'p2p') {     //已读
            return h('span', {}, '已读')
        } else if (messageData.status == 'unread' && messageData.scene == 'p2p') { // 未读
            if (messageData.flow == 'in') {
                return h('span', {}, '已读')
            } else {
                return h('span', { style:{color:'#3468FE'} }, '未读')
            }
        } else if (messageData.status == 'receipt' && messageData.scene == 'p2p') { // 收到已读回执
            return h('span', {}, '已读')
        } else if (messageData.status == 'refused') { // 被拒收
            return h('span', {}, '被拒收')
        } else if (messageData.status == 'uploading') { //正在上传
            return h('span', {}, '正在上传')
        } else if (messageData.status == 'sendFailed') { // 发送失败
            return h('span', {}, '发送失败')
        }else{
            return h('span', {}, '')
        }
    }

    const showMsgTime = (n, p) => {
        if (p && p.time) {
            const space = n.time - p?.time || 0;
            if (space / 1000 <= 3 * 60) {
                return false
            } else {
                return setDateFormat(n.time, true);
            }
        } else {
            return setDateFormat(n.time, true);
        }

    }
    // 撤回
    const handleRecall = () => {
        if (disabledRecall(prop.messageData.time)) {
            ElMessage.error('信息已无法撤回');
            return
        }
        emit('onRecall')
    }
    // 删除
    const handleDelete = () => {
        const msg = prop.messageData
        store.dispatch('IM/handleDeleteMsg', msg)
    }
    
    // tip消息内容
    const tipMessageContext = (messageData) => {
        const tipBody = getJsonData(messageData.body);
        let context = '';
        if (messageData.flow == 'in') {
            if (messageData.scene == 'p2p') {
                context += `对方`
            } else {
                context += messageData.fromNick
            }
        } else {
            context += `你`
        }
        if (tipBody.type == 'recall') { // 消息撤回
            context += '撤回了一条消息';
            return context;
        } else if (tipBody.type == 'urge') {
            context += '发送了催一催';
            return context;
        }
    }

    // 通知消息内容
    const notificationContext = (messageData) => {
        const attach = messageData.attach;
        const attachType = messageData.attach.type;
        if (attachType == 'updateTeam') {
            return `“${messageData.fromNick}”更新了群信息`
        }
        if (attachType == 'acceptTeamInvite') {
            return `欢迎“${messageData.fromNick}”加入群聊`
        }
        if (attachType == 'transferTeam') {
            const account = attach.account;
            const users = attach.users;
            let name = '';
            users.forEach(item => {
                if (account == item.account) {
                    name = item.nick;
                }
            });
            return `“${name}”成为了群主`
        }
        if (attachType == 'removeTeamMembers') {
            const accounts = attach.accounts;
            const users = attach.users;
            const names = [];
            users.forEach(item => {
                if (accounts.indexOf(item.account) > -1) {
                    names.push(item.nick)
                }
            });
            return `“${names.join('、')}”已被群主踢出群聊`
        }
        if (attachType == 'addTeamMembers') {
            const nicks = [];
            const users = attach.users;
            const accounts = attach.accounts;
            users.forEach(item => {
                if (accounts.indexOf(item.account) > -1) {
                    nicks.push(item.nick);
                }
            })
            return `${messageData.fromNick}邀请“${nicks.join('、')}”加入群聊`;
        }
        if (attachType == 'leaveTeam') {
            const users = attach.users;
            const names = users.map(item => item.nick);
            return `“${names.join('、')}”已退出群聊`
        }
        if (attachType == 'dismissTeam') {
            return '该群已被群主解散'
        }
    }

    // 禁用撤回
    const disabledRecall = (time) => {
        const date = new Date();
        const space = date.getTime() - time;
        if ((space / 1000) < 120) {
            return false;
        }
        return true;
    }
    // 前往招募详情
    const handleToRecruitDetail = ()=>{
        const id = getMessageBody.value?.data.id;
        if(id){
            router.push({path:`/workspace/recruit/${id}`})
        }
    }

    // 点击查看图片
    const handleViewImage = (url, name) => {
        proxy.$viewFile.open({
            current: 0, fileList: [{
                filename: name,
                fileCat: 'image',
                cover: url,
                downloadUrl: url,
            }]
        });
    }
    // 点击查看音频
    const handleViewAudio = (url, name) => {
        proxy.$viewFile.open({
            current: 0, fileList: [{
                filename: name,
                fileCat: 'audio',
                downloadUrl: url,
            }]
        });
    }
    // 点击查看视频
    const handleViewVideo = (url, name) => {
        proxy.$viewFile.open({
            current: 0, fileList: [{
                filename: name,
                fileCat: 'video',
                downloadUrl: url,
            }]
        });
    }
    return {
        myAvatar,
        bubbleType,
        getMessageBody,
        getContent,
        getJsonData,
        showMsgTime,
        handleDelete,
        handleRecall,
        secondToDate,
        setDateFormat,
        disabledRecall,
        handleViewImage,
        handleViewAudio,
        handleViewVideo,
        getStatusContent,
        tipMessageContext,
        notificationContext,
        handleToRecruitDetail,
    }
}
export default defineComponent({
    setup,
    props,
    emits,
    components
})
</script>

<style scoped lang="scss">
@import "./style/MessageItem.scss";
</style>
