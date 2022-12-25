export function getAudioDuration(url) {
    return new Promise((resolve, reject) => {
        try {
            let audioElement = new Audio(url);
            audioElement.addEventListener("loadedmetadata", () => {
                let time = audioElement.duration;
                resolve(time)
            });
            audioElement.addEventListener('error', () => {
                reject(-1);
            })
        } catch (e) {
            reject(-1);
        }

    })
}


export function requestBlob(url) {
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
                resolve(URL.createObjectURL(res))
                // console.log(res)
            }
        }).catch(res => {
            console.log("读取错误！")
        }).catch(res => {
            console.log("请求错误！")
        });
        // let blob;
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        //         blob = xhr.response;
        //         console.log(xhr.response, typeof xhr.response);
        //         if (blob != undefined) {
        //             resolve(URL.createObjectURL(blob))
        //         }
        //     }
        // }
        // xhr.open('GET', url);
        // xhr.responseType = 'blob';
        // xhr.send();
    })
}
