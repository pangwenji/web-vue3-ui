<template>
  <div class="Main-Box">
    <div>
      <div class="content-card" v-for="(item, index) in cartList" :key="index">
        <el-row>
          <el-col :span="11">
            <div style="display: flex;">
              <div class="img">
                <img :src="play2" @click="toPlay(index)" style="width: 40px;height: 40px;position: absolute;margin: 22%"
                     v-if="item.isPlay">
                <img :src="stopPlayicon" @click="stopPlay(index)"
                     style="width: 40px;height: 40px;position: absolute;margin: 22%"
                     v-else>
              </div>
              <div class="date">
                <div style="display: flex;">
                  <div class="title" @click="toDetails(page,menu)">{{ item.title.length > 11 ? item.title.slice(0, 11) + '...' : item.title }}</div>

                  <div class="z">正</div>
                  <div class="main50 flex-col">
                    <span class="txt31">商</span>
                  </div>
                </div>
                <div style="display: flex;">
                  <div class="tag" v-for="(tag,indx) in item.tag" :key="tag">{{ tag }}</div>
                  <div class="main48 flex-col" @click.stop="false" v-contextmenu:Contextmenu="{trigger:'click'}">
                  </div>
                </div>
                <div style="display: flex;height: 30px;">
                  <div class="schedule" ref="musicData">
                    <schedule :ref="(el) => setPlay(el)" @playIcon="playIcon" :indexx="index"></schedule>
                  </div>
                </div>
              </div>
            </div>

          </el-col>
          <el-col :span="6" style="display: flex;margin: auto;">
            <div class="price">
              <div style=" display: flex;align-items: center;">
                <div class="section32 flex-col"></div>
                {{ item.price }}
              </div>
              <div class="cost">原价：99</div>
            </div>
            <div class="sales">已售{{ item.sales }}</div>
          </el-col>
          <el-col :span="4">
            <div style="display: flex;justify-content: flex-end;">
              <div class="icon">
                <img :src="collect" @click="toShoucnag">
              </div>
              <div class="icon">
                <img :src="sCart" @click="toShoppingCart">
              </div>
              <div class="icon">
                <img src="@/assets/images/icon_download.png">
              </div>
            </div>

          </el-col>
          <el-col :span="3">
            <div class="buy">立即购买</div>
          </el-col>
        </el-row>
        <CloseBold class="close"/>
      </div>
    </div>
    <div class="content-bottom">
      <content-bottom></content-bottom>
    </div>
  </div>

  <v-contextmenu ref="Contextmenu">
    <v-contextmenu-item  @click="toDetails(page,menu)">
      <template #label>
        查看页面
      </template>
    </v-contextmenu-item>
    <v-contextmenu-item>
      <template #label>
        lable1
      </template>
    </v-contextmenu-item>
    <v-contextmenu-item>
      <template #label>
        lable1
      </template>
    </v-contextmenu-item>
  </v-contextmenu>
</template>

<script setup>
import {defineComponent, onMounted, ref} from "vue";
import cdImg from '@/assets/images/cd.png'
import play2 from '@/assets/icons/play/play2.png'
import stopPlayicon from '@/assets/icons/play/stopPlay.png'
import contentBottom from "../../components/content/contentBottom";
import shoucang from '@/assets/images/icon_shoucang.png'
import aShoucang from '@/assets/images/aShoucang.png'
import ShoppingCart from '@/assets/images/icon_Shopping Cart.png'
import aShoppingCart from '@/assets/images/aShoppingCart.png'
import schedule from "../../components/schedule";


const components = {contentBottom}
const collect = ref(shoucang)
const sCart = ref(ShoppingCart)
const router = useRouter();
//跳转详情页
const page = 'sound'
const menu = 'index'
const toDetails = (page,menu) => {
  router.push({
    path:'details',
    query:{
      page:page,
      menu:menu
    }
  })
}

function toShoucnag() {
  collect.value = shoucang == collect.value ? aShoucang : shoucang
}

function toShoppingCart() {
  sCart.value = ShoppingCart == sCart.value ? aShoppingCart : ShoppingCart
}

const cartList = ref([
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
  {
    isPlay: true,
    title: '明快正能量积极向上的企明快正能量积极向上的企…',
    tag: ['氛围音乐', '紧张的', '神秘'],
    price: '0.1',
    sales: '300+',
  },
])

const list = ref([])
// 播放音乐
const toPlay = (index) => {
  list.value[index].play()
}
// 暂停音乐
const stopPlay = (index) => {
  list.value[index].pause()
}
const playIcon = (status, index) => {
  console.log("status", status)
  console.log("index", index)
  cartList.value[index].isPlay = status;
}
const setPlay = (el) => {
  if (el) {
    list.value.push(el)
  }
}

onMounted(() => {

});

</script>

<style scoped lang="scss">
@import "./style.scss";
.Main-Box{
  display: flex;flex-direction: column;justify-content: space-between;
}
</style>