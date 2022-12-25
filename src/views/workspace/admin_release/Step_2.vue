<template>
    <div class="custom_card-box" style="margin-bottom: 20px;">
        <div class="admin_release-title" style="margin-bottom: 30px;">
            <svg-icon className="title-icon" iconClass="icon_work-library" :size="24"></svg-icon>
            托管预算
        </div>
        <div class="admin_release-title2" style="margin-bottom: 20px;">
            <div class="title-point" style="background: #3468FE;; "></div>
            {{formData.title || '标题'}}
        </div>
        <div class="admin_release-detail">
            <div class="admin_release-detail-item" style="display:flex; align-items:center;">
                <span>招募总预算：</span>
                <span class="all-price">{{priceTotal}}</span>
                <span class="background_icon-money"></span>
            </div>
            <div class="admin_release-detail-item">
                <span>工种数量：</span>
                <span style="font-size: 16px; color: #ffffff; font-weight:bold;">{{formData.categoryItems?.length}}</span>
            </div>
            <div class="admin_release-detail-item">
                <span>报名截止：</span>
                <span style="font-size: 16px; color: #ffffff; font-weight:bold;">{{formData.endDate}}</span>
            </div>
        </div>

        <el-row :gutter="20" style="margin-bottom: 10px;">
            <template v-if="formData.sourceIdItems">
                <el-col :span="8" style="margin-bottom: 20px;" v-for="(item,index) in formData.categoryItems" :key="index">
                    <div class="work_type-item" :class="{'sex-man': item.sex == 1,'sex-girl':  item.sex == 2,}">
                        <div class="work_type-item-title">
                            <span class="type">{{formatType(item.categoryId)}}</span>
                            <span class="context">{{item.title}}</span>
                        </div>
                        <div class="work_type-item-price">
                            <span>招募预算：</span>
                            <span style="color:#F88212; font-size: 18px; font-weight: 500; ">{{item.budgetPrice}}</span>
                            <span class="background_icon-money"></span>
                        </div>
                        <div class="work_type-item-sex">
                            <svg-icon iconClass="icon_man" :size="14" v-if="item.sex == 1"></svg-icon>
                            <svg-icon iconClass="icon_girl" :size="14" v-else-if="item.sex == 2"></svg-icon>
                            <svg-icon iconClass="icon_sex" :size="14" v-else></svg-icon>
                        </div>
                    </div>
                </el-col>
            </template>
            <!-- <el-col :span="8">
                <div class="work_type-item sex-man">
                    <div class="work_type-item-title">
                        <span class="type">配音</span>
                        <span class="context">配合主唱歌手和音</span>
                    </div>
                    <div class="work_type-item-price">
                        <span>招募费用：</span>
                        <span style="color:#FFC800; font-size: 18px; font-weight: 500; ">1090</span>
                        <span class="background_icon-money"></span>
                    </div>
                    <div class="work_type-item-sex">
                        <svg-icon iconClass="icon_man" :size="14"></svg-icon>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="work_type-item sex-girl">
                    <div class="work_type-item-title">
                        <span class="type">配音</span>
                        <span class="context">配合主唱歌手和音</span>
                    </div>
                    <div class="work_type-item-price">
                        <span>招募费用：</span>
                        <span style="color:#FFC800; font-size: 18px; font-weight: 500; ">1090</span>
                        <span class="background_icon-money"></span>
                    </div>
                    <div class="work_type-item-sex">
                        <svg-icon iconClass="icon_man" :size="14"></svg-icon>
                    </div>
                </div>
            </el-col> -->
        </el-row>
        <div class="admin_release-title2" style="margin-bottom: 16px;">
            <div class="title-point" style="background: #3468FE;"></div>
            需求描述
        </div>
        <div class="admin_release-demand">
            <pre style="margin: 0; word-break:break-all;" >{{formData.content}}</pre>
        </div>
        <div class="admin_release-title" style="margin-bottom: 20px; font-size: 16px;">
            <svg-icon className="title-icon" iconClass="icon_enclosure" :size="24"></svg-icon>
            相关附件
        </div>
        <template v-for="(item,index) in formData.sourceIdItems" :key="index" v-if="formData.sourceIdItems">
            <div class="upload-attachment-item">
                <div class="upload-attachment-icon">
                    <FileType :size="34" :type="item.fileFormat"></FileType>
                </div>
                <div class="upload-attachment-name">{{item.title}}</div>
                <!-- <div class="upload-attachment-btn" style="color: red;" @click="handleDeleteFile(index)">删除</div> -->
            </div>
        </template>
    </div>

    <div class="rad-box">
        <div class="rad">
            <div class="admin_release-title2 gap" style="margin-bottom: 16px;">
                冻结保证金，免费发布
            </div>
            <div style="padding-left:24px; user-select: none;">
                <div class="admin_release-clause"><span class="nike"></span>无需提前全款支付，享受无限次免费发布招募需求</div>
                <div class="admin_release-clause"><span class="nike"></span>保证金可随时解冻，退款实时到账，无需手续费</div>
                <div class="admin_release-clause"><span class="nike"></span>如违反雇主行为规范，保证金将进行扣除</div>
            </div>
        </div>
        <div class="admin_release-bond">
            <span v-if="!margin" class="txt">
                <span>您未缴纳</span>
                <span style="color:#F88212;  font-size: 28px; font-weight: 500; "> 99</span>
                <span class="background_icon-money"></span>
                <span> 保证金，是否</span>
                <span class="fee-btn" @click.stop="handlePayMargin">立即缴纳</span>
            </span>
            <span v-else class="txt">您已缴纳保证金</span>
        </div>

    </div>
    <div class="rad-box">
        <div class="rad" style="position:relative;">
            <div class="admin_release-title2 gap" style="margin-bottom: 16px;">
                冻结全款预算，置顶发布
            </div>
            <div style="padding-left:24px; user-select: none;">
                <div class="admin_release-clause"><span class="nike"></span>可享受招募置顶发布</div>
                <div class="admin_release-clause"><span class="nike"></span>系统智能分配给对应工种，吸引更多创作者报名</div>
                <div class="admin_release-clause"><span class="nike"></span>置顶发布需承诺在报名周期内选定创作者</div>
            </div>
    
            <div class="admin_release-check" :class="{active: isPayBudget}" @click.stop="isPayBudget = !isPayBudget">
                <el-icon><Select /></el-icon>
            </div>
        </div>
        <div class="btm-info">
            <div class="admin_release-price">
                <span>招募总预算：</span>
                <span style="color:#F88212; font-size: 28px; font-weight: 500; ">{{priceTotal}}</span>
                <span class="background_icon-money"></span>
            </div>
            <div class="admin_release-budget">
                <span>可用余额：</span>
                <span style="font-size:28px; font-weight: 500; color:#F88212;">{{balance}}</span>
                <span class="background_icon-money"></span>
                <span class="recharge-btn" @click="handleRecharge">立即购买</span>
            </div>
        </div>
    </div>

    <div class="custom_card-box" style="position:relative; display:flex; align-items:center; justify-content:space-between">
        <div class="admin_release-agreement" :class="{active:isAgreement}">
            <!-- <el-icon :size="18"><Select /></el-icon> -->
            <el-checkbox v-model="isAgreement" @change="showReader($event,articleId)" size="large" style="margin-right:10px" />
            我已阅读并同意
            <span @click.stop="showReader(true,'1587410203482427394')" style="color: #3468FE; cursor: pointer; user-select: none;">《共享经济服务协议》</span>
            <span>及</span>
            <span @click.stop="showReader(true,'1592853677911150593')" style="color: #3468FE; cursor: pointer; user-select: none;">《雇主行为规范协议》</span>
        </div>
        <div>
            <el-button type="primary" round plain class="admin_release-button pre-button" size="large" :disabled="loadingStatus" @click="handlePrevious">上一步</el-button>
            <el-button type="primary" round color="#3468FE" class="admin_release-button" size="large" :loading="loadingStatus" @click="handleSubmit">提交</el-button>
        </div>
    </div>
    <OrderDialog title="缴纳保证金" @onSubmit="handleSuccessPayMargin" ref="OrderDialogRef"></OrderDialog>
    <OrderDialog title="缴纳全款预算" @onSubmit="handleSuccessPayBudget" ref="BudgetDialogRef"></OrderDialog>
    <!-- 协议阅读 -->
    <ProtocolPopup ref="protocolRef" @readCallback="readCallback" width="40vw" :articleId="articleId"  :seconds="0"></ProtocolPopup>
</template>
<script>
import { useStore } from 'vuex'
import { computed, defineComponent, getCurrentInstance, nextTick } from 'vue'
import FileType from '../components/FileType'
import OrderDialog from '../components/OrderDialog'
import ProtocolPopup from '@/components/ProtocolPopup'
import { getMarginPay } from '@/api/personnel/personnelManage.js'
import { recruitRelease } from "@/api/personnel/recruitmentWall";
import { ElMessage } from 'element-plus'
const emits = ['next'];
const components  = {
    FileType,
    OrderDialog,
    ProtocolPopup
}
const setup = (prop, { emit }) => {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const isPayBudget = ref(false);
    const OrderDialogRef = ref();
    const BudgetDialogRef = ref();
    const margin = computed(()=> store.state.user.margin)
    const balance = computed(()=> store.state.user.money)
    const articleId = ref('1587410203482427394');
    const formData = ref(null)
    formData.value = store.state.workspace.formData

    const isAgreement = ref(false)
    let readFlag = window.localStorage.getItem('isReadReleaseProtocol') == 'true' ? true : false
    isAgreement.value = readFlag

    const priceTotal = computed(() => {
        const categoryItems = formData.value.categoryItems || [];
        if(!categoryItems.length){ return 0 }
        return categoryItems.reduce((sum, item, index) => {
            return sum + parseInt(item.budgetPrice);
        }, 0)
    })
    const categoryList = computed(() => store.state.workspace.categoryList);
    // 格式化工种类型
    const formatType = (e)=>{
        let name;
        for(const item of categoryList.value){
            if(item.id == e){
                name = item.title;
                break;
            }
        }
        return name?.substr(0,2) || '其他';
    }
    // 充值
    const handleRecharge = ()=>{
        proxy.$pay.openRecharge();
    }
    // 查看文件
    const handleViewFile = (e)=>{
        // if(e){
        //     proxy.$viewFile.open({
        //         current: 0,
        //         fileList:[e]
        //     })
        // }else{
        //     ElMessage.warning('改格式不支持预览')
        // }
    }
    // 缴纳保证金
    const handlePayMargin = ()=>{
        getMarginPay().then(res=>{
            OrderDialogRef.value.open({
                order: res.data.payOrderNo,
                price: res.data.price,
                payName: '保证金'
            })
        })
    }
    // 保证金缴纳成功
    const handleSuccessPayMargin = ()=>{
        store.commit('SET_MARGIN',1)
        ElMessage.success('成功缴纳保证金')
    }
    // 上一步
    const handlePrevious = ()=>{
        emit('next',{step:0})
    }
    const loadingStatus = ref(false);
    // 提交
    const submitResult = ref({});
    const handleSubmit = ()=>{
        if(!isAgreement.value){
            protocolRef.value.isShow = true
            return
        }
        if(!margin.value){
            ElMessage.error('请先缴纳保证金');
            return
        }
        loadingStatus.value = true;
        const data = {
            ...formData.value,
            payment: Number(isPayBudget.value),
        }
        recruitRelease(data).then(res=>{
            loadingStatus.value = false;
            store.dispatch('workspace/delFormData');
            if(isPayBudget.value){
                BudgetDialogRef.value.open({
                    order: res.data.payOrderNo,
                    price: res.data.price,
                    payName: '全款预算'
                })
                submitResult.value = res;
            }else{
                emit('next',{step:2,id:res.data.recruitId});
            }
        }).catch(err=>{
            loadingStatus.value = false;
        })
    }
    // 成功支付全款预算
    const handleSuccessPayBudget = ()=>{
        const res = submitResult.value;
        emit('next',{step:2,id:res.data.recruitId});
    }
    // 展示阅读弹窗
    const protocolRef = ref()
    const showReader = (visible = false,e)=> {
        articleId.value = e;
        nextTick(()=>{
            // 未读或直接点协议时弹出
            if (isAgreement.value || visible) {
                protocolRef.value.isShow = true
            } else {
                // 已读再点击则取消选中
                isAgreement.value = false
                window.localStorage.setItem('isReadReleaseProtocol', false)
            }
        })
    }
    // 阅读完成回调
    const readCallback = ()=> {    
        isAgreement.value = true
        window.localStorage.setItem('isReadReleaseProtocol', true)
    }
    return {
        margin,
        balance,
        formData,
        articleId,
        showReader,
        priceTotal,
        formatType,
        isPayBudget,
        protocolRef,
        isAgreement,
        categoryList,
        handleSubmit,
        readCallback,
        loadingStatus,
        handleViewFile,
        handlePrevious,
        OrderDialogRef,
        handleRecharge,
        handlePayMargin,
        BudgetDialogRef,
        handleSuccessPayMargin,
        handleSuccessPayBudget,
    }
}
export default defineComponent({
    setup,
    emits,
    components,
})
</script>

<style scoped lang="scss">
.admin_release-title {
    font-size: 18px;
    margin-bottom: 10px;
    padding-left: 24px;
    position: relative;
    .title-icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .title-point {
        width: 6px;
        height: 6px;
        border-radius: 10px;
        left: 9px;
        top: 9px;
        position: absolute;
    }
}
.rad-box {
    margin-bottom: 20px;
    .rad {
        padding: 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52,48,227,0.05);
    }
    .admin_release-bond {
        text-align: right;
        font-size: 14px;
        // color: #e0e0e0;
        padding: 20px;
        background-color: #23242D;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        .txt {
            // color: #868890;
            .fee-btn {
                margin-left: 10px;
                padding: 6px 16px;
                border-radius: 16px;
                background-color: #242A41;
                color: #3468FE;
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
    .btm-info {
        display: flex;
        justify-content: space-between;
        background-color: #23242D;
        padding: 20px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
}
.admin_release-title2 {
    font-size: 16px;
    margin-bottom: 10px;
    padding-left: 24px;
    user-select: none;
    position: relative;
    .title-point {
        width: 6px;
        height: 6px;
        border-radius: 10px;
        left: 9px;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }
}
.gap {
    padding-bottom: 20px;
    border-bottom: 1px solid rgb(119, 116, 118, .5);
}
.admin_release-detail {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px;
    background: #18191e;
    font-size: 14px;
    color: #8d91a3;
    border-radius: 10px;
    margin-bottom: 30px;
    &-item {
        flex: none;
        .all-price {
            font-weight: 500;
            color: #F88212;
            font-size: 22px;
        }
    }
}
.work_type-item {
    padding: 20px;
    background: #24262f;
    border-radius: 10px;
    border-top: 4px solid rgba($color: #18bd93, $alpha: 0.3);
    position: relative;
    &-title {
        font-size: 14px;
        margin-bottom: 20px;
        .type {
            color: #3468fe;
            background: rgba($color: #3468fe, $alpha: 0.1);
            border-radius: 6px;
            width: 43px;
            height: 20px;
            display: inline-block;
            text-align: center;
            margin-right: 10px;
        }
    }
    &-price {
        font-size: 14px;
        color: #8d91a3;
        display: flex;
        align-items: center;
    }
    &-sex {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 10px;
        color: #18bd93;
        background: rgba($color: #18bd93, $alpha: 0.1);
        right: 10px;
    }
    &.sex-man {
        border-color: rgba($color: #7cb5ec, $alpha: 0.3);
        .work_type-item-sex {
            color: #7cb5ec;
            border-color: rgba($color: #7cb5ec, $alpha: 0.1);
        }
    }
    &.sex-girl {
        border-color: rgba($color: #d10573, $alpha: 0.3);
        .work_type-item-sex {
            color: #d10573;
            border-color: rgba($color: #d10573, $alpha: 0.1);
        }
    }
}
.admin_release-demand {
    padding: 20px;
    border-radius: 10px;
    background: #17181e;
    margin-bottom: 20px;
}
.upload-attachment-item {
    background: #181920;
    border-radius: 8px;
    padding: 6px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    &:last-child {
        margin-bottom: 0;
    }
    .upload-attachment-icon {
        flex: none;
        border-radius: 4px;
        overflow: hidden;
        background: #202020;
    }
    .upload-attachment-name {
        flex: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #676c7f;
        font-size: 12px;
        padding: 0 10px;
    }
    .upload-attachment-btn {
        font-size: 12px;
        margin-right: 10px;
        user-select: none;
        cursor: pointer;
        color: #676c7f;
        &.delete {
            color: #b71d3e;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
.admin_release-clause {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 10px;
    color: #8d91a3;
    &:last-child{
        margin-bottom: 0px;
    }
    .nike {
        display: inline-block;
        width: 10px;
        height: 5px;
        margin-right: 4px;
        border-left: 2px solid green;
        border-bottom: 2px solid green;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }
}

.admin_release-budget {
    text-align: right;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    user-select: none;
    .recharge-btn {
        font-size: 14px;
        color: #3468fe;
        padding: 6px 16px;
        border-radius: 30px;
        background-color: #242A41;
        display: inline-block;
        margin-left: 20px;
        cursor: pointer;
    }
}
.admin_release-price {
    // position: absolute;
    right: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
}
.admin_release-check {
    position: absolute;
    left: 20px;
    top: 22px;
    width: 18px;
    height: 18px;
    // border: 1px solid rgba($color: #ffffff, $alpha: 0.2);
    border-radius: 20px;
    background: #4e5262;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8d91a3;
    &.active {
        background: #3468fe;
        border-color: #3468fe;
        color: white;
        
    }
}
.admin_release-agreement {
    color: #8d91a3;
    font-size: 14px;
    display: flex;
    cursor: pointer;
    align-items: center;
    user-select: none;
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
        background-color: #3468fe;
        border: 1px solid #3468fe;
    }
    .el-icon {
        padding: 2px;
        border-radius: 30px;
        margin-right: 10px;
        background: #4e5262;
    }
}
.admin_release-button {
    width: 150px;
    font-size: 16px;
    &.pre-button {
        --el-button-text-color: #3468fe;
        --el-button-bg-color: rgba(52, 104, 254, 0.13);
        --el-button-border-color: rgba(52, 104, 254, 0.13);
        --el-button-hover-bg-color: #3468fe;
        --el-button-hover-border-color: #3468fe;
        --el-button-hover-text-color: #ffffff;
    }
}
</style>