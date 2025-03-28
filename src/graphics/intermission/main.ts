import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './main.vue';
import { createPinia } from 'pinia';

const app = createApp(App);
const head = createHead();
const pinia = createPinia();

app.use(head);
app.use(pinia);
app.mount('#app');
