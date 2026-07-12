<template>
    <div class="mt-12 max-w-md mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 text-center mb-6">Create New Account</h2>

        <form @submit.prevent="submit" class="space-y-4">
            <FormInput name="name" v-model="form.name" :errMsg="errors?.name?.[0]" />
            <FormInput name="email" type="email" v-model="form.email" :errMsg="errors?.email?.[0]" />
            <FormInput name="password" type="password" v-model="form.password" :errMsg="errors?.password?.[0]" />
            <FormInput name="password confirmation" type="password" v-model="form.password_confirmation" />

            <div class="pt-2">
                <button
                    type="submit"
                    class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 cursor-pointer text-sm"
                >
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import FormInput from '../components/FormInput.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/features/auth.js';

const router = useRouter();
const { register, errors } = useAuth();

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = async () => {
    const success = await register(form);
    if (success) await router.push({ name: 'login' });
};
</script>
