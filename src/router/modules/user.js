import Layout from '@/layout'
const pre = 'user'
export default [
    {
        path: '/user',
        component: Layout,
        hidden: true,
        meta:{title:'用户'},
        // redirect: `/${pre}/center/account`,
        redirect: `/${pre}/center/wallet`,
        children: [
            {
                path: 'center',
                name: `${pre}-center`,
                meta: { title: '用户中心'},
                components:{
                    default: () => import('@/views/user/index'),


                },
                children:[
                    {
                        path: 'setting',
                        name: `${pre}-setting`,
                        meta: { title: '账号设置'},
                        components:{
                            default: () => import('@/views/user/setting/index'),


                        },
                    },
                    {
                        path: 'wallet',
                        name: `${pre}-wallet`,
                        meta: { title: '我的钱包'},
                        components:{
                            default: () => import('@/views/user/wallet/index'),


                        },
                    },
                    {
                        path: 'order',
                        name: `${pre}-order`,
                        meta: { title: '我的订单'},
                        components:{
                            default: () => import('@/views/user/order/index'),


                        },
                    },
                    {
                        path: 'space',
                        name: `${pre}-space`,
                        meta: { title: '空间容量'},
                        components:{
                            default: () => import('@/views/user/space/index'),
                        },
                    },
                    {
                        path: 'packing',
                        name: `${pre}-packing`,
                        meta: { title: '容量包'},
                        components:{
                            default: () => import('@/views/user/space/packingPage'),
                        },
                    },
                    {
                        path: 'member',
                        name: `${pre}-member`,
                        meta: { title: '会员服务'},
                        components:{
                            default: () => import('@/views/user/member/index'),


                        },
                    },
                    {
                        path: 'fapiao',
                        name: `${pre}-fapiao`,
                        meta: { title: '发票管理'},
                        components:{
                            default: () => import('@/views/user/fapiao/index'),


                        },
                    },
                    {
                        path: 'profile',
                        name: `${pre}-profile`,
                        meta: { title: '个人主页'},
                        components:{
                            default: () => import('@/views/user/profile/index'),


                        },
                    },
                    {
                        path: 'account',
                        name: `${pre}-account`,
                        meta: { title: '个人中心'},
                        components:{
                            default: () => import('@/views/user/account/index'),


                        },
                    },
                    {
                        path: 'invite',
                        name: `${pre}-invite`,
                        meta: { title: '我的推广'},
                        components:{
                            default: () => import('@/views/user/invite/index'),


                        },
                    },
                    {
                        path: 'promote',
                        name: `${pre}-promote`,
                        meta: { title: '我的推广new'},
                        components:{
                            default: () => import('@/views/user/promote/index'),
                        },
                    }
                ]
            }
        ]
    }
]
