<template>
  <div class="content-card" v-if="data.typeId < 5&&data.typeId!==3">
    <div class="card-box">
      <div class="card-left">
        <div class="img" :style="{ 'background-image': `url(${data.coverUrl})` }">
          <img v-if="data.typeId < 3"
               :src="!isPlay ? play2 : stopPlayicon" @click="toPlay()"
               style="width: 40px; height: 40px; position: absolute; margin: 22%"/>
        </div>

        <div class="data">
          <div style="overflow: auto;">
            <div class="name">
              <div class="title" @click="toDetails(data.id)">
                {{ data.name }}
              </div>
              <div class="ztag">
                <img src="@/assets/material/title-tag1.png">
                <img src="@/assets/material/title-tag2.png">
              </div>
            </div>
            <div class="tags">
              <div class="tag" v-for="tags in  Array.from(new Set( data.keywordsArray.slice(0,3)))" :key="tags">
                {{ tags }}
              </div>
              <div class="icon-box" v-if="data.keywordsArray.length > 3"
                   @mouseover="getOther(data.keywordsArray)"
                   v-contextmenu:LabelMenu="{ trigger: 'mouseover' }"
              >
                <MoreFilled style="padding: 0px 3px"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-mid">
        <div v-if="data.typeId === 1 || data.typeId === 2" class="wave-box">
          <wave-form
              :audioWave="data.fileAttachedInfoDto.audioWave || []"
              :canvasHeight="60"
              :shapeHeight="60"
              :waveStep="5"
              :progressColor="'#79a5fc'"
              :duration="data.fileData.Duration || 0"
              :playPercent="playPercent"
              :waveWidth="1"
              @onPlayPercent="handlePlayPercent"
          >
          </wave-form>
          <div class="curTime">{{ secondToDate(currentTime) }} / {{ secondToDate(data.fileData.Duration || 0) }}</div>
          <!--            <div class="audio-info">-->
          <!--              <span>{{data.fileData.Container}}</span>-->
          <!--              <span>{{formatSize(data.fileAttachedInfoDto.fileInfo.size || 0)}}</span>-->
          <!--              <span>{{secondToDate(data.Duration || 0)}}</span>-->
          <!--            </div>-->
        </div>
        <div
            style="width: 200px;display: flex;border-left: #30323B 1px solid;border-right: #30323B 1px solid;height: 30px;">
          <div class="price flexC">
            <div class="pNum">
              <div style="font-size: 16px">
                <span>{{ (data.price === 0 || data.price === null) ? '免费' : data.price || '免费' }}</span>
              </div>
              <div class="section32 flex-col"></div>
            </div>
            <div class="cost">原价</div>
          </div>
          <div class="price flexC">
            <div class="pNum">
              <div style="font-size: 16px">{{
                  (data.memberPrice === 0 || data.memberPrice === null) ? '免费' : data.memberPrice || '免费'
                }}
              </div>
              <div class="section32 flex-col"></div>
            </div>
            <div class="cost">会员价</div>
          </div>
        </div>

        <!--        <div class="shopping">-->
        <!--          <div v-if="!data.purchase" class="icon">-->
        <!--            <img-->
        <!--                :src="data.shoppingCart ? aShoppingCart : ShoppingCart"-->
        <!--                @click="handleAddOrDelCart(data.id)"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <div class="card-right ">
        <div class="flexE">
          <div class="shopping flex">
            <div class="icon">
              <img :src="data.collection === false ? aShoucang : shoucang"
                   @click.stop="handleAddOrDelCollection(data.id)"/>
            </div>
            <div v-if="!data.purchase" class="icon">
              <img :src="data.shoppingCart ? aShoppingCart : ShoppingCart"
                   @click="handleAddOrDelCart(data.id)"/>
            </div>
            <div v-else class="icon" @click.stop="" style="opacity:.4;cursor:not-allowed">
              <el-tooltip
                  class="box-item"
                  effect="light"
                  content="已购买"
                  placement="top"
                  :show-after="500"
              >
                <img :src="ShoppingCart"/>
              </el-tooltip>
            </div>
          </div>
          <div class="flexE">
                <div class="buy" @click="handleBuy">立即购买</div>
<!--            <div class="buy" @click="handleDownload">立即下载</div>-->
          </div>

        </div>

      </div>
    </div>
  </div>

  <el-col :style="{maxWidth: cardWidth,flex:cardWidth?('0 0 ' + cardWidth + '%') : false}" style="padding: 5px;" v-else-if="data.typeId===3">
    <div class="file-item-card">
      <div class="file-item-content" @click="toDetails(data.id)">
        <div class="file-item-cover file-item-image" >
          <div v-if="data.coverUrl" style="height:100%;width: 100px;background-repeat: no-repeat;background-size: contain;">
            <FileType type="url" :url="data.coverUrl"></FileType>
          </div>
        </div>

        <div class="collect-cart-down">
          <div class="icon">
            <img :src="data.collection === false ? aShoucang : shoucang" @click.stop="handleAddOrDelCollection(data.id)"/>
          </div>
          <div v-if="!data.purchase" class="icon">
            <img :src="data.shoppingCart ? aShoppingCart : ShoppingCart"  @click.stop="handleAddOrDelCart(data.id)"/>
          </div>
          <div v-else class="icon" @click.stop="" style="opacity:.4;cursor:not-allowed">
            <el-tooltip class="box-item" effect="light" content="已购买" placement="top" :show-after="500"            >
              <img :src="ShoppingCart"/>
            </el-tooltip>
          </div>
        </div>

        <div class="file-item-info">
          <div class="detail">
            <div class="top">
              <div class="title" @click="toDetails(data.id)">
                {{ data.name }}
              </div>
              <div class="ztag">
                <img src="@/assets/material/title-tag1.png">
                <img src="@/assets/material/title-tag2.png">
              </div>
            </div>
            <div class="detail-bottom">
              <div class="left">
                <div class="price">
                  <div style="display: flex; align-items: center">
                    <span class="p-title">原价</span>
                    <div style="font-size: 16px;color: #FF9F03;">
                      {{ (data.price === 0 || data.price === null) ? '免费' : data.price || '免费' }}
                    </div>
                    <div class="section32 flex-col" v-if="data.price !== 0 "></div>
                  </div>
                  <div class="vcost">
                    <span class="p-title">会员价</span>
                    <span style="font-size: 16px;color: #FF9F03;"> {{ (data.memberPrice === 0 || data.memberPrice === null) ? '免费' : data.memberPrice || '免费' }}</span>
                    <div class="section32 flex-col" v-if="data.memberPrice !== 0 "></div>
                  </div>
                </div>
              </div>
              <div class="right">
                <!-- 已售{{data.soldCount}} -->
                <div class="buy" @click.stop="handleBuy">立即购买</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-col>

  <div v-if="[1,2,5].includes(data.typeId)" class="play-box" style="display:none">
    <video :id="'player-container-id'+data.fileAttachedInfoDto.fileId" preload="auto" playsinline
           webkit-playsinline></video>
  </div>


  <!-- 支付确认 -->
  <PayConfirmDialog v-if="payShow" v-model:show="payShow" :orderInfo="orderInfo" @onClose="handlePayClose" @onPayConfirm="handlePayConfirm"
  ></PayConfirmDialog>

  <v-contextmenu ref="LabelMenu">
    <div style="max-height: 200px;overflow: hidden">
      <el-scrollbar max-height="200px">
        <v-contextmenu-item v-for="lab in otherLabel" :key="lab">
          <template #label>
            {{ lab }}
          </template>
        </v-contextmenu-item>
      </el-scrollbar>
    </div>
  </v-contextmenu>

  <!--  购买成功提示弹窗-->
  <pay-succed-dialog ref="paySuccedDialog"></pay-succed-dialog>

</template>

<script setup>
import play2 from '@/assets/icons/play/play2.png'
import stopPlayicon from '@/assets/icons/play/stopPlay.png';
import ShoppingCart from '@/assets/images/icon_Shopping Cart.png';
import aShoppingCart from '@/assets/images/aShoppingCart.png';
import WaveForm from '@/components/WaveForm'
import shoucang from '@/assets/images/icon_shoucang.png';
import aShoucang from '@/assets/images/aShoucang.png';
import {secondToDate, formatSize} from '@/utils/tool.js';
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {createMaterialOrder} from "../../../../api/material/order";
import {ElMessage, ElMessageBox} from "element-plus";
import {addRecord, downloadMaterial} from "../../../../api/material";
import {downloadFile} from "../../../../utils/tool";
import FileType from '@/components/FileType';
import {addShoppingCart} from "../../../../api/material/shoppingCart";
import PayConfirmDialog from '../../components/PayConfirmDialog'
import {addCollection} from "../../../../api/material/collection";
import {computed} from "vue";
import {useWindowSize} from "@vueuse/core";
import PaySuccedDialog from '../../components/paySuccedDialog/index.vue'
const playPercent = ref(0) // 播放百分比
const player = ref(null)
const playerDuration = ref(0) // 长度
const isPlay = ref(false)
const orderInfo = ref({});
const payShow = ref(false);
const store = useStore();
const {proxy} = getCurrentInstance();
const props = defineProps({
  viewName: {
    type: String,
    default: '中国智造ABCabc123',
  },
  data: {
    type: Object,
    default: {}
  },
  dataIndex: {
    type: Number,
    default: null
  },
  playId: {
    type: Number,
    default: 0,
  },
})

watch(
    () => props.playId,
    (newId) => {
      if (player.value !== null && newId !== props.data.id && isPlay) {
        player.value.pause();
      }
    }
);

//获取隐藏标签
const otherLabel = ref([])
const getOther = (list) => {
  otherLabel.value = list.slice(3, list.length)
}

function handlePlayPercent(per) {
  playPercent.value = per;
  if (player.value === null) {
    playerInit(per)
  } else {
    player.value.currentTime((playerDuration.value * per) / 100);
    player.value.play();
  }
}

/**
 * @percent 播放时间百分比
 */
function playerInit(percent) {
  if (props.data.fileAttachedInfoDto.sign?.dataFormat === 'kodo') {
    const url = props.data.fileAttachedInfoDto.sign.list[0].key
    player.value = TCPlayer('player-container-id' + props.data.fileAttachedInfoDto.fileId, {}); // player-container-id 为播放器容器 ID，必须与 html 中一致
    player.value.src(url); // url 播放地址
  } else {
    const playOptions = {
      fileID: props.data.fileAttachedInfoDto.sign?.fileId,
      appID: props.data.fileAttachedInfoDto.sign?.appId,
      psign: props.data.fileAttachedInfoDto.sign?.sign,
      controls: false,
    }
    player.value = TCPlayer('player-container-id' + props.data.fileAttachedInfoDto.fileId, playOptions);
  }
  player.value.one('canplay', () => {
    console.log('canplay');
    playerDuration.value = player.value.duration();
    player.value.currentTime((playerDuration.value * percent) / 100);
    playPause()
  });
  player.value.on('play', function () {
    isPlay.value = true;
    console.log('play');
    addPlayRecord()
    emit('onPlay', props.data.id);
  });
  player.value.on('pause', function () {
    isPlay.value = false;
    console.log('pause');
  });
  player.value.on('timeupdate', () => {
    onTimeChange();
  });
  player.value.on('error', function (e) {
    console.log('---error---', e);
  });
}

const mpId = ref()

//添加播放记录
function addPlayRecord() {
  if (mpId.value !== props.data.id) {
    addRecord({materialId: props.data.id}).then(res => {
    })
    mpId.value = props.data.id
  }
}

const currentTime = ref("00.00")

function onTimeChange() {
  currentTime.value = player.value?.currentTime();
  let percent = currentTime.value / playerDuration.value;
  playPercent.value = percent * 100;
}

// 播放暂停
function playPause() {
  if (!isPlay.value) {
    player.value.play();
  } else {
    player.value.pause();
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

const router = useRouter();

//跳转详情页
const toDetails = (id) => {
  router.push({
    path: `details/${id}`,
  })
}

// 立即下载
function handleDownload() {
  if (!props.data.purchase) {
    handleBuy()
  } else {
    downMaterial()
  }
}

const money = computed(() => {
  return store.state.user.money;
})

function handleBuy() {
  if (money.value < props.data.memberPrice) {
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
  } else if (money.value >= props.data.memberPrice) {
    createMaterialOrder({materialIds: [props.data.id]}).then((res) => {
      orderInfo.value = res.data
      orderInfo.value.name = props.data.name
      payShow.value = true
    });
  }
}

function downMaterial() {
  const query = {
    id: props.data.id
  }
  downloadMaterial(query).then(res => {
    const url = res.data.downloadUrl
    const filename = res.data.filename
    downloadFile(url, filename)
  })
}

const emit = defineEmits([
  'onUninterested',
  'onCart',
  'onPlay',
  'onGetList',
  'onCollection',
  'onPaySuccess',
]);

// 定义state初始值为false
const cardState = ref(false);

// 添加/删除购物车
function handleAddOrDelCart(materialId) {
  const params = {
    materialId,
  };
  if (cardState.value === false) {
    cardState.value = true;
    addShoppingCart(params).then((res) => {
      store.dispatch('material/getCartList', {pageNum: 0, pageSize: 1000});
      emit('onCart', props.dataIndex);
    });
    setTimeout(() => {
      cardState.value = false
    }, 1001)
  }
}

// 加入/删除收藏
function handleAddOrDelCollection(materialId) {
  const params = {
    materialId,
  };
  addCollection(params).then((res) => {
    emit('onCollection', props.dataIndex);
  }).catch(err => {
    console.log(err)
  });
}


function handlePayClose() {
  payShow.value = false
}

//购买成功提示弹窗
const paySuccedDialog = ref(null)

// 确认支付
function handlePayConfirm(order) {
  proxy.$pay.openPay({
    orderNo: order.transactionNo,
    confirm: (e) => {
      return new Promise((resolve, reject) => {
        // ElMessage.success('支付成功');
        paySuccedDialog.value.open()
        emit('onPaySuccess', props.data)
        emit('onGetList')
        resolve(res);
      })
    },
    error: (err) => {
      if (typeof err == 'object') {
        if (err.code == 1010) {
          proxy.$pay.openRecharge()
        }
      }
    }
  })
}

// 鼠标移动时计算雪碧图
const offsetY = ref(0);
const viewWidth = ref(0);
const viewHeight = ref(0);
const percentage = ref(0);
const handleMouseMoveVideo = (e) => {
  const spriteImageInfo = JSON.parse(props.data.fileAttachedInfoDto.spriteImageInfo || '{}');
  const imageWidth = spriteImageInfo.width || 240; //雪碧图每一帧的宽度
  const imageHeight = spriteImageInfo.height || 6750; //雪碧图每一帧的高度
  const offsetX = e.offsetX;
  const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
  const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
  const imageScale = imageWidth / imageHeight;
  const offsetScale = offsetWidth / offsetHeight;
  if (imageScale > offsetScale) {
    viewWidth.value = offsetWidth;
    viewHeight.value = viewWidth.value / imageScale;
  } else {
    viewHeight.value = offsetHeight;
    viewWidth.value = imageScale * viewHeight.value;
  }

  const N = 100; //数量
  const NS = offsetWidth / N;
  const steep = offsetWidth / 100;
  offsetY.value = viewHeight.value * Math.round(offsetX / NS);
  percentage.value = offsetX / steep; //得到当前进度
}

const column = ref(4)
const cardWidth = ref()
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
  cardWidth.value = String(100/column.value) + '%'
}
const { width } = useWindowSize();
onMounted(() => {
  watchEffect(() => {
    onresize(width.value)
  })
})
</script>

<style scoped lang="scss">
@import "./style.scss";

.flexC {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.ztag{
  flex: 0 0 auto;
  img{
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }
}
</style>
