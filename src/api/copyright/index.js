import request from "@/utils/request";
const prefix = "/base";

// 创建订单
export function copyrightOrder(data) {
  return request({
    url: `${prefix}/copyrightOrder`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 获取存证列表
export function copyrightList(query) {
  return request({
    url: `${prefix}/copyright/list`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取版权详情
export function copyrightDetails(id) {
  return request({
    url: `${prefix}/copyright/${id}`,
    headers: {
      isToken: true,
    },
    method: "get",
  });
}

// 更新存证简介
export function updateIntro(data) {
  return request({
    url: `${prefix}/copyright/updateIntro`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}

// 删除存证
export function copyrightDelete(id) {
  return request({
    url: `${prefix}/copyright/${id}`,
    headers: {
      isToken: true,
    },
    method: "delete",
  });
}

// 获取当前用户草稿存证信息
export function copyrightDraft(query) {
  return request({
    url: `${prefix}/copyright/draft`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 查询存证文件列表
export function copyrightFileList(query) {
  return request({
    url: `${prefix}/copyrightFile/list`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 删除存证文件
export function copyrightFileDelete(id) {
  return request({
    url: `${prefix}/copyrightFile/${id}`,
    headers: {
      isToken: true,
    },
    method: "delete",
  });
}

// 是否免费
export function copyrightOrderPay(query) {
  return request({
    url: `${prefix}/copyrightOrder/pay`,
    headers: {
      isToken: true,
    },
    method: "get",
    params: query,
  });
}

// 获取文件下载
export function getCertificateFile(fileId, type) {
  return request({
    url: `${prefix}/copyrightFile/getCertificateFile/${fileId}/${type}`,
    headers: {
      isToken: true,
    },
    method: "get",
  });
}

// 获取播放文件信息
export function getCopyrightFile(id) {
  return request({
    url: `${prefix}/copyrightFile/playFile/${id}`,
    headers: {
      isToken: true,
    },
    method: "get",
  });
}
