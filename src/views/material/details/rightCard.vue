<template>
  <div class="card">
    <div class="card-main">
      <div class="main-top">
        <div class="flex">
          <div class="main-title">
            <el-tooltip class="box-item" effect="dark" :content="detail.name" placement="top">
              {{ detail.name }}
            </el-tooltip>
          </div>
          <div class="top-icon">
            <template v-if="detail.typeId === 5 || detail.typeId === 6">
              <img src="@/assets/material/details/top-icon3.png" style="width: 64px;margin-left: 10px"/>
            </template>
            <template v-else>
              <img src="@/assets/material/details/top-icon1.png"/>
              <img src="@/assets/material/details/top-icon2.png"/>
            </template>
          </div>
        </div>
        <div class="flex" style="margin-top: 20px;margin-bottom: 20px;">
          <div class="flex">
            <el-avatar :size="32" style="background-color: black;" :src="detail.authorAvatar"/>
            <span class="authorName"> {{ detail.authorName || '' }} </span>
          </div>
          <div style="margin-left: 70px">编号：{{ detail.id }}</div>
        </div>
      </div>
      <div class="main-mid">
        <div class="min-top">
          <el-row>
            <el-col :span="12">
              <div v-if="detail.typeId === 1 || detail.typeId===2">
                <div class="text mid-text">软件：无</div>
                <div class="text mid-text">
                  <span v-if="detail.typeId===2">音乐</span><span
                    v-else>音效</span>时长：{{ secondToDate(detail.metaData?.Duration || 0) }}
                </div>
              </div>
              <div v-if="detail.typeId===4 ||detail.typeId===3">
                <div class="text mid-text">软件：无</div>
                <div class="text mid-text">格式：无</div>
              </div>
              <div v-if="detail.typeId===5">
                <div class="text mid-text">格式：{{ detail.suffix || 'MP4' }}</div>
                <div class="text mid-text"> 视频时长：{{ secondToDate(detail.queryPixAbayMaterialVO?.duration || 0) }}</div>
              </div>
              <div v-if="detail.typeId===6">
                <div class="text mid-text">软件：无</div>
                <div class="mid-text">发布时间：{{
                    parseTime(detail.queryPixAbayMaterialVO.createTime, '{y}年{m}月{d}日')
                  }}
                </div>
              </div>
            </el-col>

            <el-col :span="12">
              <div v-if="detail.typeId !==5 && detail.typeId!==6">
                <div class="text mid-text">大小：{{ formatSize(detail.fileAttachedInfoDto?.fileInfo.size) }}</div>
                <div class="mid-text">发布时间：{{ parseTime(detail.createTime, '{y}年{m}月{d}日') }}</div>
              </div>
              <div v-else-if="detail.typeId===5">
                <div class="text mid-text">
                  尺寸：{{ videoWidth + '×' + videoHeight }}
                </div>
                <div class="mid-text">发布时间：{{
                    parseTime(detail.queryPixAbayMaterialVO.createTime, '{y}年{m}月{d}日')
                  }}
                </div>
              </div>
              <div v-else-if="detail.typeId===6">
                <div class="text mid-text">大小：{{
                    formatSize(detail.fileAttachedInfoDto ? detail.fileAttachedInfoDto.fileInfo.size : detail.queryPixAbayMaterialVO.imageSize)
                  }}
                </div>
                <div class="text mid-text">文件格式：{{ detail.suffix || '.jpg' }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="min-btn">
          <!--图片详情-下载图片-->
          <div class="btn1" v-if="detail.queryPixAbayMaterialVO && detail.typeId===6" @click.stop="downImage(detail.queryPixAbayMaterialVO)"> 立即下载 </div>
          <!--视频详情-下载图片-->
          <template v-else-if="detail.queryPixAbayMaterialVO && detail.typeId===5">
            <el-popover placement="bottom" :width="240" trigger="click">
              <template #reference>
                <div class="btn1">
                  立即下载
                </div>
              </template>
              <template #default>
                <div class="down-box">
                  <el-radio-group v-model="downSize">
                    <el-radio :label="index" v-for="(item,index) in downList" :key="index">
                      {{ item.width + '×' + item.height }}&nbsp;&nbsp; MP4&nbsp;&nbsp;
                      {{ formatSize(item.size) }}
                    </el-radio>
                  </el-radio-group>
                  <el-button type="primary" round @click="downVideo">下载</el-button>
                </div>
              </template>
            </el-popover>

          </template>
          <!--   pageType==='1'已购的素材显示立即下载-->
          <div class="btn1" v-else-if="pageType==='1'" @click.stop="downMaterial()">立即下载</div>
          <!--   其他-->
          <div class="btn1" v-else @click.stop="handleBuy()">立即购买</div>
        </div>
        <div class="flex min-btm" :style="{'margin-top': detail.typeId === 3 || detail.typeId === 4 ? '0px':'20px'}">
          <template v-if="detail.typeId !== 7 && detail.typeId !== 3  && detail.typeId !== 4">
            <template v-if="detail.typeId === 1 || detail.typeId === 2">
              <span class="btm-test" v-if="detail.typeId === 1 || detail.typeId === 2">授权方式：全球使用，随片永久&nbsp;&nbsp;<a :href="Url" target="_blank" v-color="'rgba(52,104,254,0.85)'">查看授权书样板</a></span>
              <el-tooltip class="box-item" effect="light" raw-content placement="bottom" :show-after="500"
                          content="您在影音同画购买素材进行商用授权后，平台均提供《授权书》作为授权证明。<br>若您需要，还可以申请《授权合同》，让您的权益获得坚实的保障。<br>如有第三方冒称您对音乐作品的使用行为侵犯其合法权益，请您及时联系平台，<br>我们将为您免费提供法律援助，助您解决法律纠纷。">
                <img :src="question" style="cursor: pointer"/>
              </el-tooltip>
            </template>
            <template v-else>
              <span class="btm-test" >授权方式：可以做商业用途，不需要署名</span>
            </template>
          </template>
        </div>
      </div>
      <div class="main-bottom">
        <div v-if="detail.typeId !== 5 && detail.typeId !== 6">
          <div class="btm" style="margin-right:40px" v-if="!detail.purchase">
            <div class="icon" @click.stop="handleAddOrDelCart(detail.id)">
              <img :src="detail.shoppingCart ? aShoppingCart : ShoppingCart"/>
            </div>
            <span class="text">加入购物车&nbsp;({{ shoppingCartList.length > 99 ? '99+' : shoppingCartList.length }})</span>
          </div>
          <div class="btm" style="margin-right:40px" v-else>
            <div class="icon" style="opacity: 0.2; cursor: not-allowed">
              <el-tooltip class="box-item" effect="light" content="已购买" placement="top" :show-after="500" >
                <img :src="ShoppingCart"/>
              </el-tooltip>
            </div>
            <span class="text">加入购物车&nbsp;({{ shoppingCartList.length > 99 ? '99+' : shoppingCartList.length }})</span>
          </div>
        </div>
        <div class="btm">
          <div class="icon" @click.stop="handleAddOrDelCollection(detail.id)">
            <img :src="detail.collection ? aShoucang : shoucang"/>
          </div>
          <span class="text">收藏&nbsp;({{ detail.collectionCount || 0 }})</span>
        </div>

        <!--        <div class="btm">-->
        <!--          <div class="icon" @click.stop="downMaterialTry()">-->
        <!--            <img :src="download"/>-->
        <!--          </div>-->
        <!--          <span class="text">下载试听</span>-->
        <!--        </div>-->

        <!--        <div class="btm">-->
        <!--          <div class="icon" @click.stop="handleShare">-->
        <!--            <img :src="share" />-->
        <!--          </div>-->
        <!--          <span class="text">分享</span>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
  <div class="other">
    <div class="text" v-color="'#ffffff'">相关标签</div>
    <div class="tagItem" v-if="detail.queryPixAbayMaterialVO">
      <div
          class="tag"
          v-for="(keywords, index) in detail.queryPixAbayMaterialVO.tags.split(',')"
          :key="index">
        {{ keywords }}
      </div>
    </div>
    <div class="tagItem" v-else-if=" detail.keywordsArray?.length > 0">
      <div
          class="tag"
          v-for="(keywords, index) in Array.from(new Set(detail.keywordsArray))"
          :key="index"
      >
        {{ keywords }}
      </div>
    </div>
    <div class="tagItem" v-else>
      <div class="tag">
        暂无相关标签
      </div>
    </div>

  </div>

  <!-- 支付确认 -->
  <PayConfirmDialog
      v-if="payShow"
      v-model:show="payShow"
      :orderInfo="orderInfo"
      @onClose="handlePayClose"
      @onPayConfirm="handlePayConfirm"
  ></PayConfirmDialog>

  <!--  购买成功提示弹窗-->
  <pay-succed-dialog ref="paySuccedDialog"></pay-succed-dialog>

</template>

<script setup>
import question from '@/assets/material/question.png';
import share from '@/assets/material/share.png';
import shoucang from '@/assets/material/details/icon-shoucang1.png';
import aShoucang from '@/assets/material/details/icon-shoucang2.png';
import ShoppingCart from '@/assets/material/details/icon-shoppingcar1.png';
import aShoppingCart from '@/assets/material/details/icon-shoppingcar2.png';
import {formatSize, secondToDate} from '@/utils/tool.js';
import {ref, computed, onMounted} from 'vue';
import {watch} from 'vue';
import {createMaterialOrder} from '@/api/material/order.js';
import {downloadFile} from '@/utils/tool.js';
import {ElMessage, ElMessageBox} from 'element-plus';
import PayConfirmDialog from '../components/PayConfirmDialog';
import {addCollection} from '@/api/material/collection.js';
import {addShoppingCart} from '@/api/material/shoppingCart.js';
import {parseTime} from "@/utils/ruoyi";
import {useRouter} from "vue-router";
import PaySuccedDialog from '../components/paySuccedDialog/index.vue'
import {downloadMaterial} from "../../../api/material";
const props = defineProps({
  detail: {
    type: Object,
    default: {},
  },
});

const store = useStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const orderInfo = ref({});
const payShow = ref(false);
const money = computed(() => {
  return store.state.user.money;
})
const emit = defineEmits(['onPaySuccess', 'onCollection', 'onCart', 'onDetails']);
const videoWidth = ref('')
const videoHeight = ref('')
const downSize = ref(0)
const downList = ref([])

const pageType = ref('')
onMounted(() => {
  if (route.query.type){
    pageType.value = route.query.type
  }
})

watch(() => props.detail, newVal => {
  if (props.detail && props.detail.typeId === 5) {
    let videoInfo = JSON.parse(props.detail.queryPixAbayMaterialVO.videos)
    for (let i in videoInfo) {
      let obj = videoInfo[i]
      downList.value.unshift(obj)
    }
    videoWidth.value = videoInfo.large.width
    videoHeight.value = videoInfo.large.height
  }
}, {deep: true, immediate: true})

//立即购买
function handleBuy() {
  if (money.value < props.detail.memberPrice) {
    ElMessageBox.confirm('当前同钱余额不足，是否立即充值同钱？', '提示', {
      customClass: 'messageBox-custom-warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    })
        .then(() => {
          proxy.$pay.openRecharge()
        }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消购买',
      });
    });
  } else if (money.value >= props.detail.memberPrice) {
    createMaterialOrder({materialIds: [props.detail.id]}).then((res) => {
      orderInfo.value = res.data
      orderInfo.value.name = props.detail.name
      payShow.value = true
    });
  }
}

function handlePayClose() {
  payShow.value = false;
}

function downMaterial() {
  const query = {
    id: props.detail.id,
  };
  downloadMaterial(query).then((res) => {
    const url = res.data.downloadUrl;
    const filename = res.data.filename;
    downloadFile(url, filename);
  });
}

//购买成功提示弹窗
const paySuccedDialog = ref(null)
// 确认支付
function handlePayConfirm(order) {
  proxy.$pay.openPay({
    orderNo: order.transactionNo,
    confirm: (e) => {
      return new Promise((resolve, reject) => {
        emit('onPaySuccess', props.detail);
        // setTimeout(res=>{
        // emit('onDetails');
        // },500)
        paySuccedDialog.value.open()
        resolve(res);
      });
    },
    error: (err) => {
      if (typeof err == 'object') {
        if (err.code == 1010) {
          proxy.$pay.openRecharge();
        }
      }
    },
  });
}

//下载图片
function downImage(item) {
  const url = item.largeImageUrl;
  const fileName = props.detail.queryPixAbayMaterialVO.name;
  handleDown(url, fileName)
  // downloadFile(url, filename);
}

function downVideo() {
  const url = downList.value[downSize.value].url;
  const fileName = props.detail.queryPixAbayMaterialVO.name;
  handleDown(url, fileName)
}

function handleDown(url, name) {
  let link = url
  let fileName = name
  let x = new XMLHttpRequest()
  x.open('GET', link, true)
  x.responseType = 'blob'
  x.onload = (e) => {
    let url = window.URL.createObjectURL(x.response)
    let a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }
  x.send()
}
//授权书样板链接
const Url = 'https://mypublic.yingyintonghua.com/%E5%BD%B1%E9%9F%B3%E5%90%8C%E7%94%BB%E6%8E%88%E6%9D%83%E8%AF%81%E4%B9%A6-%E6%B0%B4%E5%8D%B0.pdf'

//下载试听(暂时无用)
function downMaterialTry() {
  const url = 'https://m801.music.126.net/20220831095552/ba19626e3f8a3196459fb5f7561403ad/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096577715/c4e5/f871/d8d0/238e1cccd09bb1f5bb157e082112b8dd.mp3';
  const filename = '授权书';
  downloadFile(url, filename);
}

// 加入/删除收藏
function handleAddOrDelCollection(materialId) {
  const params = {
    materialId,
  };
  addCollection(params).then((res) => {
    emit('onCollection');
  });
}

// 添加/删除购物车
function handleAddOrDelCart(materialId) {
  const params = {
    materialId,
  };
  addShoppingCart(params).then((res) => {
    store.dispatch('material/getCartList', {pageNum: 0, pageSize: 1000});
    emit('onCart');
  });
}


const handleShare = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    ElMessage({
      type: 'success',
      message: '复制链接成功',
    });
  });
}

//购物车列表数量
const shoppingCartList = computed(() => {
  return store.state.material.shoppingCartList;
});

</script>

<style scoped lang="scss">

.card {
  width: 100%;
  //min-width:412px;
  //height: 560px;
  background: #111216;
  border-radius: 10px;
  backdrop-filter: blur(0px);
  font-size: 12px;
  font-weight: 400;
  color: #9094a6;
  //line-height: 21px;
  .card-main {
    padding: 24px;

    .flex {
      display: flex;
      align-items: center;
    }

    .main-top {
      border-bottom: 1px solid rgba(151, 151, 151, 0.13);

      .main-title {
        //margin-top: 14px;
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
        //line-height: 27px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }

      .top-icon {
        padding-left: 5px;
        flex: 0 0 auto;

        img {
          width: 30px;
          //height: 30px;
          margin-right: 5px;
        }
      }

      .authorName {
        margin-left: 8px;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }

      .top-text {
        font-size: 8px;
        font-weight: 500;
        color: #212121;
        line-height: 14px;
        margin-left: -2px;
        transform: scale(0.7);
        width: 25px;
      }
    }

    .main-mid {
      font-size: 14px;
      //line-height: 21px;
      .min-top {
        margin-top: 24px;

        .mid-text {
          margin-bottom: 10px;
          //justify-content: space-between;
        }
      }

      .min-btn {
        font-size: 16px;
        font-weight: 500;
        //line-height: 24px;
        color: #FFFFFF;

        .text {
          line-height: 2;
        }

        .btn1 {
          margin-top: 11px;
          height: 50px;
          border-radius: 25px;
          background: #3468FE;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }

      .min-btm {
        margin-top: 20px;
        padding-bottom: 20px;
        font-size: 14px;
        justify-content: center;
        border-bottom: 1px solid rgba(151, 151, 151, 0.13);

        .btm-test {
          line-height: 2;
        }

      }
    }

    .main-bottom {
      display: flex;
      //justify-content: space-between;
      margin-top: 20px;

      .btm {
        display: flex;
        cursor: pointer;

        .text {
          margin: auto auto auto 8px;
        }

        .icon {
          background-color: rgba(33, 34, 43, 1);
          border-radius: 50%;
          height: 30px;
          width: 30px;
          justify-content: center;
          align-items: center;
          display: flex;

          img {
            width: 30px;
            height: 30px;
          }

          &:hover {
            background-color: #33353d;
          }
        }
      }
    }
  }
}

.other {
  background: #111216;
  border-radius: 10px;
  backdrop-filter: blur(0px);
  margin-top: 15px;
  font-weight: 400;
  font-size: 14px;
  padding: 24px;

  .tagItem {
    display: flex;
    flex-wrap: wrap;
    margin-top: 18px;
    margin-bottom: 16px;

    .tag {
      flex: 0 0 auto;
      height: 30px;
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 5px 7px;
      border-radius: 4px;
      border: 1px solid #4E5262;
      color: #4E5262;
      font-size: 14px;
      font-weight: 400;
      //line-height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

}

.down-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 20px;

  color: #1C1D24;
}
</style>
