import { createApp } from 'vue';
import { createWebHashHistory, createRouter } from 'vue-router';
import '../_misc/common.css';
import '../_misc/theme';
import * as List from './list';
import App from './main.vue';
import { createHead } from '@vueuse/head';

const routes = [
  {
    name: '4:3 1 Player',
    path: '/4x3-1p',
    component: List.L_4x3_1p,
  },
  {
    name: '4x3 1 Player (Large Camera)',
    path: '/4x3-1p-largecam',
    component: List.L_4x3_1p_LargeCam,
  },
  {
    name: '4:3 2 Player',
    path: '/4x3-2p',
    component: List.L_4x3_2p,
  },
  {
    name: '4:3 2P with tracker (16x9-2p-c)',
    path: '/16x9-2p-c',
    component: List.L_16x9_2p_c,
  },
  {
    name: '4:3 3 Player',
    path: '/4x3-3p',
    component: List.L_4x3_3p,
  },
  {
    name: '16:9 1 Player',
    path: '/16x9-1p',
    component: List.L_16x9_1p,
  },
  {
    name: '16:9 1 Player (Large Camera)',
    path: '/16x9-1p-largecam',
    component: List.L_16x9_1p_LargeCam,
  },
  {
    name: '16:9 2 Player',
    path: '/16x9-2p',
    component: List.L_16x9_2p,
  },
  {
    name: '16:9 3 Player',
    path: '/16x9-3p',
    component: List.L_16x9_3p,
  },
  {
    name: 'GameBoy 1 Player',
    path: '/GB-1p',
    component: List.L_GB_1p,
  },
  {
    name: 'GameBoy 2 Player',
    path: '/GB-2p',
    component: List.L_GB_2p,
  },
  {
    name: 'GBA 1 Player',
    path: '/GBA-1p',
    component: List.L_GBA_1p,
  },
  {
    name: 'GBA 2 Player',
    path: '/GBA-2p',
    component: List.L_GBA_2p,
  },
  {
    name: '3DS 1 Player',
    path: '/3DS-1p',
    component: List.L_3DS_1p,
  },
  {
    name: '3DS 1 Player Vertical',
    path: '/3DSV-1p',
    component: List.L_3DSV_1p,
  },
  {
    name: '3DS 2 Player',
    path: '/3DS-2p',
    component: List.L_3DS_2p,
  },
  {
    name: 'DS 1 Player',
    path: '/DS-1p',
    component: List.L_DS_1p,
  },
  {
    name: 'DS 1 Player Vertical',
    path: '/DSV-1p',
    component: List.L_DSV_1p,
  },
  {
    name: 'DS 2 Player',
    path: '/DS-2p',
    component: List.L_DS_2p,
  },
  {
    name: 'Full Camera',
    path: '/full-cam',
    component: List.L_FullCam,
  },
  {
    path: '*',
    redirect: '/4x3-1p',
  },
];

const head = createHead();
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// TODO: do we still need to wait for replicants?
const app = createApp(App);
app.use(router);
app.use(head);
app.mount('#app');
