import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/user'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/user',
                    component: resolve => require(['../components/page/UserList.vue'], resolve),
                    meta: { title: '用户' }
                },
                {
                    path: '/shopinfo',
                    component: resolve => require(['../components/page/ShopInfo.vue'], resolve),
                    meta: { title: '商品详情' }
                },
                {
                    path: '/shoplist',
                    component: resolve => require(['../components/page/ShopList.vue'], resolve),
                    meta: { title: '商品分类' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
