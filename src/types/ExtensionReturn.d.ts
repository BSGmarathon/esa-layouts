import { DeepReadonly } from 'ts-essentials';
import { OBS } from '@esa-layouts/types/OBS';
import { Configschema } from './schemas';

export interface ExtensionReturn {
  obs: OBS;
  mixer: {
    setFaderName: (fader: string, name: string) => void;
    toggleLiveMics: (scene: string) => void;
  };
  config: DeepReadonly<Configschema>;
}
