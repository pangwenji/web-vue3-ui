<template>
    <el-dialog v-model="visibled" :close-on-click-modal="false" width="530px" title="搜索联系人" :before-close="onBeforClose" custom-class="dialog-center">
        <el-input class="is-custom" style="margin-bottom: 20px;" @keypress.enter="handelSearch" v-model="context" placeholder="搜索手机号或昵称">
            <template #suffix>
                <div class="input-search-icon" @click="handelSearch">
                    <SvgIcon iconClass="icon_search" :size="20"></SvgIcon>
                </div>
            </template>
        </el-input>
        <el-scrollbar height="300px" v-loading="loadingSearch" element-loading-background="rgba(0, 0, 0, 0)" view-style="min-height:100%;">
            <template v-if="searchData.length > 0">
                <div class="search-item" v-for="(item,index) in searchData" :key="index">
                    <el-avatar :size="38" :src="item.options?.avatar"></el-avatar>
                    <div class="info">{{item.nickName}}
                        <!-- <span>(<span style="color: #3A36DB;">1366662666</span>)</span> -->
                    </div>
                    <span class="tianjia" @click="handleOpenInsert(item)" v-if="!item.contacts">
                        申请加为好友
                        <!-- <SvgIcon iconClass="icon_tianjia" :size="20"></SvgIcon> -->
                    </span>
                    <span class="contacts" v-else-if="item.contacts == 2">
                        已发送申请
                    </span>
                    <span class="contacts" v-else>
                        已加为好友
                    </span>
                </div>
            </template>
            <template v-else-if="!loadingSearch">
                <Empty style="padding: 0;" imageType="white" description="暂无搜索内容"></Empty>
            </template>
        </el-scrollbar>
    </el-dialog>
    <CreateContact ref="CreateContactRef" @onSubmit="handleSubmit"></CreateContact>
</template>
<script>
import CreateContact from './CreateContact.vue'
import { defineComponent, ref } from "@vue/runtime-core";
import { getSearchAccount } from "@/api/IM.js"
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const components = {
    CreateContact
}
const setup = () => {
    const store = useStore();
    const visibled = ref(false);
    const CreateContactRef = ref();
    const context = ref('');
    const searchData = ref([]);

    // 打开添加弹窗
    const handleOpenInsert = (item) => {
        CreateContactRef.value.open(item);
    }
    // 提交
    const handleSubmit = (contactUserId)=>{
        searchData.value = searchData.value.map(item=>{
            if(item.userId == contactUserId){
                item.contacts = 2;
            }
            return item;
        })
    }

    // 开始搜索
    const loadingSearch = ref(false);
    const handelSearch = () => {
        if (loadingSearch.value || !context.value) {
            return
        }
        loadingSearch.value = true;
        searchData.value = [];
        store.dispatch('IM/handleGetSearchAccount',{ keyword: context.value }).then(res => {
            loadingSearch.value = false;
            searchData.value = res;
        }).catch(err => {
            loadingSearch.value = false;
        })
    }
    // 搜索弹窗关闭之前的回调
    const onBeforClose = (deno) => {
        if (loadingSearch.value) { return }
        context.value = '';
        searchData.value = [];
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    const open = () => {
        visibled.value = true;
    }
    return {
        open,
        context,
        visibled,
        searchData,
        handelSearch,
        handleSubmit,
        onBeforClose,
        loadingSearch,
        CreateContactRef,
        handleOpenInsert,
    }
}
export default defineComponent({
    setup,
    components
})
</script>
<style scoped lang="scss">
.insert_user-box {
    &:deep(.el-form-item__label) {
        line-height: 46px;
    }
}
.input-search-icon {
    height: 100%;
    display: flex;
    color: #b8b8b8;
    align-items: center;
    cursor: pointer;
    &:hover {
        color: #3a36db;
    }
}
.search-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;

    &:deep(.el-avatar) {
        flex: none;
    }
    .info {
        flex: auto;
        font-size: 14px;
        margin: 0 20px;
    }
    .tianjia {
        flex: none;
        cursor: pointer;
        color: #3468fe;
    }
    .contacts {
        user-select: none;
        font-size: 14px;
        color: #9094a6;
    }
}
</style>