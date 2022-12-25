import Layout from '@/layout'
const pre = 'information'
export default [
    {
        path: '/information',
        component: Layout,
        hidden: true,
        meta:{title:'云盘'},
        redirect: `/${pre}/index`,
        children: [
            {
                path: 'index',
                name: `${pre}-index`,
                meta: { title: '云盘首页',activeMenu:`/${pre}`},
                components:{
                    default: () => import('@/views/information/index/index'),
                    
                    
                },
            }
        ]
    }
]
