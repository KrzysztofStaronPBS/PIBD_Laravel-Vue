<template>
    <div v-if="isOpen && btns" class="modal">

        <div class="modal-content text-center max-w-sm w-full mx-4">

            <div class="w-full text-right">
                <span @click.prevent="resolvePromise(null)" class="cursor-pointer text-gray-400 hover:text-gray-600 font-bold">[X]</span>
            </div>

            <div class="w-full font-bold text-lg text-gray-900 mb-3">{{ title }}</div>
            <div class="text-gray-600 text-sm mb-5 px-2">{{ info }}</div>

            <div class="flex flex-row justify-center items-center flex-wrap">
                <template v-for="(value, name) in btns" :key="name">
                    <button
                        @click.prevent="resolvePromise(name)"
                        class="border-2 border-green-500 text-green-600 hover:bg-green-50 font-bold p-2 m-2 rounded cursor-pointer"
                    >
                        {{ value }}
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const isOpen = ref(false);
const title = ref('');
const info = ref('');
const btns = ref({});

let promiseController = null;

const open = (message, buttons = { close: 'Zamknij' }, windowTitle = 'Komunikat') => {
    info.value = message;
    btns.value = buttons;
    title.value = windowTitle;
    isOpen.value = true;

    return new Promise((resolve) => {
        promiseController = resolve;
    });
};

const resolvePromise = (choice) => {
    isOpen.value = false;
    if (promiseController) promiseController(choice);
};

defineExpose({ open });
</script>

<style scoped>
.modal {

}
.modal-content {

}
</style>
