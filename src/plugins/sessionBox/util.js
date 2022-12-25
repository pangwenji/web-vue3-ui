
// 设置显示时间
export const setDateFormat = (time,showTime,showSeconds = true)=>{
    let date = new Date(time);
    let year = date.getFullYear();        //年
    let month = date.getMonth() + 1;      //月
    let day = date.getDate();             //日
    let house = date.getHours();          //小时
    let minute = date.getMinutes();       //分钟
    let seconds = date.getSeconds();       //秒

    let toDate = new Date();
    let toYear = toDate.getFullYear();        //年
    let toMonth = toDate.getMonth() + 1;      //月
    let toDay = toDate.getDate();             //日

    function getZero(num){
        return num >= 10? num : `0${num}`
    }

    if(year !== toYear){
        let text =  year + '-' + getZero(month) + '-' + getZero(day) + ' '
        if(showTime){
            text += getZero(house) + ':' + getZero(minute) ;
        }

        if(showSeconds){
            text += ":" + getZero(seconds)
        }

        return text
    }
    if(day !== toDay || month !== toMonth){
        let text = getZero(month) + '-' + getZero(day) + ' '
        if(showTime){
            text += getZero(house) + ':' + getZero(minute);
        }
        if(showSeconds){
            text += ":" + getZero(seconds)
        }
        return  text
    }

    if(showSeconds){
        return getZero(house) + ":" + getZero(minute) + ":" + getZero(seconds)
    }else{
        return getZero(house) + ":" + getZero(minute)
    }
}

// 获取JSON数据
export const getJsonData = (json)=>{
    try{
        return JSON.parse(json)
    }catch(err){
        return {}
    }
}

/**
 * 秒转时分秒格式
 *
 * @param {Object} result
 */
 export function secondToDate(result) {
    result = Math.ceil(Number(result));
    let h =
      Math.floor(result / 3600) < 10
        ? '0' + Math.floor(result / 3600)
        : Math.floor(result / 3600);
    let m =
      Math.floor((result / 60) % 60) < 10
        ? '0' + Math.floor((result / 60) % 60)
        : Math.floor((result / 60) % 60);
    let s =
      Math.floor(result % 60) < 10
        ? '0' + Math.floor(result % 60)
        : Math.floor(result % 60);
    if (h != 0) {
      return (result = h + ':' + m + ':' + s);
    } else {
      return m + ':' + s;
    }
  }

// 通过文件名获取文件类型
export const getFileType = (fileName)=>{
    const imageTypes = /.(jpg|png|webp|gif|jpeg|gif)$/;
    const audioTypes = /.(aac|flac|m4a|mp3|ogg|wav|ac3)$/;
    const videoTypes = /.(avi|mpg|wmv|mpeg|mp4|mov|mkv|flv|f4v|m4v|rmvb|rm|3gp|dat|ts|mts|vob|mxf)$/;
    if(imageTypes.test(fileName)){
        return 'image'
    }
    if(audioTypes.test(fileName)){
        return 'audio'
    }
    if(videoTypes.test(fileName)){
        return 'video'
    }
    return 'file'
}