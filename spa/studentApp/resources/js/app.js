import './bootstrap';
import { createApp } from 'vue';
import SpaApp from './SpaApp.vue';
import router from "./router.js";

createApp(SpaApp)
    .component('spa', SpaApp)
    .use(router)
    .mount('#app');
