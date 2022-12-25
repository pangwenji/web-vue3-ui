// // one file
// const HandleStartUploadOneFile = (item) => {
//     let isUploading = -1; // 是否有正在上传的文件
//     let isAwaiting = -1;  // 是否有等待上传的文件
//     if (item.state == 'uploading' || item.state == 'checking') {
//         isUploading = key;
//     } else if (item.state == 'awaiting') {
//         isAwaiting = key;
//     }
//     if (isUploading >= 0) {
//         return
//     }
//     if (isAwaiting >= 0) {
//         item.uploadFile();
//         return
//     }
// }
