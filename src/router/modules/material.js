import Layout from '@/layout'
const pre = 'material'
export default [
    {
        path: '/material',
        component: Layout,
        hidden: true,
        meta:{title:'素材'},
        redirect: `/${pre}/main`,
        children: [
            {
                path: 'main',
                name: `${pre}-index`,
                meta: { title: '素材',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/material/index/index'),


                },
                redirect: `/${pre}/main/index`,
                children: [
                    {
                        path: 'index',
                        name: `${pre}-IndexPage`,
                        meta: { title: '素材首页'},
                        component: () => import('@/views/material/index/indexPage')
                    },
                    {
                        path: 'purchased',
                        name: `${pre}-purchased`,
                        meta: { title: '已购素材',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/purchased/index'),


                        },
                    },
                    {
                        path: 'orders',
                        name: `${pre}-orders`,
                        meta: { title: '购买订单',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/orders/index'),


                        },
                    },
                    {
                        path: 'myCollection',
                        name: `${pre}-myCollection`,
                        meta: { title: '我的收藏',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/myCollection/index'),


                        },
                    },
                    {
                        path: 'shoppingCart',
                        name: `${pre}-shoppingCart`,
                        meta: { title: '购物车',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/shoppingCart/index'),


                        },
                    },
                    {
                        path: 'sale',
                        name: `${pre}-sale`,
                        meta: { title: '素材销售',activeMenu:`/${pre}`},

                        components:{
                            default: () => import('@/views/material/sale/index'),


                        },
                    },
                    {
                        path: 'depotMaterial',
                        name: `${pre}-depotMaterial`,
                        meta: { title: '仓库中的素材',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/depotMaterial/index'),


                        },
                    },
                    {
                        path: 'releaseMaterial',
                        name: `${pre}-releaseMaterial`,
                        meta: {title: '上传素材', activeMenu: `/${pre}`},
                        components: {
                            default: () => import('@/views/material/releaseMaterial/index'),


                        }
                    },
                    {
                        path: 'sellMaterial',
                        name: `${pre}-sellMaterial`,
                        meta: { title: '销售中的素材',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/sellMaterial/index'),


                        },
                    },
                    {
                        path: 'details/:id',
                        name: `${pre}-details`,
                        meta: { title: '素材详情',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/details/index'),


                        },
                    },
                    {
                        path: 'releaseMaterial',
                        name: `${pre}-releaseMaterial`,
                        meta: { title: '发布素材',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/material/releaseMaterial/index'),


                        },
                    }
                ]
            },


        ]
    }
]
