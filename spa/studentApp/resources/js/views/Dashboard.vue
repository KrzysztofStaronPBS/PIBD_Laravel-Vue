<template>
    <div>
        Dashboard
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error">An error occurred 🙁 👉 {{ error }}</div>
        <div v-else>Witaj {{ user?.name }}!</div>
        <div v-if="user">Witaj inaczej, Bonjour {{ user?.name }}!</div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '../composables/features/auth.js';
import { useRequest } from '../composables/core/request.js';

const { user } = useAuth();

const { error, isLoading, get } = useRequest();

onMounted(async () => {
    try {
        await get('/api/user');
        // testowanie błędu sieciowego (ERR_CONNECTION_REFUSED) bezpośrednio w Vue
        // await get('http://localhost:9999/api/force-error');
    } catch (e) {
        console.log('an error')
    }
})
</script>
