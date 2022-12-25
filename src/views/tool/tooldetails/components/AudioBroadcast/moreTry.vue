<template>
  <div class="main-card-broad">
    <div class="button-text" style="color: #E1E1E1;">当前仅提供30s试听片段，如您觉得满意，可解锁下载完整版</div>
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
        <div class="progressBar" id="a12312312a" ref="progressBar"></div>
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
            <div style="flex: 1; position: relative">
              <div :style="{backgroundImage:`url('${audioBg}')`,
              backgroundColor:i%2===0?'#24294F':'#213B41'}" class="audio-bg"
                   ></div>
              <div class="audio-ren"
                   style="width: 20%;margin-left: 100px"
                   :style="[i%2===0?'':'background-color: #213B41']"
                   :ref="(el) =>setItemOther(el,'audioCard',file.title)" @click="renClick">
              </div>
            </div>
          </div>
<!--          <div style="cursor: pointer;margin-left: 10px"-->
<!--               @click="downloadFile(file.downloadUrl,file.filename)">-->
<!--&lt;!&ndash;            <el-image  :src="file.sort==0? downDp:down" @mouseenter="file.sort=1" @mouseleave="file.sort=0"></el-image>&ndash;&gt;-->
<!--            <el-image-->
<!--                style="width: 52px;height: 52px;"-->
<!--                :style="{backgroundImage: `url(${down})`}"-->
<!--                :src="file.downDep? downDp:down" @mouseover="file.downDep=true" @mouseout="file.downDep=false"  ></el-image>-->
<!--          </div>-->
        </div>
      </div>
      <div style="text-align: center;margin-bottom: 30px">
        <div class="button-operating">
          <el-button class="next-bt" @click="fullVersion">
            <el-image :src="unlock" style="margin-right: 8px;"></el-image>
            解锁完整版
          </el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue'
import { scaleMore} from '../../dragUtils'
import audioBg from '@/assets/tool/autiobg.png'
const value = ref('')
import WaveSurfer from 'wavesurfer.js'
import {download} from "@/utils/request"; //导入wavesurfer.js
import down from '@/assets/tool/down.png'
import downDp from '@/assets/tool/downClick.png'
import pause from '@/assets/tool/pause.png'
import unlock from '@/assets/tool/unlock.png'
import playImg from '@/assets/tool/playImg.png'
import VolumeProgressBar from '../VolumeProgressBar'
const progressBar = ref(null)
let audioLength = ref(0);
let audioName = ref('')
const currentPlaybackProgress = ref(0)
let volume = ref(100)
const isPlay = ref(false)
import transform from '@/assets/tool/transform.png'
import {requestBlob} from "../../utils/audioVideoUtils";
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

const emit = defineEmits(['close', 'play', 'fullVersion'])
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
      progressBar.value.style.left="259px"
      item["wave"].on('audioprocess', function (e) {
        let width1 = item.audioCard?.offsetWidth
        if (!progressBar.value){
          return;
        }
        progressBar.value.style.left =item['sound'].offsetWidth+100+(e / audioLength.value * width1) + 'px';
        currentPlaybackProgress.value = Math.round(e)
      });
      item["wave"].on("ready", function () {
        if (!progressBar.value){
          return;
        }
        progressBar.value.style.left=item['sound'].offsetWidth+100+'px'
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
  }
})

const initDrag = (audioChart1,sound) => {
  if (!progressBar.value){
    return;
  }
  let start = 0;
  // renVolume.value.muteX();
  scaleMore("yp", progressBar.value, audioChart1, audioChart1,sound,100, (pos, x, step, mw, name) => {
    if (name === "yp") {
      for (let key in itemRefs) {
        let item = itemRefs[key]
        item["wave"].pause();
      }
      if (!progressBar.value){
        return;
      }
      isPlay.value = false;
      progressBar.value.style.left =sound.offsetWidth+100+ x + "px";
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


const getFile = computed(() => {
  return props.file.sourceFileVO?.length
})

// watch(()=> props.file.sourceFileVO?.length, (newValue) => {
//   debugger
//     if (newValue) {
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
  if (!progressBar.value){
    return;
  }
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
 * 转换下一首
 */
const fullVersion = () => {
  emit("fullVersion")
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
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    border: none;
    width: 200px;
    height: 50px;
    background: #3468FE;
    border-radius: 25px;
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



.audio-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-repeat-y: no-repeat;
  background-position: 1px center;
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
}

.bg-color {
  background-color: #213B41;
}
</style>
