import request from '@/utils/request'
import {downloadBold} from '@/utils/request'
const prefix = "/pay"

// 充值二维码
export function payServiceUrl(params) {
    return request({
        url: `${prefix}/payService/recharge`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
// 支付订单
export function payMentOrder(data) {
    return request({
        url: `${prefix}/payService/paymentOrder`,
        headers: {
            isToken: true,
        },
        method: "POST",
        data,
    });
}
// 支付订单
export function payOrder(data) {
  return request({
    url: `${prefix}/payService/paymentOrder`,
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data,
  });
}


// 开会员
export function openMember() {
    return request({
        url: `${prefix}/payService/openMember`,
        headers: {
            isToken: true,
        },
        method: 'post',
        // data: data,
    });
}

/**
 * 获取收支列表
 * @param params
 * @returns {*}
 */
export function payBillList(params) {
    return request({
        url: `${prefix}/payBill/list`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
/**
 * 导出收支记录
 * @param params
 * @returns {*}
 */
export function payBillExport(params) {
    return downloadBold({
        url: `${prefix}/payBill/export`,
        options: {
            isLoading: true,
            filename:'交易记录'
        },
        params,
    });
}
/**
 * 获取冻结记录列表
 * @param params
 * @returns {*}
 */
export function frozenRecordList(params) {
    return request({
        url: `${prefix}/frozenRecord/getList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
/**
 * 获取保证金记录列表
 * @param params
 * @returns {*}
 */
export function pledgeMoneyRecordList(params) {
    return request({
        url: `${prefix}/pledgeMoneyRecord/getList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
/**
 * 获取充值记录
 * @param params
 * @returns {*}
 */
export function rechargeOrderList(params) {
    return request({
        url: `${prefix}/rechargeOrder/getList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
/**
 * 获取会员开通记录
 * @param params
 * @returns {*}
 */
export function getMemberOrderList(params) {
    return request({
        url: `${prefix}/memberOrder/getList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}

/**
 * 获取冻结金额详情列表
 * 接口ID：32317385
 * @param params
 * @returns {*}
 */
export function frozenList(params) {
    return request({
        url: `${prefix}/payBill/getFrozenList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}

/**
 * 获取支付账户信息
 * GET /payAccount/getInfo
 * 接口ID：28293972
 * @param params
 * @returns {*}
 */
export function payAccountGetInfo(params) {
    return request({
        url: `${prefix}/payAccount/getInfo`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}


/**
 * 充值余额退款
 * POST /payService/rechargeRefund
 * 接口ID：32472629
 * @returns {*}
 */
export function rechargeRefund(data) {
    return request({
        url: `${prefix}/payService/rechargeRefund`,
        headers: {
            isToken: true,
        },
        method: 'post',
        data,
    });
}


/**
 * 提现
 * @param data
 * @returns {*}
 */
export const applyWithdraw = (data) => {
    return request({
        url: `/pay/payAccount/applyWithdraw`,
        headers: {
            isToken: true
        },
        method: 'post',
        timeout: 20000,
        data: data,
    })
}
//保证金退款
export function pledgeRefund(data) {
    return request({
        url: `${prefix}/payService/pledgeRefund`,
        headers: {
            isToken: true,
        },
        method: 'post',
        data,
    });
}
