<template>
  <div class="move-copy-dialog">
    <el-dialog
      v-model="moveCopyShow"
      width="516px"
      :destroy-on-close="true"
      :before-close="handleClose"
      :show-close="true"
    >
    <template #title>
      <div class="my-header">
        <span v-if="type === 'move'">移动到</span>
        <span v-if="type === 'copy'">复制到</span>
        <span v-if="type === 'saveTo'">转存到</span>
      </div>
    </template>

    <template #default>
      <div v-if="type === 'saveTo'" class="copy-tabs">
        <div :class="{'active-tab': activeName === 'project'}" @click="tabChange('project')">项目</div>
        <div :class="{'active-tab': activeName === 'clouddisk'}" @click="tabChange('clouddisk')">云盘</div>
      </div>
      <div class="content-box">
        <el-scrollbar height="400px">
					<el-tree
            v-show="activeName === 'clouddisk'"
						class="filter-tree"
						:props="defaultProps"
						:load="loadNode"
            :highlight-current="true" 
						auto-expand-parent
						node-key="id"
						ref="treeRef"
						@node-click="handleNodeClick"
						lazy
					>
						<template #default="scope">
            <div
              class="el-tree-node__label"
              :class="{'check-node': scope.data.id === checkId}"
              :style="{cursor: scope.data.id === folderId?'not-allowed':''}"
            >
              <div class="node-left">
                <!-- <i class="icon-folder" color="#3841e7"></i> -->
                <el-icon :size="26" :color="scope.data.id === checkId?'#3841e7':''"><Folder /></el-icon>
                <span style="margin-left:8px;">{{ scope.data.name }}</span>
              </div>
              <!-- <el-icon v-if="scope.data.id === checkId"><Check color="#3841e7" /></el-icon> -->
            </div>
						</template>
					</el-tree>
          
          <el-tree
            v-show="activeName === 'project'"
						class="filter-tree"
						:props="treeProps"
						:load="loadNodeProject"
            :highlight-current="true"
            :default-expanded-keys="[-1,-2]"
            node-key="directoryId"
						auto-expand-parent
						ref="treeRef"
						@node-click="handleNodeClickPro"
						lazy
					>
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span style="margin-right: 8px;" v-if="data.directoryId > 0">
                  <el-icon :size="26"  v-if="node.expanded"><FolderOpened /></el-icon>
                  <el-icon :size="26" class="el-icon--left" v-else><Folder /></el-icon>
                </span>
                <span style="width:360px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ node.label  }}</span>
              </span>
            </template>
					</el-tree>
        </el-scrollbar>
      </div>
    </template>

    <template #footer>
      <div>
        <el-button class="cm-btn" @click="handleClose">取消</el-button>
        <el-button :loading="btnLoading" class="cm-btn cm-btn-confirm" type="primary" @click="handleSubmit" color="#3468FE">确定</el-button>
      </div>
    </template>
    
    </el-dialog>
  </div>
</template>
<script setup>
import { getFolderList, fileOrFolderCopy, fileOrFolderMove } from "@/api/clouddisk/file.js"
import { ElMessage, ElLoading } from 'element-plus'
import { getProjects } from "@/api/project/project.js"
import { getDirectoryList } from "@/api/project/files.js"

const { proxy } = getCurrentInstance();
const props = defineProps({
  moveCopyShow: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: '' // move copy saveTo
  },
  fileIds: {
    type: Array,
    default: []
  },
  folderId: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['moveCopyClose', 'onMoveSuccess', 'onSubmit', 'onCopySuccess'])
const activeName = ref('clouddisk')
const treeRef = ref('')
const defaultProps =  ref({
	children: 'children',
	label: 'name'
})
const checkId = ref(null)
const btnLoading = ref(false)

function handleClose() {
  emit('moveCopyClose', false)
}

const loadNode = (node, resolve) => {
  if (node.data.id === 0) return resolve([]);
  const parent_id = node.data?.id || 0
  getFolderList({parent_id}).then((res) => {
    const data = res.data.filter(el => !props.fileIds.includes(el.id))
    return resolve(data)
  })
  .catch((err) => {
    return resolve([])
  })
}

const loadingStatus = ref(false)
let projectData = {}
// 树形控件配置
const treeProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'leaf',
}
const loadNodeProject = (node, resolve) => {
  // if (node.data.id === 0) return resolve([]);
  if(node.level == 0){
    loadingStatus.value = true
    getProjects().then(res=>{
      const l1 = res.data.project
      const l2 = res.data.join
      projectData = res.data;
      const list = []
      if(l1.length > 0){
        list.push({
          label:`我的项目(${l1.length})`,
          directoryId: -1,
        })
      }
      if(l2.length > 0){
        list.push({
          label:`参与项目(${l2.length})`,
          directoryId: -2,
        })
      }
      loadingStatus.value = false;
      resolve(list)
    }).catch(err=>{
      loadingStatus.value = false;
      node.loading = false;
    })
  }else if(node.level == 1){
    const directoryId = node.data.directoryId;
    if(directoryId == -1){
      resolve(projectData.project.map(item=>{
        return {
          label:item.name,
          projectId: item.id,
          directoryId: item.directoryId,
        }
      }))
    }else if(directoryId == -2){
      resolve(projectData.join.map(item=>{
        return {
          label:item.name,
          projectId: item.id,
          directoryId: item.directoryId,
        }
      }))
    }else{
      node.loading = false;
    }
  }else{
    const parent_id = node.data.directoryId;
    const project_id = node.data.projectId;
    getDirectoryList({fill:2,parent_id,project_id}).then(res=>{
      const folders = res.data.map(item=>{
        return {
          label:item.name,
          projectId: project_id,
          directoryId:item.id,
          leaf: item.dirQuantity === 0
        }
      });
      resolve(folders)
    }).catch(err=>{
      node.loading = false;
    })
  }
}

// 获取层级
function getParent(layer, pObj) {
  if (pObj.key === undefined) {
    return layer
  }
  layer.unshift(pObj.key)
  return getParent(layer, pObj.parent)
}

// 选择目标文件夹
const layerArr = ref([])
const handleNodeClick = (data, node) => {
  layerArr.value = getParent([node.key], node.parent)
  if (props.folderId === data.id) {
    checkId.value = null
  } else {
    checkId.value = data.id
  }
}

const checkProjectId = ref(null)
// 点击节点触发的事件
const handleNodeClickPro = (data,node,element)=>{
  if(data.directoryId < 0){
    node.isCurrent = false;
    checkProjectId.value = null;
    checkId.value = null;
    return
  }
  checkProjectId.value = data.projectId;
  checkId.value = data.directoryId;
}

function handleSubmit() {
  if (checkId.value === null) {
    ElMessage({
      type: 'warning',
      message: '请先选择目标文件夹',
    })
    return;
  }

  if (props.type === 'saveTo') {
    emit('onSubmit', {directoryId: checkId.value, projectId: checkProjectId.value});
    return;
  }
  
  const params = {
    fileIds: props.fileIds,
    directoryId: checkId.value
  }

  if (props.type === 'move') {
    btnLoading.value = true
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)',
    })
    fileOrFolderMove(params).then(res => {
      ElMessage({
        type: 'success',
        message: '移动成功',
      })
      emit('onMoveSuccess', {layer: layerArr.value, data: res.data})
      handleClose()
      btnLoading.value = false
      loading.close()
    }).catch(ree => {
      ElMessage({
        type: 'error',
        message: '移动失败',
      })
      btnLoading.value = false
      loading.close()
    })
    return;
  }

  if (props.type === 'copy') {
    btnLoading.value = true
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)',
    })
    fileOrFolderCopy(params).then(res => {
      ElMessage({
        type: 'success',
        message: '复制成功',
      })
      emit('onCopySuccess', {layer: layerArr.value, data: res.data})
      handleClose()
      btnLoading.value = false
      loading.close()
    }).catch(ree => {
      ElMessage({
        type: 'error',
        message: '复制失败',
      })
      btnLoading.value = false
      loading.close()
    })
  }
}

function tabChange(name) {
  activeName.value = name
  checkProjectId.value = null
}

</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
