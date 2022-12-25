<template>
  <el-scrollbar ref="scroll" @scroll="ScrollFun" style="width: 100%;height: 100%; padding-bottom: 20px;">
  </el-scrollbar>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router"
import {ElMessage, ElMessageBox} from "element-plus";
import {saveUninterested} from "@/api/material";
import {secondToDate, formatSize} from '@/utils/tool.js';
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import noInterest from '@/assets/material/icon_interest.png';
import {addCollection} from "../../../../api/material/collection";
import {getVideoList} from "../../../../api/material";
import {onMounted} from "vue-demi";

const props = defineProps({
  typeName: {
    type: String,
    default: ''
  },
  total: {
    type: Number,
    default: 0
  },
  typeId: {
    type: Number,
    default: 5
  },
})


const loading = ref(true);

const pageNum = ref(1)
const total = ref(1)
const fontList = ref([])
function getData (e) {

}


//需要返回给父组件的方法,用defineExpose传递出去
defineExpose({getData})

const router = useRouter();

const emit = defineEmits(['onGetList', 'onTagsChange', 'onVideoTagChange', 'onSortChange', 'onKeywordChange', 'onGetList', 'onSucceed']);

function videoTagChange(obj) {
  emit('onVideoTagChange', obj);
}

function handleSortChange(sortType) {
  emit('onSortChange', sortType);
}

function handleKeywordChange(word) {
  emit('onKeywordChange', word);
}

onMounted(()=>{
  emit('onGetList', true)
})
const scroll = ref(null)
function ScrollFun() {
  let sta = scroll.value.wrap$
  let offsetHeight = sta.offsetHeight
  let scrollTop = sta.scrollTop
  let scrollHeight = sta.scrollHeight
  if (offsetHeight + scrollTop >= scrollHeight) {
  }
}


</script>

<style lang="scss" scoped>
@import "./style.scss";

.empty {
  width: 100%;
  min-height: calc(100% - 322px);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
