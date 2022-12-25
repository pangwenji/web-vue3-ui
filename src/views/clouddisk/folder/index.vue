<template>
  <el-container style="height: 100%">
    <!-- <LeftSider></LeftSider> -->
    <div class="right-box">
      <CloudHeader
        v-show="!showCheck"
        ref="cloudHeaderRef"
        :layoutType="layoutType"
        :count="count"
        :createWps="true"
        @onShowInfo="handleShowInfo"
        @onSearchChange="handleSearchChange"
        @onSortChange="handleSortChange"
        @onCreateWpsSuccess="handleCreateWpsSuccess"
        @onCreateFolderSuccess="handleCreateFolderSuccess"
      ></CloudHeader>
      <CloudHeaderHandle
        v-show="showCheck"
        ref="cloudHeaderHandleRef"
        :selectFiles="selectFiles"
        :isCheckAll="isCheckAll"
        @checkAll="handleCheckAll"
        @cancelCheck="handeCancel"
        @onBatchDelete="handleBatchDelete"
        @onCopy="handleBatchCopy"
        @onMove="handleBatchMove"
        @onShare="handleShare"
        @onDownloadFiles="handleDownloadFiles"
      ></CloudHeaderHandle>

      <div class="container-box">
        <div
          v-if="folderList.length === 0 && fileList.length === 0"
          style="width: 100%; height: 100%"
        >
          <ListEmpty
            :keyWord="keyWord"
            @onUploadFiles="handleUploadFiles"
            @onUploadFolder="handleUploadFolder"
          ></ListEmpty>
        </div>
        <div v-else class="file-list-box">
          <el-scrollbar
            @click.stop="handeCancel"
            style="width: 100%"
            v-loading="loadingStatus || folderLoading"
            view-class="file-list-scrollbar"
            :style="{ height: listBoxHeight + 'px' }"
            element-loading-background="rgba(0, 0, 0, 0)"
            v-contextmenu:contextmenuRef
          >
            <div class="f-list">
              <div
                class="typetitle"
                style="margin-bottom: 10px"
                v-show="folderList.length > 0"
                @click="showFolder = !showFolder"
              >
                <span>文件夹</span>
                <el-icon v-if="showFolder"><CaretBottom /></el-icon>
                <el-icon v-else><CaretRight /></el-icon>
              </div>
              <div
                v-show="layoutType === 'list' && showFolder && folderList.length > 0"
                class="list-header"
              >
                <div class="fname">文件名</div>
                <div class="ftype">文件类型</div>
                <!-- <div class="fsize">大小</div> -->
                <div class="faddby">添加者</div>
                <div class="faddtime">添加时间</div>
                <div class="fhandle" style="width:14%;padding-right:14px;text-align: end;">操作</div>
              </div>
              <el-row v-show="showFolder" :gutter="10">
                <template v-for="(item, index) in folderList" :key="index">
                  <FileItem
                    type="folder"
                    :data="item"
                    :layoutType="layoutType"
                    :showCheck="showCheck"
                    :width="String(100 / column) + '%'"
                    :isDraggable="true"
                    :checkLength="selectFiles.length"
                    @share="handleShare"
                    @prevent="handlePrevent"
                    @copy="handleCopy"
                    @move="handleMove"
                    @delete="handleDelete"
                    @onOpenFolder="handleOpenFolder"
                    @onChangeRadio="handleFileRadio"
                    @onRename="handleRename"
                    @onCheck="handleCheck"
                    @onDragStart="handleDragStart"
                    @onDrop="handleDrop"
                  >
                  </FileItem>
                </template>
              </el-row>

              <div class="typetitle" v-show="fileList.length > 0">文件</div>
              <div
                v-if="layoutType === 'list' && fileList.length > 0"
                class="list-header"
              >
                <div class="fname">文件名</div>
                <div class="ftype">文件类型</div>
                <div class="fsize">大小</div>
                <div class="faddby">添加者</div>
                <div class="faddtime">添加时间</div>
                <div class="fhandle" style="padding-right:14px;text-align: end;">操作</div>
              </div>
              <el-row :gutter="10">
                <template v-for="(item, index) in fileList" :key="index">
                  <FileItem
                    :type="item.fileCat"
                    :data="item"
                    :layoutType="layoutType"
                    :showCheck="showCheck"
                    :width="String(100 / column) + '%'"
                    :isDraggable="true"
                    :checkLength="selectFiles.length"
                    @share="handleShare"
                    @download="handleDownloadFiles"
                    @prevent="handlePrevent"
                    @copy="handleCopy"
                    @move="handleMove"
                    @delete="handleDelete"
                    @onChangeRadio="handleFileRadio"
                    @onRename="handleRename"
                    @onCheck="handleCheck"
                    @onDragStart="handleDragStart"
                    @onDrop="handleDrop"
                  >
                  </FileItem>
                </template>
              </el-row>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <div class="right-box2">
      <transition name="fileinfo">
        <div v-show="showInfo" style="height: 100%">
          <CloudInfo
            :folderList="folderList"
            :fileList="fileList"
            :lastCheckData="lastCheckData"
          ></CloudInfo>
        </div>
      </transition>
    </div>

    <shareDialog
      v-if="shareShow"
      :shareShow="shareShow"
      :fileType="shareFileType"
      :shareData="shareData"
      @shareClose="shareClose"
      @shareSuccess="shareSuccess"
    ></shareDialog>

    <ShareInfoDialog
      v-if="shareInfoShow"
      :shareInfoShow="shareInfoShow"
      :shareInfo="shareInfo"
      @shareInfoClose="shareInfoClose"
    ></ShareInfoDialog>

    <MoveCopyDialog
      v-if="moveCopyShow"
      :moveCopyShow="moveCopyShow"
      :type="moveCopytype"
      :fileIds="fileIds"
      :folderId="folderId"
      @moveCopyClose="handleMoveCopyClose"
      @onMoveSuccess="handleMoveSuccess"
      @onCopySuccess="handleCopySuccess"
    ></MoveCopyDialog>

    <v-contextmenu :width="140" ref="contextmenuRef">
      <div v-if="selectFiles.length > 1">
        <v-contextmenu-item @click="handleShare(selectFiles)">
          <svg-icon iconClass="icon_sharing" :size="20" ></svg-icon>
          <span>分享</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleBatchCopy(selectFiles)">
          <svg-icon iconClass="icon_copy" :size="20" ></svg-icon>
          <span>复制到</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleBatchMove(selectFiles)">
          <svg-icon iconClass="icon_move-to" :size="20" ></svg-icon>
          <span>移动到</span>
        </v-contextmenu-item>
        <v-contextmenu-item v-if="!hasFolder" @click="handleDownloadFiles(selectFiles)">
          <svg-icon iconClass="icon_download" :size="20" ></svg-icon>
          <span>批量下载</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleBatchDelete2">
          <svg-icon iconClass="icon_delete" :size="20" ></svg-icon>
          <span>批量删除</span>
        </v-contextmenu-item>
      </div>
      <div v-else>
      <v-contextmenu-item @click="handleOpenDialog('Folder','新建文件夹')">
        <svg-icon className="actions-menu-icon" iconClass="icon_document2-c" :size="20"></svg-icon>
        <span>新建文件夹</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleOpenDialog('file', '新建文档', '.docx')">
        <svg-icon
          className="actions-menu-icon"
          iconClass="icon_doc-c"
          :size="20"
        ></svg-icon>
        <span>新建文档</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleOpenDialog('file', '新建表格', '.xlsx')">
        <svg-icon
          className="actions-menu-icon"
          iconClass="icon_excel-c"
          :size="20"
        ></svg-icon>
        <span>新建表格</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleOpenDialog('file', '新建演示', '.pptx')">
        <svg-icon
          className="actions-menu-icon"
          iconClass="icon_ppt-c"
          :size="20"
        ></svg-icon>
        <span>新建演示</span>
      </v-contextmenu-item>
      </div>
    </v-contextmenu>

  </el-container>
</template>

<script setup>
import LeftSider from "../components/LeftSider";
import CloudHeader from "../components/CloudHeader";
import CloudHeaderHandle from "../components/CloudHeaderHandle";
import FileItem from "../components/FileItem";
import CloudInfo from "../components/CloudInfo";
import shareDialog from '../components/ShareDialog/index'
import ShareInfoDialog from '../components/ShareInfoDialog/index'
import MoveCopyDialog from '../components/MoveCopyDialog/index.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { onUnmounted, watch } from '@vue/runtime-core';
import { deleteFile, rename, getFileDownloadUrl, getDetails, fileOrFolderMove, getFolderList } from '@/api/clouddisk/file.js';
import {reactive} from 'vue'
import { useWindowSize } from "@vueuse/core"
import cache from '@/plugins/cache'
import ListEmpty from '../components/ListEmpty'
import { downloadMulti } from '@/utils/request.js';
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore()
const route = useRoute()
const router = useRouter();

const contextmenuRef = ref('')
const folderId = ref(0)
const count = ref(0)
const listBoxHeight = ref(0)
const loadingStatus = ref(true)
const shareShow = ref(false)
const moveCopyShow = ref(false)
const moveCopytype = ref('')
const fileIds = ref([])
const moveCat = ref(null) // 移动类型
const shareInfo = ref({})
const shareFileType = ref('')
const keyWord = ref('')
const sortCheck = ref(['create_time', 'asc'])
const shareInfoShow = ref(false)
const showFolder = ref(true) // 是否展示文件夹

onMounted(() => {
  listBoxHeight.value = document.documentElement.clientHeight - 120;
  loadingStatus.value = false;
  folderId.value = route.params.id * 1 || 0;
  store.commit("clouddisk/SET_FILE_LIST_CAT", "");
  getData({ id: folderId.value });
  watchEffect(() => {
    onresize(width.value);
  });
});

// onUnmounted(() => {
// console.log(cache.session)
// cache.session.remove('sessionCloudCRUMBS')
// })

const folderList = computed(() => {
  const list = searchSort(store.state.clouddisk.folderList);
  cache.session.setJSON("FOList", list);
  return list;
});

const fileList = computed(() => {
  const list = searchSort(store.state.clouddisk.fileList);
  cache.session.setJSON("FIList", list);
  return list;
});

const folderLoading = computed(() => {
  return store.state.clouddisk.openFolderLoading;
});

const layoutType = computed(() => {
  return store.state.clouddisk.layoutType;
});

const showInfo = computed(() => {
  return store.state.clouddisk.showInfo
})

watch(route, newVal => {
  folderId.value = newVal.params.id * 1 || 0
  lastCheckData.value = {}
})

const { width } = useWindowSize();
const column = ref(4);
const onresize = (clientWidth) => {
  if (clientWidth < 768) {
    column.value = 1;
  } else if (clientWidth < 1080) {
    column.value = 2;
  } else if (clientWidth < 1280) {
    column.value = 3;
  } else if (clientWidth < 1480) {
    column.value = 4;
  } else if (clientWidth < 1680) {
    column.value = 5;
  } else if (clientWidth < 1880) {
    column.value = 6;
  } else if (clientWidth < 2080) {
    column.value = 7;
  } else if (clientWidth < 2280) {
    column.value = 8;
  } else {
    column.value = 9;
  }
  if (column.value > 1) {
    column.value = column.value - Number(showInfo.value);
  }
};

// 搜索排序
function searchSort(data) {
  const fdata = data.filter((el) => el.name.includes(keyWord.value));
  const sortType =
    sortCheck.value[0] === "create_time" ? "createTime" : sortCheck.value[0];
  const orderBy = sortCheck.value[1] === "asc" ? -1 : 1;
  fdata.sort((a, b) => {
    let x = a[sortType];
    let y = b[sortType];
    if (sortType === "name") {
      //判定比较内容是不是数值
      x = parseInt(x);
      y = parseInt(y);
      if (!(!isNaN(x) && !isNaN(y))) {
        x = a[sortType].toLowerCase();
        y = b[sortType].toLowerCase();
      }
    }
    if (x < y) {
      return 1 * orderBy;
    }
    if (x > y) {
      return -1 * orderBy;
    }
    return 0;
  });
  return fdata;
}

const treeData = computed(() => {
  return store.state.clouddisk.treeData;
});

const breadcrumbs = computed(() => {
  return store.state.clouddisk.breadcrumbs;
});

const lastBreadcrumbs = computed(() => {
  const length = breadcrumbs.value?.length || 0;
  return length > 0 ? breadcrumbs.value[length - 1] : {};
});

// watch(keyWord, newVal => {
//   console.log('newVal--', newVal);
// })

// 已选的文件/文件夹
const hasFolder = ref(false)
const selectFiles = computed(()=>{
  const data = [];
  hasFolder.value = false
  for (var key in folderList.value) {
    if(folderList.value[key].check){
      hasFolder.value = true
      data.push(folderList.value[key])
    }
  }
  for (var key in fileList.value) {
    if (fileList.value[key].check) {
      data.push(fileList.value[key]);
    }
  }
  return data;
});

const isCheckAll = computed(() => {
  return selectFiles.value.length === folderList.value.length + fileList.value.length;
});

function handleShowInfo() {
	store.commit('clouddisk/SET_SHOW_INFO', !showInfo.value)
}

const showCheck = computed(() => {
  for (var key in folderList.value) {
    if (folderList.value[key]?.check) {
      return true;
    }
  }
  for (var key in fileList.value) {
    if (fileList.value[key]?.check) {
      return true;
    }
  }
  return false;
});

const shareData = ref([]);
function handleShare(data) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  shareData.value = [];
  shareFileType.value = "";
  data.forEach((el) => {
    shareData.value.push({
      id: el.id,
      name: el.name,
    });
    if (el.fileCat === "video") {
      shareFileType.value = "video";
    }
  });
  shareShow.value = true;
}

function shareClose() {
  shareShow.value = false;
}

function handlePrevent() {}

function handleShowCheck(val) {
  showCheck.value = val;
}

function handleCopy(data) {
  fileIds.value = [data.id]
  moveCat.value = data.type
  moveCopytype.value = 'copy'
  moveCopyShow.value = true
}

function handleMove(data) {
  fileIds.value = [data.id];
  moveCat.value = data.type;
  moveCopytype.value = "move";
  moveCopyShow.value = true;
}

// 批量复制
const handleBatchCopy = (e) => {
  if (!Array.isArray(e)) {
    e = [e];
  }
  const ids = e.map((item) => item.id);
  fileIds.value = ids;
  moveCopytype.value = "copy";
  moveCopyShow.value = true;
  moveCat.value = 3;
};

// 批量移动
const handleBatchMove = (e) => {
  if (!Array.isArray(e)) {
    e = [e];
  }
  const ids = e.map((item) => item.id);
  fileIds.value = ids;
  moveCopytype.value = "move";
  moveCopyShow.value = true;
  moveCat.value = 3;
};

function handleMoveCopyClose() {
  moveCopyShow.value = false;
}

const handleDelete = (data) => {
  const text = `确定删除${
    data.type === 1 ? "文件夹" : "文件"
  } <span style="color:red;">"${data.name}"</span>？删除后${
    data.type === 1 ? "文件夹" : "文件"
  }将被移至回收站。`;
  const title = `删除`;
  ElMessageBox.confirm(text, title, {
    customClass: "messageBox-custom-warning",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
    showClose: true,
    center: true,
    dangerouslyUseHTMLString: true,
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
        deleteFile({id: data.id}).then(res => {
          if (data.type===1) {
            
            // ===删除tree
            if (treeData.value.length > 0) {
              let pchildren = treeData.value
              breadcrumbs.value.forEach(el => {
                const list = pchildren.find(el1 => el1.id === el.parentId)
                pchildren = list?.childrens || []
              })
              const dindex = pchildren.findIndex(el => el.id === data.id)
              pchildren.splice(dindex, 1)
            }
            // ===删除tree

            store.dispatch("clouddisk/getCloudFolderList",{parent_id: lastBreadcrumbs.value?.parentId || 0})
          } else {
            store.dispatch("clouddisk/getCloudFileList",{parent_id: lastBreadcrumbs.value?.parentId || 0})
          }
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
		      loading.close()
          done();
        }).catch((err) => {
		      loading.close()
          done();
        });
      } else {
        if (instance.confirmButtonLoading) {
          return;
        }
        done();
      }
    },
  })
    .then(() => {})
    .catch((err) => {});
};

// 打开文件夹
const handleOpenFolder = (data) => {
  router.push("/clouddisk/media/folder/" + data.id);
};

const getData = (data) => {
  loadingStatus.value = true;
  folderId.value = data.id;
  data.fromType = 1;
  store
    .dispatch("clouddisk/handleOpenFolder", data)
    .then((res) => {
      loadingStatus.value = false;
    })
    .catch((err) => {
      loadingStatus.value = false;
    });
};

// 全选
const handleCheckAll = (e) => {
  for (var key in folderList.value) {
    folderList.value[key].check = true;
  }
  for (var key in fileList.value) {
    fileList.value[key].check = true;
  }
};

// 全不选
const handeCancel = () => {
  for (var key in folderList.value) {
    if (folderList.value[key].check) {
      folderList.value[key].check = false;
    }
  }
  for (var key in fileList.value) {
    if (fileList.value[key].check) {
      fileList.value[key].check = false;
    }
  }
  lastCheckData.value.check = false
}

const handleFileRadio = (e) => {
  handeCancel();
  e.check = true;
};

// 移动成功
function handleMoveSuccess(res) {
  const { layer, data } = res
  let flag = false
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === 1) {
      flag = true
      break
    }
  }
  if (moveCat.value === 1) {
    store.dispatch("clouddisk/getCloudFolderList", {
      parent_id: lastBreadcrumbs.value?.parentId || 0,
    });
  }
  if (moveCat.value === 2) {
    store.dispatch("clouddisk/getCloudFileList", {
      parent_id: lastBreadcrumbs.value?.parentId || 0,
    });
  }
  if (moveCat.value === 3) {
    store.dispatch("clouddisk/getCloudFolderList", {
      parent_id: lastBreadcrumbs.value?.parentId || 0,
    });
    store.dispatch("clouddisk/getCloudFileList", {
      parent_id: lastBreadcrumbs.value?.parentId || 0,
    });
  }
  if (flag) {
    updateTree(layer, data)
    // ===删除tree
    if (treeData.value.length > 0) {
      let pchildren = treeData.value
      breadcrumbs.value.forEach(el => {
        const list = pchildren.find(el1 => el1.id === el.parentId)
        pchildren = list?.childrens || []
      })
      data.forEach(el => {
        if (el.type === 1) {
          const dindex = pchildren.findIndex(item => item.id === el.id)
          if (dindex !== -1) {
            pchildren.splice(dindex, 1)
          }
        }
      })
    }
    // ===删除tree
  }
}

// 复制成功
function handleCopySuccess(res) {
  const { layer, data } = res
  let flag = false
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === 1) {
      flag = true
      break
    }
  }
  if (flag) {
    updateTree(layer, data)
  }
}

// 更新tree
function updateTree(layer, data) {
  if (treeData.value.length > 0) {
    let pchildren = treeData.value
    for (let i = 0; i < layer.length; i++) {
      const el = layer[i];
      const list = pchildren.find(el1 => el1.id === el)
      pchildren = list?.childrens
      if (pchildren === undefined) {
        break
      }
    }
    if (pchildren !== undefined) {
      data.forEach(el => {
        if (el.type === 1) {
          pchildren.push({...el, childrens: []})
        }
      })
    }
  }
}

// 重新获取文件夹菜单
function getDirectoryList(parent_id) {
  return new Promise((resolve, reject) => {
    getFolderList({parent_id})
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject([]);
      });
  });
}

const handleBatchDelete = (dlist) => {

  // ===删除tree
  const folderIds = []
  dlist.forEach(el => {
    if (el.type === 1) {
      folderIds.push(el.id)
    }
  })
  if (folderIds.length > 0 && treeData.value.length > 0) {
    let pchildren = treeData.value
    breadcrumbs.value.forEach(el => {
      const list = pchildren.find(el1 => el1.id === el.parentId)
      pchildren = list?.childrens || []
    })
    
    folderIds.forEach(el => {
      const dindex = pchildren.findIndex(it => it.id === el)
      pchildren.splice(dindex, 1)
    })
  }
  // ===删除tree

  store.dispatch("clouddisk/getCloudFolderList",{parent_id: lastBreadcrumbs.value?.parentId || 0})
  store.dispatch("clouddisk/getCloudFileList",{parent_id: lastBreadcrumbs.value?.parentId || 0})
  ElMessage({
    type: "success",
    message: "删除成功",
  });
};

const cloudHeaderHandleRef = ref()
function handleBatchDelete2() {
  cloudHeaderHandleRef.value.handleDelete()
}

// 搜索
const handleSearchChange = (word) => {
  keyWord.value = word;
};

// 排序
const handleSortChange = (sort) => {
  console.log("sort--", sort);
  sortCheck.value = sort;
};

// 重命名提交
const handleRename = (data) => {
  loadingStatus.value = true;
  rename({ id: data.id, name: data.name }).then((res) => {
    ElMessage.success("重命名成功");
    try {
      if (data.type === 1) {
        store.dispatch("clouddisk/getCloudFolderList",{parent_id: lastBreadcrumbs.value?.parentId || 0}).then(res => {
          loadingStatus.value = false
        })
        // ===更新tree
        if (treeData.value.length > 0) {
          let pchildren = treeData.value
          breadcrumbs.value.forEach(el => {
            const list = pchildren.find(el1 => el1.id === el.parentId)
            pchildren = list?.childrens || []
          })
          pchildren.forEach(el => {
            if (el.id === data.id) {
              el.name = data.name
            }
          })
        }
        // ===更新tree
      }
      if (data.type === 2) {
        store
          .dispatch("clouddisk/getCloudFileList", {
            parent_id: lastBreadcrumbs.value?.parentId || 0,
          })
          .then((res) => {
            loadingStatus.value = false;
          });
      }
    } catch (error) {
      loadingStatus.value = false;
    }
  });
};

// 创建分享成功
const shareSuccess = (data) => {
  shareInfo.value = data;
  shareShow.value = false;
  shareInfoShow.value = true;
};

// 分享信息关闭
const shareInfoClose = () => {
  shareInfoShow.value = false;
};

const cloudHeaderRef = ref("");
function handleUploadFiles() {
  cloudHeaderRef.value.handleFiles("File");
}
function handleUploadFolder() {
  cloudHeaderRef.value.handleFiles("Files");
}

// 创建文件夹成功
function handleCreateFolderSuccess(data) {
  // ===追加tree
  if (treeData.value.length > 0) {
    let pchildren = treeData.value
    breadcrumbs.value.forEach(el => {
      const list = pchildren.find(el1 => el1.id === el.parentId)
      pchildren = list?.childrens || []
    })
    pchildren.push({...data, childrens: []})
  }
  // ===追加tree

  store.dispatch("clouddisk/getCloudFolderList",{parent_id: lastBreadcrumbs.value?.parentId || 0})
}

// 创建wps成功
function handleCreateWpsSuccess() {
  store.dispatch("clouddisk/getCloudFileList", {
    parent_id: lastBreadcrumbs.value?.parentId || 0,
  });
}

// 打开弹框
const handleOpenDialog = (e, title, suffix) => {
  handeCancel();
  cloudHeaderRef.value.handleOpenDialog(e, title, suffix);
};

const lastCheckData = ref({});
function handleCheck(item) {
  if (item.check && item.type === 1) {
    getLastDetails(item.id)
  } else if (item.check) {
    lastCheckData.value = item
  } else {
    const lastdata = selectFiles.value[selectFiles.value.length - 1] || {}
    if (selectFiles.value.length > 0 && lastdata.type === 1) {
      getLastDetails(lastdata.id)
    } else if (selectFiles.value.length > 0) {
      lastCheckData.value = lastdata
    } else {
      lastCheckData.value = item;
    }
  }
}

function getLastDetails(id) {
  getDetails({id}).then(res => {
    lastCheckData.value = res.data
    lastCheckData.value.check = true
  })
}

async function handleDownloadFiles(data) {
  let list = data;
  if (!Array.isArray(list)) {
    list = [list];
  }
  const params = list.map((el) => {
    return {
      id: el.id,
      filename: el.name,
    };
  });
  const result = await getFileDownloadUrl(params);
  const requestData = result.data.map((el) => {
    return {
      url: el.downloadUrl,
      params: {},
      fileName: "",
    };
  });
  downloadMulti(requestData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

const dragData = ref(null) //拖拽对象
function handleDragStart(e) {
  dragData.value = e
}

//拖拽到目标对象
function handleDrop(e) {
  if (e.type === 2 || (dragData.value.id === e.id)) {
    return;
  }
  const params = {
    fileIds: [dragData.value.id],
    directoryId: e.id
  }
  const loading = ElLoading.service({
    lock: true,
    text: '移动中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  fileOrFolderMove(params).then(res => {
    if (dragData.value.type === 1) {
      store.dispatch("clouddisk/getCloudFolderList",{parent_id: lastBreadcrumbs.value?.parentId || 0}).then(res1 => {
        loading.close()
        
        // ===更新tree
        if (treeData.value.length > 0) {
          let pchildren = treeData.value
          breadcrumbs.value.forEach(el => {
            const list = pchildren.find(el1 => el1.id === el.parentId)
            pchildren = list?.childrens
          })
          if (pchildren !== undefined) {
            const aindex = pchildren.findIndex(item => item.id === e.id)
            if (aindex !== -1 && pchildren[aindex]?.childrens !== undefined) {
              pchildren[aindex]?.childrens.push({...res.data[0], childrens: []})
            }

            const dindex = pchildren.findIndex(item => item.id === dragData.value.id)
            if (dindex !== -1) {
              pchildren.splice(dindex, 1)
            }
          }
        }
        // ===更新tree

      }).catch (err => {
        loading.close()
      })
    } else {
      store.dispatch("clouddisk/getCloudFileList",{parent_id: lastBreadcrumbs.value?.parentId || 0}).then(res => {
        loading.close()
      }).catch (err => {
        loading.close()
      })
      store.dispatch("clouddisk/getCloudFolderList",{parent_id: lastBreadcrumbs.value?.parentId || 0}).then(res => {
        loading.close()
      }).catch (err => {
        loading.close()
      })
    }
  }).catch(err => {
    loading.close()
  })
}

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
