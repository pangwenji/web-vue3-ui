import {ElMessage} from 'element-plus'
import COS from 'cos-js-sdk-v5'
import TcVod from 'vod-js-sdk-v6'
import SparkMD5 from "spark-md5"
import * as tool from './tool.js'
import * as qiniu from 'qiniu-js'
// 存储桶名称，由bucketname-appid 组成，appid必须填入，可以在COS控制台查看存储桶名称。 https://console.cloud.tencent.com/cos5/bucket
const Bucket = 'xietong-1253889389'; /* 存储桶，必须字段 */
// 存储桶region可以在COS控制台指定存储桶的概览页查看 https://console.cloud.tencent.com/cos5/bucket/
// 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
const Region = 'ap-guangzhou';     /* 存储桶所在地域，必须字段 */

let signMap = {};



/**
 * @param {String} Key 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
 * @param {File || Blob} file 必须 上传文件的内容，可以为 File 对象 或者 Blob 对象
 * @param {Number} SliceSize 触发分块上传的阈值，超过5MB使用分块上传，非必须
 *  */
class UploadFile {
    constructor({File , getUploadSign , createUploadFile , SliceSize=1024 * 1024 * 1, ReadMD5=true, StorageClass='STANDARD'}) {
        if (!File) {
            throw new Error('File字段必填')
        }
        this.File = File;
        this.FileSize = File.size;
        this.FilePath = File.path;
        this.FileName = File.name;
        this.FileType = File.type;
        this.SliceSize = SliceSize;
        this.StorageClass = StorageClass;
        this.FileMD5 = "";
        this.ReadMD5 = ReadMD5;
        this.percent = 0; //进度
        this.speed = 0; //当前上传速度
        this.state = 'awaiting'; //初始上传状态
        this.getUploadSign = getUploadSign;
        this.createUploadFile = createUploadFile;
    }

    // 上传
    uploadFile(){
        if(this.state !== 'awaiting'){
            return
        }
        var that = this;
        this.state = 'checking';
        this.configId = 'kodo';
        if(this.getUploadSign && typeof this.getUploadSign == 'function'){
            this.fileReadMD5().then(res=>{
                that.getUploadSign(this,({type='ydb', credentials ,sign, fileCat ,sourceContext, bucket, region})=>{
                    that.sourceContext = sourceContext;
                    that.FileType = fileCat || that.FileType;
                    if(type == 'ydb'){
                        that.uploadTcVod(sign)
                    }else if(type == 'cos'){
                        const data = JSON.parse(sign)
                        that.uploadCos({key:data.key,bucket,region,credentials})
                    }else if(type == 'md5'){
                        that.state = 'uploading'
                        that.onProgress(1,0)
                        that.onSuccess({})
                    }else if(type == 'kodo'){
                        const data = JSON.parse(sign)
                        that.uploadQiniu(data)
                    }else{
                        that.onError('无法识别类型')
                    }
                },(err=>{ this.onError('获取签名失败',err) }))
            }).catch(err=>{
                console.log(err)
                this.onError('文件读取失败') 
            })
        }else{ this.onError('未传入特定参数') }
    }
    // 读取文件MD5
    fileReadMD5(){
        const File = this.File;
        const that = this;
        return new Promise((resolve,reject)=>{
            if(that.FileSize >= 1024*1024*20){  resolve(); return }
            if(!that.ReadMD5){  resolve(); return }
            if(that.FileMD5){ resolve(that.FileMD5); return; }
            const md5 = new SparkMD5()
            const fileReader = new FileReader();
            fileReader.readAsBinaryString(File)
            fileReader.onload = (e)=>{
                md5.appendBinary(e.target.result);
                const FileMD5 = md5.end();
                that.FileMD5 = FileMD5;
                resolve(FileMD5)
            }
            fileReader.onerror = (err)=>{
                console.log(err)
                reject();
            }
        })
    }

    // 监听事件
    on(type,callback){
        if(type == 'success'){
            this.success = callback;
        }else if(type == 'error'){
            this.error = callback;
        }else if(type == 'complete'){
            this.complete = callback;
        }
    }
    observer(){
        const that = this;
        this.startUploadTime = new Date().getTime() / 1000;
        this.loadedSize = this.loadedSize ? this.loadedSize :  0;
        return {
            next(response){
                const {total} = response
                const {percent, loaded} = total
                const size = loaded - that.loadedSize;
                const newTime = new Date().getTime() / 1000
                const speed = size / (newTime - that.startUploadTime)
                if(newTime - that.startUploadTime > 2){
                    that.onProgress(percent/100, speed);
                    that.loadedSize = loaded;
                    that.startUploadTime = newTime;
                }else{
                    that.onProgress(percent/100, that.speed || speed);
                }
            },
            error(err){
                console.log(err)
                that.onError()
            },
            complete(res){
                that.onSuccess(res)
            }
        }
    }
    // 七牛云上传
    uploadQiniu({key,sign}){
        const file = this.File;
        const token = sign;
        const config = {
            useCdnDomain: true,
            region: null
        }
        const putExtra = {
            fname: key,
            mimeType: null
        }
        this.observable = qiniu.upload(file, key, token, putExtra, config);
        this.subscription = this.observable.subscribe(this.observer()) // 上传开始
        this.state = 'uploading'
    }

    // 云点播上传
    uploadTcVod(sign) {
        var that = this;
        // 初始化云点播媒体上传
        that.tcVod = new TcVod({
            getSignature: function (info) { return sign }
        })
        const uploader = that.tcVod.upload({ mediaFile: that.File,})
        // 上传完成时
        uploader.on('media_upload', function (info) {  })
        // 上传进度
        uploader.on('media_progress', function ({percent, speed}) {
            if(that.percent && percent===0){ return }
            that.onProgress(percent, speed)
        })
        uploader.done().then(function (doneResult) {
            that.onSuccess(doneResult);
        }).catch(err => {
            that.onError(err);
        })
        that.uploader = uploader;
        if(that.state == 'paused' || that.state == 'canceled'){
            that.uploader.cancel();
        }else{
            that.state = 'uploading'
        }
    }

    // cos上传
    uploadCos(data) {
        const that = this;
        // 初始化cos实例
        this.cos = new COS({
            getAuthorization: function (options, callback) {
                try{
                    const credentialsData = JSON.parse(data.credentials);
                    callback(credentialsData);
                }catch(err){
                    throw new Error('签名错误')
                }

            }
        });
        this.cos.uploadFile({
            Bucket:data.bucket, /* 填入您自己的存储桶，必须字段 */
            Region:data.region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
            Key: data.key,
            Body: that.File,
            SliceSize: that.SliceSize,
            StorageClass: that.StorageClass,
            onTaskReady(taskId) {
                that.taskId = taskId;
                if(that.state == 'paused'){
                    that.cos.pauseTask(taskId);
                }else if(that.state == 'canceled'){
                    that.cos.cancelTask(taskId);
                }else{
                    that.state = 'uploading'
                }
            },
            onProgress({percent, speed}) {
                if(that.percent && percent===0){ return }
                that.onProgress(percent, speed) 
            },
            /* 非必须 每个文件完成或错误回调 */
            onFileFinish(err, res, options) {
                if (err) {
                    that.onError(err);
                } else {
                    that.onSuccess(res);
                }
            },
        });
    }

    // 上传成功
    onSuccess(data){
        if(this.createUploadFile){
            this.completeTime = 0;
            const resultData = data;
            const options = this
            this.createUploadFile({resultData,options},(res)=>{
                this.state = 'success'
                this.successData = res.fileSystem;
                this.FileType = res.fileSystem?.fileCat || this.FileType;
                this.id = res.fileSystem?.id;
                this.encryptedId = res.encryptedId;
                this.success&&this.success(res);
                this.complete&&this.complete(this);
            },()=>{
                this.onError()
            })
        }else{
            this.onError()
        }
    }
    // 上传失败
    onError(err,errData){
        // ElMessage.error(err)
        console.log(err,errData)
        this.completeTime = 0;
        this.state = 'error'
        this.error&&this.error(err);
        this.complete&&this.complete();
    }
    // 上传进度
    onProgress(percent, speed) {
        const progress = percent * 100
        this.percent = parseInt(progress);
        if(speed && speed > 0){
            this.speed = parseInt(speed);
            const surplus = (1 - percent) * this.FileSize;
            this.completeTime = Math.ceil((surplus/speed) * 1000);
        }

    }

    // 取消上传
    handleCancel() {
        if(this.state  == 'error' || this.state  == 'canceled' || this.state  == 'success') return;
        if(this.state !== 'checking'){
            if (this.cos) {
                this.cos.cancelTask(this.taskId);
            } else if(this.uploader){
                this.uploader.cancel()
            }else if(this.observable && this.subscription){
                this.subscription.unsubscribe()
            }
        }
        this.state = 'canceled'
        this.speed = 0;
    }

    // 开始上传
    handlePlay() {
        if(this.state == 'paused' || this.state == 'error'){
            if (this.cos) {
                this.cos.restartTask(this.taskId);
            } else if(this.uploader){
                this.uploadFile();
            }else if(this.observable){
                this.subscription = this.observable.subscribe(this.observer());
            }
            this.state = 'uploading'
        }
    }

    //暂停上传
    handlePause() {
        if(this.state  == 'error' || this.state  == 'paused'  || this.state  == 'success'){return}
        if(this.state !== 'checking'){
            if (this.cos) {
                this.cos.pauseTask(this.taskId);
            } else if(this.uploader){
                this.uploader.cancel()
            }else if(this.observable&&this.subscription){
                this.subscription.unsubscribe()
            }
        }
        this.state = 'paused';
    }

    /* 增加文件大小单位 */
    static formatSize(size){
        return tool.formatSize(size)
        
    }
}

export default UploadFile;
// 上传文件夹

export const uploadFolders = async (files,projectId,parentId)=>{
    // for(const entry of files){
    //     const webkitGetAsEntry = entry.webkitGetAsEntry ? entry.webkitGetAsEntry() : entry;
    //     if(webkitGetAsEntry.isFile){
    //         webkitGetAsEntry.file(async File=>{
    //             const path = webkitGetAsEntry.fullPath.substring(1);
    //             File.path = path;
    //             new UploadFile({File,projectId,parentId});
    //         },err=>{console.log('文件错误',err)})
    //     }else{
    //         const names = webkitGetAsEntry.fullPath.split('/');
    //         const name = names.splice(-1,1)[0];
    //         const result = await createDirectory({projectId,  parentId, name });
    //         console.log('result',result)
    //         const reader = webkitGetAsEntry.createReader();
    //         reader.readEntries(entries=>{
    //             if(entries.length > 0){
    //                 uploadFolders(entries,projectId, result.data.id);
    //             }
    //         },err=>{console.log('目录错误',err)})
    //     }
    // }
}