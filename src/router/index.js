import {createWebHistory, createRouter, createWebHashHistory} from 'vue-router'
import routes from './routes'

export const constantRoutes = routes

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;
