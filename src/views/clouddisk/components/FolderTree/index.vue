<template>
  <div class="folder-tree">
    <ul v-if="treeList">
      <li v-for="(item, index) in treeList" :key="item.id">
        <div class="folder-name" @mouseenter="handleMouseEnter($event,item)" @click="handleShowFolder(item, pathIndex+'/'+index)">
          <i class="tree-icon icon-branch" v-if="isChildren"></i>
          <div class="folder-name1">
            <i class="tree-icon icon-folder"></i>
            {{item.name}}
          </div>
        </div>
        <div v-if="item.children">
          <folderTree v-show="item.show" :treeList="item.children" :isChildren="true" :pathIndex="pathIndex+'/'+index"></folderTree>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'folderTree',
  props:{
    treeList: {
      type:Object,
      default:{}
    },
    isChildren: {
      type:Boolean,
      default:false
    },
    pathIndex: {
      type:String,
      default:''
    },
  },
  computed: {
    folderList2() {
      return this.$store.state.clouddisk.folderList;
    },
  },
  methods: {
    handleMouseEnter(e,item) {
      // console.log(e);
    },
    handleShowFolder(item, index) {
      const path = index.split('/').splice(1)
      let gg = ''
      path.forEach(el => {
        gg += `[${el}]`
      });
    },
  }
}
</script>
<style scoped lang="scss">
.folder-tree{
  ul>li{
    margin-block-start: 0!important;
    margin-block-end: 0!important;
    padding: 8px 0 8px 12px;
    .folder-name{
      display: flex;
      align-content: center;
    }
    .folder-name1{
      width: 100%;
      display: flex;
      align-content: center;
    }
    .folder-name1:hover{
      background: #30323B;
      border-radius: 3px;
    }
  }
  .tree-icon{
    display: inline-block;
    width: 24px;
    height: 24px;
    background-position: 50% 50%;
    background-size: 100%;
  }
  .icon-folder{
    background-image: url("@/assets/icons/clouddisk/icon_folder@2x.png");
  }
  .icon-branch{
    background-image: url("@/assets/icons/clouddisk/icon_branch@2x.png");
  }
}
</style>
