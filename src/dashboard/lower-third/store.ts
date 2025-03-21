import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import { LowerThird } from '@esa-layouts/types/schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  @Mutation
  clearNames(): void {
    const currentLt = replicantModule.repsTyped.lowerThird;

    currentLt.names = [];

    replicantModule.setReplicant<LowerThird>({
      name: 'lowerThird', val: currentLt,
    });
  }

  @Mutation
  addName(name: string): void {
    const currentLt = replicantModule.repsTyped.lowerThird;

    currentLt.names.push(name);

    replicantModule.setReplicant<LowerThird>({
      name: 'lowerThird', val: currentLt,
    });
  }

  @Mutation
  removeName(name: string): void {
    const currentLt = replicantModule.repsTyped.lowerThird;
    const nameIndex = currentLt.names.indexOf(name);

    if (nameIndex > -1) {
      currentLt.names.splice(nameIndex, 1);
    }

    replicantModule.setReplicant<LowerThird>({
      name: 'lowerThird', val: currentLt,
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
