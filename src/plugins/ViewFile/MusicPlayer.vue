<template>
    <div class="custom-audio-box" v-loading="loadingState" element-loading-background="rgba(0, 0, 0, 0)">
        <audio controls hidden @ended="handlePause" @playing="audioData.play = true" @pause="audioData.play = false" @timeupdate="onDurationchange" ref="CustomAudioRef"></audio>
        <img class="cover-image" :src="cover" v-if="cover">
        <img class="cover-image" src="https://public-1312415546.cos.ap-shanghai.myqcloud.com/workbench-login-bg.png" v-else>
        <template v-if="!errorType && !loadingState">
            <!-- <div class="custom-audio-cover">
                <ElImage style="width:100%;height:100%;" :draggable="false" :src="CD"></ElImage>
            </div> -->
            <div class="custom-audio-controls">
                <div class="player">
                    <SvgIcon iconClass="video-pause" :size="20" v-if="audioData.play" @click="handlePauseAudio"></SvgIcon>
                    <SvgIcon iconClass="video-play" :size="20" v-else @click="handlePlayAudio"></SvgIcon>
                </div>
                <div class="progess" @click="handleClickProgess">
                    <div class="active-progess" :style="{width:`${audioProgess}%`}"></div>
                </div>
                <div class="time">{{secondToDate(audioData.currentTime)}}/{{secondToDate(audioData.duration)}}</div>
            </div>
        </template>
        <template v-else>
            <div class="custom-audio-error">加载失败 <span @click.stop="handleReload">刷新</span> </div>
        </template>
    </div>
</template>
<script>
import Hls from 'hls.js';
import CD from '@/assets/material/CD.png'
import SvgIcon from '@/components/SvgIcon'
import { ElImage } from 'element-plus';
import { secondToDate } from '@/utils/tool.js'
import { computed, defineComponent, getCurrentInstance, nextTick, reactive } from 'vue';
const directives = {

}
const props = {
    src: { //音频地址
        type: String,
        default: '',
    },
    isHls: {
        type: Boolean,
        default: false,
    },
    cover: { //封面地址
        type: String,
        default: 'https://public-1312415546.cos.ap-shanghai.myqcloud.com/workbench-login-bg.png',
    }
}
const components = {
    SvgIcon,
    ElImage,
}
const setup = (prop) => {
    let hls;
    const errorType = ref('');
    const loadingState = ref(true);
    const CustomAudioRef = ref();
    const { proxy } = getCurrentInstance();
    const audioStyle = computed(() => {
        const cover = prop.cover ? prop.cover : 'https://public-1312415546.cos.ap-shanghai.myqcloud.com/workbench-login-bg.png'
        return {
            backgroundImage: `url(${cover})`
        }
    })
    const audioProgess = ref(0);
    const audioData = ref({
        play: false,
        duration: 0,
        currentTime: 0,
    });

    // 初始化当前显示文件
    const InitVideo = () => {
        hls = new Hls();
        loadingState.value = true;
        hls.attachMedia(CustomAudioRef.value);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(prop.src)
        })
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            loadingState.value = false;
            CustomAudioRef.value.play();
            // audioData.play = true;
        })
        hls.on(Hls.Events.ERROR, function (event, data) {
            loadingState.value = false;
            if (data.fatal) {
                errorType.value = data.type;
            }
        });
    }

    const handleReload = () => {
        switch (errorType.value) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                console.log('fatal network error encountered, try to recover');
                hls.destroy();
                InitVideo();
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('fatal media error encountered, try to recover');
                hls.destroy();
                InitVideo();
                break;
            default:
                hls.destroy();
                InitVideo();
                break;
        }
        errorType.value = '';
    }

    onMounted(() => {
        if(prop.isHls){
            InitVideo()
        }else{
            CustomAudioRef.value.src = prop.src;
            nextTick(()=>{
                CustomAudioRef.value.play();
                loadingState.value = false;
            })
        }
    })
    // 播放
    const handlePlayAudio = ()=>{
        CustomAudioRef.value.play();
    }
    // 点击进度
    const handleClickProgess = (e)=>{
        if(audioData.value.duration > 0){
            const clientWidth = e.target.clientWidth;
            const offsetX = e.offsetX;
            const currentTime = (offsetX/clientWidth) * audioData.value.duration
            CustomAudioRef.value.currentTime = currentTime;
        }
    }
    // 暂停
    const handlePauseAudio = ()=>{
        CustomAudioRef.value.pause();
    }
    // 播放结束的回调
    const handlePause = ()=>{
        audioData.play = false
    }
    // 监听滚动条变动
    const onDurationchange = (e)=>{
        const currentTime = e.target.currentTime;
        const duration = e.target.duration || 0;
        const progress = (currentTime / duration).toFixed(4) * 100;
        audioProgess.value = progress;
        audioData.value.duration = duration;
        audioData.value.currentTime = currentTime;
    }

    return {
        CD,
        audioData,
        errorType,
        audioStyle,
        handlePause,
        audioProgess,
        handleReload,
        secondToDate,
        loadingState,
        CustomAudioRef,
        handlePlayAudio,
        handlePauseAudio,
        onDurationchange,
        handleClickProgess,
    }
}
export default defineComponent({
    setup,
    props,
    directives,
    components,
})
</script>
<style scoped lang="scss">
@keyframes musicPoster {
    0% {
        transform: translateX(-50%) rotate(0deg);
    }
    100% {
        transform: translateX(-50%) rotate(360deg);
    }
}
.custom-audio-box {
    position: relative;
    width: 600px;
    height: 400px;
    // background: #1C1D24;
    background-color: #1c1d24;
    background-size: 100% auto;
    background-repeat: no-repeat;
    box-sizing: border-box;
    padding-bottom: 60px;
    border-radius: 4px;
    overflow: hidden;
    .custom-audio-error {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        span {
            cursor: pointer;
            color: #3468fe;
            text-decoration: underline;
        }
    }
    .cover-image {
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        object-fit: cover;
    }
    .custom-audio-cover {
        width: 230px;
        height: 230px;
        position: absolute;
        left: 50%;
        top: 20%;
        transform-origin: 50% 50%;
        display: flex;
        align-items: center;
        transform: translateX(-50%);
        // animation: musicPoster 2s linear infinite;
    }
    .custom-audio-controls {
        width: 100%;
        height: 60px;
        // line-height: 60px;
        position: absolute;
        background: rgba($color: #000000, $alpha: 0.3);
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        padding: 0 20px;
        .progess {
            flex: auto;
            margin: 0 20px;
            height: 4px;
            border-radius: 10px;
            background: #a0a0a0;
            cursor: pointer;
            .active-progess {
                height: 100%;
                width: 0%;
                user-select: none;
                pointer-events: none;
                background-color: #3468fe;
                border-radius: 10px;
            }
        }
        .player {
            flex: none;
            cursor: pointer;
            color: white;
            &:hover {
                color: #3468fe;
            }
        }
        .time {
            color: white;
            flex: none;
        }
    }
}
</style>