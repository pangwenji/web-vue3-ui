<template>
    <el-dialog title="消息历史记录" v-model="visibled" width="530px" :before-close="onBeforeClose" custom-class="dialog-center">
        <el-form :model="formData" label-position="top">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="消息类型" prop="msgTypes">
                        <el-select style="width:100%" v-model="formData.msgTypes" @change="handleChangeType" placeholder="消息类型">
                            <el-option label="全部" :value="''" />
                            <el-option label="文字" :value="'text'" />
                            <el-option label="图片" :value="'image'" />
                            <el-option label="视频" :value="'video'" />
                            <el-option label="音频" :value="'audio'" />
                            <el-option label="文件" :value="'file'" />
                            <el-option label="其他" :value="'custom'" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="时间范围" prop="datetimerange">
                        <el-date-picker v-model="formData.datetimerange" style="width:100%" @change="handleChangeDate($event)" type="datetimerange" placeholder="开始时间" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-scrollbar height="500px"  :noresize="false" @scroll="handleScroll" ref="scrollbarRef" style="margin: 0 -20px;" view-style="padding: 20px; min-height:100%;" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
            <template v-if="messageData.length">
                <template v-for="(item,index) in messageData" :key="index">
                    <MessageItem :to="formData.to" :avatar="formData.avatar" :showContextmenu="true" :messageData="item" @onRecall="handleRecall(item)"></MessageItem>
                </template>
                <div class="bottom-loading-text">
                    <span @click="getData()" v-if="!loadingComplete">加载更多</span>
                    <span v-else>已全部加载</span>
                </div>
            </template>
            <template v-else-if="!loadingState">
                <Empty style="padding: 0" :image="EmptyImage" ></Empty>
            </template>
        </el-scrollbar>
    </el-dialog>
</template>
<script>
import EmptyImage from '@/assets/images/empty-white.png'
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { parseTime } from "@/utils/ruoyi";
import MessageItem from "./MessageItem.vue"
const components = {
    MessageItem
}
const setup = () => {
    const store = useStore();
    const visibled = ref(false);
    const messageData = ref([]);
    const scrollbarRef = ref();
    const loadingState = ref(false);
    const loadingComplete = ref(false);
    const formData = reactive({
        to: '',         // 聊天对象 账号或群ID
        asc: true,      // 是否为升序排序 false 表示返回的消息按时间降序排序; true 表示按时间升序排序
        scene: 'p2p',      // 聊天场景
        avatar:'',
        reverse: true,  // 是否为反向查询，默认 false 表示从 endTime 开始往前查找历史消息; true 表示从 beginTime 开始往后查找历史消息
        endTime: new Date().getTime(),    // 结束时间
        beginTime: new Date().getTime(),  // 开始时间
        datetimerange:[new Date().getTime(), new Date().getTime()],
        msgTypes: '',   // 消息类型 默认全部
        limit: 10,
        lastMsgId: null,  // 上次查询的idServer，第一次不填
    })
    // 关闭弹窗之前的回调函数
    const onBeforeClose = (deno) => {
        if(loadingState.value) { return }
        loadingComplete.value = false;
        messageData.value = [];
        formData.lastMsgId = null;
        formData.msgTypes = '';
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    // 重置日期
    const handleResetDate = () => {
        const date = new Date();
        date.setDate((new Date().getDate() - 1));
        const startTime = date.getTime();
        const endTime = new Date().getTime();
        formData.beginTime = startTime;
        formData.endTime = endTime;
        formData.datetimerange = [
            startTime,
            endTime,
        ]
    }
    handleResetDate()
    const handleScroll = ({ scrollLeft, scrollTop })=>{
        const viewHeight = scrollbarRef.value.resize$.clientHeight - 500;
            if(scrollTop + 50 >= viewHeight){
                if(loadingState.value){ return }
                getData();
            }
    }
    const handleChangeType = ()=>{
        messageData.value = [];
        loadingComplete.value = false;
        formData.lastMsgId = ''
        getData();
    }
    // 开始时间或则结束时间改变时
    const handleChangeDate = (v)=>{
        formData.endTime = v[1]?.getTime();
        formData.beginTime = v[0]?.getTime();
        loadingComplete.value = false;
        getData();
    }
    // 获取数据
    const getData = ()=>{
        loadingState.value = true;
        const submitData = {}
        submitData['to'] = formData.to;
        submitData['asc'] = formData.asc;
        submitData['limit'] = formData.limit;
        submitData['scene'] = formData.scene;
        submitData['reverse'] = formData.reverse;
        submitData['endTime'] = formData.endTime;
        submitData['beginTime'] = formData.beginTime;
        submitData['msgTypes'] = formData.msgTypes?[formData.msgTypes] : [];
        if(formData.lastMsgId){ 
            submitData['lastMsgId'] = formData.lastMsgId;
            store.dispatch('IM/handleGetHistoryMsg',{ 
                to: formData.to,
                asc: formData.asc,
                limit: formData.limit,   
                scene: formData.scene,   
                lastMsgId: formData.lastMsgId,    
            }).then(res=>{
                const list = [].concat(messageData.value)
                if(res&&res.length){
                    const lastMsgId = res[res.length - 1].idServer;
                    if(formData.lastMsgId == lastMsgId){
                        loadingComplete.value = true;
                    }else{
                        formData.lastMsgId = lastMsgId;
                        list.push(...res);
                        messageData.value = list;
                    }
                }else{
                    loadingComplete.value = true;
                }
                loadingState.value = false;
            }).catch(err=>{
                loadingState.value = false;
            })
            return
        }
        store.dispatch('IM/handleGetHistoryMsg',submitData).then(res=>{
            if(res&&res.length){
                messageData.value = res;
                formData.lastMsgId = res[res.length - 1].idServer
            }else{
                loadingComplete.value = true;
            }

            loadingState.value = false;
        }).catch(err=>{
            console.log(err)
            loadingState.value = false;
        })
    }
    const open = ({to,avatar,scene})=>{
        formData.to = to;
        formData.scene = scene;
        formData.avatar = avatar;
        visibled.value = true;
        getData();
    }
    return {
        open,
        getData,
        visibled,
        formData,
        EmptyImage,
        components,
        messageData,
        handleScroll,
        scrollbarRef,
        loadingState,
        onBeforeClose,
        loadingComplete,
        handleChangeType,
        handleChangeDate,
    }
}
export default defineComponent({
    setup,
    components
})
</script>
<style scoped lang="scss">
.bottom-loading-text{
    text-align: center;
    span{
        cursor: pointer;
    }
}
</style>