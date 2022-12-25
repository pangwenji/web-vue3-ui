<template>
    <el-dialog v-model="visibled" :close-on-click-modal="false" :before-close="onBeforClose" :title="`群成员(${menbers.length}/${teamData.level || 0})`" width="530px" custom-class="dialog-center">
        <el-scrollbar height="300px" style="margin: 0 -20px;" view-style="padding: 0px 20px;" v-loading="loadingState">
            <el-row :gutter="20" class="team_member-list">
                <el-col :span="24" style="padding-left: 60px; padding-right: 50px" class="team_member-item" :class="{active: onCheck(item) }" @click="handleCheckItem(item,index)" v-for="(item,index) in menbers" :key="index">
                    <span class="check" v-if="item.type !== 'owner'"><SvgIcon iconClass="icon_check" :size="16"></SvgIcon></span>
                    <el-avatar :src="item.options.avatar"></el-avatar>
                    <div class="nickName" :title="item.options.name">{{item.options.name}}</div>
                    <div class="subscript" style="background: #E6A23C;" v-if="item.type == 'owner'">群主</div>
                    <div class="subscript" style="background: #67C23A;" v-else-if="item.type == 'manager'">管理员</div>
                    <div class="subscript" style="background: #409EFF;" v-else >群成员</div>
                </el-col>
            </el-row>
        </el-scrollbar>
        <template #footer>
            <span>
                <el-button type="default" class="is-custom"  @click="onBeforClose">取消</el-button>
                <el-button type="primary" class="is-custom" :loading="loadingSubmit" :disabled="!selectMenber.length" @click="handleTransferMenber">确定转让</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { ElMessage } from 'element-plus';
import { ref,defineComponent } from 'vue'
import { useStore } from 'vuex';
const emits = ['onSubmit']
const setup = (prop,{emit})=>{
    const store = useStore();
    const teamData = ref({})
    const menbers = ref([]);
    const visibled = ref(false);
    const loadingState = ref(false);
    const selectMenber = ref([]);
    const onCheck = (item)=>{
        const index = selectMenber.value.indexOf(item.account)
        if(index > -1){
            return true;
        }else{
            return false;
        }
    }
    const handleCheckItem = (item)=>{
        if(item.type == 'owner'){
            return
        }else {
            selectMenber.value = [item.account]
        }
    }
    const loadingSubmit = ref(false);
    // 确定转让
    const handleTransferMenber = ()=>{
        loadingSubmit.value = true;
        const account = selectMenber.value[0];
        const teamId = teamData.value.teamId;
        store.dispatch('IM/handleTransferTeam',{teamId,account}).then(res=>{
            loadingSubmit.value = false;
            ElMessage.success('转让成功');
            emit('onSubmit',res)
            onBeforClose();
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    const onBeforClose = (deno)=>{
        if(loadingState.value){ return }
        if(loadingSubmit.value){ return }
        teamData.value = {}
        selectMenber.value = [];
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
            loadingState.value = false;
            menbers.value = res;
        }).catch(err=>{
            loadingState.value = false;
        })
    }
    return {
        open,
        onCheck,
        menbers,
        visibled,
        teamData,
        loadingState,
        loadingSubmit,
        onBeforClose,
        selectMenber,
        handleCheckItem,
        handleTransferMenber,
    }
}
export default defineComponent({
    setup,
    emits,
})
</script>
<style scoped lang="scss">
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
        cursor: pointer;
        user-select: none;
        .check{
            width: 24px;
            height: 24px;
            border-radius: 100px;
            border: 2px solid #979797;
            position: absolute;
            top: 50%;
            right: 25px;
            transform: translate(50%,-50%);
            color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &.active{
            .check{ 
                border-color: #2744F1;
                color: white;
                background: #2744F1;
            }
        }

        .subscript{
            position: absolute;
            top: 50%;
            left: 25px;
            transform: translate(-50%,-50%);
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