<template>
  <div class="tree">
    <div
      class="box"
      :class="{box1: layer.length===1,'active-bg': (layer.length===1 && activeId==item.id)}"
      v-contextmenu:contextmenuRef
      @click="handleNodeClick"
      @dblclick="handleNodeDbClick"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
    >
      <div v-if="layer.length > 1" class="c-icon branch-icon"></div>
      <div
        class="box2"
        :class="{'active-bg': activeId==item.id, box3: layer.length > 1}"
        :style="{width: layer.length > 1?`calc(100% - 29px)`:'100%',paddingRight:'4px'}"
      >
        <div :class="['c-icon', 'folder-icon']"></div>
        <div v-if="showRename">
          <el-input
              ref="renameRef"
              style="width: 100%;"
              maxlength="30"
              v-model="renameInput"
              placeholder="输入文件夹名称"
              @blur="handleRenameSubmit"
              @click.stop=""
            />
        </div>
        <div v-else class="label">{{ item[label] }}</div>
        
        <!-- <div class="load" v-if="loading_status">loading...</div> -->

        <!-- <div
          v-show="hoverId === item.id"
          class="c-icon icon-operate"
          @click.stop=""
          v-contextmenu:contextmenuRef="{ trigger: 'click' }"
        ></div>
        <div v-show="hoverId !== item.id" class="count">
          {{item.childrens?.length}}
        </div> -->
      </div>
    </div>

    <transition name="tree">
      <div class="drop-list" v-show="show_next">
        <div class="add-box" v-show="showAddFolder">
          <i class="c-icon icon-folder"></i>
          <el-input
            ref="addRef"
            style="width: calc(100% - 24px);"
            maxlength="30"
            v-model="folderName"
            placeholder="输入文件夹名称"
            @blur="handleAddSubmit"
          />
        </div>
        <template v-for="(child, index) in item[children]"  :key="index">
          <Tree :item="child" :layer="[...layer, index]" />
        </template>
      </div>
    </transition>

    <v-contextmenu :width="140" ref="contextmenuRef">
			<!-- <v-contextmenu-item @click="handleShare">
				分享
			</v-contextmenu-item> -->
			<v-contextmenu-item @click="handleNewFolder">
        <i class="c-icon icon-newFolder"></i>
				新建子文件夹
			</v-contextmenu-item>
			<v-contextmenu-item @click="handleRename">
        <svg-icon iconClass="icon_renamed" :size="20" ></svg-icon>
				重命名
			</v-contextmenu-item>
			<v-contextmenu-item @click="handleDelete">
        <svg-icon iconClass="icon_delete" :size="20" ></svg-icon>
				删除
			</v-contextmenu-item>
		</v-contextmenu>
  </div>
</template>
<script setup>
import { computed, inject, nextTick } from '@vue/runtime-core';
import { ElMessage } from 'element-plus'

const props = defineProps({
  item: {
    type: Object
  },
  layer: {
    type: Array
  }
})

const route = useRoute();
const store = useStore()
const contextmenuRef = ref('')
const label = inject('label')
const children = inject('children')
const lazy = inject('lazy')
const load = inject('load')
const nodeClick = inject('nodeClick')
const newFolder = inject('newFolder')
const onDetele = inject('onDetele')
const onRename = inject('onRename')
const updateData = inject('updateData')
const hoverId = inject('hoverId')
const setHoverId = inject('setHoverId')

const is_open = ref(false) //是否打开下一级
const loading = ref(false) //是否加载中
const loaded = ref(false) //是否加载完毕
const showAddFolder = ref(false)
const folderName = ref('新建文件夹')

const breadcrumbs = computed(()=>{
  return store.state.clouddisk.breadcrumbs;
})

const activeId = computed(()=>{
  const length = breadcrumbs.value?.length
  return (route.path.includes('media/folder') && length > 0) ? breadcrumbs.value[length - 1].id : 0
})

const show_next = computed(() => {
  //是否显示下一级
  if (is_open.value === true && (loaded.value === true || lazy === false)) {
    return true;
  } else {
    return false;
  }
})

const loading_status = computed(() => {
  //控制loading...显示图标
  if (!lazy) {
    return false;
  } else {
    if (loading.value === true) {
      return true;
    } else {
      return false;
    }
  }
})

async function handleNodeClick() {
  if (lazy) {
    if (loaded.value) {
      //已经加载完毕
      is_open.value = !is_open.value;
      nodeClick({node: props.item, layer: props.layer})
      return false;
    }
    if (loading.value) {
      //正在加载中
      return false;
    }
    loading.value = true;
    const resolve = (data) => {
      is_open.value = !is_open.value;
      loading.value = false;
      loaded.value = true;
      updateData({ data, layer: props.layer });
    };
    const data = { ...props.item, layer: props.layer.length, layerArr: props.layer };
    await load(data, resolve);
  } else {
    is_open.value = !is_open.value;
  }
}

// 点击新建文件夹
const addRef = ref('')
async function handleNewFolder() {
  console.log('layer--', props.layer);
  if (lazy && !loaded.value && !loading.value) {
    await handleNodeClick()
  } else {
    is_open.value = true
  }
  showAddFolder.value = true
  nextTick(() => {
    addRef.value.select()
  })
}

function handleAddSubmit() {
	if (folderName.value === '') {
		ElMessage.error('文件夹名称不能为空')
		// addRef.value.focus()
		return
	}
  const data = {
    parentId: props.item.id,
    name: folderName.value,
    layer: props.layer
  }
  newFolder(data).then(res => {
		showAddFolder.value = false
		folderName.value = '新建文件夹'
  })
}

// 双击重命名
function handleNodeDbClick() {
  handleRename()
}

// 重命名点击
const renameRef = ref('')
const showRename = ref(false)
const renameInput = ref('')
function handleRename() {
  showRename.value = true
  renameInput.value = props.item.name
  nextTick(() => {
	  renameRef.value.select()
  })
}

// 重命名提交
function handleRenameSubmit() {
  if (renameInput.value === '') {
		ElMessage.error('文件夹名称不能为空')
		return
  }
  if (renameInput.value === props.item.name) {
    showRename.value = false
    renameRef.value.blur()
    return
  }
  const data = {
    id: props.item.id,
    name: renameInput.value,
    layer: props.layer
  }
  onRename(data).then(() => {
    showRename.value = false
    renameInput.value = ''
    renameRef.value.blur()
  })
}

function handleDelete() {
  onDetele(props.item, props.layer)
}

function handleMouseenter() {
  setHoverId(props.item.id)
}

function handleMouseleave() {
  setHoverId(0)
}

</script>
<script>
export default {
  name: "Tree",
};
</script>
<style lang="scss" scoped>
.tree{
  width: 100%;
}
.load {
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
}
.box{
  width: 100%;
  height: 40px;
  margin-bottom: 4px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  cursor: pointer;
  color:#9094A6;
  overflow: hidden;
}
.box1{
  width: 100%;
  height: 40px;
}
.box2{
  width: 100%;
  display: flex;
  align-items: center;
}
.box::before {
  width: 0;
  height: 0;
  content: "";
  clear: both;
  cursor: pointer;
}
.label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  font-size: 14px;
  margin-left: 5px;
}
.drop-list {
  width: 100%;
  padding-left: 10px;
}

.c-icon{
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  background-size: 100%;
  flex-shrink: 0;
}
.branch-icon{
  background-image: url("@/assets/icons/clouddisk/icon_branch@2x.png");
}
.folder-icon{
  background-image: url("@/assets/icons/clouddisk/icon_folder@2x.png");
}

.box1:hover, .box3:hover, .active-bg{
  height: 40px;
  color: #ffffff;
  background-color: #30323B;
  border-radius: 8px;
}

.icon-operate{
  background-image: url("@/assets/icons/clouddisk/icon_edit.png@2x.png");
}

.icon-newFolder{
  width: 22px;
  height: 22px;
  background-image: url("@/assets/icons/clouddisk/icon_new build@2x.png");
}

.add-box{
  height: 40px;
  margin-bottom: 4px;
  padding-right: 8px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.icon-folder{
  width: 24px;
  height: 24px;
  background-image: url("@/assets/icons/clouddisk/icon_folder@2x.png");
}

.count{
  width: 24px;
  display: flex;
  justify-content: center;
  font-size: 12px;
}

.tree-enter-active, .tree-leave-active{
  transition: opacity .2s ease,transform .2s ease;
}
.tree-enter-from, .tree-leave-to{
  transition: .3s;
  height: 0;
  opacity: 0;
}
.tree-enter-to, .tree-leave-from{
  transition: .3s;
  height: 100%;
  opacity: 1;
}
</style>