import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VTimePicker } from 'vuetify/labs/VTimePicker';
import './common.css';

export default createVuetify({
  components: {
    ...components,
    VTimePicker,
  },
  directives,
  theme: {
    defaultTheme: 'dark',
  },
});
