<template>
  <div class="file-remark-content">
    <div class="remark-top">
      <div>
        <el-dropdown @command="handleStatus" trigger="click" size="small">
          <span class="el-dropdown-color">
            {{statusText}}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in statusList" :command="item.key" :key="index">{{item.title}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div>
        <el-dropdown
          @command="handleSort"
          trigger="click"
          size="small"
          popper-class="dropdown-comment-sort"
        >
          <el-tooltip
            effect="light"
            content="评审意见排序"
            placement="top"
            :show-after="400"
          >
            <span class="el-dropdown-color dropdown-sort">
              <i class="icon icon-sort"></i>
            </span>
          </el-tooltip>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in sortList" :command="item" :key="index">
                <span :style="{color: sortVal === item.key?'#0D0D15':''}">{{item.title}}</span>
                <i v-if="sortVal === item.key" class="icon-check"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- <div>
        <el-checkbox v-model="atMe" label="@我" size="small" />
      </div> -->
      <div class="comment-down">
        <el-button :disabled="remarkList.length===0" size="small" @click="goDownComment" color="#3E414B" round>
          <i class="icon icon-download"></i>
          <span>导出意见</span>
        </el-button>
      </div>
    </div>

    <el-scrollbar class="tag-scroll" :height="clientHeight - 155" @scroll="handleScroll">
    <div>
      <ul>
        <li :class="{'activeTag': isActiveTag === item.id}" v-for="(item, index) in remarkList" :key="index" @click="clickItem(item, index)">
          <div class="remark-list-box">
            <div class="remarkbox rk-box1">
              <div class="user-info">
                <img @dragstart.prevent style="width:36px;height:36px;border-radius: 50%;margin-right: 10px;" :src="item.user?.avatar" alt="">
                <span class="user-name">{{item.user?.nickName}}</span>
              </div>
              <div class="info-r">
                <span class="choose-time" v-if="item.startTime">
                  <span>{{ secondToDate(item.startTime) }} </span>
                  <span v-if="item.endTime">&nbsp-&nbsp{{ secondToDate(item.endTime) }}</span>
                </span>
                <span>
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    :content="item.status==0?'标记为已完成': item.statusChangeUser || item.user?.nickName+'的标记'"
                    placement="left"
                  >
                    <el-checkbox @change="commentStatusChange($event,item,index)" v-model="item.status" :true-label="1" :false-label="0" size="large" />
                  </el-tooltip>
                </span>
              </div>
            </div>
            <div class="remarkbox rk-box2">
              <span class="comm-content" style="white-space: pre-wrap;word-break:break-all;">
                {{ item.content }}
              </span>
            </div>
            <div class="remarkbox rk-box4" v-if="item.attachmentInfo?.length > 0">
              <div @click.stop="" class="attachment-item" v-for="item4 in item.attachmentInfo" :key="item4.fileId">
                <!-- <img :src="item4.cover" alt=""> -->
                <el-image
									style="max-width: 50px; max-height: 36px;"
									:src="item4.cover"
									:preview-src-list="[item4.sourceUrl]"
									:initial-index="0"
									:preview-teleported="true"
                  @dragstart.prevent
									fit="cover"
								/>
              </div>
            </div>
            <div v-if="replyIndex !== item.id" class="remarkbox rk-box3">
              <div class="rk-box3-left">
                <span class="comp-time">{{computedTime(item.createTime)}}</span>
              </div>
              <div class="rk-box3-right">
                <span v-if="!isShare && (item.userId === userId || projectData.userId === userId)" @click.stop="deleteRemark(item.id, index)">删除</span>
                <span v-if="!(props.shareDetail?.allowComments === 0)" @click.stop="replyIndex = item.id">回复</span>
              </div>
            </div>
            <div v-else class="reply-box">
              <SendReply 
                :placeholder="'回复@' + item.user?.nickName||''"
                :showBottom="true"
                :fileDetail="fileDetail"
                :scrollTop="scrollTop"
                @cancelReply="cancelReply(1)"
                @sendReply="sendReplyFun($event, index, 1)"
              ></SendReply>
            </div>
          </div>

          <div v-for="(replyInfo, index2) in item.children" :key="index2" class="reply-list-box">
            <div class="reply-info">
              <img @dragstart.prevent style="width:36px;height:36px;border-radius: 50%;margin-right: 10px;" :src="replyInfo.user?.avatar" alt="">
              <span style="color: #828BA2;white-space: nowrap;">{{replyInfo.user?.nickName || replyInfo.userId}}</span>
            </div>
            <div style="word-wrap:break-word;margin-bottom: 8px;">
              <span>回复@{{item.user?.nickName}}：{{replyInfo.content}}</span>
            </div>
            <div class="reply-atta" v-if="replyInfo.attachmentInfo?.length > 0">
              <div @click.stop="" class="attachment-item" v-for="item5 in replyInfo.attachmentInfo" :key="item5.fileId">
                <el-image
									style="max-width: 50px; max-height: 36px;"
									:src="item5.cover"
									:preview-src-list="[item5.sourceUrl]"
									:initial-index="0"
									:preview-teleported="true"
                  @dragstart.prevent
									fit="cover"
								/>
              </div>
            </div>
            <div v-if="replyIndex2 === replyInfo.id && replyIndex3 === item.id">
              <SendReply
                :placeholder="'回复@' + replyInfo.user?.nickName||''"
                :showBottom="true"
                :fileDetail="fileDetail"
                :scrollTop="scrollTop"
                @cancelReply="cancelReply(2)"
                @sendReply="sendReplyFun($event, index, 2)"
              ></SendReply>
            </div>
            <div v-else class="reply-info-btn">
              <div class="reply-btn-left">
                <span class="comp-time"> {{computedTime(replyInfo.createTime)}}</span>
              </div>
              <div class="reply-btn-right">
                <span v-if="!isShare && (replyInfo.userId === userId || projectData.userId === userId)" @click.stop="deleteRemark(replyInfo.id, index, index2)">删除</span>
                <span v-if="!(props.shareDetail?.allowComments === 0)" @click.stop="replyClick(item.id, replyInfo.id)">回复</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { secondToDate, computedTime } from "@/utils/tool";
import SendReply from "../SendReply/index.vue";
import { ElMessageBox, ElMessage } from 'element-plus';
import { sharePostComment } from "@/api/project/share.js"
import { putCommentStatus } from "@/api/project/files.js"
import { onMounted } from "vue-demi";
import checkIcon from '@/assets/icons/clouddisk/icon_gouxuan@2x.png'
import { getToken } from '@/utils/auth'

const store = useStore();
const props = defineProps({
  isActiveTag: {
    type: Number,
    default: null,
  },
  fileType: {
    type: String,
    default: '',
  },
  isShare: {
    type: Boolean,
    default: false
  },
  shareDetail: {
    type: Object,
    default: {}
  },
  fileDetail: {
    type: Object,
    default: {}
  }
})

const route = useRoute()
const replyIndex = ref(null);
const replyIndex2 = ref(null);
const replyIndex3 = ref(null);
const atMe = ref(false)
const statusVal = ref(2)
const sortVal = ref(1)
const statusList = ref([
  {
    key: 2,
    title: '全部批注'
  },
  {
    key: 0,
    title: '未完成批注'
  },
  {
    key: 1,
    title: '已完成批注'
  }
])
const sortList = ref([
  {
    key: 1,
    title: '发布倒序',
    order: 'create_time',
    asc: 'desc'
  },
  {
    key: 2,
    title: '发布正序',
    order: 'create_time',
    asc: 'asc'
  },
  {
    key: 4,
    title: '时间码倒序',
    order: 'start_time',
    asc: 'desc'
  },
  {
    key: 3,
    title: '时间码正序',
    order: 'start_time',
    asc: 'asc'
  },
  {
    key: 5,
    title: '批注者',
    order: 'user_id',
    asc: 'asc'
  }
])
const emit = defineEmits(['clickItem', 'getStatusComment', 'onCommentSort', 'addCommentSuccess']);
const clientHeight = ref(null)
const clientToken = ref('')

onMounted( () => {
  clientHeight.value = document.body.clientHeight;
  clientToken.value = route.query.token || ''
})

const userId = computed(() => {
  return store.state.user.userId
})

const remarkList = computed(() => {
  return store.state.file.commentList;
});

const statusText = computed(() => {
  const obj = statusList.value.find(el => el.key === statusVal.value)
  return obj.title
});

const projectData = computed(()=> store.state.project.projectData)

const clickItem = (item, index) => {
  emit('clickItem',item, index);
}

// 删除批注
function deleteRemark(id, index, index2 = null){
    ElMessageBox.confirm('确认删除当前审阅意见？', '', {
      customClass: 'messageBox-custom-warning',
      confirmButtonText: '删除',
      ancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      store.dispatch("file/handleDeleteComment", {id, index, index2}).then(res=>{
        ElMessage({
          message: '意见删除成功',
          type: 'success',
        })
      }).catch(err=>{
        console.log('删除意见-err-', err);
      })
    })
    .catch(() => {
    })
}

function replyClick(id1, id2) {
  replyIndex3.value = id1
  replyIndex2.value = id2
}

// 取消回复
function cancelReply(type) {
  if (type === 1) replyIndex.value = null;
  if (type === 2) {
    replyIndex2.value = null
    replyIndex3.value = null
  }
}

// 发送回复
function sendReplyFun(e, index, type) {
  const params = {
    content: e.content,
    fileId: remarkList.value[index].fileId,
    parentId: remarkList.value[index].id,
    attachmentId: e.attachmentId || [], // 附件id
  }
  if (props.isShare) {
    params.token = props.shareDetail.sessionToken;
    sharePostComment(params).then(res => {
      const data = res.data
      data.attachmentInfo = e.attachmentArr
      const commentData = remarkList.value
      if (commentData[index].children === null) {
        commentData[index].children = []
      }
      commentData[index].children.unshift(data);
      store.commit('file/SET_COMMENT_LIST', commentData)
      ElMessage.success('评论成功')
      cancelReply(type)
    })
  } else {
    params.remind =  e.remind;
    params.attachmentArr = e.attachmentArr || [];
    store.dispatch("file/handleAddComment", {data: params, index}).then(res=>{
      ElMessage({
        message: '意见发送成功',
        type: 'success',
      })
      cancelReply(type)
      emit('addCommentSuccess')
    }).catch(err=>{
      console.log('发布回复-err-', err);
    })
  }
}

function handleStatus(command) {
  statusVal.value = command
  emit('getStatusComment', command)
}

function handleSort(command) {
  sortVal.value = command.key
  emit('onCommentSort', command)
}

const { proxy } = getCurrentInstance()
function goDownComment() {
  if (!getToken()) {
    proxy.$loginDialog.open({})
    return;
  }
  if (clientToken.value) {
    window.webkit.messageHandlers.openSuggestion.postMessage('workbench/#/downloadComment/'+route.query.id * 1)
  } else {
    window.open('/workbench/#/downloadComment/'+route.query.id * 1, "_blank");
  }
}

// 改变评审记录状态
function commentStatusChange($e, item, index) {
  const params = {
    id: item.id,
    status: $e,
  }
  putCommentStatus(params).then(res => {
    const rmlist = remarkList.value
    rmlist[index].status = $e
    store.commit("file/SET_COMMENT_LIST", rmlist);
  })
}

const scrollTop = ref(0)
function handleScroll(e) {
  scrollTop.value = e.scrollTop
}


</script>
<style scoped lang="scss">
  @import "./style.scss";
</style>
