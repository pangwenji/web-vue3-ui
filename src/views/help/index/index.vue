<template>
  <el-container class="help-container">
    <el-header class="header">
      <div class="header-box">
        <div class="header-left">
          <div class="top-logo" @click="goOfficial">
            <el-image style="width: 100%; height: 100%" :src="logo">
              <template #error>
                <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items:center;cursor: pointer">
                  <el-icon :size="36" color="#ffffff">
                    <PictureFilled/>
                  </el-icon>
                </div>
              </template>
            </el-image>

          </div>
          <div class="title">帮助中心</div>
          <direction-arrow />
        </div>
        <div class="header-right">
          <div>
            <el-input
                v-model="keyword"
                placeholder='输入关键词,搜索当前页内容'
                :suffix-icon="Search"
                @input="handleSearch"
                style="display: flex;"
            />
          </div>
          <div @click="goOfficial">首页</div>
          <div @click="adviceFeedback">建议反馈</div>
          <!--          <div>下载</div>-->
        </div>
      </div>
    </el-header>

    <el-container class="main-container" v-model="text">
      <el-aside class="aside">
        <el-tree ref="elTreeList" :data="categoryList" node-key="articleId" current-node-key="articleId" :props="defaultProps"
                 @node-click="handleCheck" default-expand-all highlight-current>
          <template #default="{ node, data }">
              <span class="el-tree-node__label" style="width: 100%;">{{data.title}}</span>
          </template>
        </el-tree>
      </el-aside>
      <!--      中间部分HTML-->
      <el-main class="help-main" id="help-main">
        <div style=" width: 70%;">
          <div v-html="markdownToHtml" class="html" id="html"></div>
        </div>
      </el-main>
      <!--     右侧目录-->
      <div class="main-right">
        <div class="list">
          <el-scrollbar>
            <ul>
              <template  v-for="item in titleList">
                <li :class="{'action': cTitle === item.id}" @click="scrollToView(item)">
                  <span class="list-title" v-if="item.level === 1" style="padding-left: 40px">{{ item.rawName }} </span>
                  <span class="list-title" v-else>{{ item.rawName }} </span>
                </li>
              </template>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </el-container>

    <informDialog
      ref="informRef"
      :type="4"
      :close-on-click-modal="false"
    ></informDialog>

  </el-container>
</template>
<script setup>
import {ref, computed, onMounted, nextTick} from "vue";
import {useRoute, useRouter} from "vue-router";
import logo from '@/assets/logo/logo.png'
import {watch} from "vue";
import {Search} from '@element-plus/icons-vue'
import {getArticle, getArticleList, getCategoryList} from "@/api/help";
import {marked} from 'marked';
import CustomTree from '../components/CustomTree'
import informDialog from '@/components/informDialog'
import DirectionArrow from '@/layout/components/DirectionArrow'

const route = useRoute();
const keyword = ref()
const nowPath = ref('');
onMounted(() => {
  nowPath.value = route.path;
  getList()

});
watch(route, () => {
  nowPath.value = route.path;
})
const defaultProps = {
  children: 'children',
  label: 'title',
}
const menus = [
  {
    name: '使用指南',
    path: '/help/guide'
  },
  {
    name: '会员介绍',
    path: '/help/member'
  },
  {
    name: '视频演示',
    path: '/help/videoDemo'
  },
  {
    name: '关于我们',
    path: '/help/aboutMe'
  },
]

const markdownToHtml = ref("")
const router = useRouter();

function goOfficial() {
  router.push('/index')
}

const html = ref()

const check = ref()
const  elTreeList=ref(null)
const handleCheck = (val) =>{
  if (val.type === 2){
    router.push({
      query: {...route.query, id:val.articleId}
    })
    checkItem(val.articleId)
  }
}
/**
 * 切换目录获取文章内容以及右侧目录
 * id:文章id
 */
const checkItem = (id) => {
  check.value = id
  keyword.value = ''

  getArticleDetails(id)
  setTimeout(() => {
    getTitles()
  }, 500)
}




const cTitle = ref()

/**
 * 点击右侧目录滚动到指定位置
 * item:点击的item
 */
function scrollToView(item) {
  cTitle.value = item.id
  document.getElementById('help-main').scroll({top: item.scrollTop, left: 0, behavior: "smooth"});
}

/**
 * 获取文章详情
 * id:文章id
 */
const ArtContent = ref([])
function getArticleDetails(id) {
  const query = {id: id}
  getArticle(query).then(res => {
    markdownToHtml.value = res.data.content
    //保存原html,用于清除高亮
    htmlText.value = markdownToHtml.value
  })
}

let titleList = ref([]);
let progress = ref(0)

// 获取目录的标题
/**
 * 获取目录的标题
 * 生成右侧目录
 */
const getTitles = () => {
  let titles = [];
  let levels = ["h1", "h2", "h3"];

  let articleElement = document.querySelector('#html');
  if (!articleElement) {
    return titles;
  }

  let elements = Array.from(articleElement.querySelectorAll("*"));

  // 调整标签等级
  let tagNames = new Set(
      elements.map((el) => el.tagName.toLowerCase())
  );
  for (let i = levels.length - 1; i >= 0; i--) {
    if (!tagNames.has(levels[i])) {
      levels.splice(i, 1);
    }
  }

  let serialNumbers = levels.map(() => 0);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    let tagName = element.tagName.toLowerCase();
    let level = levels.indexOf(tagName);
    if (level == -1) continue;

    //id添加标题名称
    let id = tagName + "-" + element.innerText + "-" + i;

    let node = {
      id,
      level,
      parent: null,
      children: [],
      rawName: element.innerText,
      scrollTop: element.offsetTop,
    };


    if (titles.length > 0) {
      let lastNode = titles.at(-1);

      // 遇到子标题
      if (lastNode.level < node.level) {
        node.parent = lastNode;
        lastNode.children.push(node);

      }
      // 遇到上一级标题
      else if (lastNode.level > node.level) {
        serialNumbers.fill(0, level + 1);
        let parent = lastNode.parent;
        while (parent) {
          if (parent.level < node.level) {
            parent.children.push(node);
            node.parent = parent;
            break;
          }
          parent = parent.parent;
        }
      }
      // 遇到平级
      else if (lastNode.parent) {
        node.parent = lastNode.parent;
        lastNode.parent.children.push(node);
      }
    }

    serialNumbers[level] += 1;
    let serialNumber = serialNumbers.slice(0, level + 1).join(".");

    node.isVisible = node.parent == null;
    node.name = serialNumber + ". " + element.innerText;
    titles.push(node);
  }

  titleList.value = Object.assign([], titles)
  cTitle.value = titleList.value[0]?.id
  return titles;
}

const rawCategoryList = ref([])//原分类列表数据
const categoryList = ref([])//最终文章列表
/**
 * 左侧分类列表
 */
function getList() {
  const parentId = '1593784740944097282'
  getCategoryList({parentId}).then(res => {
    rawCategoryList.value = res.data
    categoryList.value = listToTreeSimple(res.data)
      nextTick(()=> {
        if (!route.query.id) {
          const firstArticleId = categoryList.value[0].children[0].articleId
          elTreeList.value.setCurrentKey(firstArticleId)
          checkItem(firstArticleId)
        }else {
          elTreeList.value.setCurrentKey(route.query.id)
          scrollToSection(route.query.id)
          checkItem(route.query.id)
        }
      })

    getArtiList()
  })
}

/**
 * 文章列表
 */
const ArtiList = ref([])

function getArtiList() {
  const query = {
    current: 1,
    size: 100,
    keyword: '',
  }
  getArticleList(query).then(res => {
    res.data.records.forEach(it => {
      // it.parentId = it.catId
      it.categoryId = it.id
      it.articleId = it.id
    })
    ArtiList.value = res.data.records
    getalwaysList()
  })
}

//改变生成分类树结构
function listToTreeSimple(data) {
  const res = [];
  data.forEach((item) => {
    //创建children结构
    const parent = data.find((node) => {
      return node.categoryId === item.parentId
    });
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      // * 根节点
      res.push(item);
    }
  });
  return res;
}

/**
 * 获取到文章和分类后，将列表结合,生成最终树状
 */
function getalwaysList() {
  ArtiList.value.forEach(item => {
    categoryList.value.find((el) => {
      if (item.catId === el.categoryId) {
        el.children.push(item);
      }
    })
  })
}

const text = ref()
const htmlText = ref()
//搜索关键词
const handleSearch = () => {
  //清除之前的搜索结果
  markdownToHtml.value = htmlText.value
  const regExp2 = new RegExp(keyword.value, 'g')
  if (keyword.value) {
    //标签替换
    markdownToHtml.value = markdownToHtml.value.replace(regExp2, (
        '<span style="color: black;background-color: yellow;padding: 2px">' + keyword.value + '</span>'))
  } else if (!keyword.value) {
    //清除高亮
    markdownToHtml.value = htmlText.value
  }
}

const informRef = ref()
function adviceFeedback() {
  informRef.value.isShow = true
}


function scrollToSection(id) {
  let section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ block: 'center' })
  }
}

</script>
<style scoped lang="scss">

:deep(.el-tree){
  background: #23242D;
  color: #666A7A;
  --el-tree-node-hover-bg-color:#292A35;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  .el-tree-node{
    &.is-current {
      .el-tree-node__content{
        color: #C2C7CE;
      }
    }
    .el-tree-node__content{
      color: #ffffff;

      height: 40px;
      .el-tree-node__expand-icon{
        margin-left: 20px;
        &.expanded{
          color: #3468FE;
        }
      }
    }
    .el-tree-node__children{
      .el-tree-node__content{
        color: #666A7A;
        .el-tree-node__expand-icon .is-leaf{

          &.is-leaf{
            color: transparent !important;

          }
        }

      }
    }

  }
}
:deep(.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content){
  background-color: #292A35 !important;
  color: #C2C7CE;
  .el-tree-node__label{
    width: 100%;
    border-right: 2px solid #3468FE;
  }
}

.el-main {
  padding: 0;
  background: #23242D;
}

.help-container {
  height: calc(100vh - 60px);
  background: #23242D;

  .header {
    padding: 0;

    .header-box {
      height: 60px;
      width: 100%;
      background-color: #1E1F26;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;

      .header-left {
        width: 50%;
        display: flex;
        align-items: center;

        .top-logo {
          width: 45px;
          height: 45px;
          background: black;
          border-radius: 50px;
          text-align: center;
          line-height: 50px;
          cursor: pointer;
        }

        .title {
          margin-left: 20px;
          font-size: 14px;
          //font-weight: bold;
          color: #FFFFFF;
          line-height: 16px;
          margin-right: 20px;
        }
      }


      .header-right {
        height: 60px;
        width: 50%;
        font-size: 12px;
        font-weight: 400;
        color: #CFD2D8;
        line-height: 18px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        :deep(.el-input){
          --el-input-placeholder-color: #3D3F50;
          .el-input__inner{
            background:  #17181E;
            border-radius: 15px;
          }
          .el-input__suffix{
            color: #3D3F50;
          }
          input {
            box-shadow: none; //去除白边
          }
        }

        div {
          margin-right: 30px;
          cursor: pointer;
        }
      }
    }
  }

  .main-container {
    margin-left: 0px !important;

    .aside {
      margin-bottom: 0;
      width: 280px;
      background-color:#23242D;
      border-right: 1px solid #1E1F26;
      padding: 0;

      .help-side {
        padding: 20px 0px;

        .menu-item {
          color: rgba(240, 242, 245, 0.78);
          padding: 15px 0px 15px 20px;
          margin-left: 10px;
          line-height: 26px;
          height: 27px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow:ellipsis;
          .menu-item-name {
            padding-left: 30px;
            line-height: 20px;
            cursor: pointer;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
            &:hover {
              color: #3468FE;
            }

          }

          &.action {
            color: #3468FE !important;
            border-left: 3px solid #3468FE;
          }


          &-name {
            margin-left: 6px;
          }
        }

        .menu-item2 {
          color: rgb(153, 153, 153);
          padding: 15px 20px 0px 40px;
          margin-left: 10px;
          line-height: 26px;
          height: 27px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;

          .menu-item-name2 {
            color: rgba(190, 192, 205, 0.41);
          }
        }
      }
    }

    .help-main {
      background-color: #13141B;
      transition: margin-left 0.28s;
      display: flex;
      flex-direction: column;
      width: 70%;
      align-items: center;

    }

    .main-right {
      width: 200px;
      height: 100%;
      background-color: #23242D;
      position: relative;

      .list {
        position: absolute;
        //top: 160px;
        //height: 75%;
        //max-height: 500px;
        padding-bottom: 10px;
        overflow: hidden;
        width: 100%;
        .title {
          color: rgba(255, 255, 255, 0.70);
          font-size: 20px;
          padding-left: 10px;
        }
        ul{
          margin: 0px;
        }
        li {
          font-size: 14px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.70);
          min-height: 40px;
          display: flex;
          align-items: center;
          .list-title{
            width: 100%;
            padding-left: 20px;
            padding-right: 10px;
          }
          &.action {
            color: #C2C7CE;
            background: #292A35;
            line-height: 20px;
            .list-title{
              border-left: 2px solid #3468FE;
            }
          }

          &:hover {
            color: #C2C7CE;
            background: #292A35;
          }
        }
      }
    }


  }

  //隐藏滚动条
  ::-webkit-scrollbar {
    width: 0 !important;
  }

  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
}

.html {
  color: #f0f2f5;

  :deep(h2) {
    margin-top: 52px;
    font-size: 16px;
    font-weight: 400;
    color: #CFD2D8;
    line-height: 18px;
    border-left: 2px solid #3468FE;
    padding-left: 10px;
  }

  //:deep(p) {
  //  margin-top: 30px;
  //  font-size: 14px;
  //  font-weight: 400;
  //  color: rgba(255, 255, 255, 0.8);
  //  line-height: 40px;
  //  background-color: rgba(0, 0, 0, 0.3);
  //  padding: 20px 30px;
  //  border-radius: 4px;
  //}
  :deep( table){
    border-collapse: collapse;
  }
  :deep( table td) {
    border: 1px #ffffff7d solid;
    line-height: 1.5;
    min-width: 30px;
    padding: 3px 5px;
    text-align: left;
    border-collapse: collapse;
  }

  :deep(img) {
    width: 100%;
    margin: 30px 0px;
  }

  :deep(ul) {
    padding-left: 50px;

    li {
      list-style-type: disc;
      font-size: 16px;
      font-weight: 400;
      color: #C4C9D3;
      line-height: 27px;
      margin-bottom: 20px;
    }
  }

  :deep(ol) {
    padding-left: 50px;

    li {
      font-size: 16px;
      font-weight: 400;
      color: #C4C9D3;
      line-height: 27px;
      margin-bottom: 20px;
    }
  }
}


</style>
