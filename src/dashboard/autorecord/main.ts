import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import vuetify from '@esa-layouts/dashboard/_misc/vuetify';
import App from './main.vue';

const app = createApp(App);
const head = createHead();

app.use(head);
app.use(vuetify);
app.mount('#app');
