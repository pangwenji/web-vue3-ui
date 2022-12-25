<template>
  <div v-if="cartList.length > 0" style="height: 100%;">
    <el-container style="height: 100%;">
      <el-main style=" padding: 0;overflow-y: hidden;">
        <div class="card-box">
          <div class="cart-table-header">
            <div class="cart-table-th" style="width: 8%">
            </div>
            <div class="cart-table-th" style="width: 35%">素材名称</div>
            <div class="cart-table-th" style="width: 13%">授权类型</div>
            <div class="cart-table-th" style="width: 15.5%">{{ memberState === 1 ? '会员价' : '价格' }}</div>
            <div class="cart-table-th" style="width: 6%">操作</div>
          </div>
          <el-scrollbar style="padding-bottom: 55px;" v-loading="!loading"
                        element-loading-background="rgba(0, 0, 0, 0)">
            <div class="cart-table-box" v-if="loading">
              <div style="padding: 12px">
                <div class="cart-item" v-for="(item, index) in cartList" :key="index">
                  <el-row>
                    <el-col :span="13">
                      <el-row>
                        <el-col :span="2">
                          <el-checkbox-group v-model="checkedItems" @change="handleCheckedItemsChange">
                            <el-checkbox size="large" :label="item.id">{{ '' }}</el-checkbox>
                          </el-checkbox-group>
                        </el-col>
                        <el-col :span="3">
                          <div class="img" :style="{ 'background-image': `url(${item.material?.coverUrl})` }"
                               v-if="item.material?.typeId < 7"></div>
                          <div class="img" :style="{'background-image': `url(${imgeFont})`}" v-else></div>
                        </el-col>
                        <el-col :span="18">
                          <div style="display: flex;margin-right: 20px;">
                            <div class="title">
                              <span>{{ item.material?.name }}</span>
                              <div style="display: inline-block">
                                <div class="ztag">
                                  <img src="@/assets/material/title-tag1.png">
                                  <img src="@/assets/material/title-tag2.png">
                                </div>
                              </div>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="11">
                      <el-row>
                        <el-col :span="10">
                          <div class="title">全球授权，随片永久</div>
                        </el-col>
                        <el-col :span="11">
                          <div class="price">
                            {{ memberState === 1 ? (item.material?.memberPrice || 0) : (item.material?.price || 0) }}
                            <img class="tongqian" src="@/assets/user/wallet/tongqian.png"/></div>
                        </el-col>
                        <el-col :span="3">
                          <div @click="delCart(item.id)">
                            <span v-color="'#3468FE'" style="cursor: pointer">删除</span>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
      <el-footer style="padding: 0;--el-footer-height: 80px;">
        <div class="shoppingCart-bottom">
          <div class="bottom-left">
            <el-checkbox size="large" v-model="checkAll" :indeterminate="isIndeterminate"
                         @change="handleCheckAllChange">
              <span v-color="'#FFFFFF'">全选（ {{ cartList.length }}件）</span>
            </el-checkbox>
            <div style="margin-left: 20px;cursor: pointer;color: #FFFFFF;font-size: 14px;" @click="delAll">删除</div>
          </div>
          <div class="bottom-right">
        <span>已选素材<span class="right-text">{{ checkedItems.length }}</span>件，共
          <span class="right-text">{{ totalPrice.toFixed(2) }}<img class="tongqian"
                                                                   src="@/assets/user/wallet/tongqian.png"/></span></span>
            <div class="toPay" @click="handleBuy">支付</div>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
  <div v-else class="empty" v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="empty-box" v-if="loading">
      <img src="@/assets/material/shoppingcart-empty.png">
      <div class="empty-text">购物车还没有素材商品</div>
      <div class="empty-btn" @click.stop="handleToIndex">先去逛逛吧</div>
    </div>
  </div>

  <!-- 支付确认 -->
  <PayConfirmDialog v-if="payShow" v-model:show="payShow" :orderInfo="orderInfo" @onClose="handlePayClose"
                    @onPayConfirm="handlePayConfirm"></PayConfirmDialog>

  <!--  购买成功提示弹窗-->
  <pay-succed-dialog ref="paySuccedDialog"></pay-succed-dialog>
</template>

<script setup>
import deleteCart from '@/assets/images/deleteCart.png';
import imgeFont from '@/assets/material/imge_font.png';
import {onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import {ElMessage, ElMessageBox} from 'element-plus';
import {
  getShoppingCartList,
  delShoppingCart,
} from '@/api/material/shoppingCart.js';
import {createMaterialOrder} from '@/api/material/order.js';
import {payOrder} from '@/api/pay/pay.js';
import PayConfirmDialog from '../components/PayConfirmDialog'
import PaySuccedDialog from '../components/paySuccedDialog/index.vue'
const router = useRouter();
const {proxy} = getCurrentInstance();
const store = useStore();
const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedItems = ref([]);
const cartList = ref([]);
const orderInfo = ref({});
const payShow = ref(false);
const memberState = computed(() => {
  return store.state.user.member.state
})

onMounted(() => {
  getCartList();
});


// 先去逛逛吧
const handleToIndex = ()=>{
  router.push({path:'/material/main/index'})
}

// 已收藏素材ids
const collectIds = computed(() => {
  return store.state.material.collectIds;
});

const totalPrice = computed(() => {
  let total = 0;
  cartList.value.forEach((el) => {
    if (checkedItems.value.includes(el.id)) {
      if (memberState.value === 1) {
        total += el.material?.memberPrice || 0;
      } else {
        total += el.material?.price || 0;
      }
    }
  });
  return total;
});
const loading = ref(true);

// 购物车列表
function getCartList() {
  loading.value = false
  getShoppingCartList().then((res) => {
    cartList.value = res.data;
    store.commit('material/SET_SHOPPING_CART_LIST', res.data);
    loading.value = true
  });
}

// 删除购物车商品
function delCart(id) {
  delShoppingCart({ids: id}).then((res) => {
    cartList.value = cartList.value.filter((el) => el.id !== id);
    store.commit('material/SET_SHOPPING_CART_LIST', cartList.value);
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getCartList()
    checkedItems.value = []
  });
}

const handleCheckAllChange = (val) => {
  checkedItems.value = val ? cartList.value.map((el) => el.id) : [];
  isIndeterminate.value = false;
};

const handleCheckedItemsChange = (value) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cartList.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cartList.value.length;
};

const delAll = () => {
  if (checkedItems.value.length === 0) {
    ElMessage({
      type: 'info',
      message: '请选择素材',
    });
    return;
  }
  delCart(checkedItems.value)
}

// 创建素材订单
function handleBuy() {
  if (checkedItems.value.length === 0) {
    ElMessage({
      type: 'info',
      message: '请选择素材',
    });
    return;
  }
  const ids = [];
  let materials = []
  cartList.value.forEach((el) => {
    if (checkedItems.value.includes(el.id)) {
      ids.push(el.material.id);
      materials.push(el.material)
    }
  });
  createMaterialOrder({materialIds: ids}).then((res) => {
    cartList.value = cartList.value.filter(
        (el) => !checkedItems.value.includes(el.id)
    );
    store.commit('material/SET_SHOPPING_CART_LIST', cartList.value);
    checkedItems.value = [];
    isIndeterminate.value = false;
    orderInfo.value = res.data
    orderInfo.value.materials = materials
    payShow.value = true
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
        resolve(res);
        router.push('/material/orders')
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

//跳转到已购素材页面
const handleToPurchased = () =>{
  router.push({path: '/material/main/purchased'})
}

</script>

<style scoped lang="scss">
@import './style.scss';

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: black;
  border-color: black;

}

</style>
