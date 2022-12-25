<template>
  <div class="main-card">
    <el-scrollbar height="100%">
    <div>
      <top-description-card :data="headData">
        <template #format>
          支持文件格式：svg / webp / jpg
        </template>
      </top-description-card>
    </div>
    <div style="flex: 1">
      <tool-switch-panel :showTry="false" :hide-header="true">
        <template #useImmediately>
          <div style="min-height: 400px">
            <div class="img-to-png">
              <images-upload-drag
                  @changeFile="changeFile"
                  ref="imagesDrag"
                  accept=".svg,.webp,.jpg"
              >
              </images-upload-drag>
            </div>
          </div>
        </template>
      </tool-switch-panel>
    </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import ImagesUploadDrag from '../components/ImagesToPngDrag/indexc'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
const value = ref('')
const headData = ref({})
const route = useRoute()
const getToolDetail=()=>{
  toolDetail(route.query.id).then(res=>{
    headData.value=res.data;
  })
}
getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)


const changeFile = (row) => {
  file.value = row
  if (row){
    console.log(file.value.file)
  }

}

</script>
<style scoped lang="scss">
@import "./style.scss";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
