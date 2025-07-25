import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import NodeCGPlugin from 'vite-plugin-nodecg';

// Getting __dirname with ES Modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Temp workaround for vite-plugin-nodecg having the wrong default
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    // quasar({ autoImportComponentCase: 'pascal' }), // TODO: fails to find 'quasar/src/css/variables.sass'
    checker({ vueTsc: { tsconfigPath: 'tsconfig.browser.json' } }),
    NodeCGPlugin({
      inputs: {
        'graphics/*/main.ts': './src/graphics/template.html',
        'dashboard/*/main.ts': './src/dashboard/template.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@esa-layouts': `${__dirname}/src/`,
    },
  },
});
