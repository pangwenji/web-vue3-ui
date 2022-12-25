import request from '@/utils/request'
const prefix = '/system'

// 获取用户代理信息
export const myPromoteInfo = () => {
    return request({
        url: `${prefix}/proxy/info`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}

// 获取拉新记录列表
export const myPromoteList = (query) => {
    return request({
        url: `${prefix}/shareRecord/list`,
        headers: {
            isLoading: true,
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 获取账户管理列表
export const getInviteCodeList = (query) => {
    return request({
        url: `${prefix}/proxy/userProxyVipList`,
        headers: {
            isLoading: true,
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 获取邀请链接列表
export const getInviteLinkList = (query) => {
    return request({
        url: `${prefix}/proxyShareUrl/list`,
        headers: {
            isLoading: true,
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 获取充值列表
export const getRechargeList = (query) => {
    return request({
        url: `${prefix}/memberRecord/proxyVipRechargeList`,
        headers: {
            isLoading: true,
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 添加邀请链接
export const insertLink = (data) => {
    return request({
        url: `${prefix}/proxyShareUrl`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data,
    })
}

// 删除邀请链接
export function delShareLink(id) {
    return request({
        url: `${prefix}/proxyShareUrl/${id}`,
        headers: {
            isToken: true,
        },
        method: 'delete'
    })
}

// 根据手机查询用户会员信息
export const checkVipPhone = (phone) => {
    return request({
        url: `${prefix}/proxy/invite/record/userVipInfo/${phone}`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}

// 激活用户会员
export const activeVip = (data) => {
    return request({
        url: `${prefix}/proxy/invite/record/activate/${data.phone}`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data,
    })
}

// 查询邀请码枚举
export const getInviteCodes = (params) => {
    return request({
        url: `${prefix}/proxyShareUrl/userShareInviteCode`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}

// 查询邀请链接名称
export const getInviteTitle = (params) => {
    return request({
        url: `${prefix}/proxyShareUrl/userShareInviteTitle`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}