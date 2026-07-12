<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div v-if="user" class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-4">
            Ahoj {{ user.name }}!
        </div>

        <div class="border-b border-gray-200 mb-6">
            <nav class="flex space-x-8" aria-label="Tabs">
                <router-link
                    :to="{ name: 'dashboard' }"
                    class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer underline-offset-8"
                    active-class=""
                    exact-active-class="underline decoration-sky-500 decoration-2 text-sky-600 font-semibold"
                >
                    👨‍🎓 Students List
                </router-link>

                <router-link
                    :to="{ name: 'tasks.index' }"
                    class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer underline-offset-8"
                    active-class="underline decoration-sky-500 decoration-2 text-sky-600 font-semibold"
                >
                    📋 Tasks List
                </router-link>
            </nav>
        </div>

        <router-view />
    </div>
</template>

<script setup>
import { useAuth } from "../composables/features/auth.js";
const { user } = useAuth();
</script>
