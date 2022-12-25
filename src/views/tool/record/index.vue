<template>
  <div class="main-card" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
    <el-scrollbar style="height: 99%">
      <div class="scroll-main">
        <!-- 头部 -->
        <div class="scroll-header" style="margin-bottom: 10px;padding: 12px;">
          <div class="header1">
            <el-input v-model="params.fileName" class="find-input" placeholder="快速搜索"
                      :suffix-icon="Search"
                      @blur="getToolOrderList"
                      @keydown.enter="getToolOrderList"
            />
          </div>
          <div class="header2">
            <!--            处理结果-->
            订单编号
          </div>
          <div class="header2"> 处理工具</div>
          <div class="header2" style="cursor: pointer" @click="sortList(1)">
            创建日期
            <up-down v-model:tabName="createName" ></up-down>
          </div>
          <div class="header2"  style="cursor: pointer" @click="sortList(2)">
            金额
            <up-down v-model:tabName="price"></up-down>
          </div>

          <div class="header3">操作</div>
        </div>

        <template v-if="toolList.length!==0&&!loadingStatus||1">
          <div style="flex: 1">
            <div class="list-item" v-for="(tool,i) in toolList" :key="i">
              <div class="close" @click="deleteOther(tool)">
                <el-image style="width: 18px" :src="close"></el-image>
              </div>
              <div class="header1">
                <div style="margin-left: 13px">
                  <el-image style="width: 50px;"
                            :src="tool.icon"/>
                </div>
                <div style="margin-left: 23px;width: 200px" class="text-hied">
                  {{
                    tool.sourceFileVO?.filename || JSON.parse(tool.additionalInformation || '{}').filename || tool.name
                  }}
                </div>
              </div>
              <div class="header2" :style="{color:tool.processingStatus===3?'red':''}">
                <!--                {{ tool.processingStatus == 1 ? "处理中" : tool.processingStatus == 2 ? "已处理" : "处理失败" }}-->
                {{ tool.orderNo + '&emsp;' }}
                <el-icon style="cursor: pointer" @click="copy(tool.orderNo)">
                  <CopyDocument/>
                </el-icon>
              </div>
              <div class="header2">
                {{ tool.name }}
              </div>
              <div class="header2">
                {{ parseTime(tool.convertStartTime, '{y}-{m}-{d}') }}
              </div>
              <div class="header2">
                {{ tool.totalCost }}
              </div>

              <div class="header3">
                <div style="cursor: pointer"
                     @click="lookInfo(tool)"
                     v-if="tool.ifPay!==0||tool.processingStatus===1&&tool.ifPay!==0"
                >查看</div>
                <div>
                  <!--      class="down-file"-->
                  <el-button
                      type="text"
                      v-if="tool.ifPay===0&&tool.processingStatus!==1||tool.ifPay===0"
                      @click="lookInfo(tool)">去支付
                  </el-button>
                    <!--   class="down-file"-->
                  <el-button
                      style="margin-left: 10px"
                      class="down-file"
                      v-else-if="tool.processingStatus===2"
                      :loading="downloadStatus && downloadOrder === tool.orderNo"
                      @click="downloadFiles(tool)">下载
                  </el-button>
                  <!--    class="down-file"-->

                  <el-button
                      type="text"
                      style="margin-left: 10px"
                      @click="getToolOrderList"
                      v-else-if="tool.processingStatus===1"
                  >
                    <el-icon class="is-loading">
                      <Loading />
                    </el-icon>
                    处理中...
                  </el-button>

                  <el-button
                      type="text"
                      style="margin-left: 10px"
                      @click="lookInfo(tool)"
                      v-else-if="tool.processingStatus===4"
                  >
                    部分处理完成
                  </el-button>
                  <div class="processingFailed" v-else>处理失败</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="!loadingStatus">
          <Empty description="暂无数据" style="padding: 0;height: 100%">
          </Empty>
        </template>
        <Pagination
            :total="total"
            :page="params.pageNum"
            :limit="params.pageSize"
            @pagination="handlePagination"
            class="pagination-container-box"
            position="center"></Pagination>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {ref, reactive,computed, watch} from 'vue'
import {toolOrderList, toolOrderInfo, toolOrderDel, downloadVoiceToText } from "@/api/toolbox/toolbox";
import {Search} from '@element-plus/icons-vue'
import UpDown from "@/components/UpDown"
import close from "@/assets/tool/close.png"
import {downloadZip} from '@/utils/ZipDownload'
import useClipboard from "vue-clipboard3";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

const createName=ref('')
const price=ref('')
const value = ref('')
// 邀请列表
const toolList = ref([])
// 加载状态
const loadingStatus = ref(false)
const total = ref(0);
const router = useRouter();
const params = reactive({
  pageNum: 1,
  pageSize: 10,
  fileName: "",
})

/**
 * get order list
 */
const getToolOrderList = () => {
  toolOrderList(params).then(res => {
    toolList.value = res.rows;
    total.value = res.total;
    loadingStatus.value = false;
  }).catch(err => {
    loadingStatus.value = false;
  })
}

/**
 * 代理初始化对象；防止切换时整个页面出现闪动
 */
const initData = () => {
  loadingStatus.value = true;
  getToolOrderList();
}
initData();
// 改变页数时
const handlePagination = ({page, limit}) => {
  if (loadingStatus.value) {
    return;
  }
  params.pageNum = page;
  params.pageSize = limit;
  getToolOrderList();
}

/**
 * 删除成功后回调函数
 */
const deleteSuccess = () => {
  getToolOrderList();
}

const downloadStatus = ref(false)
const downloadOrder = ref('')
const downloadFiles = (files) => {
  downloadStatus.value = true
  downloadOrder.value = files.orderNo
  if (files.tdId === 25) { //语音转文字
    downloadVoiceFileToText(files)
  } else {
    toolOrderInfo(files.orderNo).then(res => {
      const fileList = res.data.sourceFileVOList.map(item => {
        return {
          url: item.downloadUrl,
          name: item.filename
        }
      })
      downloadZip(files.orderNo + files.name, fileList)
      downloadStatus.value = false
    });
  }
}

// 语音转文字下载txt
function downloadVoiceFileToText(files) {
  downloadVoiceToText(files.orderNo).then(res => {
    const blob = new Blob([res], {type: "application/json;charset=UTF-8"})
    const fileName = files.sourceFileVO.filename + '.txt'
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    downloadStatus.value = false
  }).catch(err => {
    ElMessage.error('下载错误：' + err)
    downloadStatus.value = false
  })
}


const lookInfo = (tool) => {
  let myUrl='';
  if (router.currentRoute.value.name?.indexOf("toolDesktop")===-1){
    myUrl=tool.webUrl;
  }else {
    myUrl= tool.webUrl.replace("tool/index","toolDesktop")
  }
  router.push({
    path: myUrl,
    query: {
      id: tool.tdId,
      orderNo: tool.orderNo
    }
  })
}
const {toClipboard} = useClipboard();

async function copy(number) {
  try {
    await toClipboard(number)
    ElMessage.success('复制成功')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}


const sortList = (i) => {
  if (i===1){
    createName.value=createName.value==='top'? 'bottom':'top'
    if (createName.value==='top'){
      price.value=''
      params.sortAttr=0;
      params.ifAsc=0;
    }else if (createName.value==='bottom') {
      price.value=''
      params.sortAttr=0;
      params.ifAsc=1;
    }
  }else {
    price.value=price.value==='top'? 'bottom':'top'
    if (price.value==='top'){
      createName.value=''
      params.sortAttr=1;
      params.ifAsc=0;
    }else if (price.value==='bottom') {
      createName.value=''
      params.sortAttr=1;
      params.ifAsc=1;
    }
  }
  getToolOrderList()
}

/**
 * 删除订单
 * @param tool
 */
const deleteOther = (tool) => {
  toolOrderDel(tool.orderNo).then(res => {
    getToolOrderList();
  });
}

const store = useStore();
const sessions = computed(() => {
  const im = store.state.IM
  return im.sessions
})

watch(sessions, (value) => {
  const {lastMsg} = value[0]
  if (lastMsg.attach) {
    if (lastMsg.attach.title === '工具') { //工具
      // const mataData = JSON.parse(lastMsg.attach.mataData);
      getToolOrderList();
      // if (thisTemOrderNo === mataData.orderNo) {
      //   ElMessage.success("处理完成")
      // }
    }
  }
})

</script>

<style scoped lang="scss">
@import "./style.scss";

:deep(.el-scrollbar__view) {
  height: 100%;
  width: 100%;
}

.scroll-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.list-item {
  display: flex;
  width: 97%;
  border-radius: 10px;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #C2C7CE;
  line-height: 20px;
  margin: 0 auto 20px;
  background-color: #131418;
  height: 76px;
  position: relative;

  &:hover {
    background-color: #1C1D24;

    .down-file {
      background-color: #3468FE;
    }

    .close {
      display: block;
    }
  }

  .header1 {
    flex: 3;
    display: flex;
    align-items: center;
  }

  .header2 {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .header3 {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .down-file {
    width: 80px;
    height: 30px;
    background: #3468FE;
    border-radius: 12px;
    border: none;
    font-size: 15px;
    font-weight: 400;
    color: #FFFFFF;
    margin-left: 29px;
  }

  .processingFailed {
    width: 111px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 10px;
    border: none;
    font-weight: 400;
    color: #eebe77;
    margin-left: 29px;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    display: none;
  }
}

.scroll-header {
  display: flex;
  background-color: #1C1D24;
  width: 97%;
  height: 58px;
  border-radius: 10px;
  margin: 20px auto;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #C2C7CE;
  line-height: 20px;

  .header1 {
    flex: 3;
    display: flex;
    align-items: center;
  }

  .header2 {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .header3 {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .find-input {
    width: 227px;
    height: 32px;
    background: #1C1D24;
    border: 1px solid #31323B;
    margin-left: 13px;
  }

  :deep(.el-input) {
    border: none;

    input {
      box-shadow: none; //去除白边
      background-color: #1E202A;
      border: rgba(49, 50, 59, 0.53) solid 1px;
      border-radius: 18px;

      &:focus {
        box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset; //输入内容原本样式
        outline: 0;
      }
    }
  }

}

.text-hied {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.cancel{
  margin-left: 10px;
}
</style>
