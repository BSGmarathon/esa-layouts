/* eslint-disable @typescript-eslint/no-var-requires */

const { theme } = nodecg.bundleConfig.event;
const { default: defaultTheme } = require('./themes/default.theme.css');
const { default: bsgTheme } = require('./themes/bsg.theme.css');

defaultTheme.use();

if (theme === 'bsg') {
  bsgTheme.use();
}
