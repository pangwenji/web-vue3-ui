<template>
    <div class="wrapper" v-loading="isLoad" element-loading-background="rgba(28, 29, 36, .6)">
        <el-scrollbar class="scroll-area">
            <div class="left">
                <div class="l-title">
                    <div class="l-t-row">
                        <i class="icon-recruit"></i>
                        <div class="l-t-title">招募详情</div>
                    </div>
                    <div class="l-t-row">
                        <div class="l-t-row l-t-btn" @click="unlike">
                            <i class="icon-block"></i>
                            <div>屏蔽</div>
                        </div>
                        <div class="l-t-row l-t-btn" @click="inform">
                            <i class="icon-report"></i>
                            <div>举报</div>
                        </div>
                    </div>
                </div>
                <div class="recruit-info">
                    <div class="info-line">
                        <span class="info-dot"></span>
                        <div class="info-title">{{detailInfo.title}}</div>
                    </div>
                    <div class="post-time">
                        <span>发布时间：</span>{{detailInfo.createTime}}
                    </div>
                </div>
                <div class="info-detail">
                    <div class="cash-coin">
                        <span class="info-label">招募总预算：</span>
                        <span class="cash-num">{{detailInfo.totalPrice}}</span><i class="icon_coin"></i>
                    </div>
                    <div>
                        <span class="info-label">工种数量：</span>{{detailInfo.categoryNum}}
                    </div>
                    <div>
                        <span class="info-label">报名截止：</span>{{detailInfo.endDate}}
                    </div>
                </div>
                <div class="info-block">
                    <div class="block-item" :style="{'border-top': sexMap[item.sex].border}" v-for="(item, i) in detailInfo.categoryItems" :key="i">
                        <svg-icon :iconClass="sexMap[item.sex].icon" :color="sexMap[item.sex].fillColor" :style="{'background':sexMap[item.sex].bg}" className="block-icon" :size="17">
                        </svg-icon>
                        <div class="block-row">
                            <div class="b-tag">{{item.categoryTitle}}</div>
                            <div class="b-title">{{item.customizeTitle}}</div>
                        </div>
                        <div class="cash-coin">
                            <span class="cash-label">招募预算：</span>
                            <span class="cash-num">{{item.budgetPrice}}</span><i class="icon_coin"></i>
                        </div>
                        <div v-if="isCanNotSign" class="join overdue">已完结</div>
                        <template v-else>
                            <div v-if="item.undertakerState == 1" class="join overdue">已选定</div>
                            <div v-else :class="['join', item.signUp ? 'signUped' : '']" @click="showDialog(item)">{{item.signUp ? '已报名' : '报名'}}</div>
                        </template>
                    </div>
                </div>
                <div class="info-desc">
                    <div class="info-line">
                        <span class="info-dot"></span>
                        <div class="info-title">需求描述</div>
                    </div>
                    <div class="desc-pre">
                        <pre>{{detailInfo.content}}</pre>
                    </div>
                </div>
                <div class="extra-file">
                    <div class="info-line">
                        <span class="info-dot"></span>
                        <div class="info-title">相关附件</div>
                    </div>
                    <div class="file-list">
                        <template v-if="detailInfo.sourIdItems?.length > 0">
                            <div class="file" v-for="file in detailInfo.sourIdItems" :key="file.fileId">
                                <div class="file-row">
                                    <FileType :size="34" :type="file.fileCat"></FileType>
                                    <div class="file-name">{{file.filename}}</div>
                                </div>
                                <!-- 已完结状态不展示 -->
                                <div v-if="detailInfo.status != 4" class="file-row f-handle">
                                    <div @click="previewFile(file)">预览</div>
                                    <div>
                                        <a :href="file.downloadUrl">下载</a>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <Empty v-else description="暂无附件" :imageSize="120"></Empty>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="right">
            <div class="user-box">
                <el-popover trigger="hover" :content="shareLink" :width="400">
                    <template #reference>
                        <div class="share-row" @click="copyLink(shareLink)">
                            <div class="txt">分享</div>
                            <i class="icon-share"></i>
                        </div>
                    </template>
                </el-popover>
                <div class="img-row">
                    <el-avatar :size="56" :src="detailInfo.avatar" />
                    <div class="user-info">
                        <div class="u-name">{{detailInfo.nickName}}</div>
                        <div class="u-id">ID号：{{detailInfo.number}}</div>
                    </div>
                </div>
                <div class="deal">
                    <div>
                        <span>最近发布 </span>{{detailInfo.recentNum}}
                    </div>
                    <div>
                        <span>已成交 </span>{{detailInfo.tradeNum}}
                    </div>
                </div>
                <div class="btn-row">
                    <div class="chat" @click="handleChat">
                        <i class="icon-msg"></i>
                        <span>聊一聊</span>
                    </div>
                    <div class="follow" @click="follow">
                        <span>{{detailInfo.coll ? '取消关注' : '关注'}}</span>
                        <i :class="[detailInfo.coll ? 'icon-follow' : 'icon-star']"></i>
                    </div>
                </div>
            </div>
            <div class="others">其它招募</div>
            <!-- 招募单滚动 -->
            <el-scrollbar v-if="otherRecurits.length > 0">
                <div class="recruit-box" v-for="item in otherRecurits" :key="item.id">
                    <div class="dead-line" v-if="item.cutoff">
                        <el-icon style="color:red">
                            <AlarmClock />
                        </el-icon>
                        <div class="dead-txt" style="color:red">报名截止</div>
                    </div>
                    <div class="work-name">{{item.title}}</div>
                    <div class="cash-coin">
                        <span class="cash-label">总预算：</span>
                        <span class="cash-num">{{item.totalPrice}}</span><i class="icon_coin"></i><i v-if="item.ifPay" class="icon_auth"></i>
                    </div>
                    <div class="tag-list">
                        <div class="tag-item" v-for="(other, i) in item.categoryItems" :key="i" v-show="i < 3">{{other.categoryTitle}}</div>
                        <div class="rest" v-if="item.categoryItems.length > 3">...</div>
                    </div>
                    <div class="btm-line">
                        <div>
                            <span>{{formatDate(item.createTime)}}发布</span><span>{{item.signUpNum}}人报名</span>
                        </div>
                        <div :class="[!item.cutoff ? 'apply-btn' : 'no-click']" @click="linkTodetail(item)">去报名</div>
                    </div>
                </div>
            </el-scrollbar>
            <Empty v-else description="该用户还没有发布其它招募哦"></Empty>
        </div>
        <!-- 弹窗 -->
        <SignUpDialog ref="signUpRef" @signUpSucc="signUpSucc" :info="currentInfo" :recruitId="recruitId" :close-on-click-modal="false"></SignUpDialog>
        <resultDialog ref="resultRef" @onCath="handleCathUser"></resultDialog>
        <informDialog ref="informRef" :info="detailInfo" :close-on-click-modal="false"></informDialog>
    </div>
</template>

<script setup>
import "dayjs/locale/zh-cn"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import useClipboard from 'vue-clipboard3'
import FileType from '../components/FileType'
import SignUpDialog from '../components/SignupDialog'
import resultDialog from '../components/resultDialog'
import informDialog from '@/components/informDialog'
import { getContactInfo } from '@/api/IM.js'
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { getUserImAccount } from '@/api/IM.js'
import { recruitInfo, getRecruitList, recruitDetailFollow, handleShielded, havechatInitiate } from '@/api/personnel/recruitmentWall'
import { userAuthList, lookOverInvite } from '@/api/personnel/personnelConsole.js'
import { ElMessage } from "element-plus"

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const route = useRoute()
const router = useRouter()
const store = useStore()
const { proxy } = getCurrentInstance()
const { toClipboard } = useClipboard()
const recruitId = computed(() => +route.params.id)
const sexMap = {
    0: { sex: 'all', icon: 'icon_sex', border: '4px solid #1A4D45', fillColor: '#1A9B7D', bg: '#223A3B', storeSex: '' },
    1: { sex: 'male', icon: 'icon_man', border: '4px solid #384A60', fillColor: '#7CB5EC', bg: '#2F3947', storeSex: '0' },
    2: { sex: 'female', icon: 'icon_girl', border: '4px solid #52163C', fillColor: '#D80475', bg: '#4C1E3E', storeSex: '1' }
}
const host = import.meta.env.VITE_APP_API_PROXY || location.host
const shareLink = computed(() => `复制分享链接: ${host}/workbench/#${route.fullPath}`)

// 格式化 - 发布时间
const formatDate = (e) => {
    const now = dayjs()
    return dayjs(e).from(now)
}

// 初始化 - 查询详情
const detailInfo = ref({})
const isCanNotSign = ref(true)
const isLoad = ref(false)

const getDetail = (id) => {
    isLoad.value = true
    recruitInfo(id).then(res => {
        isLoad.value = false
        detailInfo.value = res.data || {}
        if (route.query?.t && route.query?.vid) {
            const createTime = dayjs(route.query.t).format('YYYY-MM-DD')
            if (createTime == res.data.createTime) {
                setViewData()
            }
        }
        // 到期或招募关闭无法报名
        isCanNotSign.value = !!res.data.cutoff || res.data.status == 4
        // 查询其他招募
        getOtherRecruit()
    }).catch(() => { isLoad.value = false })
}
getDetail(recruitId.value)

const setViewData = () => {
    const id = route.query?.vid || 0;
    lookOverInvite({ recruitInviteId: Number(id) }).then(res => { })
}

onBeforeRouteUpdate(() => {
    getDetail(recruitId.value)
})


// 初始化 - 其他招募
const otherRecurits = ref([])

const getOtherRecruit = () => {
    const params = {
        userId: detailInfo.value.userId,
        status: 1, // 报名中
        orderByType: 0, // 倒序
        pageSize: 20
    }
    getRecruitList(params).then(res => {
        otherRecurits.value = res.rows || []
        const index = otherRecurits.value.findIndex(item => item.id === detailInfo.value.id)
        if (index > -1) {
            otherRecurits.value.splice(index, 1)
        }
    })
}

// 初始化 - 查询已认证工种
const listData = ref([])
const getData = () => {
    userAuthList().then(res => {
        listData.value = res.data
    })
}
getData();

//跳转 - 截止前去报名
const linkTodetail = (info) => {
    if (!info.cutoff) {
        router.push(`/workspace/recruit/${info.id}`)
    }
}
watch(recruitId, (id) => {
    id && getDetail(id)
})

// 点击 - 关注
const follow = () => {
    recruitDetailFollow(detailInfo.value.userId).then(() => {
        // 更新关注状态
        getDetail(recruitId.value)
    })
}

// 聊一聊
const sessions = computed(() => store.state.IM.sessions)
const handleChat = () => {
    proxy.$Authentication.open(() => {
        const userId = detailInfo.value.userId;
        const recruitId = detailInfo.value.id;
        getContactInfo({contactUserId: userId}).then(result=>{
            if(result.data){
                const userData = result.data;
                proxy.$sessionBox.openDialog({ account: userData.contactImAccountId, name: userData.sysUser.name, avatar: userData.sysUser.avatar });
            }else{
                Promise.all([havechatInitiate({ userId, recruitId }), getUserImAccount({ userId })]).then(res => {
                    const userData = res[1].data;
                    for (var item of sessions.value) {
                        if (item.to == userData.imAccountId) {
                            proxy.$sessionBox.openDialog({ account: userData.imAccountId, name: userData.name, avatar: userData.avatar });
                            return
                        }
                    }
                    ElMessage.success('已发送聊天申请，等待对方回复')
                }).catch(err => {

                })
            }
        })
    })
}

// 联系
const handleCathUser = () => {
    const userId = detailInfo.value.userId;
    proxy.$sessionBox.openDialog({ userId })
}


// 点击 - 屏蔽
const unlike = () => {
    proxy.$modal.confirm({
        title: '屏蔽',
        content: '确定不再推荐此用户的招募吗?',
        beforeClose(action, instance, done) {
            if (action === 'confirm') {
                let params = {
                    userId: detailInfo.value.userId,
                    type: 1 // 0: 工种屏蔽 1：招募屏蔽
                }

                instance.confirmButtonLoading = true
                handleShielded(params).then(res => {
                    proxy.$modal.msgSuccess('已屏蔽')
                    router.replace({ path: '/workspace/recruit/wall' })
                    done()
                }).catch((err) => {
                    console.error(err)
                    done()
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    })
}

// 点击 - 举报
const informRef = ref()
const inform = () => {
    informRef.value.isShow = true
}

// 点击 - 分享
const copyLink = async (link) => {
    let url = link.split(' ')[1]
    try {
        await toClipboard(url)
        proxy.$modal.msgSuccess('复制成功')
    } catch (err) {
        proxy.$modal.msgError('复制失败')
    }
}

// 点击 - 报名
const signUpRef = ref()
const currentInfo = ref({})

const showDialog = (item) => {
    proxy.$Authentication.open(() => {
        const userSex = sexMap[item.sex].storeSex
        let isMatch = false // 标识 - 工种是否匹配
        listData.value.forEach(e => {
            if (e.categoryId == item.categoryId && e.status == 1) {
                isMatch = true
            }
        })
        // 校验
        if (detailInfo.value.ifOwn) {
            return proxy.$modal.msgWarning('您不能报名自己发布的招募哦~')
        }
        if (!isMatch) {
            return proxy.$modal.msgWarning('您还未对该工种申请认证，暂时无法报名')
        }
        if (userSex && userSex != store.state.user.sex) {
            return proxy.$modal.msgWarning('您和招募的性别不匹配，很抱歉~')
        }

        if (!item.signUp) {
            signUpRef.value.isShow = true
            currentInfo.value = item
        }
    })
}

// onEmit - 报名成功
const resultRef = ref()

const signUpSucc = () => {
    getDetail(recruitId.value)
    resultRef.value.isShow = true
}

// 文件预览
const previewFile = (e) => {
    proxy.$viewFile.open({
        current: 0,
        fileList: [e]
    })
}
</script>

<style lang="scss" scoped>
// 引入icon
@mixin importIcon($url, $width, $height, $margin: 0 5px 0 0) {
    background-image: url($url);
    background-repeat: no-repeat;
    width: $width;
    height: $height;
    margin: $margin;
    background-size: 100%;
}
@mixin cashAmount($size: 22px) {
    font-size: $size;
    font-weight: 500;
    color: #ffc800;
}
@mixin tag($paddig, $fontColor, $background: #252f4c) {
    padding: $paddig;
    color: $fontColor;
    margin-right: 8px;
    font-size: 14px;
    border-radius: 6px;
    background: $background;
}
.cash-coin {
    display: flex;
    align-items: center;
    @include cashAmount();
    .icon_coin {
        @include importIcon("@/assets/icons/icon_money.png", 20px, 20px);
    }
}
.grey-text {
    font-size: 14px;
    font-weight: 400;
    color: #8d91a3;
}
.no-content {
    text-align: center;
    @extend .grey-text;
}

.info-line {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    .info-dot {
        width: 8px;
        height: 8px;
        margin-right: 10px;
        border-radius: 50%;
        display: inline-block;
        background: blue;
    }
    .info-title {
        font-size: 16px;
    }
}

.wrapper {
    margin-left: 20px;
    height: 100%;
    .scroll-area {
        height: 100%;
    }
    .left {
        width: calc(100% - 358px - 40px);
        border-radius: 10px;
        background-color: #1c1d24;
        padding: 18px 20px;
        margin: 20px 0;
        .l-title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 27px;
            .l-t-row {
                display: flex;
                .l-t-title {
                    font-size: 18px;
                }
                .l-t-btn {
                    padding: 4px 10px;
                    background: #24262f;
                    border-radius: 8px;
                    margin-left: 17px;
                    cursor: pointer;
                    div {
                        @extend .grey-text;
                    }
                }
            }
            .icon-recruit {
                @include importIcon(
                    "@/assets/icons/work/icon_recruit.png",
                    24px,
                    24px
                );
            }
            .icon-block {
                @include importIcon(
                    "@/assets/icons/work/icon_block.png",
                    20px,
                    20px
                );
            }
            .icon-report {
                @include importIcon(
                    "@/assets/icons/work/icon_report.png",
                    20px,
                    20px
                );
            }
        }
        .recruit-info {
            .post-time {
                @extend .grey-text;
                padding-left: 16px;
            }
        }
        .info-detail {
            display: flex;
            justify-content: space-around;
            padding: 20px 30px;
            background: #18191e;
            border-radius: 10px;
            margin: 27px 0;
            .info-label {
                @extend .grey-text;
            }
        }
        .info-block {
            display: flex;
            flex-wrap: wrap;
            .block-item {
                position: relative;
                background: #24262f;
                margin: 0 24px 10px 0;
                padding: 18px 50px 10px 18px;
                border-radius: 10px;
                width: 260px;
                .block-icon {
                    position: absolute;
                    border-radius: 3px;
                    right: 7px;
                    top: 5px;
                    width: 17px;
                    height: 17px;
                }
                .block-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .b-tag {
                        @include tag(3px 8px, #3468fe, #252f4c);
                    }
                    .b-title {
                        font-size: 14px;
                    }
                }
                .cash-label {
                    @extend .grey-text;
                }
                .cash-num {
                    font-size: 18px;
                }
                .join {
                    background: #3468fe;
                    border-radius: 6px;
                    width: 70px;
                    padding: 2px 0;
                    text-align: center;
                    font-size: 14px;
                    position: relative;
                    margin-top: 10px;
                    float: right;
                    left: 40px;
                    cursor: pointer;
                }
                .signUped {
                    background: #1c1d24;
                    color: #676c7f;
                }
                .overdue {
                    background-color: #3c3d409e;
                    color: #676c7f;
                }
            }
        }
        .info-desc {
            margin-top: 40px;
            .desc-pre {
                pre {
                    padding: 20px;
                    border-radius: 10px;
                    background: #181920;
                    @extend .grey-text;
                }
            }
        }
        .extra-file {
            margin-top: 30px;
            .file {
                display: flex;
                justify-content: space-between;
                padding: 5px 20px 5px 6px;
                margin-bottom: 5px;
                border-radius: 8px;
                background: #181920;
                &:hover {
                    background: #21222c;
                }
                .file-row {
                    display: flex;
                    align-items: center;
                    .file-name {
                        margin: 0 10px;
                        @extend .grey-text;
                    }
                }
                .f-handle {
                    div {
                        @extend .grey-text;
                        cursor: pointer;
                        margin-left: 17px;
                    }
                }
            }
        }
    }

    .right {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 358px;
        height: 500px;
        .user-box {
            background: #1c1d24;
            padding-bottom: 30px;
            border-radius: 10px;
            .share-row {
                position: relative;
                left: 264px;
                top: 8px;
                display: flex;
                align-items: center;
                line-height: 32px;
                justify-content: center;
                width: 84px;
                height: 32px;
                background: #24262f;
                border-radius: 18px;
                cursor: pointer;
                .txt {
                    color: #9094a6;
                }
                .icon-share {
                    @include importIcon(
                        "@/assets/icons/work/icon_share.png",
                        20px,
                        20px
                    );
                }
            }
            .img-row {
                display: flex;
                align-items: center;
                padding-left: 40px;
                margin-top: 10px;
                .user-info {
                    margin-left: 14px;
                    .u-name {
                        font-size: 18px;
                        font-weight: 500;
                        margin-bottom: 6px;
                    }
                    .u-id {
                        @extend .grey-text;
                    }
                }
            }
            .deal {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                span {
                    @extend .grey-text;
                }
            }
            .btn-row {
                display: flex;
                justify-content: space-around;
                @mixin userBtn($width, $height, $bg) {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    width: $width;
                    height: $height;
                    line-height: $height;
                    background: $bg;
                    border-radius: 10px;
                }
                .chat {
                    @include userBtn(189px, 40px, rgba(52, 104, 254, 0.15));
                    border: 1px solid #3468fe;
                    color: #3468fe;
                    .icon-msg {
                        @include importIcon(
                            "@/assets/icons/icon_msg.png",
                            20px,
                            20px
                        );
                    }
                }
                .follow {
                    @include userBtn(101px, 40px, #24262f);
                    @extend .grey-text;
                    .icon-star {
                        @include importIcon(
                            "@/assets/icons/work/icon_star.png",
                            20px,
                            20px,
                            0 0 0 5px
                        );
                    }
                    .icon-follow {
                        @include importIcon(
                            "@/assets/icons/work/icon_follow.png",
                            20px,
                            20px,
                            0 0 0 5px
                        );
                    }
                }
            }
        }
        .others {
            border-left: #3468fe solid;
            border-width: 5px;
            padding-left: 8px;
            margin: 27px 0 19px;
        }
        .recruit-box {
            padding: 11px 15px;
            background: #181920;
            border-radius: 10px;
            margin-bottom: 27px;
            .dead-line {
                display: flex;
                align-items: center;
                .dead-txt {
                    margin-left: 7px;
                    font-size: 12px;
                    color: #8d91a3;
                }
            }
            .work-name {
                margin: 19px 0;
            }
            .cash-label {
                @extend .grey-text;
            }
            .icon_auth {
                @include importIcon(
                    "@/assets/icons/work/icon_auth.png",
                    98px,
                    20px,
                    0 0 0 5px
                );
            }
            .tag-list {
                display: flex;
                flex-wrap: wrap;
                margin: 17px 0;
                .tag-item {
                    @include tag(3px 19px, #8d91a3, #3d3f50);
                    margin-bottom: 5px;
                }
                .rest {
                    @include tag(3px 10px 6px, #8d91a3, #3d3f50);
                    height: 100%;
                    width: 10%;
                }
            }
            .btm-line {
                display: flex;
                align-items: center;
                justify-content: space-between;
                span {
                    display: inline-block;
                    @extend .grey-text;
                    &:last-child {
                        margin-left: 10px;
                    }
                }
                @mixin btn-shape($bg: #3468fe, $color: #fff) {
                    padding: 7px 34px;
                    border-radius: 8px;
                    font-size: 14px;
                    background: $bg;
                    color: $color;
                }
                .apply-btn {
                    @include btn-shape;
                    cursor: pointer;
                }
                .no-click {
                    @include btn-shape(#24262f, #666a7a);
                    cursor: not-allowed;
                }
            }
        }
    }
}
</style>
