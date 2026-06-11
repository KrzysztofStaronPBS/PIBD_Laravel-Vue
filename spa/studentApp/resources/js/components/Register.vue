<template>
    <div>
        <form @submit.prevent="submit">
            <FormInput name="name" v-model="form.name" :errMsg="errors?.name?.[0]" />
            <FormInput name="email" type="email" v-model="form.email" :errMsg="errors?.email?.[0]" />
            <FormInput name="password" type="password" v-model="form.password" :errMsg="errors?.password?.[0]" />
            <FormInput name="password confirmation" type="password" v-model="form.password_confirmation" />
            <button type="submit" class="hover:border-2 disabled:text-gray-200 cursor-pointer border p-2 m-2 rounded">
                Register
            </button>
        </form>
    </div>
</template>

<script setup>
import FormInput from '../components/FormInput.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/features/auth.js';

const router = useRouter();
const { register } = useAuth();

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
