import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import { Buffer } from "buffer";
window.Buffer = Buffer;
// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'//下载
import pay from './plugins/pay' //支付、充值
import ViewFile from './plugins/ViewFile' //查看文件
import CloudFile from './plugins/CloudFile' //从云盘选择文件
import Authentication from './plugins/Authentication' //认证
import sessionBox from './plugins/sessionBox' //查看文件
import contextmenu from './plugins/contextmenu' //右键菜单
import loginDialog from './plugins/loginDialog' //登录弹窗
import spaceNotEnough from './plugins/spaceNotEnough' //空间不足弹窗
import device from 'current-device'
// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel } from '@/utils/ruoyi'

if (!device.desktop()) {
  //如果是移动端访问则跳转到移动端显示页面
  window.location.href = '/h5/'
}

// 分页组件
import Pagination from '@/components/Pagination'
// 头像列表组件
import AvatarList from '@/components/AvatarList'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 拖拽显示组件
import DragUpload from '@/components/DragUpload'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 标记
import Point from '@/components/Point'
// 标记
import Empty from '@/components/Empty'

const app = createApp(App)

app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel


// 全局组件挂载
app.component('Point', Point)
app.component('Empty', Empty)
app.component('DictTag', DictTag)
app.component('DragUpload', DragUpload)
app.component('Pagination', Pagination)
app.component('AvatarList', AvatarList)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)

app.use(pay)
app.use(store)
app.use(router)
app.use(plugins)
app.use(ViewFile)
app.use(CloudFile)
app.use(sessionBox)
app.use(contextmenu)
app.use(loginDialog)
app.use(elementIcons)
app.use(Authentication)
app.use(spaceNotEnough)
app.component('svg-icon', SvgIcon)

directive(app)


// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

app.mount('#app')
