import request from '@/utils/request'

// 账号密码登录方法
export function getWxLoginQrCode() {
  return request({
    url: '/auth/wxMpLoginQrCode',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 轮询是否第一次登录
export function wxMpCheckRegister(uuid) {
  return request({
    url: `/auth/wxMpCheckRegister/${uuid}`,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
// 微信登录绑定方法
export function wxLogin(data) {
  return request({
    url: '/auth/wxMpLogin',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 账号密码登录方法
export function login(username, password, code, uuid) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: { username, password, code, uuid }
  })
}
// 手机号登录方法
export function phoneLogin(phone, code, inviteUser , uuid) {
  return request({
    url: '/auth/phoneLogin',
    headers: {
      isToken: false
    },
    method: 'post',
    data: { phone, code, inviteUser , uuid }
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 未登录时修改登录密码
export const changeloginPsw = (data) => {
  return request({
    url: `/system/user/profile/updatePwdByCode`,
    headers: {
      isToken: false
    },
    method: 'put',
    data,
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 发送短信验证码
export function sendSmsVerificationCode(data) {
  return request({
    url: '/auth/sendSmsVerificationCode',
    headers: {
      isToken: false
    },
    method: 'post',
    timeout: 20000,
    data: data
  })
}
// 获取身份证上传签名
export function createUploadSignAuth(data) {
  return request({
    url: '/system/userVerify/createUploadSignAuth',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 创建上传文件
export function createUploadIdCard(data) {
  return request({
    url: '/system/userVerify/createUploadIdCard',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取微信小程序登录二维码
export function getWxRoutineLoginQrCode(params, isToken = false) {
  return request({
    url: '/auth/getWxLoginQrCode',
    headers: {
      isToken
    },
    method: 'get',
    params
  })
}

// 微信小程序-轮询检查是否授权登录
export function checkWxMaRegister(uuid, isToken = false) {
  return request({
    url: '/auth/checkWxMaRegister/' + uuid,
    headers: {
      isToken
    },
    method: 'get',
  })
}
