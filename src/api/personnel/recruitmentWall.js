import request from '@/utils/request'
const prefix = "/worker/api"

/**
 * 获取工种列表
 * @param st 0默认 1工种库菜单 2找幕墙菜单
 * @returns {*}
 */
export function getCategoryList(st) {
    return request({
        url: `${prefix}/category/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: {st:st}
    })
}

/**
 * 获取工种列表(仅限工种认证页)
 */
 export function getAvailableCategoryList(params) {
    return request({
        url: `${prefix}/category/authlist`,
        headers: {
            isToken: true
        },
        method: 'get'
    })
}


/**
 * 根据工种id获取相关标签
 * @param categoryId 工种id
 * @returns {*}
 */
export function getTagList(categoryId) {
    return request({
        url: `${prefix}/tag/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: {categoryId:categoryId}
    })
}


/**
 * 修改菜单
 * @param data {st:"1工种库菜单 2找幕墙菜单",ids:"多个用英文逗号隔开"}
 * @returns {*}
 */
export function categoryEditMenu(data) {
    return request({
        url: `${prefix}/category/editMenu`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}


/**
 * 招募详细
 * @param params  {pageNum:"页数",pageSize:"每页大小",categoryId:"工种id"}
 * @returns {*}
 */
export function getRecruitList(params) {
    return request({
        url: `${prefix}/recruit/b/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: params
    })
}


/**
 * 发布招募
 *
 * @param data
 * @returns {*}
 */
export function recruitRelease(data) {
    return request({
        url: `${prefix}/recruit/a/release`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}

/**
 *  获取人才列表
 * @param params
 * @returns {*}
 */
export function talentsList(params) {
    return request({
        url: `${prefix}/talents/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: params
    })
}

/**
 *  获取单位 /config/dictList
 * @param params
 * @returns {*}
 */
export function workerAuthUnit() {
    return request({
        url: `${prefix}/config/dictList`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: {dictType:'worker_auth_unit'}
    })
}

/**
 * 乙方招募详细
 * GET http://localhost:8080/worker/api/recruit/info
 * @returns {*}
 */
export function recruitInfo(id) {
    return request({
        url: `${prefix}/recruit/b/info`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: {id:id}
    })
}

/**
 * 甲方招募详细；用于修改招募详情的
 * GET http://localhost:8080/worker/api/recruit/info
 * @returns {*}
 */
export function recruitAInfo(id) {
    return request({
        url: `${prefix}/recruit/a/info`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params: {id:id}
    })
}

/**
 * 报名招募
 *
 * @param data
 * @returns {*}
 */
export function recruitSignUp(data) {
    return request({
        url: `${prefix}/recruit/b/signUp`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}

/**
 * 人才工种详情
 * @param id 认证ID
 * @returns {*}
 */
export function talentsInfo(params) {
    return request({
        url: `${prefix}/talents/info`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}


/**
 * 获取对比列表
 * @param data {pageNum,pageSize}
 * @returns {*}
 */
export function comparedList(data) {
    return request({
        url: `${prefix}/compared/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: data
    })
}


/**
 * 加入对比
 * @param id 认证ID
 * @returns {*}
 */
export function comparedJoin(id) {
    return request({
        url: `${prefix}/compared/join`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'post',
        data: {userAuthenticateId:id}
    })
}

/**
 * 获取配置或者费率
 * @returns {*}
 */
export function configInfo() {
    return request({
        url: `${prefix}/config/info`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}


/**
 * 快速下单
 * @param data {content :"备注", price:“最终价格”, sourceId:"文件ID", type :"1",   num :"下单数量",pass:"密码" ,recipientUserId:"用户ID"}
 * @returns {*}
 */
export function orderASave(data) {
    return request({
        url: `${prefix}/order/a/save`,
        headers: {
            isToken: true
        },
        method: 'post',
        data,
    })
}

/**
 * 关注
 * @param id
 * @returns {*}
 */
export function collectAFavorite(id) {
    return request({
        url: `${prefix}/collect/a/favorite`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'post',
        data: {userAuthenticateId:id}
    })
}

/**
 * 招募详情页内关注
 * @param {Number} userId 关注的用户ID
 * @returns {*}
 */
export function recruitDetailFollow(id) {
    return request({
        url: `${prefix}/collect/a/favorite`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'post',
        data: {userId:id}
    })
}

// 举报招募
export function informRecruit(data) {
    return request({
        url: `${prefix}/report/save`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'post',
        data
    })
}

/**
 * 获取已经发布的招募列表
 * @returns {*}
 */
export function publishedListed() {
    return request({
        url: `${prefix}/recruit/a/publishedList`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}


/**
 * RecruitInvite 邀请招募
 * @param data {userAuthenticateId:"认证ID",recruitId:"招募ID",leaveMessage:"留言"}
 * @returns {*}
 * @constructor
 */
export function recruitInvite(data) {
    return request({
        url: `${prefix}/invite/a/apply`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}
/**
 * RecruitInvite 聊一聊
 * @param data
 * @returns {*}
 * @constructor
 */
export function havechatInitiate(data) {
    return request({
        url: `${prefix}/havechat/initiate`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'post',
        data,
    })
}
/**
 * RecruitInvite 提醒验收
 * @param data
 * @returns {*}
 * @constructor
 */
export function acceptancePush(data) {
    return request({
        url: `${prefix}/havechat/acceptancePush`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'post',
        data,
    })
}
/**
 * RecruitInvite 催一催
 * @param data
 * @returns {*}
 * @constructor
 */
export function handleUrgerush(data) {
    return request({
        url: `${prefix}/havechat/urgerush`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'post',
        data,
    })
}


/**
 * 获取报名工种列表
 * @returns {*}
 */
export function userCategoryList(params) {
    return request({
        url: `${prefix}/talents/userCategoryList`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}



/**
 * 获取评论
 * 接口ID：31934676
 * @returns {*}
 */
export function commentList(params) {
    return request({
        url: `${prefix}/comment/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}

/**
 * 屏蔽工种
 */
export function handleShielded(data) {
    return request({
        url: `${prefix}/shielded`,
        headers: {
            isToken: true
        },
        method: 'post',
        data
    })
}
/**
 * 获取粉丝数据
 */
export function getThirdpartyInfo({userId}) {
    return request({
        url: `${prefix}/thirdparty/userInfoByUserId/${userId}`,
        headers: {
            isToken: true
        },
        method: 'get'
    })
}
/**
 * 修改粉丝数据
 */
export function updateFanData(data) {
    return request({
        url: `${prefix}/user/updateFanData`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data,
    })
}
/**
 * 获取当前用户所有平台粉丝数据（后台数据 ）
 */
export function getUserFansData() {
    return request({
        url: `${prefix}/thirdparty/getUserFans`,
        headers: {
            isToken: true
        },
        method: 'GET',
    })
}
/**
 * 更新当前粉丝数据显示隐藏（后台数据 ）
 */
export function handleUpdatePlatformShow(data) {
    return request({
        url: `${prefix}/thirdparty/updatePlatformShow`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data,
    })
}
