<template>
  <div class="content-card">
    <div class="order-main">
      <el-row style="  width: 100%;">
        <el-col :span="listShow.infoName.span" v-if="listShow.infoName.isShow">
          <div class="left">
            <div style="display: flex;width: 100%;">
              <div class="img"  :style="{ 'background-image': `url(${data.material.coverUrl})` }">
                <img :src="!isPlay ? play2 : stopPlayicon" v-if="data.material.typeId < 3 " @click.stop="toPlay" style="width: 35px;height: 35px;position: absolute;margin: 19%">
              </div>
              <div class="order-title">
                <div class="itemTitle" @click.stop="toDetails(data.material.id)">{{ data.material.name }}</div>
                <div class="ztag">
                  <img src="@/assets/material/title-tag1.png">
                  <img src="@/assets/material/title-tag2.png">
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="listShow.number.span" v-if="listShow.number.isShow">
          <!--          v-if="data.material.typeId === 1" -->
          <div class="num">
            {{ data.orderNo ? data.orderNo : '' }}
          </div>
        </el-col>
        <el-col :span="listShow.mainInfo.span" v-if="listShow.mainInfo.isShow">
          <div class="right">
            <el-row>
              <el-col :span="listShow.authType.span" v-if="listShow.authType.isShow">
                <div class="text">
                  <span style="color: rgba(240,242,245,0.8)">{{ data.material.authTypeStr }}</span>
                </div>
              </el-col>
              <el-col :span="listShow.authInfo.span" v-if="listShow.authInfo.isShow">
                <div class="text" style="text-align: center;" v-if="!data.authorizationId">
                  <span class="word" @click.stop="fillIn(data)">请填写授权信息</span>
                </div>
                <div class="text" v-else style="display: block">
                  <div style="    width: 90%;">
                    <div class="mt color-text">{{ data.authorization?.authorizer }}</div>
                    <div class="mt color-text">{{ data.authorization?.certificate }}</div>
                  </div>
                  <span class="word mt" @click.stop="getImpower(data.authorization)">查看授权信息<el-icon><QuestionFilled/></el-icon></span>
                </div>
              </el-col>
              <el-col :span="listShow.price.span" v-if="listShow.price.isShow">
                <div class="number-money">
                  <div>{{ data.price || '免费' }}</div>
                  <div v-if="data.price"><img style="width: 9px;margin-top: 6px;margin-left: 2px"
                                              src="@/assets/user/wallet/tongqian.png"/></div>
                </div>
              </el-col>
              <el-col :span="listShow.op.span" v-if="listShow.op.isShow">
                <div class="text" :style="listShow.downBook.isShow?'':'width: 82px'">
                  <div class="download" v-if="listShow.downBook.isShow" @click.stop="downBook(data)"
                       style="color: #3468FE">
                    下载授权证书
                  </div>
                  <el-button class="download-bt" style="width: 82px" @click.stop="downMaterial(data.id)">下载
                    <!--                    （剩余{{ data.downloadCount }}次）-->
                  </el-button>
                  <!--                  <div class="download">下载授权协议</div>-->
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

  <div
      v-if="[1, 2].includes(data.material.typeId)"
      class="play-box"
      style="display: none"
  >
    <video
        :id="'player-container-id' + data.id"
        preload="auto"
        playsinline
        webkit-playsinline
    ></video>
  </div>
<!--添加授权信息-->
  <word-dialog class="impower" title="添加授权信息" v-model:show="show" @confirm="affirmInfo" @onOpen="openDialog" width="500px" :openType="0">
    <div class="impower-card">
      <el-form
          ref="imPowerFormRef"
          label-width="150px"
          label-position="left"
          :rules="Rules"
          :model="Datas"
      >
        <el-form-item label="授权主体" prop="type">
          <div class="flexC" @click="typeChange" style="margin-right: 50px;cursor: pointer">
            <img :src="Datas.type === 1 ? check2 : check1" style="width: 12px;height: 12px;margin-right: 10px">个人授权
          </div>
          <div class="flexC" @click="typeChange" style="cursor: pointer">
            <img :src="Datas.type === 2 ? check2 : check1" style="width: 12px;height: 12px;margin-right: 10px">公司授权
          </div>
        </el-form-item>
        <template v-if="Datas.type === 1">
          <el-form-item label="姓名" prop="authorizer">
            <el-select v-model="Datas.authorizer" filterable allow-create default-first-option @blur="inputData"
                       :reserve-keyword="false"
                       @change="authorizerChange"
                       placeholder="请输入被授权人姓名">
              <el-option
                  v-for="item in impowerOptions"
                  :key="item.id"
                  :label="item.authorizer"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="certificate">
            <el-input v-model="Datas.certificate" placeholder="请输入被授权人身份证号码"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="Datas.phone" placeholder="请输入联系电话号码"/>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="Datas.address" placeholder="请输入联系地址"/>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="企业名称：" prop="enterpriseName">
            <el-select v-model="Datas.enterpriseName" filterable allow-create default-first-option @blur="inputData"
                       :reserve-keyword="false"
                       @change="authorizerChange"
                       placeholder="请输入被授权公司名称">
              <el-option
                  v-for="item in impowerOptions"
                  :key="item.id"
                  :label="item.authorizer"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="企业纳税人识别号：" prop="enterpriseTaxNo">
            <el-input v-model="Datas.enterpriseTaxNo" placeholder="请输入被授权公司企业识别号"/>
          </el-form-item>
          <el-form-item label="联系人：" prop="contacts">
            <el-input v-model="Datas.contacts" placeholder="请输入企业联系人姓名"/>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model="Datas.phone" placeholder="请输入联系电话号码"/>
          </el-form-item>
          <el-form-item label="联系地址：" prop="address">
            <el-input v-model="Datas.address" placeholder="请输入联系地址"/>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </word-dialog>

<!--查看授权信息-->
  <word-dialog
      :title="title"
      v-model:show="showAffirmInfo"
      :openType="openType"
      :showButton="showAffirmButton"
      @confirm="putImpower"
      width="448px">
    <div class="licenseeData-box">
      <template v-if="Datas.type === 1">
        <div><span>姓名</span>{{ Datas.authorizer }}</div>
        <div><span>身份证号码</span>{{ Datas.certificate }}</div>
        <div v-if="Datas.phone"><span>联系电话</span>{{ Datas.phone }}</div>
        <div v-if="Datas.address"><span>联系地址</span>{{ Datas.address }}</div>
      </template>
      <template v-else>
        <div><span>企业名称</span>{{ Datas.authorizer }}</div>
        <div><span>企业识别号</span>{{ Datas.certificate }}</div>
        <div v-if="Datas.contacts"><span>企业联系人</span>{{ Datas.contacts }}</div>
        <div v-if="Datas.phone"><span>企业联系电话</span>{{ Datas.phone }}</div>
        <div v-if="Datas.address"><span>联系地址</span>{{ Datas.address }}</div>
      </template>
    </div>
  </word-dialog>

</template>

<script setup>
import play2 from '@/assets/icons/play/play2.png'
import stopPlayicon from '@/assets/icons/play/stopPlay.png';
import {ref, reactive, nextTick} from "vue";
import {downloadMaterial} from '@/api/material/index.js'
import {downloadFile} from "@/utils/tool.js"
import {downloadFileCurrent} from "../../../utils/tool";
import WordDialog from '../components/WordDialog'
import {
  addAuthorization,
  exportAuthorization,
  getAuthorization,
  getAuthorizationHistory
} from "@/api/material/purchased";
import {ElMessage} from "element-plus";
import {addRecord} from "../../../api/material";
import {useStore} from "vuex";
import check1 from '@/assets/material/icon_checkbox1.png'
import check2 from '@/assets/material/icon_checkbox.png'


const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
  dataIndex: {
    type: Number,
    default: null,
  },
  playId: {
    type: Number,
    default: 0,
  },
  typeActivateId: {
    type: Number,
    default: -1,
  },
});

const listShowTem = {
  infoName: {
    span: 5, //6 :17
    isShow: true,
  },
  number: {
    span: 4,
    isShow: true
  },
  mainInfo: {
    span: 15,
    isShow: true
  },
  authType: {
    span: 5,
    isShow: true
  },
  authInfo: {
    span: 8,
    isShow: true
  },
  price: {
    span: 4,
    isShow: true,
  },
  op: {
    span: 7,
    isShow: true,
  },
  downBook: {
    isShow: true,
  }
}

const Datas = ref({
  // msg1: "",
  type: 1,//授权类型
  authorizer: '',
  certificate: '',
  contacts: '',
  address: '',
  phone: '',
  materialId: '',
  enterpriseTaxNo: '',
  enterpriseName: '',
})

const Rules = reactive({
  type: [{required: true, message: '请选择授权主体', trigger: 'blur'}],
  enterpriseName: [
    {required: true, message: '请输入被授权公司名称', trigger: 'blur'},
    {min: 1, max: 30, message: "公司名称长度需在 1 ~ 30 字符之内", trigger: "blur"}],
  authorizer: [
    {required: true, message: '请输入被授权人姓名', trigger: 'blur'},
    {min: 1, max: 10, message: "被授权人姓名长度需在 1 ~ 10 字符之内", trigger: "blur"}],
  contacts: [
    {required: true, message: '请输入联系人姓名', trigger: 'blur'},
    {min: 1, max: 10, message: "联系人姓名长度需在 1 ~ 10 字符之内", trigger: "blur"}],
  enterpriseTaxNo: [
    {required: true, message: '请输入被授权公司企业纳税识别号', trigger: 'blur'},
    {pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/, message: '请输入正确的企业纳税识别号', trigger: 'blur'}],
  certificate: [{required: true, validator: validateIdNumber, trigger: 'blur'}],
  address: [{min: 5, max: 30, message: "地址长度需在 5 ~ 30 字符之内", trigger: "blur"}],
  phone: [{min: 1, max: 15, message: "请输入正确的联系电话", trigger: "blur"},
    {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的联系电话', trigger: 'blur'}],
})

function validateIdNumber(rule, value, callback) {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!value) {
    callback(new Error('请输入被授权人身份证号'));
  } else if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的身份证号'));
  }
};

const inputData = (val) => {
  nextTick(async () => {
    if (val.target.value) {
      if (Datas.value.type === 1) {
        Datas.value.authorizer = val.target.value
        await proxy.$refs.imPowerFormRef.validateField('authorizer');
      } else {
        Datas.value.enterpriseName = val.target.value
        await proxy.$refs.imPowerFormRef.validateField('enterpriseName');
      }
    }
  })
}
const reset = () => {
  Datas.value.authorizer = ''
  Datas.value.certificate = ''
  Datas.value.contacts = ''
  Datas.value.address = ''
  Datas.value.materialId = ''
  Datas.value.phone = ''
  Datas.value.enterpriseTaxNo = ''
  Datas.value.enterpriseName = ''
}

const listShow = computed(() => {
  if (props.typeActivateId === 3) {
    listShowTem.authInfo.isShow = false;
    listShowTem.authType.isShow = false;
    listShowTem.infoName.span = 14;
    listShowTem.mainInfo.span = 5;
    listShowTem.op.span = 5;
    listShowTem.downBook.isShow = false;
  } else if (props.typeActivateId === 4) {
    listShowTem.authInfo.isShow = false;
    listShowTem.authType.isShow = false;
    listShowTem.infoName.span = 19;
    listShowTem.mainInfo.span = 5;
    listShowTem.op.span = 5;
    listShowTem.downBook.isShow = false;
    listShowTem.number.isShow = false;
  }
  return listShowTem
})
const router = useRouter();
const isPlay = ref(false)
const player = ref(null)
const playerDuration = ref(0); // 长度

const emit = defineEmits([
  'onPlay', 'onGetInfo'
]);

watch(
    () => props.playId,
    (newId) => {
      if (player.value !== null && newId !== props.data.id && isPlay) {
        player.value.pause();
      }
    }
);

// 下载素材
function downMaterial(id) {
  downloadMaterial(id).then(res => {
    const url = res.data.downloadUrl
    const filename = res.data.filename
    downloadFileCurrent(url, filename)
  })
}

//下载授权书
function downBook(item) {
  if (item.authorization) {
    exportAuthorization({id: item.authorization.id}).then(res => {
      let blob = ''
      let fileName = ''
      blob = new Blob([res], {type: "application/pdf;charset=utf-8"})
      fileName = item.material.name + '-授权证书.pdf'
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    })
  } else {
    show.value = true
    mId.value = item.material.id
  }


}

// 播放音乐
const toPlay = () => {
  if (player.value === null) {
    playerInit();
  } else {
    playPause();
  }
};

/**
 * @percent 播放时间百分比
 */
function playerInit(percent) {

  if (props.data.material.fileAttachedInfoDto.sign?.dataFormat === 'kodo') {
    const url = props.data.material.fileAttachedInfoDto.sign.list[0].key
    player.value = TCPlayer('player-container-id' + props.data.id, {}); // player-container-id 为播放器容器 ID，必须与 html 中一致
    player.value.src(url); // url 播放地址
  } else {

    const playOptions = {
      fileID: props.data.material.fileAttachedInfoDto.sign?.fileId,
      appID: props.data.material.fileAttachedInfoDto.sign?.appId,
      psign: props.data.material.fileAttachedInfoDto.sign?.sign,
      controls: false,
    };
    player.value = TCPlayer(
        'player-container-id' + props.data.id,
        playOptions
    );
  }
  player.value.one('canplay', () => {
    playerDuration.value = player.value.duration();
    // player.value.currentTime((playerDuration.value * percent) / 100);
    playPause();
  });
  player.value.on('play', function () {
    isPlay.value = true;
    addPlayRecord()
    emit('onPlay', props.data.id);
  });
  player.value.on('pause', function () {
    isPlay.value = false;
  });
  player.value.on('timeupdate', () => {
    // onTimeChange();
  });
  player.value.on('error', function (e) {
    console.log('---error---', e);
  });
}

const mpId = ref()

//添加播放记录
function addPlayRecord() {
  if (mpId.value !== props.data.material.id) {
    addRecord({materialId: props.data.material.id}).then(res => {
    })
    mpId.value = props.data.material.id
  }
}

// 播放暂停
function playPause() {
  if (!isPlay.value) {
    player.value.play();
  } else {
    player.value.pause();
  }
}

//跳转详情页
const store = useStore();
const toDetails = (id) => {
  router.push({
    path: `details/${id}`,
    query: {type:'1'}
  });
};


const show = ref(false)
const showAffirmInfo = ref(false);
const showAffirmButton = ref(true);
const mId = ref('')
const mItem = ref({})

function fillIn(item) {
  show.value = true
  mId.value = item.material.id
  mItem.value = item.orderNo
}

const impowerOptions = ref([])
const imPowerFormRef = ref()
const title = ref('')
const openType = ref(1)
const {proxy} = getCurrentInstance();

//查看授权信息
function getImpower(data) {
  showAffirmInfo.value = true;
  showAffirmButton.value = false;//不显示弹窗按钮
  title.value = '素材授权信息'
  Datas.value = data
}

const affirmInfo = async () => {
  if (Datas.value.type === 1) {
    await proxy.$refs.imPowerFormRef.validateField('authorizer');
    await proxy.$refs.imPowerFormRef.validateField('certificate');
  } else {
    await proxy.$refs.imPowerFormRef.validateField('enterpriseName');
    await proxy.$refs.imPowerFormRef.validateField('enterpriseTaxNo');
    Datas.value.authorizer = Datas.value.enterpriseName
    Datas.value.certificate = Datas.value.enterpriseTaxNo
  }
  showAffirmInfo.value = true
  showAffirmButton.value = true;
  title.value = '确认授权信息'
  openType.value = 3
}

//确认提交授权信息
function putImpower() {
  Datas.value.materialId = mId.value
  Datas.value.orderNo = mItem.value
  addAuthorization(Datas.value).then(res => {
    ElMessage({
      showClose: true,
      message: '授权信息添加成功',
      type: 'success',
      duration: 800
    })
    emit('onGetInfo');
    showAffirmInfo.value = false
    show.value = false
  })
}

function openDialog() {
  if (imPowerFormRef.value) {
    imPowerFormRef.value.resetFields()
  }
  reset()
  Datas.value.type = 1
  getHistory()
}

function getHistory() {
  getAuthorizationHistory({type: Datas.value.type}).then(res => {
    impowerOptions.value = res.data
  })
}

function authorizerChange(val) {
  if (imPowerFormRef.value) {
    imPowerFormRef.value.clearValidate()
  }
  const obj = impowerOptions.value.find(el => el.id === val)
  if (obj) {
    if (Datas.value.type === 1) {
      Datas.value.authorizer = obj.authorizer
      Datas.value.phone = obj.phone
      Datas.value.address = obj.address
      Datas.value.certificate = obj.certificate
    } else {
      Datas.value.enterpriseName = obj.authorizer
      Datas.value.enterpriseTaxNo = obj.certificate
      Datas.value.contacts = obj.contacts
      Datas.value.phone = obj.phone
      Datas.value.address = obj.address
    }
  }
}

const typeChange = () => {
  Datas.value.type = Datas.value.type === 1 ? 2 : 1
  reset()
  getHistory()
}

</script>
<style scoped lang="scss">
@import "./style.scss";

.word {
  cursor: pointer;
  display: flex;
  color: #3468FE;

  &:hover {
    color: #3468FE;
    text-decoration: underline
  }
}

.mt {
  margin-top: 5px;
}

.color-text {
  color: #9094A6;
  font-weight: 400;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: url("@/assets/material/icon_checkbox.png");
  width: 14px;
  height: 14px;
  background-size: cover;
}

.flexC {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
