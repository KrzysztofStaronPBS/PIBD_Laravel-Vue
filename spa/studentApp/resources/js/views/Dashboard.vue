<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div v-if="user" class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-4">
            Ahoj {{ user.name }}!
        </div>

        <router-view />
    </div>
</template>

<script setup>
import { useAuth } from "../composables/features/auth.js";
const { user } = useAuth();
</script>
