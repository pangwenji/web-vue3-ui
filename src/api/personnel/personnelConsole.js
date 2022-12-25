import request from '@/utils/request'

const prefix = "/worker/api"


/**
 * 我的工单
 * @param pageNum 当前页数
 * @param pageSize 每页数量
 */
export function getOrderList(params) {
    return request({
        url: `${prefix}/order/b/list`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params
    })
}

/**
 * 获取工单统计数量
 */
export function getOrderStatistics(params) {
    return request({
        url: `${prefix}/order/b/statistics`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params
    })
}

/**
 * 工单详细
 */
export function getOrderInfo(params) {
    return request({
        url: `${prefix}/order/b/info`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params
    })
}

/**
 *  操作工单
 */
export function updateOrderStatus(data) {
    return request({
        url: `${prefix}/order/b/operate/order`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/**
 *  报名管理 - 确认订单
 */
 export function confirmOrder(data) {
    return request({
        url: `${prefix}/recruit/b/confirmOrder`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'POST',
        data
    })
}

/**
 * 删除工单
 */
 export function delOperateOrder(data) {
    return request({
        url: `${prefix}/order/b/del`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/**
 * 我的主页
 * @param data
 * @returns {*}
 */
export function talentsBMyInfo() {
    return request({
        url: `${prefix}/talents/b/myInfo`,
        headers: {
            isToken: true,
        },
        method: 'GET'
    })
}


/**
 * 我收到的邀请列表
 * 接口ID：30040935
 * @param data {pageSize,pageNum}
 * @returns {*}
 */
export function recruitInviteList(data) {
    return request({
        url: `${prefix}/invite/b/list`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params: data
    })
}


/**
 * 我报名的招募列表（我的应聘记录）
 * 接口ID：30420163
 * @param data {pageSize,pageNum}
 * @returns {*}
 */
export function recruitBmyList(data) {
    return request({
        url: `${prefix}/recruit/b/myList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params: data
    })
}

/**
 * 获取认证列表
 * 接口ID：23827872
 * @returns {*}
 */
export function userAuthList() {
    return request({
        url: `${prefix}/user/auth/list`,
        headers: {
            isToken: true,
        },
        method: 'GET',
    })
}

/**
 * 技能编辑
 */
export function editTechnicalAbility(data) {
    return request({
        url: `${prefix}/user/editTechnicalAbility`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data,
    })
}



/**
 * 通过URL获取粉丝数据
 * @param data
 * @return 
 */
export function getUserFansByUrl(data) {
    return request({
        url: `${prefix}/thirdparty/getUserFansByUrl`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/**
 * 提交认证
 * @param data
 * @returns {*}
 */
export function userAuth(data) {
    return request({
        url: `${prefix}/user/auth`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 预先创建ID
 * @param data
 * @returns {*}
 */
export function createUserAuthenticate(data) {
    return request({
        url: `${prefix}/user/createUserAuthenticate`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}


/**
 *  上传交付文件
 */
export function uploadConsignFile(data) {
    return request({
        url: `${prefix}/order/b/consign/file`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/**
 * 删除交付文件
 */
 export function deleteConsignFile(data) {
    return request({
        url: `${prefix}/order/b/del/consignFile`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'POST',
        data
    })
}


/**
 * 获取认证详细
 * 接口ID：23827872
 * @returns {*}
 */
export function userAuthInfo(id) {
    return request({
        url: `${prefix}/user/auth/info`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params: {id: id}
    })
}


/**
 * 删除我收到的邀请列表
 * 接口ID：31124283
 * @param recruitInviteId
 * @returns {*}
 */
export function recruitDel(recruitInviteId) {
    return request({
        url: `${prefix}/invite/b/del`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data: {recruitInviteId}
    })
}

/**
 * 删除我的认证
 * 接口ID：31124283
 * @param userAuthenticateId
 * @returns {*}
 */
export function userDel(userAuthenticateId) {
    return request({
        url: `${prefix}/user/del`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data: {userAuthenticateId}
    })
}
/**
 * 获取粉丝数据
 * 接口ID：31124283
 * @param userId
 * @returns {*}
 */
export function getFanData(params) {
    return request({
        url: `${prefix}/user/getFanData`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

/**
 * 修改接单状态
 * 接口ID：31658720
 * @param userAuthenticateId
 * @param state 0暂停接单 1可接单
 * @param sourceId sourceId 加密ID
 * @returns {*}
 */
export function talentsBUpdate(userAuthenticateId,state,sourceId) {
    return request({
        url: `${prefix}/talents/b/update`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data: {userAuthenticateId,state,sourceId}
    })
}
/**
 * 工单水印设置
 */
export function orderWaterMark(data) {
    return request({
        url: `${prefix}/order/b/watermark`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

// 获取粉丝数据二维码
export function thirdpartyPath(params) {
    return request({
        url: `${prefix}/thirdparty/auth`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'GET',
        params
    })
}
// 获取粉丝数据
export function thirdpartyUserInfo(params) {
    return request({
        url: `${prefix}/thirdparty/userInfo`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

// 修改邀请信息为已查看
export function lookOverInvite(data) {
    return request({
        url: `${prefix}/invite/b/lookOver`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}


