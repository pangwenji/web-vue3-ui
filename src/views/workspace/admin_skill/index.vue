<template>
    <el-scrollbar style="height: 100%;" view-style="padding: 20px; min-height:100%; position:relative;" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <div class="admin_skill-header">工种管理 <span style="font-size: 14px;">（最多只支持申请三个工种）</span></div>
        <el-row :gutter="20" v-if="listData.length > 0">
            <el-col :span="12" v-for="(item,index) in listData" :key="index">
                <div class="admin_skill-card" @click="handleToUpdate(item)">
                    <div class="title" :class="{is_setLine: item.technicalAbility == 1 && item.status == 1}">
                        {{item.categoryTitle}}
                        <div class="set-line-status" @click.stop>
                            <span style="color: #676C7F" v-if="item.state == 0">暂停接单</span>
                            <span style="color: #3468FE" v-if="item.state == 1">正在接单</span>
                            <el-switch active-color="#3468FE" :loading="item.loadingState" :active-value="1" inactive-color="#676C7F" :inactive-value="0" v-model="item.state"
                                :before-change="handleChangeSwitch(item)"></el-switch>
                            <!-- <el-dropdown trigger="click" @command="handleCommand(item,$event)">
                                <span :class="{active: item.state == 1}">
                                    {{item.state == 0?'停止接单':'正在接单'}}
                                    <el-icon class="el-icon--right">
                                        <arrow-down />
                                    </el-icon>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item :command="1">开始接单</el-dropdown-item>
                                        <el-dropdown-item :command="0">停止接单</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown> -->
                        </div>

                        <div class="admin_apply-status">
                            <span style="color: #0DA411;" class="tag-item" v-if="item.status == 1">请完善信息</span>
                            <span style="color: #E6A23C" v-if="item.status == 0">正在审核</span>
                            <template v-if="item.status == 2">
                                <el-popover :width="400" effect="dark" trigger="hover" :content="item.msg">
                                    <template #reference>
                                        <span style="color: #F56C6C;">
                                            审核失败
                                            <el-icon style="top:2px">
                                                <QuestionFilled />
                                            </el-icon>
                                        </span>
                                    </template>
                                </el-popover>
                            </template>
                        </div>
                    </div>
                    <!-- <div class="desc">{{item.title}}</div> -->
                  <div class="introduce">{{item.title || '-'}}</div>
                    <div class="admin_skill_price">
                      <div class="price">
                          <div class="price-item">
                              <div class="number">
                                  <span>{{item.quotedPrice || '0'}}</span>
                                  <span class="background_icon-money"></span>
                              </div>
                              <div class="util" v-if="item.unitName">{{item.unitName}}</div>
                              <div class="util" v-else>元</div>
                          </div>
                          <div class="price-item">
                              <div class="number">
                                  <span>{{item.price || '0'}}</span>
                                  <span class="background_icon-money"></span>
                              </div>
                              <div class="util">起做</div>
                          </div>
                          <div class="price-item">
                              <div class="number">
                                  <span style="color:#FFFFFF;">{{item.finishDay || '0'}}天</span>
                              </div>
                              <div class="util">交付</div>
                          </div>
                      </div>
                      <div class="right-img"><img src="@/assets/images/admin_skill_img.png"></div>
                    </div>
                    <div class="other">
                        <div class="other-item">成交量：<span>{{item.tradeNum}}</span></div><div class="line"></div>
                        <div class="other-item">雇主评分：<span>{{item.score}}</span></div><div class="line"></div>
                        <div class="other-item">响应速度：<span>快</span></div>
                    </div>
                    <!-- <div class="view-home">
                            <el-icon>
                                <View />
                            </el-icon>
                            <span>预览主页</span>
                        </div> -->
                </div>
            </el-col>
            <el-col :span="12" v-if="listData.length < 3">
                <div class="admin_skill-card" style="cursor: pointer;justify-content: center;" @click="handleToInsert">
                    <div class="add-icon">
                      <img src="@/assets/images/admin_skill_add.png">
                    </div>
                    <div class="add-text">添加工种</div>
                    <div class="right-img" style="bottom: 0;top: auto;"><img src="@/assets/images/admin_skill_img.png"></div>
                </div>
            </el-col>
        </el-row>
        <template v-else-if="!loadingState">
            <Empty description="暂无认证工种"></Empty>
        </template>
    </el-scrollbar>
</template>
<script setup>
import { userAuthList, talentsBUpdate } from '@/api/personnel/personnelConsole.js'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const handleWatchStatusChange = ({ noticeType, sourceData }) => {
    if (noticeType == 3) {
        for (const item of listData.value) {
            if (item.id == sourceData.info?.id) {
                item.status = sourceData.status;
                return
            }
        }
    }
}
IM_EVENT_LISTERNER.addEventListenerIM('WORKER', handleWatchStatusChange);
onUnmounted(() => {
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER', handleWatchStatusChange);
})
const router = useRouter();
const listData = ref([]);
const loadingState = ref(false);
const getData = () => {
    loadingState.value = true;
    userAuthList().then(res => {
        listData.value = res.data;
        loadingState.value = false;
    }).catch(err => {
        loadingState.value = false;
    })
}
getData();
// 编辑内容
const handleToUpdate = (item) => {
    if (item.status == 1) {
        router.push({ path: `/workspace/admin/skill_form/${item.id}` });
    } else if (item.status == 2) {
        router.push({ path: `/workspace/admin/apply`, query: { id: item.id } });
    } else {
        ElMessage.warning('正在审核中无法进行修改')
    }
}

const handleToInsert = () => {
    router.push({ path: `/workspace/admin/apply` });
}

//修改接单状态
const handleCommand = (item, state) => {
    if (state == item.state) {
        return
    }
    const userAuthenticateId = item.id
    loadingState.value = true;
    talentsBUpdate(userAuthenticateId, state).then(res => {
        loadingState.value = false;
        item.state = state;
    }).catch(err => {
        loadingState.value = false;
    })
}


// 修改接单状态
const handleChangeSwitch = (item) => {
    return function () {
        const state = item.state == 1 ? 0 : 1
        const userAuthenticateId = item.id;
        item.loadingState = true;
        return new Promise((resolve, reject) => {
            talentsBUpdate(userAuthenticateId, state).then(res => {
                item.loadingState = false;
                item.state = state;
                ElMessage.success('操作成功')
                resolve();
            }).catch(err => {
                item.loadingState = false;
                reject()
            })
        })
    }
}


</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
