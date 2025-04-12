<script setup lang="ts">
import Pusher from 'pusher-js';
import { useHead } from '@vueuse/head';
import { onMounted, ref } from 'vue';
import { Configschema } from '../../types/schemas';

useHead({ title: 'Tech checklist' });

Pusher.logToConsole = false;

// const pusher = new Pusher('2c53693ab820e678c32e', {
//   cluster: 'eu',
// });
//
// const channel = pusher.subscribe('bsg-checklist');

type ChecklistItem = {
  title: string;
  checked: boolean;
  defaultState?: boolean;
};

const obsConfig = (nodecg.bundleConfig as Configschema).obs;
const unchecking = ref(false);
// const audioReady = ref(false);
const checks = ref<ChecklistItem[]>([
  {
    title: 'Write down end time and any tech problems',
    checked: false,
  },
  {
    title: 'Press Next Game in Run Player',
    checked: false,
  },
  {
    title: '(automated) Tweet about the run WITH a picture',
    checked: true,
    defaultState: true,
  },
  {
    title: 'Set up runner & get image on capcard',
    checked: false,
  },
  {
    title: 'Crop game if necessary',
    checked: false,
  },
  {
    title: 'Set Host and Commentators',
    checked: false,
  },
  {
    title: 'Verify run-info is correct',
    checked: false,
  },
  {
    title: 'Verify Game Layout (with the runner)',
    checked: false,
  },
  {
    title: '(2+ runners) Make sure names and game feeds align with runner seats',
    checked: false,
  },
  {
    title: 'Check if online notifications are off',
    checked: false,
  },
  {
    title: 'Check if Runner cam needs adjustment',
    checked: false,
  },
  {
    title: 'Stay hydrated',
    checked: false,
  },
  {
    title: 'Final Check (remember to write down the start time)',
    checked: false,
  },
]);

function sendUncheckAll(): void {
  nodecg.sendMessage('changeCheckUncheckAll');
}

function setChecked(index: number, checked: boolean): void {
  nodecg.sendMessage('changeCheckStatus', {
    i: index,
    checked,
  });
}

function resetChecks(): void {
  if (unchecking.value) {
    return;
  }

  // Skip if nothing is checked
  if (!checks.value.find((c) => !c.defaultState || c.checked)) {
    return;
  }

  unchecking.value = true;

  for (const check of checks.value) {
    check.checked = check.defaultState || false;
  }

  setTimeout(() => {
    unchecking.value = false;
  }, 550);
}

onMounted(() => {
  nodecg.listenFor('obsChangeScene', ({ scene }) => {
    // reset the checkmarks if we change to the game layout
    if (scene === obsConfig.names.scenes.gameLayout) {
      resetChecks();
      // fetch('https://pusher.bsg.duncte123.nl/sendUncheck.php', {
      //   mode: 'no-cors',
      // })
      //   .catch(console.log);
    }
  });

  // channel.bind('audio-ready', (data: { ready: boolean }) => {
  //   this.audioReady = data.ready;
  // });

  nodecg.listenFor('changeCheckStatus', ({ i, checked }) => {
    checks.value[i].checked = checked;
  });
  nodecg.listenFor('changeCheckUncheckAll', () => {
    resetChecks();
  });
});
</script>

<template>
  <v-app>
    <v-btn
      class="mt-1"
      @click="sendUncheckAll">
      Reset
    </v-btn>
    <h2 class="mt-2">Checklist</h2>
<!--    <div class="multiselect with-transition" :class="{-->
<!--        'multiselect-on': audioReady,-->
<!--      }">-->
<!--      <input id="audio-ready-cb" type="checkbox" disabled :checked="audioReady">-->
<!--      <label for="audio-ready-cb">Audio Ready</label>-->
<!--    </div>-->
    <ul>
      <li class="multiselect" :class="{
        'with-transition': unchecking,
        'multiselect-on': check.checked,
      }" v-for="(check, i) in checks"
          @click.prevent="$event.stopPropagation(); setChecked(i, !check.checked)"
          :key="i">
        <input :id="`checkbox-${i}`" type="checkbox" v-model="check.checked">
        <label :for="`checkbox-${i}`">{{ check.title }}</label>
      </li>
    </ul>
  </v-app>
</template>

<style scoped>
  ul {
    border: 2px solid black;
    border-radius: 5px;
    padding: 5px !important;
    list-style-type: none;
    column-count: 3;
  }

  .multiselect {
    border: solid 1px #768948;
    overflow: auto;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 4px;
    box-sizing: border-box;
  }

  .with-transition {
    transition: background-color ease-in-out 500ms;
  }

  .multiselect-on {
    color: #ffffff;
    background-color: #06BA63;
  }
</style>
