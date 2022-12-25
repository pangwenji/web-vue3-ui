<template>
  <div class="mtl-main">
    <div class="cart-table-header">
      <div class="cart-table-th" style="width: 4%">
        <el-checkbox label="全选" size="large" v-model="checkAll"
                     :indeterminate="isIndeterminate"
                     @change="handleCheckAllChange">{{ '' }}
        </el-checkbox>
      </div>
      <div class="cart-table-th" style="width: 11%">缩略图</div>
      <div class="cart-table-th" style="width: 19%">文件名</div>
      <div class="cart-table-th" style="width: 19%">标题</div>
      <!--      <div class="cart-table-th" style="width: 15%">选择关键词</div>-->
      <div class="cart-table-th" style="width: 23%">分类关键词</div>
      <div class="cart-table-th" style="width: 8%">价格
      </div>
      <div class="cart-table-th" style="width: 11%">会员价
      </div>
      <div class="cart-table-th" style="width:5%">操作</div>

    </div>


    <div class="main-box">
      <div class="soundList" v-for="( item, index) in props.waitSettingList" :key="item"
           @click="itemClick(item.material?.id)">
        <div style="width: 4%">
          <div class="list-left">
            <div class="check">
              <el-checkbox-group
                  v-model="checkedItems"
                  @change="handleCheckedItemsChange"
              >
                <div class="checkbox" @click.stop>
                  <el-checkbox size="large" :label="item.material?.id">{{ "" }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div style="width: 11%">
          <div class="list-left">
            <div class="msg">

              <template v-if="pageType !== 'change'">
                <div class="img" v-if="item.material?.typeId < 6"
                     :style="{'background-image': 'url('+ item.material.coverUrl +')'}">
                  <img :src="play2" class="image" v-if="item.material?.typeId < 3">
                </div>


                <div class="img picture" v-if="item.material?.typeId === 6 && item.fileSystem.fileCat === 'image'"
                     :style="{'background-image': 'url('+ item.fileSystem.cover+')'}">
                </div>
                <!--            图片上传压缩包显示工程缩略图（文件夹）-->
                <div class="img project" v-else-if="item.material?.typeId === 6 && item.fileSystem.fileCat !== 'image'">
                </div>
              </template>

              <template v-else-if="pageType === 'change' && item.material?.typeId !== 7">
                <div class="img" v-if="item.material?.typeId < 5"
                     :style="('background-image: url('+ item.material?.coverUrl +')')">
                  <img :src="play2" class="image" v-if="item.material?.typeId < 3">
                </div>
                <div class="img video" v-else-if="item.material?.typeId === 5"
                     :style="{'background-image': 'url('+ item.fileSystem.cover +')'}">
                </div>
                <div class="img picture"
                     v-else-if="item.material?.typeId === 6 && item.fileSystem.fileInfo.fileCat === 'image' "
                     :style="{'background-image': 'url('+ item.fileSystem.cover+')'}">
                </div>
                <div class="img project" v-else>
                </div>

              </template>

              <div class="img font" v-if="item.material?.typeId === 7">
              </div>
            </div>
          </div>
        </div>
        <div style="width: 19%">
          <div class="list-left">
            <div class="msg">
              <div class="title">
                {{ item.fileSystem?.name }}
              </div>
            </div>
          </div>
        </div>
        <div style="width: 19%">
          <div class="list-left">
            <div class="msg">
              <div class="title">
                {{ item.material?.name }}
              </div>
            </div>
          </div>
        </div>
        <!--        <div style="width: 15%">-->
        <!--          <div style="display: flex;" class="list-mid">-->
        <!--            &lt;!&ndash;              标签&ndash;&gt;-->
        <!--            <div class="label">-->
        <!--              <div class="tag" v-for="(labels,indx) in item.material.materialTypeRelations" :key="labels.value">-->
        <!--                {{ labels.typeName }}-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div style="width: 23%">
          <div style="display: flex;" class="list-mid">
            <!--              关键字,限制只显示3个关键词，超出三个显示...-->
            <div class="tags">
              <span class="tag" v-for="(tag,indx) in item.material?.keywords?.slice(0,3)" :key="tag">{{ tag }}</span>
              <span v-if="item.material?.keywords?.length>3" style="color: white;line-height: 35px;">...</span>
            </div>
          </div>
        </div>
        <div style="width: 8%">
          <div class="list-right">
            <div class="right-price"> {{ item.material?.price || '0' }}
              <img style="width: 10px;height: 10px" src="@/assets/user/wallet/tongqian.png"/>
            </div>
          </div>
        </div>
        <div style="width: 11%">
          <div class="list-right">
            <div class="right-price">
              {{ item.material?.memberPrice || '0' }}
              <img style="width: 10px;height: 10px" src="@/assets/user/wallet/tongqian.png"/>
            </div>

          </div>
        </div>
        <div style="width: 5%">
          <div class="list-right">
            <div style="margin-right: 8px;cursor: pointer;color: #3468FE;" @click="deleteItem(index,item.material?.id)">
              删除
              <!--              <Delete style="width: 1em; height: 1em; margin-right: 8px;cursor: pointer"-->
              <!--                      @click="deleteItem(index,item.material?.id)"/>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import play2 from '@/assets/icons/play/play2.png'
import {computed, ref, onMounted, watch} from "vue";
import {useStore} from "vuex";
import {delMaterialList} from "../../../../api/material";
import {ElMessage} from "element-plus";

const store = useStore();
const route = useRoute()
const checkAll = ref(false)
const isIndeterminate = ref(false)
const items = ref([])
const releaseList = ref([])
const data = ref([]);
const typeId = ref(1)

const props = defineProps({
  waitSettingList: {
    type: Array,
    default: []
  }
})

const pageType = ref('')
const mType = ref()
const checkedItems = ref([])
onMounted(() => {
  checkedItems.value = []
  //页面类型，修改素材或者添加发布素材
  pageType.value = route.query.type
  //页面素材类型
  mType.value = route.query.page
})

//全选
const handleCheckAllChange = (val) => {
  //取出行ID
  items.value = props.waitSettingList.map(res => {
    return res.material.id
  })

  checkedItems.value = val ? items.value : []
  isIndeterminate.value = false

  toData(checkedItems.value)
}
/**
 * checkbox选择
 * @param value 选中的id[]
 */
const handleCheckedItemsChange = (value) => {
  //判断全选
  const checkedCount = checkedItems.value.length
  checkAll.value = checkedCount === props.waitSettingList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.waitSettingList.length

  toData(value)
}
/**
 * 行选择
 * @param id 点击行id
 */
const itemClick = (id) => {
  if (checkedItems.value?.some(res => {
    return res === id;
  })) {
    checkedItems.value.splice(checkedItems.value.findIndex(res => {
      return res === id
    }), 1)
  } else {
    checkedItems.value.push(id)
  }
  //判断全选
  const checkedCount = checkedItems.value.length
  checkAll.value = checkedCount === props.waitSettingList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.waitSettingList.length

  toData(checkedItems.value)
}

/**
 * 传递行数据给rightBox
 * @param value 行列表
 */
const toData = (value) => {
  data.value = []
  value.forEach((item) => {
    const d = props.waitSettingList.find((res) => {
      return res.material.id === item
    })

    if (d) {
      data.value.push(d)
    }
  })

  // console.log("data.value", data.value)
  //选中行数据
  store.commit('material/SET_CARD_DATA', data.value)

}
watch(() => props.waitSettingList, newValue => {
  if (!newValue[0]) {
    checkAll.value = false
    checkedItems.value = []
    store.commit('material/SET_CARD_DATA', [])
  }
  // console.log("1",newValue)
})

//删除
function deleteItem(index, id) {
  delMaterialList(id).then((res) => {
    props.waitSettingList.splice(index, 1)
  })
}
</script>

<style lang="scss" scoped>
.mtl-main {
  width: 100%;
  height: 100%;
  //display: flex;
  //justify-content: center;
  //align-items: center;

  .cart-table-header {
    padding: 10px auto;
    width: 100%;
    display: flex;
    align-items: center;
    //justify-content: space-between;
    font-size: 14px;
    color: #BEC0CD;
    //opacity: .4;
    margin-bottom: 5px;
    margin-top: 5px;

    .cart-table-th {
      flex-shrink: 0;
    }
  }

  .main-box {
    .soundList {
      padding: 10px 0px;
      display: flex;
      width: 100%;
      align-items: center;
      //justify-content: space-between;
      .el-col {
        margin: auto;
      }

      &:hover {
        background: rgba(42, 44, 51, 0.3);
        border-radius: 8px;
        //opacity: 0.3;
        //border: 1px solid rgba(173, 177, 194, 0.3);
      }

      .list-left {
        display: flex;

        .check {
          margin: auto 0px;
          margin-right: 15px;
        }

        .msg {
          width: 100%;
          display: flex;

          .img {
            position: relative;
            width: 40px;
            height: 40px;
            background-size: 70px;
            background-image: url("@/assets/images/cd.png");
            background-repeat: no-repeat;
            background-size: cover;

            .image {
              width: 23px;
              height: 23px;
              position: absolute;
              margin: 22%
            }
          }

          .picture {
            background-repeat: no-repeat;
            background-size: cover;
          }

          .resource {
            background-image: url("@/assets/material/ziyuanbao.png");
          }

          .project {
            background-image: url("@/assets/material/gongchengwenjian.png");
          }

          .font {
            background-image: url("@/assets/material/imge_font.png");
          }

          .video {
            background-image: url("@/assets/material/imge_vidio.png");
          }

          .title {
            //margin: auto 10px;
            font-size: 14px;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 20px;
            position: relative;
            display: flex;
            max-height: 42px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            word-wrap: break-word;
            width: 90%;
          }
        }
      }

      .list-mid {
        //flex-wrap: wrap;
        display: flex;
        justify-content: flex-start;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap: break-word;

        .label {
          display: flex;
          flex-wrap: wrap;
        }

        .tags {
          display: flex;
          flex-wrap: nowrap;
          overflow: hidden;
          flex: 0 0 auto;
        }

        .tag {
          height: 26px;
          margin-bottom: 8px;
          border-radius: 4px;
          border: 1px solid #4E5262;
          padding-right: 5px;
          padding-left: 5px;
          text-align: center;;
          font-size: 12px;
          font-weight: 400;
          color: #C4C9D3;
          line-height: 24px;
          margin-right: 8px;

        }
      }

      .list-right {
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        color: rgba(255, 255, 255, 0.8);
        line-height: 14px;
        display: flex;
        justify-content: space-between;
      }
    }

  }

}

.right-price {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  color: #FF9F03;
  font-size: 16px;
}
</style>
