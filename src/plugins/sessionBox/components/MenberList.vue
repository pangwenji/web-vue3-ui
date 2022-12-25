<template>
    <el-dialog v-model="visibled" width="480px" :close-on-click-modal="false" :before-close="onBeforClose" :title="`群成员(${menbers.length}/${teamData.level || 0})`"  custom-class="dialog-center">
        <div style="margin-bottom: 12px;" class="search-input">
            <el-input size="large" :suffix-icon="Search" v-model="searchValue" placeholder="搜索群成员的昵称"></el-input>
        </div>
        <el-scrollbar height="360px" style="margin: 0 -20px;" view-style="padding: 0px 20px;" v-loading="loadingState">
            <el-row :gutter="20" class="team_member-list">
                <el-col :span="24" style="padding-left: 20px; padding-right: 140px" class="team_member-item" v-for="(item,index) in menberList" :key="index">
                    <el-avatar :src="item.options.avatar"></el-avatar>
                    <div class="nickName" :title="item.nickInTeam" v-if="item.nickInTeam">{{item.nickInTeam}}({{item.options.name}})</div>
                    <div class="nickName" :title="item.options.name" v-else="item.nickInTeam">{{item.options.name}}</div>
                    <template v-if="teamData.owner == account">
                        <div class="setManage" style="color: #F56C6C;" v-if="item.type == 'manager'" @click="handleSetManage(item)">移除管理员</div>
                        <div class="setManage" style="color: #409EFF;" v-else-if="item.type == 'normal'" @click="handleSetManage(item)">设为管理员</div>
                    </template>
                    <div class="subscript" style="background: #E6A23C;" v-if="item.type == 'owner'">群主</div>
                    <div class="subscript" style="background: #67C23A;" v-else-if="item.type == 'manager'">管理员</div>
                    <div class="subscript" style="background: #409EFF;" v-else >群成员</div>
                </el-col>
            </el-row>
        </el-scrollbar>
    </el-dialog>
</template>
<script>
import { ElMessage } from 'element-plus';
import { ref,defineComponent, computed } from 'vue'
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue'
const emits = ['onSubmit'];
const setup = (prop,{emit})=>{
    const store = useStore();
    const teamData = ref({})
    const menbers = ref([]);
    const visibled = ref(false);
    const loadingState = ref(false);
    const account = computed(()=> store.state.IM.account)
    const loadingSubmit = ref(false);
    const searchValue = ref('');
    const menberList = computed(()=>{
        return menbers.value.filter((item)=>{
            return item.options.name.indexOf(searchValue.value) > -1
        })
    })
    // 移除成员
    const handleDeleteMenber = ()=>{
        loadingSubmit.value = true;
        const accounts = selectMenber.value;
        const teamId = teamData.value.teamId;
        store.dispatch('IM/handleRemoveMembers',{teamId,accounts}).then(res=>{
            loadingSubmit.value = false;
            open(teamData.value);
            ElMessage.success('移除成功')
            emit('onSubmit')
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    // 设置管理员
    const handleSetManage = (item)=>{
        const teamId = teamData.value.teamId;
        const accounts = [item.account]
        const isManager = item.type == 'manager'
        loadingState.value = true;
        store.dispatch('IM/handleSetTeamManager',{teamId,accounts,isManager}).then(res=>{
            loadingState.value = false;
            menbers.value = res;
        }).catch(err=>{
            loadingState.value = false;
        })
    }
    const onBeforClose = (deno)=>{
        if(loadingState.value){ return }
        if(loadingSubmit.value){ return }
        teamData.value = {};
        menbers.value = [];
        searchValue.value = '';
        if(typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false;
        }
    }
    const open = (team)=>{
        teamData.value = team;
        loadingState.value = true;
        visibled.value = true;
        store.dispatch('IM/handleGeTeamMenber',team).then(res=>{
            console.log(res)
            loadingState.value = false;
            menbers.value = res;
        }).catch(err=>{
            loadingState.value = false;
        })
    }
    return {
        open,
        Search,
        account,
        menbers,
        visibled,
        teamData,
        menberList,
        searchValue,
        onBeforClose,
        loadingState,
        loadingSubmit,
        handleSetManage,
        handleDeleteMenber,
    }
}
export default defineComponent({
    setup,
    emits,
})
</script>
<style scoped lang="scss">
.search-input{
    &:deep(.el-input){
        --el-input-border-radius: 100px;
    }
}
.team_member-list{
    .team_member-item{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        margin: 6px 0;
        border-radius: 12px;
        padding: 0 40px;
        box-sizing: border-box;
        position: relative;

        user-select: none;
        .setManage{
            position: absolute;
            right: 60px;
            top: 50%;
            cursor: pointer;
            transform: translateY(-50%);
        }
        .subscript{
            position: absolute;
            top: 50%;
            right: 25px;
            transform: translate(50%,-50%);
            height: 18px;
            line-height: 18px;
            padding: 0px 6px;
            border-radius: 20px;
            font-size: 8px;
            color: white;
            pointer-events: none;
        }
        .nickName{
            flex: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            margin: 0 20px;
        }
    }
}
</style>