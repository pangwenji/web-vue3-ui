<template>
  <div
    style="width:100%;height:100%;"
    v-loading="loadingStatus"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="panel-body">
      <FileTop
        v-show="isFullScreen"
        ref="fileTopRef"
        @showFileList="showFileList"
        @onPrevent="handlePrevent"
        @onVersionChange="handleVersionChange"
        @needLogin="$loginDialog.open({ onSuccess: handleLoginSuccess});"
        :isFileList="isFileList"
        :clientWidth="clientWidth"
        :fileType="fileType"
        :fileAnti="fileAnti"
        :isWps="isWps"
        :fileId="fileId"
        :projectAnti="projectAnti"
        :isShare="shareToken?true:false"
        :shareDetail="shareInfo"
        :codingStatus="codingStatus"
      ></FileTop>
        <div
          v-if="codingStatus === 2"
          class="file-container"
          :style="{height: clientHeight-61 + 'px'}"
        >
          <transition name="fade">
            <div v-show="isFileList" style="z-index: 2;">
              <FileLeft
                :fileList="fileList"
                @onRefresh="handleRefresh"
                @onFileChange="handleFileChange"
              ></FileLeft>
            </div>
          </transition>
          <div v-if="!isWps" class="container-left" style="z-index:2;">
            <div id="full-box" :style="{width: !isFullScreen?'100%!important':'', height:!isFullScreen?'100%!important':''}">
              <div v-if="isSupport" style="width:100%;height:100%;">
                <div
                  style="position:relative;"
                  :style="{height: clientHeight-(!isFullScreen?(fileType==='image'?0:90):(fileType==='image'?214:284)) + 'px'}"
                  @mouseover="showSwitchBtn = true"
                  @mouseleave="showSwitchBtn = false"
                >
                  <VideoRemark
                    v-if="fileType === 'video' && isSupport"
                    ref="childRef"
                    :playerWidth="playerWidth"
                    :playerHeight="playerHeight"
                    :clarity="clarity"
                    :clarityCurrentTime="clarityCurrentTime"
                    @tcPlayerInit="tcPlayerInit"
                    @onPlay="handlePlay"
                    @onTimeupdate="handleTimeupdate"
                    @onEnded="handlePlayEnded"
                    @onPlayerClick="handlePlayerClick"
                    @progressSuccess="handleProgressSuccess"
                  >
                    <template v-slot:draw>
                      <div class="canvas-box" :style="canvasStyle">
                        <fabric-draw
                          v-if="playerWidth"
                          ref="fabricRef"
                          :fabColor="colorSelect"
                          :cwidth="playerWidth*1"
                          :cheight="playerHeight*1"
                          :dwidth="dwidth*1"
                        ></fabric-draw>
                      </div>
                    </template>
                    <template v-slot:prevent>
                      <div v-if="isPrevent" class="prevent-screencap" :style="preventStyle">
                        <span>{{preventText}}</span>
                      </div>
                    </template>
                  </VideoRemark>
                  <AudioRemark
                    v-if="fileType === 'audio' && isSupport"
                    ref="childRef"
                    @audioInit="audioInit"
                    @onPlay="handlePlay"
                    @onTimeupdate="handleTimeupdate"
                    @onPlayPercent="handlePlayPercent"
                    @onEnded="handlePlayEnded"
                    @onWHChange="handleWHChange"
                    @onPlayerClick="handlePlayerClick"
                  >
                    <div class="canvas-box" :style="{'z-index':!isDrawing?'0':'105', ...canvasStyle}">
                      <fabric-draw
                        v-if="cwidth"
                        ref="fabricRef"
                        :fabColor="colorSelect"
                        :cwidth="cwidth*1"
                        :cheight="cheight*1"
                        :dwidth="dwidth*1"
                      ></fabric-draw>
                    </div>
                  </AudioRemark>
                  <imageRemark
                    v-if="['image', 'JPG', 'PNG', 'JPEG', 'GIF', 'BMP'].includes(fileType) && isSupport"
                    ref="childRef"
                    @fullScreen="fullScreenFun"
                    :isFullScreen="isFullScreen"
                    :fileDetail="fileDetail"
                    @onWHChange="handleWHChange"
                    @onMouseover="handleImgMouseover"
                  >
                    <div class="canvas-box" :style="{'pointer-events':!isDrawing?'none':'auto'}">
                      <FabricDraw
                        v-if="cwidth"
                        ref="fabricRef"
                        :fabColor="colorSelect"
                        :cwidth="cwidth*1"
                        :cheight="cheight*1"
                        :dwidth="dwidth*1"
                      ></FabricDraw>
                    </div>
                  </imageRemark>
                  <PreviewSwitch
                    v-show="showSwitchBtn"
                    :style="{bottom: fileDetail.fileCat === 'image' ? '70px' : 0}"
                    @onPrevious="handlePrevious"
                    @onNext="handleNext">
                  </PreviewSwitch>
                </div>

                <div v-if="fileType === 'audio' || fileType === 'video'" class="slider__runway" :class="{'runway-mouseenter':runwayMouse}">
                  <div
                    v-if="fileType === 'video'"
                    class="video-sprite"
                    :style="spriteStyle" >
                  </div>
                  <div
                    style="position: absolute;width:100%;height:100%;z-index:500;top:0;"
                    @mousemove="handleMouseMove"
                    @mouseenter="runwayMouse = true"
                    @mouseleave="handleMouseleave"
                  >
                    <el-slider
                      :show-tooltip="false"
                      v-model="onPlayPercent"
                      @change="playPerChange"
                    >
                    </el-slider>
                  </div>
                </div>

                <div class="time-choose" v-if="fileType === 'video' || fileType === 'audio'">
                  <div class="indicatorGuide" v-if="isShowCheckTime">
                    <el-slider
                      v-show="showChooseTime"
                      v-model="chooseTime"
                      range
                      @change="chooseTimeChange"
                      :format-tooltip="formatSlider"
                      :max="playerDuration">
                    </el-slider>
                  </div>
                  <!-- <div v-show="isFullScreen" class="time-tag-content" :style="{'pointer-events': showChooseTime ? 'none' : 'auto'}"> -->
                  <div v-if="commentList.length > 0 && isFullScreen && playerDuration > 0" class="time-tag-content">
                    <div v-for="(item, index) in commentList" :key="index">
                      <el-tooltip
                        effect="light"
                        placement="top"
                        popper-class="tooltip-comment-box"
                        :offset="4"
                      >
                        <template #content>
                          <div style="margin-top:14px;display:flex;justify-content: space-between;align-items: center;">
                            <div style="display:flex;align-items: center;">
                              <img style="display:block;width:24px;height:24px;border-radius: 50%;margin-right: 4px;" :src="item.user?.avatar" alt="" />
                              {{item.user?.nickName || item.userId}}
                            </div>
                            <div>
                              {{computedTime(item.createTime)}}
                            </div>
                          </div>
                          <div style="margin-top:14px;">
                            <span style="padding: 4px 8px;border-radius:3px;background: linear-gradient(42deg, #0459FF 0%, #0459FF 0%, #5726DD 100%);color:#ffffff;">
                              <span>{{secondToDate(item.startTime)}}</span>
                              <span v-if="item.endTime"> - {{ secondToDate(item.endTime) }}</span>
                            </span>
                          </div>
                          <div style="margin-top:14px;">{{item.content}}</div>
                          <div style="padding:14px 0;font-size:12px">{{item.children?.length || 0}} 条回复</div>
                        </template>
                        <div
                          class="time-tag-sect"
                          :class="{'activeTagSect': isActiveTag === item.id || isMouseTag === index}"
                          :style="{'margin-left': item.startTime/playerDuration*100+'%',width: (item.endTime-item.startTime)/playerDuration*100+'%'}"
                        >
                          <span v-if="item.startTime" class="time-tag-left" @click.prevent="clickItem(item,index)"  @mouseenter="lineMouseover(index)" @mouseleave="lineMouseleave">
                            <img :src="item.user?.avatar" alt="">
                          </span>
                          <span v-if="item.endTime" class="time-tag-line" @mouseenter="lineMouseover(index)" @mouseleave="lineMouseleave"></span>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <div class="play-box" v-if="fileCat === 'video' || fileCat === 'audio'">
                  <div class="play-box-left">
                    <el-tooltip
                      class="box-item"
                      effect="light"
                      :show-after="400"
                      :content="isPlay ? '暂停' : '播放'"
                      placement="top"
                    >
                      <div @click="playPause">
                        <i class="play-icon" :class="isPlay ? 'icon-pause' : 'icon-play'"></i>
                      </div>
                    </el-tooltip>
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
                    <!-- <el-tooltip
                      v-if="fileType === 'video'"
                      class="box-item"
                      effect="light"
                      content="上一帧"
                      placement="top"
                    >
                      <div @click="currentZhen(0)">
                        <i class="play-icon icon-prev"></i>
                      </div>
                    </el-tooltip> -->
                    <!-- <el-tooltip
                      v-if="fileType === 'video'"
                      class="box-item"
                      effect="light"
                      content="下一帧"
                      placement="top"
                    >
                      <div @click="currentZhen(1)">
                        <i class="play-icon icon-next"></i>
                      </div>
                    </el-tooltip> -->
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

                  <div class="time-format-box">
                    <el-tooltip
                        effect="light"
                        placement="top"
                        popper-class="tooltip-timecode-box"
                        :offset="4"
                      >
                        <template #content>
                          <div class="timecode-tooltip">
                            <div class="timecode-item" @click.stop="timeFormatChange('b')">
                              <span :style="{color: timeFormat === 'b'?'#0D0D15':''}">标准</span>
                              <i v-if="timeFormat === 'b'" class="icon-check"></i>
                            </div>
                            <div class="timecode-item" @click.stop="timeFormatChange('s')">
                              <span :style="{color: timeFormat === 's'?'#0D0D15':''}">时间码</span>
                              <i v-if="timeFormat === 's'" class="icon-check"></i>
                            </div>
                          </div>
                        </template>
                        <div style="display:flex;white-space:nowrap;">
                          <span v-if="timeFormat === 'b'" style="color:#C5C7D4;">{{secondToDate(onPlayTime)}} / <span style="color:#D0D4DE;opacity: .44;"> {{secondToDate(playerDuration)}}</span></span>
                          <span v-if="timeFormat === 's'" style="color:#C5C7D4;">{{timeCodeFormat(onPlayTime)}}</span>
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </div>
                      </el-tooltip>
                  </div>


                  <div class="play-box-right">

                    <!-- 清晰度切换 -->
                    <div class="backrate-box" v-if="signList.length > 0">
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
                              <span :style="{color: clarity === item.name?'#0D0D15':''}">{{clarityFormat(item.name)}}</span>
                              <i v-if="clarity === item.name" class="icon-check"></i>
                            </div>
                          </div>
                        </template>
                        <div style="display:flex;white-space:nowrap;">
                          <span style="min-width: 86px;text-align: center;height:32px;line-height:32px;padding:0 6px;">{{clarityFormat(clarity)}}</span>
                        </div>
                      </el-tooltip>
                    </div>

                    <!-- 倍速切换 -->
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
                            <span style="min-width: 86px;text-align: center;height:32px;line-height:32px;">倍速 {{playbackRate}}</span>
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

                    <el-tooltip
                      class="box-item"
                      effect="light"
                      :show-after="400"
                      content="全屏"
                      placement="top"
                    >
                      <div @click="fullScreenFun">
                        <i class="play-icon icon-full"></i>
                      </div>
                    </el-tooltip>
                  </div>
                  <!-- <div class="setting-box">
                  </div>
                  <div class="play-full-box">
                  </div> -->
                </div>

                <div v-show="showChooseTime" class="esc-tip">
                  <!-- <span @click="upEscape" v-if="commentFocus">取消批注 Esc</span> -->
                  <span @click="upEscape" v-if="!commentFocus && workTime.length>0">取消选中时间 Esc</span>
                </div>
              </div>
              <div
                v-else
                style="position:relative;"
                :style="{height: clientHeight-(!isFullScreen?40:234) + 'px'}"
                @mouseover="showSwitchBtn = true"
                @mouseleave="showSwitchBtn = false"
              >
                <FileNotSupport :fileSuffix="fileDetail.suffix">
                </FileNotSupport>
                <PreviewSwitch
                  v-show="showSwitchBtn"
                  style="bottom:52px;"
                  @onPrevious="handlePrevious"
                  @onNext="handleNext">
                </PreviewSwitch>

                <div class="play-box">
                  <div class="play-box-left">
                  </div>
                  <div class="play-box-right">
                    <el-tooltip
                      class="box-item"
                      effect="light"
                      :show-after="400"
                      content="全屏"
                      placement="top"
                    >
                      <div @click="fullScreenFun">
                        <i class="play-icon icon-full"></i>
                      </div>
                    </el-tooltip>
                  </div>
                </div>

              </div>
            </div>
            <div class="annota-group" :class="{'group-active':commentFocus}" :style="{'display': !isFullScreen?'none':''}">
              <div v-if="fileType === 'video' || fileType === 'image' || fileType === 'audio'" class="draw-btn-group">
                <div
                  title="自由选择"
                  @click="drawTypeChange('')"
                >
                  <i class="draw-icon icon-mouse" :class="{ active: drawType == '' }"></i>
                </div>
                <div title="笔画" @click="drawTypeChange('pen')">
                  <i class="draw-icon icon-7" :class="{ active: drawType == 'pen' }"></i>
                </div>
                <div
                  title="画圆"
                  @click="drawTypeChange('ellipse')"
                >
                  <i class="draw-icon icon-3" :class="{ active: drawType == 'ellipse' }"></i>
                </div>
                <div
                  title="画矩形"
                  @click="drawTypeChange('rectangle')"
                >
                  <i class="draw-icon icon-4" :class="{ active: drawType == 'rectangle' }"></i>
                </div>
                <div
                  title="画箭头"
                  @click="drawTypeChange('arrow')"
                >
                  <i class="draw-icon icon-1" :class="{ active: drawType == 'arrow' }"></i>
                </div>
                <div
                  title="文本输入框"
                  @click="drawTypeChange('text')"
                >
                  <i class="draw-icon icon-2" :class="{ active: drawType == 'text' }"></i>
                </div>
                <div class="shader-wrapper">
                  <div class="shader-ball-wrapper pointer" @click="colorSelect('#f13e49')">
                    <div class="shader-ani" :class="{ ballActive: selectColor === '#f13e49' }" style="background:	#f13e49;"></div>
                    <div class="shader-ball" style="background: rgb(241, 62, 73);"></div>
                  </div>
                  <div class="shader-ball-wrapper pointer" @click="colorSelect('#ff9d3c')">
                    <div class="shader-ani" :class="{ ballActive: selectColor === '#ff9d3c' }" style="background: #ff9d3c;"></div>
                    <div class="shader-ball" style="background: rgb(255, 157, 60);"></div>
                  </div>
                  <div class="shader-ball-wrapper pointer" @click="colorSelect('#00bb6c')">
                    <div class="shader-ani" :class="{ ballActive: selectColor === '#00bb6c' }" style="background: #00bb6c;"></div>
                    <div class="shader-ball" style="background: rgb(0, 187, 108);"></div>
                  </div>
                  <div class="shader-ball-wrapper pointer" @click="colorSelect('#3468fe')">
                    <div class="shader-ani" :class="{ ballActive: selectColor === '#3468fe' }" style="background: #3468fe;"></div>
                    <div class="shader-ball" style="background: rgb(52, 104, 254);"></div>
                  </div>
                </div>
                <div
                  title="回退一步"
                  @click="drawTypeChange('fallback')"
                >
                  <i class="draw-icon icon-8"></i>
                </div>
                <div
                  title="前进一步"
                  @click="drawTypeChange('forward')"
                >
                  <i class="draw-icon icon-9"></i>
                </div>
                <div
                  title="全部清除"
                  @click="drawTypeChange('clear')"
                >
                  <i class="draw-icon icon-10"></i>
                </div>
              </div>

              <div v-if="fileCat === 'video' || fileCat === 'audio'" class="check-time-box">
                <el-tooltip
                  effect="light "
                  content="选取时间段"
                  placement="top"
                  :show-after="400"
                >
                <div>
                  <i class="time-icon"></i>
                  <span class="time">{{secondToDate(chooseTime[0] || 0)}}</span>
                  <span v-if="chooseTime[1] > chooseTime[0]" class="time">&nbsp-&nbsp{{secondToDate(chooseTime[1] || 0)}}</span>
                  <el-switch style="margin-left:8px;" v-model="isShowCheckTime" @change="handleShowCheckTime" />
                </div>
                </el-tooltip>
              </div>

              <div class="annota-cont">
                <SendReply
                  ref="sendReplyRef"
                  class="annota-input"
                  placeholder="请输入你的评审意见..."
                  location="top"
                  :textStyle="textStyle"
                  :eBoxStyle="{}"
                  :shareDetail="shareInfo"
                  :fileDetail="fileDetail"
                  :sendReplyStatus="sendReplyStatus"
                  @cancelReply="cancelReply(2)"
                  @sendReply="sendReplyFun($event)"
                  @focus="textFocus"
                  @blur="texBlur"
                ></SendReply>
              </div>
            </div>
          </div>
          <div v-if="!isWps" class="container-right" :style="{'display': (!isFullScreen || !showInfo)?'none':''}">
            <el-tabs class="top-tabs" v-model="activeRightTab">
              <el-tab-pane class="file-remark-tabs" label="审阅意见" name="opinion">
                <div>
                  <FileRemark
                    @clickItem="clickItem"
                    :isActiveTag="isActiveTag"
                    :fileType="fileType"
                    :isShare="shareToken?true:false"
                    :shareDetail="shareInfo"
                    :fileDetail="fileDetail"
                    @getStatusComment="getStatusComment"
                    @onCommentSort="handleCommentSort"
                    @addCommentSuccess="getCommentList"
                  ></FileRemark>
                </div>
              </el-tab-pane>

              <el-tab-pane class="file-info-tabs" label="文件信息" name="fileinfo">
                <el-scrollbar class="tag-scroll" :height="clientHeight - 115">
                  <FileInfo :isShare="shareToken?true:false"></FileInfo>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div v-if="isWps" class="wps-box">
            <iframe v-if="wpsUrl" :src="wpsUrl"></iframe>
          </div>

          <div v-show="isFullScreen && !isWps" class="hidden-info-box">
            <div v-if="showInfo" class="hidden" @click="handleShowInfo">
              <el-icon title="收起侧边栏" :size="18"><DArrowRight /></el-icon>
            </div>
            <div v-else class="show" @click="handleShowInfo">
              <el-icon title="展开侧边栏" :size="18" color="#fff"><DArrowLeft /></el-icon>
            </div>
          </div>
        </div>
        <div v-else-if="codingStatus === 1" v-loading="codingStatus === 1" element-loading-background="#0a0b0d" element-loading-text="转码中，请稍后再访问..." style="width:100%;height:100%;"></div>
        <div v-else class="coding-fail">转码失败，请联系管理员</div>

        <el-dialog v-if="dialogKeyboard" v-model="dialogKeyboard" title="键盘快捷键" width="60%" center top="40%">
          <p>dskdksdds</p>
          <p>dskdksdds</p>
          <img src="../../../assets/icons/play/setting.png" alt="">
          <img style="width:500px;height:300px" src="https://xinyue-public-new.oss-cn-hangzhou.aliyuncs.com/web_static_resources/keyboard-win.png" alt="快捷键">
          <p>dskdksdds</p>
          <p>dskdksdds</p>

          <!-- <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogKeyboard = false">Cancel</el-button>
              <el-button type="primary" @click="dialogKeyboard = false"
                >Confirm</el-button
              >
            </span>
          </template> -->
        </el-dialog>
    </div>
    <!-- <DownDeliver v-if="downDialog" @closeDown="downDialog = false"></DownDeliver> -->
    <!-- <AtDialog
		 v-if="showAtDialog"
		 :visible="showAtDialog"
		 :position="position"
		 :queryString="queryString"
		 @onPickUser="handlePickUser"
		 @onHide="handleHide"
    ></AtDialog> -->

  </div>
</template>

<script>
import {fabric} from 'fabric';
import FileRemark from './components/FileRemark/index.vue'
import FileInfo from './components/FileInfo/index.vue'
import VideoRemark from './components/VideoRemark/index.vue'
import AudioRemark from './components/AudioRemark/index.vue'
import imageRemark from './components/imageRemark/index.vue'
import { secondToDate, computedTime, timeCodeFormat } from "@/utils/tool";
import DownDeliver from './components/DownDeliver/index.vue'
import FabricDraw from './components/FabricDraw/index.vue'
import { ElMessage, ElLoading } from 'element-plus';
import { getFileList, getProjectDetails } from "@/api/project/project.js"
import {
  editWpsFile,
  setAntiScreenRecording,
  getFileShareInfo,
  getShareFileDetails,
  getShareFileList,
} from "@/api/project/files.js"
import {
  previewShareWpsFile,
  getShareComment,
  sharePostComment,
} from "@/api/project/share.js"
import FileTop from './components/FileTop'
import FileLeft from './components/FileLeft'
import FileNotSupport from './components/FileNotSupport'
// import AtDialog from '../AtDialog/index.vue'
import SendReply from "./components/SendReply/index.vue";
import { getToken, setToken } from '@/utils/auth'
import {downloadFile} from "@/utils/tool.js"
import { stubFalse } from 'lodash';
import { getVideoFrame } from "@/api/project/review.js"
import cache from '@/plugins/cache'
import PreviewSwitch from '@/components/PreviewSwitch'
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'






export default {
  name: "VideoPlay",
  components: {
    FileRemark,
    FileInfo,
    VideoRemark,
    AudioRemark,
    imageRemark,
    DownDeliver,
    FabricDraw,
    FileTop,
    FileLeft,
    FileNotSupport,
    SendReply,
    PreviewSwitch,
  },
  data() {
    return {
      selectColor: "#f13e49",
      textarea: "",
      lastJson: "",
      width: 700,
      height: 400,
      canvas: {},
      showMenu: false,
      drawType: null, //当前绘制图像的种类
      delectKlass: {},
      imgFile: {},
      imgTitle: '',
      imgSrc: '',
      player: null,
      isPlay: false,
      fps: '', // 帧率
      onPlayTime: 0, // 当前播放时间
      onPlayPercent: 0, // 播放百分比
      chooseTime: [0,0], // 当前选中时间
      showChooseTime: false, //是否显示选中事件
      workTime: [],
      playerDuration: 0, // 视频长度
      activeRightTab: 'opinion', // 右侧活动tab
      isActiveTag: null,
      isMouseTag: '',
      clientWidth: '',
      clientHeight: '',
      speedTab: 0, // 进度标记
      timeFormat: 'b', //显示时间格式
      playbackRate: '1.0', // 播放速度
      isLoop: false, // 是否循环
      dialogKeyboard: false,
      videoWidth: 0, // 视频分辨率的宽度
      videoHeight: 0, // 视频分辨率的高度
      playerWidth: 0,
      playerHeight: 0,
      canvasStyle: {},

      isFileList: false,
      fileIndex: 0,
      fileList: [],

      preventTimer: null,
      preventStyle: {
        top: '50%',
        left: 'calc(50% - 120px)',
        'font-size': '1.75rem'
      }, // 水印样式
      downDialog: false,
      isDrawing: false,
      isFullScreen: true, // 全屏
      spriteStyle: {}, // 雪碧图
      commentFocus: false,
      fileTypeList: ['video', 'audio', 'image', 'JPG', 'PNG', 'JPEG', 'GIF', 'BMP'],
      showAtDialog: false, //@用户
      position: {x: 0, y: 0}, // 弹窗显示位置
      queryString: '', // 搜索值
      textStyle: {
        width: '100%',
        // height: '64px',
        background: '#272830',
        border: 'none'
      },
      observer: null, //页面销毁
      isWps: false,
      wpsUrl: '',
      projectId: 0,
      fileId: 0,
      fileCat: '',
      loadingStatus: false,
      // projectAnti: false, // 项目开启防录屏
      // fileAnti: false, // 文件开启防录屏
      shareToken: '', //分享token
      showLogin: false, //登录弹窗
      shareInfo: {},
      clientToken: '', // 桌面端token
      platform: '', // 访问来源
      playerVolume: 100, // 音量
      storeVolume: null,
      commentStatus: '', // 评论状态
      commentOrderByColumn: 'create_time', // 评论排序字段
      commentAsc: 'desc', // 评论排序方式
      isShowCheckTime: true, // 是否展示选择时间段
      cwidth: 0,
      cheight: 0,
      runwayMouse: false,
      sendReplyStatus: false,
      CANVAS_WIDTH: 0,
      dwidth: 0,
      signList: [],
      clarity: '',
      clarityCurrentTime: 0,
      imgBase64: '',
      showInfo: true,
      showSwitchBtn: false, //显示切换按钮
    };
  },
  props: {
    msg: String,
  },
  watch: {
    drawType() {
      this.canvas.selection = !this.drawType;
    },
    width(val) {
      this.canvas.setWidth(this.width);
    },
    height() {
      // this.canvas.setHeight(this.height);
    },
    fileType(val, oldVal) {
      this.upEscape();
      this.onPlayPercent =  0
      if (val === oldVal) return;
      if (oldVal === 'video' && this.observer !== null) {
        this.observer.disconnect(); //移除监听
        this.observer = null;
      }
    },
    isFullScreen(val) {
      setTimeout(() => {
        this.clientHeight = document.body.clientHeight;
        this.upEscape();
      }, 20);
    },
    $route(to, from) {
      this.projectId = to.query.projectId*1 || 0
      this.fileId = to.query.id*1 || 0
      this.fileCat = to.query.fileCat || ''
    },
    // 防录屏
    isPrevent(value) {
      this.preventFun()
    }
  },
  created() {
    this.projectId = this.$route.query.projectId*1
    this.fileId = this.$route.query.id*1
    this.fileCat = this.$route.query.fileCat
    this.shareToken = this.$route.query.shareToken || ''
    this.clientToken = this.$route.query.token || ''
    this.platform = this.$route.query.platform || ''
    if (['doc', 'xls', 'ppt', 'pdf'].includes(this.fileCat)) {
      this.isWps = true
    }
  },
  mounted() {

    IM_EVENT_LISTERNER.addEventListenerIM('PROJECT', this.handleWatchProject);


    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.body.clientHeight;
    this.height = (this.clientHeight - 300) * 0.8;
    this.shareInfo = cache.session.getJSON('FILE_SHARE_INFO') || {}
    if (!this.shareToken && this.shareInfo) {
      this.shareInfo = {}
      cache.session.remove('FILE_SHARE_INFO')
    }
    // video视窗变化
    window.onresize = () => {
      setTimeout(() => {
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
      }, 20);
      setTimeout(() => {
        if (this.fileCat === 'audio') {
          this.$refs.childRef.setContentBox()
        } else if (this.fileCat === 'image') {
          this.$refs.childRef.setImgWhAndMap()
        }
      }, 100);
    }

    this.$nextTick(() => {
      document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
          this.upEscape();
        }
      })
    })
    // 监听页面全屏
    window.addEventListener("fullscreenchange", (e) => {
      this.isFullScreen = !this.isFullScreen
		})
    if (this.clientToken) {
      setToken(this.clientToken)
      this.$store.commit('SET_TOKEN', this.clientToken)
      this.detailInit()
    } else {
      // if (this.shareToken && !getToken()) {
      //   this.showLogin = true;
      // } else {
      this.detailInit()
      // }
    }

    document.onkeydown = (e) => {
      // 键盘 delect删除所选元素
      if (e.keyCode == 46) {
        this.handleDel()
      }
      // ctrl+z 删除最近添加的元素
      if (e.keyCode == 90 && e.ctrlKey) {
        this.handleCtrlZ()
      }
      // ctrl+y 恢复最近删除的元素
      if (e.keyCode == 89 && e.ctrlKey) {
        this.handleCtrlY()
      }
      // 空格播放暂停
      if (e.keyCode == 32) {
        if ((this.fileCat === 'video' || this.fileCat === 'audio') && this.playerDuration > 0 && !this.commentFocus) {
          this.playPause()
        }
      }
    };

		this.$store.commit('project/SET_ENTER', true);
  },
  unmounted() {
    this.pageDestroy = true;
    if (this.preventTimer !== null) {
      clearInterval(this.preventTimer)
      this.preventTimer = null;
    }
    this.$store.dispatch("file/setFileType", '');
    if (this.fileType === 'video' && this.observer !== null) {
      this.observer.disconnect(); //移除监听
      this.observer = null;
    }
    IM_EVENT_LISTERNER.removeEventListenerIM('PROJECT', this.handleWatchProject);
  },
  computed: {
    projectAnti() {
      if (this.fileCat === 'video' && this.$store.state.project.projectData.antiScreenRecording) {
        return true;
      }
      return false;
    },
    fileDetail() {
      return this.$store.state.file.fileDetail;
    },
    fileAnti() {
      let anti = false
      anti = this.$store.state.file.fileDetail.antiScreenRecording ? true : false
      if (!anti) {
        anti = this.$store.state.file.fileDetail.projectAntiScreenRecording ? true : false
      }
      return anti
    },
    isPrevent() {
      const valuePre =   this.projectAnti || this.fileAnti
      // if (valuePre) {
      //   this.preventFun()
      // }
      return valuePre;
    },
    preventText() {
      if (this.shareToken) {
        return this.shareInfo.user.nickName || this.shareInfo.user.userId
      } else {
        return this.$store.state.user?.nickName || this.$store.state.user?.phone;
      }

    },
    commentList() {
      return this.$store.state.file.commentList;
    },
    memberList() {
      return this.$store.state.file.memberList;
    },
    fileType() {
      return this.$store.state.file.fileType;
    },
    isSupport() {
      return this.fileTypeList.includes(this.fileCat)
    },
    codingStatus() {
      let status = 2
      if (this.$store.state.file.fileType === 'video' || this.$store.state.file.fileType === 'audio') {
        status = this.$store.state.file.fileDetail.sign?.codingStatus
      }
      return status
    },
    projectData() {
      return this.$store.state.project.projectData || {}
    }
  },
  methods: {
        // 监听IM订单通知回调
    handleWatchProject({noticeType,sourceData}){
        if(noticeType == 1){
            if(sourceData.file.fileId == this.$route.query.id){
              this.getCommentList()
            }
        }
    },
    uploadSuccess1(data = {}) {
      ElMessage.success('uploadSuccess')
      if (data) {
        attachmentList.push(data)
        uploadStatus.value = false
      }
      return data || ''
    },
    // 获取项目信息
    getProjectInfo() {
      getProjectDetails({id: this.projectId}).then(res => {
        // projectInfo.value = res.data
        this.$store.commit('project/SET_PROJECT_DATA', res.data);
      })
    },

    // 初始化
    detailInit() {
      if (this.shareToken) {
        this.getShareInfo()
      } else {
        if (this.isWps) {
          this.getEditWpsFile()
        } else {
          this.getCommentList();
          this.getMemberList(this.projectId)
        }
        this.getFileDetail(this.fileId).then(res => {
          this.getFileList(this.projectId, this.fileDetail.parentId);
        })
        this.getProjectInfo()
      }
    },

    // 获取WPS编辑页面URL
    getEditWpsFile() {
      const query = {
        fileId: this.fileId,
        projectId: this.projectId
      }
      editWpsFile(query).then(res => {
        this.wpsUrl = res.data.data.wpsUrl
      })
    },
    // 获取分享WPS预览页面URL
    getShareWpsFile() {
      this.loadingStatus = true
      const params = ({
        id: this.fileId,
        token: this.shareInfo?.sessionToken
      })
      previewShareWpsFile(params).then(res => {
        this.loadingStatus = false
        this.wpsUrl = res.data.data.wpsUrl
      }).catch(() => {
        this.loadingStatus = false
      })
    },

    // 获取分享信息
    getShareInfo() {
      this.loadingStatus = true
      if (this.shareInfo && this.shareInfo.token === this.shareToken) {
        if (this.shareInfo.sessionToken) {
          this.getShareDetails(true)
          this.getShareCommentList()
        }
        if (this.isWps) {
          this.getShareWpsFile()
        }
      } else {
        const params = {
          token: this.shareToken
        }
        getFileShareInfo(params).then(res => {
          this.loadingStatus = false
          this.shareInfo = res.data
          cache.session.setJSON('FILE_SHARE_INFO', res.data)
          if (this.shareInfo.passwordLock === 1 && !this.shareInfo.sessionToken) {
            // 需要密码访问
            this.$router.replace({ path: "/sharePage", query:{token: this.shareToken}});
          }
          if (this.shareInfo.sessionToken) {
            this.getShareDetails(true)
            this.getShareCommentList()
          }
          if (this.isWps) {
            this.getShareWpsFile()
          }
        }).catch(() => {
          this.loadingStatus = false
        })
      }
    },

    // 获取分享的文件列表
    getShareList(){
      this.loadingStatus = true
      getShareFileList({token: this.shareInfo?.sessionToken, parent_id: this.fileDetail.parentId}).then(res=>{
        const list = []
        res.data.list.forEach(el => {
          if (el.type === 2) {
            list.push(el)
          }
        });
        this.fileList = list
        this.loadingStatus = false
      }).catch(err=>{
        this.loadingStatus = false
      })
    },

    // 获取分享详情
    getShareDetails(getList = false) {
      this.loadingStatus = true
      this.$store.commit("file/SET_FILE_TYPE", '');
      const params = ({
        id: this.fileId,
        token: this.shareInfo?.sessionToken
      })
      getShareFileDetails(params).then(res => {
        this.loadingStatus = false
        this.$store.commit("file/SET_FILE_DETAIL", res.data);
        this.$store.commit("file/SET_FILE_TYPE", res.data.fileCat);
        if (getList) {
          this.getShareList()
        }
      }).catch(() => {
        this.loadingStatus = false
      })
    },
    // 获取分享文件评论列表
    getShareCommentList() {
      const params = ({
        file_id: this.fileId,
        token: this.shareInfo?.sessionToken,
        status: this.commentStatus,
        orderByColumn: this.commentOrderByColumn,
        isAsc: this.commentAsc,
        pageSize: 10000,
      })
      getShareComment(params).then(res => {
        this.$store.commit("file/SET_COMMENT_LIST", res.rows);
      })
    },

    // 获取文件列表
    getFileList(project_id, parent_id) {
      this.fileList = [];
      getFileList({project_id, parent_id}).then(res => {
        this.fileList = res.data;
      })
    },
    // 刷新文件列表
    handleRefresh(data) {
      this.getFileList(data.projectId, data.parentId);
    },
    // 获取文件详情
    async getFileDetail(id) {
      this.loadingStatus = true
      this.$store.commit("file/SET_FILE_TYPE", '');
      await this.$store.dispatch("file/getProjectFileDetail",{id}).then(res => {
        this.loadingStatus = false
      })
    },
    // 获取评论列表
    getCommentList() {
      const params = {
        file_id: this.fileId,
        status: this.commentStatus,
        orderByColumn: this.commentOrderByColumn,
        isAsc: this.commentAsc,
        pageSize: 10000,
      }
      this.$store.dispatch("file/getFileCommentList", params);
    },
    // 获取项目成员列表
    getMemberList(id) {
      this.$store.dispatch("file/getMemberList",{id});
    },
    elObserver() {
      const element = document.getElementById('xgplayer') || '';
      this.observer = new ResizeObserver(() => {
        if ((this.fileType === 'video' || this.fileType === 'audio') && !this.downDialog) {
          this.getPlayerWH();
        }
      },);
      this.observer.observe(element); // 监听元素
    },
    getPlayerWH() {
      this.height = (this.clientHeight - 300) * 0.8;
      let xgBox = null
      if (this.fileCat === 'audio') {
        xgBox = document.getElementById('ontent-box');
      } else {
        xgBox = document.getElementById('xgplayer');
      }

      const xgWidth = xgBox.clientWidth;
      const xgHeight = xgBox.clientHeight;
      const p1 = this.videoWidth / this.videoHeight;
      const p2 = xgWidth / xgHeight;
      if (p2 > p1) {
        this.playerHeight = xgHeight;
        this.playerWidth = xgHeight * p1;
      }
      if (p1 > p2) {
        this.playerWidth = xgWidth;
        this.playerHeight = xgWidth / p1;
      }

      if (!this.CANVAS_WIDTH) {
        this.CANVAS_WIDTH = this.playerWidth
      }
      // this.canvasStyle = {
      //   width: this.playerWidth + 'px!important',
      //   height: this.playerHeight + 'px!important'
      // }
    },
    // tcPlayer 初始化
    tcPlayerInit($event){
      this.playerDuration = $event.duration();
      this.videoWidth = $event.videoWidth();
      this.videoHeight = $event.videoHeight();
      this.cwidth = this.fileDetail.metaData.Width
      this.cheight = this.fileDetail.metaData.Height
      this.signList = this.fileDetail.sign?.list || []
      this.clarity = this.signList[0]?.name || ''
      this.elObserver()
    },
    // 音频初始化
    audioInit($e) {
      this.playerDuration =  $e.duration()
      const audioBox = document.getElementById('ontent-box');
      this.cwidth = audioBox.clientWidth
      this.cheight = audioBox.clientHeight
      this.elObserver()
    },
    // 播放/暂停
    playPause() {
      this.$refs.childRef.playPause();
      if ((this.fileType === 'video' || this.fileType === 'audio') && this.workTime.length === 0) {
        this.$refs.fabricRef.canvas.clear();
        this.isActiveTag = null;
        this.chooseTime = [];
        this.drawType = null;
        this.$refs.fabricRef.drawTypeChange(null);
        this.isDrawing = false;
      }
    },
    handlePlay(val) {
      this.isPlay = val;
      if (this.preventTimer) {
        clearInterval(this.preventTimer);
        this.preventTimer = null;
      }
      this.preventFun()
    },
    handleTimeupdate() {
      const currTime = this.$refs.childRef.player.currentTime();
      const needCurr = this.workTime.length > 0 && (this.workTime[1] - this.workTime[0] > 1) && (currTime > this.workTime[1] || currTime < this.workTime[0]);
      if (needCurr) {
        this.$refs.childRef.player.currentTime(this.workTime[0])
      }
      if (this.chooseTime.length === 0 || (this.chooseTime[1] - this.chooseTime[0]) <= 1) {
        this.chooseTime = [currTime, currTime];
      }
      this.onPlayTime = currTime;
      let percent = this.onPlayTime / this.playerDuration;
      this.onPlayPercent = percent * 100;
    },
    // 当前播放时间点
    currentTimeChange(legth) {
      this.$refs.childRef.currentTimeChange(legth);
      // this.player.currentTime(this.player.currentTime() + (legth * 1));
    },

    currentZhen(val) {
      this.$refs.childRef.currentZhen(val);
    },
    loopChange(val){
      this.isLoop = val;
      this.player.loop = val;
    },
    // 全屏
    fullScreenFun(el) {
      // this.clientToken
      if (this.clientToken) {
        this.isFullScreen = !this.isFullScreen
        this.isFileList = false
        if (this.fileCat === 'audio' && this.codingStatus === 2) {
          setTimeout(() => {
            this.$refs.childRef.onresizeDrawWave()
          }, 100);
        }
        return;
      }
			const element = document.getElementById('full-box');//指定全屏区域元素
      if (this.isFullScreen) {
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
      // this.isFullScreen = !this.isFullScreen
    },
    // 旋转
    rotatePlayer(e) {
      this.player.rotate(true, true, 1);
    },
    showKeyboard(){
      // this.dialogKeyboard = !this.dialogKeyboard;
      this.$confirm(
        '<img width="400" src="https://xinyue-public-new.oss-cn-hangzhou.aliyuncs.com/web_static_resources/keyboard-win.png">',
        '键盘快捷键',
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          showCancelButton: false,
        }
      )

    },
    // 播放进度
    playPerChange(per){
      if (this.workTime.length === 0) {
        this.isActiveTag = null;
        // this.chooseTime = [];
      }
      if (this.fileType === 'video' && this.workTime.length === 0) {
        this.$refs.fabricRef.handleAction('clear');
      }
      this.$refs.childRef.playPerChange(per);
    },
    handleMouseMove(e) {
      if (this.fileType !== 'video') return;
      const spriteImageInfo = JSON.parse(this.fileDetail?.spriteImageInfo || '{}');
      const imageWidth = spriteImageInfo?.width || 228; //雪碧图每一帧的宽度
      const imageHeight = spriteImageInfo?.height || 128; //雪碧图每一帧的高度
      const totalCount = spriteImageInfo?.totalCount || 100; //有效雪碧图总数
      const clientX = e.clientX;
      const offsetWidth = document.getElementsByClassName('slider__runway')[0].clientWidth;
      const p = clientX / offsetWidth;
      const spriteY = 100/(imageWidth/imageHeight) * Math.round( p * (totalCount/100) * 100)
      this.spriteStyle['background-image'] = `url(${this.fileDetail.spriteImage})`;
      this.spriteStyle['display'] = 'block'
      this.spriteStyle['background-position-y'] = '-' + String(spriteY) + 'px'
      this.spriteStyle['left'] = 'calc('+ p * 100 + '% - 50px)'
      if (clientX < 56) {
        this.spriteStyle['left'] = '0'
      }
      if ((offsetWidth - clientX) < 56) {
        this.spriteStyle['left'] = offsetWidth - 100 + 'px'
      }
    },
    handleMouseleave() {
      this.runwayMouse = false
      this.spriteStyle['display'] = 'none'
    },
    textFocus() {
      if (this.shareInfo?.allowComments === 0) {
        this.$refs.sendReplyRef.handleBlur()
        ElMessage.error('没有评论权限')
        return;
      }
      this.commentFocus = true;
      if (this.fileType === 'image') return;
      if (this.fileType === 'video' || this.fileType === 'audio') {
        this.$refs.childRef.player.pause();
      }
      this.showChooseTime = true;
      if (['video', 'audio'].includes(this.fileType) && (this.chooseTime.length === 0 || (this.chooseTime[1] - this.chooseTime[0]) <= 1)) {
        const currentTime = this.$refs.childRef.player.currentTime();
        this.chooseTime = [currentTime, currentTime];

      }
    },
    texBlur() {
      this.commentFocus = false;
      // this.showChooseTime = false;
    },
    chooseTimeChange(val, old) {
      if ((val[1] - val[0]) > 1) {
        this.workTime = val;
        this.chooseTime = val;
      } else {
        this.workTime = [val[0], val[0]];
        this.chooseTime = [val[0], val[0]];
      }
      if (this.fileType === 'video' || this.fileType === 'audio') {
        this.$refs.childRef.player.currentTime(val[0])
      }
    },
    lineMouseover(index) {
      this.isMouseTag = index;
    },
    lineMouseleave(){
      this.isMouseTag = '';
    },
    upEscape() {
      this.chooseTime = [this.chooseTime[0], this.chooseTime[0]];
      this.workTime = [];
      this.showChooseTime = false;
    },
    timeFormatChange(val) {
      this.timeFormat = val;
    },
    // 倍速改变
    // playbackRateChange33(val) {
    //   const Hls = window.Hls
    //   let video = document.getElementById('player-container-id2719_html5_api')
    //   let url = "http://1312415546.vod2.myqcloud.com/ea28598avodtranscq1312415546/199e96b7387702303850298278/voddrm.token.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9~eyJ0eXBlIjoiRHJtVG9rZW4iLCJhcHBJZCI6MTMxMjQxNTU0NiwiZmlsZUlkIjoiMzg3NzAyMzAzODUwMjk4Mjc4IiwiY3VycmVudFRpbWVTdGFtcCI6MCwiZXhwaXJlVGltZVN0YW1wIjoyMTQ3NDgzNjQ3LCJyYW5kb20iOjAsIm92ZXJsYXlLZXkiOiIiLCJvdmVybGF5SXYiOiIiLCJjaXBoZXJlZE92ZXJsYXlLZXkiOiIzMDVmYjhhYjE3NWI2MDJkNGFlYWVkZmQ4MWFkZjdiNDY5Y2ZiYjRiOGYwOGQ0ODJlZTBhMTE2NzhmYWIwMDI0N2U1ZTIzYTUzYzkyMTQ5YWQ4ZjgxYjlmODU3MjhjOGQ0YWVkMzA1MTAyYTllMmFjM2IwMGVjYjJkZjgxZjZmNjUxOTY3MTE1ZTE1OTk0YzljOWRiMTJmYjE4NGQ1MWIwZDcxODhlN2FhOTVkNzU0MmY4NmEyYTJmNzViNTE2NzlmZWEwYWIzMGJiYjY4ODAyZTU0MzhiNmM1MTEzZjVmZTY2ZmM0YjJlZDQyZjU0MDE1YjRlMGJiY2JmMzIyZjk5IiwiY2lwaGVyZWRPdmVybGF5SXYiOiIyMTQ0ZmQ3MzhmNGFlYzIyNDU2M2Q4YmRlY2FmMzM2MmZkM2Q5ZTdkOTFkZWFhZjI5YTNmNmNhNzAxMTY5ZTVhMTE5ZjI5NmY1MGM4MTA2MzY3NTIzZjAwMWQ0ZmVjNWNlODVmYmI0NDAwNDg2ZTdjZmYwYzA5NjQxYzU4MjMwY2UzY2Y0Y2NkOTdhNmExYzRkYThiMjIxYzk0ZmQ4ODExZjc0MjdkMWJjMGU2OTIyY2YwOTU4N2ZiNGU1MTE0NTA1OWI1MTVlYjIxMGNiYTM3MWFiMTU3OTA1NmFkOGQzMjFkMDdkOGFkOTM1MTNmYzM5N2QzZWRhOWIyNTVlMWQ5Iiwia2V5SWQiOjEsInN0cmljdE1vZGUiOjB9~HMaUJKDJZyeZWrOSVlMZQo8QPtozDopxYuogNhxxJMM.video_12_2.m3u8?sign=ff77e7113fa302a2a229b23e1b079d77&t=62f0fa11"
    //   if (Hls.isSupported()) {
    //     var hls = new Hls()
    //     hls.loadSource(url)
    //     hls.attachMedia(video)
    //     hls.on(Hls.Events.MANIFEST_PARSED, function () {
    //       video.play()
    //     })
    //   }
    // },
    // 倍速改变
    playbackRateChange(val) {
      this.playbackRate = val;
      this.$refs.childRef.player.playbackRate(this.playbackRate)
    },

    /**
     * 秒转时分秒格式
     *
     * @param {Object} result
     */
    secondToDate(result) {
      return secondToDate(result);
    },
    // 计算距离当前时间 传入时间戳
    computedTime(oldDate){
      return computedTime(oldDate);
    },
    timeCodeFormat(result) {
      return timeCodeFormat(result);
    },
    clickItem(item, index) {
      this.isDrawing = false
      this.drawType = null;
      this.workTime = [];
      this.chooseTime = [];
      this.showChooseTime = false;
      if (this.fileType === 'video' || this.fileType === 'audio') {
        this.$refs.childRef.clickItem(item, index);
        if (item.endTime !== '') {
          this.showChooseTime = true;
          this.chooseTime = [item.startTime*1, item.endTime*1]
          this.workTime = [item.startTime*1, item.endTime*1]
        }
      }
      if (this.isActiveTag === item.id) {
        this.isActiveTag = null;
        this.workTime = [];
        this.chooseTime = [];
        this.showChooseTime = false;
        this.dwidth = 0;
        if (this.fileType === 'video' || this.fileType === 'image' || this.fileType === 'audio') {
          this.$refs.fabricRef.canvas.clear();
        }
        return;
      }
      this.isActiveTag = item.id;
      if (this.fileType === 'video' || this.fileType === 'image' || this.fileType === 'audio') {
        // this.$refs.fabricRef.canvasLoadFromJSON(item.pathData)
        this.dwidth = JSON.parse(item.pathData).dwidth
        this.$refs.fabricRef.loadCanvas(item.pathData, this.dwidth)
        // this.$refs.fabricRef.loadFromJSON(item.pathData)
      }
    },
    // 视频截图
    videoScreenshots(replyData) {
      const params = {
        fileId: this.fileDetail.id,
        offset: this.$refs.childRef.player.currentTime()
      }
      getVideoFrame(params).then(res => {
        this.$refs.fabricRef.videoScreenshots(res.data.frameUrl, (e) => {
          this.imgBase64 = e
          this.sendReplyFun2(replyData);
        })
      }).catch(err => {
        console.log('视频截图失败:', err);
        this.sendReplyStatus = false
      })
    },
    // 发送回复
    async sendReplyFun(e) {
      if (!getToken()) {
        this.$loginDialog.open({ onSuccess: this.handleLoginSuccess});
        return
      }
      this.sendReplyStatus = true
      if (this.platform === 'mac' && this.fileType === 'video') {
        this.videoScreenshots(e)
      }else {
        if (this.fileType === 'video' || this.fileType === 'audio' || this.fileType === 'image') {
          this.imgBase64 = await this.$refs.childRef.screenshot()
        }
        this.sendReplyFun2(e)
      }
    },
    sendReplyFun2(e) {
      this.sendReplyStatus = true
      // 截图
      let base64 = this.imgBase64
      const params = {
        attachment: '', //附件
        content: e.content,  //评论
        fileId: this.fileDetail.id, //文件id
        screenshotBase64: base64, //截图base64数据
        attachmentId: e.attachmentId || [], // 附件id
      }
      if (this.fileType === 'video' || this.fileType === 'image' || this.fileType === 'audio') {
        // params.pathData =  JSON.stringify(this.$refs.fabricRef.canvas.toJSON());
        const cdata = this.$refs.fabricRef.canvas.toJSON();
        cdata.dwidth = this.CANVAS_WIDTH;
        params.pathData =  JSON.stringify(cdata);
      }

      if (this.fileType === 'video' || this.fileType === 'audio') {
        params.startTime = this.chooseTime[0]; //开始时间
        if (this.chooseTime[1] > 1 && this.chooseTime[1] > this.chooseTime[0]) {
          params.endTime = this.chooseTime[1]; //结束时
        }
      }

      if (this.shareToken) {
        params.token = this.shareInfo.sessionToken;
        sharePostComment(params).then(res => {
          const data = res.data
          data.attachmentInfo = e.attachmentArr
          const commentData = this.commentList
          commentData.unshift(data);
	        this.$store.commit('file/SET_COMMENT_LIST', commentData)

          if (this.fileType === 'video' || this.fileType === 'image' || this.fileType === 'audio') {
            this.$refs.fabricRef.canvas.clear();
          }
          if (e.attachmentId?.length > 0) {
            this.getShareCommentList()
          }
          this.sendReplyStatus = false
          this.textarea = "";
          this.isDrawing = false
          this.upEscape();
        }).catch(err => {
          this.sendReplyStatus = false
        })
      } else {
        params.remind = e.remind; //@用户id
        params.attachmentArr = e.attachmentArr || [];
        this.$store.dispatch("file/handleAddComment", {data:params}).then(res => {
          ElMessage({
            message: '意见发送成功',
            type: 'success',
          })
          if (this.fileType === 'video' || this.fileType === 'image' || this.fileType === 'audio') {
            this.$refs.fabricRef.canvas.clear();
          }
          // if (e.attachmentId?.length > 0) {
          //   this.getCommentList()
          // }
          this.getCommentList()
          this.sendReplyStatus = false
          this.textarea = "";
          this.isDrawing = false
          this.upEscape();
        }).catch(err => {
          this.sendReplyStatus = false
        });
      }
    },
    onRemarkFocus() {
      this.$refs.childRef.player.pause();
    },
    loadJson() {
      this.canvas.loadFromJSON(this.lastJson);
    },
    saveToJson() {
      this.lastJson = JSON.stringify(this.canvas);
      console.log(this.lastJson);
    },
    // 保存当前画布为png图片
    save() {
      var canvas = document.getElementById("canvas");
      var imgData = canvas.toDataURL("png");
      imgData = imgData.replace("image/png", "image/octet-stream");

      // 下载后的问题名，可自由指定
      var filename = "drawingboard_" + new Date().getTime() + "." + "png";
      this.saveFile(imgData, filename);
    },
    saveFile(data, filename) {
      var save_link = document.createElement("a");
      save_link.href = data;
      save_link.download = filename;

      var event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
    },
    uploadImg() {
      document.getElementById("imgInput").click();
    },
    // 从已渲染的DOM元素加载图片至canvas
    loadExpImg() {
      var imgElement = document.getElementById("expImg"); //声明我们的图片
      var imgInstance = new fabric.Image(imgElement, {
        selectable: false,
        // zIndex:-99,
      });
      this.canvas.add(imgInstance);
    },
    // 从文件加载图片至canvas
    uploadImgChange() {
      // 获取文件
      var eleImportInput = document.getElementById("imgInput");
      this.imgFile = eleImportInput.files[0];
      // 从reader中获取选择文件的src
      if (/\.(jpe?g|png|gif)$/i.test(this.imgFile.name)) {
        var reader = new FileReader();
        var _this = this;
        reader.addEventListener(
          "load",
          function () {
            _this.imgTitle = _this.imgFile.name;
            _this.imgSrc = this.result;
          },
          false
        );
        reader.readAsDataURL(this.imgFile);
      }
      var imgElement = document.getElementById("img"); //声明我们的图片

      imgElement.onload = () => {
        this.width = imgElement.width;
        this.height = imgElement.height;
        var imgInstance = new fabric.Image(imgElement, {
          zIndex: -1,
          selectable: false,
        });
        this.canvas.add(imgInstance);
      };
    },

    // 开始绘制时，指定绘画种类
    drawTypeChange(e) {
      this.dwidth = 0;
      this.$nextTick(() => {
        if (e !== 'fallback' && e !== 'forward' && this.drawType === e) {
          this.drawType = null;
          this.$refs.fabricRef.drawTypeChange(null);
          this.isDrawing = false;
          return;
        }
        this.isDrawing = true;
        this.drawType = e;
        this.$refs.fabricRef.drawTypeChange(e);
        if (this.fileType === 'video' || this.fileType === 'audio') {
          this.$refs.childRef.player.pause();
        }
        if (e === 'clear') {
          this.isDrawing = false;
          this.isActiveTag = null;
          this.drawType = null;
        }
        if (this.isActiveTag && ['pen','ellipse','rectangle','arrow','text'].includes(e)) {
          this.$refs.fabricRef.handleAction('clear');
          this.isActiveTag = null;
        }
      })
    },
    colorSelect(e) {
      this.isDrawing = true;
      this.selectColor = e
      this.$refs.fabricRef.colorSelect(e)
      if (this.fileType === 'video' || this.fileType === 'audio') {
        this.$refs.childRef.player.pause();
      }
    },
    showFileList() {
      this.isFileList = !this.isFileList;
      if (this.fileCat === 'audio' && this.codingStatus === 2) {
        setTimeout(() => {
          this.$refs.childRef.setContentBox()
        }, 260);
        setTimeout(() => {
          this.$refs.childRef.onresizeDrawWave()
        }, 280);
      }
      if (this.fileCat === 'image') {
        setTimeout(() => {
          this.$refs.childRef.setImgWhAndMap()
        }, 260);
      }
    },
    handlePrevent(val) {
      // this.fileAnti = val
      const params = {
        id: this.fileId,
        antiScreenRecording: val ? 1 : 0
      }
      setAntiScreenRecording(params).then(res => {
        const fdata = this.fileDetail
        fdata.antiScreenRecording = params.antiScreenRecording
	      this.$store.commit('file/SET_FILE_DETAIL', fdata)
        ElMessage({
          message: val?'开启防录屏成功':'关闭防录屏成功',
          type: 'success',
        })
      })
    },
    // 防录屏
    preventFun(val) {
      if (this.isPlay && this.isPrevent && this.fileCat === 'video' && this.preventTimer === null) {
        this.preventTimer = setInterval(() => {
          if (this.isPlay && this.fileCat === 'video') {
            const top = Math.round(Math.random()*(this.playerHeight-50));
            const left = Math.round(Math.random()*(this.playerWidth-240));
            this.preventStyle = {
              display: 'block',
              top: top+'px',
              left: left+'px',
            }
            if (this.playerWidth < this.playerHeight) {
              this.preventStyle['font-size'] = '18px'
            } else {
              this.preventStyle['font-size'] = '1.75rem';
            }
          }
        }, 3000)
      } else {
        clearInterval(this.preventTimer);
        this.preventTimer = null;
      }
    },
    // 取消回复
    cancelReply(type) {
    //   if (type === 1) replyIndex.value = null;
    //   if (type === 2) {
    //     replyIndex2.value = null
    //     replyIndex3.value = null
    //   }
    },
    // 进度改变
    handlePlayPercent(per) {
      this.onPlayPercent = per
    },
    // 版本切换
    handleVersionChange(item) {
      this.loadingStatus = true
      this.fileId = item.id
      this.fileCat = ''
      this.cwidth = 0
      this.cheight = 0
      this.CANVAS_WIDTH = 0
      this.dwidth = 0
      this.fileCat = item.fileCat
      this.$store.commit('file/SET_FILE_TYPE', '')
      this.isWps = ['doc','xls','ppt', 'pdf'].includes(item.fileCat)
      if (this.$refs.fabricRef) {
        this.$refs.fabricRef.drawTypeChange(null);
        this.drawType = null
      }
      if (this.shareToken) {
        if (this.isWps) {
          this.getShareWpsFile()
        } else {
          this.getShareCommentList();
        }
        this.getShareDetails();
        this.$router.replace({ path: "/file", query:{id: item.id, projectId: item.projectId, fileCat: item.fileCat,shareToken: this.shareToken} });
      } else {
        if (this.isWps) {
          this.getEditWpsFile()
        } else {
          this.getCommentList();
          this.getMemberList(item.projectId)
        }
        this.getFileDetail(item.id);
        this.$router.replace({ path: "/file", query:{id: item.id, projectId: item.projectId, fileCat: item.fileCat} });
      }

    },
    // 文件切换
    handleFileChange(item) {
      this.loadingStatus = true
      this.fileId = item.id
      this.fileCat = ''
      this.cwidth = 0
      this.cheight = 0
      this.CANVAS_WIDTH = 0
      this.dwidth = 0
      this.fileCat = item.fileCat
      this.isPlay = false
      this.isWps = ['doc','xls','ppt', 'pdf'].includes(item.fileCat)
      if (this.$refs.fabricRef) {
        this.$refs.fabricRef.drawTypeChange(null);
        this.drawType = null
      }
      if (this.shareToken) {
        if (this.isWps) {
          this.getShareWpsFile()
        } else {
          this.getShareCommentList();
        }
        this.getShareDetails();
        this.$refs.fileTopRef.getShareVersion(item.id)
        this.$router.replace({ path: "/file", query:{id: item.id, projectId: item.projectId, fileCat: item.fileCat,shareToken: this.shareToken} });
      } else {
        if (this.isWps) {
          this.getEditWpsFile()
        } else {
          this.getCommentList();
          this.getMemberList(item.projectId)
        }
        this.getFileDetail(item.id);
        this.$refs.fileTopRef.getVersionList(item.id)
        this.$router.replace({ path: "/file", query:{id: item.id, projectId: item.projectId, fileCat: item.fileCat} });
      }
    },
    handleLoginClose() {
      this.showLogin = false
    },
    handleLoginSuccess() {
      this.showLogin = false
      ElMessage.success('登录成功')
      this.detailInit()
    },
    // 循环播放
    handleLoopPlay() {
      this.isLoop = !this.isLoop
    },
    // 播放结束
    handlePlayEnded() {
      this.onPlayPercent = 100;
      if (this.isLoop) {
        this.$refs.childRef.playPause();
      }
    },
    // 点击音量
    handleVolume() {
      if (!this.storeVolume) {
        this.storeVolume = this.playerVolume
        this.playerVolume = 0
      } else {
        this.playerVolume = this.storeVolume
        this.storeVolume = null
      }
      if (this.$refs.childRef.player !== null) {
        this.$refs.childRef.player.volume(this.playerVolume / 100)
      }
    },

    // 音量改变
    volumeChange() {
      this.storeVolume = null
      if (this.$refs.childRef.player !== null) {
        this.$refs.childRef.player.volume(this.playerVolume / 100)
      }
    },
    // 批注状态筛选 0未完成 1已完成
    getStatusComment(status) {
      this.commentStatus = status===2?'':status
      if (this.shareInfo.sessionToken) {
        this.getShareCommentList()
      } else {
        this.getCommentList()
      }
    },
    // 批注排序
    handleCommentSort(sort) {
      this.commentOrderByColumn = sort.order
      this.commentAsc = sort.asc
      if (this.shareInfo.sessionToken) {
        this.getShareCommentList()
      } else {
        this.getCommentList()
      }
    },
    // 是否展示chenktime
    handleShowCheckTime(e) {
      if (!e) {
        // this.upEscape()
        this.workTime = []
        this.chooseTime = [this.chooseTime[0], this.chooseTime[0]]
      }
    },
    handleWHChange(data) {
      this.cwidth = data.cwidth
      this.cheight = data.cheight
      if (!this.CANVAS_WIDTH) {
        this.CANVAS_WIDTH = this.cwidth
      }
    },
    // ctrl+z
    handleCtrlZ() {
      if (this.isSupport && !this.commentFocus) {
			  this.$refs.fabricRef.handleAction('fallback')
      }
    },
		// ctrl+y
    handleCtrlY() {
      if (this.isSupport && !this.commentFocus) {
			  this.$refs.fabricRef.handleAction('forward')
      }
    },
    // del
    handleDel() {
      if (this.isSupport && !this.commentFocus) {
			  this.$refs.fabricRef.deleteObj()
      }
    },
    handlePlayerClick() {
      if (this.drawType === null) {
        this.playPause()
      }
    },
    playClarityChange(e) {
      if (this.clarity === e.name) return;
      this.clarityCurrentTime = this.$refs.childRef.player.currentTime()
      this.clarity = e.name
      this.$refs.childRef.player.src(e.key)
    },
    clarityFormat(name) {
      let str = name
      if (name === 'original') {
        str = '原画质'
      }
      return str
    },
    handleProgressSuccess() {
      this.clarityCurrentTime = 0
    },
    handleShowInfo() {
      this.showInfo = !this.showInfo
      setTimeout(() => {
        if (this.fileCat === 'audio') {
          this.$refs.childRef.setContentBox()
        } else if (this.fileCat === 'image') {
          this.$refs.childRef.setImgWhAndMap()
        }
      }, 10);
    },
    handleGoBack() {
      if (this.$route.query.shareToken) {
        this.$router.push({ path: '/sharePage', query: {token: this.$route.query.shareToken} });
      } else {
        this.$router.push({ path: `/project/index/${this.$route.query.projectId}/file`, query: {name: this.projectData.name} });
      }
    },
    handlePrevious() {
      const fileIndex = this.fileList.findIndex(el => el.id === this.fileDetail.id)
      if (fileIndex === 0) {
        ElMessage.warning('已经是第一个文件')
        return
      }
      if (fileIndex !== -1) {
        this.handleFileChange(this.fileList[fileIndex - 1])
      }
    },
    handleNext() {
      const fileIndex = this.fileList.findIndex(el => el.id === this.fileDetail.id)
      if (fileIndex === this.fileList.length - 1) {
        ElMessage.warning('已经是最后一个文件')
        return
      }
      if (fileIndex !== -1) {
        this.handleFileChange(this.fileList[fileIndex + 1])
      }
    },
    handleImgMouseover() {
      setTimeout(() => {
        this.showSwitchBtn = false
      }, 0);
    },
    formatSlider(val) {
      if (val % 1 !== 0) {
        val = val.toFixed(3)
      }
      return val
    }
  },
};
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
<style lang="scss">
.tooltip-comment-box {
  min-width: 200px;
  max-width: 300px;
  padding: 0 10px;
  .el-popper__arrow {
    display: none;
  }
}

.tooltip-timecode-box {
  padding: 10px 0;
  .timecode-tooltip {
    min-width: 110px;
    display: flex;
    flex-direction: column;
    .timecode-item{
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
