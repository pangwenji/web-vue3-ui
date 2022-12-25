<template>
  <div class="Main-Box">
    <div>
  <div class="content-card">
    <el-row :gutter="20" style=" margin-left: 10px;margin-right: -25px;">
      <el-col :span="6"  v-for="(o, index) in 9" :key="o">
        <div  class="card"  @dblclick="toDetails(page,menu)">
          <div class="card-top">
            <div style="display: flex;">
              <div class="top-icon">
                <div class="icon">
                  <Star style="width: 20px; height:20px;" />
                </div>
              </div>
              <div class="top-icon">
                <div class="icon">
                  <ShoppingCart style="width: 20px; height: 20px;"/>
                </div>
              </div>
              <div class="top-icon">
                <div class="icon">
                  <Download style="width: 20px; height:20px;"/>
                </div>
              </div>
            </div>
            <div  class="top-botton">
              <div class="buy">立即购买</div>
            </div>
          </div>
          <img
              :src="image"
              class="image"
          />
          <div style="padding: 14px">
            <div class="date">
              <div style="display: flex;">
                <div class="title" @click="toDetails(page,menu)">
                  {{ cartList.title.length > 12 ?  cartList.title.slice(0,11) + '...' : cartList.title  }}
                </div>

                <div class="z">正</div>
                <div class="main50 flex-col">
                  <span class="txt31">商</span>
                </div>
              </div>
              <div class="price">
                <div style="display: flex;justify-content: space-between;">
                  <div style=" display: flex;width: 50%;align-items: center;">
                    <div class="section32 flex-col"></div>
                    {{ cartList.price }}
                    <div class="cost">原价：99</div>
                  </div>
                  <div class="sales">已售{{ cartList.sales }}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </el-col>
    </el-row>


  </div>
    </div>
  <div class="content-bottom">
    <content-bottom></content-bottom>
  </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import contentBottom from "../../components/content/contentBottom";
import image from '@/assets/images/login-background.jpg'

const components = {contentBottom}

const cartList = ref({
  title: '科技简介企业风板块分类',
  price: '0.1',
  sales: '300+',
})
const router = useRouter();
//跳转详情页
const page = 'picture'
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
</script>

<style scoped lang="scss">
@import "./style.scss";
.Main-Box{
  display: flex;flex-direction: column;justify-content: space-between;
}
</style>