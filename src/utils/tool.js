/**
 * 计算距离当前时间
 * @param {*} oldDate 传入时间戳
 * @returns
 */
export function computedTime(oldDate) {
  let returnText = '';
  const nowDate = new Date().getTime(); //当前时间
  var times = Math.floor((nowDate - new Date(oldDate).getTime()) / 1000);
  if (times > 60 * 60 * 24 * 365) {
    returnText = Math.floor(times / (60 * 60 * 24 * 365)) + '年前';
  } else if (times > 60 * 60 * 24 * 30) {
    returnText = Math.floor(times / (60 * 60 * 24 * 30)) + '个月前';
  } else if (times > 60 * 60 * 24 * 7) {
    returnText = Math.floor(times / (60 * 60 * 24 * 7)) + '周前';
  } else if (times > 60 * 60 * 24) {
    returnText = Math.floor(times / (60 * 60 * 24)) + '天前';
  } else if (times > 60 * 60) {
    returnText = Math.floor(times / (60 * 60)) + '小时前';
  } else if (times > 60) {
    returnText = Math.floor(times / 60) + '分钟前';
  } else if (times > 0) {
    returnText = Math.floor(times / 1) + '秒前';
  } else {
    returnText = '1秒前';
  }
  return returnText;
}
/**
 * 秒转时分秒格式
 *
 * @param {Object} result
 */
export function secondToDate(result) {
  result = Math.round(Number(result));
  let h =
    Math.floor(result / 3600) < 10
      ? '0' + Math.floor(result / 3600)
      : Math.floor(result / 3600) || '--';
  let m =
    Math.floor((result / 60) % 60) < 10
      ? '0' + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60) || '--';
  let s =
    Math.floor(result % 60) < 10
      ? '0' + Math.floor(result % 60)
      : Math.floor(result % 60) || '--';
  if (h != 0) {
    return (result = h + ':' + m + ':' + s);
  } else {
    return m + ':' + s;
  }
}

// 文件大小格式
export function formatSize(size){
  let prefix = ''
  if(size < 0 ){
    size = -1*size;
    prefix = '-'
  }
  var i, unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  for (i = 0; i < unit.length && size >= 1024; i++) {
      size /= 1024;
  }
  return prefix + (Math.round(size * 100) / 100 || 0) + unit[i];
}

/**
 * 根据rul下载文件
 * @param {*} url 资源url
 * @param {*} name 文件名
 */
export async function downloadFile(url, name) {
  return new Promise((resolve,reject)=>{
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
    resolve();
  })

  // let xml = new XMLHttpRequest()
  // xml.open('GET', url, true)
  // xml.responseType = 'blob'
  // xml.onload = function() {
  //   let url = window.URL.createObjectURL(xml.response)
  //   let a = document.createElement('a')
  //   a.href = url
  //   a.download = name
  //   a.click()
  // }
  // xml.send()

  //有时候a.download设置文件名失效，就改成了上面
  // let a = document.createElement('a')
  // a.href = url
  // a.download = name
  // document.body.appendChild(a)
  // a.click()
  // //移除
  // document.body.removeChild(a)
}
/**
 * 根据rul下载文件(在当前页下载）
 * @param {*} url 资源url
 * @param {*} name 文件名
 */
export async function downloadFileCurrent(url, name) {
    return new Promise((resolve, reject) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
        resolve();
    })
}
/**
 * 秒转时时间码
 *
 * @param {Object} time
 */
 export function timeCodeFormat(time) {
  const timeArr = (time + '').split('.')
  const intTime = timeArr[0] || 0
  const decTime = (timeArr[1] || '00') + ''
  let h =
    Math.floor(intTime / 3600) < 10
      ? '0' + Math.floor(intTime / 3600)
      : Math.floor(intTime / 3600) || '--';
  let m =
    Math.floor((intTime / 60) % 60) < 10
      ? '0' + Math.floor((intTime / 60) % 60)
      : Math.floor((intTime / 60) % 60) || '--';
  let s =
    Math.floor(intTime % 60) < 10
      ? '0' + Math.floor(intTime % 60)
      : Math.floor(intTime % 60) || '--';
  return h + ':' + m + ':' + s + ':' + decTime.slice(0,2);
}

/**
 * 表格时间格式化
 */
 export function formatDate(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  var date = new Date(cellValue)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
/**
 * 时间格式化
 */
 export function formatSurplusTime(value) {
  if(value < 1000){ //毫秒
      // return `${value}ms`
      return '1秒'
  }else{
    const second = Math.floor( value / 1000 )
    const minute = Math.floor( second / 60 );
    const hours = Math.floor( minute / 60 );
    const date = Math.floor( hours / 24 );
    const month = Math.floor( date / 30 );
    const year = Math.floor( month / 12 );
    let content = '';
    if(year && year > 0){
      content += `${year}年`
    }
    if(month && month > 0){
      content += `${month}个月`
    }
    if(date && date > 0){
      content += `${date}天`
    }
    if(hours && hours > 0){
      content += `${hours}小时`
    }
    if(minute && minute > 0){
      content += `${minute}分钟`
    }
    if(second && second > 0){
      content += `${second}秒`
    }
    return content;
  }
}

/**
 * @param url  图片url
 * @param imgWidth ref 对象
 * @param imgHeight ref 对象
 */
export function getImgResolution(url,imgWidth,imgHeight){
    let image = new Image();
    image.src = url
    // 如果有缓存，读缓存
    if(image.complete){
        imgWidth.value = image.width;  // 图片宽度
        imgHeight.value = image.height; // 图片高度
    }else { //否则加载图片
        image.onload = function() {
            imgWidth.value = image.width;   // 图片宽度
            imgHeight.value = image.height;  // 图片高度
            image.onload = null;   // 避免重复加载
        };
    }
}


export const getStringTime = (time) => {
    let minute = parseInt(time / 60)
    if (minute < 10) {
        minute = '0' + minute
    }
    let second = parseInt(time % 60)
    if (second < 10) {
        second = '0' + second
    }
    return minute + ':' + second
}

export function getRatio() {
  let ratio = 0
  const screen = window.screen
  const ua = navigator.userAgent.toLowerCase()

  if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    if(screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI
    }
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth
  }

  // if (ratio) {
  //   ratio = Math.round(ratio*100)
  // }
  return ratio
}

/**
 * @param url  图片url
 * @param back
 */
export function getImgResolutionString(url,back){
    let imgWidth="0"
    let imgHeight="0"
    let image = new Image();
    image.src = url
    // 如果有缓存，读缓存
    if(image.complete){
        imgWidth = image.width;  // 图片宽度
        imgHeight = image.height; // 图片高度
    }else { //否则加载图片
        image.onload = function() {
            imgWidth = image.width;   // 图片宽度
            imgHeight = image.height;  // 图片高度
            image.onload = null;   // 避免重复加载
            back(imgWidth,imgHeight)
        };
    }
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
