<template>
  <div class="pagination-block">
    <el-pagination
        :currentPage="currentPage"
        :page-size="pageSize"
        :page-sizes="[10,50]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="sizes,prev, pager, next, total, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :prev-text="prevText"
        :next-text="nextText"
    />
    <div class="click">确定</div>
  </div>

</template>

<script setup>
import {defineComponent, ref, computed} from "vue"
import {useStore} from "vuex";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  }
})

const store = useStore()
const components = {}

const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const prevText = ref('< 上一页')
const nextText = ref('下一页 >')
const jumperNum = ref()

const emit = defineEmits(['onSizeChange', 'onCurrentChange'])

const handleSizeChange = (val) => {
  emit('onSizeChange', val)
}

function handleCurrentChange(val) {
  emit('onCurrentChange', val)
}

</script>

<style scoped lang="scss">
.pagination-block {
  //position: absolute;
  margin-bottom: 32px;
  //bottom: 32px;
  display: flex;

}

:deep(.btn-prev) {
  width: 80px;
  height: 36px;
  background: #30323B !important;
  border-radius: 18px;
  margin-right: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #C2C7CE;
  line-height: 14px;
}

:deep(.btn-next) {
  width: 80px;
  height: 36px;
  background: #30323B !important;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 400;
  color: #C2C7CE;
  line-height: 14px;
  margin-right: 5px !important;
}

:deep(.number) {
  border-radius: 20px;
  margin-right: 8px;
  width: 36px;
  height: 36px;
  color: #C2C7CE;
  background: #191A1E;
  border: 1px solid #3468FE;
}

:deep(.el-pager li.is-active) {
  width: 36px;
  height: 36px;

  background: #3468FE !important;
}

:deep(.el-pager li) {
  width: 36px;
  height: 36px;
  color: #f0f2f5;
  background: transparent;
}

:deep(.el-input__inner) {
  //width: 50px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid #C2C7CE;
  background: #191A1E;
}
:deep(.el-pagination__jump){
  margin-left: 0;
}

.click {
  margin: auto;
  width: 80px;
  height: 36px;
  background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 21px;
}
</style>
