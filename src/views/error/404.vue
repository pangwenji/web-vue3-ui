<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404-bg-img">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
        </div>
        <div class="bullshit">
          <div class="bullshit__headline">
            很抱歉，页面不小心迷路了
          </div>
          <router-link to="/index" class="bullshit__return-home">
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
let message = computed(() => {
  return '找不到网页！'
})
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  height: 100vh;
  background: #081322;
}
.wscn-http404-bg-img{
  width: 100%;
  height: 100%;
  background-image: url("@/assets/404_images/404-bg.png");
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  .pic-404 {
    position: relative;
    float: left;
    width: 652px;
    height: 515px;
    overflow: hidden;

    &__parent {
      width: 100%;
    }
  }

  .bullshit {
    position: relative;
    float: left;
    width: 100%;
    padding: 60px 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__headline {
      font-size: 28px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 40px;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
      margin-bottom: 60px;
    }

    &__return-home {
      float: left;
      width: 150px;
      height: 40px;
      background: #3468FE;
      border-radius: 25px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 16px;
      font-weight: 400;
      line-height: 14px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
