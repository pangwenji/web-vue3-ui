<template>
  <div class="main-card-broad">
    <div>
      <div class="play-button">
        <div style="z-index: 99;height: 38px;cursor: pointer" @click="play">
          <el-image style="width: 38px" :src="isPlay?playImg:pause"></el-image>
        </div>
        <div class="play-rl">
          <div class="play-name">{{ audioName }}</div>
          <div class="play-time">{{ getStringTime(currentPlaybackProgress) }} / {{ getStringTime(audioLength) }}</div>
        </div>
      </div>
      <div class="audio-play" style="position: relative">
        <div class="progressBar" ref="progressBar">
          <div class="text-time">{{getStringTime(currentPlaybackProgress)}}</div>
        </div>
        <div class="sound-reserved"
             v-for="(file,i) in file.sourceFileVOList"
             :key="i" style="margin-top: 20px"
             :ref="(el) => setItemRefs(el,file)"
        >
          <div class="sound-m2" >
            <div class="sound-text" :ref="(el) =>setItemOther(el,'sound',file.title)">
              <div class="text">{{ voiceList[file.title]}}</div>
              <volume-progress-bar @volume="vocalVolume"
                                   :name="file.title"
                                   :ref="(el) =>setItemOther(el,'tone',file.title)"/>
            </div>
            <div class="audio-ren"
                 :style="[i%2===0?'':'background-color: #213B41']"
                 :ref="(el) =>setItemOther(el,'audioCard',file.title)" @click="renClick">
            </div>
          </div>
          <div
              v-if="showDown"
              style="display:flex; align-items: center;margin: 0 20px"
          >
            <div class="down-text" style="cursor: not-allowed;color: gray">
              <el-tooltip content="开发中" placement="bottom" effect="light">
                储存至云盘
              </el-tooltip>
            </div>
            <div class="down-text"
                 style="margin-left: 20px"
                 @click="downloadFile(file.downloadUrl,file.filename)">
              下载
            </div>
          </div>
        </div>
      </div>
      <slot>
      <div style="text-align: center">
<!--        <div class="button-text">已转换完整版</div>-->
<!--        <div class="button-operating">-->
<!--          <el-button class="next-bt" @click="nextOther">转换下一首</el-button>-->
<!--          <el-button class="other-bt" @click="completeOrder">处理完的订单</el-button>-->
<!--        </div>-->
      </div>
      </slot>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue'
import { scaleMore} from '../../dragUtils'
import downDp from '@/assets/tool/downClick.png'

const value = ref('')
import WaveSurfer from 'wavesurfer.js'
import {download} from "@/utils/request"; //导入wavesurfer.js
import down from '@/assets/tool/down.png'
import pause from '@/assets/tool/pause.png'
import playImg from '@/assets/tool/playImg.png'
import VolumeProgressBar from '../VolumeProgressBar'
import {requestBlob} from "../../utils/audioVideoUtils";
import {watch} from "vue";
const progressBar = ref(null)
let wavesurfer1 = ref('')
let audioLength = ref(0);
let audioName = ref('')
const currentPlaybackProgress = ref(0)
let volume = ref(100)
const isPlay = ref(false)
let voiceList = {"bass":"贝斯", "drums":"鼓声", "other":"其他", "piano":"钢琴", "vocals":"人声", "accompaniment":"伴奏"}
const props = defineProps({
  file: {
    type: Object,
    default: {}
  },
  showDown: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['close', 'play', 'nextOther'])

let itemRefs = {};
let itemRefsList = [];
const setItemRefs = (el, item) => {
  if (el) {
    itemRefs[item.title] = {
      ...{
        el: el,
        data: item,
      }, ...itemRefs[item.title]
    }
    itemRefsList.push(el)
  }
}

const setItemOther = (el, name, title) => {
  if (el) {
    let data = {}
    data[name] = el;
    itemRefs[title] = {...data, ...itemRefs[title]}
  }
}

const drawPlay = (file) => {
  audioName.value = file.sourceFileVO.filename
  let i = 0;
  for (let key in itemRefs) {
    let item = itemRefs[key]
    item["wave"] = WaveSurfer.create({
      container: item.audioCard,//容器
      waveColor: '#c8eaef',//波形图颜色
      progressColor: '#d9f2f6',//进度条颜色
      backend: 'MediaElement',
      mediaControls: false,
      audioRate: '1',//播放音频的速度
      height: 46,
      //插件
      plugins: [],
      scrollParent: false,
      hideScrollbar: true,
      responsive: true,
    });
    requestBlob(file.sourceFileVOList[i]?.downloadUrl).then(res=>{
      item["wave"].load(res);
    })
    if (i === 0) {
      if (!progressBar.value){
        return;
      }
      progressBar.value.style.left="190px"
      item["wave"].on('audioprocess', function (e) {
        let width1 = item.audioCard?.offsetWidth
        if (!progressBar.value){
          return;
        }
        progressBar.value.style.left =item['sound'].offsetWidth+(e / audioLength.value * width1) + 'px';
        currentPlaybackProgress.value = Math.round(e)
      });
      item["wave"].on("ready", function () {
        if (!progressBar.value){
          return;
        }
        progressBar.value.style.left=item['sound'].offsetWidth+'px'
        audioLength.value = item["wave"].getDuration();
        initDrag(item.audioCard,item['sound'])
      });
      item["wave"].on('finish', function (e) {
        isPlay.value = false;
      });
    }
    i++;
  }
}

const getStringTime = (time) => {
  let minute = parseInt(time / 60)
  if (minute < 10) {
    minute = '0' + minute
  }
  let second = parseInt(time % 60)
  if (second < 10) {
    second = '0' + second
  }
  return minute + ':' + second
}

onMounted(() => {
  if (props.file.sourceFileVO) {
    drawPlay(props.file)
    watch(()=>props.file,()=>{
      audioName.value = props.file.sourceFileVO.filename
      isPlay.value=false;
      let i = 0;
      for (let key in itemRefs) {
        let item = itemRefs[key]
        item["wave"].pause();
        requestBlob(props.file.sourceFileVOList[i]?.downloadUrl).then(res=>{
          item["wave"].load(res);
        })
        i++;
      }
    })
  }
})

const initDrag = (audioChart1,sound) => {
  let start = 0;
  if (!progressBar.value){
    return;
  }
  // renVolume.value.muteX();
  scaleMore("yp", progressBar.value, audioChart1, audioChart1,sound,0, (pos, x, step, mw, name) => {
    if (name === "yp") {
      for (let key in itemRefs) {
        let item = itemRefs[key]
        item["wave"].pause();
      }
      if (!progressBar.value){
        return;
      }
      isPlay.value = false;
      progressBar.value.style.left =sound.offsetWidth+ x + "px";
      start = x / mw * audioLength.value;
    }
  }, (name) => {
    if (name === "yp") {
      for (let key in itemRefs) {
        let item = itemRefs[key]
        item["wave"].play(start);
      }
      isPlay.value = true;
    }
  })
}


// const getFile = computed(() => {
//   return props.file
// })
//
// watch(getFile, (newValue) => {
//     if (newValue.sourceFileVO) {
//       drawPlay(newValue)
//     }
// })
const vocalVolume = (v,name) => {
    itemRefs[name]["wave"].setVolume(v)
}

const play = () => {
  for (let key in itemRefs) {
    let item = itemRefs[key]
    item["wave"].playPause();
  }
  emit('play')
  isPlay.value = !isPlay.value
}

const close = () => {
  emit('close')
}

const downloadFile = (url, name) => {
  download(url, {}, name)
}

const renClick = (e) => {
  const x = e.clientX
  for (let key in itemRefs) {
    let item = itemRefs[key]
    // 获取当前前进位置
    const dl =item.audioCard.getBoundingClientRect().left
    let thisX = x - dl;
    // 进度条长度 100
    // 音频长度20
    // 当前点击长度 50
    // 求音乐进度
    if (!progressBar.value){
      return;
    }
    progressBar.value.style.left = thisX + 'px';
    let start = thisX / item.audioCard.offsetWidth * audioLength.value;
    item["wave"].play(start); //切换播放，应用播放或暂停
    // wavesurfer2.play(start); //切换播放，应用播放或暂停
    isPlay.value = true;
  }
}


/**
 * 转换下一首
 */
const nextOther = () => {
  emit("nextOther")
}
const router = useRouter();
/**
 * 完成订单
 */
const completeOrder = () => {
  router.push({
    path: '/tool/index/record',
  })
}

</script>
<style scoped lang="scss">
.main-card-broad {
  color: #FFFFFF;
}

.sound-reserved {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 10px;

  .sound-m2 {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sound-text {
      background-color: #30323B;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 1px 20px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
    }

    .audio-ren {
      position: relative;
      flex: 1;
      background: #24294F;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px
    }

  }
}

.play-button {
  margin-bottom: 46px;
  display: flex;
  align-items: center;

  .play-rl {
    border-radius: 23px;
    padding: 5px 40px 5px 49px;
    transform: translateX(-42px) translateY(0px);
    background: #30323B;
  }

  .play-time {
    font-size: 13px;
    font-weight: 400;
    color: #8D91A3;
    margin-top: 2px;
  }

  .play-name {
    font-size: 14px;
    font-weight: 400;
    color: #E1E1E1;
  }
}

.button-text {
  margin-top: 46px;
  font-size: 14px;
  font-weight: 400;
  color: #4E5262;
  line-height: 20px;
}

.button-operating {
  margin-top: 38px;

  .next-bt {
    width: 243px;
    height: 52px;
    background-image: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
    border-radius: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    border: none;
  }

  .other-bt {
    width: 243px;
    height: 52px;
    background: rgba(52, 104, 254, 0.1300);
    border-radius: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #6B8FF8;
    line-height: 22px;
    border: none;
  }
}

:deep(wave) {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none;
  }
}

.progressBar {
  position: absolute;
  width: 2px;
  height: 110%;
  background: #3468FE;
  border-radius: 100px;
  z-index: 10;
  transform: translateY(-8px);
  .text-time{
    position: absolute;
    bottom:-18px;
    left: -20px;
  }
  &:after {
    content: '●';
    width: 15px;
    height: 15px;
    background: linear-gradient(180deg, rgba(117, 235, 255, 0.9100) 0%, rgba(124, 181, 236, 0.9100) 100%);
    border-radius: 8px;
    border: 1px solid #3468FE;
    position: absolute;
    top: -12px;
    left: -6px;
    color: #3468FE;
    text-align: center;
    line-height: 12px;
  }
}

.down-text{
  cursor: pointer;
  margin-left: 10px;
  line-height: 50px;
  color:#3468FE
}
</style>
