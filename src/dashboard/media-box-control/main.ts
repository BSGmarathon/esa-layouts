/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from 'vue';
import App from './App.vue';
import { setUpReplicants } from './store';
import vuetify from '../_misc/vuetify';

setUpReplicants().then(() => {
  new Vue({
    vuetify,
    el: '#App',
    render: (h) => h(App),
  });
});
