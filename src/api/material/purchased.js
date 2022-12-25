import request from '@/utils/request';

const prefix = '/material';

// 获取已购素材列表
export function getPurchaseMaterials(query) {
    return request({
        url: `${prefix}/materialSaleRecord/getPurchaseMaterials`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params: query,
    });
}

// 添加授权信息
export function addAuthorization(data) {
    return request({
        url: `${prefix}/materialAuthorization`,
        headers: {
            isToken: true,
        },
        method: 'post',
        data: data,
    });
}

// 获取授权信息
export function getAuthorization(query) {
    return request({
        url: `${prefix}/materialAuthorization/getInfo`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params: query,
    });
}

// 获取授权信息
export function getAuthorizationHistory(query) {
    return request({
        url: `${prefix}/materialAuthorization/getAuthorizationHistory`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params: query,
    });
}

// 导出授权信息PDF
export function exportAuthorization(query) {
    return request({
        url: `${prefix}/materialAuthorization/export`,
        headers: {
            isToken: true,
        },
        method: 'get',
        params: query,
        responseType: 'blob'
    });
}
