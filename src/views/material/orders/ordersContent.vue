<template>
    <div>
        <div v-for="(item, index) in orderList" :key="index">
            <div class="order-box">
                <div class="order-main">
                    <el-row style="width: 100%;">
                        <el-col :span="item.state === 0 ? 22 : 24">
                            <div class="left">
                                <template v-for="(item2, index2) in item.materials" :key="index2">
                                    <div style="display: flex;justify-content: space-between">
                                        <div style="display: flex;">
                                            <div v-if="item2?.typeId < 5" class="img" :style="{'background-image': 'url('+ item2?.coverUrl+')'}">
<!--                                                <img :src="play2" style="width: 40px;height: 40px;position: absolute;margin: 22%" v-if="item2?.typeId === 1 || item2?.typeId === 2 ">-->
                                            </div>
                                            <div v-if="item2?.typeId === 5 || item2?.typeId === 6" class="img2">
                                                <img :src="item2?.fileAttachedInfoDto?.cover" style="width: 100%;height: 100%;" v-if="item2.fileAttachedInfoDto.fileInfo.fileCat === 'image'">
                                                <img :src="item2?.coverUrl" style="width: 100%;height: 100%;" v-else>
                                            </div>
                                            <div v-if="item2?.typeId === 7" class="img2">
                                                <!-- <img :src="item2.fileAttachedInfoDto?.cover" style="width: 100%;"> -->
                                                <img src="@/assets/material/imge_font.png" alt="" style="width: 100%;">
                                            </div>
                                            <div class="order-title">
                                                <div class="itemTitle" @click.stop="toDetails(item2)">
                                                    <span class="title-name">{{ item2?.name }}</span>
                                                    <div class="ztag">
                                                        <img src="@/assets/material/title-tag1.png">
                                                        <img src="@/assets/material/title-tag2.png">
                                                    </div>
                                                </div>
                                                <!--<div class="num" v-if="item2?.typeId === 2">???????????????{{ item2.musicNo }}</div>-->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line" v-if="index2 !== item.materials.length-1"></div>
                                </template>
                            </div>
                        </el-col>
                        <el-col :span="2" v-if="item.state === 0" class="flexC">
                            <el-button type="primary" class="pay-botton" round @click="handlePay(item)">??????</el-button>
                        </el-col>
                    </el-row>

                </div>
                <div class="order-bottom">
                    <div class="left">
                        <div style="margin-right: 40px">???????????????{{ item.orderNo }}</div>
                        <div>???????????????{{ item.createTime }}</div>
                    </div>
                    <div class="left right">
                        <el-row style="width: 100%">
                            <el-col :span="8">
                                <div class="text">
                                    <span v-if="item.state === 1">?????????</span>
                                    <span v-else-if="item.state === 0">?????????</span>
                                    <span v-else-if="item.state === 2">?????????</span>
                                    <span v-else-if="item.state === 4">?????????</span>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text">
                                    ?????????<span style="font-size: 16px;color: #FF9F03;">{{ item.price }}</span><img src="@/assets/user/wallet/tongqian.png" style="margin-left: 3px;width: 10px;" />
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="operation-text" @click.stop="handleCancel(item, index)" v-if="item.state === 0">??????</div>
                                <div class="operation-text" @click.stop="deleteOrder(item)" v-else-if="item.state === 2 || item.state === 4 || item.state === 1">??????
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { downloadMaterial } from "@/api/material/index.js";
import { downloadZip } from '@/utils/ZipDownload';
import { ref, watch } from "vue";
import play2 from '@/assets/icons/play/play2.png'
import { cancelMaterialOrder, delOrder } from '@/api/material/order.js'
import { ElMessage, ElMessageBox } from 'element-plus';
import { downloadFile, downloadFileCurrent } from "@/utils/tool";
import { useStore } from "vuex";
// import {downloadFile} from "@/utils/tool.js"

const props = defineProps({
    orderList: {
        type: Array,
        default: []
    }
})


const emit = defineEmits(['onPay', 'onCancel', 'onGetList'])
const router = useRouter();

function handlePay(item) {
    emit('onPay', item)
}

// ????????????
const handleCancel = (item, index) => {
    ElMessageBox.confirm('?????????????????????', '??????', {
        customClass: 'messageBox-custom-warning',
        confirmButtonText: '??????',
        cancelButtonText: '??????',
        type: 'info',
    })
        .then(() => {
            cancelMaterialOrder({ id: item.id }).then(res => {
                ElMessage({
                    type: 'success',
                    message: '??????????????????',
                });
                emit('onCancel', index)
                emit('onGetList')
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '??????',
            });
        });
}
const deleteOrder = (item) => {
    ElMessageBox.confirm('?????????????????????', '??????', {
        customClass: 'messageBox-custom-warning',
        confirmButtonText: '??????',
        cancelButtonText: '??????',
        type: 'info',
    })
        .then(() => {
            delOrder(item.id).then(res => {
                ElMessage({
                    type: 'success',
                    message: '??????????????????',
                });
                emit('onGetList')
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '??????',
            });
        });
}


//???????????????
const toDetails = (item) => {
    if (item.typeId !== 7) {
        router.push({
            path: `details/${item.id}`,
        });
    } else {
        ElMessage({
            showClose: true,
            message: '??????????????????????????????',
            type: 'warning',
            duration: 800
        })
    }
};


</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
