import XKeysClass from './xkeys-class';
import { get as nodecg } from './nodecg';

const xkeys = new XKeysClass(nodecg(), nodecg().bundleConfig.xkeys);
export default xkeys;
