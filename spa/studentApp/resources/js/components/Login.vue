<template>
    <div>
        <form @submit.prevent="submit">
            <FormInput name="email" type="email" v-model="form.email" :errMsg="error" />
            <FormInput name="password" type="password" v-model="form.password" />
            <button type="submit" class="hover:border-2 disabled:text-gray-200 cursor-pointer border p-2 m-2 rounded">
                Login
            </button>
        </form>
    </div>
</template>

<script setup>
import FormInput from '../components/FormInput.vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const error = ref(null)
const form = reactive({
    email: null,
    password: null,
})
const submit = async () => {
    try {
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/api/login', form)
        localStorage.setItem('isLogged', 'true');
        await router.push('/dashboard')
    } catch (e) {
        if (e.response.status == 401) {
            error.value = e.response.data.message;
        } else { console.log('an error occurred') }
    }
}
</script>
