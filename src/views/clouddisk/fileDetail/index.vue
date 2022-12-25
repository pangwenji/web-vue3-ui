<template>
  <div
    v-loading="loadingStatus || fileDetail.fileCat === ''"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    style="width:100%;height:100%;"
  >
    <FileTop
      v-show="isFullScreen"
      :isFileList="isFileList"
      :clientWidth="clientWidth"
      :fileType="fileType"
      :isPrevent="isPrevent"
      :showInfo="showInfo"
      :codingStatus="codingStatus"
      :shareInfo="shareInfo"
      :isWps="isWps"
      @showFileList="showFileList"
      @handlePrevent="preventFun"
      @onShare="handleShare"
      @onDown="handleDown"
      @onShowInfo="handleShowInfo"
      @goBack="handleGoBack"
    ></FileTop>

    <div v-if="codingStatus === 2" class="container-box">
      <transition name="fileleft">
        <div class="container-left" v-show="isFileList">
          <FileLeft
            :fileList="fileList"
            @handleRefresh="handleFileList"
            @onFileClick="handleFileClick"
          ></FileLeft>
        </div>
      </transition>

      <div
        v-if="!isWps"
        class="container-middle"
        id="full-box"
      >
        <div
          style="position:relative;"
          :style="{height: clientHeight-(!isFullScreen?(fileCat==='image'?0:67):(fileCat==='image'?60:127)) + 'px'}"
          @mouseover="showSwitchBtn = true"
          @mouseleave="showSwitchBtn = false"
        >
          <VideoDetail
            ref="childRef"
            v-if="fileDetail.fileCat === 'video'"
            :fileDetail="fileDetail"
            :clarity="clarity"
            :clarityCurrentTime="clarityCurrentTime"
            :playerWidth="playerWidth"
            :playerHeight="playerHeight"
            @onPlayerInit="handlePlayerInit"
            @onPlay="handlePlayPause"
            @onTimeupdate="handleTimeupdate"
            @onEnded="handlePlayEnded"
            @progressSuccess="handleProgressSuccess"
          ></VideoDetail>
          <AudioDetail
            ref="childRef"
            v-else-if="fileDetail.fileCat === 'audio'"
            :fileDetail="fileDetail"
            @onPlayerInit="handlePlayerInit"
            @onPlay="handlePlayPause"
            @onTimeupdate="handleTimeupdate"
            @onEnded="handlePlayEnded"
          ></AudioDetail>
          <PictureDetail
            ref="childRef"
            v-else-if="fileDetail.fileCat === 'image'"
            :isFullScreen="isFullScreen"
            :fileDetail="fileDetail"
            @fullScreen="handleFullScreen"
          ></PictureDetail>
          <FileIFileNotSupportnfo v-if="fileDetail.fileCat && !['video','audio','image'].includes(fileDetail.fileCat)" :fileSuffix="fileDetail.suffix"></FileIFileNotSupportnfo>
          <PreviewSwitch
            v-show="showSwitchBtn"
            :style="{bottom: fileDetail.fileCat === 'image' ? '70px' : 0}"
            @onPrevious="handlePrevious"
            @onNext="handleNext">
          </PreviewSwitch>
        </div>

        <div
          v-if="fileCat==='video' || fileCat==='audio'"
          class="control-box"
          :style="{position: isFullScreen?'relative':'none'}"
        >
          <!-- 进度条 -->
          <div v-if="fileCat === 'audio' || fileCat === 'video'" class="slider__runway" :class="{'runway-mouseenter':runwayMouse}">
            <div
              v-if="fileCat === 'video'"
              class="video-sprite"
              :style="spriteStyle" >
            </div>
            <!-- <div
              style="position: absolute;width:100%;height:100%;z-index:500;top:0;"
            > -->
              <el-slider
                :show-tooltip="false"
                v-model="onPlayPercent"
                @change="playPerChange"
                @mousemove="handleMouseMove"
                @mouseenter="runwayMouse = true"
                @mouseleave="handleMouseleave"
              >
              </el-slider>
            <!-- </div> -->
          </div>
          <!-- 播放控制 -->
          <div class="play-box">
            <div class="play-box-left">
              <div @click="playPause" class="control-icon">
                <i class="play-icon" :class="isPlay ? 'icon-pause' : 'icon-play'"></i>
              </div>
              <el-tooltip
                class="box-item"
                effect="light"
                :show-after="400"
                content="后退1秒"
                placement="top"
              >
                <div @click="currentTimeChange(-1)">
                  <i class="play-icon icon-refund"></i>
                </div>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                effect="light"
                :show-after="400"
                content="前进1秒"
                placement="top"
              >
                <div @click="currentTimeChange(1)">
                  <i class="play-icon icon-forward"></i>
                </div>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                effect="light"
                :show-after="400"
                content="循环播放"
                placement="top"
              >
                <div @click="handleLoopPlay">
                  <i v-if="isLoop" class="play-icon icon-loop2"></i>
                  <i v-else class="play-icon icon-loop"></i>
                </div>
              </el-tooltip>

            </div>

            <div>
              {{secondToDate(onPlayTime)}} / {{secondToDate(playerDuration)}}
            </div>

            <div class="control-right">
              <div class="clarity-box" v-if="fileCat === 'video' && signList.length > 0">
                <el-tooltip
                  effect="light"
                  placement="top"
                  popper-class="tooltip-clarity-box"
                  :offset="4"
                >
                  <template #content>
                    <div class="clarity-tooltip">
                      <div
                        v-for="(item,index) in signList"
                        :key="index"
                        style="display:flex;white-space:nowrap;"
                        class="clarity-item"
                        @click.stop="playClarityChange(item)"
                      >
                        <span :style="{color: clarity === item.name ? '#0D0D15' : ''}">{{clarityFormat(item.name)}}</span>
                        <i v-if="clarity === item.name" class="icon-check"></i>
                      </div>
                    </div>
                  </template>
                  <div style="display:flex;white-space:nowrap;">
                    <span class="playBtn" style="height:32px;line-height:32px;padding:0 6px;">{{clarityFormat(clarity)}}</span>
                  </div>
                </el-tooltip>
              </div>

              <div class="backrate-box">
                <el-tooltip
                  effect="light"
                  placement="top"
                  popper-class="tooltip-rate-box"
                  :offset="4"
                >
                  <template #content>
                    <div class="backrate-tooltip">
                      <div
                        v-for="(item,index) in ['2.0','1.5','1.25','1.0','0.75','0.5','0.25']"
                        :key="index"
                        style="display:flex;white-space:nowrap;"
                        class="backrate-item"
                        @click.stop="playbackRateChange(item)"
                      >
                        <span :style="{color: playbackRate === item?'#0D0D15':''}">{{item}}</span>
                        <i v-if="playbackRate === item" class="icon-check"></i>
                      </div>
                    </div>
                  </template>
                  <div>
                    <div style="display:flex;white-space:nowrap;">
                      <span class="playBtn" style="height:32px;line-height:32px;padding:0 6px;">倍速 {{playbackRate}}</span>
                    </div>
                  </div>
                </el-tooltip>
              </div>

              <div class="control-icon volume-box">
                <el-tooltip
                  effect="light"
                  placement="top"
                  popper-class="tooltip-volume-box"
                  :offset="4"
                >
                  <template #content>
                    <div class="slider-demo-block">
                      <el-slider v-model="playerVolume" vertical size="small" @change="volumeChange" height="100px" />
                    </div>
                  </template>
                  <div>
                    <i v-if="playerVolume > 0" @click.stop="handleVolume" class="play-icon icon-volume"></i>
                    <i v-else @click.stop="handleVolume" class="play-icon icon-volume-no"></i>
                  </div>
                </el-tooltip>
              </div>

              <div class="full-box">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :show-after="400"
                  content="全屏"
                  placement="top"
                >
                  <div @click="handleFullScreen" >
                    <svg-icon iconClass="icon_full" :size="32" ></svg-icon>
                  </div>
                </el-tooltip>

              </div>
            </div>

          </div>
        </div>
        <div v-else-if="fileCat!=='image'" class="control-box">
          <div class="play-box" style="justify-content: flex-end;">
            <div class="control-right">
              <div class="full-box">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :show-after="400"
                  content="全屏"
                  placement="top"
                >
                  <div @click="handleFullScreen" >
                    <svg-icon iconClass="icon_full" :size="36" ></svg-icon>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="container-middle">
        <iframe :src="wpsUrl" frameborder="0"></iframe>
      </div>

      <div v-show="isFullScreen && showInfo" class="container-right" id="container-right">
        <FileInfo :isShare="shareToken?true:false" @onRename="handleRename"></FileInfo>
      </div>
    </div>
    <div  v-else-if="codingStatus === 1" v-loading="codingStatus === 1" element-loading-background="#0a0b0d" element-loading-text="转码中，请稍后再访问..." style="width:100%;height:100%;"></div>
    <div v-else class="coding-fail">转码失败，请联系管理员</div>

    <shareDialog
      v-if="shareShow"
      :shareShow="shareShow"
      :fileType="fileDetail.fileCat"
      :shareData="shareData"
      @shareClose="shareClose"
      @shareSuccess="shareSuccess"
    ></shareDialog>

    <ShareInfoDialog
      v-if="shareInfoShow"
      :shareInfoShow="shareInfoShow"
      :shareInfo="createdShareInfo"
      @shareInfoClose="shareInfoClose"
    ></ShareInfoDialog>

  </div>
</template>
<script setup>
import FileTop from '../components/FileTop'
import FileLeft from '../components/FileLeft'
import VideoDetail from '../components/VideoDetail'
import AudioDetail from '../components/AudioDetail'
import PictureDetail from '../components/PictureDetail'
import FileInfo from '../components/FileInfo'
import FileIFileNotSupportnfo from '@/views/project/file/components/FileNotSupport'
import { onMounted, watch , onUnmounted} from 'vue-demi'
import { editWpsFile, rename, getFileDownloadUrl } from '@/api/clouddisk/file.js'
import { getPreviewWpsFile } from '@/api/clouddisk/share.js'
import { getToken, setToken } from '@/utils/auth'
import { ElMessage } from 'element-plus';
import {
  getFileShareInfo,
  getShareFileList,
  shareSaveTo,
  getFileOrFolderDetails,
  getShareFileDownloadUrl
} from '@/api/clouddisk/share.js';
import shareDialog from '../components/ShareDialog/index'
import ShareInfoDialog from '../components/ShareInfoDialog/index'
import { secondToDate } from "@/utils/tool";
import { download } from "@/utils/request.js"
import cache from '@/plugins/cache'
import PreviewSwitch from '@/components/PreviewSwitch'

const router = useRouter();
const store = useStore()
const route = useRoute()
const clientWidth = ref(0)
const clientHeight = ref(0)
const isFileList = ref(false)
const isPrevent = ref(false)
const preventTimer = ref(null) //防录屏定时器
const fileId = ref(0)
const fileCat = ref('')
const shareToken = ref('')
const loadingStatus = ref(false)
const shareInfo = ref({})
const clientToken = ref('') //客户端token

const playerDuration = ref(0)  //音视频长度
const onPlayPercent = ref(0) // 播放百分比
const onPlayTime = ref(0) // 当前播放时间
const isPlay = ref(false)
const playerVolume = ref(100) // 音量
const isFullScreen = ref(true) // 否是全屏
const signList = ref([]) // 资源列表
const showSwitchBtn =  ref(false) //显示切换按钮

onMounted(() => {
  init()
  // 监听页面全屏
  window.addEventListener('fullscreenchange', () => {
    isFullScreen.value = !isFullScreen.value
  })

  // img视窗变化
  window.onresize = () => {
    return (() => {
      clientWidth.value = document.documentElement.clientWidth;
      clientHeight.value = document.documentElement.clientHeight;
    })()
  }

  document.onkeydown = (e) => {
    // 空格播放暂停
    if (e.keyCode == 32) {
      if ((fileCat.value === 'video' || fileCat.value === 'audio') && playerDuration.value > 0) {
        playPause()
      }
    }
  }
})

onUnmounted(() => {
  store.commit("clouddisk/SET_FILE_DETAIL", {});
  if ((fileType.value === 'video' || fileType.value === 'audio') && observer.value !== null) {
    observer.value.disconnect(); //移除监听
    observer.value = null;
  }
})


const fileType = computed(() => {
  return store.state.clouddisk.fileType
})

const isWps = computed(() => {
  if (['doc', 'xls', 'ppt', 'pdf'].includes(fileCat.value)) {
    return true
  }
  return false
})

const fileListCat = computed(() => {
  return store.state.clouddisk.fileListCat
})

const folderList = computed(()=>{
  // return store.state.clouddisk.fileList
  return cache.session.getJSON('FOList') || []
})

const fileList = computed(()=>{
  // return store.state.clouddisk.fileList
  const list = cache.session.getJSON('FIList') || []
  const newList = []
  list.forEach(el => {
    if (el.type === 2) {
      newList.push(el)
    }
  });
  return newList
})

const fileDetail = computed(()=>{
  return store.state.clouddisk.fileDetail
})

const codingStatus = computed(()=>{
  let flag = 2
  if (fileDetail.value.fileCat === 'video' || fileDetail.value.fileCat === 'audio') {
    flag = fileDetail.value.sign?.codingStatus || 3
  }
  return flag
})

watch(isFullScreen,() => {
  setTimeout(() => {
    clientHeight.value = document.body.clientHeight
  }, 20)
})

watch(() => route.path, newPath => {
  if (newPath.includes('/clouddisk/detail')) {
    init()
  }
})

function init() {
  loadingStatus.value = true
  fileId.value = route.params.id*1
  fileCat.value = route.query.fileCat || ''
  shareToken.value = route.query.shareToken || ''
  clientToken.value = route.query.token || ''
  store.commit("clouddisk/SET_FILE_DETAIL", {});
  shareInfo.value = cache.session.getJSON('CLOUD_SHARE_INFO') || {}
  if (!shareToken.value && shareInfo.value) {
    shareInfo.value = {}
    cache.session.remove('CLOUD_SHARE_INFO')
  }
  if (clientToken.value) {
    setToken(clientToken.value)
    store.commit('SET_TOKEN', clientToken.value)
  }
  detailInit()
  clientWidth.value = document.body.clientWidth
  clientHeight.value = document.body.clientHeight
}

// 初始化
function detailInit() {
  if (shareToken.value) {
    getShareInfo()
  } else {
    if (isWps.value) {
      getEditWpsFile()
    }
    getFileDetail(fileId.value);
  }
}

const wpsUrl = ref('')
const getEditWpsFile = () => {
  loadingStatus.value = true
  const query = {
    fileSystemId: route.params.id
  }
  editWpsFile(query).then(res => {
    loadingStatus.value = false
    wpsUrl.value = res.data.wpsUrl
  }).catch(err => {
    loadingStatus.value = false
  })
}

// 获取分享预览WPS
function getSharePreviewWpsFile() {
  const query = {
    id: route.params.id,
    token: shareInfo.value.sessionToken
  }
  getPreviewWpsFile(query).then(res => {
    wpsUrl.value = res.data.wpsUrl
  })
}

function showFileList() {
  isFileList.value = !isFileList.value
  if (fileCat.value === 'image') {
    setTimeout(() => {
      childRef.value.setImgWhAndMap()
    }, 300);
  }
  if (fileCat.value === 'audio' && fileDetail.value.audioWave) {
    setTimeout(() => {
      childRef.value.onresizeDrawWave()
    }, 300);
  }
}

// 防录屏
function preventFun(val) {
  isPrevent.value = !val;
  if (isPrevent.value && fileCat.value === 'video') {
    // preventTimer.value = setInterval(() => {
    //   if (isPlay.value && fileCat.value === 'video') {
    //     const top = Math.round(Math.random()*(this.playerHeight-50));
    //     const left = Math.round(Math.random()*(this.playerWidth-370));
    //     this.preventStyle = {
    //       display: 'block',
    //       top: top+'px',
    //       left: left+'px',
    //     }
    //   }
    // }, 3000)
  } else {
    clearInterval(preventTimer.value)
    preventTimer.value = null
  }
}

// 获取文件列表
function handleFileList(project_id) {
  // fileList.value = []
  // getFileList({project_id}).then(res => {
  //   fileList.value = res.data
  // })
}

// 获取文件详情
function getFileDetail(id) {
  loadingStatus.value = true
  try {
    store.dispatch("clouddisk/getCloudFileDetail",{id}).then(res => {
      loadingStatus.value = false
    })
  } catch (error) {
    loadingStatus.value = false
  }
}

// 全屏
function handleFullScreen(el) {
  
  if (clientToken.value) {
    isFullScreen.value = !isFullScreen.value
    if (isFullScreen.value) {
      document.getElementsByClassName('container-box')[0].style.height = 'calc(100% - 60px)'
      // document.getElementById('full-box').style.marginRight = '300px'
    } else {
      document.getElementsByClassName('container-box')[0].style.height = '100%'
      document.getElementById('full-box').style.marginRight = 0
    }

    isFileList.value = false
    if (fileCat.value === 'audio' && codingStatus.value === 2) {
      setTimeout(() => {
        childRef.value.onresizeDrawWave()
      }, 100);
    }
    return
  }

  const element = document.getElementById('full-box');//指定全屏区域元素
  if (isFullScreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozExitFullScreen) {
      document.mozExitFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// 获取分享信息
function getShareInfo() {
  loadingStatus.value = true;
  if (shareInfo.value && shareInfo.value.token === shareToken.value) {
    if (shareInfo.value.sessionToken) {
      // getShareList()
      getShareFileDetails()
    }
    if (isWps.value) {
      getSharePreviewWpsFile()
    }
  } else {
    getFileShareInfo({ token: shareToken.value }).then((res) => {
      loadingStatus.value = false
      shareInfo.value = res.data
      cache.session.setJSON('CLOUD_SHARE_INFO', res.data)
      if (shareInfo.value.passwordLock === 1 && !shareInfo.value.sessionToken) {
        // 需要密码访问
        router.replace({ path: "/fileSharePage", query:{token: shareToken.value}});
      }
      if (shareInfo.value.sessionToken) {
        // getShareList()
        getShareFileDetails()
      }
      if (isWps.value) {
        getSharePreviewWpsFile()
      }
    })
    .catch((err) => {
      loadingStatus.value = false;
    });
  }
}

// 获取分享文件列表
function getShareList(parent_id) {
  loadingStatus.value = true;
  store.commit("clouddisk/SET_FILE_LIST", []);
  const token = shareInfo.value.sessionToken;
  getShareFileList({ token, parent_id }).then((res) => {
    store.commit("clouddisk/SET_FILE_LIST", res.data?.list || []);
    loadingStatus.value = false;
  })
  .catch((err) => {
    loadingStatus.value = false;
  });
}

// 获取分享详情
function getShareFileDetails() {
  loadingStatus.value = true
  store.commit("clouddisk/SET_FILE_TYPE", '');
  store.commit("clouddisk/SET_FILE_DETAIL", {});
  const params = ({
    id: fileId.value,
    token: shareInfo.value?.sessionToken
  })
  getFileOrFolderDetails(params).then(res => {
    loadingStatus.value = false
    const data = res.data
    data.metaData = JSON.parse(data.metaData)
    store.commit("clouddisk/SET_FILE_DETAIL", data);
    store.commit("clouddisk/SET_FILE_TYPE", data.fileCat);
  }).catch(() => {
    loadingStatus.value = false
  })
}

// 重命名提交
const handleRename = (data) => {
  loadingStatus.value = true
  rename({id: data.id, name: data.name}).then(res => {
    ElMessage.success('重命名成功')
    try {
      store.dispatch("clouddisk/getCloudFileDetail",{id: data.id}).then(res => {
        loadingStatus.value = false
      })
    } catch (error) {
      loadingStatus.value = false
    }
  })
}

const shareShow = ref(false)
const shareInfoShow = ref(false)
const shareData = ref([])
function handleShare(data) {
  if(!Array.isArray(data)){
    data = [data]
  }
  shareData.value = [{id: fileDetail.value.id, name: fileDetail.value.name}]
  shareShow.value = true
}

function shareClose() {
  shareShow.value = false
}

const createdShareInfo = ref({})
// 创建分享成功
const shareSuccess = (data) => {
  createdShareInfo.value = data
  shareShow.value = false
  shareInfoShow.value = true
}

// 分享信息关闭
const shareInfoClose = () => {
  shareInfoShow.value = false
}

// tcPlayer 初始化
const videoWidth = ref(0)
const videoHeight = ref(0)
function handlePlayerInit($event){
  playerDuration.value = $event.duration();
  signList.value = fileDetail.value.sign?.list || []
  clarity.value = signList.value[0]?.name || ''
  videoWidth.value = $event.videoWidth();
  videoHeight.value = $event.videoHeight();
  elObserver()
}

const observer = ref(null)
function elObserver() { 
  const element = document.getElementById('player-box') || window;
  observer.value = new ResizeObserver(() => {
    if ((fileType.value === 'video')) {
      setTimeout(() => {
        getPlayerWH();
      }, 20);
    }
  },);
  observer.value.observe(element); // 监听元素
}

// // 音频初始化
// function audioInit($e) {
//   this.playerDuration =  $e.duration()
//   const audioBox = document.getElementsByClassName('audio-content')[0];
//   this.cwidth = audioBox.clientWidth
//   this.cheight = audioBox.clientHeight
//   this.elObserver()
// }

// 播放进度
const childRef = ref()
function playPerChange(per){
  childRef.value.playPerChange(per)
}

const spriteStyle = reactive({}) // 雪碧图
function handleMouseMove(e) {
  if (fileCat.value !== 'video') return;
  const spriteImageInfo = JSON.parse(fileDetail.value?.spriteImageInfo || '{}');
  const imageWidth = spriteImageInfo?.width || 228; //雪碧图每一帧的宽度
  const imageHeight = spriteImageInfo?.height || 128; //雪碧图每一帧的高度
  const totalCount = spriteImageInfo?.totalCount || 100; //有效雪碧图总数
  const clientX = e.clientX;
  const offsetWidth = document.getElementsByClassName('slider__runway')[0].clientWidth;
  const p = clientX / offsetWidth;
  const spriteY = 100/(imageWidth/imageHeight) * Math.round( p * (totalCount/100) * 100)
  spriteStyle['background-image'] = `url(${fileDetail.value.spriteImage})`;
  spriteStyle['display'] = 'block'
  spriteStyle['background-position-y'] = '-' + String(spriteY) + 'px'
  spriteStyle['left'] = 'calc('+ p * 100 + '% - 50px)'
  if (clientX < 56) {
    spriteStyle['left'] = '0'
  }
  if ((offsetWidth - clientX) < 56) {
    spriteStyle['left'] = offsetWidth - 100 + 'px'
  }
}

const runwayMouse = ref(false)
function handleMouseleave() {
  runwayMouse.value = false
  spriteStyle['display'] = 'none'
}

// 播放/暂停
function playPause() {
  childRef.value.playPause()
}

function handlePlayPause(val) {
  isPlay.value = val
}

function handleTimeupdate() {
  onPlayTime.value = childRef.value.player.currentTime()
  let percent = onPlayTime.value / playerDuration.value
  onPlayPercent.value = percent * 100;
}

// 前进后退
function currentTimeChange(legth) {
  childRef.value.currentTimeChange(legth);
}

// 点击音量
const storeVolume = ref(null)
const handleVolume = () => {
	if (!storeVolume.value) {
		storeVolume.value = playerVolume.value
		playerVolume.value = 0
	} else {
		playerVolume.value = storeVolume.value
		storeVolume.value = null
	}
  if (childRef.value.player !== null) {
    childRef.value.player.volume(playerVolume.value / 100)
  }
}

// 音量改变
const volumeChange = () => {
  storeVolume.value = null
  if (childRef.value.player !== null) {
    childRef.value.player.volume(playerVolume.value / 100)
  }
}

const { proxy } = getCurrentInstance()
async function handleDown() {
  if (!getToken()) {
    proxy.$loginDialog.open({ onSuccess: detailInit})
    return
  }
  const list = [{
    id: fileDetail.value.id,
    filename: fileDetail.value.name
  }]
  let result = {}
  if (shareToken.value) {
    const params = {
      token: shareInfo.value?.sessionToken,
      list
    }
    result = await getShareFileDownloadUrl(params)
  } else {
    result = await getFileDownloadUrl(list)
  }
  download(result.data[0].downloadUrl)
}

const showInfo = ref(true)
function handleShowInfo() {
  showInfo.value = !showInfo.value
  if (fileCat.value === 'image') {
    setTimeout(() => {
      childRef.value.setImgWhAndMap()
    }, 0);
  }
  if (fileCat.value === 'audio' && fileDetail.value.audioWave) {
    setTimeout(() => {
      childRef.value.onresizeDrawWave()
    }, 0);
  }
}

const playerWidth = ref(0)
const playerHeight = ref(0)
function getPlayerWH() {
  if (!['audio','video'].includes(fileCat.value)) return;
  const xgBox = document.getElementById('player-box');
  
  const xgWidth = xgBox.clientWidth || 0;
  const xgHeight = xgBox.clientHeight || 0;
  const p1 = videoWidth.value / videoHeight.value
  const p2 = xgWidth / xgHeight;
  if (p2 > p1) {
    playerHeight.value = xgHeight * 0.9;
    playerWidth.value = xgHeight * 0.9 * p1;
  }
  if (p1 > p2) {
    playerWidth.value = xgWidth * 0.94;
    playerHeight.value = xgWidth * 0.94 / p1;
  }
}


// 是否循环播放
const isLoop = ref(false)
function handleLoopPlay() {
  isLoop.value = !isLoop.value
}

// 播放结束
function handlePlayEnded() {
  if (isLoop.value) {
    childRef.value.player.play();
  }
}
// 倍速改变
const playbackRate = ref('1.0')
function playbackRateChange(val) {
  playbackRate.value = val;
  childRef.value.player.playbackRate(playbackRate.value)
}

const clarity = ref('')
const clarityCurrentTime = ref(0)
function playClarityChange(e) {
  if (clarity.value === e.name) return;
  clarityCurrentTime.value = childRef.value.player.currentTime()
  clarity.value = e.name
  childRef.value.player.src(e.key)
}

function clarityFormat(name) {
  let str = name
  if (name === 'original') {
    str = '原画质'
  }
  return str
}

function handleProgressSuccess() {
  clarityCurrentTime.value = 0
}

function handleFileClick(item) {
  if (isPlay.value) {
    isPlay.value = false
    playPause()
  }

  const query = {
    fileCat: item.fileCat
  }
  if (shareToken.value) {
    query.shareToken = shareToken.value
  }
  router.replace({ path: '/clouddisk/detail/' + item.id, query });
}

function handleGoBack() {
  if (shareToken.value) {
    const bds = store.state.clouddisk.shareBreadcrumbs || []
    if (bds.length > 0) {
      history.back()
    } else {
      router.push({ path: '/fileSharePage', query: {token: shareToken.value} });
    }
  } else {
    history.back()
  }
}

function handlePrevious() {
  const fileIndex = fileList.value.findIndex(el => el.id === fileDetail.value.id)
  if (fileIndex === 0) {
    ElMessage.warning('已经是第一个文件')
    return
  }
  if (fileIndex !== -1) {
    handleFileClick(fileList.value[fileIndex - 1])
  }
}

function handleNext() {
  const fileIndex = fileList.value.findIndex(el => el.id === fileDetail.value.id)
  if (fileIndex === fileList.value.length - 1) {
    ElMessage.warning('已经是最后一个文件')
    return
  }
  if (fileIndex !== -1) {
    handleFileClick(fileList.value[fileIndex + 1])
  }
}

</script>
<style scoped lang="scss">
  @import "./style.scss";
</style>
<style lang="scss">
.tooltip-clarity-box {
  padding: 10px 0;
  .clarity-tooltip {
    min-width: 90px;
    .clarity-item{
      height: 30px;
      padding: 0 6px 0 10px;
      font-size: 12px;
      color: #9D9DA1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon-check{
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: 100%;
        background-image: url("@/assets/icons/clouddisk/icon_gouxuan@2x.png");
      }
    }
  }
  .el-popper__arrow {
    display: none;
  }
}

.tooltip-rate-box {
  padding: 10px 0;
  .backrate-tooltip {
    min-width: 90px;
    .backrate-item{
      height: 30px;
      padding: 0 6px 0 10px;
      font-size: 12px;
      color: #9D9DA1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .icon-check{
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: 100%;
        background-image: url("@/assets/icons/clouddisk/icon_gouxuan@2x.png");
      }
    }
  }
  .el-popper__arrow {
    display: none;
  }
}

.tooltip-volume-box {
  padding: 14px 0;
  .el-slider {
    --el-slider-main-bg-color: #0459FF;
    .el-slider__runway {
      margin: 0 12px;
    }
  }
  .el-slider__button {
    width: 12px;
    height: 12px;
    border: solid 2px #0459FF;
  }
  .el-popper__arrow {
    display: none;
  }
}
</style>