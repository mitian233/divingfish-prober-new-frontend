import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
    {path: '/', name: 'home', component: () => import('../views/homeView/index.vue')},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/notFoundView.vue')}
]

const router = createRouter({history: createWebHistory(), routes})

export default router
