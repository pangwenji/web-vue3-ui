// 获取assets静态资源
const getAssetsFile = function (url){
    // console.log('url===============', url);
    // 获取文件夹下所有图片名称
    let files = import.meta.globEager("../../assets/images/FileType/*.png");
    let AllPics = Object.values(files).map((v) => v.default);
    // console.log('AllPics===============', AllPics);
    let isExist = 0;
    let imgSrc = '';
    // 遍历所有图片，判断是否存在该url图片
    AllPics.forEach( val => {
      let url2 = url.substring(0, url.indexOf('.'));
      // console.log('url2===============', url2);
      if(url2&&val.indexOf(url2) !== -1) {
        isExist += 1;
      }
    });
    // console.log('isExist===============', isExist);
    if (isExist !== 0) {
      // 图片存在
      imgSrc = url;
    } else {
      imgSrc = 'default.png';
    }
    // console.log('imgSrc===============', imgSrc);
    return new URL(`../../assets/images/FileType/${imgSrc}`, import.meta.url).href;
  };
  export default getAssetsFile