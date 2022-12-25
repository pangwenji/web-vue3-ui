<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <template #format>
            支持文件格式：PDF
          </template>
        </top-description-card>
      </div>
      <tool-switch-panel :showTry="false" :hide-header="true">
        <template #useImmediately>

          <div style="padding: 50px">

            <div class="upload-box">
              <div>
                <el-upload
                    class="upload-demo"
                    drag
                    action="#"
                    :auto-upload="false"
                    accept=".pdf"
                    multiple
                    @change="handlePdf"
                    :show-file-list="false"
                >
                  <el-icon class="el-icon--upload">
                    <el-image :src="upload"></el-image>
                  </el-icon>
                  <div class="el-upload__text">
                    <div>将文件拖到此处，或者<span style="color: #20a0ff">点击选择</span></div>
                    支持文件格式：PDF
                  </div>
                </el-upload>
              </div>
              <div class="upload-box-op">
                <div class="upload-operating">
                  <el-upload
                      :auto-upload="false"
                      accept=".pdf"
                      multiple
                      @change="handlePdf"
                      :show-file-list="false"
                  >
                    <el-button class="el-button-reUpload" plain>
                      <el-image :src="updata"></el-image>
                      上传PDF
                    </el-button>
                  </el-upload>
                  <el-button class="el-button-start clear"
                             @click="imgFiles=[]"
                  >
                    <el-image :src="deleteBt"></el-image>
                    清空全部
                  </el-button>
                  <el-button class="el-button-start download"
                             @click="allFileDown"
                  >
                    <el-image :src="downloadBt"></el-image>
                    全部下载
                  </el-button>
                </div>
                <div class="text-info">该功能为免费工具，不做订单数据留存，请注意保存。</div>
              </div>
            </div>

            <div class="file-image-list ">
              <div class="file-item">
                <div class="fl1" style="text-indent: 100px;">文件名称</div>
                <div class="fl2">尺寸大小</div>
                <div class="fl3">操作</div>
              </div>
              <div v-if="imgFiles.length>0">
                <div class="file-image pdf-list-item" v-for="(file,index) in imgFiles" :key="file.name">
                  <div class="fl1 fl1-name">
                    <div>
                      <el-image
                          :src="file.url"
                          :preview-src-list="[file.url]"
                          fit="contain" style="height: 48px;width:48px"></el-image>
                    </div>
                    <div class="file-name-text">
                      {{ file.name }}
                    </div>
                  </div>

                  <div class="fl2" style="display: flex;align-items: center;">
                    {{ file.width?.toFixed(0) }}×{{ file.height.toFixed(0) }}
                  </div>

                  <div class="fl3" style="display: flex;align-items: center;">
                    <div>
                      <el-button @click="startProcess(file)" type="text">下载</el-button>
                    </div>
                    <div style="margin-left:20px">
                      <el-button type="text" @click="deleteImage(index)">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="pdf-list-item-no"
                   style="display: flex;justify-content: center;align-items: center;padding: 20px">
                <svg-icon iconClass="icon_empty" :size="60"></svg-icon>
                <div>暂无数据</div>
              </div>

            </div>
          </div>
        </template>
      </tool-switch-panel>
    </el-scrollbar>
  </div>
</template>

<script setup>
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'
import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
//npm install --save pdfjs-dist
import TopDescriptionCard from '../components/TopDescriptionCard'
import {ref} from "vue";
import {useRoute} from "vue-router";
import updata from '@/assets/tool/upload-wt.png'
import deleteBt from '@/assets/tool/deleteBt.png'
import downloadBt from '@/assets/tool/downloadBt.png'

import {toolDetail} from "@/api/toolbox/toolbox";
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import upload from '@/assets/tool/updata-file.png'

import {downloadZip} from "../../../../utils/ZipDownload";
import {ElMessage, ElNotification} from "element-plus";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
const route = useRoute()
// ============= 网络请求 ====================
const headData = ref({})
const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}

getToolDetail();


// ================= 核心代码  ==========================
//pdf转成的图片文件，保存在数组中
let imgFiles = ref([]);
//pdf的名字，记录下来
const pdfName = ref("");
//处理pdf
const handlePdf = (e) => {
  imgFiles.value = [];
  //显示正在加载
  let file = e;
  pdfName.value = file.name.substring(0, file.name.lastIndexOf("."));
  // let data = new Blob([file.raw], {type: 'application/pdf;charset-UTF-8'});
  file.raw.arrayBuffer().then(res => {
    const loadingTask = pdfjs.getDocument(res)
    loadingTask.promise.then((pdf) => {
      var pageNum = pdf.numPages;
      // console.log("页数:" + pageNum);
      ElNotification({
        title: '处理成功',
        message: pdfName.value + ' 处理成功',
        type: 'success',
        offset: 63,
      })
      for (let i = 1; i <= pageNum; i++) {
        pdf.getPage(i).then((page) => {
          let canvas = document.createElement("canvas");
          const ctx = canvas.getContext('2d')
          const viewport = page.getViewport({scale: 3})
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          page.render({
            canvasContext: ctx,
            viewport,
          }).promise.then(res => {
            imgFiles.value.push({
              url: canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
              , name: pdfName.value + i + '.png',
              width: viewport.width,
              height: viewport.height
            })
          })
        })
      }    // end for
    }).catch(res => {
      ElNotification({
        title: '处理失败',
        message: pdfName.value + ' 处理失败',
        type: 'error',
        offset: 63,
      })
    })
  })
}

//下载图片
const downJpg = (imgURI, fileName) => {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });
  var a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.setAttribute('href', imgURI);
  a.setAttribute('target', 'blank');
  a.dispatchEvent(evt);
}

const allFileDown = () => {
  if (imgFiles.value.length) {
    downloadZip(pdfName.value + "PDF转图片.zip", imgFiles.value)
  } else {
    ElMessage.info("暂无图片可下载！")
  }

}

const startProcess = (file) => {
  downJpg(file.url, file.name)
}
const deleteImage = (index) => {
  imgFiles.value.splice(index, 1)
}

</script>

<style scoped lang="scss">
@import "style";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
