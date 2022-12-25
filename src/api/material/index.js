import request from '@/utils/request';
const prefix = '/material';

// 获取素材权限列表
export function getUserAuthorize(params) {
  return request({
    url: `/system/materialAuthorizeUser/getUserAuthorize`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params,
  });
}

// 获取素材列表
export function getMaterialList(query) {
  return request({
    url: `${prefix}/material/list`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 获取图片列表
export function getImageList(query) {
  return request({
    url: `${prefix}/pixaby/getImageList`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}
// 获取视频列表
export function getVideoList(query) {
  return request({
    url: `${prefix}/pixaby/getVideoList`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 获取素材详细
export function getMaterialDetail(query) {
  return request({
    url: `${prefix}/material/${query.id}`,
    headers: {
      isToken: true,
    },
    method: 'get',
    // params: query,
  });
}

// 发布素材
export function materialRelease(data) {
  return request({
    url: `${prefix}/material/release`,
    headers: {
      isToken: true,
    },
    method: 'put',
    data,
  });
}

// 获取仓库中的素材(未上架素材)
export function getNotShelves(query) {
  return request({
    url: `${prefix}/material/getNotShelves`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 获取销售中的素材（已上架素材)
export function getShelves(query) {
  return request({
    url: `${prefix}/material/getShelves`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 上架素材
export function putShelves(data) {
  return request({
    url: `${prefix}/material/putShelves/${data.ids}`,
    headers: {
      isToken: true,
    },
    method: 'put',
    // data,
  });
}

// 下架素材
export function offShelves(data) {
  return request({
    url: `${prefix}/material/offShelves/${data.ids}`,
    headers: {
      isToken: true,
    },
    method: 'put',
    // data,
  });
}

// 获取上传签名
export function getUploadSign(data) {
  return request({
    url: `${prefix}/material/createUploadSignAuth`,
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data,
  });
}

// 创建素材上传文件
export function createUploadMaterial(data) {
  return request({
    url: `${prefix}/material/createUploadMaterial`,
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data,
  });
}
// 删除素材封面
export function delMaterialCover(data) {
  return request({
    url: `${prefix}/coverFile/removeCoverFile`,
    headers: {
      isToken: true,
    },
    method: 'delete',
    params: data,
  });
}


// 获取素材主类型
export function getMaterialTypeList(query) {
  return request({
    url: `${prefix}/materialType/list`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 获取主类型的树状
export function getMaterialTypeTreeList(query) {
  return request({
    url: `${prefix}/materialType/treeList`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 加入不感兴趣
export function saveUninterested(data) {
  return request({
    url: `${prefix}/materialUninterested/saveUninterested`,
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data,
  });
}

// 添加播放记录
export function addRecord(data) {
  return request({
    url: `${prefix}/playRecord/addPlayRecord`,
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data,
  });
}

// 获取收藏列表
export function getCollectionList(query) {
  return request({
    url: `${prefix}/materialCollection/list`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 下载素材
export async function downloadMaterial(id) {
  return request({
    url: `${prefix}/materialSaleRecord/downloadMaterial/${id}`,
    headers: {
      isToken: true,
    },
    method: 'get',
  });
}
// 下载免费素材(字体)
export async function downloadFreeMaterial(id) {
  return request({
    url: `${prefix}/material/downloadMaterialFree/${id}`,
    headers: {
      isToken: true,
    },
    method: 'get',
  });
}

// 删除
export function delMaterialList(ids) {
  return request({
    url: `${prefix}/material/${ids}`,
    headers: {
      isToken: true,
    },
    method: 'delete',
    // params: query,
  });
}

// 获取用户的全部类型列表(排序、显示隐藏)
export function getTypeOption(query) {
  return request({
    url: `${prefix}/userTypeOption/list`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}
// 获取用户的全部类型列表
export function getMaterialType(query) {
  return request({
    url: `${prefix}/materialType/getMaterialTypeList`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 修改用户的类型设置
export function updateTypeOption(data) {
  return request({
    url: `${prefix}/userTypeOption`,
    headers: {
      isToken: true,
    },
    method: 'put',
    data,
  });
}
