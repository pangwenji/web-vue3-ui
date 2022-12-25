<template>
    <div class="file-content-box" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <div class="tags-box">
            <div class="tags-item" :class="{active: tageActive == 0}" @click="handleCheck(0)">全部</div>
            <template v-for="(item,index) in tageList" :key="index">
                <div class="tags-item" :class="{active: tageActive == item.id}" v-if="item.ifView" @click="handleCheck(item.id)">{{item.title}}</div>
            </template>
        </div>
        <el-row :gutter="14" v-if="fileList.length > 0">
            <template v-if="type !== 'audio'">
                <el-col :span="6" v-for="(item,index) in fileList" :key="index" >
                    <div class="card_file-box" @click="handleViewFile(item)">
                        <div class="container">
                            <img style="width:100%; height:100%;object-fit:cover;" v-if="item.customizeCover || item.cover" :src="item.customizeCover || item.cover" />
                            <FileType :type="item.fileCat" v-else style="height: 100%; width:100%; padding:20px;"></FileType>
                        </div>
                        <!-- <div class="progress"></div> -->
                        <div class="fileName" :title="item.filename">{{item.filename}}</div>
                        <!-- <div class="player-btn">
                                <svg-icon  :size="36" iconClass="icon_play"></svg-icon>
                                <svg-icon :size="36" iconClass="icon_pause"></svg-icon>
                            </div> -->
                        <div class="duration" v-if="type == 'video'">
                            {{secondToDate(item.duration)}}
                        </div>
                        <div class="browse">
                            浏览量:{{item.browseNum}}
                        </div>
                    </div>
                </el-col>
            </template>
            <template v-else>
                <el-col :span="24" v-for="(item,index) in fileList" :key="index" style="margin-bottom: 8px;">
                    <div class="audio_file-box">
                        <div class="player-btn" @click="handlePlayAuio(index,item)">
                            <svg-icon :size="36" style="color: #3468fe;" v-if="item.play" iconClass="icon_pause"></svg-icon>
                            <svg-icon :size="36" iconClass="icon_play" v-else></svg-icon>
                        </div>
                        <div class="audio_file-cover">
                            <el-avatar :size="32" shape="square" v-if="item.customizeCover || item.cover" :src="item.customizeCover || item.cover"></el-avatar>
                            <FileType :type="type" v-else style="height: 32px; width:32px;"></FileType>
                        </div>
                        <div class="audio_file-title" :title="item.filename">{{item.filename}}</div>
                        <div class="audio_file-progess">
                            <WaveForm :shapeHeight="34" @onPlayPercent="handlePlayPercent($event,item,index)" :playPercent="item.progress || 0" :audioWave="JSON.parse(item.audioWave || '[]')"
                                :duration="Number(item.duration)" progressColor="#376CFA" waveColor="#9094A6" :canvasHeight="34"></WaveForm>
                        </div>
                        <div class="desc">浏览量: {{item.browseNum >= 10000? String(item.browseNum/10000) + 'W' : item.browseNum }}</div>
                    </div>
                </el-col>
            </template>
        </el-row>
        <Empty description="未找到相关作品" v-else-if="!loadingState"></Empty>
        <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
        <audio hidden ref="audioControlsRef" controls @ended="handlePause " @timeupdate="onDurationchange" v-if="type == 'audio' && playIndex > -1"></audio>
    </div>
</template>
<script>
import Hls from 'hls.js';
import { defineComponent, getCurrentInstance, nextTick } from 'vue';
import { getWorkList, getFileTagList, setFileBrowse } from '@/api/personnel/file.js'
import { ElMessage } from 'element-plus'
import { secondToDate } from '@/utils/tool.js'
import FileType from '@/components/FileType';
import { useRoute } from 'vue-router';
import WaveForm from '@/components/WaveForm'
const components = {
    WaveForm,
    FileType
}
const props = {
    type: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    }
}
const setup = (prop) => {
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    const loadingState = ref(false);
    const tageActive = ref(0);
    const tageList = ref([]);
    const fileList = ref([]);
    const playIndex = ref(-1); //播放音乐的项
    const playId = ref(-1); //播放音乐文件的ID
    const audioControlsRef = ref();
    const params = {
        pageNum: 1,
        pageSize: 10,
        total: 0
    }



    // 监听音频播放时长
    const onDurationchange = (e) => {
        if (e && e.target && e.target.currentTime && e.target.duration) {
            const currentTime = e.target.currentTime;
            const duration = e.target.duration || 0;
            const progress = (currentTime / duration).toFixed(4) * 100;
            fileList.value[playIndex.value].progress = progress
        }
    }

    let hls;
    let clearTime;
    // 点击播放进度
    const handlePlayPercent = (e, item,index) => {
        if(playId.value == item.id){
            if(!clearTime){
                audioControlsRef.value.currentTime = audioControlsRef.value.duration * (e / 100)
                item.progress = e;
            }
        }else{
            item.progress = e;
            handlePlayAuio(index,item)
        }
    }

    // 暂停清除数据
    const handlePause = () => {
        if (playIndex.value > -1) {
            hls?.destroy();
            fileList.value[playIndex.value].progress = 0;
            fileList.value[playIndex.value].play = false;
            playIndex.value = -1
        }
    }


    // 点击播放
    const handlePlayAuio = (index, item) => {
        const i = playIndex.value;
        if (item.id !== playId.value && playIndex.value > -1) {
            fileList.value[playIndex.value].play = false;
            fileList.value[playIndex.value].progress = 0;
        }
        playIndex.value = index;
        nextTick(() => {
            playId.value = item.id;
            item.progress = item.progress || 0
            if (item.play) {
                item.play = false;
                audioControlsRef.value.pause();
            } else {
                item.play = true;
                if (i == index && i > -1) {
                    audioControlsRef.value.play();
                } else {
                    hls?.destroy();
                    InitVideo(item);
                }
                if (!item.isBrowse) {
                    setFileBrowse({ id: item.id }).then(res => {
                        item.isBrowse = true;
                    })
                }
            }
        })
    }
    
    // 初始化当前显示文件
    const InitVideo = (item) => {
        const src = item.sign.list[0].key
        hls = new Hls();
        hls.attachMedia(audioControlsRef.value);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(src)
        })
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            audioControlsRef.value.play();
            if(clearTime){
                clearTimeout(clearTime);
                clearTime = null;
            }
            clearTime = setTimeout(()=>{
                item.progress = item.progress || 0;
                audioControlsRef.value.currentTime = item.duration * (item.progress / 100);
                clearTime = null;
            },100)
        })
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                item.play = false;
                playIndex.value = -1;
                hls?.destroy();
                ElMessage.error('文件加载失败')
            }
        });
    }



    const getData = () => {
        loadingState.value = true;
        Promise.all([getFileData(1), getTageData()]).then(res => {
            loadingState.value = false;

        }).catch(err => {
            loadingState.value = false;
        })
    }

    // 获取标签
    const getTageData = async () => {
        try {
            const userAuthenticateId = route.params.id;
            const fileClassification = prop.type;
            const result = await getFileTagList({ userAuthenticateId, tageActive, fileClassification })
            tageList.value = result.data;
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject();
        }
    }
    // 获取文件列表
    const getFileData = async (e) => {
        try {
            if (!e) {
                loadingState.value = true;
            }
            const userAuthenticateId = route.params.id;
            const fileClassification = prop.type;
            const tagId = tageActive.value;
            fileList.value = [];
            const result = await getWorkList({ ...params, tagId, userAuthenticateId, fileClassification })
            fileList.value = result.rows;
            params.total = result.total;
            if (!e) {
                loadingState.value = false;
            }
            return Promise.resolve(result);
        } catch (err) {
            if (!e) {
                loadingState.value = false;
            }
            return Promise.reject();
        }
    }

    getData();

    const handleCheck = (e) => {
        if (e == tageActive.value) {
            return
        }
        tageActive.value = e;
        params.pageNum = 1;
        getFileData();
    }

    // 分页
    const handlePagination = ({ page, limit }) => {
        params.pageNum = page;
        params.pageSize = limit;
        handlePause();
        getFileData();
    }

    // 预览文件
    const handleViewFile = (e) => {
        if (e) {
            proxy.$viewFile.open({
                current: 0,
                fileList: [e]
            })
        } else {
            ElMessage.warning('该文件格式不支持预览')
        }
    }

    return {
        params,
        fileList,
        tageList,
        playIndex,
        tageActive,
        getFileData,
        getTageData,
        handleCheck,
        handlePause,
        secondToDate,
        loadingState,
        handlePlayAuio,
        handleViewFile,
        audioControlsRef,
        onDurationchange,
        handlePagination,
        handlePlayPercent,
    }
}
export default defineComponent({
    setup,
    props,
    components
})
</script>
<style scoped lang="scss">
.file-content-box {
    min-height: 400px;
    padding-bottom: 46px;
    position: relative;
    .pagination-container-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
.tags-box {
    display: flex;
    margin-left: -20px;
    margin-bottom: 20px;
    .tags-item {
        --border-color: #3d3f50;
        --border-hover-color: #3468fe;
        width: 90px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        border: 1px solid var(--border-color);
        flex: none;
        border-radius: 30px;
        color: #666a7a;
        background: rgba($color: #3d3f50, $alpha: 0.3);
        font-size: 14px;
        margin-left: 20px;
        cursor: pointer;

        &.active {
            color: #3468fe;
            background: rgba($color: #3468fe, $alpha: 0.3);
            border: 1px solid var(--border-hover-color);
        }
        &:hover {
            color: #3468fe;
            background: rgba($color: #3468fe, $alpha: 0.3);
            border: 1px solid var(--border-hover-color);
        }
    }
}
.audio_file-box {
    display: flex;
    align-items: center;
    padding: 6px;
    border-radius: 4px;
    background: #111216;
    color: #868890;
    font-size: 12px;
    transform: scale(1);
    // transition: transform .1s ease;
    &:hover {
        transform: scale(1.01);
        background: #272832;
        .audio_file-title {
            color: #ffffff;
        }
        .desc {
            color: #9094a6;
        }
    }
    .audio_file-cover {
        flex: none;
        margin-right: 10px;
    }

    .player-btn {
        flex: none;
        cursor: pointer;
        &:hover {
            color: #3468fe;
        }
    }

    .audio_file-progess {
        width: 320px;
        flex: none;
        padding: 0 10px;
        background: rgba($color: #181920, $alpha: 0.4);
        border-radius: 4px;
        margin-right: 10px;
        &:deep(.envelope-wave) {
            margin-left: 0;
            width: 100%;
        }
    }

    .audio_file-title {
        flex: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 10px;
    }
    .desc {
        width: 80px;
        text-align: left;
        flex: none;
        color: #4e5262;
    }
}
.card_file-box {
    width: 100%;
    padding-top: calc(56% + 30px);
    position: relative;
    background: #24262f;
    border-radius: 10px;
    margin-bottom: 14px;
    overflow: hidden;
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 30px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        overflow: hidden;
        justify-content: center;
        background: #30323b;
        box-sizing: border-box;
    }
    .progress {
        width: 100%;
        height: 2px;
        background: rgba($color: #ffffff, $alpha: 0.5);
        position: absolute;
        bottom: 30px;
        left: 0;
    }
    .fileName {
        position: absolute;
        width: 100%;
        height: 30px;
        left: 0;
        right: 0;
        bottom: 0;
        font-size: 12px;
        color: white;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 30px;
        padding: 0 6px;
    }
    .player-btn {
        position: absolute;
        width: 36px;
        height: 36px;
        background: #3468fe;
        border-radius: 40px;
        overflow: hidden;
        top: 50%;
        left: 50%;
        transform: translate(-18px, -28px);
    }
    .duration {
        position: absolute;
        bottom: 34px;
        left: 6px;
        padding: 2px 6px;
        border-radius: 10px;
        background: rgba($color: #1c1d24, $alpha: 0.5);
        color: #c2c7ce;
        font-size: 10px;
    }
    .browse {
        position: absolute;
        top: 6px;
        left: 6px;
        padding: 2px 6px;
        border-radius: 10px;
        background: rgba($color: #1c1d24, $alpha: 0.5);
        color: #c2c7ce;
        font-size: 10px;
    }
}
</style>