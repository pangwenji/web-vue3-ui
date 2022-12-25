import request from '@/utils/request'
import axios from 'axios';
const prefix = "/worker/api"

// 获取上传签名
export function createUploadSign(data) {
    return request({
        url: `/file/publicUpload/createUploadSign`,
        headers: {
            isToken: true,
        },
        method: "post",
        data,
    });
}

// 创建上传文件
export function createUploadFile(data) {
    return request({
        url: `/file/publicUpload/createUploadFile`,
        headers: {
            isToken: true,
        },
        method: "post",
        data,
    });
}
// 获取上传签名（无需登录）
export function createUploadSignPublic(data) {
    return request({
        url: `/file/publicUpload/createUploadSignPublic`,
        headers: {
            isToken: true,
        },
        method: "post",
        data,
    });
}

// 创建上传文件（无需登录）
export function createUploadFilePublic(data) {
    return request({
        url: `/file/publicUpload/createUploadFilePublic`,
        headers: {
            isToken: true,
        },
        method: "post",
        data,
    });
}
// 上传文件
export function publicUploadFile(data) {
    return request({
        url: '/file/publicFile/upload',
        headers: {
            isToken: true,
            isLoading: true,
            "Content-Type":"multipart/form-data"
        },
        method: "post",
        data,
    });
}
// 从云盘选择文件
export function cloudDiskSaveWork(data) {
    return request({
        url: `${prefix}/file/cloudDiskSaveWork`,
        headers: {
            isToken: true,
        },
        method: "post",
        data,
    });
}
// 保存上传文件
export function saveWorkFile(data) {
    return request({
        url: `${prefix}/file/saveWork`,
        headers: {
            isToken: true,
        },
        method: "POST",
        data,
    });
}
// 更新作品
export function updateWorkFile(data) {
    return request({
        url: `${prefix}/file/updateWork`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: "POST",
        data,
    });
}
// 删除作品
export function deleteWorkFile(data) {
    return request({
        url: `${prefix}/file/delFile`,
        headers: {
            isToken: true,
        },
        method: "POST",
        data,
    });
}
// 获取作品列表
export function getWorkList(params) {
    return request({
        url: `${prefix}/file/workList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
// 作品排序
export function getWorkFileSorting(data) {
    return request({
        url: `${prefix}/file/sorting`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: "POST",
        data,
    });
}
// 获取文件标签
export function getFileTagList(params) {
    return request({
        url: `${prefix}/file/tagList`,
        headers: {
            isToken: true,
        },
        method: "GET",
        params,
    });
}
// 创建文件标签
export function createFileTag(data) {
    return request({
        url: `${prefix}/file/createTag`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: "POST",
        data,
    });
}
// 删除标签
export function deleteFileTag(data) {
    return request({
        url: `${prefix}/file/delTag`,
        headers: {
            isToken: true,
            // isLoading: true,
        },
        method: "POST",
        data,
    });
}
// 设置标签是否显示
export function setShowTags(data) {
    return request({
        url: `${prefix}/file/setTag`,
        headers: {
            isToken: true,
            // isLoading: true,
        },
        method: "POST",
        data,
    });
}
// 浏览量
export function setFileBrowse(params) {
    return request({
        url: `${prefix}/file/browse`,
        headers: {
            isToken: true,
            // isLoading: true,
        },
        method: "GET",
        params,
    });
}