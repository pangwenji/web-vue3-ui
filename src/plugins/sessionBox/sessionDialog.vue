<template>
    <transition name="session_mask" @after-leave="handleClosed">
        <div class="session_dialog-mask" @click="handleBeforClose" v-if="drawerVisibled || dialogVisibled"></div>
    </transition>
    <transition name="session_drawer">
        <div class="session_drawer-box" v-if="drawerVisibled">
            <div class="session_drawer-header">
                <div class="search-input">
                    <input placeholder="搜索" />
                    <span class="search-icon">
                        <svg-icon iconClass="icon_search" :size="16"></svg-icon>
                    </span>
                </div>
                <span class="tianjia" v-contextmenu:contextmenuRef="{trigger:'click'}">
                    <svg-icon iconClass="icon_tianjia" :size="24"></svg-icon>
                </span>
            </div>
            <div class="session_drawer-tabbar">
                <template v-for="(item,index) in tabbars" :key="index">
                    <div class="tabbar-item" @click="handleTabbar(index)" :class="{active:index == tabbarCurrent}">
                        {{item.title}}
                        <div class="sub-number" v-if="friendApplyLength && item.key == 'TabbarUser'">{{friendApplyLength}}</div>
                    </div>
                </template>
            </div>
            <div class="session_drawer-main">
                <keep-alive :include="caseView">
                    <component :is="tabbars[tabbarCurrent].component" @openDialog="openDialog" @createTeam="CreateTeamRef.open()" @createGroup="CreateGroupRef.open()" @settingTeam="handleTeamSetting"
                        @closeDialog="closeDialog" @resetGroupName="CreateGroupRef.open" :key="tabbars[tabbarCurrent].key"></component>
                </keep-alive>
            </div>
        </div>
    </transition>
    <transition name="session_dialog">
        <div @click.stop :style="{left: translateX + 'px', top: translateY + 'px'}" v-if="dialogVisibled" class="session_dialog-box">
            <div class="session_dialog-container" v-loading="loadingSessionState == 1" element-loading-background="rgba(0,0,0,0.1)">
                <div class="session_dialog-header" @mousedown="handleMousedown($event)">
                    <el-avatar :size="36" :src="sessionItem.options?.avatar || ''"></el-avatar>
                    <div class="nickName">{{sessionItem.options?.name || '-'}}</div>
                    <span class="action-btn" style="padding: 0 5px 0 0" @mousedown.stop title="添加好友" @click="handleCreateContact" v-if="isMyContact">
                        <SvgIcon iconClass="icon_user-insert" :size="22"></SvgIcon>
                    </span>
                    <!-- <span class="action-btn" style="padding: 0 5px" @mousedown.stop title="历史记录">
                    <SvgIcon iconClass="icon_history" :size="22"></SvgIcon>
                </span> -->
                    <span class="action-btn" style="padding: 0 0 0 5px" @mousedown.stop @click="closeDialog" title="关闭">
                        <SvgIcon iconClass="icon_close" :size="20"></SvgIcon>
                    </span>
                </div>
                <el-scrollbar ref="scrollBarRef" @scroll="handleSessionScroll" class="session_dialog-body" view-style="padding-top: 10px;">
                    <div style="line-height: 50px; text-align:center; font-size:14px; color: white;" v-if="loadingSessionState == 2">
                        <span v-if="loadingSessionState == 1">正在加载。。。</span>
                        <span v-else-if="loadingSessionState == 0">加载更多</span>
                    </div>
                    <template v-for="(item,index) in messageList" :key="index">
                        <MessageItem :to="sessionItem.to" :avatar="sessionItem.options?.avatar" :prevMsg="messageList[index-1]" :type="sessionItem.type" :msgReceiptTime="sessionItem.msgReceiptTime"
                            :messageData="item" @onChangeSession="openDialog" @onRecall="handleRecall(item)"></MessageItem>
                    </template>
                </el-scrollbar>
                <template v-if="sessionItem.scene == 'p2p' ||  (sessionItem.scene == 'team' && sessionItem.options?.validToCurrentUser && sessionItem.options?.valid)">
                    <div class="session_dialog-footer" v-if="sessionItem.type == 'NO_SYSTEM'">
                        <div class="tag-list">
                            <div class="left">
                                <input type="file" ref="uploadFileRef" hidden multiple @change="handleChangeUpload" />
                                <span style="margin-right:10px;" title="发送表情" ref="SendExpressionRef">
                                    <SvgIcon iconClass="icon_im-expression" :size="28"></SvgIcon>
                                </span>
                                <span style="margin-right:10px;" title="文件上传" @click="handleClickFile" ref="uploadFileListRef">
                                    <SvgIcon iconClass="icon_im-file" :size="28" v-if="uploadProgressTotal <= 0 || uploadProgressTotal >= 100"></SvgIcon>
                                    <span v-else> {{uploadProgressTotal}}%</span>
                                    <!-- <el-progress type="circle" :stroke-width="1" :width="24" color="#3468FE"  :percentage="uploadProgressTotal" /> -->
                                </span>
                                <!-- <span style="margin-right:10px;" title="常用语" ref="SendCommonwordRef">
                                    <SvgIcon iconClass="icon_im-chang" :size="28"></SvgIcon>
                                </span> -->
                                <span style="margin-right:10px;" title="催一催" @click="handleSendUrag" v-if="sessionItem.scene == 'p2p'">
                                    <SvgIcon iconClass="icon_im-urge" :size="28"></SvgIcon>
                                </span>
                                <span style="margin-right:10px;" title="用工服务" ref="WorkerServerRef" v-if="sessionItem.scene == 'p2p'">
                                    <SvgIcon iconClass="icon_im-users" :size="28"></SvgIcon>
                                </span>
                                <!-- <span style="margin-right:10px;" title="新建文件">
                                    <SvgIcon iconClass="icon_im-files" :size="28"></SvgIcon>
                                </span> -->
                                <span style="margin-right:10px;" title="历史记录" @click="handleOpenHistory">
                                    <SvgIcon iconClass="icon_im-history" :size="28"></SvgIcon>
                                </span>
                            </div>
                            <div class="right" v-if="sessionItem.scene == 'p2p'">
                                <span title="打开服务" @click="handleOpenSessionRight()">
                                    <SvgIcon iconClass="icon_im-leftSide" :size="28" v-if="SessionRightRef?.visibled"></SvgIcon>
                                    <SvgIcon iconClass="icon_im-rightSide" :size="28" v-else></SvgIcon>
                                </span>
                            </div>
                        </div>
                        <!-- <el-input v-model="context" :maxlength="200" @keydown="handleKeydown" @keyup="handleKeyup" type="textarea" show-word-limit class="input-textarea" :rows="4" resize="none">
                        </el-input> -->
                        <div class="input-box">
                            <el-scrollbar :height="60" style="margin: 0 -10px;" view-style="padding: 0 10px">
                                <div @input="handleInputContext" ref="CustomTextareaRef" @keydown="handleKeydown" @keyup="handleKeyup"  contenteditable="plaintext-only" class="input-innertext" data-placeholder="请输入内容" style="min-height: 60px;"></div>
                            </el-scrollbar>
                            <div class="bottom-actions">
                                <div class="right">
                                    <span class="input-maxlength">
                                        <span style="color: #3468FE">{{context.length}}</span>
                                        <span>/</span>
                                        <span>{{maxlengthValue}}</span>
                                    </span>
                                    <el-button type="primary" color="#3468FE" title="按Enter键发送，按Shift+Enter换行" round :disabled="!context" @click="handleSendMessage">发送</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="session_dialog-footer-vali" v-else-if="!sessionItem.options?.valid">
                    该群已解散
                </div>
                <div class="session_dialog-footer-vali" v-else-if="!sessionItem.options?.validToCurrentUser">
                    你已不是该群成员
                </div>
            </div>
            <SessionRightContent ref="SessionRightRef"></SessionRightContent>
        </div>
    </transition>
    <el-popover :virtual-ref="SendExpressionRef" width="280px" placement="top" virtual-triggering trigger="hover" popper-class="session-popover-box">
        <el-scrollbar class="popover-scrollbar-box" :noresize="false" view-style="padding: 10px">
            <span class="emoji-item" @click.stop="handleInsertEmoji(item)" v-for="(item,index) in emojis">{{item}}</span>
        </el-scrollbar>
    </el-popover>
    <el-popover :virtual-ref="SendCommonwordRef" width="280px" placement="top" virtual-triggering trigger="hover" popper-class="session-popover-box">
        <div class="commonword-title">
            <div>常用回复</div>
            <div class="commonword-title-add">添加</div>
        </div>
        <el-scrollbar class="popover-scrollbar-box" :noresize="false">
            <template v-for="index in 10" :key="index">
                <div class="commonword-item">
                    <!-- <div class="commonword-item-content">谢谢，目前没有时间接工作哦！</div>
                    <span class="commonword-item-edit">
                        <SvgIcon iconClass="icon_im-edit"  :size="24" ></SvgIcon>
                    </span> -->
                </div>
            </template>
        </el-scrollbar>
    </el-popover>
    <el-popover :virtual-ref="WorkerServerRef" width="80px" placement="top" virtual-triggering trigger="hover" popper-class="session-popover-box">
        <div class="worker_server-box">
            <div @click="handleOpenInviteRegister">邀请报名</div>
            <div @click="handleOpenSessionRight(2)">Ta的服务</div>
            <div @click="handleOpenSessionRight(1)">查看订单</div>
        </div>
    </el-popover>
    <el-popover :virtual-ref="uploadFileListRef" width="280px" placement="top" ref="uploadFilePopoverRef" virtual-triggering trigger="hover" popper-class="session-popover-box">
        <el-scrollbar class="uploadfile-box" :noresize="false" view-style="padding: 10px">
            <template v-if="uploadFileList.length > 0">
                <div class="uploadfile-item" v-for="(item,index) in uploadFileList" :key="index">
                    <div class="uploadfile-item-filename">{{item.fileName}}</div>
                    <div class="uploadfile-item-state">
                        {{item.progress}}%
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="uploadfile-item" style="text-align:center;">
                    暂无上传文件
                </div>
            </template>
        </el-scrollbar>
    </el-popover>
    <CreateTeam ref="CreateTeamRef"></CreateTeam>
    <DetailTeam ref="DetailTeamRef" @closeDialog="closeDialog"></DetailTeam>
    <CreateGroup ref="CreateGroupRef"></CreateGroup>
    <InsertPerson ref="InsertPersonRef"></InsertPerson>
    <CreateContact ref="CreateContactRef" @onSubmit="sessionItem.isContact = true"></CreateContact>
    <InviteRegister ref="InviteRegisterRef"></InviteRegister>
    <MessageHistory ref="MessageHistoryRef"></MessageHistory>
    <v-contextmenu ref="contextmenuRef">
        <v-contextmenu-item @click="InsertPersonRef.open()">添加好友</v-contextmenu-item>
        <v-contextmenu-item @click="CreateTeamRef.open()">创建群聊</v-contextmenu-item>
        <v-contextmenu-item @click="CreateGroupRef.open()">创建分组</v-contextmenu-item>
    </v-contextmenu>
</template>
<script setup>
import { computed, defineComponent, nextTick, ref, watch, watchEffect } from 'vue'
import { getFileType } from "./util.js"
import SvgIcon from '@/components/SvgIcon'
import TabbarAll from './components/TabbarAll.vue'
import TabbarUser from './components/TabbarUser.vue'
import CreateTeam from './components/CreateTeam.vue'
import DetailTeam from "./components/DetailTeam.vue"
import TabbarTeam from './components/TabbarTeam.vue'
import CreateGroup from './components/CreateGroup.vue'
import MessageItem from './components/MessageItem.vue'
import TabbarNotice from './components/TabbarNotice.vue'
import InsertPerson from './components/InsertPerson.vue'
import CreateContact from './components/CreateContact.vue'
import TabbarConcern from './components/TabbarConcern.vue'
import InviteRegister from './components/InviteRegister.vue'
import MessageHistory from './components/MessageHistory.vue'
import SessionRightContent from './components/SessionRightContent.vue'
import emojis from '@/utils/emoji.js'
import { useStore } from 'vuex'
import { useWindowSize } from '@vueuse/core'
const props = defineProps({
    removeNode: {
        type: Function,
        default: () => { }
    }
})

let isTranslate = false;
let offsetX = 0;
let offsetY = 0;
let clientWidth = 400;
let clientHeight = 700;
let innerWidth = 0;
let innerHeight = 0;
let drawerWidth = 360;
const uploadFileRef = ref();
const contextmenuRef = ref();
const WorkerServerRef = ref();
const CreateContactRef = ref();
const MessageHistoryRef = ref();
const uploadFileListRef = ref();
const InviteRegisterRef = ref();
const uploadFilePopoverRef = ref();
const tabbars = [
    {
        title: '全部',
        key: 'TabbarAll',
        component: TabbarAll
    },
    {
        title: '好友',
        key: 'TabbarUser',
        component: TabbarUser
    },
    {
        title:'群组',
        key: 'TabbarTeam',
        component: TabbarTeam
    },
    {
        title: '@我',
        key: 'TabbarConcern',
        component: TabbarConcern
    },
    {
        title: '通知',
        key: 'TabbarNotice',
        component: TabbarNotice
    }
]
const store = useStore();
const { width } = useWindowSize();
const context = ref('');
const translateX = ref(0);
const translateY = ref(0);
const tabbarCurrent = ref(0);
const drawerVisibled = ref(false);
const dialogVisibled = ref(false);
const SessionRightRef = ref(false);
const CustomTextareaRef = ref();
const InsertPersonRef = ref();
const CreateGroupRef = ref();
const CreateTeamRef = ref();
const DetailTeamRef = ref();
const scrollBarRef = ref();
const SendExpressionRef = ref();
const SendCommonwordRef = ref();
const caseView = tabbars.map(item => item.key);
const init = () => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    translateX.value = innerWidth - drawerWidth - clientWidth - 20;
    translateY.value = (innerHeight / 2) - (clientHeight / 2);
    store.dispatch('IM/handleGetGroup')
    store.dispatch('IM/getFriendApplyList')
}
init();
// 获取好友列表
const contactList = computed(() => store.getters['IM/contacts']);
// 好友申请列表
const friendApplyLength = computed(() => {
    const list = store.state.IM.friendApplys?.filter(item => item.state == 0) || [];
    return list.length
});
// 获取当前会话对象
const sessionItem = computed(() => store.state.IM.sessionItem || {});
// 判断当前会话对象是否是好友
const isMyContact = computed(() => {
    if (sessionItem.value && sessionItem.value.scene == 'p2p' && sessionItem.value.type == 'NO_SYSTEM') {
        const data = contactList.value.filter(item => {
            return item.contactImAccountId == sessionItem.value.to
        })
        return data.length == 0;
    } else {
        return false;
    }
})

// 消息列表
const messageList = computed(() => { console.log(store.state.IM.msgs); return store.state.IM.msgs || [] });
//当前会话正在上传的文件
const uploadFileList = computed(() => store.getters['IM/uploadFiles']);
// 上传总进度
const uploadProgressTotal = computed(() => {
    const uploadLength = uploadFileList.value?.length || 0
    if (uploadLength > 0) {
        const total = uploadFileList.value.reduce((sum, item) => {
            sum += item.progress;
            return sum;
        }, 0)
        return parseInt((total / (100 * uploadLength)) * 100)
    } else {
        return 0
    }
})
const sessionBoxScrollTop = ref(0);
const isCallbackBottom = ref(true); //是否跳回到底部
// 监听消息列表,设置滚动条
watch(() => messageList.value.length, (n) => {
    if (scrollBarRef.value) {
        nextTick(() => {
            if (isCallbackBottom.value) {
                const scrollViewHeight = scrollBarRef.value?.resize$.clientHeight || 1000000000;
                scrollBarRef.value.setScrollTop(scrollViewHeight);
            }
        })
    }
})
// 监听屏幕宽度
watch(() => width.value, (n) => {
    const space = n - translateX.value - drawerWidth;
    if (space < clientWidth) {
        translateX.value = n - drawerWidth - clientWidth;
    }
})
// 监听上传弹窗
watchEffect(() => {
    if (uploadFileList.length > 0) {
        if (uploadFilePopoverRef.value) {
            uploadFilePopoverRef.value.tooltipRef.onOpen();
        }
    }
})

// 监听会话窗口滚动事件
const loadingSessionState = ref(0); // 0 加载更多 1正在加载 2加载完成


// 打开会话窗口侧边栏
const handleOpenSessionRight = (e) => {
    if (e) {
        SessionRightRef.value.open(e)
    } else {
        if (SessionRightRef.value.visibled) {
            SessionRightRef.value.close()
        } else {
            SessionRightRef.value.open()
        }
    }
}
// 邀请报名
const handleOpenInviteRegister = () => {
    InviteRegisterRef.value.open();
}
const handleSessionScroll = (e) => {
    const scrollWrapHeight = scrollBarRef.value?.wrap$.clientHeight || 0;
    const scrollViewHeight = scrollBarRef.value?.resize$.clientHeight || 0;
    const totalScrollTop = scrollViewHeight - scrollWrapHeight;
    sessionBoxScrollTop.value = e.scrollTop;
    if ((e.scrollTop + scrollWrapHeight + 200) > scrollViewHeight) {
        isCallbackBottom.value = true;
    } else {
        isCallbackBottom.value = false;
    }
    if (e.scrollTop < 10) { //到达顶部
        if (loadingSessionState.value) {
            return
        }
        loadingSessionState.value = 1;
        store.dispatch('IM/handleLoadMessages').then(res => {
            const viewHeight = scrollBarRef.value?.resize$.clientHeight;
            const scrollTop = viewHeight - scrollWrapHeight - totalScrollTop;
            scrollBarRef.value.setScrollTop(scrollTop);
            scrollBarRef.value.update();
            if (!(res && res.length > 0)) {
                // 加载完成
                loadingSessionState.value = 2;
            } else {
                loadingSessionState.value = 0;
            }
        }).catch(err => {
            loadingSessionState.value = 0;
        })
    }
}
// 输入框按下事件
let keypressShift = false;
let keypressOther = false;
const maxlengthValue = 200;
const handleInputContext = (e)=>{
    if(e.target.innerText.length >= maxlengthValue){
        CustomTextareaRef.value.innerText = e.target.innerText.substr(0,maxlengthValue);
        CustomTextareaRef.value.blur();
    }
    context.value = CustomTextareaRef.value.innerText;
}

// 输入框按下键盘事件
const handleKeydown = (e) => {
    const key = e.keyCode;
    if (key == 16) {
        e.preventDefault();
        keypressShift = true;
    } else if (key == 13) {
        if (!keypressOther && keypressShift) {
            // context.value += '\n'
        } else if (!keypressOther && !keypressShift) {
            e.preventDefault();
            handleSendMessage();
        }
    } else {
        keypressOther = true;
    }
}
// 输入框键盘弹起事件
const handleKeyup = (e) => {
    const key = e.keyCode;
    if (key == 16) {
        keypressShift = false;
    } else if (key == 13) {

    } else {
        keypressOther = false;
    }
}
// 发送文本消息
const handleSendMessage = () => {
    if (context.value) {
        store.dispatch('IM/handleSendText', { context: context.value }).then(res => {
            context.value = ""
            CustomTextareaRef.value.innerText = ""
        }).catch(err => {

        })
    }
}
// 发送催一催
const handleSendUrag = () => {
    const body = {
        content: '发送催一催',
        type: 'urge'
    }
    store.dispatch('IM/handleSendTip', body)
}
// 撤回消息
const handleRecall = (msg) => {
    store.dispatch('IM/handleRecallMsg', msg)
}
// 点击选择文件
const handleClickFile = () => {
    uploadFileRef.value.click();

}
// 上传并发送文件
const handleChangeUpload = (e) => {
    const files = e.target.files;
    for (const file of files) {
        const type = getFileType(file.name);
        if (type !== 'file') {
            store.dispatch('IM/handleSendFile', { type, file }).catch(err=>{
                console.log(err)
            });
        }
    }
    uploadFileRef.value.value = null;
}
// 群信息
const handleTeamSetting = (team) => {
    DetailTeamRef.value.open(team)
}
// 添加联系人
const handleCreateContact = () => {
    if (sessionItem.value.to) {
        const nickName = sessionItem.value.options?.name;
        const imAccountId = sessionItem.value.to;
        CreateContactRef.value.open({ nickName, imAccountId });
    }
}
// 打开历史记录
const handleOpenHistory = () => {
    const data = {
        to: sessionItem.value.to,
        scene: sessionItem.value.scene,
        avatar: sessionItem.value.options?.avatar,
    }
    MessageHistoryRef.value.open(data);
}
// 添加表情
const handleInsertEmoji = (emo) => {
    if(context.value.length + emo.length < maxlengthValue){
        context.value += emo;
        CustomTextareaRef.value.innerText = context.value;
    }
}
// 鼠标移动
const handleMousemove = (e) => {
    if (!isTranslate) { return };
    if (e.x <= offsetX) {
        translateX.value = 0;
    } else if (e.x >= (innerWidth - clientWidth + offsetX - drawerWidth)) {
        translateX.value = innerWidth - clientWidth - drawerWidth;
    } else {
        translateX.value = e.x - offsetX;
    }
    if (e.y <= offsetY) {
        translateY.value = 0;
    } else if (e.y >= (innerHeight - clientHeight + offsetY)) {
        translateY.value = innerHeight - clientHeight;
    } else {
        translateY.value = e.y - offsetY;
    }
}
// 鼠标弹起
const handleMouseup = (e) => {
    isTranslate = false;
    document.removeEventListener('mousemove', handleMousemove);
    document.removeEventListener('mouseup', handleMouseup);
}
// 鼠标按下
const handleMousedown = (e) => {
    isTranslate = true;
    offsetX = e.offsetX
    offsetY = e.offsetY
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseup);
}
// 关闭动画结束
const handleClosed = () => {
    props.removeNode && props.removeNode();
}
// 点击关闭之前
const handleBeforClose = () => {
    closeDrawer();
    closeDialog();
}
// 点击tabbar切换
const handleTabbar = (index) => {
    tabbarCurrent.value = index;
}
// 关闭侧边栏
const closeDrawer = () => {
    drawerVisibled.value = false;
}
// 关闭会话窗口
const closeDialog = () => {
    context.value = "";
    store.commit('IM/setSessionItem', {});
    dialogVisibled.value = false;
}
// 打开侧边栏
const openDrawer = () => {
    drawerVisibled.value = true;
}
// 打开会话窗口
const openDialog = (e) => {
    SessionRightRef.value?.close && SessionRightRef.value.close()
    loadingSessionState.value = 1
    store.dispatch('IM/handleCreateSession', e).then(res => {
        dialogVisibled.value = true;
        nextTick(() => {
            const scrollViewHeight = scrollBarRef.value?.resize$.clientHeight || 1000000000;
            scrollBarRef.value.setScrollTop(scrollViewHeight);
            loadingSessionState.value = 0
        })
    }).catch(err => {
        loadingSessionState.value = 2
        console.log(err)
    });
}
// 打开IM窗口
const open = (account = '') => {
    // openDialog();
    openDrawer();
}

defineExpose({
    open,
    openDialog,
    openDrawer,
    closeDrawer,
    closeDialog,
})
</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
<style>
.el-popover.el-popper.session-popover-box {
    border-radius: 12px;
    border: none;
    padding: 0;
    min-width: 80px;
}
</style>