<template>
  <div class="content-card">
    <div class="purchased-box" v-if="data.purchase">已购</div>
    <el-row >
      <el-col :span="7">
        <div class="flex">
          <div class="img" style=" min-height:56px" :style="{ 'background-image': `url(${data.coverUrl})` }" @click.stop="toPlay()" >
            <div v-loading="isPlayState"  element-loading-background="rgba(0,0,0,0)"  style="    width: 100%;    height: 100%;">
            <img :src="!isPlay ? play2 : stopPlayicon"  style="width: 36px; height: 36px;position: absolute; margin: 17%;"/>
          </div>
          </div>

          <div class="date">
            <div class="flex">
              <div class="title" @click.stop="toDetails">
<!--                {{ data.name }}-->
                <span v-html="data.name"></span>
              </div>
              <div class="ztag">
                <img src="@/assets/material/title-tag1.png">
                <img src="@/assets/material/title-tag2.png">
              </div>
            </div>
            <div class="flex" style="flex-wrap: wrap">
              <div class="tag" v-for="(tag, indx) in Array.from(new Set(data.keywordsArray.slice(0,3)))" :key="indx">
<!--                {{ tag }}-->
                <span v-html="tag"></span>
              </div>
              <div class="icon-box" @click.stop="false" @mouseover="getOther(data.keywordsArray)"
                   v-if="data.keywordsArray.length > 3" v-contextmenu:Contextmenu="{ trigger: 'mouseover' }">
                <MoreFilled style="padding: 0px 3px;height: 24px"/>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="wave-box" @click.stop="toPlay()">
          <WaveForm
              ref="waveRef"
              :audioWave="data.fileAttachedInfoDto.audioWave || defAudioWave"
              :canvasHeight="60"
              :shapeHeight="60"
              :waveStep="5"
              :progressColor="'#79a5fc'"
              :duration="data.fileData?.Duration || 0"
              :playPercent="playPercent"
              :waveWidth="1"
              @onPlayPercent="handlePlayPercent"
          ></WaveForm>
          <div class="curTime">{{ secondToDate(currentTime) }} / {{ secondToDate(data.fileData?.Duration || 0) }}</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div style="display: flex; margin: auto;justify-content: space-between;width: 190px;">
          <div style="height: 35px;background: #30323B;width: 1px;margin-right: 30px"></div>
          <div style="display: flex">
            <div class="price">
              <template v-if="store.state.user.member.state !== 1">
                <div style="display: flex; align-items: flex-end">
                  {{ (data.price === 0 || data.price === null) ? '免费' : data.price || '免费' }}
                  <div class="tongqian section32"></div>
                </div>
                <div class="cost">原价</div>
              </template>
              <template v-else>
                <div style="display: flex; align-items: flex-end">
                  <span style="text-decoration: line-through;color: #45464D;">
                    {{ (data.price === 0 || data.price === null) ? '免费' : data.price || '免费' }}</span>
                  <div class="tongqian section33"></div>
                </div>
                <div class="cost" v-color="'#45464D'">原价</div>
              </template>
            </div>
            <div class="price" style="min-width: auto;">
              <div style="display: flex; align-items: flex-end">
                <span style="flex:0 0 auto;">
                  {{ (data.memberPrice === 0 || data.memberPrice === null) ? '免费' : data.memberPrice || '免费' }}</span>
                <div class="section32 tongqian"></div>
              </div>
              <div class="cost">会员价</div>
            </div>
          </div>
          <div style="height: 30px;background: #30323B;width: 1px;margin-left: 30px"></div>
        </div>
      </el-col>
      <el-col :span="6" style="display: flex; justify-content: flex-end">
        <div class="flex">
          <div class="flex">
            <div class="icon">
              <el-tooltip class="box-item" effect="light" content="不感兴趣" placement="top" :show-after="500">
                <img :src="noInterest" @click.stop="handleAddUninterested(data.id)"
                />
              </el-tooltip>
            </div>
            <!--            <div class="icon" v-if="data.typeId ===1 || data.typeId === 2 ">-->
            <!--              <el-tooltip-->
            <!--                  class="box-item"-->
            <!--                  effect="light"-->
            <!--                  content="点击下载试用"-->
            <!--                  placement="top"-->
            <!--                  :show-after="500"-->
            <!--              >-->
            <!--                <img-->
            <!--                    :src="download"-->
            <!--                    @click.stop="handleDownTry(data.id)"-->
            <!--                />-->
            <!--              </el-tooltip>-->
            <!--            </div>-->

            <div class="icon">
              <el-tooltip class="box-item" effect="light" :content="data.collection ?'移出收藏':'加入收藏'" placement="top"
                          :show-after="500">
                <img :src="data.collection ? noShoucang : shoucang" @click.stop="handleAddOrDelCollection(data.id)"/>
              </el-tooltip>
            </div>
            <div v-if="!data.purchase" class="icon" style="margin-right: 30px">
              <el-tooltip class="box-item" effect="light" :content="data.shoppingCart ?'移出购物车':'加入购物车'" placement="top"
                          :show-after="500">
                <img :src="data.shoppingCart ? aShoppingCart : ShoppingCart" @click.stop="handleAddOrDelCart(data.id)"/>
              </el-tooltip>
            </div>
            <div v-else class="icon" @click.stop="" style="opacity:.2;cursor:not-allowed;margin-right: 30px">
              <el-tooltip class="box-item" effect="light" content="已购买" placement="top" :show-after="500">
                <img :src="ShoppingCart"/>
              </el-tooltip>
            </div>
          </div>
          <!--          <div v-if="!data.purchase" class="buy" @click.stop="handleBuy">立即购买</div>-->
          <div class="buy" @click.stop="handleDownload(data)">立即购买</div>
        </div>
      </el-col>
    </el-row>
  </div>

  <div
      v-if="[1, 2].includes(data.typeId)"
      class="play-box"
      style="display: none"
  >
    <video
        :id="'player-container-id' + data.fileAttachedInfoDto.fileId"
        preload="auto"
        playsinline
        webkit-playsinline
    ></video>
  </div>

  <v-contextmenu ref="Contextmenu">
    <div style="max-height: 200px;overflow: hidden">
      <el-scrollbar max-height="200px">
        <v-contextmenu-item v-for="lab in otherLabel" :key="lab">
          <template #label>
            <span v-html="lab"></span>
          </template>
        </v-contextmenu-item>
      </el-scrollbar>
    </div>
  </v-contextmenu>

</template>
<script setup>
import play2 from '@/assets/icons/play/play2.png';
import stopPlayicon from '@/assets/icons/play/stopPlay.png';
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import download from '@/assets/images/icon_download.png';
import noInterest from '@/assets/material/icon_interest.png';
import ShoppingCart from '@/assets/images/icon_Shopping Cart.png';
import aShoppingCart from '@/assets/images/aShoppingCart.png';
import WaveForm from '@/components/WaveForm';
import {addCollection} from '@/api/material/collection.js';
import {addShoppingCart} from '@/api/material/shoppingCart.js';
import {onMounted, watch} from '@vue/runtime-core';
import {saveUninterested} from '@/api/material/index.js';
import {secondToDate, formatSize} from '@/utils/tool.js';
import {ElMessage, ElMessageBox} from 'element-plus';
import {createMaterialOrder} from '@/api/material/order.js';
import {payOrder} from '@/api/pay/pay.js';
import PayConfirmDialog from '../../components/PayConfirmDialog'
import {downloadMaterial} from '@/api/material/index.js'
import {downloadFileCurrent} from "@/utils/tool.js"
import FileType from '@/components/FileType';
import {computed, ref} from "vue";
import {addRecord} from "../../../../api/material";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  viewName: {
    type: String,
    default: "龙湫之势高绝天，一线瀑走兜罗绵。",
  },
  dataIndex: {
    type: Number,
    default: null,
  },
  playId: {
    type: Number,
    default: 0,
  },
  isOnresize: {
    type: Boolean,
    default: false
  }
});
const defAudioWave = [5.3909305E-4, 0.0095304875, 0.011478119, 0.00885315, 0.0072883605, 0.0046609496, 0.011671143, 0.012428894, 0.006089325, 0.0102857975, 0.010904083, 0.01595932, 0.010877076, 0.011271972, 0.011608124, 0.013409729, 0.006224823, 0.011107636, 0.01050354, 0.014219818, 0.009575958, 0.010752411, 0.014382019, 0.010367432, 0.010930786, 0.010393219, 0.010096588, 0.009201813, 0.009222107, 0.00986969, 0.009734649, 0.008525086, 0.013040009, 0.008263397, 0.010276184, 0.0039698794, 0.009432831, 0.010162048, 0.012423706, 0.007794342, 0.008976898, 0.0147373965, 0.013617859, 0.009986419, 0.012643738, 0.013483581, 0.010311737, 0.008781586, 0.010643768, 0.013975525, 0.014263306, 0.01031601, 0.0146647645, 0.012344055, 0.009335022, 0.011239166, 0.008814544, 0.010168305, 0.006976166, 0.007901306, 0.0036035157, 0.0019854736, 0.020506287, 0.018255005, 0.013433227, 0.0129138185, 0.011155243, 0.0127110295, 0.013979492, 0.013288727, 0.018145751, 0.016246032, 0.010440521, 0.0120664975, 0.017627869, 0.009780274, 0.011105652, 0.008238678, 0.017326813, 0.01592865, 0.015266877, 0.014064942, 0.008439636, 0.010719605, 0.012806549, 0.014266662, 0.013862, 0.011330719, 0.012002106, 0.011217956, 0.010484619, 0.010794983, 0.014706268, 0.021522064, 0.012721557, 0.013533936, 0.011659393, 0.011167297, 0.013734741, 0.016631622, 0.014163513, 0.019094544, 0.010949707, 0.00838089, 0.016604157, 0.012120971, 0.009537506, 0.010098114, 0.0107040405, 0.015903778, 0.013582763, 0.014129486, 0.009401703, 0.011917267, 0.009949799, 0.011825103, 0.015255737, 0.011869354, 0.012046967, 0.010115356, 0.008409271, 0.0141716, 0.017641602, 0.01437622, 0.010188294, 0.0091134645, 0.008698731, 0.011865387, 0.010612793, 0.011529541, 0.00981659, 0.00844101, 0.01229721, 0.017207794, 0.012259063, 0.008787079, 0.014833374, 0.015325928, 0.013937683, 0.016165923, 0.0101072695, 0.010856628, 0.018628234, 0.017223358, 0.01148468, 0.012125092, 0.01287201, 0.012044525, 0.01696167, 0.015493775, 0.0094541935, 0.012289276, 0.018503113, 0.012111969, 0.012141876, 0.008098297, 0.00956955, 0.01810562, 0.01356247, 0.012397613, 0.009001007, 0.013123321, 0.014640045, 0.009171142, 0.018280793, 0.011775512, 0.015838165, 0.011751861, 0.010805206, 0.0142858885, 0.01181961, 0.008812409, 0.019395905, 0.020522613, 0.016096344, 0.013075257, 0.014036408, 0.010208435, 0.013647003, 0.017751617, 0.01260788, 0.011642609, 0.011867981, 0.009604034, 0.016586151, 0.010358734, 0.008462982, 0.007164459, 0.0049809264, 0.012435455, 0.010941162, 0.00737381, 0.01009079, 0.009741669, 0.012459564, 0.009646301, 0.011293945, 0.012605285, 0.013313293, 0.005930176, 0.010175019, 0.009621582, 0.01411438, 0.011586761, 0.01110672, 0.013764649, 0.011737976, 0.010166778, 0.009857483, 0.010333405, 0.010497131, 0.009049836, 0.009971619, 0.01102417, 0.00825653, 0.014230957, 0.008717499, 0.009770355, 0.00373703, 0.008734436, 0.011657715, 0.013356018, 0.0065515134, 0.00828949, 0.012982025, 0.014679108, 0.0107427975, 0.01203064, 0.01437149, 0.010291138, 0.008621063, 0.0104377745, 0.013079529, 0.014462127, 0.008720856, 0.013466187, 0.012476044, 0.008605194, 0.010596466, 0.00983841, 0.011463928, 0.010232696, 0.008948974, 0.003957672, 0.0013011169, 0.018491821, 0.020202637, 0.011871338, 0.013083191, 0.009604034, 0.014232177, 0.016531982, 0.014130249, 0.018331604, 0.015366059, 0.011194458, 0.011528015, 0.017056579, 0.010371704, 0.011128846, 0.007910308, 0.016188659, 0.013495483, 0.014925842, 0.015628967, 0.008657989, 0.010624847, 0.014680633, 0.013384399, 0.015033416, 0.011224518, 0.011971588, 0.009978943, 0.010606537, 0.010427857, 0.014313202, 0.022796936, 0.013795166, 0.014359589, 0.011427612, 0.010245361, 0.013130035, 0.018316498, 0.015678253, 0.017753754, 0.012966766, 0.009552155, 0.017018432, 0.011351929, 0.008409271, 0.010479432, 0.011430664, 0.017577361, 0.014048309, 0.0126420595, 0.00963562, 0.013522339, 0.010619964, 0.011551513, 0.01277298, 0.0118963625, 0.012460632, 0.010939636, 0.008144837, 0.014022217, 0.017776642, 0.01219986, 0.010392761, 0.009659882, 0.008882446, 0.012422028, 0.012173462, 0.013449097, 0.0111422725, 0.009254914, 0.012623596, 0.014147644, 0.011084442, 0.008860016, 0.013617248, 0.014476166, 0.012600251, 0.014794159, 0.010005798, 0.009451904, 0.017815094, 0.018435365, 0.013064117, 0.011673736, 0.011238708, 0.01247467, 0.016840516, 0.016553039, 0.010389557, 0.012158203, 0.017189484, 0.015420227, 0.012855377, 0.008700866, 0.009202575, 0.017072754, 0.012848663, 0.011548157, 0.009033813, 0.0128617855, 0.016045228, 0.009786835, 0.017109375, 0.012454071, 0.015549316, 0.011896973, 0.011199341, 0.013411407, 0.012430267, 0.007595825, 0.017480468, 0.020576324, 0.015516815, 0.0122625735, 0.013417511, 0.009546051, 0.014923554, 0.018024445, 0.013957367, 0.0098930355, 0.010609741, 0.010536041, 0.011950531, 0.009250641, 0.008596344, 0.0073709106, 0.011372375, 0.009627686, 0.010725555, 0.010474853, 0.009345246, 0.0112112425, 0.011827545, 0.009926452, 0.008905487, 0.010764466, 0.012447663, 0.01037384, 0.009225616, 0.008249359, 0.009400177, 0.012027893, 0.011760712, 0.010321045, 0.009441376, 0.008785401, 0.009779968, 0.010252075, 0.010074921, 0.00920044, 0.011156921, 0.011562195, 0.009677124, 0.010373536, 0.0073594665, 0.0074320985, 0.0098216245, 0.009053345, 0.009383087, 0.008351288, 0.009333343, 0.010255737, 0.0097640995, 0.013928528, 0.012864685, 0.013407287, 0.009183045, 0.007542572, 0.0089343265, 0.007325592, 0.0074208067, 0.01071228, 0.011644745, 0.009960175, 0.010723877, 0.010703888, 0.010526581, 0.0117008975, 0.012343902, 0.013303986, 0.011976624, 0.0107954405, 0.010150604, 0.010422058, 0.012832336, 0.0084973145, 0.008757477, 0.004744263, 0.012141876, 0.012600555, 0.008507233, 0.010191803, 0.010751495, 0.013218079, 0.011753235, 0.012470245, 0.012693176, 0.016651612, 0.008443756, 0.010540924, 0.009900513, 0.014931641, 0.01044754, 0.010793762, 0.0133241275, 0.0120404055, 0.009753418, 0.0104522705, 0.009295807, 0.00938385, 0.009050751, 0.010765228, 0.011162262, 0.008626099, 0.011618805, 0.009695892, 0.010646973, 0.0044392394, 0.008708191, 0.012440033, 0.012904968, 0.0061366274, 0.009377594, 0.013943177, 0.0140116885, 0.011313477, 0.013699646, 0.01447876, 0.014943543, 0.010792847, 0.011460266, 0.013459167, 0.01623062, 0.010694122, 0.0140867615, 0.013349304, 0.009790497, 0.0046247863, 0.0019432068, 0.001331482, 0.015093536, 0.01198227, 0.0034251404, 0.0015011596, 0.0014794922, 0.0014099121, 9.719849E-4, 8.859253E-4, 5.8013917E-4, 4.8828125E-4, 1.4526368E-4, 1.1291504E-4, 1.3320922E-4, 1.7333984E-4, 5.722046E-5]
const router = useRouter();
const {proxy} = getCurrentInstance();
const store = useStore();
const Contextmenu = ref('');
const player = ref(null);
const playerDuration = ref(0); // 长度
const isPlay = ref(false);
const isPlayState = ref(false);
const playPercent = ref(-1); // 播放百分比
const orderInfo = ref({});
const payShow = ref(false);
const showBotton = ref(false);
const money = computed(() => {
  return store.state.user.money;
})
const list = ref([]);

const emit = defineEmits([
  'onUninterested',
  'onCollection',
  'onCart',
  'onPlay',
  'onDownload',
]);

onMounted(() => {
});

onUnmounted(() => {
  // emit('onPlay', false);
  if (player.value !== null) {
    player.value.dispose();
    player.value = null;
  }
});

watch(() => props.playId, (newId) => {
  if (player.value !== null && newId !== props.data.id && isPlay) {
    player.value.pause();
  }
});

watch(() => props.isOnresize, () => {
  if (props.data.typeId === 1) {
    onresizeDrawWave();
  }
});

//获取隐藏标签
const otherLabel = ref([])
const getOther = (list) => {
  otherLabel.value = list.slice(3, list.length)
}

// 播放音乐
const toPlay = () => {
  if (props.data.typeId > 2) {
    toDetails();
    return;
  }
  isPlayState.value = true
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
    };
    player.value = TCPlayer('player-container-id' + props.data.fileAttachedInfoDto.fileId, playOptions);
  }
  player.value.one('canplay', () => {
    console.log('canplay');
    playerDuration.value = player.value?.duration();
    player.value.currentTime((playerDuration.value * percent) / 100);
    playPause();
  });
  player.value.on('play', function () {
    isPlay.value = true;
    isPlayState.value = false
    console.log('play');
    addPlayRecord()
    emit('onPlay', props.data.id);
  });
  player.value.on('pause', function () {
    isPlay.value = false;
    isPlayState.value = false
    console.log('pause');
  });
  player.value.on('timeupdate', () => {
    onTimeChange();
  });
  player.value.on('error', function (e) {
    console.log('---error---', e);
  });
}

// 播放暂停
function playPause() {
  if (!isPlay.value) {
    player.value.play();
  } else {
    player.value.pause();
  }
}

//添加播放记录
const mpId = ref()

function addPlayRecord() {
  if (mpId.value !== props.data.id) {
    addRecord({materialId: props.data.id}).then(res => {
    })
    mpId.value = props.data.id
  }
}

function handlePlayPercent(per) {
  playPercent.value = per;
  if (player.value === null) {
    playerInit(per);
  } else {
    player.value.currentTime((playerDuration.value * per) / 100);
    player.value.play();
  }
}

const currentTime = ref("00.00")

function onTimeChange() {
  currentTime.value = player.value?.currentTime();
  let percent = currentTime.value / playerDuration.value;
  playPercent.value = percent * 100;
}

// 立即下载
function handleDownload(item) {
  emit('onDownload', item);
}

// 重新画图
const waveRef = ref('')

function onresizeDrawWave() {
  setTimeout(() => {
    waveRef.value.drawWave()
  }, 200);
}


//避免重复提交：当timeState=false时才能提交，
// 定义state初始值为false
const timeState = ref(false);

// 加入/删除收藏
function handleAddOrDelCollection(materialId) {
  const params = {
    materialId,
  };
  if (timeState.value === false) {
    timeState.value = true;
    addCollection(params).then((res) => {
      emit('onCollection', props.dataIndex);
    });
    setTimeout(() => {
      timeState.value = false
    }, 1000)
  }
}

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
    }, 1000)
  }
}

//跳转详情页
const toDetails = () => {
  router.push({
    path: `details/${props.data.id}`,
  });
};

// 不感兴趣
function handleAddUninterested(materialId) {
  emit('onUninterested', materialId);
}


</script>
<style scoped lang="scss">
@import './style.scss';

.purchased-box {
  width: 40px;
  height: 20px;
  background: rgba(255, 159, 3, 0.1);
  //border-radius: 0px 0px 8px 0px;
  border-top-left-radius: 8px;
  color: #FF9F03;
  position: absolute;
  font-size: 12px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
</style>
