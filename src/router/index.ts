import * as VueRouter from 'vue-router'
import { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/index.vue'

const routes: RouteRecordRaw[] = [
  { 
    path: '/',
    component: HomeView,
  },
  { 
    name: '3D',
    path: '/three',
    component: () => import('@/views/three/index.vue'),
  },
  { 
    name: 'test',
    path: '/test',
    component: () => import('@/views/test.vue'),
  }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
})

export default router;