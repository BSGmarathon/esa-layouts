/* eslint-disable @typescript-eslint/no-var-requires */

const { default: defaultTheme } = require('./themes/default.theme.css');
const { default: bsgTHeme } = require('./themes/bsg.theme.css');

defaultTheme.use();
bsgTHeme.use();
