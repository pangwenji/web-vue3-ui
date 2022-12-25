<template>
    <div
     class="wrapper"
     :style="{position:'fixed',top:position.y +'px',left:position.x+'px'}"
     @click.stop=""
    >
      <div v-if="!mockList.length" class="empty">无搜索结果</div>
      <el-scrollbar :height="scrollbarHeight+'px'">
        <div
          v-for="(item,i) in mockList"
          :key="item.id"
          class="item"
          :class="{'active': i === index}"
          ref="usersRef"
          @click.stop="clickAt($event,item)"
          @mouseenter="hoverAt(i)"
        >
          <div class="name">{{item.name}}</div>
        </div>
      </el-scrollbar>
    </div>
</template>
  
<script>
export default {
  name: 'AtDialog',
  props: {
    visible: Boolean,
    position: Object,
    queryString: String
  },
  data () {
    return {
      users: [],
      index: -1,
      mockList: [],
      scrollbarHeight: 0
    }
  },
  watch: {
    queryString (val) {
      val ? this.mockList = this.memberList.filter(({ name }) => name.startsWith(val)) : this.mockList = this.memberList.slice(0)
    }
  },
  mounted () {
    document.addEventListener('keyup', this.keyDownHandler)
    this.mockList = this.memberList
    if (this.mockList.length < 11) {
      this.scrollbarHeight = this.mockList.length * 34 + 6
    } else {
      this.scrollbarHeight = 346
    }
  },
  unmounted () {
    document.removeEventListener('keyup', this.keyDownHandler)
  },
  computed: {
    memberList() {
      const gg = this.$store.state.file.memberList;
      const gg2 = gg.map(it => {
        return {
          name: it.user?.nickName,
          id: it.user.userId
        }
      })
      gg2.unshift({name:'所有人', id:0})
      return gg2;
    }
  },
  methods: {
    keyDownHandler (e) {
      if (e.code === 'Escape') {
        this.$emit('onHide')
        return
      }
      // 键盘按下 => ↓
      if (e.code === 'ArrowDown') {
        if (this.index >= this.mockList.length - 1) {
          this.index = 0
        } else {
          this.index = this.index + 1
        }
      }
      // 键盘按下 => ↑
      if (e.code === 'ArrowUp') {
        if (this.index <= 0) {
          this.index = this.mockList.length - 1
        } else {
          this.index = this.index - 1
        }
      }
      // 键盘按下 => 回车
      if (e.code === 'Enter') {
        if (this.mockList.length) {
          const user = {
            name: this.mockList[this.index].name,
            id: this.mockList[this.index].id
          }
          this.$emit('onPickUser', user)
          this.index = -1
        }
      }
    },
    clickAt (e, item) {
      const user = {
        name: item.name,
        id: item.id
      }
      this.$emit('onPickUser', user)
      this.index = -1
    },
    hoverAt (index) {
      this.index = index
    }
  }
}
</script>
  
<style scoped lang="scss">
  .wrapper {
    width: 178px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-sizing: border-box;
    padding: 6px 0;
    z-index: 9999;
    user-select: none;
  }
  .empty{
    font-size: 14px;
    padding: 0 20px;
    color: #999;
  }
  .item {
    font-size: 14px;
    padding: 0 20px;
    line-height: 34px;
    cursor: pointer;
    color: #606266;
    &.active {
      background-color: rgba($color: #0459FF, $alpha: .1);
      color: blue;
      .id {
        color: blue;
      }
    }
    &:first-child {
      border-radius: 5px 5px 0 0;
    }
    &:last-child {
      border-radius: 0 0 5px 5px;
    }
    .id {
      font-size: 12px;
      color: rgb(83, 81, 81);
    }
    .name{
      width: 136px;
      // height: 34px;
      white-space:nowrap;
      text-overflow:ellipsis;
      overflow:hidden;
    }
  }
</style>