<template>
  <div class="tree">
    <template v-for="(item, index) in data"  :key="index">
      <Tree :item="item" :layer="[index]" class="first-layer" />
    </template>
  </div>
</template>
<script setup>
import { onMounted } from '@vue/runtime-core'
import Tree from './tree'

const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  label: {
    type: String,
    default: "label",
  },
  children: {
    type: String,
    default: "children",
  },
  lazy: {
    type: Boolean,
    default: false,
  },
  load: {
    type: Function,
    default: () => {},
  },
  nodeClick: {
    type: Function,
    default: () => {},
  },
  newFolder: {
    type: Function,
    default: () => {},
  },
  onDetele: {
    type: Function,
    default: () => {},
  },
  onRename: {
    type: Function,
    default: () => {},
  },
})

onMounted(() => {
  tree_data.value = props.data || []
})

provide('label', props.label)
provide('children', props.children)
provide('lazy', props.lazy)
provide('load', props.load)
provide('nodeClick', props.nodeClick)
provide('newFolder', props.newFolder)
provide('onDetele', props.onDetele)
provide('onRename', props.onRename)
provide('updateData', updateData)
const hoverId = ref(0)
provide('hoverId', hoverId)
provide('setHoverId', setHoverId)

function setHoverId(hid) {
  hoverId.value = hid
}

const tree_data = ref([])
function updateData(data) {
  const { data: list, layer } = data
  let result = [...props.data]
  const tmp = getTarget(layer, result)
  tmp[props.children] = list
  tree_data.value = Array.isArray(tree_data.value) ? result : result[0]

}

function getTarget(layer, result) {
  if (layer?.length == 0) {
    return result
  }
  let data_obj
  Array.from(Array(layer?.length)).reduce((cur, prev, index=0) => {
    if (!cur) return null
    if (index == 0) {
      data_obj = cur[layer[index]]
    } else {
      data_obj = cur[props.children][layer[index]]
    }
    return data_obj
  }, result)
  return data_obj
}

</script>
<style lang="scss" scoped>
.first-layer {
  // padding-left: 16px;
}
</style>