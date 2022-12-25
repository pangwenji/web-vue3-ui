<template>
  <div  @dragover.prevent.stop="handleDragOver($event)" @drop.prevent.stop="handleDrop" @click="emit('click')" @dragleave.prevent="handleDragLeave"  v-contextmenu:contextmenuItemRef>
    <div class="project-top-border" :style="'background:' + (dropPosition == 'top'?'#409EFF':'transparent')"></div>
    <el-tooltip effect="light" :enterable="false" :disabled="isEllipsis()" placement="top" :hide-after="0" :content="title">
      <div 
        class="project-item"
        :class="{'project-item-active': route.params.id == projectId}"
        :draggable="isDraggable" 
        @dragend.prevent.stop="handleDragEnd"
        @dragstart.stop="handleDragStart" 
        >
        <Point :type="signColor" v-if="signColor && (signColor !== 'none')" :shadown="true" custom-class="point-custom"></Point>
        <span class="title" ref="TitleContentRef">{{title}}</span>
        
        <span class="menu-btn" :class="{activite: route.params.id == projectId }" v-contextmenu:contextmenuItemRef="{trigger:'click'}">
          <el-icon>
            <more-filled />
          </el-icon>
        </span>
      </div>
    </el-tooltip>
    <div class="project-bottom-border" :style="'background:' + (dropPosition == 'bottom'?'#409EFF':'transparent')"></div>
  </div>
  <v-contextmenu :width="130" :beforeClose="contextmenuBeforeClose" ref="contextmenuItemRef">
    <v-contextmenu-item v-if="projectSetting" @click="projectSetting&&projectSetting({id:projectId,type:name})">
        <svg-icon iconClass="icon_setting" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">项目设置</span>
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleToHome">
        <svg-icon iconClass="icon_view" size="20px" ></svg-icon>
        <span style="margin-right: 4px;" v-if="projectItem.toHome == 1">取消推送首页</span>
        <span style="margin-right: 4px;" v-else>推送到首页</span>
    </v-contextmenu-item>
    <v-contextmenu-item v-if="menberDialog" :disabled="!authRule('member')" @click="menberDialog&&menberDialog(projectItem)">
        <svg-icon iconClass="icon_chegnyuanguanli" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">成员管理</span>
    </v-contextmenu-item>
    <v-contextmenu-item v-if="invitationShare" :disabled="!authRule('invite')" @click="invitationShare&&invitationShare(projectItem)">
        <svg-icon iconClass="icon_yaoqingchegnyuan" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">邀请成员</span>
    </v-contextmenu-item>
    <v-contextmenu-item>
        <svg-icon iconClass="icon_biaojiyanse" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">标记颜色</span>
      <template #sub>
        <div class="second-menu">
            <div class="second-menu-header">
                <span>标记</span>
                <Point type="none" :active="'none' == signColor || (!signColor)" hover-active @click="handleSelectColor('none')"></Point>
            </div>
            <div class="second-menu-content">
              <template v-for="(item,index) in colorTypes" :key="index">
                <Point :type="item" :active="item == signColor" hoverActive @click="handleSelectColor(item)" custom-class="point-custom"></Point>
              </template>
            </div>
        </div>
      </template>
    </v-contextmenu-item>
    <v-contextmenu-item v-if="recordProject" @click="recordProject&&recordProject(projectItem)">
        <svg-icon iconClass="icon_caozuojilu" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">操作记录</span>
    </v-contextmenu-item>
    <v-contextmenu-item v-if="cancelProject"  @click="cancelProject&&cancelProject({id:projectId})">
        <svg-icon iconClass="icon_quxiaoguidang" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">取消归档</span>
    </v-contextmenu-item>
    <v-contextmenu-item v-if="archiveProject" @click="archiveProject&&archiveProject({id:projectId})">
        <svg-icon iconClass="icon_quxiaoguidang" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">完结项目</span>
    </v-contextmenu-item>
    <v-contextmenu-item divided v-if="deleteProject" @click="deleteProject&&deleteProject({id:projectId,type:name})">
        <svg-icon iconClass="icon_delete" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">删除项目</span>
    </v-contextmenu-item>
    <v-contextmenu-item divided v-if="exitProject" @click="exitProject&&exitProject({id:projectId,name:title})">
        <svg-icon iconClass="icon_setting" size="20px" ></svg-icon>
        <span style="margin-right: 4px;">退出项目</span>
    </v-contextmenu-item>
  </v-contextmenu>
</template>
<script setup>
import { ref, computed} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { addToHome, delFormHome } from '@/api/project/project.js'
import { ElMessage } from "element-plus";
const prop = defineProps({
    name:String,
    title:String,
    active:Boolean,
    projectItem:Object,
    isDraggable:{
      type:Boolean,
      default: false,
    },
    projectId:{type:[String,Number]},
    signColor: {
      type:String,
      default:'success',
    },
    deleteProject:{   // 删除项目
      type:Function,
      default:null
    },
    invitationShare:{ // 邀请成员
      type:Function,
      default:null
    },
    projectSetting:{  // 项目管理
      type:Function,
      default:null
    },
    menberDialog:{    // 成员管理
      type:Function,
      default:null
    },
    exitProject:{     // 退出项目
      type:Function,
      default:null
    },
    archiveProject:{  // 完成项目
      type:Function,
      default:null
    },
    cancelProject:{   // 取消完成
      type:Function,
      default:null
    },
    recordProject:{   // 操作记录
      type:Function,
      default:null
    },

})
const colorTypes = [ 'red','blue','green','yellow','orange','purple']
const emit = defineEmits(['onDrop','click','onDragStart','onDragEnd']);
const route = useRoute();
const store = useStore();
const router = useRouter();
const dropPosition = ref('');
const contextmenuItemRef = ref();
const buttonRef = ref();
const TitleContentRef = ref();
const settingDialog = ref(false)
const ProjectSettingDialogRef = ref();
const InvitationShareDialogRef = ref();
// 判断是否溢出
const isEllipsis = ()=>{
  if(TitleContentRef.value){
    if(TitleContentRef.value.scrollWidth > TitleContentRef.value.clientWidth){
      return false;
    }else{
      return true;
    }
  }else{
    return true
  }
}

const authRule = (e)=>{
  if(prop.projectItem.currRoleId == 1){ // 所有者
    return true;
  }else if(prop.projectItem.currRoleId == 2){ // 管理员
    return prop.projectItem.permissions.adminPermissions.indexOf(e) > -1;
  }else{ // 成员
    return prop.projectItem.permissions.memberPermissions.indexOf(e) > -1;
  }
}

// 是否允许拖拽移入
const draggable = computed(()=>{
  return store.state.app.dragEvent == prop.name;
})

const contextmenuBeforeClose = (deno)=>{
  deno();
}

// 开始拖拽
const handleDragStart = (e)=>{
  store.commit('app/DRAG_EVENT',prop.name)
  emit('onDragStart',e)
}

// 结束拖拽
const handleDragEnd = (e)=>{
    store.commit('app/DRAG_EVENT',null);
    emit('onDragEnd',prop.projectId);
}

// 拖拽移入
const handleDragOver = (e)=>{
  if(!draggable.value){
    return
  }
  e.preventDefault();
  const offsetHeight = e.target.offsetHeight;
  const offsetY = e.offsetY;
  if(offsetY > (offsetHeight/2)){
    dropPosition.value = 'bottom'
  }else{
    dropPosition.value = 'top'
  }
}

// 拖拽离开
const handleDragLeave = (e)=>{
    dropPosition.value = '';
}
// 拖拽放下
const handleDrop = (e)=>{
    if(!draggable.value){
        dropPosition.value = '';
        return
    }
    // const json = e.dataTransfer.getData('text');
    // const obj = JSON.parse(json);
    const position = dropPosition.value;
    const module = prop.name;
    dropPosition.value = '';
    emit('onDrop',{position,module});
}

let requeLoading = false;
// 选择颜色
const handleSelectColor = (color)=>{
    if(requeLoading || prop.signColor == color){
      return
    }
    requeLoading = true;
    store.dispatch('project/handleUpdateProjectTag',{id:prop.projectId,colorTag:color,name:prop.title,type:prop.name}).then(res=>{
      requeLoading = false;
    }).catch(err=>{
      requeLoading = false;
    })
}

// 显示在首页
const handleToHome = ()=>{
  const id = prop.projectId;
  const toHome = prop.projectItem.toHome;
  if(toHome == 1){
    delFormHome({id}).then(res=>{
        prop.projectItem.toHome = 0;
        ElMessage.success('操作成功')
    })
  }else{
    addToHome({id}).then(res=>{
      prop.projectItem.toHome = 1;
      ElMessage.success('操作成功')
    })
  }
}

function settingShow() {
  settingDialog.value = true
}

function settingClose() {
  settingDialog.value = false
}

</script>
<style scoped lang="scss">

    .second-menu{
        width: 120px;
        padding: 15px;
        padding-right: 5px;
        font-size: 12px;
        .point-custom{
          margin-right: 10px;
          margin-top: 10px;
        }
        &-header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 10px;
        }
        &-close{
            width: 18px;
            height: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            box-sizing: border-box;
            &:hover{
                border: 1px solid #909399;
            }

            &.point-active-none{
                border: 1px solid #909399;
            }
        }
        &-content{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }
    }

.popover-menu {
    &-header{
        width: 100%;
        text-align: center;
        color: #909399;
        padding:10px;
    }
    &-item{
        display: flex;
        align-items: center;
        padding: 5px 10px;
        padding-right: 30px;
        position: relative;
        cursor: pointer;
        &:hover{
            background: #f4f4f5;
        }
        span{
            margin-left: 5px;
        }
        .right{
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
    }

}

@mixin steep-point (){

}
.project-top-border{
  pointer-events: none;
  position: relative;
  height:2px; 
  transform: translateY(-1px);
  @include steep-point();
}
.project-bottom-border{
  pointer-events: none;
  position: relative;
  height:2px; 
  transform: translateY(1px);
  @include steep-point();
}

.project-item {
  padding: 8px;
  padding-left: 22px;
  padding-right: 22px;
  border-radius: 6px;
  position: relative;
  color: rgba($color: #ffffff, $alpha: 0.5);
  cursor: pointer;
  .title{
      pointer-events: none;
      display: inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  .point-custom{
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.project-item-active{
    background: #ffffff10;
  }
  &:hover {
    color: white;
    background: #ffffff10;
    .menu-btn{
      display: inline-block;
    }
  }



  .menu-btn {
    display: inline-block;
    position: absolute;
    color: #A0A0A0;
    border-radius: 4px;
    right: 8px;
    top: 50%;
    display:none;
    transform: translateY(-50%) rotate(90deg);
    &:hover {
      color: #ffffff;

    }
    &.activite{
      display:inline-block;
    }
  }
}

.ElMessageBox-custom-class{

}
</style>