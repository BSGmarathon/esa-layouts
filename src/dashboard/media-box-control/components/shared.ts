import type NodeCGTypes from '@nodecg/types';
import { v4 as uuid } from 'uuid';
import { assetsMediaBoxImages, prizes } from '@esa-layouts/browser_shared/replicant_store';
import { MediaBox, Tracker } from '../../../types';

/**
 * Checks if the supplied type is that of an alert.
 * @param type Type of alert
 */
export function isAlertType(type: MediaBox.Types): boolean {
  return ['donation', 'subscription', 'cheer', 'merch', 'therungg'].includes(type);
}

/**
 * Returns details about a piece of media from rotation if found.
 * @param media Media from rotation you wish to query information on.
 */
export function getMediaDetails(
  media: MediaBox.RotationElem | NonNullable<MediaBox.ActiveElem>,
): { name?: string } {
  let details: NodeCGTypes.AssetFile | Tracker.FormattedPrize | undefined;
  if (media.type === 'prize_generic') {
    return {
      name: 'Generic Prize Slide',
    };
  }
  if (media.type === 'image') {
    details = assetsMediaBoxImages.value.find((l) => l.sum === media.mediaUUID);
  } else if (media.type === 'prize') {
    details = prizes.data!.find((p) => p.id.toString() === media.mediaUUID);
  } else if (media.type === 'text') {
    return {
      // This cast type is technically wrong but works OK in this context.
      name: (media as MediaBox.RotationElem).text
        ? (media as MediaBox.RotationElem).text
        : 'Custom Text',
    };
  }
  return details ? {
    name: details.name,
  } : {};
}

/**
 * Used by VueDraggble to properly clone items.
 * @param type Type of item to be cloned.
 * @param mediaUUID UUID of media, sum of image, ID of prize etc.
 */
export function clone(
  type: 'image' | 'prize' | 'prize_generic' | 'text',
  mediaUUID?: string,
  text?: string,
): MediaBox.RotationElem {
  return {
    type,
    id: uuid(),
    mediaUUID: mediaUUID || '-1',
    text,
    seconds: 60,
    showOnIntermission: true,
  };
}

/**
 * Returns if a prize should be shown or not.
 * @param prize Formatted prize object from the tracker.
 */
export function isPrizeApplicable(prize?: Tracker.FormattedPrize): boolean {
  if (!prize?.startTime && !prize?.endTime) return true;

  return !!(prize && prize.startTime && prize.endTime
  && Date.now() > prize.startTime && Date.now() < prize.endTime);
}
