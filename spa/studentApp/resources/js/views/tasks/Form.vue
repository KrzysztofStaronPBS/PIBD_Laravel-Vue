<template>
    <div class="mt-4 max-w-xl mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">
                {{ isEditMode ? "Edit Task" : "Create New Task" }}
            </h2>
            <router-link
                :to="{ name: 'tasks.index' }"
                class="text-gray-500 hover:text-gray-700 font-semibold text-sm border p-2 rounded transition-colors"
            >
                Back to List
            </router-link>
        </div>

        <div v-if="error && typeof error === 'string'" class="bg-red-100 text-red-700 p-3 rounded font-bold mb-4">
            {{ error }}
        </div>

        <form @submit.prevent="submit" :class="isLoading ? 'animate-pulse' : ''">
            <FormInput
                name="Task title"
                v-model="form.task_title"
                :errMsg="error?.task_title?.[0]"
            />

            <FormInput
                name="Description"
                type="textarea"
                v-model="form.description"
                :errMsg="error?.description?.[0]"
            />

            <div class="mt-6">
                <button
                    :disabled="isLoading"
                    type="submit"
                    class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 cursor-pointer"
                >
                    {{ isEditMode ? "Update Task" : "Save Task" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useResources } from "../../composables/features/resources.js";
import FormInput from "../../components/FormInput.vue";

const route = useRoute();
const router = useRouter();

const { item, isLoading, error, create, update, getSingle } = useResources("/api/tasks");

// detekcja trybu pracy na podstawie parametru z adresu URL
const taskId = route.params.id;
const isEditMode = computed(() => !!taskId);

const form = ref({
    task_title: "",
    description: "",
});

onMounted(async () => {
    if (isEditMode.value) {
        try {
            await getSingle(taskId);
            if (item.value) {
                form.value = {
                    task_title: item.value.title || item.value.task_title || "",
                    description: item.value.description || "",
                };
            }
        } catch (e) {
            console.error("Failed to fetch task data for editing.");
        }
    }
});

const submit = async () => {
    try {
        if (isEditMode.value) {
            await update(taskId, form.value);
        } else {
            await create(form.value);
        }
        await router.push({name: "tasks.index"});
    } catch (e) {
        console.log("Validation or network error during submission.");
    }
};
</script>
