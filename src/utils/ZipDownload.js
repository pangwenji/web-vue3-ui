import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from 'axios'

//文件以流的形式获取（参数url为文件链接地址）
function getImgArrayBuffer(url) {
    // return new Promise((resolve, reject) => {
    //     //通过请求获取文件blob格式
    //     let xmlhttp = new XMLHttpRequest();
    //     xmlhttp.open("GET", url, true);
    //     xmlhttp.responseType = "blob";
    //     xmlhttp.onload = function () {
    //         if (this.status == 200) {
    //             resolve(xmlhttp.response);
    //         } else {
    //             reject(xmlhttp.status);
    //         }
    //     }
    //     xmlhttp.send();
    // });

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }).then((response) => {
                // console.log(response)
                return response.blob()
            }
        ).then((res) => {
            if (res) {
                // console.log(res)
                resolve(res)
                // console.log(res)
            }
        }).catch(res => {
            console.log("读取错误！")
        }).catch(res => {
            console.log("请求错误！")
        });
    })

}

/**
 * 通用 批量下载
 * @param zipName 压缩包名称
 * @param downloadList [{url,name}]
 */
export function downloadZip(zipName, downloadList) {

    let blogTitle = zipName; // 下载后压缩包的命名
    let zip = new JSZip();
    let promises = [];
    let cache = {};
    let arrImg = [];
    for (let i = 0; i < downloadList.length; i++) {
        arrImg.push({
            path: downloadList[i].url, // 文件链接
            name: downloadList[i].name // 文件名称
        });
    }
    for (let item of arrImg) {
        // item.path为文件链接地址
        const promise = getImgArrayBuffer(item.path).then((data) => {
            // 下载文件, 并存成ArrayBuffer对象(blob)
            zip.file(item.name, data, {binary: true}); // 逐个添加文件
            cache[item.name] = data;
        });
        promises.push(promise);
    }

    Promise.all(promises).then(() => {
        zip.generateAsync({type: "blob"}).then((content) => {
            // 生成二进制流
            FileSaver.saveAs(content, blogTitle); // 利用file-saver保存文件  自定义文件名
        });
    }).catch((res) => {
        console.log(res)
        alert("文件压缩失败");
    });
}

