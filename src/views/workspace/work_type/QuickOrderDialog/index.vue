<template>
  <div>
    <el-dialog v-model="show" :show-close="false" width="891px" @close="close">
      <div class="dialog-header">
        <!-- 头像部分-->
        <div class="header">
          <div class="flex">
            <div class="avatar">
              <el-avatar
                  :src="data.avatar"
                  :size="50"
              />
              <span class="point"></span>
            </div>
            <!-- 名称和简介部分   -->
            <div class="info">
              <div class="name">
                {{ data.nickName }}
                <img :src="word1"/>
                <img :src="word2"/>
                <img :src="word3"/>
              </div>
              <div class="content"> {{ data.title }}</div>
            </div>
          </div>
          <div class="flex right">
            <div class="time">{{ data.quotedPrice }}同钱/分钟</div>
            <div class="number">
              <el-input-number v-model="orderForm.num"
                               @change="quickOrder"
                               :min="props.data.quotedPrice===0?0:
                                Math.ceil(props.data.price/props.data.quotedPrice)"
              />

            </div>
            <div class="money">{{ orderForm.actualPayPrice?.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <div class="content-box">
        <div class="demand">
          <el-scrollbar height="100%">
            <div class="remark">
              <div class="label">需求备注</div>
              <div class="text">
                <el-input
                    :rows="2"
                    type="textarea"
                    style=" resize:none;"
                    v-model="orderForm.content"
                />
              </div>
            </div>
            <div class="file-list">
              <div>上传附件</div>
              <div>
                <el-upload
                    class="upload-demo"
                    :show-file-list="false"
                    :auto-upload="false"
                    multiple
                    action="#"
                    :on-change="handleChange">
                  <el-button class="upload-bt" :icon="Top">上传文件</el-button>
                  <template #tip>
                    <div class="el-upload__tip"
                         style="font-weight: 400;font-size: 14px;color: #9D9DA1;margin-left: 15px">
                      支持扩展名：rar、zip、doc、docx、pdf、jpg…
                    </div>
                  </template>
                </el-upload>
              </div>
            </div>
            <div>
              <div class="file-item-quick" v-for="(file,index) in orderForm.fileLists">
                <div class="file-name">{{ file.name }}</div>
                <div>{{ file.size }}</div>
                <div style="cursor: pointer" @click="deleteFile(index)">
                  <el-icon>
                    <Delete/>
                  </el-icon>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="service-charge">
            <div>服务费 {{ rate }}：</div>
            <div class="pay_money">
              <div class="service">
                {{ orderForm.serviceCharge?.toFixed(2) }}
              </div>
              <div class="actually-paid">
                <span class="text">实付金额：</span>
                <span class="money">{{ orderForm.price?.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-bt">
        <div class="bt-text">
          <span class="available">可用余额</span>
          <span class="star-bean">{{ money }}同钱</span>
          <span class="over" v-if="money<orderForm.price" @click="toBuy">余额不足，去购买</span>
        </div>
        <div>
          <el-button @click="close">取消订单</el-button>
          <el-button class="confirm" @click="confirm"
                     :disabled="money<orderForm.price"
          >立即支付</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import word1 from "@/assets/icons/work/word1.png"
import word2 from "@/assets/icons/work/word2.png"
import word3 from "@/assets/icons/work/word3.png"
import {Top} from '@element-plus/icons-vue'

import UploadFile from "@/utils/uploadFile"
import {createUploadSign, createUploadFile} from '@/api/personnel/file'
import {formatSize} from "@/utils/tool";
import {useStore} from "vuex";
import {getCurrentInstance} from 'vue'
const store = useStore();
const props = defineProps({
  show: Boolean,
  width: {
    default: '530px',
    type: String,
  },
  data: Object,
  orderForm: Object,
})
const { proxy } = getCurrentInstance();
const rate = computed(() => {
  return store.state.personnel.config.rate;
})

const money = computed(() => {
  return store.state.user.money;
})

const emit = defineEmits(['update:show', 'confirm'])
const close = () => {
  emit('update:show', false)
}

const confirm = () => {
  close();
  emit('confirm')
}

const toBuy = () => {
  proxy.$pay.openRecharge()
}
/**
 * 件数改变后触发事件
 */
const quickOrder = () => {
  props.orderForm.actualPayPrice = props.orderForm.num * props.data.quotedPrice;
  props.orderForm.serviceCharge = Number.parseInt(rate.value?.replace("%", "")) / 100 * props.orderForm.actualPayPrice
  props.orderForm.price = props.orderForm.serviceCharge + props.orderForm.actualPayPrice
}

const handleChange = (rawFile) => {
  // 上传文件
  const File = rawFile.raw;
  const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  store.commit('upload/addFileList', uploadData)
}


/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
  const params = {
    filename: obj.FileName,
    size: obj.FileSize,
    md5: obj.FileMD5
  }
  createUploadSign(params).then(res => {
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

/**
 * 上传文件
 * @param resultData
 * @param options
 * @param callback
 * @param errorback
 * @constructor
 */
const CreateUploadFileFun = ({resultData, options}, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  }
  createUploadFile(params).then(res => {
    let rawFile = res.data.fileSystem;
    props.orderForm.fileLists.push({
      size: formatSize(rawFile.size),
      type: rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1),
      name: rawFile.name,
      id: res.data.encryptedId,
    })
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

/**
 * 删除文件
 */
const deleteFile = (index) => {
  props.orderForm.fileLists.splice(index,1)
}

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
