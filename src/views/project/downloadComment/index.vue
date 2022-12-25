<template>
  <div class="download-comment">
    <div class="header">
      <el-button
        :loading="downloadStatus"
        class="down-btn"
        type="primary"
        color="#3468FE"
        @click="downloadWork('word')"
      >{{downloadStatus?'文件生成中':'下载Word'}}</el-button>
      <el-button
        :loading="downloadStatus2"
        class="down-btn"
        type="primary"
        color="#3468FE"
        @click="downloadWork('xlsx')"
        >{{downloadStatus2?'文件生成中':'下载Excel'}}</el-button>
        <!-- <span style="cursor:pointer;" @click="downloadWork('word')" v-loading="downloadStatus">{{downloadStatus?'文件生成中':'下载Word'}}</span> -->
        <!-- <span style="cursor:pointer;" @click="downloadWork('xlsx')" v-loading="downloadStatus2">{{downloadStatus2?'文件生成中':'下载Excel'}}</span> -->
    </div>
    <div class="download-content">
      <h2>批注意见汇总</h2>
      <div class="download-info">
        <div>
          <div class="dinfo-item">
            <span class="item-left">项目名称：</span>
            <span>{{projectInfo.name}}</span>
          </div>
          <div class="dinfo-item">
            <span class="item-left">文件名称：</span>
            <span>{{fileDetail.name}}</span>
          </div>
          <div class="dinfo-item">
            <span class="item-left">文件参数：</span>
            <span v-if="fileDetail?.fileCat === 'video'">
              {{secondToDate(fileDetail.duration)}} | 
              {{`${fileDetail.metaData?.VideoStreamSet[0]?.Width} * ${fileDetail.metaData?.VideoStreamSet[0]?.Height}`}} | 
              {{ `${fileDetail.metaData?.VideoStreamSet[0]?.Fps}Fps`}} | 
              {{fileDetail.suffix}}
            </span>
            <span v-else-if="fileDetail?.fileCat === 'audio'">
              {{secondToDate(fileDetail.duration)}} | 
              {{`${fileDetail.metaData?.AudioStreamSet[0]?.SamplingRate}Hz`}} | 
              {{`${fileDetail.metaData?.Bitrate}Bps`}} | 
              {{fileDetail.suffix}}
            </span>
            <span v-else-if="fileDetail?.fileCat === 'image' && imgWidth">
              {{imgWidth}} * {{imgHeight}} | 
              {{fileDetail.suffix}}
            </span>
            <span v-else>{{fileDetail.suffix}}</span>
          </div>
        </div>
        <div style="padding-right:10%;">
          <div class="dinfo-item">
            <span class="item-left">批注导出者：</span>
            <span>{{userInfo.name}}</span>
          </div>
          <div class="dinfo-item">
            <span class="item-left">批注导出时间：</span>
            <span>{{ formatDate(new Date().getTime()) }}</span>
          </div>
          <div class="dinfo-item">
            <span class="item-left">批注意见数：</span>
            <span>{{commentList.length}}</span>
          </div>
        </div>
      </div>
      <div class="comment-box">
        <ul>
          <li v-for="(item, index) in commentList" :key="index">
            <div class="comment-left">
              <img :src="item.screenshotInfo?.sourceUrl" alt="">
            </div>
            <div class="comment-right">
              <div class="comment-info">
                <div class="comment-info-item" style="padding-top:0;">
                  <span class="item-left">评论者：</span>
                  <span>{{item.user.nickName}}</span>
                </div>
                <div v-if="fileDetail.fileCat === 'video'" class="comment-info-item">
                  <span class="item-left">时间戳：</span>
                  <span>{{secondToDate(item.startTime)}}</span>
                  <span v-if="item.endTime">&nbsp-&nbsp{{secondToDate(item.endTime)}}</span>
                </div>
                <div class="comment-info-item">
                  <span class="item-left">批注时间：</span>
                  <span>{{item.createTime}}</span>
                </div>
                <div class="comment-info-item">
                  <span class="item-left">批注内容：</span>
                  <span style="white-space: pre-wrap;word-break:break-all;">{{item.content}}</span>
                </div>
                <div class="comment-info-item">
                  <span class="item-left">附件：</span>
                  <div v-if="item.attachmentInfo?.length > 0" class="attachment-box">
                    <div v-for="item2 in item.attachmentInfo" :key="item2.fileId" class="attachment-item">
                      <el-image
                        style="max-width: 50px; max-height: 36px;"
                        :src="item2.cover"
                        :preview-src-list="[item2.sourceUrl]"
                        :initial-index="0"
                        :preview-teleported="true"
                        fit="cover"
                      />
                    </div>
                  </div>
                  <span v-else>无</span>
                </div>
                
                <template v-if="item.children?.length > 0">
                  <div class="reply-info" v-for="reply in item.children" :key="reply.id">
                    <div class="reply-info-item">
                      <span class="item-left">回复者：</span>
                      <span>{{reply.user?.nickName}}</span>
                    </div>
                    <div class="reply-info-item">
                      <span class="item-left">回复时间：</span>
                      <span>{{reply.createTime}}</span>
                    </div>
                    <div class="reply-info-item">
                      <span class="item-left">回复@{{getParentUser(reply.parentId)}}：</span>
                      <span>{{reply.content}}</span>
                    </div>
                    <div class="reply-info-item">
                      <span class="item-left">附件：</span>
                      <div v-if="reply.attachmentInfo?.length > 0" class="attachment-box">
                        <div v-for="item3 in reply.attachmentInfo" :key="item3.fileId" class="attachment-item">
                          <el-image
                            style="max-width: 50px; max-height: 36px;"
                            :src="item3.cover"
                            :preview-src-list="[item3.sourceUrl]"
                            :initial-index="0"
                            :preview-teleported="true"
                            fit="cover"
                          />
                        </div>
                      </div>
                      <span v-else>无</span>
                    </div>
                  </div>
                </template>

              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommentListNoPage, exportCommentListNoPage } from '@/api/project/files'
import { reactive } from '@vue/reactivity'
import {
  getFileDetails,
  getProjectDetails
} from "@/api/project/project.js"
import { secondToDate, formatDate } from "@/utils/tool";
import { parseTime } from "@/utils/ruoyi";
import { ElLoading } from 'element-plus'
// import {  } from "@/utils/index";

const store = useStore();
const route = useRoute()
const fileId = ref(0)
const fileDetail = ref({})
const projectId = ref(0)
const projectInfo = ref({})
const commentList = ref([])
const userInfo = store.state.user
const downloadStatus = ref(false)
const downloadStatus2 = ref(false)
const imgWidth = ref(0)
const imgHeight = ref(0)

onMounted(() => {
  fileId.value = route.params.file_id * 1
  getCommentList()
  getFileDetail()
})

// 获取项目信息
function getProjectInfo() {
  getProjectDetails({id: projectId.value}).then(res => {
    projectInfo.value = res.data
  })
}

// 获取文件详情
function getFileDetail() {
  getFileDetails({id: fileId.value}).then(res => {
    fileDetail.value = res.data
    projectId.value = res.data.projectId
    getProjectInfo()
    if (fileDetail.value.fileCat === 'image') {
      getImgWh(fileDetail.value.sourceUrl)
    }
  })
}


function getImgWh(imgUrl) {
	const img = new Image();
	// 图片地址
	img.src = imgUrl;
	img.onload = function () {
 		imgWidth.value = img.width
 		imgHeight.value = img.height
	}
}

// 获取评论列表
function getCommentList() {
  getCommentListNoPage({file_id: fileId.value}).then(res => {
    commentList.value = res.data
  })
}

// 下载work
function downloadWork(format) {
  if (format === 'word') {
    downloadStatus.value = true
  }
  if (format === 'xlsx') {
    downloadStatus2.value = true
  }
  const loading = ElLoading.service({
    lock: true,
    text: '文件生成中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  exportCommentListNoPage({file_id: fileId.value, format}).then(res => {
    downloadStatus.value = false
    downloadStatus2.value = false
    let blob = '';
    let fileName = ''
    if (format === 'word') {
      blob = new Blob([res], {type: "application/fmsword;charset=utf-8"})
      fileName = parseTime(new Date(), '{y}{m}{d}') + '-' + fileDetail.value.name + '-' + '审阅意见汇总.doc'
    }
    if (format === 'xlsx') {
      blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"})
      fileName = parseTime(new Date(), '{y}{m}{d}') + '-' + fileDetail.value.name + '-' + '审阅意见汇总.xls'
    }
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    loading.close()

  }).catch(err => {
    downloadStatus.value = false
    downloadStatus2.value = false
    loading.close()
  })
}

function getParentUser(pid) {
  const pobj = commentList.value.find(el => el.id = pid)
  return pobj.user.nickName || ''
}

</script>

<style scoped lang="scss">
  @import "./style.scss";
</style>