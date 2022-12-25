import request from '@/utils/request'
const prefix = "/project"

// 创建分享
export function createShare(data) {
  return request({
      url: `${prefix}/share/createShare`,
      headers: {
          isToken: true
      },
      method: 'post',
      data: data
  })
}

// 修改我的分享
export function updateShare(data) {
  return request({
      url: `${prefix}/share/updateProjectShare`,
      headers: {
          isToken: true
      },
      method: 'put',
      data
  })
}
// 通过token获取原始分享信息
export function getFileShareSourceInfo(params) {
  return request({
      url: `${prefix}/share/getFileShareSourceInfo`,
      headers: {
          isToken: true,
          isLoading:true,
      },
      method: 'GET',
      params
  })
}

// 获取分享WPS预览页面URL
export function previewShareWpsFile(params) {
    return request({
        url: `${prefix}/shareFile/previewWpsFile`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

// 分享获取评论列表
export function getShareComment(params) {
    return request({
        url: `${prefix}/shareFile/getCommentList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

// 分享发表评论
export function sharePostComment(data) {
    return request({
        url: `${prefix}/shareFile/postComment`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}

// 分享获取文件版本列表
export function getShareVersionList(params) {
    return request({
        url: `${prefix}/shareFile/getFileVersionList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

// 获取下载地址
export function getShareFileDownloadUrl(data) {
    return request({
        url: `${prefix}/shareFile/getFileDownloadUrl`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}

// 通过会话token获取原始分享信息
export function getFileShareBySessionToken(params) {
    return request({
        url: `${prefix}/share/getFileShareBySessionToken`,
        headers: {
            isToken: true,
            isLoading:true,
        },
        method: 'GET',
        params
    })
  }
