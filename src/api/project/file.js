import request from '@/utils/request'
const prefix = "/project"

// 获取上传签名
export function getUploadSign(data) {
  return request({
      url: `${prefix}/projectFile/createUploadSign`,
      headers: {
          isToken: true
      },
      method: 'post',
      data: data
  })
}

// 创建上传文件
export function createUploadFile(data) {
  return request({
      url: `${prefix}/projectFile/createUploadFile`,
      headers: {
          isToken: true
      },
      method: 'post',
      data: data
  })
}

// 获取文件版本列表
export function getFileVersionList(query) {
    return request({
        url: `${prefix}/projectFile/getFileVersionList`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 修改版本排序
export function updateFileVersionOrder(data) {
    return request({
        url: `${prefix}/projectFile/updateVersionOrder`,
        headers: {
            isToken: true
        },
        method: 'put',
        data
    })
}

// 解除文件版本
export function removeVersion(query) {
    return request({
        url: `${prefix}/projectFile/removeFileVersion`,
        headers: {
            isToken: true
        },
        method: 'put',
        params: query
    })
}

// 删除文件或文件夹
export function deleteFileOrFolder(query) {
    return request({
        url: `${prefix}/projectFile/deleteFile`,
        headers: {
            isToken: true
        },
        method: 'delete',
        params: query
    })
}

// 重命名文件或文件夹
export function renameFileOrFolder(data) {
    return request({
        url: `${prefix}/projectFile/renameFileObject`,
        headers: {
            isToken: true
        },
        method: 'put',
        data
    })
}

// 设置文件评审状态
export function setReviewStatus(data) {
    return request({
        url: `${prefix}/projectFile/setFileReviewStatus`,
        headers: {
            isToken: true
        },
        method: 'put',
        data
    })
}
// 获取WPS新建页面URL
export function createWpsFile(data) {
    return request({
        url: `${prefix}/projectFileSystem/createWpsFile`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data
    })
}