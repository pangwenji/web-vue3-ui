import request from '@/utils/request'
const prefix = "/project"
// 创建我的项目
export function addProject(data) {
    return request({
        url: `${prefix}/myProject/add`,
        headers: {
            isToken: true,
            isLoading:true
        },
        data,
        method: 'post'
    })
}
// 获取项目列表
export function getProjects() {
    return request({
        url: `${prefix}/myProject/list`,
        headers: {
            isToken: true
        },
        method: 'get'
    })
}

// 获取项目详情
export function getProjectDetails(query) {
    return request({
        url: `${prefix}/project/getProjectDetails`,
        headers: {
            isToken: true,
            // isLoading:true
        },
        method: 'get',
        params: query
    })
}

// 获取文件列表
export function getFileList(query) {
    return request({
        url: `${prefix}/projectFile/getFileList`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 获取文件或目录详情
export function getFileDetails(query) {
    return request({
        url: `${prefix}/projectFile/getDetails`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 修改项目信息
export function updateMyProject(data) {
    return request({
        url: `${prefix}/project/updateMyProject`,
        headers: {
            isToken: true,
            isLoading:true
        },
        method: 'put',
        data: data
    })
}

// 我的项目的排序设置
export function updateMyProjectOrder(data) {
    return request({
        url: `${prefix}/order/updateMyProjectOrder`,
        headers: {
            isToken: true
        },
        method: 'put',
        data: data
    })
}
// 参与项目的排序设置
export function updateJoinProjectOrder(data) {
    return request({
        url: `${prefix}/order/updateJoinProjectOrder`,
        headers: {
            isToken: true
        },
        method: 'put',
        data: data
    })
}
// 获取邀请信息
export function getInviteInfo(data) {
    return request({
        url: `${prefix}/inviteToken/createInviteInfo`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data: data
    })
}

// 删除项目
export function deleteProject(params) {
    return request({
        url: `${prefix}/project/deleteMyProject`,
        headers: {
            isToken: true
        },
        method: 'delete',
        params,
    })
}

// 转让并退出项目
export function transferAndQuit(data) {
    return request({
        url: `${prefix}/project/transferAndQuit`,
        headers: {
            isToken: true
        },
        method: 'put',
        data: data
    })
}

// 获取评论列表
export function getCommentList(query) {
    return request({
        url: `${prefix}/projectReview/getCommentList` ,
        headers: {
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 发表评论
export function publishComment(data) {
    return request({
        url: `${prefix}/projectReview/postComment` ,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}

// 删除评论
export function deleteComment(CommentId) {
    return request({
        url: `${prefix}/projectReview/deleteComment?id=${CommentId}` ,
        headers: {
            isToken: true
        },
        method: 'delete',
    })
}
// 项目归档
export function archiveMyProject(data) {
    return request({
        url: `${prefix}/project/archiveMyProject` ,
        headers: {
            isToken: true,
            isLoading:true
        },
        method: 'PUT',
        data
    })
}
// 获取归档项目
export function getMyArchiveProject() {
    return request({
        url: `${prefix}/project/getMyArchiveProject`,
        headers: {
            isToken: true,
        },
        method: 'GET',
    })
}
// 取消归档
export function cancelProjectArchive(data) {
    return request({
        url: `${prefix}/myProject/cancelProjectArchive`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 改变项目颜色标记
export function updateColorTag(data) {
    return request({
        url: `${prefix}/project/updateColorTag`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 获取项目操作日志
export function getProjectLog(params) {
    return request({
        url: `${prefix}/log/getProjectLog`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params
    })
}

// 获取项目操作日志
export function getHomeProject(num) {
    return request({
        url: `${prefix}/project/getHomeProject`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params:{num}
    })
}
// 将项目添加到首页
export function addToHome(data) {
    return request({
        url: `${prefix}/project/addToHome`,
        headers: {
            isToken: true,
            isLoading:true,
        },
        method: 'POST',
        data
    })
}
// 将项目从首页删除
export function delFormHome(params) {
    return request({
        url: `${prefix}/project/delFormHome`,
        headers: {
            isToken: true,
            isLoading:true,
        },
        method: 'DELETE',
        params
    })
}

