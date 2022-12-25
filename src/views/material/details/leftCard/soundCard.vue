<template>
  <div class="card">
    <div class="card-main">
      <div class="main-top">
       <img :src="CD">
      </div>
      <div class="main-bottom">
        <div>
          <img :src="bluePlay">
        </div>
        <div>
          <img :src="frequency">
        </div>
        <div class="time-text">
          <span >00:02</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CD from '@/assets/material/CD.png'
import bluePlay from '@/assets/material/bluePlay.png'
import frequency from '@/assets/material/frequency.png'





</script>

<style scoped lang="scss">
.card{
    width: 100%;
  //min-width: 680px;
    height: 560px;
    background: #1C1D24;
    border-radius: 10px;
    backdrop-filter: blur(0px);
  .card-main{
    padding-top: 45px;
    padding-bottom: 63px;
    .main-top{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .main-bottom{
      margin-top: 74px;
      display: flex;
      justify-content: center;
      align-items: center;
      .time-text{
        margin-left: 13px;
        font-size: 22px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 22px;
      }

    }
  }
}

</style>
