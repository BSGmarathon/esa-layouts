import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import vuetify from '@esa-layouts/dashboard/_misc/vuetify';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const head = createHead();
const pinia = createPinia();

app.use(head);
app.use(vuetify);
app.use(pinia);
app.mount('#app');
