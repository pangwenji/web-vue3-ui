import Layout from '@/layout'
const pre = 'copyright'
export default [
  {
    path: '/copyright',
    component: Layout,
    hidden: true,
    meta: { title: '版权' },
    redirect: `/${pre}/certificate`,
    children: [
      {
        path: 'certificate',
        name: `${pre}-index`,
        meta: { title: '版权存证', activeMenu: `/copyright` },
        component: () => import('@/views/copyright/index'),
        redirect: `/${pre}/certificate/index`,
        children: [
          {
            path: 'index',
            name: `${pre}-index`,
            meta: { title: '存证列表' , activeMenu: `/copyright`},
            component: () => import('@/views/copyright/certificate/index')
          },
          {
            path: 'new',
            name: `${pre}-new`,
            meta: { title: '新建存证', activeMenu: `/copyright` },
            component: () => import('@/views/copyright/certificate/new')
          },
          {
            path: 'details/:id',
            name: `${pre}-details`,
            meta: { title: '存证详情', activeMenu: `/copyright` },
            component: () => import('@/views/copyright/certificate/details')
          },
        ]
      }
    ]
  }
]