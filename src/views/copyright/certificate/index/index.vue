<template>
  <el-container class="container-box">
    <el-scrollbar ref="scroll" style="width: 100%;height: 100%;">
      <div class="header">
        <span style="font-size:16px;">版权存证</span>
        <el-button color="#3468FE" type="primary" style="width:96px;" round @click="toPath('/copyright/certificate/new')">新建存证</el-button>
      </div>

      <div class="search-box">
        <span style="margin-left:30px;">全部存证</span>
        <el-select v-model="worksCategory" clearable class="select-box" placeholder="作品分类" @change="getCopyrightList">
          <el-option
            v-for="item in worksCategoryList"
            :key="item.code"
            :label="item.description"
            :value="item.code"
          />
        </el-select>
        <el-date-picker
          class="date-picker-box"
          v-model="pickerDate"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled-date="disabledDate"
          @change="getCopyrightList"
        />
        <el-input
          v-model="worksName"
          class="search-input"
          placeholder="搜索作品名称"
          :suffix-icon="Search"
          @change="getCopyrightList"
        />
      </div>

      <div class="certificate-list">
        <div class="header">
          <div class="name">作品名称</div>
          <div class="ctime">创建时间</div>
          <div class="classify">作品分类</div>
          <div class="number">存证文件数</div>
          <div class="status">状态</div>
          <div class="operation">操作</div>
        </div>
        <div v-if="certificateList.length > 0">
          <div class="cer-item" v-for="(item, index) in certificateList" :key="index" @click="toDetails(item)">
            <div class="name">
              <!-- <el-image style="width:40px;height:40px;background:#D8D8D8;border-radius: 8px;" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" /> -->
              <!-- <FileType v-if="item.lastSuffix === 'video' || item.lastSuffix === 'image'" type="url" :url="item.cover"></FileType> -->
              <div style="width: 40px;height: 40px;">
                <FileType :type="item.lastSuffix"></FileType>
              </div>
              <span class="name-text">{{item.worksName}}</span>
            </div>
            <div class="ctime">{{item.createTime}}</div>
            <div class="classify">{{formatCategory(item.worksCategory)}}</div>
            <div class="number">{{item.fileNum}}</div>
            <div class="status">
              <Point type="green" v-if="item.state === 'finish'"></Point>
              <Point type="blue" v-else-if="item.state === 'beingProcessed'"></Point>
              <Point type="danger" v-else-if="item.state === 'error'"></Point>
              <span v-if="item.state === 'draft'">草稿</span>
              <span v-else-if="item.state === 'beingProcessed'">存证中</span>
              <span v-else-if="item.state === 'finish'">存证成功</span>
              <span v-else-if="item.state === 'error'">存证失败</span>
            </div>
            <div class="operation" @click.stop="">
              <el-icon :size="20" class="icon-operation" @click="(handleItem = item)" v-contextmenu:contextmenuRef="{ trigger: 'click' }"><MoreFilled /></el-icon>
            </div>
          </div>
        </div>
        <div v-else class="empty-box">
          <el-image style="width: 162px" :src="copyrightImg" />
          <div class="box-right">
            <div class="line1">
              版权存证，保护您的创意资产！
            </div>
            <div class="line2">
              版权存证，基于区块链不可篡改特性，链接公证处、国家授时中心等权威机构，作品发布即可快速低成本完成存证上链，当创意资产被侵犯时，存证凭据便是有力的维权证件。
            </div>
            <div class="line3">查看版权存证说明</div>
            <div class="line4">
              <div class="line-item">
                <svg-icon iconClass="icon_free" :size="16"></svg-icon>
                首次免费
              </div>
              <div class="line-item">
                <svg-icon iconClass="icon_low" :size="16"></svg-icon>
                低成本保护创意
              </div>
              <div class="line-item">
                <svg-icon iconClass="icon_certificate" :size="16"></svg-icon>
                权威结构颁发存证凭据
              </div>
            </div>
            <el-button style="margin-top: 20px;width: 120px;height: 32px;" color="#3468FE" type="primary" round @click="toPath('/copyright/certificate/new')">立即使用</el-button>
          </div>
        </div>
      </div>

      <Pagination
        v-if="total > 10"
        :total="total"
        :page="pageNum"
        :limit="pageSize"
        @pagination="handlePagination"
        layout="sizes,prev, pager, next, total, jumper"
        :hideSinglePage="false"
        class="pagination-container-box"
        position="center"
      ></Pagination>
    </el-scrollbar>
  </el-container>

  <v-contextmenu :width="100" ref="contextmenuRef">
    <v-contextmenu-item @click="toPath('/copyright/certificate/details/'+handleItem.id)">
      <span>查看详情</span>
    </v-contextmenu-item>
<!--   <v-contextmenu-item @click="handleDownload(handleItem.id)" :disabled="handleItem.state !== 'finish'">-->
<!--      <span>下载证件包</span>-->
<!--    </v-contextmenu-item>-->
    <v-contextmenu-item @click="handleDelete">
      <span>删除作品</span>
    </v-contextmenu-item>
  </v-contextmenu>

  <div  class="tip-dialog-box">
    <el-dialog v-model="tipDialog" title="实名认证" width="350px" :show-close="false">
      <div class="tip-box">
        <div class="tip-title">实名认证</div>
        <div class="tip-text">您尚未完成实名认证，新建存证需要先进行实名认证</div>
        <div class="btn-bxo">
          <el-button @click="(tipDialog = false)">取消</el-button>
          <el-button color="#3468FE" type="primary" @click="proxy.$Authentication.openAuth({onSubmitSuccess: onAuthSubmitSuccess})">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { copyrightList, copyrightDelete } from '@/api/copyright/index.js'
import { onMounted } from '@vue/runtime-core';
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import copyrightImg from '@/assets/images/copyright.png'
import FileType from '@/components/FileType'
const { proxy } = getCurrentInstance();
const store = useStore()
const router = useRouter();
const contextmenuRef = ref('')
const worksCategory = ref('')
const pickerDate = ref(null)
const worksName = ref('')
const worksCategoryList = [
  {
    code: '',
    description: '全部分类'
  },
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
const certificateList = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const handleItem = ref(null)
const idCard = computed(() => {
  return store.state.user.idCard
})

function formatCategory(cat) {
  const data = worksCategoryList.find(el => el.code == cat)
  return data?.description || ''
}

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
//提示实名认证弹窗
const tipDialog = ref(false)
function onAuthSubmitSuccess() {//实名成功
  tipDialog.value = false
}
function toPath(path) {
  if (!idCard.value) {
    tipDialog.value = true
    return
  }
  router.push(path)
}
function toDetails(data) {
  toPath('/copyright/certificate/details/' + data.id)
}
function handleDownload(fileId) {
  console.log('handleDownload--', fileId);
}
function handleDelete() {
  const text = `删除后，作品以及包含的文件将无法恢复，您确定要删除吗？`;
  const title = `你确定删除该作品吗？`;
  ElMessageBox.confirm(text, title, {
    customClass: 'messageBox-custom-warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: true,
    center: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
        copyrightDelete(handleItem.value.id)
          .then((res) => {
		        loading.close()
            ElMessage.success('删除成功！')
            getCopyrightList()
            done();
          })
          .catch((err) => {
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
}

const handlePagination = ({page, limit}) => {
  pageNum.value = page;
  pageSize.value = limit;
  getCopyrightList();
}

function getCopyrightList() {
  const params = {
    worksName: worksName.value,
    worksCategory: worksCategory.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    orderByColumn:'createTime',
    isAsc:'desc'
  }
  if (pickerDate.value) {
    params.startTime = pickerDate.value[0]+' 00:00:00'
    params.endTime = pickerDate.value[1]+' 23:59:59'
  }
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  copyrightList(params).then(res => {
    certificateList.value = res.rows
    total.value = res.total
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

onMounted(() => {
  getCopyrightList()
})

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
