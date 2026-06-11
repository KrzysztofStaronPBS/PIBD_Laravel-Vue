<template>
    <div>
        <form @submit.prevent="submit">
            <FormInput name="email" type="email" v-model="form.email" :errMsg="error" />
            <FormInput name="password" type="password" v-model="form.password" />

            <button
                :disabled="isLoading"
                type="submit"
                class="hover:border-2 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer border p-2 m-2 rounded transition-all duration-200"
            >
                {{ isLoading ? `Logging in${dots}` : 'Login' }}
            </button>
        </form>
    </div>
</template>

<script setup>
import FormInput from '../components/FormInput.vue';
import { reactive, ref, watch } from "vue";
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/features/auth.js';

const router = useRouter();
const { login, isLogged, error, isLoading } = useAuth();

const form = reactive({
    email: '',
    password: '',
});

// lokalny stan do obsługi animacji kropek
const dots = ref('');
let intervalId = null;

// reaktywne śledzenie stanu isLoading dostarczanego z useAuth()
watch(isLoading, (loading) => {
    if (loading) {
        dots.value = '';
        intervalId = setInterval(() => {
            if (dots.value.length < 3) {
                dots.value += '.';
            } else {
                dots.value = '';
            }
        }, 366);
    } else {
        // czyszczenie pamięci po zakończeniu żądania
        clearInterval(intervalId);
        dots.value = '';
    }
});

const submit = async () => {
    await login(form);
    if (isLogged.value) await router.push({ name: 'dashboard' });
};
</script>
