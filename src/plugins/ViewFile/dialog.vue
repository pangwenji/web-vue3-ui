<template>
    <div class="custom-dialog-container">
        <ElDialog v-model="visibled" :fullscreen="true" :destroy-on-close="true" :show-close="false" @closed="handleClosed" :before-close="onBeforeClose"
            custom-class="dialog-center custom-dialog-container">
            <!-- <div class="view-mask"></div> -->
            <div class="view-box" @click="onBeforeClose()">
                <template v-if="viewFile.url">
                    <div @click.stop="false">
                        <img @click.stop="false" style="width: 600px; object-fit:scale-down; height: 100%;" v-if="viewFile.type == 'image'" :draggable="false" :src="viewFile.url"
                            @mousedown="handleMousedown"  @mousewheel="handleMouseWheel" :style="imageStyle" />
                        <MusicPlayer @click.stop="false" v-else-if="viewFile.type == 'audio'" :cover="viewFile.cover" :isHls="viewFile.isHls" :src="viewFile.url"></MusicPlayer>
                        <VideoPlayer @click.stop="false" v-else-if="viewFile.type == 'video'" :cover="viewFile.cover" :isHls="viewFile.isHls" :src="viewFile.url" :style="imageStyle"></VideoPlayer>
                        <PDFView :src="viewFile.url" ref="PDFViewRef" @mousedown="handleMousedown" @mousewheel="handleMouseWheel" :style="imageStyle" v-else-if="viewFile.type == 'pdf' || viewFile.type == 'pdfs'"></PDFView>
                    </div>
                </template>
                <template v-else>
                    <div style="font-size: 30px; color: #979797;">
                        格式暂不支持预览
                    </div>
                </template>
            </div>
            <div class="file-name" v-if="viewFile.name">{{viewFile.name}}</div>
            <el-button type="info" size="large" class="close-btn" @click.stop="onBeforeClose" :icon="Close" circle />
            <el-button type="info" size="large" class="prev-btn" v-if="fileList.length > 0 && current > 0" @click.stop="handlePrex" :icon="ArrowLeft" circle />
            <el-button type="info" size="large" class="next-btn" v-if="fileList.length > 0 && (current < fileList.length - 1)" @click.stop="handleNext" :icon="ArrowRight" circle />
            <div class="bottom-action" v-if="viewFile.type == 'image' || viewFile.type == 'video'">
                <el-icon title="缩小" v-if="viewFile.type == 'image' || viewFile.type == 'video'" @click.stop="handleScaleSmall">
                    <ZoomOut />
                </el-icon>
                <el-icon title="放大" v-if="viewFile.type == 'image' || viewFile.type == 'video'" @click.stop="handleScaleLarge">
                    <ZoomIn />
                </el-icon>
                <!-- <el-icon title="下载" v-if="viewFile.downloadUrl" @click.stop="downloadFile"><Download /></el-icon> -->
                <el-icon title="向左旋转90°" v-if="viewFile.type == 'image'" @click.stop="imageRotate -= 90">
                    <RefreshLeft />
                </el-icon>
                <el-icon title="向右旋转90°" v-if="viewFile.type == 'image'" @click.stop="imageRotate += 90">
                    <RefreshRight />
                </el-icon>
            </div>
            <div class="bottom-action" v-else-if="viewFile.type == 'pdf' || viewFile.type == 'pdfs'">
                <el-icon title="上一页" @click.stop="handleChangePage(1)">
                    <ArrowLeft />
                </el-icon>
                <el-icon title="缩小" @click.stop=" handleScaleSmall">
                    <ZoomOut />
                </el-icon>
                <el-icon title="放大" @click.stop="handleScaleLarge">
                    <ZoomIn />
                </el-icon>
                <!-- <el-icon title="下载" v-if="viewFile.downloadUrl" @click.stop="downloadFile"><Download /></el-icon> -->
                <el-icon title="向左旋转90°" @click.stop="imageRotate -= 90">
                    <RefreshLeft />
                </el-icon>
                <el-icon title="向右旋转90°" @click.stop="imageRotate += 90">
                    <RefreshRight />
                </el-icon>
                <el-icon title="下一页" @click.stop="handleChangePage(0)">
                    <ArrowRight />
                </el-icon>
            </div>
        </ElDialog>
    </div>
</template>
<script>
import SvgIcon from '@/components/SvgIcon';
import PDFView from './PDFView.vue'
import MusicPlayer from './MusicPlayer.vue';
import VideoPlayer from './VideoPlayer.vue';
import FileType from '@/components/FileType';
import { defineComponent, nextTick, ref, computed } from 'vue';
import { ArrowLeft, Close, ArrowRight, ZoomIn, ZoomOut, RefreshLeft, RefreshRight, Download } from '@element-plus/icons-vue';
import { ElDialog, ElEmpty, ElButton, ElIcon, ElImage, ElScrollbar, ElSlider, ElButtonGroup } from 'element-plus';
import downloadImg from '@/assets/icons/work/download.png'
import { download } from '@/utils/request'
import { useWindowSize } from '@vueuse/core'
import { setFileBrowse } from '@/api/personnel/file.js'
const components = {
    ElIcon,
    SvgIcon,
    PDFView,
    ElEmpty,
    ElImage,
    ElScrollbar,
    FileType,
    ElDialog,
    ElButton,
    ElSlider,
    ElButtonGroup,

    MusicPlayer,
    VideoPlayer,

    Close,
    ZoomIn,
    ZoomOut,
    Download,
    ArrowLeft,
    ArrowRight,
    RefreshLeft,
    RefreshRight

}
const props = {
    fileList: {
        type: Array,
        default() {
            return []
        }
    },
    removeNode: {
        type: Function,
        default: null
    }
}
const setup = (prop) => {
    const current = ref(0);
    const visibled = ref(false);
    const PDFViewRef = ref();
    const { height, width } = useWindowSize();
    const viewFile = ref({})
    let offsetX = 0;
    let offsetY = 0;
    const imageScale = ref(100);
    const imageRotate = ref(0);
    const imageTranslateY = ref(0);
    const imageTranslateX = ref(0);
    const imageMove = ref(false);
    const imageStyle = computed(() => {
        return {
            transform: `translate(${imageTranslateX.value}px, ${imageTranslateY.value}px) rotate(${imageRotate.value}deg) scale(${imageScale.value/100})`,
            transition: imageMove.value ? 'none' : 'all .3s ease 0s'
        }
    })
    // 放大
    const handleScaleLarge = (e) => {
        const num = imageScale.value + 20;
        if (num > 1000) {
            imageScale.value = 1000;
        } else {
            imageScale.value = num;
        }
    }
    // 缩小
    const handleScaleSmall = (e) => {
        const num = imageScale.value - 20;
        if (num < 20) {
            imageScale.value = 20;
        } else {
            imageScale.value = num;
        }
    }

    // 关闭之前的回调函数
    const onBeforeClose = (deno) => {
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    // 鼠标按下
    const handleMousedown = (e) => {
        handleSetOffset(e)
        imageMove.value = true;
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    }
    const handleSetOffset = (e)=>{
        let remainder = imageRotate.value % 360;
        const imageWidth = e.target.clientWidth;
        const imageHeight = e.target.clientHeight;
        if (imageRotate.value < 0) { remainder += 360 }
        if (remainder == 0) { //未旋转
            offsetX = (imageWidth / 2) - e.offsetX;
            offsetY = (imageHeight / 2) - e.offsetY;
        } else if (remainder == 90) { //向右旋转90
            offsetX = e.offsetY - (imageHeight / 2);
            offsetY = (imageWidth / 2) - e.offsetX;
        } else if (remainder == 180) { //向右旋转180
            offsetX = e.offsetX - (imageWidth / 2);
            offsetY = e.offsetY - (imageHeight / 2);
        } else if (remainder == 270) { //向右旋转270
            offsetX = (imageHeight / 2) - e.offsetY;
            offsetY = e.offsetX - (imageWidth / 2);
        }
        offsetX = (offsetX * imageScale.value) / 100;
        offsetY = (offsetY * imageScale.value) / 100;
    }
    // 鼠标移动
    const handleMousemove = (e) => {
        const X = e.clientX - (width.value / 2);
        const Y = e.clientY - (height.value / 2);
        imageTranslateX.value = X + offsetX;
        imageTranslateY.value = Y + offsetY;
    }
    // 鼠标弹起
    const handleMouseup = (e) => {
        imageMove.value = false;
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);
    }


    // 滚轮事件
    const handleMouseWheel = (e) => {
        // if(e.ctrlKey === true || e.metaKey){
        //     e.preventDefault();
            const type = viewFile.value.type;
            if (type == 'image' || type == 'pdf' || type == 'pdfs' || type == 'video') {
                const wheelDelta = e.wheelDelta || e.detail;
                if (wheelDelta > 0) { //向前滚动
                    handleScaleLarge(e);
                } else {    //向后滚动
                    handleScaleSmall(e);
                }
                handleSetOffset(e)
                handleMousemove(e)
            }
        // }else{
        //     const wheelDelta = e.wheelDelta || e.detail;
        //     if (wheelDelta > 0) { //向前滚动
        //         imageTranslateY.value += 20
        //     } else {    //向后滚动
        //         imageTranslateY.value -= 20
        //     }
        // }
    }

    // 获取显示文件
    const getViewFile = (index) => {
        if (prop.fileList[index]) {
            current.value = index;
            imageScale.value = 100;
            imageRotate.value = 0;
            imageTranslateY.value = 0;
            imageTranslateX.value = 0;
            const item = prop.fileList[current.value];
            const data = {
                name: item.filename,
                type: item.fileCat,
                downloadUrl: item.downloadUrl,
                cover: item.customizeCover || item.cover,
            }
            if (data.type == 'video' || data.type == 'audio') {
                if (item.sign && item.sign.list && item.sign.list.length > 0) {
                    data.url = item.sign.list[0].key;
                    data.isHls = true;
                } else {
                    data.url = item.downloadUrl;
                    data.isHls = false;
                }
            } else if (data.type === 'image') {
                data.url = item.downloadUrl;
            } else {
                if (item.fileCat == 'pdf' || item.fileCat == 'pdfs') {
                    data.url = item.previewUrl;
                }
            }
            viewFile.value = data;
            if ('fileClassification' in item && item.id) {
                setFileBrowse({ id: item.id })
            }
        } else {
            console.error('对象不存在')
        }
    }

    // 弹窗关闭动画结束时的回调函数
    const handleClosed = () => {
        prop.removeNode && prop.removeNode()
    }
    // 上一个
    const handlePrex = () => {
        const index = current.value - 1;
        getViewFile(index);
    }
    // 下一个
    const handleNext = () => {
        const index = current.value + 1;
        getViewFile(index)

    };

    // 打开
    const open = (e) => {
        visibled.value = true;
        getViewFile(e || 0);
    };

    /**
     * 下载文件
     */
    const downloadFile = (detail) => {
        download(detail.downloadUrl, {}, detail.name)
    }
    const handleChangePage = (e)=>{
        if(e){
            PDFViewRef.value.handlePrePage()
        }else{
            PDFViewRef.value.handleNextPage()
        }
    }
    return {
        open,
        Close,
        current,
        visibled,
        viewFile,
        ArrowLeft,
        ArrowRight,
        PDFViewRef,
        handleChangePage,
        viewFile,
        imageStyle,
        imageScale,
        imageRotate,
        imageTranslateX,
        imageTranslateY,
        handlePrex,
        handleNext,
        getViewFile,
        downloadFile,
        handleClosed,
        onBeforeClose,
        handleMousedown,
        handleScaleLarge,
        handleMouseWheel,
        handleScaleSmall,

    }
}

export default defineComponent({
    setup,
    props,
    components
})
</script>
<style scoped lang="scss">
@import "./style.scss";

.por-list {
    margin-top: 16px;

    .por-name {
        font-size: 14px;
        font-weight: 400;
        color: rgba(196, 201, 211, 0.7);
        line-height: 21px;
        display: flex;
    }

    .por-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 1px 1px 0;
        align-items: center;

        &:hover {
            background-color: rgba(42, 44, 54, 0.5);
            border-radius: 6px;
        }

        .por-info {
            display: flex;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
            line-height: 21px;
            align-items: center;

            div {
                margin-left: 20px;
            }
        }
    }

    .no-data {
        color: #909399;
    }
}

:deep(.pointer) {
    span {
        flex: 1 0 auto;
    }
}

.button-open {
    width: 32px;
    margin: 0 12px;
    transform: translateY(-2px);
}

.icon-play {
    background-image: url("@/assets/icons/play/play.png");
    background-size: 90%;
}
.icon-pause {
    background-image: url("@/assets/icons/play/pause.png");
    background-size: 90%;
}

:deep(.control-box) {
    z-index: 99999;
}

.pof-item {
    .por-name {
        color: #ffffff;
    }
}
</style>
