import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/features/auth.js'

const routes = [
    {
        name: "home",
        path: "/",
        component: () => import("@/views/Home.vue"),
    },
    {
        name: "dashboard",
        path: "/dashboard",
        meta: { requiresAuth: true },
        component: () => import("@/views/Dashboard.vue")
    },
    {
        name: "register",
        path: "/register",
        meta: { requiresGuest: true },
        component: () => import("@/views/Register.vue"),
    },
    {
        name: "login",
        path: "/login",
        meta: { requiresGuest: true },
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

// strażnik nawigacji
router.beforeEach((to, from, next) => {
    // sprawdzenie stanu bezpośrednio z localStorage
    const { isLogged } = useAuth();

    if (to.meta.requiresAuth && !isLogged.value) {
        // jeśli chronione, a użytkownik jest niezalogowany -> login
        next({ name: 'login' });
    } else if (to.meta.requiresGuest && isLogged.value) {
        // jeśli tylko dla gości, a użytkownik jest zalogowany -> dashboard
        next({ name: 'dashboard' });
    } else {
        next();
    }
});

export default router
