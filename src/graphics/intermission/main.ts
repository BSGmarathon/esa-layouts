import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './main.vue';

const app = createApp(App);
const head = createHead();
const pinia = createPinia();

app.use(head);
app.use(pinia);
app.mount('#app');
