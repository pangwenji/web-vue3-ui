<template>
  <div class="not-support-box">
    <div class="support-img"></div>
    <div style="margin-top:14px;">{{fileSuffix.substring(1).toUpperCase()}} 文件暂不支持预览</div>
    <div style="margin-top:10px;">
      <span @click="toHelp" style="text-decoration: underline;color: #3468fe;cursor: pointer;">目前支持的格式</span>
    </div>
  </div>
</template>
<script setup>
const store = useStore();

const props = defineProps({
	fileSuffix: {
		type: String,
		default: ''
	}
})

const router = useRouter();

function toHelp() {
  router.push({ path: '/help/guide', query: {id: '1574609544513228801'} });
}

</script>
<style lang="scss" scoped>
.not-support-box{
  width: 100%;
  height: 100%;
  color: #6F7280;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .support-img{
    width: 76px;
    height: 76px;
    background-repeat: no-repeat;
    background-size: 100%;
    background-image: url('@/assets/icons/icon_empty@2x.png');
  }
}
</style>