<template>
  <div class="main-card">
    <el-scrollbar height="100%">
    <div>
      <top-description-card :data="headData"></top-description-card>
    </div>
    <div style="flex: 1">
      <tool-switch-panel>
        <template #useImmediately>
          <div style="min-height: 500px">

          </div>
        </template>

        <template #giveTry>
          <div style="min-height: 500px">

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
import ToolUploadDrag from '../components/ToolUploadDrag'
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

const fileChange = (row) => {
  file.value = row
}



</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
