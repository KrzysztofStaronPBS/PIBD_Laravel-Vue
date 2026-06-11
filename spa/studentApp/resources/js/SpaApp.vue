<template>
    <div class="ml-2.5 mt-2.5">
        <p>SPA app welcome!</p>
        <div class="space-x-3 bg-sky-50 font-bold my-2 p-2 rounded">
            <router-link :to="{ name: 'home' }">Home</router-link>
            <template v-if="isLogged">
                <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
                <a @click.prevent="handleLogout" class="cursor-pointer" href="#">Logout</a>
            </template>
            <template v-else>
                <router-link to="/register">Register</router-link>
                <router-link :to="{ name: 'login' }">Login</router-link>
            </template>
        </div>
        <router-view />

        <Popup ref="popupRef" />
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, provide } from 'vue'
import Popup from './components/Popup.vue';
import { useAuth } from './composables/features/auth.js'

const router = useRouter()
const route = useRoute()
const popupRef = ref(null);

const { isLogged, logout, setUserState } = useAuth()

provide('popupService', (info, btns, title) => {
    if (popupRef.value) {
        return popupRef.value.open(info, btns, title);
    }
    return Promise.resolve('close');
});

onMounted(() => {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error?.response?.status === 401) {
                setUserState(false);
                if (route.name !== 'login') {
                    router.push({ name: 'login' });
                }
            }
            return Promise.reject(error);
        }
    );
});

const handleLogout = async () => {
    await logout();

    if (route.name !== 'home') {
        await router.push({ name: 'home' });
    }
}
</script>
