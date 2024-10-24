import { get as nodecg } from '@esa-layouts/util/nodecg';
import { changeScene } from '@esa-layouts/util/obs';

const config = nodecg().bundleConfig;

// Used to change between intermission scenes using a supplied scene name config key.
export default async function actionIntermissionSceneChange(name: string, value: unknown)
  : Promise<void> {
  const { scenes } = config.obs.names;
  const val = value as string;
  const scene = (scenes as { [k: string]: string })[val];

  await changeScene({ scene, force: true });
}
