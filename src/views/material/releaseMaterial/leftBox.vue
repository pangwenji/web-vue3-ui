<template>
  <div class="mtl-main">
    <div class="top-box">
      <div class="top-left">
        <div v-if="pageType === 'change'">
          <div class="text">
            修改{{ typeName }}
          </div>
          <div class="text" style="margin-top: 10px">请勾选需要修改的素材进行修改</div>
        </div>
        <div v-else>
          <el-select v-model="ctypeId" @change="getTypeTreeList">
            <el-option
                v-for="item in typeList"
                :key="item.id"
                :label='"添加" + item.typeName'
                :value="item.typeId"
            ></el-option>
          </el-select>
        </div>

      </div>
      <div class="top-right">
        <div v-if="pageType !== 'change'">
          <div class="topBtn" @click.stop="handleFiles('File')">上传文件</div>
        </div>

        <input
            type="file"
            ref="uploadFile"
            multiple
            :webkitdirectory="false"
            hidden
            @change="handleUploadFile"
            :accept="upAccept"
        />

        <div class="num">{{ waitSettingList.length }}个文件</div>
        <div class="common">共{{ CountSize() }}</div>
      </div>
    </div>
    <div class="main-box">
      <sound-item :waitSettingList="waitSettingList"></sound-item>
    </div>

  </div>
</template>

<script setup>
import UploadFile from "@/utils/uploadFile"
import {getUploadSign, createUploadMaterial} from '@/api/material/index.js'
import SoundItem from "./uploadSound/soundItem"
import {
  getMaterialDetail,
  getTypeOption,
  getMaterialTypeTreeList,
  getNotShelves,
  materialRelease
} from "../../../api/material";
import {onMounted, watch} from "vue";
import {useStore} from "vuex";
import {computed} from "vue";
import {formatSize} from "../../../utils/tool";
import {ref} from "vue";

const route = useRoute()
const store = useStore()
const fileList = ref([])
const uploadFile = ref()
const uploadFiles = ref()
const fileSize = ref()
const ctypeId = ref(1)
const typeName = ref('')
const pageType = ref("")
const typeTabData = ref([])
const upAccept = ref('audio/*') // 上传文件类型限制
const ids = ref([])


onMounted(() => {
  pageType.value = route.query.type
  ctypeId.value = parseInt(route.query.page)
  getTabList()
  getTypeTreeList()
})

watch(ctypeId, newValue => {
  //字体格式.ttf,.eot,.otf,.fon,.font,.ttc,.woff，目前只能ttf
  //音效音乐格式audio/*，目前只能传.aac,.flac,.m4a,.mp3,.ogg,.wav
  const acceptArr = ['audio/*', 'audio/*', '.zip,.rar,.arj,.z,.jar', '.zip,.rar,.arj,.z,.jar', 'video/*,.flv', '.zip,.rar,.arj,.z,.jar,image/*', '.ttf']
  upAccept.value = acceptArr[newValue - 1]
})

function getTabList() {
  getTypeOption().then((res) => {
    typeTabData.value = res.data
    const d = res.data.find((item) => {
      return item.typeId === ctypeId.value
    })
    typeName.value = d.typeName
    store.commit('material/SET_TYPE_TAB_DATA', res.data)
  })
}


// 素材类型
const typeList = computed(() => {
  return store.state.material.typeTabData
})

// 素材封面解析
const materialMataData = computed(() => {
  return store.state.IM.materialMataData || null
})

watch(materialMataData, newValue => {
  if (newValue) {
    const fIndex = waitSettingList.value.findIndex(el => el.fileSystem.fileKey === newValue.fileKey)
    if (fIndex !== -1) {
      waitSettingList.value[fIndex].material.coverUrl = newValue.url
    }
  }
})

const emit = defineEmits(['onChangeType'])
// 获取主类型的树状
const typeTreeList = ref([])

function getTypeTreeList() {
  if (waitSettingList.value.length > 0){
    store.commit("material/SET_WAIT_SETTING_LIST", [])
    store.commit('upload/SET_LIST_DATA', []);
  }
  const query = {
    typeId: ctypeId.value
  }
  getMaterialTypeTreeList(query).then(res => {
    typeTreeList.value = res.data || []
    emit('onChangeType', typeTreeList.value)
  })
}


//文件总大小
const CountSize = () => {
  let count = 0
  waitSettingList.value.forEach((item) => {
    count += item.fileSystem?.size
  })
  return formatSize(count)
}
//音效长度
const label = ref([
  {
    "typeId": 34,
    "typeName": "0-10s",
  },
  {
    "typeId": 35,
    "typeName": "10-30s",
  },
  {
    "typeId": 36,
    "typeName": "30-60s",
  },
  {
    "typeId": 37,
    "typeName": "60s以上",
  }
])
//音乐长度
const musicLabel = ref([
  {
    "typeId": 131,
    "typeName": "0-10s",
  },
  {
    "typeId": 132,
    "typeName": "10-30s",
  },
  {
    "typeId": 133,
    "typeName": "30-60s",
  },
  {
    "typeId": 134,
    "typeName": "60s以上",
  }
])
//默认详情
const text = ref('<p><span style="font-size: 20px;">授权渠道</span></p ><p>1、商业广告：投放于电视、网络、线下等各种宣传渠道，音乐应用场景包括产品宣传片、企业宣传片、地铁广告、电梯广告、H5 广告、商业广告、公益广告等</p ><p>2、自媒体视频：可供多个账号使用，音乐应用场景包括公众号短视频、微博短视频、抖音短视频以及其他平台多个账号中的短视频内容和 PGC 内容等 </p ><p>3、商业游戏：投放于商业性游戏中（指需用户需要付费购买或包含内购与广告商业性质的游戏），音乐应用场景包括游戏配乐，游戏官方宣传片 </p ><p>4、在线教育网络课程：用于商业性教学，投放于各类平台或 App 中，音乐应用场景包括网课背景音乐、直播课背景音乐等 </p ><p>5、广播剧/有声读物：投放于 B 站、M 站、喜马拉雅 FM 等网络平台、App或者无线电台中，音乐应用场景包括广播剧、有声书、有声漫画、线上 FM 等内容 </p ><p>6、网剧综艺：投放于网络，音乐应用场景包括网剧、网络动画、网络综艺节目以及相关的预告片、宣传片、制作花絮 </p ><p>7、电影/动漫-网络 - 投放于网络，音乐应用场景包括电影或动画正片、预 告片、宣传片等 </p ><p>8、线下用途：商场、餐馆、咖啡厅、影院、酒吧、年会等线下场所播放背景音乐等</p >')
// 待设置列表
const checks = ref([])
const waitSettingList = computed(() => {
  if (pageType.value === "change") {
    const item = store.state.material.checkList
    checks.value = []
    item.forEach((res) => {
      const s = res.fileAttachedInfoDto
      s.size = s.fileInfo?.size
      s.name = s.filename
      checks.value.push({
        material: res,
        fileSystem: s,
        type: "change"
      })
    })
    return checks.value
  } else {
    const materialList = store.state.material.waitSettingList
    materialList.forEach(res =>{
      res.material.details = text.value
    })
    return materialList
  }
})


// 选中修改的列表
const checkList = computed(() => {
  return store.state.material.checkList
})

const detailsList = ref([])

function getDetails(mid) {
  getMaterialDetail({id: mid}).then(res => {
    detailsList.value = res.data
  })
}

// 上传文件夹/文件夹
let fileId = null;
const handleFiles = (e, id) => {
  switch (e) {
    case 'File':
      fileId = id
      uploadFile.value.click()
      break
    case 'Files':
      uploadFiles.value.click()
      break
  }
}

// 上传文件
const handleUploadFile = (e) => {
  const files = e.target.files;
  for (var File of files) {
    const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
    uploadData.parentId = 0;
    store.commit('upload/addFileList', uploadData)
  }
  uploadFile.value.value = ''
}

// 获取签名
const getUploadSignFun = (obj, callback, errorback) => {
  console.log('obj--', obj);
  // const projectId = obj.projectId;
  const directoryId = 0;
  const filename = obj.FileName;
  const size = obj.FileSize;
  const typeId = ctypeId.value;
  const md5 = obj.FileMD5;
  getUploadSign({directoryId, filename, size,typeId,md5}).then(res => {
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}


//添加音乐音效长度标签id
const labs = ref([])
const labId = ref([])

// 创建文件
const CreateUploadFileFun = ({resultData, options}, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
    typeId: ctypeId.value
  }

  createUploadMaterial(params).then(res => {
    store.commit('material/addFileList', res.data)
    // store.dispatch("clouddisk/getCloudFileList",{parent_id: lastBreadcrumbs.value?.parentId || 0})
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

const addLabel = (res,lab) =>{
  if (res.duration > 60) {
    labs.value.push(lab[3].typeName)
    labId.value.push(lab[3].typeId)
  } else if (res.duration < 60 || res.duration > 30) {
    labs.value.push(lab[2].typeName)
    labId.value.push(lab[2].typeId)
  } else if (res.duration < 30 || res.duration > 10) {
    labs.value.push(lab[1].typeName)
    labId.value.push(lab[1].typeId)
  } else {
    labs.value.push(lab[0].typeName)
    labId.value.push(lab[0].typeId)
  }
}

</script>

<style lang="scss" scoped>
.mtl-main {
  width: 100%;
  height: 100%;
  //display: flex;
  //justify-content: center;
  //align-items: center;

  .top-box {
    width: 100%;
    height: 70px;
    padding: 24px 25px;
    background: #181A1F;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .top-left {
      .text {
        font-size: 15px;
        font-weight: 400;
        color: #CFD2D8;
        line-height: 18px;
      }

      .el-select {
        width: 110px;
        height: 34px;
        border-radius: 20px;
        border: 0px solid #565863;

        :deep(.el-input) {
          input {
            box-shadow: none; //去除白边
            font-size: 12px;
            background: #0C0D11;
            border-radius: 20px !important;
            &:focus {
              outline: 0;
              box-shadow: none; //去除白边
            }
          }
        }

        :deep(.el-input__inner) {
          border-radius: 10px !important;
          background: #131314;
          font-weight: 400;
          color: #CFD2D8;
          line-height: 18px;
        }

      }
    }

    .top-right {
      display: flex;
      font-size: 12px;
      font-weight: 400;
      color: #CFD2D8;
      line-height: 18px;
      text-align: center;

      .common {
        margin: auto 30px auto auto;
      }

      .num {
        margin: auto 30px auto auto;
      }

      .topBtn {
        width: 110px;
        height: 40px;
        background: linear-gradient(45deg, #0459FF 0%, #5726DD 100%);
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 21px;
        margin-right: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .main-box {
    width: 100%;
    padding: 0px 22px;


  }

}
</style>
