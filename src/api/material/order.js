import request from '@/utils/request';
const prefix = '/material';

// 获取订单列表
export function getOrderList(query) {
  return request({
    url: `${prefix}/materialOrder/list`,
    headers: {
      isToken: true,
    },
    method: 'get',
    params: query,
  });
}

// 创建素材订单
export function createMaterialOrder(data) {
  return request({
    url: `${prefix}/materialOrder/createMaterialOrder`,
    headers: {
      isToken: true,
      isLoading: true
    },
    method: 'post',
    data: data,
  });
}

// 取消订单
export function cancelMaterialOrder(data) {
  return request({
    url: `${prefix}/materialOrder/cancelOrder/${data.id}`,
    headers: {
      isToken: true,
    },
    method: 'put',
    // data,
  });
}

// 获取订单详细
export function getOrderDetail(query) {
  return request({
    url: `${prefix}/materialOrder/${query.id}`,
    headers: {
      isToken: true,
    },
    method: 'get',
    // params: query,
  });
}

// 删除订单
export function delOrder(ids) {
  return request({
    url: `${prefix}/materialOrder/${ids}`,
    headers: {
      isToken: true,
      isLoading:true,
    },
    method: 'delete',
    // params: query,
  });
}

// 继续支付
export function continuePayOrder(data) {
  return request({
    url: `${prefix}/materialOrder/continuePayOrder`,
    headers: {
      isToken: true,
    },
    method: 'POST',
    data,
  });
}