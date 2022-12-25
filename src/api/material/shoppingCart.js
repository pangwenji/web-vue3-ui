import request from '@/utils/request';
const prefix = '/material';

// 获取购物车列表
export function getShoppingCartList(query) {
  return request({
    url: `${prefix}/materialShoppingCart/list`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 删除购物车
export function delShoppingCart(query) {
  return request({
    url: `${prefix}//materialShoppingCart/${query.ids}`,
    headers: {
      isToken: true,
    },
    method: "delete",
  });
}

// 添加到购物车
export function addShoppingCart(data) {
  return request({
    url: `${prefix}/materialShoppingCart/${data.materialId}`,
    headers: {
        isToken: true
    },
    method: 'post',
    // data: data,
  })
}