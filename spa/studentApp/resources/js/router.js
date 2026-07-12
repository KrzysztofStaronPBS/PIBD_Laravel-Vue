import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/features/auth.js'

const routes = [
    {
        name: "home",
        path: "/",
        component: () => import("@/views/Home.vue"),
    },
    {
        path: "/dashboard",
        meta: { requiresAuth: true },
        component: () => import("@/views/Dashboard.vue"),
        children: [
            {
                // główny widok dashboardu to lista studentów
                name: "dashboard",
                path: "",
                component: () => import("@/views/students/Index.vue")
            },
            {
                name: "students.create",
                path: "create",
                component: () => import("@/views/students/Form.vue")
            },
            {
                name: "students.edit",
                path: "edit/:id",
                component: () => import("@/views/students/Form.vue"),
                props: true
                // przekazuje :id bezpośrednio jako prop do formularza
            },
            {
                // zarządzanie zadaniami konkretnego studenta (/dashboard/students/:id/tasks)
                name: "students.tasks",
                path: "students/:id/tasks",
                component: () => import("@/views/students/StudentManageTasks.vue"),
                props: true
            },
            {
                // globalna lista zadań (/dashboard/tasks)
                name: "tasks.index",
                path: "tasks",
                component: () => import("@/views/tasks/Index.vue")
            },
            {
                name: "tasks.create",
                path: "tasks/create",
                component: () => import("@/views/tasks/Form.vue")
            },
            {
                name: "tasks.edit",
                path: "tasks/edit/:id",
                component: () => import("@/views/tasks/Form.vue"),
                props: true
            }
        ]
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
