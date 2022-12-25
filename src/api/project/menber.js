import request from '@/utils/request'
const prefix = "/project"

// 获取成员列表
export function getProjectMemberList(query) {
    return request({
        url: `${prefix}/project/getProjectMemberList`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params: query
    })
}
// 改变成员角色
export function updateProjectMemberRole(data) {
    return request({
        url: `${prefix}/member/updateProjectMemberRole`,
        headers: {
            isToken: true
        },
        method: 'PUT',
        data
    })
}
// 移除项目成员
export function deleteMember(data) {
    return request({
        url: `${prefix}/member/deleteMember`,
        headers: {
            isToken: true
        },
        method: 'DELETE',
        params:data
    })
}
// 成员退出项目
export function quitProject(data) {
    return request({
        url: `${prefix}/member/quitProject`,
        headers: {
            isToken: true
        },
        method: 'DELETE',
        params:data
    })
}
// 通过邀请token获取项目信息
export function getProjectInfoByInviteToken(data) {
    return request({
        url: `${prefix}/inviteToken/getProjectInfoByInviteToken`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params:data
    })
}
// 铜鼓邀请token加入项目
export function joinProjectByToken(data) {
    return request({
        url: `${prefix}/inviteToken/joinProjectByToken`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data
    })
}