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
@import "./style.scss";
</style>