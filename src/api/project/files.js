import request from '@/utils/request'
const prefix = "/project"

// 获取文件夹列表
export function getDirectoryList(query) {
    return request({
        url: `${prefix}/projectFile/getDirectoryList`,
        headers: {
            isToken: true
        },
        method: 'GET',
        params: query
    })
}
// 获取文件列表
export function getFileList(query) {
    return request({
        url: `${prefix}/projectFile/getFileList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params:query
    })
}
// 获取上传签名
export function createUploadSign(data) {
    return request({
        url: `${prefix}/projectFile/createUploadSign`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 创建上传文件
export function createUploadFile(data) {
    return request({
        url: `${prefix}/projectFile/createUploadFile`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 创建文件夹
export function createDirectory(data) {
    return request({
        url: `${prefix}/projectFile/createDirectory`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 批量创建文件夹
export function batchCreateDirectory(data) {
    return request({
        url: `${prefix}/projectFile/batchCreateDirectory`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'POST',
        data
    })
}
// 重命名文件或文件夹
export function renameFileObject(data) {
    return request({
        url: `${prefix}/projectFile/renameFileObject`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 复制到
export function handleSaveTo(data) {
    return request({
        url: `${prefix}/projectFile/saveTo`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 移动到
export function handleMoveTo(data) {
    return request({
        url: `${prefix}/projectFile/move`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 删除文件或文件夹
export function deleteFile(query) {
    return request({
        url: `${prefix}/projectFile/deleteFile`,
        headers: {
            isToken: true,
        },
        method: 'DELETE',
        params:query
    })
}
// 删除文件版本
export function deleteFileVersion(query) {
    return request({
        url: `${prefix}/projectFile/deleteFileVersion`,
        headers: {
            isToken: true,
        },
        method: 'DELETE',
        params:query
    })
}
// 设置文件版本
export function setFileAsVersion(data) {
    return request({
        url: `${prefix}/projectFile/setFileAsVersion`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        data
    })
}
// 置顶
export function updateTopFileObject(data) {
    return request({
        url: `${prefix}/projectFile/updateTopFileObject`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        data
    })
}
// 设置审阅状态
export function setFileReviewStatus(data) {
    return request({
        url: `${prefix}/projectFile/setFileReviewStatus`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        data
    })
}
// 设置防录屏状态
export function setAntiScreenRecording(data) {
    return request({
        url: `${prefix}/projectFile/setAntiScreenRecording`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        data
    })
}

// 解除文件版本
export function removeFileVersion(params) {
    return request({
        url: `${prefix}/projectFile/removeFileVersion`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        params
    })
}
// 解除文件所有版本
export function removeAllFileVersion(params) {
    return request({
        url: `${prefix}/projectFile/removeAllFileVersion`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        params
    })
}
// 获取文件版本信息
export function getFileVersionList(params) {
    return request({
        url: `${prefix}/projectFile/getFileVersionList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 版本排序
export function updateVersionOrder(data) {
    return request({
        url: `${prefix}/projectFile/updateVersionOrder`,
        headers: {
            isToken: true,
            isLoading: true
        },
        method: 'PUT',
        data
    })
}
// 获取回收站文件列表
export function getRecycleFileList(params) {
    return request({
        url: `${prefix}/projectFile/getRecycleFileList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 获取回收站文件夹列表
export function getRecycleDirectoryList(params) {
    return request({
        url: `${prefix}/projectFile/getRecycleDirectoryList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 恢复回收站文件
export function recoverFile(data) {
    return request({
        url: `${prefix}/projectFile/recoverFile`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        data
    })
}
// 彻底删除文件或文件夹
export function thoroughDeleteFile(params) {
    return request({
        url: `${prefix}/projectFile/thoroughDeleteFile`,
        headers: {
            isToken: true,
        },
        method: 'DELETE',
        params
    })
}
// 清空回收站
export function emptyRecycle(params) {
    return request({
        url: `${prefix}/myProject/emptyRecycle`,
        headers: {
            isToken: true,
        },
        method: 'DELETE',
        params
    })
}
/**
 * 收集
 * **/
// 创建收集文件夹
export function createFileCollect(data) {
    return request({
        url: `${prefix}/collect/createFileCollect`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'POST',
        data
    })
}
// 发起收集
export function getCollectDetails(params) {
    return request({
        url: `${prefix}/collect/getCollectDetails`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 收集列表
export function getCollectList(params) {
    return request({
        url: `${prefix}/collect/getCollectList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 编辑收集
export function editFileCollect(data) {
    return request({
        url: `${prefix}/collect/editFileCollect`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 删除收集
export function deleteCollect(params) {
    return request({
        url: `${prefix}/collect/deleteCollect`,
        headers: {
            isToken: true,
        },
        method: 'DELETE',
        params
    })
}
// 获取文件或目录详情
export function getDetails(params) {
    return request({
        url: `${prefix}/projectFile/getDetails`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 通过token获取收集信息
export function getFileCollectInfo(params) {
    return request({
        url: `${prefix}/collect/getFileCollectInfo`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'GET',
        params
    })
}
// 验证收集密码
export function verifyFileCollectPassword(data) {
    return request({
        url: `${prefix}/collect/verifyFileCollectPassword`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'PUT',
        data
    })
}
// 获取收集上传签名
export function getCollectUploadSign(data) {
    return request({
        url: `${prefix}/collect/createUploadSign`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 创建上传文件
export function getCollectUploadFile(data) {
    return request({
        url: `${prefix}/collect/createUploadFile`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}


/**
 * 分享
 * **/
// 创建分享
export function createShare(data) {
    return request({
        url: `${prefix}/share/createShare`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 通过token获取分享信息
export function getFileShareInfo(params) {
    
    return request({
        url: `${prefix}/share/getFileShareInfo`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 验证分享密码
export function verifyFileSharePassword(data) {
    return request({
        url: `${prefix}/share/verifyFileSharePassword`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 分享添加收藏
export function addShareCollect(data) {
    return request({
        url: `${prefix}/shareCollect/addCollect`,
        headers: {
            isToken: true,
            isLoading:true,
        },
        method: 'POST',
        data
    })
}
// 分享删除收藏
export function delShareCollect(params) {
    return request({
        url: `${prefix}/shareCollect/deleteShareCollect`,
        headers: {
            isToken: true,
            isLoading:true,
        },
        method: 'DELETE',
        params
    })
}
// 获取分享详情
export function getShareFileDetails(params) {
    return request({
        url: `${prefix}/shareFile/getDetails`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 获取我的分享详情
export function getShareDetails(params) {
    return request({
        url: `${prefix}/share/getDetails`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 获取分享的文件列表
export function getShareFileList(params) {
    return request({
        url: `${prefix}/shareFile/getShareFileList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 获取我的分享列表
export function myShareList(params) {
    return request({
        url: `${prefix}/share/myList`,
        headers: {
            isToken: true,
        },
        method: 'GET',
        params
    })
}
// 删除我的分享
export function deleteProjectShare(params) {
    return request({
        url: `${prefix}/share/deleteProjectShare`,
        headers: {
            isToken: true,
        },
        method: 'DELETE',
        params
    })
}
// 修改我的分享
export function updateProjectShare(data) {
    return request({
        url: `${prefix}/share/updateProjectShare`,
        headers: {
            isToken: true,
        },
        method: 'PUT',
        data
    })
}
// 修改我的分享
export function handleShareSaveTo(data) {
    return request({
        url: `${prefix}/shareFile/saveTo`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}
// 获取WPS新建页面URL
export function createWpsFile(data) {
    return request({
        url: `${prefix}/projectFileSystem/createWpsFile`,
        headers: {
            isToken: true
        },
        method: 'POST',
        data
    })
}

// 获取WPS编辑页面URL
export function editWpsFile(data) {
    return request({
        url: `${prefix}/projectFileSystem/editWpsFile`,
        headers: {
            isToken: true
        },
        method: 'put',
        data
    })
}

// 获取上传签名 附件
export function publicCreateUploadSign(data) {
    return request({
        url: `${prefix}/publicUpload/createUploadSign`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

// 创建上传文件 附件
export function publicCreateUploadFile(data) {
    return request({
        url: `${prefix}/publicUpload/createUploadFile`,
        headers: {
            isToken: true,
        },
        method: 'POST',
        data
    })
}

// 获取评论无分页列表
export function getCommentListNoPage(query) {
    return request({
        url: `${prefix}/projectReview/getCommentListNoPage`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: query
    })
}

// 改变评审记录状态
export function putCommentStatus(data) {
    return request({
        url: `${prefix}/projectReview/putCommentStatus`,
        headers: {
            isToken: true
        },
        method: 'put',
        data
    })
}

// 导出评论无分页列表
export function exportCommentListNoPage(query) {
    return request({
        url: `${prefix}/projectReview/exportCommentListNoPage`,
        headers: {
            isToken: true
        },
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 获取下载地址
export function getFileDownloadUrl(data) {
    return request({
        url: `${prefix}/projectFile/getFileDownloadUrl`,
        headers: {
            isToken: true,
            isLoading: true,
        },
        method: 'POST',
        data
    })
}