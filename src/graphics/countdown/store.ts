import { ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, VuexModule } from 'vuex-module-decorators';
import type { Countdown, MusicData } from '@esa-layouts/types/schemas';
import NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import { RunData } from 'speedcontrol-util/types';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }
}

// Replicants and their types
const reps: {
  countdown: NodeCGTypes.ClientReplicant<Countdown>;
  musicData: NodeCGTypes.ClientReplicant<MusicData>;
  [k: string]: NodeCGTypes.ClientReplicant<unknown>;
} = {
  countdown: nodecg.Replicant('countdown'),
  musicData: nodecg.Replicant('musicData'),
};

interface StateTypes {
  musicData: MusicData;
  countdown: Countdown;
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    musicData: null,
    countdown: null,
  },
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
  },
  modules: { ReplicantModule, OurModule },
});

Object.keys(reps).forEach((key) => {
  reps[key].on('change', (val) => {
    store.commit('setState', { name: key, val: clone(val) });
  });
});

export default async (): Promise<Store<StateTypes>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  return store;
};

export const storeModule = getModule(OurModule, store);
