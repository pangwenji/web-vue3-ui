<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <top-description-card :data="headData" >
        <template #format>
          QQ音乐 (.qmcflac) <br/>
          QQ音乐新格式 (实验性支持)mgg <br/>
          网易云音乐格式 (.ncm) <br/>
          酷狗音乐格式 (.kgm) (CLI版本)<br/>
        </template>
        <template #explain>
        </template>
      </top-description-card>

      <tool-switch-panel :showTry="false" :hide-header="true">
        <template #useImmediately>
          <div class="main-upload">
            <div>
              <file-selector @error="showFail" @success="showSuccess"/>
            </div>
            <div id="app-control">
              <el-row class="mb-3">
                <div>歌曲命名格式：</div>
                <div>
                  <el-radio v-for="k in FilenamePolicies" :key="k.key" v-model="filename_policy" :label="k.key">
                    {{ k.text }}
                  </el-radio>
                </div>
              </el-row>

              <el-row>
                <config-dialog :show="showConfigDialog" @done="showConfigDialog = false"></config-dialog>
                <!--                <el-tooltip class="item" effect="dark" placement="top">-->
                <!--                  <div slot="content">-->
                <!--                    <span> 部分解密方案需要设定解密参数。 </span>-->
                <!--                  </div>-->
                <!--                  <el-button icon="el-icon-s-tools" plain @click="showConfigDialog = true">解密设定</el-button>-->
                <!--                </el-tooltip>-->
                <el-button
                    class="unlock-bt clear-all"
                    :icon="Delete"
                    @click="handleDeleteAll">清除全部
                </el-button>
                <el-button
                    class="unlock-bt down-bt"
                    :icon="Download"
                    @click="handleDownloadAll">下载全部
                </el-button>
<!--                <el-button-->
<!--                    class="unlock-bt"-->
<!--                    :icon="FolderOpened"-->
<!--                    :disabled="true"-->
<!--                    style="color: gray"-->
<!--                    @click="handleDownloadAll">存储至云盘-->
<!--                </el-button>-->
                <!--                <el-tooltip class="item" effect="dark" placement="top-start">-->
                <!--                  <div slot="content">-->
                <!--                    <span v-if="instant_save">工作模式: {{ dir ? '写入本地文件系统' : '调用浏览器下载' }}</span>-->
                <!--                    <span v-else>-->
                <!--              当您使用此工具进行大量文件解锁的时候，建议开启此选项。<br/>-->
                <!--              开启后，解锁结果将不会存留于浏览器中，防止内存不足。-->
                <!--            </span>-->
                <!--                  </div>-->
                <!--                  <el-checkbox v-model="instant_save" type="success" border class="ml-2">立即保存</el-checkbox>-->
                <!--                </el-tooltip>-->
              </el-row>
              <div class="text-info">该功能为免费工具，不做订单数据留存，请注意保存。</div>
            </div>
          </div>
          <!--          <audio :autoplay="playing_auto" :src="playing_url" controls/>-->
          <PreviewTable
              :policy="filename_policy"
              :table-data="tableData"
              @download="saveFile"
              @deleteFile="deleteFile"
              @play="changePlaying"/>
        </template>
      </tool-switch-panel>
    </el-scrollbar>
  </div>
</template>

<script setup>
import FileSelector from './component/FileSelector';
import PreviewTable from './component/PreviewTable';
import ConfigDialog from './component/ConfigDialog';
import {ref, watch} from 'vue'
import TopDescriptionCard from '../tooldetails/components/TopDescriptionCard'
import ToolSwitchPanel from '../tooldetails/components/ToolSwitchPanel'
import {DownloadBlobMusic, FilenamePolicy, FilenamePolicies, RemoveBlobMusic, DirectlyWriteFile} from './utils/utils';
import {toolDetail} from "@/api/toolbox/toolbox";
import {useRoute} from "vue-router";
import {
  Delete,
  Download,
  FolderOpened
} from '@element-plus/icons-vue'
import {ElNotification} from 'element-plus'
import {guid} from "@/utils/tool";

const showConfigDialog = ref(false),
    tableData = ref([]),
    playing_url = ref(''),
    playing_auto = ref(false),
    filename_policy = ref(FilenamePolicy.ArtistAndTitle),
    instant_save = ref(false),
    dir = ref(null);

const headData = ref({})

const route = useRoute()
watch(() => instant_save.value, () => {
  if (instant_save.value) showDirectlySave();
})

const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}
getToolDetail();

async function showSuccess(data) {
  if (instant_save.value) {
    await saveFile(data);
    RemoveBlobMusic(data);
  } else {
    data.id = guid();
    tableData.value.push(data);
    ElNotification({
      title: '解锁成功',
      message: data.title + '成功解锁 ',
      type: 'success',
    })
  }
  // if (process.env.NODE_ENV === 'production') {
  //   let _rp_data = [data.title, data.artist, data.album];
  //   window._paq.push(['trackEvent', 'Unlock', data.rawExt + ',' + data.mime, JSON.stringify(_rp_data)]);
  // }
}

function showFail(errInfo, filename) {
  console.error(errInfo, filename);
  // this.$notify.error({
  //   title: '出现问题',
  //   message:
  //       errInfo +
  //       '，' +
  //       filename +
  //       '，参考<a target="_blank" href="https://github.com/ix64/unlock-music/wiki/使用提示">使用提示</a>',
  //   dangerouslyUseHTMLString: true,
  //   duration: 6000,
  // });
  ElNotification({
    title: '解锁失败',
    message: filename + '解锁失败 ',
    type: 'error',
  })
  // if (process.env.NODE_ENV === 'production') {
  //   window._paq.push(['trackEvent', 'Error', String(errInfo), filename]);
  // }
}

function changePlaying(url) {
  this.playing_url = url;
  this.playing_auto = true;
}

function handleDeleteAll() {
  tableData.value.forEach((value) => {
    RemoveBlobMusic(value);
  });
  tableData.value = [];
}

function handleDecryptionConfig() {
  this.showConfigDialog = true;
}

function handleDownloadAll() {
  let index = 0;
  let c = setInterval(() => {
    if (index < tableData.value.length) {
      saveFile(tableData.value[index]);
      index++;
    } else {
      clearInterval(c);
    }
  }, 300);
}

async function saveFile(data) {
  if (dir.value) {
    await DirectlyWriteFile(data, filename_policy.value, dir.value);
    // this.$notify({
    //   title: '保存成功',
    //   message: data.title,
    //   position: 'top-left',
    //   type: 'success',
    //   duration: 3000,
    // });
  } else {
    DownloadBlobMusic(data, filename_policy.value);
  }
}

async function showDirectlySave() {
  if (!window.showDirectoryPicker) return;
  // try {
  //   await this.$confirm('您的浏览器支持文件直接保存到磁盘，是否使用？', '新特性提示', {
  //     confirmButtonText: '使用',
  //     cancelButtonText: '不使用',
  //     type: 'warning',
  //     center: true,
  //   });
  // } catch (e) {
  //   console.log(e);
  //   return;
  // }
  try {
    dir.value = await window.showDirectoryPicker();
    const test_filename = '__unlock_music_write_test.txt';
    await dir.value.getFileHandle(test_filename, {create: true});
    await dir.value.removeEntry(test_filename);
  } catch (e) {
    console.error(e);
  }
}

// 浏览器不支持的预览方案
var ua = navigator && navigator.userAgent;
var detected = (function () {
  var m;
  if (!ua) return true;
  if (/MSIE |Trident\//.exec(ua)) return true; // no IE
  m = /Edge\/([\d.]+)/.exec(ua); // Edge >= 17
  if (m && Number(m[1]) < 17) return true;
  m = /Chrome\/([\d.]+)/.exec(ua); // Chrome >= 58
  if (m && Number(m[1]) < 58) return true;
  m = /Firefox\/([\d.]+)/.exec(ua); // Firefox >= 45
  return m && Number(m[1]) < 45;
})();

const deleteFile = (index) => {
  tableData.value.splice(index,1)
}

</script>
<style scoped lang="scss">
@import "index";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
