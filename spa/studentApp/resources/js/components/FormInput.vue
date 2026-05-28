<template>
    <div class="p-2">
        <label class="block">{{ name }}</label>
        <input :type="type" v-model="model" class="border" />
        <small class="block text-red-500">{{ errMsg }}</small>
    </div>
</template>

<script setup>
import { defineProps} from 'vue';

defineProps({
    name: { type: String, required: true },
    type: { type: String, default: "text" },
    errMsg: { type: String, required: false }
})
// od wersji Vue 3.4
const model = defineModel({ type: null, required: true })
</script>
