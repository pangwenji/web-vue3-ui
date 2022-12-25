<template>
  <el-container style="height:100%;">
    <div class="right-container">
      <el-scrollbar style="width: 100%;height: 100%">
        <el-row class="right-row">
          <el-col :span="18">
            <div class="upload-list">
              <uploadSound @onChangeType="changeType" ></uploadSound>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="upload-msg">
<!--              <right-box @onOpen="handleOpen" :typeTreeList="typeTreeList" :detailsHtml="detailsHtml"></right-box>-->
              <right-box :typeTreeList="typeTreeList" ></right-box>
            </div>
          </el-col>
        </el-row>

        <!--已经移到rightBox.vue，暂时保留-->
        <el-dialog title="详情页信息" v-model="openEditor" width="60%" >
          <div>
            <requirements-edit ref="editor" v-if="showEditor" :key="data[0]?.material?.id" :editHtml="content"></requirements-edit>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" round @click="preserve">保 存</el-button>
              <el-button round @click="openEditor = false">取 消</el-button>
            </div>
          </template>
        </el-dialog>

      </el-scrollbar>
    </div>
  </el-container>
</template>
<script setup>
import MaterialLeft from "../components/MaterialLeft";
import UploadSound from "./leftBox"
import RightBox from "./rightBox";
import {useStore} from "vuex";
import {nextTick, ref, watch} from "vue";
import {getMaterialTypeTreeList} from "../../../api/material";
import RequirementsEdit from '../components/RequirementsEdit'
import {computed} from "vue";

const store = useStore();
store.commit('material/SET_menuName', 'depotMaterial')

const openEditor = ref(false)
const showEditor = ref(true)
const content = ref('')
const data = computed(() => {
  const item = store.state.material?.data
  content.value = item[0]?.material?.details
  console.log('-------------',item,content.value)
  return store.state.material?.data
})
watch(() => data[0]?.material?.id, val => {
  showEditor.value = false;
  nextTick(() => {
    showEditor.value = true;
  })
})

const typeTreeList = ref([])

function changeType(TreeList) {
  typeTreeList.value = TreeList
}

function handleOpen(value) {
  openEditor.value = value
}

const editor = ref(null)


const detailsHtml = ref('')
//保存
function preserve() {
  detailsHtml.value = editor.value.getEditor().getHtml()
  console.log('detailsHtml.value',detailsHtml.value)
  openEditor.value = false
}

</script>

<style scoped lang="scss">
.right-container {
  background-color: #000000;
  width: 100%;

  :deep(.el-scrollbar__view) {
    height: 100%;
  }

  .right-row {
    width: 100%;
    height: 100%;

    .upload-list {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .upload-msg {
      width: 100%;
      height: 100%;
      display: flex;
    }
  }
}

:deep(.el-dialog){
  border-radius: 20px;
  background-color: #2a2b32;

  .el-dialog__title {
    color: rgba(255, 255, 255, 0.8);
  }

  .dialog-footer{

    .el-button{
      width: 75px;
      height: 35px;
      //border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
    }
  }

}
</style>
