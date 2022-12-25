<template>

    <div class="header-content-mid">
      <content-top></content-top>
    </div>
    <div class="header-content-midTwo">
      <content-mid></content-mid>
    </div>
    <div class="content">
      <content-main></content-main>
    </div>

</template>

<script>
import MaterialLeft from "../../components/MaterialLeft";
import { defineComponent, ref ,computed}  from "vue"
import {useStore} from "vuex";
import ContentTop from "../../components/content/contentTop";
import ContentMid from "../../components/content/contentMid";
import ContentMain from "./contentMain";


const components = {
  MaterialLeft,
  ContentTop,
  ContentMid,
  ContentMain
}

const setup = ()=>{


  return {

  }
}

export default defineComponent({
  setup,
  components,
})

</script>

<style scoped lang="scss">


.header-content-mid {
  position: relative;
  width: 100%;
  height: 120px;
  background: #272830;
  border-radius: 8px;
  opacity: 0.7;
  padding: 13px 16px 24px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;



}

.header-content-midTwo {
  width: 100%;
  height: 60px;
  background: #0A0B0D;
  font-size: 12px;
  font-weight: 400;
  color: #CFD2D8;
  line-height: 18px;
  padding: 13px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

}

.content{
  width: calc(100vw - 330px);
  //height: 964px;
  background: #0A0B0D;
  border-radius: 30px 0px 0px 30px;
  position: relative;
  //display: flex;
}


</style>
