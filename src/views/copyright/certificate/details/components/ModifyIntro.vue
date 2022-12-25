<template>
  <div class="modify-dialog">
    <el-dialog width="500px" v-model="dialogVisible" custom-class="modify-intro-dialog" :append-to-body="false" title="修改简介">
      <div>
        <el-form>
          <el-form-item label="作品名称">
            <el-input disabled v-model="details.worksName" />
          </el-form-item>
          <el-form-item label="作品类型">
            <el-input disabled v-model="details.worksCategoryName" />
          </el-form-item>
        </el-form>
        <el-form :model="form">
          <el-form-item label="作品简介">
            <el-input 
              type="textarea"
              v-model="form.intro"
              placeholder="请输入作品简介"
              maxlength="300"
              rows="6"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-bxo">
        <el-button @click="(dialogVisible = false)">取消</el-button>
        <el-button color="#3468FE" type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { watch } from "@vue/runtime-core"


const props = defineProps({
  details: {
    type: Object,
    default: {}
  }
})
const dialogVisible = ref(false)
const form = reactive({
  intro: ''
})
const worksCategoryList = [
  {
    code: 'MODEL',
    description: '模型作品'
  },
  {
    code: 'ARCHITECTURE',
    description: '建筑作品'
  },
  {
    code: 'SOFTWARE',
    description: '计算机软件'
  },
  {
    code: 'OTHER',
    description: '其他作品'
  },
  {
    code: 'QUYI',
    description: '曲艺作品'
  },
  {
    code: 'DRAMA',
    description: '戏剧作品'
  },
  {
    code: 'DANCE',
    description: '舞蹈作品'
  },
  {
    code: 'GRAPH',
    description: '图形作品'
  },
  {
    code: 'PAINT',
    description: '美术作品'
  },
  {
    code: 'MUSIC',
    description: '音乐作品'
  },
  {
    code: 'DICTATION',
    description: '口述作品'
  },
  {
    code: 'PHOTO',
    description: '摄影作品'
  },
  {
    code: 'TEXT',
    description: '文字作品'
  },
  {
    code: 'MOVIE',
    description: '影视作品'
  }
]

function formatCategory(cat) {
  const data = worksCategoryList.find(el => el.code == cat)
  return data?.description || ''
}

function open() {
  dialogVisible.value = true
}

function close() {
  dialogVisible.value = false
}

const emit = defineEmits(['onModifyIntro'])
function handleSubmit() {
  emit('onModifyIntro', form.intro)
}

watch(()=>props.details, newVal => {
  form.intro = newVal.intro
})

defineExpose({
  open,
  close
})
</script>
<style lang="scss" scoped>
.modify-dialog {
  :deep(.el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;
    .modify-intro-dialog {
      margin: 0!important;
      border-radius: 10px;
    }
  }
  :deep(.el-form-item) {
    flex-direction: column;
    .el-form-item__label {
      text-align: left;
    }
  }

  .btn-bxo {
    margin-top: 20px;
    text-align: right;
    .el-button {
      width: 80px;
      height: 32px;
      margin-left: 14px;
      border-radius: 6px;
    }
  }
}
</style>