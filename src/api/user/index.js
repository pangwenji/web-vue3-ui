import request from '@/utils/request'
const prefix = '/system';


// 实名认证
export const realVerify = (data) => {
  return request({
    url: `${prefix}/userVerify/realVerify`,
    headers: {
      isToken: true
    },
    method: 'post',
    data: data,
  })
}

// 获取验证码
export const getPhoneCode = (data) => {
  return request({
    url: `/auth/sendSmsVerificationCode`,
    headers: {
      isToken: true
    },
    method: 'post',
    timeout: 20000,
    data: data,
  })
}
// 获取修改支付密码验证码
export const getPayPhoneCode = (data) => {
  return request({
    url: `/pay/payAccount/sendSmsVerificationCode`,
    headers: {
      isToken: true
    },
    method: 'post',
    timeout: 20000,
    data: data,
  })
}
// 获取微信登录二维码
export const getWeChatCode = () => {
  return request({
    url: `/auth/getWxLoginQrCode`,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 添加银行卡
export const addBankCard = (data) => {
  return request({
    url: `/pay/bankCard/addBankCard`,
    headers: {
      isToken: true
    },
    method: 'post',
    timeout: 20000,
    data: data,
  })
}

// 获取银行卡信息
export const getBankCard = (query) => {
  return request({
    url: `/pay/bankCard/getBankCard`,
    headers: {
      isToken: true,
      isLoading:true,
    },
    method: 'get',
    params: query,
  })
}

// 获取会员信息
export const getMemberInfo= () => {
  return request({
    url: `/system/member/getInfo`,
    headers: {
      isToken: true
    },
  })
}
// 获取用户信息
export const getUserInfo= () => {
  return request({
    url: `/system/user/getInfo`,
    headers: {
      isToken: true
    },
  })
}

// 修改银行卡
export const changeBankCard = (data) => {
  return request({
    url: `/pay/bankCard/updateBankCard`,
    headers: {
      isToken: true
    },
    method: 'put',
    data,
  })
}

// 修改登录密码
export const changeUserPsw = (data) => {
  return request({
    url: `${prefix}/user/profile/updatePwdByCode`,
    headers: {
      isToken: true
    },
    method: 'put',
    data,
  })
}

// 修改用户信息
export const changeUserInfo = (data) => {
  return request({
    url: `/system/user/profile`,
    headers: {
      isToken: true
    },
    method: 'put',
    data,
  })
}
// 上传头像
export function monoFile(data) {
  return request({
    url: `/file/publicFile/upload`,
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data,
  });
}
// 修改支付密码
export const changePayPsw = (data) => {
  return request({
    url: `/pay/payAccount/updatePayPassword`,
    headers: {
      isToken: true
    },
    method: 'put',
    data,
  })
}

/**
 * 获取工作台工种认证信息
 * GET /home/getWorkbenchWorkerInfo
 * 接口ID：32514280
 * @param query
 * @returns {*}
 */
export const workbenchWorkerInfo = (query) => {
  return request({
    url: `${prefix}/home/getWorkbenchWorkerInfo`,
    headers: {
      isToken: true
    },
    method: 'get',
    params: query,
  })
}

// 获取购买会员订单列表
export const getMemberList = (query) => {
  return request({
    url: `/pay/payAccountOrder/getMemberOrderList`,
    headers: {
      isToken: true
    },
    method: 'get',
    params: query,
  })
}

// 申请开票
export const applyInvoice = (data) => {
  return request({
    url: `/pay/payInvoiceOrder/apply`,
    headers: {
      isToken: true
    },
    method: 'POST',
    data,
  })
}
// 查询开票信息
export function invoiceData(query) {
  return request({
    url: '/pay/payInvoiceOrder/info',
    method: 'get',
    params: query
  })
}

// 获取粉丝、关注者数量
export const getFansNum = (query) => {
  return request({
    url: `/worker/api/collect/a/count`,
    headers: {
      isToken: true
    },
    method: 'get',
    params: query
  })
}
