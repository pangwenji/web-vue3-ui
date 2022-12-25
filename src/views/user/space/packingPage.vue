<template>
  <div class="space-container">
    <div class="top-title">
      <span class="back-space" @click="router.go(-1)">空间容量</span>
      <img style="margin: 0 4px;" :src="ArrowRight">容量包</div>
<!--    <el-breadcrumb :separator-icon="ArrowRight">-->
<!--      <el-breadcrumb-item :to="{ path: '/user/center/space' }">空间容量</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item :to="{ path: '/user/center/packing' }">容量包</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->

    <el-scrollbar>
    <div class="packing-main">
      <div class="packing-top">
        <div class="title">购买</div>
        <div class="packing-list">
               <div class="packing-card" v-for="(item,index) in packingList" @mouseover="hoverCard(item)"  @mouseout="hoverCard(item)"
                    :key="item.price" :class="{ active: checkItem.price === item.price }" @click="checkPacking(item)">
                 <div>
                   <img :src="Check" class="check-img" v-if="checkItem.price === item.price">
                   <img :src="item.hover? hoverCheck:noCheck" :class="[item.hover?'check-img':'check-img2']" v-else>
                 </div>
                 <div>
                   <img :src="item.img" class="packing-img" v-if="checkItem.price === item.price">
                   <img :src="item.img2" class="packing-img" v-else>
                 </div>
                 <div class="packing-right">
                   <div class="packing-num">{{item.num}}</div>
                   <div class="pack-btm"><span class="packing-price">
                     {{item.price}}</span> <span class="background_icon-money"></span><span>/年</span></div>
                 </div>
               </div>
        </div>
        <div class="line"></div>
        <div class="total">
          合计：<span class="price-num">{{checkItem.price}}</span><span class="background_icon-money"></span>
        </div>
        <el-button type="primary" color="#3468FE" @click="handleBuy">购买</el-button>
      </div>
      <div class="explain-box">
        <div class="title">说明</div>
        <div class="explain-list" v-for="item in explainList" :key="item.issue">
          <div class="explain-list-title">{{item.issue}}</div>
          <div class="explain-list-text" v-html="item.solution"></div>
        </div>
      </div>
    </div>
    </el-scrollbar>
  </div>

<!--  确认订单对话框-->
  <orderConfirmDialog :orderInfo="orderInfo" ref="orderDialog" @onPayConfirm="handlePayConfirm"></orderConfirmDialog>

  <succeed-dialog ref="SucceedDialog" :info="dialogInfo"></succeed-dialog>

</template>

<script setup>
import orderConfirmDialog from '@/plugins/orderConfirmDialog/index.vue'
import succeedDialog from './succeedDialog.vue'
import ArrowRight from '@/assets/home/arrow.png'
import noCheck from '@/assets/user/space/no-check.png'
import Check from '@/assets/user/space/check.png'
import hoverCheck from '@/assets/user/space/hoverCheck.png'
import space512G1 from '@/assets/user/space/512G-1.png'
import space512G2 from '@/assets/user/space/512G-2.png'
import space1TB1 from '@/assets/user/space/1TB-1.png'
import space1TB2 from '@/assets/user/space/1TB-2.png'
import space2TB1 from '@/assets/user/space/2TB-1.png'
import space2TB2 from '@/assets/user/space/2TB-2.png'
import space5TB1 from '@/assets/user/space/5TB-1.png'
import space5TB2 from '@/assets/user/space/5TB-2.png'
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {newResource} from "../../../api/user/space";
import {onMounted,ref} from "vue";

const router = useRouter();
const { proxy } = getCurrentInstance();
const checkItem = ref({})
onMounted(()=>{
  checkItem.value = packingList.value[0]

})

const checkPacking = (item) => {
  packingList.value.forEach(res =>{
    res.hover = false
  })
  checkItem.value = item
}
const hoverCard = (item) => {
  if (!item.hover){ item.hover = false}
  item.hover = item.hover === true ? false : true

}

const orderInfo = ref({})
const orderDialog = ref(null)
const handleBuy = () => {
  newResource({productId:checkItem.value.productId}).then((res)=>{
    orderInfo.value = res.data
    orderDialog.value.open()
  })
}

const SucceedDialog = ref(null)
const dialogInfo = ref({})
// 确认支付
function handlePayConfirm(order) {
  proxy.$pay.openPay({
    orderNo: order.transactionNo,
    confirm:(e)=>{
      return new Promise((resolve,reject)=>{
        // ElMessage.success('支付成功');
        dialogInfo.value = {
          tip:checkItem.value.num + '容量包',
          endTime:orderInfo.value.endTime,
          type:1,
        }
        SucceedDialog.value.open()
        resolve(res);
      })
    },
    error:(err)=>{
      if(typeof err == 'object'){
        if(err.code == 1010){
          proxy.$pay.openRecharge()
        }
      }
    }
  })
}

const packingList = ref([
  {
    productId:3,
    num:'512G',
    price:'49',
    img:space512G1,
    img2:space512G2,
  },
  {
    productId:4,
    num:'1TB',
    price:'98',
    img:space1TB1,
    img2:space1TB2,
  },
  {
    productId:5,
    num:'2TB',
    price:'196',
    img:space2TB1,
    img2:space2TB2,
  },
  {
    productId:6,
    num:'5TB',
    price:'490',
    img:space5TB1,
    img2:space5TB2,
  },
])

const explainList = [
  {
    issue:'容量包是什么？',
    solution:'答：容量包是影音同画提供的存储容量扩展服务，当您的存储容量不足时，可以通过购买容量包进行容量扩充，存储更多文件。'
  },
  {
    issue:'容量包购买是否受身份限制？',
    solution:'答：是！仅个人版会员可购买容量包，购买后立即生效。'
  },
  {
    issue:'容量包的有效期如何计算？',
    solution:'答：当您成功购买容量包后，扩展容量立即生效，容量包的有效期为一年，有效期按照自然年进行计算。<br>当购买一个容量包时，如：<br>您于2022年1月29日购买一年的容量包， 则可使用至2023年1月28日 23:59:59；<br>当购买多个容量包时，容量进行叠加，如：<br>您于2022年2月29日购买512G的容量包，2022年3月5日再购买512G的容量包，在2022年3月5日到2023年2月28日期间，您可使用的储存扩容总和为1TB。在2023年3月1日到2023年3月5日期间，您可使用的容量包为未到期的512G。'
  },
  {
    issue:'容量包到期后，容量该如何处理？',
    solution:'答：如您已购买的容量包到期未续费，空间容量将被收回。若实际容量≤默认容量，则空间不受影响，仍可正常使用；若实际容量>默认容量，超出部分的容量将被锁定，但不会被清除，仅可预览和删除。如需恢复，可删除空间容量至默认容量额，或重新购买空间。'
  },
]

</script>

<style scoped lang="scss">
@import './style.scss';
.packing-main{
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 22px;
  .packing-top{
    background: #1C1D24;
    box-shadow: 0px 0px 4px 0px rgba(52,48,227,0.05);
    border-radius: 10px;
    padding:22px 26px;
    .title{
      margin-bottom: 20px;
    }
    .packing-list{
      display: flex;
      flex-wrap: wrap;
      .packing-card{
        background: #111216;
        border-radius: 8px;
        width: 230px;
        min-width: 230px;
        height: 106px;
        padding: 15px 10px;
        display: flex;
        align-items: center;
        margin-right: 30px;
        border: 1px solid  #111216;
        cursor: pointer;
        margin-bottom: 24px;
        &:hover{
          border: 1px solid rgba(52, 104, 254, 0.5);
        }
        .icon_check_circle{
          width: 14px;
          height: 14px;
          color: #333333;
        }
        .check-img{
          width: 14px;
          height: 14px;
        }
        .check-img2{
          width: 14px;
          height: 14px;
          opacity: 0.4;
        }
        .packing-img{
          width: 66px;
          height: 76px;
          margin: 0px 20px;
        }
        .packing-right{
          font-size: 12px;
          .packing-price{
            font-size: 19px;
            color: #F88212;
            line-height: 23px;
          }
          .background_icon-money{
            width: 20px;
            height: 20px;
            margin-bottom: 2px;
          }
          .packing-num{
            font-size: 30px;
            color: #FFFFFF;
            line-height: 42px;
          }
          .pack-btm{
            margin-top: 5px;
            display: flex;
            align-items: flex-end;
          }
        }

      }
      .active {
        border: 1px solid rgba(52, 104, 254, 0.5);
        background: rgba(52,104,254,0.1);
      }
    }

    .line{
      height: 1px;
      background: #FFFFFF;
      opacity: 0.05;
      width: 100%;
      //margin-top: 24px;
      margin-bottom: 28px;
    }
    .total{
      display: flex;
      align-items: center;
      .price-num{
        font-size: 24px;
        color: #FF9F03;
        line-height: 33px;
      }
    }
    .el-button{
      margin-top: 22px;
      width: 80px;
      height: 42px;
    }
  }
  .explain-box{
    margin-top: 20px;
    background: #1C1D24;
    box-shadow: 0px 0px 4px 0px rgba(52,48,227,0.05);
    border-radius: 10px;
    padding:22px 26px 42px 26px;
    .explain-list{
      margin-top: 22px;

      .explain-list-title{

      }
      .explain-list-text{
        font-size: 14px;
        font-weight: 400;
        color: #8D91A3;
        line-height: 20px;
        margin: 10px 0px;
      }
    }
  }

}


</style>
