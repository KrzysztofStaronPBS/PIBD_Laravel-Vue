import './bootstrap';
import { createApp } from 'vue';
import SpaApp from './SpaApp.vue';
import router from "./router.js";

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        // jeśli serwer zwróci błąd 401
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('isLogged');

            // przekierowanie użytkownika na stronę logowania
            if (router.currentRoute.value.path !== '/login') {
                await router.push('/login');
            }
        }
        return Promise.reject(error);
    }
);

createApp(SpaApp)
    .component('spa', SpaApp)
    .use(router)
    .mount('#app');
