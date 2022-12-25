import request from '@/utils/request'
const prefix = '/auth';

// 获取绑定微信列表
export const getWeChatBindingList = (params) => {
  return request({
    url: `${prefix}/wxOpenid/list`,
    headers: {
      isToken: true
    },
    method: 'get',
    params
  })
}

// 删除微信绑定
export function deleteWeChatBinding(id) {
  return request({
    url: `${prefix}/wxOpenid/${id}`,
    headers: {
      isToken: true,
    },
    method: "delete",
  });
}
