import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import { Commentators } from '@esa-layouts/types/schemas';
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
  clearCommentators(): void {
    replicantModule.setReplicant<Commentators>({
      name: 'commentators', val: [],
    });
  }

  @Mutation
  removeCommentator(name: string) {
    const currentComs = replicantModule.repsTyped.commentators;
    const nameIndex = currentComs.indexOf(name);

    if (nameIndex > -1) {
      currentComs.splice(nameIndex, 1);
    }

    replicantModule.setReplicant<Commentators>({
      name: 'commentators', val: currentComs,
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
