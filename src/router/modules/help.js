import Layout from '@/layout'
const pre = 'help'
export default [
    {
        path: '/help',
        name: 'help',
        component:()=> import('@/views/help/index/index'),
        hidden: true,
        meta:{title:'帮助文档'},
        children: [
            {
                path: 'index',
                name: `${pre}-index`,
                meta: { title: '使用指南',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/help/guide/index'),
                },
            },
            {
                path: 'guide',
                name: `${pre}-index`,
                meta: { title: '使用指南',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/help/guide/index'),
                },
            },
            {
                path: 'member',
                name: `${pre}-member`,
                meta: { title: '会员介绍',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/help/member/index'),
                },
            },
            {
                path: 'videoDemo',
                name: `${pre}-videoDemo`,
                meta: { title: '视频演示',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/help/videoDemo/index'),
                },
            },
            {
                path: 'aboutMe',
                name: `${pre}-aboutMe`,
                meta: { title: '关于我们',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/help/aboutMe/index'),
                },
            },

        ]
    }
]
