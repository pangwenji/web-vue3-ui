import request from "@/utils/request";
const prefix = "/file";

// 创建分享
export function createShare(data) {
  return request({
    url: `${prefix}/fileShare/createShare`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 通过token获取分享信息
export function getFileShareInfo(query) {
  return request({
    url: `${prefix}/fileShare/getFileShareInfo`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 验证分享密码
export function verifyFileSharePassword(data) {
  return request({
    url: `${prefix}/fileShare/verifyFileSharePassword`,
    headers: {
      isToken: true,
    },
    method: "put",
    data,
  });
}

// 获取分享的文件列表
export function getShareFileList(query) {
  return request({
    url: `${prefix}/shareFile/getShareFileList`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取文件或文件夹详情
export function getFileOrFolderDetails(query) {
  return request({
    url: `${prefix}/shareFile/getDetails`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 转存
export function shareSaveTo(data) {
  return request({
    url: `${prefix}/shareFile/saveTo`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 我的分享列表
export function myShareList(query) {
  return request({
    url: `${prefix}/fileShare/myList`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 修改我的分享
export function updateProjectShare(data) {
  return request({
    url: `${prefix}/fileShare/updateProjectShare`,
    headers: {
      isToken: true,
    },
    method: "put",
    data,
  });
}

// 删除我的分享
export function deleteProjectShare(query) {
  return request({
    url: `${prefix}/fileShare/deleteProjectShare`,
    headers: {
      isToken: true,
    },
    method: "delete",
    params: query,
  });
}

// 获取我的分享详情
export function getShareDetails(query) {
  return request({
    url: `${prefix}/fileShare/getDetails`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取WPS预览页面URL
export function getPreviewWpsFile(query) {
  return request({
    url: `${prefix}/shareFile/previewWpsFile`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取下载地址
export function getShareFileDownloadUrl(data) {
  return request({
    url: `${prefix}/shareFile/getFileDownloadUrl`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}