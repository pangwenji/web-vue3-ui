import request from '@/utils/request'

// 获取上传签名
export function createUploadSign(data) {
  return request({
    url: `/file/publicUpload/createUploadSign`,
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
    url: `/file/publicUpload/createUploadFile`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}
