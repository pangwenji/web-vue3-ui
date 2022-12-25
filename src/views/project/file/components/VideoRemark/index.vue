<template>
  <div v-loading="loadingStatus" element-loading-background="#0a0b0d" element-loading-text="视频加载中..." class="video-content">
    <div class="player-container">
      <div id="xgplayer" class="video-box" @click="handlePlayerClick">
        <div style="position:relative;" :style="{width:playerWidth?playerWidth+'px':'',height:playerHeight?playerHeight+'px':''}">
          <div id="jieTu" ref="jieTu" :style="{width:playerWidth?playerWidth+'px':'',height:playerHeight?playerHeight+'px':''}">
            <video crossorigin="anonymous" :muted="isMuted" :id="'player-container-id'+fileDetail.id" preload="auto" playsinline webkit-playsinline></video>
            <slot name="draw" ></slot>
          </div>
          <slot name="prevent"></slot>
        </div>
      </div>
      <div v-show="clarityCurrentTime > 0" class="clarity-box">正在切换{{clarity}}播放，请稍后...</div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';
import { secondToDate, computedTime, getRatio } from "@/utils/tool";
import { Canvas2Image } from '@/utils/Canvas2Image.js'
export default {
  name: 'VideoRemark',
  data() {
    return {
      width: 700,
      height: 400,
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
      isMouseTag: '',
      clientHeight: '',
      speedTab: 0, // 进度标记
      timeFormat: 'b', //显示时间格式
      playbackRate: '1.0', // 播放速度
      isLoop: false, // 是否循环
      dialogKeyboard: false,
      videoWidth: 0, // 视频分辨率的宽度
      videoHeight: 0, // 视频分辨率的高度
      // playerWidth: 0,
      // playerHeight: 0,
      canvasStyle: {},
      loadingStatus: false,
      isMuted: true, // 是否静音
    }
  },
  props: {
    playerWidth: {
      type:Number, /* 类型 */
      default: 0
    },
    playerHeight: {
      type:Number, /* 类型 */
      default: 0
    },
    clarity: {
      type: String,
      default: ''
    },
    clarityCurrentTime: {
      type:Number, /* 类型 */
      default: 0
    }
  },
  mounted() {
    this.tcPlayerInit()
  },
  unmounted() {
    this.$emit('onPlay', false);
    this.player.dispose();
    this.player = null;
  },
  computed: {
    fileDetail() {
      return this.$store.state.file.fileDetail;
    },
  },
  methods: {
    tcPlayerInit(){
      this.loadingStatus = true;
      const that = this;
      const playOptions = {
        width: '',
        height: this.height,
        controls: false,
        controlBar: {
          playToggle: false,
          // progressControl: true,
          // volumePanel: false,
          currentTimeDisplay: false,
          durationDisplay: false,
          timeDivider: false,
          playbackRateMenuButton: false,
          fullscreenToggle: false,
          QualitySwitcherMenuButton: false
        },
        hlsConfig: {}
      }

      if (this.fileDetail.sign?.dataFormat === 'kodo') {
        const url = this.fileDetail.sign.list[0].key
        this.player = TCPlayer('player-container-id' + this.fileDetail.id, playOptions);
        this.player.src(url); // url 播放地址
      } else {
        playOptions.fileID =  this.fileDetail.sign?.fileId;
        playOptions.appID =  this.fileDetail.sign?.appId;
        playOptions.psign =  this.fileDetail.sign?.sign;
        this.player = TCPlayer('player-container-id' + this.fileDetail.id, playOptions);
      }

      this.player.one('canplay',()=>{
        that.loadingStatus = false;

        // 初始化首帧
        that.player.play();
        setTimeout(() => {
          that.player.pause();
          that.isMuted = false;
        }, 10);

        that.playerDuration = that.player.duration();
        that.videoWidth = that.player.videoWidth();
        that.videoHeight = that.player.videoHeight();
        that.$emit('tcPlayerInit', that.player);
      });
      this.player.on('play',function(){
        that.isPlay = true;
        that.$emit('onPlay', that.isPlay);
      });
      this.player.on('pause',function(){
        that.isPlay = false;
        that.$emit('onPlay', that.isPlay);
      });
      this.player.on('timeupdate', () => {
        that.$emit('onTimeupdate')
        that.onTimeChange();
      });
      this.player.on('progress', () => {
        if (this.clarityCurrentTime > 0) {
          this.player.currentTime(this.clarityCurrentTime);
          setTimeout(() => {
            if (this.isPlay) {
              this.player.play()
            }
            that.$emit('progressSuccess')
          }, 0);
        }
      });
      // 播放结束
      this.player.on('ended', () => {
        that.$emit('onEnded')
      });
      this.player.on('error', function(e) {
        console.log('---error---', e);
      });
    },
    // 播放/暂停
    playPause() {
      if (!this.isPlay) {
          this.player.play();
      } else {
          this.player.pause();
      }
    },
    onTimeChange() {
      if (this.workTime.length > 0 && (this.workTime[1] - this.workTime[0] > 1) && (this.player.currentTime() >= this.workTime[1] || this.player.currentTime() <= this.workTime[0])) {
        this.player.currentTime(this.workTime[0]);
      }
      if (this.chooseTime.length === 0 || (this.chooseTime[1] - this.chooseTime[0]) <= 1) {
        const currentTime = this.player.currentTime();
        this.chooseTime = [currentTime, currentTime];
      }
      this.onPlayTime = this.player.currentTime();
      let percent = this.onPlayTime / this.playerDuration;
      this.onPlayPercent = percent * 100;
    },
    // 当前播放时间点
    currentTimeChange(legth) {
      this.player.currentTime(this.player.currentTime() + (legth * 1));
    },

    currentZhen(val) {
      this.fps = 24; // 帧率
      const stepp = (1 / this.fps).toFixed(5) * 1;
      console.log('---zhen---', stepp);
      if (val) {
        this.currentTimeChange(stepp)
      } else {
        this.currentTimeChange(-stepp)
      }
    },
    loopChange(val){
      this.isLoop = val;
      this.player.loop = val;
    },
    // 全屏
    fullScreenFun() {
      this.player.requestFullscreen();
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
      this.player.currentTime(per / 100 * this.playerDuration);
      // if (this.workTime.length === 0) {
      //   this.chooseTime = [];
      //   // this.canvas.clear();
      // }
    },
    chooseTimeChange(val, old) {
      if ((val[1] - val[0]) > 1) {
        this.workTime = val;
        this.chooseTime = val;
      } else {
        this.workTime = [val[0], val[0]];
        this.chooseTime = [val[0], val[0]];
      }
      this.player.currentTime(val[0]);
    },
    lineMouseover(index) {
      this.isMouseTag = index;
    },
    lineMouseleave(){
      this.isMouseTag = '';
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
    clickItem(item){
      if (item.endTime === '') {
        this.player.pause();
      }
      this.chooseTime = [];
      this.workTime = [];
      this.showChooseTime = false;
      this.player.currentTime(item.startTime);
    },
    // 截图
    async screenshot() {
      const canvas = document.createElement("canvas")
      // let canvasBox = this.$refs.jieTu
      let canvasBox = document.getElementById("jieTu")
	
      let width = 460
      let height = 460
      let p = width / canvasBox.clientWidth
      if (canvasBox.clientWidth >= canvasBox.clientHeight) {
        height = canvasBox.clientHeight * p
      } else {
        p = height / canvasBox.clientHeight
        width = canvasBox.clientWidth * p
      }
      
      canvas.width = width
      canvas.height = height
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      const context = canvas.getContext("2d");
      context.mozImageSmoothingEnabled = false
      context.webkitImageSmoothingEnabled = false
      context.msImageSmoothingEnabled = false
      context.imageSmoothingEnabled = false
      context.scale(p/getRatio(), p/getRatio());
      const options = {
        backgroundColor: null,
        canvas: canvas,
        width: this.playerWidth,
        height: this.playerHeight,
        useCORS: true,
      }
      let dataURL = ''
      await html2canvas(canvasBox, options).then((canvas) => {
        // dataURL = canvas.toDataURL("image/png")
        const img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height)
        dataURL = img.getAttribute('src')
      })
      return dataURL
    },
    handlePlayerClick() {
      this.$emit('onPlayerClick');
    }
  },
}
</script>
<style lang="scss" scoped>
  @import "./style.scss";
</style>
