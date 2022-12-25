import request from '@/utils/request';
const prefix = '/material';

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

// 加入收藏
export function addCollection(data) {
  return request({
    url: `${prefix}/materialCollection/${data.materialId}`,
    headers: {
      isToken: true,
    },
    method: 'post',
    // data: data,
  });
}

// 删除收藏
export function deleteCollection(query) {
  return request({
    url: `${prefix}/materialCollection/${query.id}`,
    headers: {
      isToken: true,
    },
    method: "delete",
    // params: query,
  });
}