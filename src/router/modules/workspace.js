import Layout from '@/layout'
const pre = 'workspace'
export default [
    {
        path: '/workspace',
        component: Layout,
        hidden: true,
        meta: { title: '用工' },
        redirect: `/${pre}/work`,
        children: [
            {
                path: 'work',
                name: `${pre}-work`,
                meta: { title: '工种首页', activeMenu: `/${pre}` },
                component: () => import('@/views/workspace/index'),
                redirect: `/${pre}/work/type`,
                children: [
                    {
                        path: 'type',
                        name: `${pre}-work_type`,
                        meta: { title: '工种库' },
                        component: () => import('@/views/workspace/work_type/index')
                    },
                    {
                        path: ':id',
                        name: `${pre}-work_detail`,
                        meta: { title: '工种详情' , activeSubMenu: `/${pre}/work/type`},
                        component: () => import('@/views/workspace/work_detail/index')
                    }
                ]
            },
            {
                path: 'recruit',
                name: `${pre}-recruit`,
                meta: { title: '招募首页', activeMenu: `/${pre}` },
                component: () => import('@/views/workspace/index'),
                redirect: `/${pre}/recruit/wall`,
                children: [
                    {
                        path: 'wall',
                        name: `${pre}-recruit_wall`,
                        meta: { title: '招募墙' },
                        component: () => import('@/views/workspace/recruit_wall/index')
                    },
                    {
                        path: ':id',
                        name: `${pre}-recruit-detail`,
                        meta: { title: '招募详情', activeSubMenu: `/${pre}/recruit/wall` },
                        component: () => import('@/views/workspace/recruit_detail/index')
                    }
                ]
            },
            {
                path: 'admin',
                name: `${pre}-admin`,
                meta: { title: '管理首页', activeMenu: `/${pre}` },
                component: () => import('@/views/workspace/index'),
                redirect: `/${pre}/admin/recruit`,
                children: [
                    {
                        path: 'release',
                        name: `${pre}-admin_release`,
                        meta: { title: '发布招募' },
                        component: () => import('@/views/workspace/admin_release/index')
                    },
                    {
                        path: 'recruit',
                        name: `${pre}-admin_recruit`,
                        meta: { title: '招募管理' },
                        component: () => import('@/views/workspace/admin_recruit/index')
                    },
                    {
                        path: 'recruit_console/:id',
                        name: `${pre}-recruit_console`,
                        meta: { title: '招募工作台', activeSubMenu: `/${pre}/admin/recruit`  },
                        component: () => import('@/views/workspace/recruit_console/index')
                    },
                    {
                        path: 'goods',
                        name: `${pre}-admin_goods`,
                        meta: { title: '订单管理' },
                        component: () => import('@/views/workspace/admin_goods/index')
                    },
                    {
                        path: 'goods_detail/:orderNo',
                        name: `${pre}-goods_detail`,
                        meta: { title: '订单详情',activeSubMenu: `/${pre}/admin/goods` },
                        component: () => import('@/views/workspace/goods_detail/index')
                    },
                    {
                        path: 'skill',
                        name: `${pre}-admin_skill`,
                        meta: { title: '技能管理', needAuth: true },
                        component: () => import('@/views/workspace/admin_skill/index')
                    },
                    {
                        path: 'skill_form/:id',
                        name: `${pre}-skill_form`,
                        meta: { title: '技能编辑', needAuth: true, activeSubMenu: `/${pre}/admin/skill` },
                        component: () => import('@/views/workspace/skill_form/index')
                    },
                    {
                        path: 'order',
                        name: `${pre}-admin_order`,
                        meta: { title: '订单管理', needAuth: true },
                        component: () => import('@/views/workspace/admin_order/index')
                    },
                    {
                        path: 'order_detail/:orderNo',
                        name: `${pre}-order_detail`,
                        meta: { title: '订单详情' , needAuth: true, activeSubMenu: `/${pre}/admin/order`},
                        component: () => import('@/views/workspace/order_detail/index')
                    },
                    {
                        path: 'enroll',
                        name: `${pre}-admin_enroll`,
                        meta: { title: '报名管理', needAuth: true },
                        component: () => import('@/views/workspace/admin_enroll/index')
                    },
                    {
                        path: 'attestation',
                        name: `${pre}-admin_attestation`,
                        meta: { title: '工种认证' },
                        component: () => import('@/views/workspace/admin_attestation/index')
                    },
                    {
                        path: 'apply',
                        name: `${pre}-admin_apply`,
                        meta: { title: '申请表单' },
                        component: () => import('@/views/workspace/admin_apply/index')
                    },
                    {
                        path: 'composition/:id',
                        name: `${pre}-upload_composition`,
                        meta: { title: '作品上传', needAuth: false, activeSubMenu: `/${pre}/admin/skill` },
                        component: () => import('@/views/workspace/upload_composition/index')
                    }
                ]
            }
        ]
    },
    {
        path: '/workspace/work/share/:id',
        name: `${pre}-work_share`,
        meta: { title: '工种分享', noLogin: true},
        component: () => import('@/views/workspace/worker_share/index')
    }
]
