"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const config = (0, nodecg_1.get)().bundleConfig;
function setup() {
    const router = (0, nodecg_1.get)().Router();
    router.post('/button/:id', async (req, res) => {
        const action = req.body.action;
        const buttonId = parseInt(req.params.id, 10);
        (0, nodecg_1.get)().log.debug(`Got button press, id: ${buttonId}, action: ${action}`);
        if (buttonId < 1 || buttonId > 10) {
            return res.status(400).send('Invalid button id.');
        }
        if (!['toggle-timer', 'reset-timer'].includes(action)) {
            return res.status(400).send('Invalid action.');
        }
        switch (action) {
            case 'toggle-timer':
                (0, nodecg_1.get)().sendMessage('buttonPressed', buttonId);
                break;
            case 'reset-timer':
                (0, nodecg_1.get)().sendMessage('resetTimer');
                break;
            default:
                return res.status(400).send('Invalid action.');
        }
        return res.status(201).send();
    });
    // @ts-expect-error Types are wrong.
    (0, nodecg_1.get)().mount(`/${(0, nodecg_1.get)().bundleName}`, router);
}
if (config.flagcarrier.enabled) {
    setup();
    (0, nodecg_1.get)().log.info('[FlagCarrier] Integration enabled (target URL: %s://%s/%s/button/{id})', ((_a = (0, nodecg_1.get)().config.ssl) === null || _a === void 0 ? void 0 : _a.enabled) ? 'https' : 'http', (0, nodecg_1.get)().config.baseURL, (0, nodecg_1.get)().bundleName);
}
