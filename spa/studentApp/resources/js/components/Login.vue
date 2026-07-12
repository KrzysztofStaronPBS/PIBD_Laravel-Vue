<template>
    <div class="mt-12 max-w-md mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 text-center mb-6">Sign In to Your Account</h2>

        <form @submit.prevent="submit" class="space-y-4">
            <FormInput name="email" type="email" v-model="form.email" :errMsg="error" />
            <FormInput name="password" type="password" v-model="form.password" />

            <div class="pt-2">
                <button
                    :disabled="isLoading"
                    type="submit"
                    class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                    {{ isLoading ? `Logging in${dots}` : 'Login' }}
                </button>
            </div>
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
