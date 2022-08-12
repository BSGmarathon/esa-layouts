/* eslint-disable @typescript-eslint/no-var-requires */

const { default: defaultTheme } = require('./themes/default.theme.css');
const { default: bsgTheme } = require('./themes/bsg_general.theme.css');
const { default: bsg2 } = require('./themes/bsg.theme.css');

// TODO: Merge the bsg themes
defaultTheme.use();
bsgTheme.use();
bsg2.use();
