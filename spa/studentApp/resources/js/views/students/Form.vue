<template>
    <div class="mt-4 max-w-xl mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">
                {{ isEditMode ? "Edit Student" : "Create New Student" }}
            </h2>
            <router-link
                :to="{ name: 'dashboard' }"
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
                name="First name"
                v-model="form.first_name"
                :errMsg="error?.first_name?.[0]"
            />

            <FormInput
                name="Last name"
                v-model="form.last_name"
                :errMsg="error?.last_name?.[0]"
            />

            <FormInput
                name="Index"
                v-model="form.index"
                :errMsg="error?.index?.[0]"
            />
            <FormInput
                name="E-mail"
                v-model="form.email"
                :errMsg="error?.email?.[0]"
            />

            <FormInput
                name="Age"
                type="number"
                v-model="form.age"
                :errMsg="error?.age?.[0]"
            />

            <FormInput
                name="Description"
                type="textarea"
                v-model="form.description"
                :errMsg="error?.description?.[0]"
            />

            <div class="mb-4 flex items-center">
                <input
                    id="paid"
                    type="checkbox"
                    v-model="form.paid"
                    class="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <label for="paid" class="ml-2 block text-sm font-medium text-gray-700 select-none">
                    Paid?
                </label>
            </div>

            <div class="mt-6">
                <button
                    :disabled="isLoading"
                    type="submit"
                    class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 cursor-pointer"
                >
                    {{ isEditMode ? "Update Student Data" : "Save Student" }}
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

const { item, isLoading, error, create, update, getSingle } = useResources("/api/students");

// detekcja trybu pracy na podstawie parametru z adresu URL
const studentId = route.params.id;
const isEditMode = computed(() => !!studentId);

const form = ref({
    first_name: "",
    last_name: "",
    index: "",
    email: "",
    age: 18,
    description: "",
    paid: false,
});

onMounted(async () => {
    if (isEditMode.value) {
        try {
            await getSingle(studentId);
            if (item.value) {
                form.value = {
                    first_name: item.value.first_name || "",
                    last_name: item.value.last_name || "",
                    index: item.value.index || "",
                    email: item.value.email || "",
                    age: item.value.age || 18,
                    description: item.value.description || "",
                    paid: !!item.value.paid,
                };
            }
        } catch (e) {
            console.error("Failed to fetch student data for editing.");
        }
    }
});

const submit = async () => {
    try {
        if (isEditMode.value) {
            await update(studentId, form.value);
        } else {
            await create(form.value);
        }
        await router.push({name: "dashboard"});
    } catch (e) {
        console.log("Validation or network error during submission.");
    }
};
</script>
