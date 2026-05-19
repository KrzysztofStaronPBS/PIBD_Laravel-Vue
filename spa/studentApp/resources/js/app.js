import './bootstrap';
import { createApp } from 'vue';
import SpaApp from './SpaApp.vue';

createApp()
    .component('spa', SpaApp)
    .mount('#app');