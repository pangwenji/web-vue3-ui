import request from "@/utils/request";
const prefix = "/file";

// 获取文件夹列表
export function getFolderList(query) {
  return request({
    url: `${prefix}/fileSystem/getDirectoryList`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取文件列表
export function getFileList(query) {
  return request({
    url: `${prefix}/fileSystem/getFileList`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取上传签名
export function createUploadSign(data) {
  return request({
    url: `${prefix}/upload/createUploadSign`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 创建上传文件
export function createUploadFile(data) {
  return request({
    url: `${prefix}/upload/createUploadFile`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 创建文件夹
export function createDirectory(data) {
  return request({
    url: `${prefix}/fileSystem/createDirectory`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 获取文件或文件夹详情
export function getDetails(query) {
  return request({
    url: `${prefix}/fileSystem/getDetails`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 删除文件或文件夹
export function deleteFile(query) {
  return request({
    url: `${prefix}/fileSystem/deleteObject`,
    headers: {
      isToken: true,
    },
    method: "delete",
    params: query,
  });
}

// 获取分类文件列表
export function getTypeList(query) {
  return request({
    url: `${prefix}/fileSystem/getTypeList`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取回收站文件列表
export function getRecycleList(query) {
  return request({
    url: `${prefix}/fileSystem/getRecycleList`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 恢复回收站文件
export function recoverFile(data) {
  return request({
    url: `${prefix}/fileSystem/recoverFile`,
    headers: {
        isToken: true
    },
    method: 'put',
    data
  })
}

// 彻底删除回收站文件
export function thoroughDeleteFile(query) {
  return request({
    url: `${prefix}/fileSystem/thoroughDeleteFile`,
    headers: {
      isToken: true,
    },
    method: "delete",
    params: query,
  });
}

// 清空回收站
export function emptyRecycle(query) {
  return request({
    url: `${prefix}/fileSystem/emptyRecycle`,
    headers: {
      isToken: true,
    },
    method: "delete",
    params: query,
  });
}

// 复制文件或文件夹
export function fileOrFolderCopy(data) {
  return request({
    url: `${prefix}/fileSystem/copyTo`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 移动文件或文件夹
export function fileOrFolderMove(data) {
  return request({
    url: `${prefix}/fileSystem/move`,
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
    url: `${prefix}/fileSystem/newWpsFile`,
    headers: {
      isToken: true,
    },
    method: "post",
    data
  });
}

// 获取WPS编辑页面URL
export function editWpsFile(data) {
  return request({
    url: `${prefix}/fileSystem/editWpsFile`,
    headers: {
        isToken: true
    },
    method: 'put',
    data
  })
}
// 查询网盘信息
export function getMyFileUserInfo(params) {
  return request({
    url: `${prefix}/fileUserInfo/getMyFileUserInfo`,
    headers: {
        isToken: true
    },
    method: 'get',
    params
  })
}

// 重命名文件或文件夹
export function rename(data) {
  return request({
    url: `${prefix}/fileSystem/rename`,
    headers: {
        isToken: true
    },
    method: 'put',
    data
  })
}

// 批量创建文件夹
export function batchCreateDirectory(data) {
  return request({
    url: `${prefix}/fileSystem/batchCreateDirectory`,
    headers: {
      isToken: true,
    },
    method: "post",
    data
  });
}

// 获取下载地址
export function getFileDownloadUrl(data) {
  return request({
    url: `${prefix}/fileSystem/getPersonalFileDownloadUrl`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}