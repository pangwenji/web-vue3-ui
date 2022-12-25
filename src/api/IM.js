import request from '@/utils/request'

// 获取IM登录账号token
export const getImAccount = ()=>{
    return request({
        url:'/base/netEaseIm/createToken',
        method: 'GET',
        headers: {
            isToken: true
        }
    })
}
// 通过IM账号获取用户ID
export const getInfoByAccountId = (params)=>{
    return request({
        url:'/base/msgImAccount/getInfoByAccountId',
        method: 'GET',
        headers: {
            isToken: true
        },
        params
    })
}

// 获取联系人列表
export const getImAccountGroup = ()=>{
    return request({
        url:'/base/msgImContact/getImAccountGroup',
        method: 'GET',
        headers: {
            isToken: true
        }
    })
}
// 获取联系人列表
export const getImAccountGroupNew = ()=>{
    return request({
        url:'/base/msgImContact/getImAccountGroupNew',
        method: 'GET',
        headers: {
            isToken: true
        }
    })
}
// 新建联系人分组
export const createGroup = (data)=>{
    return request({
        url:'/base/msgImGroup',
        method: 'POST',
        headers: {
            isToken: true
        },
        data
    })
}
// 获取分组
export const getGroupList = ()=>{
    return request({
        url:'/base/msgImGroup/getList',
        method: 'GET',
        headers: {
            isToken: true,
            isLoading:true,
        },
    })
}
// 修改联系人分组
export const updateGroup = (data)=>{
    return request({
        url:'/base/msgImGroup',
        method: 'PUT',
        headers: {
            isToken: true
        },
        data
    })
}
// 删除联系人分组
export const deleteGroup = (data)=>{
    return request({
        url:`/base/msgImGroup/${data.id}`,
        method: 'DELETE',
        headers: {
            isToken: true
        },
        data
    })
}
// 获取搜索联系人
export const getSearchAccount = (params)=>{
    return request({
        url:'/base/netEaseIm/getImAccount',
        method: 'GET',
        headers: {
            isToken: true
        },
        params
    })
}
// 添加联系人
export const insertImContact = (data)=>{
    return request({
        url:`/base//msgImContact`,
        method: 'POST',
        headers: {
            isToken: true
        },
        data
    })
}
// 修改联系人信息
export const uploadImContact = (data)=>{
    return request({
        url:`/base/msgImContact`,
        method: 'PUT',
        headers: {
            isToken: true
        },
        data
    })
}
// 删除联系人信息
export const deleteImContact = (params)=>{
    return request({
        url:`/base/msgImContact/${params.userId}`,
        method: 'DELETE',
        headers: {
            isToken: true
        }
    })
}
// 保存群邀请
export const saveTeamInvite = (data)=>{
    return request({
        url:`/base/imTeamInvite`,
        method: 'POST',
        headers: {
            isToken: true
        },
        data,
    })
}
// 获取群通知列表
export const getTeamInvite = (params)=>{
    return request({
        url:`/base/imTeamInvite/getList`,
        method: 'GET',
        headers: {
            isToken: true
        },
        params,
    })
}
// 修改状态
export const getUploadInvite = (data)=>{
    return request({
        url:`/base/imTeamInvite`,
        method: 'PUT',
        headers: {
            isToken: true
        },
        data,
    })
}
// 群头像
export const getUpdateTeamPortrait = (data)=>{
    return request({
        url:`/base/netEaseIm/updateTeamPortrait`,
        method: 'POST',
        headers: {
            isToken: true
        },
        data,
    })
}
// 获取@我的通知
export const getNoticeList = (params)=>{
    return request({
        url:`/base/msgImNotice/getNoticeList`,
        method: 'GET',
        headers: {
            isToken: true
        },
        params,
    })
}
// 通过用户ID获取IM账户
export const getUserImAccount = (params)=>{
    return request({
        url:`/base/msgImAccount/${params.userId}`,
        method: 'GET',
        headers: {
            isToken: true,
            isLoading: true,
        },
    })
}

/**
 * 好友申请
 * 
*/
// 好友申请提交
export const submitFriendApply = (data)=>{
    return request({
        url:`/base/msgImFriendApply`,
        method: 'POST',
        headers: {
            isToken: true
        },
        data
    })
}
// 好友申请操作处理
export const updateFriendApply = (data)=>{
    return request({
        url:`/base/msgImFriendApply`,
        method: 'PUT',
        headers: {
            isToken: true
        },
        data
    })
}
// 获取好友列表
export const getFriendApplyList = ()=>{
    return request({
        url:`/base/msgImFriendApply/list`,
        method: 'GET',
        headers: {
            isToken: true
        }
    })
}
// 获取好友列表
export const getContactInfo = (params)=>{
    return request({
        url:`/base/msgImContact/getContactInfo`,
        method: 'GET',
        headers: {
            isToken: true
        },
        params
    })
}