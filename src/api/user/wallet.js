import request from '@/utils/request';
const prefix = '/material';

/**
 * 提交提现申请
 * @param data
 * @returns {*}
 */
export const withdrawRecord = (data) => {
  return request({
    url: `/pay/withdrawRecord`,
    headers: {
      isToken: true
    },
    method: 'post',
    timeout: 20000,
    data: data,
  })
}
/**
 * 获取提现记录
 * @param data
 * @returns {*}
 */
export function getWithdrawRecordList(query) {
  return request({
    url: '/pay/withdrawRecord/list',
    method: 'get',
    params: query
  })
}

/**
 * 取消提现申请
 * @param data
 * @returns {*}
 */
export const cancelWithdraw = (data) => {
  return request({
    url: `/pay/withdrawRecord/cancelWithdraw`,
    headers: {
      isToken: true
    },
    method: 'put',
    data,
  })
}

/**
 *
 * @param tableId
 * @returns {*}
 */
export function delWithdraw(id) {
  return request({
    url: '/pay/withdrawRecord/' + id,
    method: 'delete'
  })
}

//托管列表判断订单是否能跳转
export function verifyJump(query) {
  return request({
    url: '/worker/api/order/a/verifyJump',
    method: 'get',
    params: query
  })
}
