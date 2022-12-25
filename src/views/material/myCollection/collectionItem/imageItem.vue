<template>
  <div>
    <!--    <el-scrollbar ref="scroll" @scroll="staScrollFun" style="width: 100%;height:800px;">-->
    <div class="waterfall">
      <div class="image-item" :style="list.style" v-for="list in dataList" :key="list.id">
        <div class="image-cell" :style="list.parentStyle">
          <div class="image-collect" @click.stop="collectMaterial(list)" >
            <img :src="!list.material.collection?onShou:toShou" alt="素材收藏">
          </div>
          <div class="image-content" @click.stop="toDetails(list.material.id)">
            <!--              :style="list.two" style="max-height: 300px"-->
            <img :src="list.material.queryPixAbayMaterialVO?.webformatUrl" alt="素材图片">
            <div class="card-btm-tag"><span v-for="tag in list.material.queryPixAbayMaterialVO?.tags.split(',')">{{tag}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <!--    </el-scrollbar>-->
  </div>

</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import toShou from '@/assets/material/materialMain/icon_shoucang_to.png'
import onShou from '@/assets/material/materialMain/icon_shoucang_no.png'
import {addCollection, deleteCollection} from "@/api/material/collection";

const router = useRouter();
const props = defineProps({
  materialList: {
    type: Array,
    default: [],
  }
})
const emits = defineEmits('onCancelCollect')
const dataList = ref([]);
onMounted(() => {
  addImage()
  watch(() => props.materialList, newVal => {
    if (props.materialList) {
      dataList.value = []
      addImage()
    }
  })
})
const addImage = () => {
  props.materialList?.forEach(res => {
    appendImage(res)
  })
}

const imageHeight = 180;
const scroll = ref(null)
const imgMaxWidth = 500
const imgMaxHeight = 500
function appendImage(row) {
  if (row.material.typeId !== 6) {
    return;
  }
  row.style = {}
  row.parentStyle = {}
  row.two={}
    let width = row.material.queryPixAbayMaterialVO?.webformatWidth;
    let height =  row.material.queryPixAbayMaterialVO?.webformatHeight;
    if (height <= 300) { //设置阈值小于这个值将宽高放大 300px
      height = height + 300;
      width = (width / row.material.queryPixAbayMaterialVO?.webformatHeight) * height;
    }else if(width > imgMaxWidth){
      height = ( imgMaxWidth / width) * height;
      width = imgMaxWidth
    }else if(height > imgMaxHeight){
      width = (imgMaxHeight / height) * width;
      height = imgMaxHeight
    }

    const scaleWidth = (width / height) * imageHeight; //获取外边框高度为200的宽度
    row.style.flexBasis = scaleWidth + 'px';
    row.style.maxWidth = width + 'px';
    row.parentStyle.paddingTop = ((height / width) * 100) + '%';
    // console.log('height / width', height, width)
    row.style.flexGrow = width / height;
    row.style.flexShrink = width / height;
    // row.two.height=height/width*100+'%'
    // row.two.aspectRatio=width/height;
    dataList.value.push(row);
}

//跳转详情页
const toDetails = (id) => {
  router.push({
    path: `details/` + id,
  });
};

function collectMaterial(row) {
  deleteCollection({id: row.material.id}).then(res=>{
    emits('onCandelCollect',row)
  })
  // row.material.collection = !row.material.collection;
  // if (row.material.collection) {
  //   addCollection({materialId: row.material.id})
  // } else {
  //   deleteCollection({id: row.material.id})
  // }
}

</script>

<style lang="scss" scoped>
.waterfall {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  //align-items: center;
  align-items: flex-start;
  position: relative;
  //height: 100%;
  padding-bottom: 10px;
  &::after {
    content: "";
    flex-grow: 99999; /* 属性值可以给大点 */
  }

  .image-collect {
    position: absolute;
    right: 10px;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    z-index: 2;
    background-size: cover;
    cursor: pointer;
    top: -30px;
    transition: top .3s ease;
  }

  .card-btm-tag{
    color: rgba(255, 255, 255, 0.77);
    bottom: -25px;
    background: linear-gradient(0deg,rgba(0,0,0,.6) 0,transparent);
    //bottom: 15px;
    left: 0px;
    position: absolute;
    z-index: 3;
    transition: bottom .3s ease;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    width: 100%;
    padding-left: 10px;
    span{
      padding: 3px;
    }
  }


  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    //padding: 3px;

    &:hover {
      //transform:scale(1.03);
      //transition:all .3s linear;
      cursor: pointer;
    }
    //border-radius: 10px;
  }

  :deep(.image-item ){
    flex: auto;
    margin: 2px;
    /* flex-basis: 100px; */
    max-width: 380px;
    overflow: hidden;
    /* background: red; */
    position: relative;
    //height: 200px;
    .image-cell {
      width: 100%;
      height: 100%;
      line-height: 0;
      position: relative;

      &:hover {
        .image-collect {
          top: 10px;
        }
        .card-btm-tag{
          bottom: 0px;
          left: 0px;
        }
      }
    }
    .image-content {
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      background-color: black;
      padding: 2px;

      &:hover {
        cursor: pointer;
      }

      .image {

      }
    }

    .image-content img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: white;
    }
  }
}
</style>
