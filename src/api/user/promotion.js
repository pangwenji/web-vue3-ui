import request from '@/utils/request'
const prefix = '/system';
// 获取推广信息
export const myPromoteInfo = () => {
    return request({
        url: `${prefix}/user/getMyPromoteInfo`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}

/**、
 * 获取推广列表
 * @returns {*}
 */
export const myPromoteList = () => {
    return request({
        url: `${prefix}/user/getMyPromoteList`,
        headers: {
            isToken: true
        },
        method: 'get',
    })
}
