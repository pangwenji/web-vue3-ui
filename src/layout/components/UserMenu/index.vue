<template>
    <div class="avatar-container" v-popover="popoverRef" ref="buttonRef" v-click-outside="onClickOutside">
        <div class="avatar-wrapper" >
            <img :src="getters.avatar"  class="user-avatar" />
            <!-- <span>{{getters.name}}</span> -->
            <!-- <el-icon><caret-bottom /></el-icon> -->
        </div>
        <el-popover ref="popoverRef" @show="getCloudData" popper-class="popover-user-container" width="230px" trigger="click" :hide-after="0" virtual-triggering persistent>
            <div class="popover_wrapper" >
                <el-avatar :src="getters.avatar" class="user-avatar" />
                <div class="popover_user-info">
                    <div class="nickName">{{getters.name}}</div>
                    <div class="phone">{{getters.phonenumber || '-'}}</div>
                </div>
                <!-- <el-icon><caret-bottom /></el-icon> -->
            </div>
            <div class="popover_user-upgrade"  @click="handleGo('/user/center/member')">
                <el-button type="primary" round>会员服务 <span style="font-size: 10px;margin-left: 10px;color: #fff500;">可升级</span> <span style="font-size: 10px;margin-left: 5px;color: #fff500;">↑</span></el-button>
            </div>
            <div class="popover_user-line"></div>
            <div class="popover_user-memory popover_hover-effect" @click="handleGo('/user/center/account')">
                <div class="info">
                    <div class="title">空间总量</div>
                    <div class="memory">{{formatSize(usedSize)}}/{{formatSize(totalSize)}}</div>
                </div>
                <el-progress :show-text="false" color="#3468FE" :stroke-width="4" :percentage="percentage" />
            </div>
            <div class="popover_user-memory popover_hover-effect"  @click="handleGo('/user/center/account')">
                <div class="info">
                    <div class="title">同钱余额</div>
                    <div class="memory">
                        <svg-icon iconClass="icon_doudou"></svg-icon>
                       <span>{{money}}</span>
                    </div>
                </div>
            </div>
            <div class="popover_user-line"></div>
            <router-link to="/user" tag="div" class="popover_user-menuItem popover_hover-effect" @click="buttonRef.click();" >
                个人中心
            </router-link>
            <div class="popover_user-menuItem popover_hover-effect" @click="handleGo('/help/guide')">
                帮助中心
            </div>
<!--            <div class="popover_user-menuItem popover_hover-effect"  @click="handleGo('/')">-->
            <div class="popover_user-menuItem popover_hover-effect"  @click="goOfficial">
                前往官网
            </div>
            <div class="popover_user-menuItem popover_hover-effect" @click.stop="logout">
                退出登录
            </div>
        </el-popover>
    </div>
</template>
<script setup>
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside , ElMessageBox  } from 'element-plus'
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getMyFileUserInfo } from '@/api/clouddisk/file.js'
import { formatSize } from '@/utils/tool.js'
const store = useStore();
const router = useRouter();
const getters = computed(() => store.getters);
const buttonRef = ref()
const popoverRef = ref();
const money = computed(()=>{
    return store.state.user.money;
})
const usedSize = ref(0);
const percentage = ref(0);
const totalSize = ref(0);

const onClickOutside = () => {
    unref(popoverRef).popperRef?.delayHide?.()
}

function handleGo(path) {
	router.push(path)
}

function goOfficial() {
  window.open('https://www.yingyintonghua.com/',"_blank")
}

const logout = () => {
    buttonRef.value.click();
    ElMessageBox.confirm('确定要退出系统吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'messageBox-custom-warning',
        center:true,
    }).then(() => {
        store.dispatch('LogOut').then(() => {
        // location.href = '/index';
        router.push({path: '/login'})
        })
    }).catch(()=>{});
}
// 查询网盘信息
const loadingState = ref(false);
const getCloudData = ()=>{
    if(loadingState.value){
        return
    }
    loadingState.value = true;
    getMyFileUserInfo().then(res=>{
        loadingState.value = false;
        usedSize.value = res.data.used;
        totalSize.value = res.data.totalSize;
        percentage.value = parseInt((res.data.used/res.data.totalSize) * 100);
    }).catch(err=>{
        loadingState.value = false;
    })
}
getCloudData();

</script>
<style lang="scss">
.el-popover.popover-user-container{
    padding: 0 !important;
    .popover_hover-effect{
        &:hover{
            background: #f4f4f5;
        }
    }
    .popover_user-line{
        margin: 8px 0;
        border-bottom: 1px solid #F2F2F2;
    }
    .popover_wrapper{
        width: 100%;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        padding: 16px 16px 8px;
        box-sizing: border-box;
        user-select: none;
        pointer-events: none;
        display: flex;
        .user-avatar{
            flex-shrink: 0;
        }
        .popover_user-info{
            flex-grow: 1;
            overflow: hidden;
            font-size: 14px;
            margin-left: 16px;
            // align-self: stretch;
            .nickName{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                // margin-bottom: 10px;
                font-weight: bold;
            }
            .phone{
                font-size: 12px;
                color: #4E5262;
            }
        }
    }
    .popover_user-upgrade{
        padding: 8px 16px 8px;
        .el-button{
            width: 100%;
            background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
            border: none;
        }
    }
    .popover_user-memory{
        padding: 8px 16px 8px;
        cursor: pointer;
        .info{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
            .title{
                color: #0D0D15;
                font-size: 14px;
                flex-shrink: 0;
                margin-right: 10px;
            }
            .memory{
                font-size: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #9094A6;
                *{
                    color:#F03860;
                    font-size: 16px;
                }
            }
        }
    }
    .popover_user-menuItem{
        padding: 8px 16px;
        color: #0D0D15;
        display: block;
        font-size: 14px;
        user-select: none;
        cursor: pointer;
    }
}
</style>
<style scoped lang="scss">
.avatar-container {
    margin-right: 15px;
    .avatar-wrapper {
        height: 60px;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 40px;
        }
        span {
            font-size: 14px;
            margin-left: 10px;
            color: white;
        }
        i {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
        }
    }
}
</style>
