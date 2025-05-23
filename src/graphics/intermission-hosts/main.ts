import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './main.vue';
import '../_misc/common.css';
import '../_misc/theme';

const app = createApp(App);
const head = createHead();

app.use(head);
app.mount('#app');
