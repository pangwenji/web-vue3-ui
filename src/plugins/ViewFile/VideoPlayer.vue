<template>
    <div class="video_payer-box">
        <video ref="VideoPlayerRef" controls :poster="cover" class="video-style"></video>
        <div class="error_mask" v-if="errorType">
            播放失败，请<span @click.stop="handleReload">刷新</span>
        </div>
    </div>
</template>
<script>
import Hls from 'hls.js'
import { defineComponent, onMounted } from 'vue'
const props = {
    src: {
        type: String,
        default: '',
    },
    isHls:{
        type: Boolean,
        default: false,
    },
    cover: {
        type: String,
        default: '',
    }
}
const setup = (prop) => {
    let hls;
    const VideoPlayerRef = ref();
    const errorType = ref('');
    const loadingState = ref(false);
    // 初始化当前显示文件
    const InitVideo = () => {
        hls = new Hls();
        loadingState.value = true;
        hls.attachMedia(VideoPlayerRef.value);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(prop.src)
        })
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            loadingState.value = false;
            VideoPlayerRef.value.play();
        })
        hls.on(Hls.Events.ERROR, function (event, data) {
            loadingState.value = false;
            if (data.fatal) {
                errorType.value = data.type;
            }
        });
    }

    const handleReload = ()=>{
        switch (errorType.value) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                console.log('fatal network error encountered, try to recover');
                hls.startLoad();
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('fatal media error encountered, try to recover');
                hls.recoverMediaError();
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
            console.log(111)
            VideoPlayerRef.value.src = prop.src;
            nextTick(()=>{
                VideoPlayerRef.value.play();
            })
        }
    })
    return {
        errorType,
        loadingState,
        handleReload,
        VideoPlayerRef
    }
}
export default defineComponent({
    setup,
    props
})
</script>
<style scoped lang="scss">
.video_payer-box{
    position: relative;
}
.video-style {
    max-width: 600px;
    max-height: 400px;
    background: black;
}
.error_mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    span{
        cursor: pointer;
        color:#3468FE;
        text-decoration: underline;
    }
}
</style>
