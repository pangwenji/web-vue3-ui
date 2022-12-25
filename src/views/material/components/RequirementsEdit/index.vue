<template>
  <div class="main-card">
    <div class="box">
      <div class="textarea">
        <!--        <div id="toolbar-container" :style="{width: width+'px'}"></div>-->
        <!--        <div id="editor-container" :contentEditable="false" :style="{height: '150px',width: width+'px'}"></div>-->
        <Toolbar
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            style="width: 100%"
        />
        <Editor
            :defaultConfig="editorConfig"
            v-model="valueHtml"
            style="height: 400px; overflow-y: hidden;width: 100%"
            @onCreated="handleCreated"
            @customPaste="customPaste"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, shallowRef} from 'vue'
import '@wangeditor/editor/dist/css/style.css';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';
import {computed} from "vue";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import axios from "axios";
import {getToken} from '@/utils/auth'

import { createEditor } from '@wangeditor/editor'
import {nextTick, watch} from "vue";

const tabNameColor = ref("#F13E49")
const props = defineProps({
  width: {
    type: Number,
    default: 725
  },
  editHtml: {
    type: String,
    default: ''
  },
})
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('');
const toolbarConfig = {
  excludeKeys: [
    'headerSelect',
    'blockquote',
    'italic',
    '|',
    'group-more-style',
    'codeBlock',
    'todo',
    "insertTable",

    "uploadVideo",
    "insertVideo",
    "editVideoSize",
    "uploadVideo",
    "group-video",//隐藏视频上传
    // "undo",
    // "redo",
    "fullScreen",
    "insertLink"
  ]
};




const store = useStore();
const route = useRoute()
const data = computed(() => {
  return store.state.material?.data
})
const pageType = ref('')
onMounted(() => {
  //页面类型，修改素材或者添加发布素材
  pageType.value = route.query.type
})

const editorConfig = {placeholder: '请输入内容...', MENU_CONF: {}};

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  console.log('props.editHtm0000000000000l',props.editHtml)
  if (props.editHtml && pageType.value === 'change') {
    console.log('props.editHtml',props.editHtml)
    editor.setHtml(props.editHtml)
  }
};

watch(() => props.editHtml, val => {
  const editor = editorRef.value;
  console.log('33333',editorRef.value)
  if (pageType.value === 'change') {
    if (props.editHtml){
      editorRef.value.setHtml(props.editHtml)
    }else {
      editorRef.value.setHtml('')
    }
    console.log('props.editHtml666',editorRef.value)
  }
})

watch(() => data.value, val => {
  const list = data.value
  if (list.length = 0){

    console.log('props.1111111')
  }
})


const customPaste = (editor, event, callback) => {
  callback(true); // 返回 false ，阻止默认粘贴行为
};


const getEditor = () => {
  return editorRef.value;
}
// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

/** 导出编辑器  */
defineExpose({
  getEditor
});
//上传图片配置
editorConfig.MENU_CONF['uploadImage'] = {
  // 用户自定义上传图片
  customUpload(file, insertFn) {
    ElMessage.success({
      message: '正在上传中，请稍后...',
    })
    let formData = new FormData();
    formData.append("file", file);
    let config = {
      method: "post",
      // url: "/dev-api/file/publicFile/upload", //本地测试上传图片地址
      url: "/file/publicFile/upload", //上传图片地址
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + getToken()
      },
      data: formData
    };

    axios(config)
        .then(function (res) {
          let url = res.data.data.url; //拼接成可浏览的图片地址
          insertFn(url, res.data.data.name, url); //插入图片
          ElMessage.success('上传成功')
        })
        .catch(function (error) {
          console.log('error', error);
        });
  },
}
//字体
editorConfig.MENU_CONF['fontFamily'] = {
  fontFamilyList: [
    '黑体',
    '楷体',
    '宋体',
    '仿宋',
    '标楷体',
    '华文仿宋',
    '华文楷体',
    '微软雅黑',
  ]
}
editorConfig.MENU_CONF['fontSize'] = {
  fontSizeList: [
    '12px',
    '16px',
    '20px',
    '24px' ,
    '28px' ,
    '32px' ,
    '40px',
    '48px',
  ]
}

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
