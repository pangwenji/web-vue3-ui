import Layout from '@/layout'
const pre = 'clouddisk'
export default [
    {
        path: '/clouddisk',
        component: Layout,
        hidden: true,
        meta:{title:'云盘'},
        redirect: `/${pre}/media`,
        children: [
            {
                path: 'media',
                name: `${pre}-media`,
                meta: { title: '云盘资源',activeMenu:`/${pre}`},
                component:() => import('@/views/clouddisk/media/index'),
                redirect: `/${pre}/media/index`,
                children: [
                    {
                        path: 'index',
                        name: `${pre}-index`,
                        meta: { title: '云盘首页'},
                        component: () => import('@/views/clouddisk/assort/index')
                    },
                    {
                        path: 'assort/:assortId/',
                        name: `${pre}-assort`,
                        meta: { title: '文件分类',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/clouddisk/assort/index'),
                        },
                    },
                    {
                        path: 'depot',
                        name: `${pre}-depot`,
                        meta: { title: '回收站',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/clouddisk/depot/index'),
                        },
                    },
                    {
                        path: 'share',
                        name: `${pre}-share`,
                        meta: { title: '分享',activeMenu:`/${pre}`},
                        components:{
                            default: () => import('@/views/clouddisk/share/index'),
                        },
                    },
                    {
                        path: 'folder/:id',
                        name: `${pre}-folder`,
                        meta: { title: '文件夹管理'},
                        component: () => import('@/views/clouddisk/folder/index')
                    },
                ]
            },
        ]
    },
    {
        path: '/fileSharePage',
        name: 'fileSharePage',
        meta: { title: '文件分享'},
        component: () => import('@/views/clouddisk/sharePage/index'),
        hidden: true
    },
]
