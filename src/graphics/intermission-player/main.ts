import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './main.vue';
import '../_misc/common.css';
import '../_misc/theme';

const app = createApp(App);
const head = createHead();
const pinia = createPinia();

app.use(head);
app.use(pinia);
app.mount('#app');
