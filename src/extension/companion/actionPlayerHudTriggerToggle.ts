import { streamDeckData } from '@esa-layouts/util/replicants';

// Used to toggle the "Player HUD Trigger" type.
export default function actionPlayerHudTriggerToggle(name: string, value: unknown): void {
  const val = value as string;
  if (streamDeckData.value.playerHUDTriggerType === val) {
    delete streamDeckData.value.playerHUDTriggerType;
  } else {
    streamDeckData.value.playerHUDTriggerType = val;
  }
}
