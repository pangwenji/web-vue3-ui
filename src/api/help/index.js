import request from '@/utils/request'
const prefix = '/base/article';


// 获取文章分类信息
export const getCategoryList= (data) => {
  return request({
    url: `${prefix}/getCategoryList`,
    headers: {
      isToken: false
    },
    params: data,
  })
}

// 获取文章列表
export const getArticleList= (data) => {
  return request({
    url: `${prefix}/getArticleList`,
    headers: {
      isToken: false
    },
    params: data,
  })
}

// 获取文章详情
export const getArticle= (data) => {
  return request({
    url: `${prefix}/getArticle`,
    headers: {
      isToken: false
    },
    params: data,
  })
}

// 获取文章专题
export const getSpecialRelation = (data) => {
  return request({
    url: `/base/specialRelation`,
    headers: {
      isToken: true
    },
    params: data,
  })
}


