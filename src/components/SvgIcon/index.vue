<template>
  <svg  :class="svgClass" :width="typeof size == 'number' ?  `${size}px` : size " :height="typeof size == 'number' ?  `${size}px` : size" aria-hidden="true">
    <title v-if="title">{{title}}</title>
    <use :xlink:href="iconName"  :style="{stroke: color}" :fill="color" />
  </svg>
</template>

<script>
export default defineComponent({
  props: {
    title:{
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: [Number,String],
      default: '1em'
    },
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.iconClass}`),
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`
        }
        return 'svg-icon'
      })
    }
  }
})
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  position: relative;
  fill: currentColor;
  flex-shrink: 0;
  vertical-align: -2px;
  *{
    pointer-events: none;
  }
}
</style>
