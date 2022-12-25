import request from '@/utils/request'
const prefix = '/system';

// 查询网盘信息
export const getFileUserInfo = (data) => {
  return request({
    url: `/file/fileUserInfo/getMyFileUserInfo`,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 查询审阅项目信息
export const getFileApproveInfo = () => {
  return request({
    url: `/project/project/getProjectInfoList`,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 查询(分页）容量明细
export const getUsingResource = (query) => {
  return request({
    url: `/file/fileUserResource/getUsingResourcePage`,
    headers: {
      isToken: true
    },
    method: 'get',
    params: query,
  })
}
// 查询(分页）审阅项目信息
export const getProjectInfoListPage = (query) => {
  return request({
    url: `/project/project/getProjectInfoListPage`,
    headers: {
      isToken: true
    },
    method: 'get',
    params: query,
  })
}
// 创建新购买容量订单
export const newResource = (data) => {
  return request({
    url: `/file/fileUserResource/newResource`,
    headers: {
      isToken: true
    },
    method: 'POST',
    data,
  })
}

// 创建续费订单
export const renewalResource = (data) => {
  return request({
    url: `/file/fileUserResource/renewalResource`,
    headers: {
      isToken: true
    },
    method: 'POST',
    data,
  })
}
