<template>
    <span class="point point-none"  v-if="type == 'none'" :class="[('point-' + size),customClass,{hoverActive},active?('point-active-' + type):('point-color-' + type)]">
        <el-icon><CircleClose /></el-icon>
    </span>
    <span class="point " v-else :class="[('point-' + size),customClass,{shadown,hoverActive},active?('point-active-' + type):('point-color-' + type)]"></span>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        // 自定义类名
        customClass:{
            default: "",
        },
        // 类型
        type:{
            type:String,
            default:"success"
        },
        // 大小
        size:{
            type:String,
            default:"small"
        },
        // 选中状态
        active:{
            type: Boolean,
            default: false 
        },
        // 鼠标移入状态
        hoverActive:{
            type: Boolean,
            default: false 
        },
        // 阴影
        shadown:{
            type: Boolean,
            default: false
        }
    }
})
</script>

<style scoped lang="scss">
// 标记样式
$el-background-yellow:#FFC800;
$el-background-red:#F88212;
$el-background-blue:#3468FE;
$el-background-purple:#6857FF;
$el-background-green:#5AD65D;
$el-background-orange:#F18F60;
$el-background-danger:#F03860;
$el-background-lightblue:#7CB5EC;

@mixin  point-color($type, $color) {
  .point.point-color-#{$type} {
      &::after{
          background: $color;
      }
      &.shadown{
          &::after{
            box-shadow: 0 0 5px $color;
          }
      }
      &.hoverActive{
          &:hover{
              border: 1px solid $color;
          }
      }
  }
}

@mixin  point-active($type, $color) {
  .point.point-active-#{$type} {
      border: 1px solid $color;
      &::after{
          background: $color;
      }
  }
}



.point {
  height: 16px;
  width: 16px;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-sizing: border-box;
  border: 1px solid transparent;
    &::after{
        content: '';
        display: inline-block;
    }
    &.point-none{
        // font-size: 6px;
        color: #000000;
        &::after{
            content: '';
            display: none;
        }
    }   
    &.point-small{
        height: 16px;
        width: 16px;
        font-size: 10px;
        &::after{
            width: 6px;
            height: 6px;
            border-radius: 10px;
        }
    }

    &.point-medium{
        height: 18px;
        width: 18px;
        font-size: 12px;
        &::after{
            width: 8px;
            height: 8px;
            border-radius: 10px;
        }
    }
    &.point-large{
        height: 20px;
        width: 20px;
        font-size: 14px;
        &::after{
            width: 10px;
            height: 10px;
            border-radius: 10px;
        }
    }
}
@include point-color("red",$el-background-red);
@include point-color("blue",$el-background-blue);
@include point-color("green",$el-background-green);
@include point-color("yellow",$el-background-yellow);
@include point-color("orange",$el-background-orange);
@include point-color("purple",$el-background-purple);
@include point-color("danger",$el-background-danger);
@include point-color("lightblue",$el-background-lightblue);
@include point-color("none",#000000);
@include point-active("yellow",$el-background-yellow);
@include point-active("red",$el-background-red);
@include point-active("blue",$el-background-blue);
@include point-active("purple",$el-background-purple);
@include point-active("green",$el-background-green);
@include point-active("orange",$el-background-orange);
@include point-active("danger",$el-background-danger);
@include point-active("lightblue",$el-background-lightblue);
@include point-active("none",#000000);
</style>