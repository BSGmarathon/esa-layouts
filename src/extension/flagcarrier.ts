import { get as nodecg } from './util/nodecg';

const config = nodecg().bundleConfig;

function setup(): void {
  const router = nodecg().Router();

  router.post('/button/:id', async (req, res) => {
    const action = req.body.action as string;
    const buttonId = parseInt(req.params.id, 10);

    nodecg().log.debug(`Got button press, id: ${buttonId}, action: ${action}`);

    if (buttonId < 1 || buttonId > 10) {
      return res.status(400).send('Invalid button id.');
    }

    if (!['toggle-timer', 'reset-timer'].includes(action)) {
      return res.status(400).send('Invalid action.');
    }

    switch (action) {
      case 'toggle-timer':
        nodecg().sendMessage('buttonPressed', buttonId);
        break;
      case 'reset-timer':
        nodecg().sendMessage('resetTimer');
        break;
      default:
        return res.status(400).send('Invalid action.');
    }

    return res.status(201).send();
  });

  // @ts-expect-error Types are wrong.
  nodecg().mount(`/${nodecg().bundleName}`, router);
}

if (config.flagcarrier.enabled) {
  setup();
  nodecg().log.info(
    '[FlagCarrier] Integration enabled (target URL: %s://%s/%s/button/{id})',
    nodecg().config.ssl?.enabled ? 'https' : 'http',
    nodecg().config.baseURL,
    nodecg().bundleName,
  );
}
