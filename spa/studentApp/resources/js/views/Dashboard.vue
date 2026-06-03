<template>
    <div>
        Dashboard
        <div v-if="user">Witaj {{ user }}!</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const user = ref(null)

onMounted(async () => {
    try {
        const response = await axios.get('/api/user')
        user.value = response?.data?.name;
    } catch (e) {
        console.log('an error')
    }
})
</script>
