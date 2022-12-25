import Layout from '@/layout'
const pre = 'project'
export default [
    {
        path: '/project',
        component: Layout,
        hidden: true,
        meta:{title:'项目'},
        redirect: `/${pre}/index`,
        children: [
            {
                path: 'index',
                name: `${pre}-index`,
                meta: { title: '项目首页',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/project/index/index'),
                    
                    
                },
                children:[
                    {
                        path:':id',
                        name:`${pre}-projectId`,
                        meta: { title: '项目首页'},
                        redirect:{name: `${pre}-file`},
                        components:{
                            default: () => import('@/views/project/index/MainBody'),
                            header: () => import('@/views/project/index/HeaderBody'),
                        },
                        children:[
                            {
                                path:'file',
                                name:`${pre}-file`,
                                meta: { title: '项目首页'},
                                component:() => import('@/views/project/index/projectBody/BodyContent')
                            },
                            {
                                path:'share',
                                name:`${pre}-share`,
                                meta: { title: '项目分享'},
                                component:() => import('@/views/project/index/projectShare')
                            },
                            {
                                path:'collection',
                                name:`${pre}-collection`,
                                meta: { title: '项目收集'},
                                component:() => import('@/views/project/index/projectCollection')
                            },
                            {
                                path:'recover',
                                name:`${pre}-recover`,
                                meta: { title: '项目回收站'},
                                component:() => import('@/views/project/index/projectRecover')
                            },

                        ]
                    },
                ]
            },
        ]
    },
    {
        path: '/collectPage',
        name: 'collectPage',
        meta: { title: '文件收集'},
        component: () => import('@/views/project/collect/index'),
        hidden: true
    },
    {
        path: '/sharePage',
        name: 'sharePage',
        meta: { title: '文件分享'},
        component: () => import('@/views/project/share/index'),
        hidden: true
    },
    {
        path: '/invitePage',
        name: 'invitePage',
        meta: { title: '邀请成员'},
        component: () => import('@/views/project/invite/index'),
        hidden: true
    },
]