import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        name: "home",
        path: "/",
        component: () => import("@/views/Home.vue"),
    },
    {
        name: "dashboard",
        path: "/dashboard",
        component: () => import("@/views/Dashboard.vue")
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/views/Register.vue"),
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/Login.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/404.vue"),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'underline decoration-sky-500 decoration-2 underline-offset-8 text-sky-600'
})

export default router
