<template>
    <div class="ml-2.5 mt-2.5">
        <p>SPA app welcome!</p>
        <div class="space-x-3 bg-sky-50 font-bold my-2 p-2 rounded">
            <router-link :to="{ name: 'home' }">Home</router-link>
            <template v-if="isLogged">
                <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
                <a @click.prevent="logout" href>Logout</a>
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
import {ref, onMounted, watch, provide} from 'vue'
import Popup from './components/Popup.vue';

const router = useRouter()
const route = useRoute()
const isLogged = ref(false)
const popupRef = ref(null);

provide('popupService', (info, btns, title) => {
    if (popupRef.value) {
        return popupRef.value.open(info, btns, title);
    }
    return Promise.resolve('close');
});

const checkLoginStatus = () => {
    isLogged.value = localStorage.getItem('isLogged') === 'true';
};

onMounted(() => { checkLoginStatus(); });

watch(() => route.path, () => { checkLoginStatus(); });

// logika wylogowania
const logout = async () => {
    try {
        const response = await axios.post('/api/logout')
    } catch (e) {
        console.log('an error')
    }
    localStorage.setItem("isLogged", "false")
    isLogged.value = false
    if (route.name !== 'home') {
        router.push({ name: 'home', })
    }
}
</script>
