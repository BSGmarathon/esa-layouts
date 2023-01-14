import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, VuexModule, Mutation } from 'vuex-module-decorators';
import { LowerThird } from '@esa-layouts/types/schemas';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  @Mutation
  setTransitioning(transitioning: boolean): void {
    const original = replicantModule.repsTyped.lowerThird;

    original.transitioning = transitioning;

    replicantModule.setReplicant<LowerThird>({
      name: 'lowerThird', val: original,
    });
  }

  @Mutation
  setVisible(visible: boolean): void {
    const original = replicantModule.repsTyped.lowerThird;

    original.visible = visible;

    replicantModule.setReplicant<LowerThird>({
      name: 'lowerThird', val: original,
    });
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
