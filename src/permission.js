import router from './router'
import store from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/sharePage', '/file','/invitePage', '/collectPage' ,'/fileSharePage' ,  '/help/guide', '/clouddisk/detail'];
const noRedirects = ['/sharePage','/invitePage','/collectPage']
//token过期时无需提示回话过期
const noHint = ['/help/guide']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          isRelogin.show = false
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            if(to.meta.needAuth){ //需要认证工种和实名
              if(store.state.user.workNum > 0 && store.state.user.verified){
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              }else{
                next({ path: '/workspace/admin/attestation' }) // hack方法 确保addRoutes已完成
              }
            }else{
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            }
          })
        }).catch(err => {
          store.dispatch('LogOut').then(() => {
            if(noHint.indexOf(to.path) === -1){
              ElMessage.error(err)
            }
            if(whiteList.indexOf(to.path) !== -1||to.path.indexOf("toolDesktop")!==-1){
              isRelogin.show = false;
              next()
            }else{
              next({ path: '/' })
            }
          })
        })
      } else {
        if(to.meta.needAuth){ //需要认证工种和实名
          if(store.state.user.workNum > 0 && store.state.user.verified){
            next();
          }else{
            next({ path: '/workspace/admin/attestation' });
          }
        }else{
          next();
        }
      }
    }
  } else {
    // 没有token
    if (to.path.indexOf('/help/') !== -1 || to.path.indexOf('/clouddisk/detail/') !== -1 || to.meta.noLogin){//帮助中心‘/help/'跳过登录验证
      next()
    }else {
      if (whiteList.indexOf(to.path) !== -1||to.path.indexOf("toolDesktop")!==-1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
