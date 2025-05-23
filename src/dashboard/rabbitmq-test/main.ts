import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import vuetify from '@esa-layouts/dashboard/_misc/vuetify';
import App from './App.vue';

const config = nodecg.bundleConfig;

const app = createApp(App, {
  enabled: config.rabbitmq.enabled,
  useTestData: config.useTestData,
});
const head = createHead();

app.use(head);
app.use(vuetify);
app.mount('#app');
