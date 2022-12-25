import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/system/menu/getRouters',
    method: 'get'
  })
}
//设置工作台菜单
export const setWorkbenchMenu = (data) => {
  return request({
    url: '/system/userConfig/setWorkbenchMenu',
    method: 'PUT',
    headers:{
      isToken:true,
      isLoading:true,
    },
    data
  })
}