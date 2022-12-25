import request from '@/utils/request'
const prefix = "/worker/api"

/****************************************招募相关*******************************************************/

/**
 * 获取我发布的招募列表
 * @param pageNum 当前页数
 * @param pageSize 每页数量
 */
 export function getRecruitReleaseList(params) {
    return request({
        url: `${prefix}/recruit/a/releaseList`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params
    })
}
/**
 * 获取我发布的招募列表
 * @param pageNum 当前页数
 * @param pageSize 每页数量
 */
 export function getRecruitReleaseData(params) {
    return request({
        url: `${prefix}/recruit/a/all`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'GET',
        params
    })
}



/**
 * 上下架
 * @param id 招募ID
 */
 export function updateReleaseRecruitmentHall(data) {
    return request({
        url: `${prefix}/recruit/a/updateStatus`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data
    })
}

/**
 * 修改招募状态
 * @param id 招募ID
 */
 export function updateRecruitStatus(data) {
    return request({
        url: `${prefix}/recruit/a/updateStatus`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data
    })
}
/**
 * 获取招募详情
 * @param id 招募ID
 */
 export function getRecruitDetail(params) {
    return request({
        url: `${prefix}/recruit/a/info`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

/**
 * 获取保证金订单
 */
 export function getMarginPay() {
    return request({
        url: `${prefix}/margin/pay`,
        headers: {
            isToken: true,
            isLoading:true,
        },
        method: 'POST',
    })
}


/**
 * 获取应聘记录
 * @param recruitId 招募ID
 * @param categoryId 工种ID
 * @param pageNum 当前页数
 * @param pageSize 每页总数
 */
 export function getSignUpList(params) {
    return request({
        url: `${prefix}/recruit/a/signUpList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 隐藏应聘记录
 */
 export function updateRecruitApply(data) {
    return request({
        url: `${prefix}/recruit/a/updateRecruitApply`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 修改招募截止时间
 */
 export function updateRecruitEndDate(data) {
    return request({
        url: `${prefix}/recruit/a/updateRecruit`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'POST',
        data
    })
}


/**
 * 获取浏览记录
 * @param recruitId 招募ID
 * @param pageNum 当前页数
 * @param pageSize 每页总数
 */
 export function getBrowseList(params) {
    return request({
        url: `${prefix}/recruit/a/selectBrowseList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 选中承接人
 */
 export function designatedUndertaker(data) {
    return request({
        url: `${prefix}/order/a/designatedUndertaker`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 修改招募状态为已完成
 */
 export function recruitCompleted(data) {
    return request({
        url: `${prefix}/recruit/a/completed`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 邀请记录
 */
 export function getInviteList(params) {
    return request({
        url: `${prefix}/invite/a/list`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 取消选定
 */
 export function cancelUndertaker(data) {
    return request({
        url: `${prefix}/order/a/cancelUndertaker`,
        headers: {
            isToken: true,
            isLoading: false,
        },
        method: 'POST',
        data
    })
}
/**
 * 获取联系人信息
 */
 export function getContactList(params) {
    return request({
        url: `${prefix}/collect/a/contactList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 删除招募
 */
 export function recruitDelete(data) {
    return request({
        url: `${prefix}/recruit/a/del`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/****************************************用工订单*******************************************************/
/**
 * 获取用工订单列表
 * @param pageNum 当前页数
 * @param pageSize 每页总数
 * @param recruitId 招募ID
 */
 export function getOrderList(params) {
    return request({
        url: `${prefix}/order/a/list`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 获取工单详情
 * @param orderNo 当前页数
 */
 export function getOrderInfo(params) {
    return request({
        url: `${prefix}/order/a/info`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 数量统计
 * @param pageNum 当前页数
 * @param pageSize 每页总数
 * @param recruitId 招募ID
 */
 export function getStatistics(params) {
    return request({
        url: `${prefix}/order/a/statistics`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 新建工单/快速下单
 */
 export function createOrderSave(data) {
    return request({
        url: `${prefix}/order/a/save`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/**
 * 修改工单状态
 */
 export function actionOperateOrder(data) {
    return request({
        url: `${prefix}/order/a/operate/order`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 平台介入
 */
 export function platformIntervention(data) {
    return request({
        url: `${prefix}/platformIntervention/add`,
        headers: {
            isToken: true,
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
        url: `${prefix}/order/a/del`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 工单操作日志
 */
 export function getRecordLogList(params) {
    return request({
        url: `${prefix}/record/list`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
/**
 * 评价工单
 */
 export function handleComment(data) {
    return request({
        url: `${prefix}/comment/add`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
/**
 * 评价工单
 */
 export function getOrderRelation(data) {
    return request({
        url: `${prefix}/record/getOrderRelation`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

/****************************************我的工种库*******************************************************/

/**
 * 我的工种库列表
 */
 export function getCollectList(params) {
    return request({
        url: `${prefix}/collect/a/list`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}

/**
 * 我的工种库列表
 */
 export function getUserWorker(params) {
    return request({
        url: `${prefix}/userWorker/${params.userId}`,
        headers: {
            isToken: true,
        },
        method: 'GET',
    })
}

