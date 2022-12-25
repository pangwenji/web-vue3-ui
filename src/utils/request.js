import axios from 'axios'
import cache from '@/plugins/cache'
import store from '@/store'
import router from '@/router'
import errorCode from '@/utils/errorCode'
import { getToken } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import { saveAs } from 'file-saver'
import { unMounted } from '@/plugins/sessionBox'
import { openLogin } from '@/plugins/loginDialog'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import spaceNotEnough from '@/plugins/spaceNotEnough'
import * as Authentication from '@/plugins/Authentication'
import {useRoute} from "vue-router";
const route = useRoute()

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['Client-Type'] = 'Web'
axios.defaults.headers['Client-Version'] = 'latest'

let requestLoading = null;


// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  //是否需要全局加载
  const isLoading = (config.headers || {}).isLoading;
  if (isLoading) {
    requestLoading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.1)',
    })
  }
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                // 请求地址
      const s_data = sessionObj.data;              // 请求数据
      const s_time = sessionObj.time;              // 请求时间
      const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        console.log(requestObj.url)
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        // return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  requestLoading && requestLoading.close();
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  requestLoading && requestLoading.close();
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }
  if (code === 401) {
    unMounted();
    if (!isRelogin.show) {
      isRelogin.show = true;
      if (getToken()) {
        ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          customClass: 'messageBox-custom-warning',
          confirmButtonText: '重新登录',
          cancelButtonText: '退出登录',
          type: 'warning',
          showClose: true,
          center: true,
        }).then(() => {
          isRelogin.show = false;
          store.dispatch('LogOut').then(() => {
            openLogin({
              onSuccess: () => {
                location.reload()
              }
            });
          })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            isRelogin.show = false;
            router.push({ path: '/login' })
          })
        });
      } else {
        openLogin({
          onSuccess: () => {
            location.reload()
          }
        });
      }
    } else {
      // ElMessage({
      //   message: '无效的会话，或者会话已过期，请重新登录。',
      //   type: 'error'
      // })
    }
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  } else if (code === 500) {
    ElMessage({
      message: msg,
      type: 'error'
    })
    return Promise.reject(new Error(msg))
  } else if (code === 50100) {//网盘空间不足打开弹窗
    spaceNotEnough.openSpaceNotEnough()
  } else if (code === 50404){//文件不存在
    //获取路由参数,route.query取不到
    let href = window.location.href
    let query = href.substring(href.indexOf('?')+1);
    let vars = query.split("&");
    let obj = {}
    for (var i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      obj[pair[0]] = pair[1]
    }
    //跳转回项目根目录
    if (obj.projectId){
      router.push({path:`/project/index/${obj.projectId}/file`});
      ElMessage({ message: `您访问的文件已被删除，已为您返回项目根目录`, type: 'info' })
    }else if(obj.parent){
      router.push({query: {}});
      ElMessage({ message: `您访问的文件已被删除，已为您返回项目根目录`, type: 'info' })
    }
    return Promise.resolve()
  } else if (code === 60404){//项目不存在
    router.push({path:`/project`});
    ElMessage({ message: `您访问的项目不存在，已为您返回项目模块`, type: 'info' })
    return Promise.resolve()
  } else if (code !== 200) {
    if (code == 1011) {
      Authentication.open();
    }
    if (code != 1015 && code != 1020) {
      ElMessage({
        message: msg,
        type: 'error'
      })
    }
    return Promise.reject(res)
  } else {
    return Promise.resolve(res.data)
  }
},
  error => {
    console.log('err' + error)
    requestLoading && requestLoading.close();
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename, options) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.width = 0;
    iframe.height = 0;
    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.top = '-100px';
    iframe.style.pointerEvents = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 3000);

    resolve();
  })
}

export function downloadMulti(requestData, limit = 100, isLoading = true) {

  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(requestData)) { throw new Error('requestData不是一个数组') }
      if (requestData.length > limit) {
        ElMessage.error('选择文件数不能超过 ' + limit);
        return Promise.reject('选择文件数不能超过 ' + limit);
        // throw new Error('选择文件数不能超过 ' + limit)
      }
      if (isLoading) {
        downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
      }
      for (const item of requestData) {
        await download(item.url, item.url, item.fileName)
      }
      downloadLoadingInstance && downloadLoadingInstance.close()
      return Promise.resolve()
    } catch (errMsg) {
      downloadLoadingInstance && downloadLoadingInstance.close()
      ElMessage.error(errMsg);
      reject(errMsg)
    }
  })
}


export function downloadBold({ url, options, params }) {
  if (options && options.isLoading) {
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  }
  return service({
    url,
    method: 'get',
    responseType: 'blob',
    params
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    const filename = options.filename || '文件'
    if (isLogin) {
      const blob = new Blob([data], { type: data.type })
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    if (options && options.isLoading) {
      downloadLoadingInstance.close();
    }
  }).catch((err) => {
    console.log(err)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    if (options && options.isLoading) {
      downloadLoadingInstance.close();
    }
  })
}


export default service
