<template>
    <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ name }}</label>

        <select
            v-if="type === 'select'"
            v-model="model"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
        >
            <slot />
        </select>

        <textarea
            v-else-if="type === 'textarea'"
            v-model="model"
            rows="3"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
        ></textarea>

        <input
            v-else
            :type="type"
            v-model="model"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
        />

        <small v-if="errMsg" class="block text-red-500 text-xs mt-1 font-medium">{{ errMsg }}</small>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    name: { type: String, required: true },
    type: { type: String, default: "text" },
    errMsg: { type: String, required: false }
});

const model = defineModel({ type: null, required: true });
</script>
