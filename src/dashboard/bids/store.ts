import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import { Omnibar, SoloedBidID } from '@esa-layouts/types/schemas';
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
  pinItem({ id, pinned }: { id: number, pinned: boolean }): void {
    replicantModule.setReplicant<Omnibar>({
      name: 'omnibar',
      val: { ...replicantModule.repsTyped.omnibar, pin: pinned ? { type: 'Bid', id } : null },
    });
  }

  @Mutation
  setSolo(id: number): void {
    replicantModule.setReplicant<SoloedBidID>({
      name: 'soloedBidID',
      val: id,
    });
  }

  @Mutation
  clearSolo(): void {
    replicantModule.setReplicant<SoloedBidID>({
      name: 'soloedBidID',
      val: null,
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
