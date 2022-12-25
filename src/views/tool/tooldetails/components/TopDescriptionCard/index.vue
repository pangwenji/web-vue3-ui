<template>
  <div class="tool-header-main">
    <div class="detail" style="margin-right: 30px;flex: 3">
      <div class="right-detail">
        <div class="title-icon">
          <el-image class="icon-img" :src="data.icon"></el-image>
        </div>
        <div>
          <div class="title-name">
            <div class="title-text">
              {{ data.name }}
            </div>
            <div v-for="tag in data.tagList">
              <!--              <el-tag>AI智能工具</el-tag>-->
              <div class="el-tag-ai" :style="{backgroundImage:'url('+tag.icon+')'}">{{ tag.title }}</div>
            </div>
          </div>
          <div class="main-text">
            {{ data.description }}
          </div>
        </div>
      </div>
    </div>
    <div class="detail" style="flex: 2">
      <div class="processing-details">
        <div>
          <span class="detail-unit">
            <span class="box-price" :class="{gray:data.ifVip}">
              <div class="number">
                <span :class="{lineText:data.ifVip}"  > {{ data.costType == '0'||data.cost==0 ? '免费' : data.cost }}</span>
                <img v-if="!(data.costType == '0'||data.cost==0)" style="width:9px;height:9px;" src="@/assets/user/wallet/tongqian.png"/>
                <span v-if="data.costType === '3'" style="font-size: 12px;">/分钟</span>
              </div>
              <div class="ntext">原价</div>
            </span>
            <span class="box-price">
              <div class="number">
                <span>{{ data.memberPrice == 0 ? '免费' : data.memberPrice  }}</span>
                <img v-if="data.memberPrice > 0" style="width:9px;height:9px;" src="@/assets/user/wallet/tongqian.png"/>
                <span v-if="data.costType === '3'" style="font-size: 12px;">/分钟</span>
              </div>
              <div class="ntext">会员价</div>
            </span>
          </span>

<!--          <span class="detail-unit" v-else>-->
<!--              <span class="box-price gray">-->
<!--              <div class="number">-->
<!--                <span style="text-decoration-line: line-through;"> {{ data.costType == '0' ? '免费' : data.cost }}</span>-->
<!--                <el-image v-if="data.costType != '0'" :src="bean" style="width: 8px;height: 8px"/>-->
<!--              </div>-->
<!--              <div class="ntext">原价</div>-->
<!--            </span>-->
<!--            <span class="box-price">-->
<!--              <div class="number">-->
<!--                {{ data.memberPrice == 0 ? '免费' : data.memberPrice + '同钱' }}-->
<!--                <el-image v-if="data.memberPrice!=0" :src="bean" style="width: 8px;height: 8px"/>-->
<!--              </div>-->
<!--              <div class="ntext">会员价</div>-->
<!--            </span>-->
<!--          </span>-->

        </div>
        <slot name="main">
          <div class="title-info-list">
            <div v-if="toFormat.show" class="info-item info-border">
              <el-popover
                  placement="bottom"
                  :width="toFormat.width"
                  trigger="hover"
              >
                <template #reference>
                  支持格式
                </template>
                <slot name="format">
                  暂无具体规定
                </slot>
              </el-popover>
            </div>

            <div v-if="explain.show" class="info-item info-border" >
              <el-popover
                  placement="bottom"
                  :width="explain.width"
                  trigger="hover"
              >
                <template #reference>
                  版权声明
                </template>
                <slot name="explain">
                  <div style="margin-bottom: 15px">
                    <div class="title-info">- 请您仔细阅读本声明 -</div>
                    <div class="import-text">
                      &emsp;影音同画平台十分重视网络版权及其他知识产权以及用户权益的保护， 但是对用户使用“工具”处理的音频/图片/视频/文档等不具备监控能力。
                    </div>
                    <div class="item-text-info">
                      <div>1、</div>
                      <div>影音同画仅作为平台服务提供商，不会对用户上传和处理的文件，进行真实性、合法性进行审查，用户修改、编辑的文件与影音同画无关。</div>
                    </div>

                    <div class="item-text-info">
                      <div>2、</div>
                      <div>如上传或处理的作品涉及版权，版权均归原作者所有，用户若需要使用，应当联系原作者获得授权许可。</div>
                    </div>

                    <div class="item-text-info">
                      <div>3、</div>
                      <div>如因未授权使用引起纠纷，影音同画不承担任何责任。</div>
                    </div>
                  </div>
                </slot>
              </el-popover>
            </div>


            <div class="info-item">{{ data.userName }}</div>
          </div>
        </slot>

      </div>
    </div>
  </div>
</template>

<script setup>
import bean from '@/assets/tool/bean.png'
import {Sort} from "@element-plus/icons-vue";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  toFormat:{
    type:Object,
    default: {
      show:true,
      width:278
    }
  },
  copyright:{
    type:Object,
    default: {
      show:true,
      width:278
    }
  },
  explain:{
    type:Object,
    default: {
      show:true,
      width:490
    }
  }
})

</script>

<style scoped lang="scss">
.tool-header-main {
  width: 95%;
  margin: 30px auto;
  display: flex;

  .title-name {
    display: flex;
    padding-bottom: 12px;
    //background-color: white;
    border-radius: 10px;

    .title-text {
      font-size: 23px;
      line-height: 1;
      color: white;
      padding-right: 14px;
    }

    .el-tag-ai {
      height: 24px;
      background-color: rgb(42 61 118);
      border-radius: 12.5px;
      border: none;
      line-height: 25px;
      padding-left: 32px;
      padding-right: 10px;
      font-size: 12px;
      background-repeat: no-repeat;
      //background-image: url("@/assets/tool/bg-ai.png");
    }
  }

  .main-text {
    font-size: 14px;
    color: #9094A6;
  }

  .right-detail {
    flex: 3;
    display: flex;

  }

  .detail {
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #1C1D24;
    //background: linear-gradient(120deg, #1E202C 0%, #1F1E27 100%);
    color: white;
    padding: 30px;

    .processing-details {
      margin-top: 18px;
      text-align: center;
      flex: 1;
      color: white;
    }

    .detail-price {
      font-size: 25px;
      color: #FFD821;
      letter-spacing: 0;
      font-weight: 500;
    }

    .detail-unit {
      font-size: 14px;
      color: #CF9B55;
      letter-spacing: 0.54px;
      font-weight: 400;
      margin-left: 6px;
      padding: 20px;
      background-color: #14151B;
      display: inline-flex;
      border-radius: 8px;

      .box-price {
        padding: 0 20px;

        .number {
          font-size: 24px;
        }

        .ntext {
          font-size: 12px;
          color: #BEC0CD;
          margin-top: 4px;
        }
      }
    }

    .mt10 {
      margin-top: 10px;
    }

    .detail-text-limit {
      font-size: 14px;
      color: #CFD2D8;
      letter-spacing: 0.54px;
      font-weight: 400;
    }

    .detail-text-file-type {
      font-size: 14px;
      color: #9094A6;
      letter-spacing: 0.54px;
      font-weight: 400;
    }
  }

  .title-icon {
    padding: 0 30px 30px 0;

    .icon-img {
      width: 56px;
      height: 56px;
      border-radius: 12px;
    }
  }

  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
  .lineText{
    text-decoration-line: line-through;
  }
}


.title-info-list{
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  color: #676C7F;
  height: 10px;
  line-height: 10px;
  align-items: center;
  margin: 6px;
  .info-item{
    margin-top: 20px;
    padding: 0 8px;
    cursor: pointer;
  }
  .info-border{
    border-right: #676C7F solid 1px;
    height: 10px;
  }

}
.item-text-info{
  display: flex;
  padding:5px 18px;
}

.title-info{
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 5px;
  color: #1C1D24;
}

.import-text{
  padding: 20px;
  font-weight: 500;
  color: #1C1D24;
}

.item-text-info{
  display: flex;
  padding:5px 18px;
}

</style>
