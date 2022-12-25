<template>
    <!-- 卡片风格 -->
    <el-col v-bind="layoutSpan" v-contextmenu:contextmenuRef :style="colStyle" style="margin-bottom: 20px;">
        <div class="file-item-card" :class="{ 'files-folder': type == 'folder' }" :draggable="false" @dblclick.stop="handleGo" @click.stop="handleGo"
            @mouseover="data['checkBox'] = true" @mouseleave="data['checkBox'] = false">
            <div class="folder-icon " :class="{check:data['check']}" v-if="type == 'folder'"></div>
            <div class="file-item-content" :class="{ check: data['check']}">
                <div class="check-mask" @click.stop="handleRadio" @dblclick.stop="handleGo" v-if="showCheck"></div>
                <div class="file-check" :class="{ check: data['check'] }" @dblclick.stop="false" @click.stop="handleCheck" v-if="data['check'] || data['checkBox'] || showCheck">
                    <el-icon class="icon">
                        <Check />
                    </el-icon>
                </div>
                <div class="version" v-if="data.version > 1">v{{ data.version }}</div>
                <div class="top-left-tag">
                    <div class="topping" v-if="data.top == 1">置顶</div>
                    <template v-for="(item,index) in reviewState" :key="index">
                        <div class="state" v-if="data.reviewStatus > 0&&data.reviewStatus == item.value">
                            <Point :type="item.type"></Point>
                            <span>{{item.name}}</span>
                        </div>
                    </template>
                    <div class="collect" v-if="data.flag&&data.flag.indexOf('collect') > -1">收集 </div>
                </div>
                <div class="file-item-cover file-item-video" v-if="type == 'video'" @mousemove="handleMouseMoveVideo">
                    <div class="sprite"
                        :style="{width:`${viewWidth}px`,height:`${viewHeight}px`, 'background-image': 'url(' + data.spriteImage + ')','background-position-y': ('-' + String(offsetY) + 'px')}"></div>
                    <div class="cover" :style="{'background-image':`url(${data.cover})`}"></div>
                    <div class="time">{{secondToDate(data.duration)}}</div>
                    <div class="mark">防</div>
                    <div class="play">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                    </div>
                    <div class="progress">
                        <div :style="{ width: String(percentage) + '%' }" class="progress-outer"></div>
                    </div>
                </div>
                <div class="file-item-cover file-item-image" v-else-if="type == 'image'">
                    <FileType type="url" fit="cover" :url="data.cover"></FileType>
                </div>
                <div class="file-item-cover file-item-bg file-item-audio" v-else-if="type == 'audio'">
                    <div class="type-image">
                        <FileType :type="type"></FileType>
                    </div>
                    <div class="time">{{secondToDate(data.duration)}}</div>
                </div>
                <div class="file-item-cover file-item-folder" v-else-if="type == 'folder'">
                    <div class="left">
                        <template v-if="folderPreview(data.cover)[0]">
                            <FileType :type="folderPreview(data.cover)[0].t === 'suffix' ? folderPreview(data.cover)[0].v : folderPreview(data.cover)[0].t" :url="folderPreview(data.cover)[0].v"></FileType>
                        </template>
                    </div>
                    <div class="right">
                        <div class="right-top">
                            <template v-if="folderPreview(data.cover)[1]">
                                <FileType :type="folderPreview(data.cover)[1].t === 'suffix' ? folderPreview(data.cover)[1].v : folderPreview(data.cover)[1].t" :url="folderPreview(data.cover)[1].v"></FileType>
                            </template>
                        </div>
                        <div class="right-bottom">
                            <template v-if="folderPreview(data.cover)[2]">
                                <FileType :type="folderPreview(data.cover)[2].t === 'suffix' ? folderPreview(data.cover)[2].v : folderPreview(data.cover)[2].t" :url="folderPreview(data.cover)[2].v"></FileType>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="file-item-cover file-item-bg file-item-documen" v-else>
                    <div class="type-image"> <FileType :type="type"></FileType></div>
                    <div class="edit" v-if="data.isEditable">可编辑</div>
                </div>
                <div class="file-item-info">
                    <div class="avatar">
                        <el-image :draggable="false" fit="cover" style="width:100%;height:100%;" :src="data.user.avatar"></el-image>
                    </div>
                    <div class="detail">
                        <div class="title">{{ data.name }}</div>
                        <div class="desc">
                            <span v-if="type != 'folder'">{{formatSize(data.size)}}</span>
                            <span class="spot" v-if="type != 'folder' && !data.isEditable"></span>
                            <span class="comment" v-if="type == 'folder'"> {{data.createTime.slice(0,10)}}</span>
                            <span class="comment" title="评论" v-else-if="!data.isEditable">
                                <el-icon> <ChatLineRound /></el-icon>
                                <span style="margin-left: 2px">{{data.commentCount}}</span>
                            </span>
                        </div>
                    </div>
                    <div class="menu-open" @click.stop="false" v-contextmenu:contextmenuRef="{ trigger: 'click' }">
                        <el-icon> <MoreFilled /></el-icon>
                    </div>
                </div>
            </div>
        </div>
    </el-col>
    <v-contextmenu :width="140" ref="contextmenuRef">
        <v-contextmenu-item @click="onRedeposit(data)" :disabled="!onRedeposit">
            <svg-icon iconClass="icon_move-to" size="24px" ></svg-icon>
            转存
        </v-contextmenu-item>
        <v-contextmenu-item @click="onDownload(data)" :disabled="!onDownload || type=='folder'">
            <svg-icon iconClass="icon_download" size="24px" ></svg-icon>
            下载原件
        </v-contextmenu-item>
    </v-contextmenu>
</template>
<script setup>
import { computed, nextTick, reactive, ref } from "vue";
import { renameFileObject } from "@/api/project/files.js";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import FileType from "@/components/FileType"
import { secondToDate, formatSize } from "@/utils/tool.js"
import { ElMessage } from "element-plus"
const route = useRoute();
const router = useRouter();
const store = useStore();
const contextmenuRef = ref();


const prop = defineProps({
    data: {
        type: Object,
        default() {
            return {};
        },
    },
    type: String,
    onRedeposit:{
        type: Function,
        default:null,
    },
    onDownload:{
        type: Function,
        default:null,
    },
    showCheck: {
        type: Boolean,
        default: false,
    },
    layoutSpan: {
        type: Object,
        default: {
            span: 4
        },
    },
    colStyle: {
        default: {},
    }
});
const emit = defineEmits(["onChange","onOpenFolder", 'goDetail']);

const reviewState = [
    {
        name:'待审阅',
        type:'danger',
        value:1
    },
    {
        name:'审阅中',
        type:'yellow',
        value:2
    },
    {
        name:'意见汇总完毕',
        type:'success',
        value:4
    },
    {
        name:'通过',
        type:'primary',
        value:3
    },
    {
        name:'移除状态',
        type:'none',
        value:0
    },
];
//跳转到详情
const handleGo = () => {
    if (prop.type == 'folder') {
        emit('onOpenFolder', prop.data)
    } else {
        emit('goDetail', prop.data);
    }
};

/* 文件夹内容展示 */
const folderPreview = (cover) => {
    if (cover) {
        return JSON.parse(cover)
    } else {
        return [];
    }
}

/* 选择相关 */
// 点击选择check
const handleCheck = () => {
    prop.data["check"] = !prop.data["check"];
    emit("onChange", prop.data);
};

// 单选
const handleRadio = () => {
    prop.data["check"] = true;
    emit("onChangeRadio", prop.data);
};

// 鼠标移动时计算雪碧图
const offsetY = ref(0);
const viewWidth = ref(0);
const viewHeight = ref(0);
const percentage = ref(0);
const handleMouseMoveVideo = (e) => {
    const spriteImageInfo = JSON.parse(prop.data.spriteImageInfo || '{}');
    const imageWidth = spriteImageInfo.width || 240;    //雪碧图每一帧的宽度
    const imageHeight = spriteImageInfo.height || 6750; //雪碧图每一帧的高度
    const offsetX = e.offsetX;
    const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
    const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
    const imageScale = imageWidth / imageHeight;
    const offsetScale = offsetWidth / offsetHeight;
    if (imageScale > offsetScale) {
        viewWidth.value = offsetWidth;
        viewHeight.value = viewWidth.value / imageScale;
    } else {
        viewHeight.value = offsetHeight;
        console.log(imageScale * viewHeight.value)
        viewWidth.value = imageScale * viewHeight.value;
    }

    const N = 100; //数量
    const NS = offsetWidth / N;
    const steep = offsetWidth / 100;
    offsetY.value = viewHeight.value * Math.round(offsetX / NS);
    percentage.value = offsetX / steep; //得到当前进度
};

</script>
<style scoped lang="scss">
.project-file-state-box {
    width: 140px;
    padding: 5px;
    .project-file-state-item {
        padding: 5px;
        display: flex;
        border-radius: 6px;
        cursor: pointer;
        align-items: center;
        &:hover {
            background: #f4f4f5;
        }
    }
}



.file-item-card {
    width: 100%;
    position: relative;
    // height: 100%;
    &.files-folder {
         position: relative;
         height: calc(100% - 15px);
        // overflow: hidden;
        // margin-bottom: 20px;
        // margin-top: 20px;
        .file-item-content {
            border-radius: 0 8px 8px;
            margin-top: 14px;
            .file-check{
                top: 0px;
                z-index: 9999;
            }
        }
        .folder-icon {
            width: 34%;
            height: 14px;
            border-radius: 8px 0 0 0;
            position: absolute;
            top: 1px;
            background: #272830;
            border: 1px solid #272830;
            z-index: 2;
            &::after {
                content: "";
                width: 28px;
                height: 14px;
                border-color: transparent transparent #272830 #272830;
                border-style: solid;
                border-width: 7px 14px;
                box-sizing: border-box;
                position: absolute;
                right: -28px;
            }
            &::before {
                content: "";
                width: 28px;
                height: 1px;
                background: #272830;
                position: absolute;
                right: -27px;
                top: 6px;
                transform: rotate(28deg);
                z-index: 2;
            }
            &.check {
                border-left-color: #6d75ff;
                border-top-color: #6d75ff;
                &::before {
                    background: #6d75ff;
                }
            }
        }
    }

    &::after {
        content: "";
        display: inline-block;
        width: 100%;
        margin-top: 84%;
    }

    .file-item-content {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #272830;
        cursor: pointer;
        background: #272830;
        &.check {
            border-color: #6d75ff;
        }

        .check-mask {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            top: 0;
            left: 0;
        }

        .file-check {
            position: absolute;
            top: 13px;
            left: 13px;
            width: 24px;
            height: 24px;
            border-radius: 24px;
            z-index: 3;
            font-size: 20px;
            color: white;
            // background: #6D75FF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            // box-sizing: border-box;
            cursor: pointer;
            border: 2px solid rgba($color: #ffffff, $alpha: 0.5);
            background: rgba(0, 0, 0, 0.3);
            transition: all 0.3s;

            &:hover {
                border-color: rgba($color: #ffffff, $alpha: 0.9);
                background: rgba(0, 0, 0, 0.5);
            }

            .icon {
                display: none;
            }

            &.check {
                border-color: #6d75ff;
                background: #6d75ff;

                .icon {
                    display: inline-block;
                }
            }
        }

        &:hover {
            .version {
                display: none;
            }
            .time {
                display: none;
            }
            .mark {
                display: none;
            }
            .top-left-tag {
                display: none;
            }
        }
        .version {
            font-size: 12px;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            position: absolute;
            top: 10px;
            right: 6px;
            padding: 3px 5px;
            z-index: 3;
            pointer-events: none;
            user-select: none;
        }
        .top-left-tag {
            font-size: 12px;
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: 2;
            display: flex;
            align-items: center;
            pointer-events: none;
            user-select: none;
            .topping {
                color: white;
                // opacity: .5;
                border-radius: 5px;
                background: #ff7a12;
                padding: 2px 5px;
                margin-right: 4px;
            }
            .state {
                display: flex;
                color: white;
                // opacity: .5;
                background: rgba($color: #000000, $alpha: 0.5);
                border-radius: 5px;
                margin-right: 4px;
                padding: 4px 8px 4px 2px;
            }
            .collect {
                color: white;
                border-radius: 5px;
                // opacity: .5;
                background: rgba($color: #000000, $alpha: 0.5);
                padding: 2px 5px;
                margin-right: 4px;
            }
        }

        .file-item-cover {
            width: 100%;
            height: 69%;
            position: relative;
            background: #1c1d24;
            pointer-events: none;
            user-select: none;
            &.file-item-audio {
                // overflow: hidden;
                font-size: 12px;
                color: white;

                .time {
                    padding: 2px 4px;
                    border-radius: 5px;
                    background: rgba(0, 0, 0, 0.49);
                    position: absolute;
                    bottom: 6px;
                    // z-index: 2;
                    left: 6px;
                }
            }

            &.file-item-image {
                overflow: hidden;
                pointer-events: none;
                user-select: none;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            &.file-item-documen {
                color: white;
                font-size: 12px;
                .edit {
                    padding: 2px 4px;
                    border-radius: 5px;
                    background: rgba(0, 0, 0, 0.49);
                    position: absolute;
                    bottom: 6px;
                    // z-index: 2;
                    left: 6px;
                }
            }
            &.file-item-bg {
                // background-image: url("@/assets/images/type-bg.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                pointer-events: none;
                user-select: none;
                .type-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 13% 10%;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            // background: #000;
            &.file-item-folder {
                padding: 4px 2px;
                display: flex;
                background: none;
                * {
                    pointer-events: none;
                    user-select: none;
                }
                .left {
                    width: 50%;
                    height: 100%;
                    margin: 0 2px;
                    flex-grow: 1;
                    border-radius: 2px;
                    background: #1c1d24;
                    overflow: hidden;
                }

                .right {
                    width: 50%;
                    overflow: hidden;
                    height: 100%;
                    flex-grow: 1;
                    margin: 0 2px;
                    // border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    div {
                        width: 100%;
                        border-radius: 2px;
                    }

                    &-top {
                        flex-grow: 1;
                        overflow: hidden;
                        background: #1c1d24;
                        margin-bottom: 2px;
                        height: 50%;
                    }

                    &-bottom {
                        height: 50%;
                        flex-grow: 1;
                        overflow: hidden;
                        background: #1c1d24;
                        margin-top: 2px;
                    }
                }
            }

            &.file-item-video {
                position: relative;
                font-size: 12px;
                color: white;
                background: black;
                cursor: pointer;
                pointer-events: auto;
                user-select: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                // background-position: 0px 4% ;
                * {
                    pointer-events: none;
                    user-select: none;
                }
                .sprite {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                }
                &:hover {
                    & .cover {
                        display: none;
                    }

                    & .time {
                        display: none;
                    }

                    & .play {
                        display: none;
                    }

                    & .version {
                        display: none;
                    }

                    & .mark {
                        display: none;
                    }

                    & .progress {
                        display: block;
                    }
                }

                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    bottom: 0px;
                    left: 0px;
                    top: 0;
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                }

                .time {
                    padding: 2px 4px;
                    border-radius: 5px;
                    background: rgba($color: #000000, $alpha: 0.2);
                    position: absolute;
                    bottom: 3px;
                    left: 3px;
                }

                .progress {
                    position: absolute;
                    bottom: 6px;
                    height: 2px;
                    width: 95%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba($color: #ffffff, $alpha: 0.2);
                    pointer-events: none;
                    display: none;

                    .progress-outer {
                        width: 100%;
                        height: 100%;
                        background: rgba($color: #ffffff, $alpha: 0.6);
                    }

                    // opacity: 0.5;
                }

                .play {
                    // width: 30px;
                    // height: 30px;
                    font-size: 30px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    user-select: none;
                    pointer-events: none;
                }

                .mark {
                    width: 22px;
                    height: 22px;
                    background: rgba($color: #ffffff, $alpha: 0.2);
                    text-align: center;
                    line-height: 24px;
                    border-radius: 5px;
                    font-weight: bold;
                    position: absolute;
                    color: #ff823f;
                    bottom: 3px;
                    right: 3px;
                }
            }
        }

        .file-item-info {
            height: 31%;
            padding: 0 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: white;
            user-select: none;
            .avatar {
                width: 36px;
                height: 36px;
                border-radius: 30px;
                background: #6d75ff;
                flex-shrink: 0;
                margin-right: 10px;
                overflow: hidden;
            }

            .detail {
                flex-grow: 1;
                overflow: hidden;


                .title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                    margin-bottom: 4px;
                }

                .desc {
                    color: #909399;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    pointer-events: none;
                    user-select: none;
                    .spot {
                        width: 4px;
                        height: 4px;
                        border-radius: 10px;
                        background: #909399;
                        margin: 0 5px;
                    }

                    .comment {
                        cursor: pointer;
                        line-height: 10px;
                    }
                }
            }

            .menu-open {
                flex-shrink: 0;
                transform: rotate(90deg);
                padding: 0 5px;
                border-radius: 4px;
                cursor: pointer;

                &:hover {
                    background: #ecf5ff2e;
                    color: #ffffff1f;
                }
            }
        }
    }
}
</style>
