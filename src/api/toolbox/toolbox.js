import request from '@/utils/request'
const prefix = "/tool/api"

/**
 * 获取工具列表
 * @returns {*}
 */
export function toolMenuList() {
    return request({
        url: `${prefix}/toolMenu/list`,
        headers: {
            isToken: true
        },
        method: 'get'
    })
}


/**
 * 获取工具列表
 * @returns {*}
 */
export function toolDetailList(params) {
    return request({
        url: `${prefix}/toolDetail/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}



/**
 * 收藏工具
 * @returns {*}
 */
export function toolCollect(toolDetailId) {
    return request({
        url: `${prefix}/collect`,
        headers: {
            isToken: true
        },
        method: 'post',
        data:{toolDetailId}
    })
}


/**
 * 获取左边收藏列表
 * @returns {*}
 */
export function collectList(toolDetailId) {
    return request({
        url: `${prefix}/collect/list`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}


/**
 * 提交上传文件记录
 * 接口ID：33712914
 * @returns {*}
 */
export function toolUploadRecord(tdId,sourceId) {
    return request({
        url: `${prefix}/toolUploadRecord`,
        headers: {
            isToken: true
        },
        method: 'post',
        data:{tdId,sourceId}
    })
}


/**
 * 处理
 * 接口ID：33712914
 * @returns {*}
 */
export function toolUploadRecordDealWith(uploadRecordId) {
    return request({
        url: `${prefix}/toolUploadRecord/dealWith`,
        headers: {
            isToken: true
        },
        method: 'post',
        data:{uploadRecordId}
    })
}

/**
 * 获取工具详情
 */
export function toolDetail(id) {
    return request({
        url: `${prefix}/toolDetail/info`,
        headers: {
            isToken: true
        },
        method: 'get',
        params:{id}
    })
}

/**
 * 下单
 * @param data
 * @returns {*}
 */
export function toolOrder(data) {
    return request({
        url: `${prefix}/toolOrder`,
        headers: {
            isToken: true
        },
        method: 'post',
        data:data
    })
}

/**
 * 获取订单列表
 * @param params 参数
 * @returns {*}
 */
export function toolOrderList(params) {
    return request({
        url: `${prefix}/toolOrder/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}

/**
 * 获取订单详情
 */
export function toolOrderInfo(orderNo) {
    return request({
        url: `${prefix}/toolOrder/info`,
        headers: {
            isToken: true
        },
        method: 'get',
        params:{orderNo}
    })
}


export function auditionList(params) {
    return request({
        url: `${prefix}/audition/list`,
        headers: {
            isToken: true
        },
        method: 'get',
        params
    })
}

/**
 * 转换完整版
 * @param orderNo 订单号
 * @returns {*}
 */
export function toolOrderWhole(orderNo) {
    return request({
        url: `${prefix}/toolOrder/whole`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: {orderNo}
    })
}


export function toolOrderDel(orderNo) {
    return request({
        url: `${prefix}/toolOrder/del`,
        headers: {
            isToken: true
        },
        method: 'delete',
        data:{orderNo}
    })
}

/**
 * 工具助力
 * @param toolId 工具ID
 * @returns {*}
 */
export function toolAssist(toolId){
    return request({
        url: `${prefix}/assist`,
        headers: {
            isToken: true
        },
        method: 'post',
        data: {toolId}
    })
}

/**
 * 获取工具助力详情
 * @param toolId
 * @returns {*}
 */
export function getAssistInfo(toolId){
    return request({
        url: `${prefix}/assist/detail`,
        headers: {
            isToken: true
        },
        method: 'get',
        params:{toolId}
    })
}

export function toolConfig(key) {
    return request({
        url: `${prefix}/config`,
        headers: {
            isToken: true
        },
        method: 'get',
        params:{code:key}
    })
}

/**
 * 根据订单号获取语音转文字内容
 * @param orderNo
 * @returns {*}
 */
 export function getVoiceFileTransText(orderNo){
    return request({
        url: `${prefix}/toolOrder/voiceFileTransText/${orderNo}`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}

/**
 * 根据订单号下载语音转文字文件
 * @param orderNo
 * @param type //txt doc
 * @returns {*}
 */
 export function downloadVoiceToText(orderNo, type = 'txt'){
    return request({
        url: `${prefix}/voiceFileTrans/download/${orderNo}/${type}`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}
