<template>
  <div class="panel-body">
    <div class="container-left">
      <div id="xgplayer"
        class="video-box"
        :style="{ width: width + 'px', height: height + 'px' }"
      >
        <div style="position: absolute;display: none;">
          <video id="player-container-id" width="500" preload="auto" playsinline webkit-playsinline></video>
        </div>
        <div  style="position: absolute; top: 0;">
          <canvas id="canvas" :width="width" :height="height"></canvas>
        </div>
      </div>
      <div class="slider__runway">
        <!-- <div
         ref="videoRunway"
          @mousemove="mousemovePer"
          style="position: absolute;top:0;width:100%;height:20px;background-color: red;flex:1; z-index:101;"
        >
          <div style="position: absolute;width:1px;height:20px;background-color: aqua;" :style="{'left': speedTab + '%'}"></div>
        </div> -->
        <div style="position: absolute;width:100%;z-index:100;top:0;">
          <el-slider
            v-model="onPlayPercent"
            @change="playPerChange"
          >
        </el-slider>
        </div>
      </div>
      <div class="time-choose">
        <div class="indicatorGuide">
          <el-slider
            v-show="showChooseTime"
            v-model="chooseTime"
            range
            @change="chooseTimeChange"
            :max="playerDuration">
          </el-slider>
        </div>
        <div class="time-tag-content" :style="{'pointer-events': showChooseTime ? 'none' : 'auto'}">
          <div v-for="(item, index) in tagList" :key="index">
            <el-popover placement="top" :width="200" trigger="hover">
              <template #default>
                <p>用户名 {{computedTime(item.sendTime)}}</p>
                <p v-if="item.currTimeType == '1'">{{ secondToDate(item.currTime[0]) }} - {{ secondToDate(item.currTime[1]) }}</p>
                <p v-else>{{ secondToDate(item.currTime) }}</p>
                <p>{{item.remark}}</p>
              </template>
              <template #reference>
                <div v-if="item.currTimeType == '1'" class="time-tag-sect" :class="{'activeTagSect': isActiveTag === index || isMouseTag === index}"  :style="{'margin-left': item.currTime[0]/playerDuration*100+'%',width: (item.currTime[1]-item.currTime[0])/playerDuration*100+'%'}">
                  <span class="time-tag-left" @click.prevent="clickItem(item,index)" style="z-index:110;"  @mouseenter="lineMouseover(index)" @mouseleave="lineMouseleave">赵</span>
                  <span class="time-tag-line" @mouseenter="lineMouseover(index)" @mouseleave="lineMouseleave"></span>
                </div>
                <div v-else class="time-tag-sect" :class="{'activeTagSect': isActiveTag === index || isMouseTag === index}" :style="{'margin-left': item.currTime/playerDuration*100 + '%'}">
                  <span class="time-tag-left" @click.prevent="clickItem(item,index)" style="z-index:110;" @mouseenter="lineMouseover(index)" @mouseleave="lineMouseleave">钱</span>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
        <div v-show="showChooseTime" class="esc-tip">
          <span @click="upEscape">取消批注 Esc</span>
        </div>
      </div>
      <div class="play-box">
        <div class="play-box-left">
          <el-tooltip
            class="box-item"
            effect="light"
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
            content="后退3秒"
            placement="top"
          >
            <div @click="currentTime(-3)">-3s</div>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            content="上一帧"
            placement="top"
          >
            <div @click="currentZhen(0)">
              <i class="play-icon icon-prev"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            content="下一帧"
            placement="top"
          >
            <div @click="currentZhen(1)">
              <i class="play-icon icon-next"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            content="前进3秒"
            placement="top"
          >
            <div @click="currentTime(3)">+3s</div>
          </el-tooltip>
        </div>

        <div class="time-format-box">
          <el-dropdown placement="top" @command="timeFormatChange">
            <span class="el-dropdown-link">
              <span v-if="timeFormat === 'z'">{{secondToDate(player?player.currentTime:'')}}/{{secondToDate(player?player.duration:'')}}</span>
              <span v-else-if="timeFormat === 's'">{{secondToDate(player?player.currentTime:'')}}/{{secondToDate(player?player.duration:'')}}</span>
              <span v-else>{{secondToDate(onPlayTime)}}/{{secondToDate(playerDuration)}}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="b">标准</el-dropdown-item>
                <el-dropdown-item command="z">帧</el-dropdown-item>
                <el-dropdown-item command="s">时间码</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        
        <div class="play-box-right">
          <el-dropdown placement="top" @command="playbackRateChange"  trigger="click">
            <span class="el-dropdown-link">
              倍速 {{playbackRate}}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="2.0">2.0</el-dropdown-item>
                <el-dropdown-item command="1.5">1.5</el-dropdown-item>
                <el-dropdown-item command="1.25">1.25</el-dropdown-item>
                <el-dropdown-item command="1.0">1.0</el-dropdown-item>
                <el-dropdown-item command="0.75">0.75</el-dropdown-item>
                <el-dropdown-item command="0.5">0.5</el-dropdown-item>
                <el-dropdown-item command="0.25">0.25</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-popover placement="top" :width="156" :teleported="false" trigger="hover">
            <div class="setting-content">
              <div>
                <i class="setting-icon icon-loop"></i>
                <span class="setting-title">循环播放</span>
                <el-switch v-model="isLoop" size="small" @change="loopChange" />
              </div>
              <div @click="rotatePlayer">
                <i class="setting-icon icon-rotate"></i>
                <span class="setting-title">旋转画面</span>
              </div>
              <div @click="showKeyboard">
                <i class="setting-icon icon-keyboard"></i>
                <span class="setting-title">键盘快捷键</span>
              </div>
            </div>
            <template #reference>
              <div><i class="play-icon icon-setting"></i></div>
            </template>
          </el-popover>
          <el-tooltip
            class="box-item"
            effect="light"
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

      <div class="annota-group">
        <div class="draw-btn-group">
          <div
            :class="{ active: drawType == '' }"
            title="自由选择"
            @click="drawTypeChange('')"
          >
            <i class="draw-icon icon-mouse"></i>
          </div>
          <div :class="{ active: drawType == 'pen' }" title="笔画" @click="drawTypeChange('pen')">
            <i class="draw-icon icon-7"></i>
          </div>
          <div
            :class="{ active: drawType == 'ellipse' }"
            title="画圆"
            @click="drawTypeChange('ellipse')"
          >
            <i class="draw-icon icon-3"></i>
          </div>
          <div
            :class="{ active: drawType == 'rectangle' }"
            title="画矩形"
            @click="drawTypeChange('rectangle')"
          >
            <i class="draw-icon icon-4"></i>
          </div>
          <div
            :class="{ active: drawType == 'arrow' }"
            title="画箭头"
            @click="drawTypeChange('arrow')"
          >
            <i class="draw-icon icon-1"></i>
          </div>
          <!-- <div
            :class="{ active: drawType == 'polygon' }"
            title="画多边形"
            @click="drawPolygon"
          >
            <i class="draw-icon icon-6"></i>
          </div> -->
          
          <div
            :class="{ active: drawType == 'text' }"
            title="文本输入框"
            @click="drawTypeChange('text')"
          >
            <i class="draw-icon icon-2"></i>
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
            :class="{ active: drawType == 'fallback' }"
            title="回退一步"
            @click="drawTypeChange('fallback')"
          >
            <i class="draw-icon icon-8"></i>
          </div>
          <div
            :class="{ active: drawType == 'forward' }"
            title="前进一步"
            @click="drawTypeChange('forward')"
          >
            <i class="draw-icon icon-9"></i>
          </div>
          <div
            :class="{ active: drawType == 'clear' }"
            title="全部清除"
            @click="drawTypeChange('clear')"
          >
            <i class="draw-icon icon-10"></i>
          </div>
          <div>
            <button @click="sendTag">发送</button>
          </div>
        </div>
        <div class="annota-cont">
          <textarea @click="textClick" @blue="texBlue" class="annota-input" placeholder="输入批注..." v-model="textarea">
          </textarea>
        </div>
      </div>
      <!-- <div style="padding: 10px 0">
        <el-input
          type="textarea"
          @focus="onRemarkFocus"
          :rows="2"
          style="margin-bottom: 10px"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
        <el-button @click="sendTag" type="primary">发 送</el-button>
      </div> -->
    </div>
    <div class="container-right">
      <el-tabs class="top-tabs" v-model="activeRightTab">
        <el-tab-pane class="file-remark-tabs" label="审阅意见" name="opinion">
          <el-scrollbar class="tag-scroll" :height="clientHeight - 110">
            <FileRemark :remarkList="tagList" @clickItem="clickItem" :isActiveTag="isActiveTag"></FileRemark>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane class="file-info-tabs" label="文件信息" name="fileinfo">
          <el-scrollbar class="tag-scroll" :height="clientHeight - 110">
            <FileInfo></FileInfo>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog v-model="dialogKeyboard" title="键盘快捷键" width="60%" center top="40%">
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
</template>

<script>
import {fabric} from 'fabric';
import 'xgplayer';
import volume from 'xgplayer/dist/controls/volume';
import playbackRate from 'xgplayer/dist/controls/playbackRate';
import HlsJsPlayer from 'xgplayer-hls.js';
import TcAdapter from 'tcadapter';
import FileRemark from './components/FileRemark/index.vue'
import FileInfo from './components/FileInfo/index.vue'
import { secondToDate, computedTime } from "@/utils/tool";
export default {
  name: "VideoPlay",
  components: {FileRemark, FileInfo},
  data() {
    return {
      selectColor: "#f13e49",
      textarea: "",
      lastJson: "",
      width: 960,
      // width: document.getElementById('xgplayer').getElementsByTagName('video')[0].clientWidth,
      intervalTagLeft: 0,
      intervalTagRight: 0,

      height: 400,
      rect: [],
      canvas: {},
      showMenu: false,
      x: "",
      y: "",

      mouseFrom: {},
      mouseTo: {},
      drawType: null, //当前绘制图像的种类
      canvasObjectIndex: 0,
      textbox: null,
      rectangleLabel: "warning",
      drawWidth: 2, //笔触宽度
      color: "#E34F51", //画笔颜色
      drawingObject: null, //当前绘制对象
      moveCount: 1, //绘制移动计数器
      doDrawing: false, // 绘制状态

      // 记录操作内容
      historyList: [], //历史列表
      historyFallback: [], //历史撤销

      //polygon 相关参数
      polygonMode: false,
      pointArray: [],
      lineArray: [],
      activeShape: false,
      activeLine: '',
      line: {},

      delectKlass: {},
      imgFile: {},
      imgTitle: '',
      imgSrc: '',
      tagList: [
        {
          "currTime": [
              56.49848,
              73
          ],
          "currTimeType": "1",
          "remark": "dsdsdsssd",
          "sendTime": 1652924662878,
          replyList: [],
          reply: '',
          "tagData": "{\"version\":\"5.2.1\",\"objects\":[{\"type\":\"ellipse\",\"version\":\"5.2.1\",\"originX\":\"center\",\"originY\":\"center\",\"left\":727.2,\"top\":340,\"width\":123,\"height\":90,\"fill\":\"rgba(255, 255, 255, 0)\",\"stroke\":\"#f13e49\",\"strokeWidth\":2,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"rx\":61.5,\"ry\":45},{\"type\":\"path\",\"version\":\"5.2.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":324.7,\"top\":150,\"width\":172,\"height\":104,\"fill\":\"#f13e49\",\"stroke\":\"#f13e49\",\"strokeWidth\":2,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"path\":[[\"M\",325.7000045776367,255],[\"L\",469.847476313198,161.00579670511308],[\"L\",466.8210096239132,156.00048641129592],[\"L\",497.7000045776367,151],[\"L\",478.9268763810524,176.02172758656462],[\"L\",475.9004096917676,171.01641729274746],[\"Z\"]]},{\"type\":\"path\",\"version\":\"5.2.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":521.7,\"top\":187,\"width\":103,\"height\":58,\"fill\":\"#f13e49\",\"stroke\":\"#f13e49\",\"strokeWidth\":2,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"path\":[[\"M\",522.7000045776367,188],[\"L\",612.521072338105,234.63105504870876],[\"L\",614.2089095302061,231.63368900066706],[\"L\",625.7000045776367,246],[\"L\",607.4575607618016,243.6231531928338],[\"L\",609.1453979539027,240.6257871447921],[\"Z\"]]},{\"type\":\"path\",\"version\":\"5.2.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":669.7,\"top\":92,\"width\":47,\"height\":116,\"fill\":\"#f13e49\",\"stroke\":\"#f13e49\",\"strokeWidth\":2,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"path\":[[\"M\",670.7000045776367,209],[\"L\",707.5404645304563,108.37542766807236],[\"L\",704.1647901462541,107.00769752964557],[\"L\",717.7000045776367,93],[\"L\",717.6674876830632,112.47861808335271],[\"L\",714.2918132988609,111.11088794492592],[\"Z\"]]}]}"
        },
        {
          "currTime": [
              81.42428,
              91
          ],
          "currTimeType": "1",
          "remark": "dsddsddsdsd",
          "sendTime": 1652924729117,
          replyList: [],
          reply: '',
          "tagData": "{\"version\":\"5.2.1\",\"objects\":[{\"type\":\"path\",\"version\":\"5.2.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":443.2,\"top\":49.5,\"width\":169,\"height\":119,\"fill\":null,\"stroke\":\"#f13e49\",\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"round\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"round\",\"strokeUniform\":false,\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"path\":[[\"M\",481.69900457763674,68],[\"Q\",481.7000045776367,68,481.7000045776367,67.5],[\"Q\",481.7000045776367,67,483.7000045776367,67],[\"Q\",485.7000045776367,67,486.2000045776367,67],[\"Q\",486.7000045776367,67,489.7000045776367,67],[\"Q\",492.7000045776367,67,495.2000045776367,67],[\"Q\",497.7000045776367,67,500.2000045776367,67],[\"Q\",502.7000045776367,67,508.2000045776367,66.5],[\"Q\",513.7000045776367,66,519.7000045776367,66],[\"Q\",525.7000045776367,66,529.7000045776367,66],[\"Q\",533.7000045776367,66,537.2000045776367,66],[\"Q\",540.7000045776367,66,543.2000045776367,66],[\"Q\",545.7000045776367,66,549.2000045776367,66],[\"Q\",552.7000045776367,66,556.7000045776367,66],[\"Q\",560.7000045776367,66,563.2000045776367,66],[\"Q\",565.7000045776367,66,567.7000045776367,66.5],[\"Q\",569.7000045776367,67,571.2000045776367,67],[\"Q\",572.7000045776367,67,574.2000045776367,67.5],[\"Q\",575.7000045776367,68,576.7000045776367,69],[\"Q\",577.7000045776367,70,578.2000045776367,70.5],[\"Q\",578.7000045776367,71,580.2000045776367,71.5],[\"Q\",581.7000045776367,72,582.2000045776367,73],[\"Q\",582.7000045776367,74,583.7000045776367,74.5],[\"Q\",584.7000045776367,75,585.7000045776367,76.5],[\"Q\",586.7000045776367,78,587.7000045776367,79],[\"Q\",588.7000045776367,80,589.7000045776367,81.5],[\"Q\",590.7000045776367,83,592.2000045776367,84.5],[\"Q\",593.7000045776367,86,593.7000045776367,86.5],[\"Q\",593.7000045776367,87,594.2000045776367,88],[\"Q\",594.7000045776367,89,594.7000045776367,89.5],[\"Q\",594.7000045776367,90,595.2000045776367,90.5],[\"Q\",595.7000045776367,91,595.7000045776367,92],[\"Q\",595.7000045776367,93,595.7000045776367,94],[\"Q\",595.7000045776367,95,595.7000045776367,95.5],[\"Q\",595.7000045776367,96,595.7000045776367,97.5],[\"Q\",595.7000045776367,99,595.7000045776367,99.5],[\"Q\",595.7000045776367,100,595.2000045776367,102],[\"Q\",594.7000045776367,104,593.7000045776367,106.5],[\"Q\",592.7000045776367,109,591.2000045776367,111.5],[\"Q\",589.7000045776367,114,587.7000045776367,116.5],[\"Q\",585.7000045776367,119,583.7000045776367,122.5],[\"Q\",581.7000045776367,126,580.2000045776367,128.5],[\"Q\",578.7000045776367,131,576.2000045776367,132.5],[\"Q\",573.7000045776367,134,571.2000045776367,136.5],[\"Q\",568.7000045776367,139,567.2000045776367,140.5],[\"Q\",565.7000045776367,142,562.7000045776367,144],[\"Q\",559.7000045776367,146,557.2000045776367,147],[\"Q\",554.7000045776367,148,552.2000045776367,149.5],[\"Q\",549.7000045776367,151,548.2000045776367,151.5],[\"Q\",546.7000045776367,152,544.2000045776367,153],[\"Q\",541.7000045776367,154,539.2000045776367,154.5],[\"Q\",536.7000045776367,155,533.2000045776367,156],[\"Q\",529.7000045776367,157,527.7000045776367,157],[\"Q\",525.7000045776367,157,524.2000045776367,157],[\"Q\",522.7000045776367,157,520.7000045776367,157],[\"Q\",518.7000045776367,157,516.2000045776367,157],[\"Q\",513.7000045776367,157,511.7000045776367,157],[\"Q\",509.7000045776367,157,507.2000045776367,156.5],[\"Q\",504.7000045776367,156,503.2000045776367,156],[\"Q\",501.7000045776367,156,499.7000045776367,155],[\"Q\",497.7000045776367,154,495.7000045776367,152.5],[\"Q\",493.7000045776367,151,491.7000045776367,150],[\"Q\",489.7000045776367,149,488.2000045776367,148],[\"Q\",486.7000045776367,147,481.7000045776367,142],[\"Q\",476.7000045776367,137,475.2000045776367,135],[\"Q\",473.7000045776367,133,472.7000045776367,130.5],[\"Q\",471.7000045776367,128,470.7000045776367,126.5],[\"Q\",469.7000045776367,125,469.7000045776367,124],[\"Q\",469.7000045776367,123,469.2000045776367,121.5],[\"Q\",468.7000045776367,120,468.7000045776367,117.5],[\"Q\",468.7000045776367,115,468.7000045776367,113],[\"Q\",468.7000045776367,111,468.7000045776367,109.5],[\"Q\",468.7000045776367,108,468.7000045776367,105.5],[\"Q\",468.7000045776367,103,470.2000045776367,100.5],[\"Q\",471.7000045776367,98,473.7000045776367,94.5],[\"Q\",475.7000045776367,91,478.2000045776367,89],[\"Q\",480.7000045776367,87,483.7000045776367,83],[\"Q\",486.7000045776367,79,490.2000045776367,76.5],[\"Q\",493.7000045776367,74,498.2000045776367,72],[\"Q\",502.7000045776367,70,506.2000045776367,67.5],[\"Q\",509.7000045776367,65,514.7000045776367,63.5],[\"Q\",519.7000045776367,62,525.7000045776367,59.5],[\"Q\",531.7000045776367,57,534.7000045776367,56.5],[\"Q\",537.7000045776367,56,543.2000045776367,55],[\"Q\",548.7000045776367,54,551.7000045776367,54],[\"Q\",554.7000045776367,54,558.2000045776367,54],[\"Q\",561.7000045776367,54,563.7000045776367,54],[\"Q\",565.7000045776367,54,569.7000045776367,54.5],[\"Q\",573.7000045776367,55,575.7000045776367,56.5],[\"Q\",577.7000045776367,58,579.7000045776367,58.5],[\"Q\",581.7000045776367,59,583.2000045776367,60],[\"Q\",584.7000045776367,61,586.2000045776367,62],[\"Q\",587.7000045776367,63,590.2000045776367,65.5],[\"Q\",592.7000045776367,68,593.2000045776367,69],[\"Q\",593.7000045776367,70,595.7000045776367,72.5],[\"Q\",597.7000045776367,75,598.7000045776367,77.5],[\"Q\",599.7000045776367,80,600.7000045776367,83],[\"Q\",601.7000045776367,86,602.2000045776367,87.5],[\"Q\",602.7000045776367,89,602.7000045776367,92],[\"Q\",602.7000045776367,95,603.2000045776367,97.5],[\"Q\",603.7000045776367,100,603.7000045776367,103],[\"Q\",603.7000045776367,106,603.7000045776367,108],[\"Q\",603.7000045776367,110,602.7000045776367,112.5],[\"Q\",601.7000045776367,115,599.7000045776367,119],[\"Q\",597.7000045776367,123,593.7000045776367,128],[\"Q\",589.7000045776367,133,587.7000045776367,135.5],[\"Q\",585.7000045776367,138,581.7000045776367,140.5],[\"Q\",577.7000045776367,143,573.7000045776367,146],[\"Q\",569.7000045776367,149,566.2000045776367,151.5],[\"Q\",562.7000045776367,154,559.2000045776367,156.5],[\"Q\",555.7000045776367,159,552.2000045776367,160.5],[\"Q\",548.7000045776367,162,546.7000045776367,162.5],[\"Q\",544.7000045776367,163,540.2000045776367,165],[\"Q\",535.7000045776367,167,532.7000045776367,167],[\"Q\",529.7000045776367,167,525.2000045776367,168],[\"Q\",520.7000045776367,169,517.7000045776367,169],[\"Q\",514.7000045776367,169,513.7000045776367,169],[\"Q\",512.7000045776367,169,499.2000045776367,165.5],[\"Q\",485.7000045776367,162,483.2000045776367,160.5],[\"Q\",480.7000045776367,159,477.2000045776367,156.5],[\"Q\",473.7000045776367,154,471.2000045776367,152],[\"Q\",468.7000045776367,150,466.7000045776367,148],[\"Q\",464.7000045776367,146,461.2000045776367,143.5],[\"Q\",457.7000045776367,141,456.2000045776367,138.5],[\"Q\",454.7000045776367,136,452.2000045776367,133.5],[\"Q\",449.7000045776367,131,449.2000045776367,130],[\"Q\",448.7000045776367,129,447.2000045776367,127],[\"Q\",445.7000045776367,125,445.2000045776367,123.5],[\"Q\",444.7000045776367,122,444.2000045776367,120.5],[\"Q\",443.7000045776367,119,443.7000045776367,117],[\"Q\",443.7000045776367,115,444.7000045776367,112],[\"Q\",445.7000045776367,109,447.2000045776367,106],[\"Q\",448.7000045776367,103,450.7000045776367,100],[\"Q\",452.7000045776367,97,455.7000045776367,93],[\"Q\",458.7000045776367,89,461.7000045776367,86],[\"Q\",464.7000045776367,83,468.7000045776367,80],[\"Q\",472.7000045776367,77,475.2000045776367,75],[\"Q\",477.7000045776367,73,484.2000045776367,69.5],[\"Q\",490.7000045776367,66,495.7000045776367,64],[\"Q\",500.7000045776367,62,504.2000045776367,60.5],[\"Q\",507.7000045776367,59,513.2000045776367,57],[\"Q\",518.7000045776367,55,533.2000045776367,52.5],[\"Q\",547.7000045776367,50,557.7000045776367,50],[\"Q\",567.7000045776367,50,572.7000045776367,50],[\"Q\",577.7000045776367,50,579.7000045776367,50.5],[\"Q\",581.7000045776367,51,585.7000045776367,51.5],[\"Q\",589.7000045776367,52,593.7000045776367,54],[\"Q\",597.7000045776367,56,600.2000045776367,57.5],[\"Q\",602.7000045776367,59,604.2000045776367,60],[\"Q\",605.7000045776367,61,607.2000045776367,62],[\"Q\",608.7000045776367,63,609.2000045776367,64.5],[\"Q\",609.7000045776367,66,610.2000045776367,66.5],[\"Q\",610.7000045776367,67,611.2000045776367,67],[\"Q\",611.7000045776367,67,612.2000045776367,68.5],[\"L\",612.7010045776367,70.001]]},{\"type\":\"path\",\"version\":\"5.2.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":448.7,\"top\":208,\"width\":172,\"height\":54.51,\"fill\":\"#f13e49\",\"stroke\":\"#f13e49\",\"strokeWidth\":2,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"path\":[[\"M\",621.7000045776367,209],[\"L\",476.03929949743303,258.49975679435204],[\"L\",477.55253284207544,263.5050670881692],[\"L\",449.7000045776367,261],[\"L\",471.49959946350583,243.48382591290053],[\"L\",473.01283280814823,248.48913620671772],[\"Z\"]]},{\"type\":\"ellipse\",\"version\":\"5.2.1\",\"originX\":\"center\",\"originY\":\"center\",\"left\":651.2,\"top\":329.5,\"width\":73,\"height\":49,\"fill\":\"rgba(255, 255, 255, 0)\",\"stroke\":\"#f13e49\",\"strokeWidth\":2,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"rx\":36.5,\"ry\":24.5}]}"
        }
      ],
      player: null,
      isPlay: false,
      fps: '', // 帧率
      onPlayTime: 0, // 当前播放时间
      onPlayPercent: 0, // 播放百分比
      chooseTime: [], // 当前选中时间
      showChooseTime: false, //是否显示选中事件
      workTime: [], 
      playerDuration: 0, // 视频长度
      activeRightTab: 'opinion', // 右侧活动tab
      isActiveTag: null,
      isMouseTag: '',
      clientHeight: '',
      speedTab: 0, // 进度标记
      timeFormat: 'b', //显示时间格式
      playbackRate: '1.0', // 播放速度
      isLoop: false, // 是否循环
      dialogKeyboard: false,
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
      console.log('val-------', val);
      this.canvas.setWidth(this.width);
    },
    height() {
      this.canvas.setHeight(this.height);
    },

  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas", {
      // skipTargetFind: false, //当为真时，跳过目标检测。目标检测将返回始终未定义。点击选择将无效
      // selectable: false,  //为false时，不能选择对象进行修改
      // selection: false   // 是否可以多个对象为一组
    });
    this.canvas.selectionColor = "rgba(0,0,0,0.05)";
    this.canvas.on("mouse:down", this.mousedown);
    this.canvas.on("mouse:move", this.mousemove);
    this.canvas.on("mouse:up", this.mouseup);

    document.onkeydown = (e) => {
      // 键盘 delect删除所选元素
      if (e.keyCode == 46) {
        this.deleteObj();
      }
      // ctrl+z 删除最近添加的元素
      if (e.keyCode == 90 && e.ctrlKey) {
        this.canvas.remove(
          this.canvas.getObjects()[this.canvas.getObjects().length - 1]
        );
      }
    };
    // this.xgplayInit();
    this.tcAdapterInit();

    this.clientHeight = document.body.clientHeight;
    // video视窗变化
    // window.onresize = () => {
    //   return (() => {
    //     this.clientHeight = document.getElementById('xgplayer').getElementsByTagName('video')[0].clientWidth;
    //   })()
    // }

    this.$nextTick(() => {
      document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
          this.upEscape();
        }
      })
    })
  },
  methods: {
    xgplayInit(url) {
      let that = this;
      this.player = new HlsJsPlayer({
        id: 'xgplayer',
        // width: this.width,
        fitVideoSize: 'fixWidth',
        url,
        videoInit: true, // 初始化首帧
        controls: false, // false 隐藏控制栏
        //isLive: true, //直播场景设置为true
        //useHls: true,
        // hlsOpts: {
        //   xhrSetup: function(xhr, url) {
        //     xhr.withCredentials = true;
        //   }
        // } //hls.js可选配置项
        // 截图
        screenShot: {
          saveImg: true,
          quality: 0.92,
          type: 'image/png',
          format: '.png'
        },
        rotate: {   //视频旋转按钮配置项
          innerRotate: true, //只旋转内部video
          clockwise: false // 旋转方向是否为顺时针
        },
      })
      this.player.once('canplay',()=>{
        that.playerDuration = that.player.duration;
      });

      this.player.on('play',function(){
        that.isPlay = true;
      });
      this.player.on('pause',function(){
        that.isPlay = false;
      });
      this.player.on('requestFullscreen', () => {
        that.player.controls = true;
        console.log('requestFullscreen',that.player);
      });
      this.player.on('exitFullscreen', () => {
        that.player.controls = false;
        console.log('exitFullscreen',this.player);
      });
      this.player.on('timeupdate',this.onTimeChange);
    },
    // 播放/暂停
    playPause() {
      let clientWidth = document.getElementById('xgplayer').getElementsByTagName('video')[0].clientWidth;
      console.log('--宽度-', clientWidth);
      // this.width = clientWidth;
      if (!this.isPlay) {
          this.player.play();
      } else {
          this.player.pause();
      }
    },
    onTimeChange() {
      // console.log('--work---', this.workTime);
      // console.log('--choos---', this.chooseTime);
      if (this.workTime.length > 0 && (this.workTime[1] - this.workTime[0] > 1) && (this.player.currentTime >= this.workTime[1] || this.player.currentTime <= this.workTime[0])) {
        this.player.currentTime = this.workTime[0];
      }
      if (this.chooseTime.length === 0 || (this.chooseTime[1] - this.chooseTime[0]) <= 1) {
        const currentTime = this.player.currentTime;
        this.chooseTime = [currentTime, currentTime];
      }
      this.onPlayTime = this.player.currentTime;
      let percent = this.onPlayTime / this.player.duration;
      this.onPlayPercent = percent * 100;
    },
    // 当前播放时间点
    currentTime(legth) {
      this.player.currentTime = this.player.currentTime + (legth * 1)
    },

    currentZhen(val) {
      this.fps = 24; // 帧率
      const stepp = (1 / this.fps).toFixed(5) * 1;
      console.log('---zhen---', stepp);
      if (val) {
        this.currentTime(stepp)
      } else {
        this.currentTime(-stepp)
      }
    },
    loopChange(val){
      this.isLoop = val;
      this.player.loop = val;
    },
    // 全屏
    fullScreenFun() {
      this.player.getFullscreen(this.player.root);
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
      this.player.currentTime = per / 100 * this.player.duration;
      if (this.workTime.length === 0) {
        this.isActiveTag = null;
        this.chooseTime = [];
        this.canvas.clear();
      }
    },
    mousemovePer(e) {
      // this.throttle(()=>{
        // console.log('---e---', e);
        this.speedTab = e.offsetX / this.$refs.videoRunway.clientWidth * 100;
      // }, 500)
    },
    throttle(fun, delay) {
        let last, deferTimer
        return function (args) {
          let that = this
          let _args = arguments
          let now = +new Date()
          if (last && now < last + delay) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function () {
              last = now
              fun.apply(that, _args)
            }, delay)
          }else {
            last = now
            fun.apply(that,_args)
          }
        }
    },
    textClick() {
      this.player.pause();
      this.showChooseTime = true;
      if (this.chooseTime.length === 0 || (this.chooseTime[1] - this.chooseTime[0]) <= 1) {
        const currentTime = this.player.currentTime;
        this.chooseTime = [currentTime, currentTime];
      }
    },
    texBlue() {
      console.log('--texBlue---');
      this.showChooseTime = false;
    },
    chooseTimeChange(val, old) {
      console.log('val--', val);
      if ((val[1] - val[0]) > 1) {
        this.workTime = val;
        this.chooseTime = val;
      } else {
        this.workTime = [val[0], val[0]];
        this.chooseTime = [val[0], val[0]];
      }
      this.player.currentTime = val[0];
    },
    lineMouseover(index) {
      this.isMouseTag = index;
    },
    lineMouseleave(){
      this.isMouseTag = '';
    },
    upEscape() {
      this.chooseTime = [];
      this.workTime = [];
      this.showChooseTime = false;
    },
    timeFormatChange(val) {
      this.timeFormat = val;
    },
    playbackRateChange(val) {
      this.player.playbackRate = val;
      this.playbackRate = val;
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
  
    tcAdapterInit(){
      const that = this;
      const adapter = new TcAdapter('player-container-id', {
        //fileID: "387702300717449342", /**请传入需要播放的视频fileID 必须 */
        fileID: "387702301073211649", /**请传入需要播放的视频fileID 必须 */
        appID: "1253889389", /**请传入点播账号的子应用appID 必须 */
        psign: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTI1Mzg4OTM4OSwiZmlsZUlkIjoiMzg3NzAyMzAxMDczMjExNjQ5IiwiY3VycmVudFRpbWVTdGFtcCI6MTY1MzI5NzUxOSwicGNmZyI6ImJhc2ljRHJtUHJlc2V0IiwidXJsQWNjZXNzSW5mbyI6e30sImRybUxpY2Vuc2VJbmZvIjp7fX0.gNWYzcCCXXdQXbE7D0uOC1KICchOR-bUndmwHh05RDk',
        hlsConfig: {}
      }, () => {
        // console.log('basicInfo', adapter.getKeyFrameDescInfo());
      });
      adapter.on(TcAdapter.TcAdapterEvents.LEVEL_LOADED, (e) => {
        that.xgplayInit(e.details.url)
      })
    },
    TcAdapterCallBack() {},
    clickItem(item, index) {
      console.log(item);
      this.isActiveTag = index;
      console.log(this.isActiveTag);
      this.player.pause();
      this.chooseTime = [];
      this.workTime = [];
      this.showChooseTime = false;
      if (item.currTimeType === '1') {
        this.player.currentTime = item.currTime[0];
      } else {
        this.player.currentTime = item.currTime;
      }
      this.canvas.loadFromJSON(item.tagData);
    },
    sendTag() {
      if (this.textarea === ""){
        this.$message({
          message: '审阅意见不能为空',
          type: 'warning',
          center: true,
          'show-close': true
        });
        return;
      };
      this.tagList.unshift({
        currTime: this.workTime.length ? this.workTime : this.player.currentTime,
        currTimeType: this.workTime.length ? '1' : '0',
        remark: this.textarea,
        sendTime: new Date().getTime(),
        replyList: [],
        reply: '',
        tagData: JSON.stringify(this.canvas),
      });
      // console.log(this.tagList);
      this.textarea = "";
      this.canvas.clear();
      this.showChooseTime = false;
      this.chooseTime = [0,1];
      this.workTime = [];
    },
    onRemarkFocus() {
      this.player.pause();
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
    // 回退、前进、清除操作
    handleAction() {
      console.log(this.historyList);
      let item = [];
      switch (this.drawType) {
        case "fallback": //回退
          if (this.historyList.length == 0) {
            return;
          }
          item = this.historyList.pop();
          if (item.type == "deleteObjs") {
            //若是删除
            item.data.forEach((data) => {
              this.canvas.add(data);
            });
          } else {
            item.data.forEach((data) => {
              this.canvas.remove(data);
            });
            // var obj =  this.canvas._objects[this.canvas._objects.length - 1];
            // this.canvas.remove(obj);
          }
          this.historyFallback.push(item);
          break;
        case "forward": //前进
          if (this.historyFallback.length == 0) {
            return;
          }
          item = this.historyFallback.pop();
          if (item.type == "deleteObjs") {
            item.data.forEach((data) => {
              this.canvas.remove(data);
            });
          } else {
            item.data.forEach((data) => {
              this.canvas.add(data);
            });
          }
          this.historyList.push(item);
          break;
        case "clear": //清除
          this.canvas.clear();
          this.historyList = [];
          this.historyFallback = [];
          break;
        default:
          break;
      }
      this.drawType = null;
    },

    // 开始绘制时，指定绘画种类
    drawTypeChange(e) {
      console.log("---e--", e);
      this.drawType = e;
      this.canvas.skipTargetFind = !!e;
      if (this.textbox) {
        this.textbox.enterEditing();
        this.textbox.hiddenTextarea.focus();
        // this.textbox.hiddenTextarea.blur();
      }
      if (e == "pen") {
        // isDrawingMode为true 才可以自由绘画
        console.log(this.canvas);
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.color = this.selectColor;
      } else if (e == "fallback" || e == "forward" || e == "clear") {
        this.handleAction();
        this.canvas.isDrawingMode = false;
      } else {
        this.canvas.isDrawingMode = false;
      }
    },
    // 鼠标按下时触发
    mousedown(e) {
      // 记录鼠标按下时的坐标
      var xy = e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY);
      this.mouseFrom.x = xy.x;
      this.mouseFrom.y = xy.y;
      this.doDrawing = true;
      if (this.drawType == "text") {
        this.drawing();
      }

      if (this.drawType === "") {
        var activeObjects = this.canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          this.selectColor = activeObjects[0].fill;
        }
      }
      if (this.textbox) {
        this.textbox.enterEditing();
        this.textbox.hiddenTextarea.focus();
      }
      // 绘制多边形
      if (this.drawType == "polygon") {
        this.canvas.skipTargetFind = false;
        try {
          // 此段为判断是否闭合多边形，点击红点时闭合多边形
          if (this.pointArray.length > 1) {
            // e.target.id == this.pointArray[0].id 表示点击了初始红点
            if (e.target && e.target.id == this.pointArray[0].id) {
              this.generatePolygon();
            }
          }
          //未点击红点则继续作画
          if (this.polygonMode) {
            this.addPoint(e);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    // 鼠标松开执行
    mouseup(e) {
      var xy = e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY);
      this.mouseTo.x = xy.x;
      this.mouseTo.y = xy.y;
      this.moveCount = 1;
      if (this.drawType == "pen") {
        var obj = this.canvas._objects[this.canvas._objects.length - 1];
        this.historyList.push({
          type: this.drawType,
          data: [obj],
        });
        this.historyFallback = [];
      }
      if (this.drawingObject) {
        this.historyList.push({
          type: this.drawType,
          data: [this.drawingObject],
        });
        this.drawingObject = null;
        this.historyFallback = [];
      }
      if (this.drawType != "polygon") {
        this.doDrawing = false;
      }
    },

    //鼠标移动过程中已经完成了绘制
    mousemove(e) {
      if (this.moveCount % 2 && !this.doDrawing) {
        //减少绘制频率
        return;
      }
      this.moveCount++;
      var xy = e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY);
      this.mouseTo.x = xy.x;
      this.mouseTo.y = xy.y;
      // 多边形与文字框特殊处理
      if (this.drawType != "text" || this.drawType != "polygon") {
        this.drawing(e);
      }
      if (this.drawType == "polygon") {
        if (this.activeLine && this.activeLine.class == "line") {
          var pointer = this.canvas.getPointer(e.e);
          this.activeLine.set({ x2: pointer.x, y2: pointer.y });

          const points = this.activeShape.get("points");
          points[this.pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
            zIndex: 1,
          };
          this.activeShape.set({
            points: points,
          });
          this.canvas.renderAll();
        }
        this.canvas.renderAll();
      }
    },
    deleteObj() {
      this.historyList.push({
        type: "deleteObjs",
        data: this.canvas.getActiveObjects(),
      });
      this.canvas.getActiveObjects().map((item) => {
        this.canvas.remove(item);
      });
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / 1, y: mouseY / 1 };
    },
    // 绘制多边形开始，绘制多边形和其他图形不一样，需要单独处理
    drawPolygon() {
      this.drawType = "polygon";
      this.polygonMode = true;
      //这里画的多边形，由顶点与线组成
      this.pointArray = new Array(); // 顶点集合
      this.lineArray = new Array(); //线集合
      this.canvas.isDrawingMode = false;
    },
    addPoint(e) {
      var random = Math.floor(Math.random() * 10000);
      var id = new Date().getTime() + random;
      var circle = new fabric.Circle({
        radius: 5,
        fill: "#ffffff",
        stroke: "#333333",
        strokeWidth: 0.5,
        left: (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
        top: (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: "center",
        originY: "center",
        id: id,
        objectCaching: false,
      });
      if (this.pointArray.length == 0) {
        circle.set({
          fill: "red",
        });
      }
      const points = [
        (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
        (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
        (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
        (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
      ];

      this.line = new fabric.Line(points, {
        strokeWidth: 2,
        fill: "#999999",
        stroke: "#999999",
        class: "line",
        originX: "center",
        originY: "center",
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,

        objectCaching: false,
      });
      if (this.activeShape) {
        var pos = this.canvas.getPointer(e.e);
        const points = this.activeShape.get("points");
        points.push({
          x: pos.x,
          y: pos.y,
        });
        const polygon = new fabric.Polygon(points, {
          stroke: "#333333",
          strokeWidth: 1,
          fill: "#cccccc",
          opacity: 0.3,

          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        this.canvas.remove(this.activeShape);
        this.canvas.add(polygon);
        this.activeShape = polygon;
        this.canvas.renderAll();
      } else {
        var polyPoint = [
          {
            x: (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
            y: (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
          },
        ];
        const polygon = new fabric.Polygon(polyPoint, {
          stroke: "#333333",
          strokeWidth: 1,
          fill: "#cccccc",
          opacity: 0.3,

          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        this.activeShape = polygon;
        this.canvas.add(polygon);
      }
      this.activeLine = this.line;

      this.pointArray.push(circle);
      this.lineArray.push(this.line);
      this.canvas.add(this.line);
      this.canvas.add(circle);
    },
    generatePolygon() {
      const points = new Array();
      this.pointArray.map((point) => {
        points.push({
          x: point.left,
          y: point.top,
        });
        this.canvas.remove(point);
      });
      this.lineArray.map((line) => {
        this.canvas.remove(line);
      });
      this.canvas.remove(this.activeShape).remove(this.activeLine);
      const polygon = new fabric.Polygon(points, {
        stroke: this.selectColor,
        strokeWidth: this.drawWidth,
        fill: "rgba(255, 255, 255, 0)",
        opacity: 1,
        hasBorders: true,
        hasControls: false,
      });
      this.canvas.add(polygon);
      this.historyList.push({
        type: this.drawType,
        data: [polygon],
      });
      this.historyFallback = [];
      this.activeLine = null;
      this.activeShape = null;
      this.polygonMode = false;
      this.doDrawing = false;
      this.drawType = null;
    },
    drawing(e) {
      const color = this.selectColor;
      if (this.drawingObject) {
        this.canvas.remove(this.drawingObject);
      }
      let canvasObject = null;
      const [left, top, mouseFrom, mouseTo] = [this.mouseFrom.x, this.mouseFrom.y, this.mouseFrom, this.mouseTo];
      const [x1, x2, y1, y2] = [mouseFrom.x, mouseTo.x, mouseFrom.y, mouseTo.y];
      let w, h, vh, r, path;
      // let radius = '';
      switch (this.drawType) {
        case "arrow": //箭头
          w = x2 - x1;
          h = y2 - y1;
          vh = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
          var sh = Math.cos((30 * Math.PI) / 180) * (vh / 6);
          var sin = h / vh;
          var cos = w / vh;
          var wh = ((vh * 5) / 6) * Math.tan((2 * Math.PI) / 180);
          var w1 = wh * sin,
            h1 = wh * cos,
            centerx = sh * cos,
            centery = sh * sin;
          /**
           * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
           * w1 ，h1用于确定四个点
           */

          path = " M " + x1 + " " + y1;
          path += " L " + (x2 - centerx + w1) + " " + (y2 - centery - h1);
          path +=
            " L " + (x2 - centerx + w1 * 2) + " " + (y2 - centery - h1 * 2);
          path += " L " + x2 + " " + y2;
          path +=
            " L " + (x2 - centerx - w1 * 2) + " " + (y2 - centery + h1 * 2);
          path += " L " + (x2 - centerx - w1) + " " + (y2 - centery + h1);
          path += " Z";
          console.log(path);
          canvasObject = new fabric.Path(path, {
            stroke: color,
            fill: color,
            strokeWidth: this.drawWidth,
          });
          break;
        case "pentagram": //五角星
          // const [x1, x2, y1, y2] = [mouseFrom.x, mouseTo.x, mouseFrom.y, mouseTo.y];
          /**
           * 实现思路  (x1,y1)表示鼠标起始的位置 (x2,y2)表示鼠标抬起的位置
           * r 表示五边形外圈圆的半径，这里建议自己画个图理解
           * 正五边形夹角为36度。计算出cos18°，sin18°备用
           */
          // const w = Math.abs(x2 - x1);
          // const h = Math.abs(y2 - y1);
          r = Math.sqrt(w * w + h * h);
          var cos18 = Math.cos((18 * Math.PI) / 180);
          var sin18 = Math.sin((18 * Math.PI) / 180);

          /**
           * 算出对应五个点的坐标转化为路径
           */
          var point1 = [x1, y1 + r];
          var point2 = [x1 + 2 * r * sin18, y1 + r - 2 * r * cos18];
          var point3 = [x1 - r * cos18, y1 + r * sin18];
          var point4 = [x1 + r * cos18, y1 + r * sin18];
          var point5 = [x1 - 2 * r * sin18, y1 + r - 2 * r * cos18];

          path = " M " + point1[0] + " " + point1[1];
          path += " L " + point2[0] + " " + point2[1];
          path += " L " + point3[0] + " " + point3[1];
          path += " L " + point4[0] + " " + point4[1];
          path += " L " + point5[0] + " " + point5[1];
          path += " Z";
          canvasObject = new fabric.Path(path, {
            stroke: color,
            fill: color,
            strokeWidth: this.drawWidth,
            // angle:180,  //设置旋转角度
          });
          break;
        case "ellipse": //椭圆
          // 按shift时画正圆，只有在鼠标移动时才执行这个，所以按了shift但是没有拖动鼠标将不会画圆
          if (e.e.shiftKey) {
            mouseTo.x - left > mouseTo.y - top
              ? (mouseTo.y = top + mouseTo.x - left)
              : (mouseTo.x = left + mouseTo.y - top);
          }
          // var radius =
          //   Math.sqrt(
          //     (mouseTo.x - left) * (mouseTo.x - left) +
          //       (mouseTo.y - top) * (mouseTo.y - top)
          //   ) / 2;
          canvasObject = new fabric.Ellipse({
            left: (mouseTo.x - left) / 2 + left,
            top: (mouseTo.y - top) / 2 + top,
            stroke: color,
            fill: "rgba(255, 255, 255, 0)",
            originX: "center",
            originY: "center",
            rx: Math.abs(left - mouseTo.x) / 2,
            ry: Math.abs(top - mouseTo.y) / 2,
            strokeWidth: this.drawWidth,
          });
          break;
        case "rectangle": //长方形
          // 按shift时画正方型
          if (e.e.shiftKey) {
            mouseTo.x - left > mouseTo.y - top
              ? (mouseTo.y = top + mouseTo.x - left)
              : (mouseTo.x = left + mouseTo.y - top);
          }
          // var centerX = mouseFrom.x - mouseTo.x;
          // var centerY = mouseFrom.y - mouseTo.y;
          path =
            "M " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseTo.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseTo.x +
            " " +
            mouseTo.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseTo.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " Z";
          canvasObject = new fabric.Path(path, {
            // left: left,
            // top: top,
            stroke: color,
            strokeWidth: this.drawWidth,
            fill: "rgba(255, 255, 255, 0)",
            hasControls: false,
          });
          //也可以使用fabric.Rect
          break;
        case "text": //文本框
          this.textbox = new fabric.Textbox("", {
            left: mouseFrom.x,
            top: mouseFrom.y - 10,
            // width: 150,
            fontSize: 16,
            borderColor: color,
            fill: color,
            hasControls: false,
          });
          this.canvas.add(this.textbox);
          this.textbox.enterEditing();
          this.textbox.hiddenTextarea.focus();
          this.historyList.push({
            type: this.drawType,
            data: [this.textbox],
          });
          this.historyFallback = [];
          break;

        default:
          break;
      }
      if (canvasObject) {
        // canvasObject.index = getCanvasObjectIndex();\
        this.canvas.add(canvasObject); //.setActiveObject(canvasObject)
        this.drawingObject = canvasObject;
      }
    },
    colorSelect(e) {
      this.selectColor = e;
      this.canvas.freeDrawingBrush.color = e;
    },
    addDomain() {
      dynamicValidateForm.domains.push({
        key: Date.now(),
        value: '',
      })
    }
  },
};
</script>


<style lang="scss" scoped>
.panel-body {
    height: 100%;
    display: flex;
    justify-content: space-between;
}
.controls-box {
  height: 5px;
  background-color: red;
  position: relative;
  margin-bottom: 20px;

  .interval-tag {
    position: absolute;
    height: 16px;
    width: 8px;
    top: 0;
    left: 0;
    background-color: green;
    cursor: ew-resize;
  }
}
.el-container {
  flex-direction: column;
}

img,
input {
  display: none;
}
.container-left {
    width:100%;
    min-width: 760px;
    height: 100%;
    margin-bottom: 100px;
    .video-box {
      position: relative;
      width: 100%!important;
      display: flex;
      justify-content: center;
      // background-color: #000000;

      video {
        position: absolute;
        top: 0;
        left: 0;
        margin-left: 50%;
        z-index: 0;
      }

      .canvas-container {
        z-index: 99;
      }
    }
    .el-slider{
      height: 100%;
      --el-slider-button-size: 10px;
      --el-slider-border-radius: 0;
      --el-slider-main-bg-color: #3e3bff;
      --el-slider-button-wrapper-size: 10px;
      --el-slider-button-wrapper-offset:-8px
    }
    .slider__runway{
      position: relative;
      height: 7px;
      background-color: #5c5c5c;
      .el-slider__runway{
        background-color: none;
      }
    }

    .time-choose{
      position: relative;
      height: 40px;
      background-color: #3c3c3c;
      border-bottom: 1px solid #959393;
      .indicatorGuide{
        position: absolute;
        top: 0;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 130;
        .el-slider,.el-slider--default{
          --el-slider-runway-bg-color: none;
          --el-slider-stop-bg-color: none;
          --el-slider-main-bg-color: #4cfaa3;
        }
        :deep(.el-slider__button-wrapper){
          pointer-events: auto;
        }
      }
      .time-tag-content{
        position: absolute;
        top: 0;
        width: 100%;
        height: 30px;
        display: flex;
        z-index: 128;
        .time-tag-sect{
          position: absolute;
          // width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          .time-tag-left{
            width: 10px;
            height: 10px;
            padding: 12px;
            margin-left: -12px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            font-size: 10px;
            color: #ffffff;
            background-color: rgb(177, 111, 238);
          }
          .time-tag-line{
            width: 100%;
            height: 2px;
            background-color: #3e3bff;
          }
        }
        .activeTagSect{
          .time-tag-left{
            padding: 11px;
            font-size: 10px;
            border: 1px solid #ffffff;
          }
          .time-tag-line{
            background-color: #ffffff;
          }
        }
      }
      .esc-tip{
        position: absolute;
        width: 100%;
        top: 30px;
        display: flex;
        justify-content: center;
        span{
          padding: 14px 14px;
          font-size: 12px;
          z-index: 100;
          border-radius: 3px;
          background-color: rgb(67, 84, 237);
        }
      }
    }
    .play-box{
      width:100%;
      height: 40px;
      position: relative;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      background-color: #3c3c3c;
      cursor: pointer;
      border-bottom: 1px solid #959393;
      .play-box-left,.play-box-right{
        width: 200px;
        margin-left: 20px;
        display: flex;
        align-items: center;
          & > div{
          padding: 4px 6px;
          margin-right: 16px;
          border-radius: 3px;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          }
          & > div:hover{
            background-color: #409EFF;
          }
      }
      .play-box-right{
        justify-content: flex-end;
        .play-rate-box{
          position: absolute;
          right: 80px;
        }
        :deep(.el-popper){
          min-width: 130px;
          --el-popover-padding: 0;
        }
        .setting-content{
          padding: 4px 0;
          & > div{
            padding: 4px 10px;
            display: flex;
            align-items: center;
          }
          & > div:hover{
            color: #79bbff;
            background-color: #ecf5ff;
          }
        }
        .setting-icon{
          display: flex;
          background-repeat: no-repeat;
          width: 14px;
          height: 14px;
          padding: 6px;
          background-size: 80%;
          background-position: 50% 50%;
        }
        .setting-title{
          padding: 0 6px;
        }
        .icon-loop {
          background-image: url("../../../assets/icons/play/loop.png");
          background-size: 90%;
        }
        .icon-rotate {
          background-image: url("../../../assets/icons/play/rotate.png");
          background-size: 90%;
        }
        .icon-keyboard {
          background-image: url("../../../assets/icons/play/keyboard.png");
          background-size: 90%;
        }
        .play-full-box{
          position: absolute;
          right: 0;
        }
      }
      .time-format-box{
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        .el-dropdown{
          z-index: 90;
        }
      }
      .el-tooltip__trigger{
        & >i{
          display: flex;
          background-repeat: no-repeat;
          padding: 6px;
          background-size: 80%;
          background-position: 50% 50%;
          height: 10px;
          width: 10px;
        }
        .play-icon{
          width: 14px;
          height: 14px;
        }
        .icon-play {
          background-image: url("../../../assets/icons/play/play.png");
          background-size: 90%;
        }
        .icon-pause {
          background-image: url("../../../assets/icons/play/pause.png");
          background-size: 90%;
        }
        .icon-prev {
          background-image: url("../../../assets/icons/play/prev.png");
          background-size: 90%;
        }
        .icon-next {
          background-image: url("../../../assets/icons/play/next.png");
          background-size: 90%;
        }
        .icon-full {
          background-image: url("../../../assets/icons/play/full.png");
          background-size: 90%;
        }
        .icon-setting {
          background-image: url("../../../assets/icons/play/setting.png");
          background-size: 90%;
        }
      }
      // &>div:hover{
      //   background-color: #409EFF;
      // }
      .el-dropdown .el-dropdown-link{
        font-size: 12px;
        color: #ffffff!important;
      }
    }
    
    .controls-box{
      position: relative;
      height: 30px;
      background-color: #5bed60;
    }
    
    .annota-group{
      position: relative;
      top: 20px;
      width: 98%;
      margin-left: 1%;
      height: 128px;
      border-radius: 5px;
      border: 1px solid #3468fe;
    }
}

.draw-btn-group {
  position: absolute;
  top: 98px;
  right: 10px;
  z-index: 101;
  // width: 1270px;
  // margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & > div {
    background: #fafafa;
    cursor: pointer;
    margin: 0 2px;
    &:hover {
      background: rgb(159, 155, 155);
    }

    i {
      display: flex;
      background-repeat: no-repeat;
      padding: 6px;
      background-size: 80%;
      background-position: 50% 50%;
      height: 10px;
      width: 10px;
    }

    .icon-1 {
      background-image: url("../../../assets/icons/draw/1.png");
    }

    .icon-pentagram {
      background-image: url("../../../assets/icons/draw/pentagram.png");
    }

    .icon-2 {
      background-image: url("../../../assets/icons/draw/2.png");
    }

    .icon-3 {
      background-image: url("../../../assets/icons/draw/3.png");
    }

    .icon-4 {
      background-image: url("../../../assets/icons/draw/4.png");
      background-size: 75%;
    }

    .icon-5 {
      background-image: url("../../../assets/icons/draw/5.png");
      background-size: 70%;
    }

    .icon-6 {
      background-image: url("../../../assets/icons/draw/6.png");
    }

    .icon-7 {
      background-image: url("../../../assets/icons/draw/7.png");
      background-size: 80%;
    }
    .icon-8 {
      background-image: url("../../../assets/icons/draw/8.png");
      background-size: 80%;
    }
    .icon-9 {
      background-image: url("../../../assets/icons/draw/8.png");
      background-size: 80%;
      transform: rotateY(180deg);
    }
    .icon-10 {
      background-image: url("../../../assets/icons/draw/10.png");
      background-size: 80%;
    }

    .icon-del {
      background-image: url("../../../assets/icons/draw/del.png");
      background-size: 90%;
    }

    .icon-img {
      background-image: url("../../../assets/icons/draw/img.png");
      background-size: 80%;
    }

    .icon-back {
      background-image: url("../../../assets/icons/draw/back.png");
      background-size: 75%;
    }

    .icon-save {
      background-image: url("../../../assets/icons/draw/save.png");
      background-size: 80%;
    }

    .icon-mouse {
      background-image: url("../../../assets/icons/draw/mouse.png");
      background-size: 60%;
    }
  }

  .active {
    border-radius: 50%;
    background: rgb(110, 108, 108);
  }
  .shader-wrapper{
    position: relative;
    width: 6.625rem;
    height: 1.3125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .shader-ball-wrapper{
      display: flex;
      width: 1.375rem;
      height: 1.375rem;
      border-radius: 50%;
      position: relative;
      & > div{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border-radius: 50%;
        cursor: pointer;
        width: .5rem;
        height: .5rem;
      }
      &:hover{
        .shader-ani{
          width: 1.175rem;
          height: 1.175rem;
          opacity: .4!important;
        }
        .ballActive{
          width: 1.375rem;
          height: 1.375rem;
          opacity: .6!important;
        }
      }
      .ballActive{
        width: 1.375rem;
        height: 1.375rem;
        opacity: .6!important;
      }
    }
    &:hover {
      background: none;
    }
  }
}
.annota-cont{
  position: absolute;
  width: 100%;
  z-index: 100;  
  .annota-input{
    width: 98%;
    height: 98px;
    margin-left: 4px;
    margin-top: 4px;
    margin: 10px 4px;
    border: none;
    outline: none;
    resize: none;
  }
}

.container-right{
  width: 310px;
  max-width: 310px;
  height: 100%;
  border-left: 1px solid #333333;
  z-index: 102;
  .top-tabs{
    :deep(.el-tabs__header){
      margin: 0 0 15px 14px;
    }
    .file-remark-tabs{
      // margin: 0 14px;
    }
    .tag-scroll{
      :deep(.el-scrollbar__bar.is-vertical){
        width: 0;
      }
    }
    .file-info-tabs{
      // margin: 0 14px;
    }
  }
}
</style>
