import type {
  AdditionalDonations,
  Bids,
  BigbuttonPlayerMap,
  Commentators,
  CommentatorsNew,
  Countdown,
  CurrentRunDelay,
  DonationAlerts,
  DonationReader,
  DonationReaderNew,
  DonationsToRead,
  DonationTotal,
  DonationTotalMilestones,
  GameLayouts,
  IntermissionSlides,
  LowerThird,
  MediaBox,
  MusicData,
  ObsData,
  Omnibar,
  OtherStreamData,
  Prizes,
  ReaderIntroduction,
  ServerTimestamp,
  StreamDeckData,
  TtsVoices,
  UpcomingRunID,
  VideoPlayer,
} from '@esa-layouts/types/schemas';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { SoloedBidID } from '@esa-layouts/types/schemas/soloedBidID';
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable';

const sc = new SpeedcontrolUtilBrowser(nodecg);

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const additionalDonations = useReplicant<AdditionalDonations>('additionalDonations', 'esa-layouts')!;
export const assetsDonationAlertAssets = useAssetReplicant('donation-alert-assets', 'esa-layouts')!;
export const assetsIntermissionSlides = useAssetReplicant('intermission-slides', 'esa-layouts')!;
export const assetsMediaBoxImages = useAssetReplicant('media-box-images', 'esa-layouts')!;
export const assetsReaderIntroductionImages = useAssetReplicant('reader-introduction-images', 'esa-layouts')!;
export const bids = useReplicant<Bids>('bids', 'esa-layouts')!;
export const bigbuttonPlayerMap = useReplicant<BigbuttonPlayerMap>('bigbuttonPlayerMap', 'esa-layouts')!;
export const commentators = useReplicant<Commentators>('commentators', 'esa-layouts')!;
export const commentatorsNew = useReplicant<CommentatorsNew>('commentatorsNew', 'esa-layouts')!;
export const countdown = useReplicant<Countdown>('countdown', 'esa-layouts')!;
export const currentRunDelay = useReplicant<CurrentRunDelay>('currentRunDelay', 'esa-layouts')!;
export const donationAlerts = useReplicant<DonationAlerts>('donationAlerts', 'esa-layouts')!;
export const donationReader = useReplicant<DonationReader>('donationReader', 'esa-layouts')!;
export const donationReaderNew = useReplicant<DonationReaderNew>('donationReaderNew', 'esa-layouts')!;
export const donationsToRead = useReplicant<DonationsToRead>('donationsToRead', 'esa-layouts')!;
export const donationTotal = useReplicant<DonationTotal>('donationTotal', 'esa-layouts')!;
export const donationTotalMilestones = useReplicant<DonationTotalMilestones>('donationTotalMilestones', 'esa-layouts')!;
export const gameLayouts = useReplicant<GameLayouts>('gameLayouts', 'esa-layouts')!;
export const intermissionSlides = useReplicant<IntermissionSlides>('intermissionSlides', 'esa-layouts')!;
export const lowerThird = useReplicant<LowerThird>('lowerThird', 'esa-layouts')!;
export const mediaBox = useReplicant<MediaBox>('mediaBox', 'esa-layouts')!;
export const musicData = useReplicant<MusicData>('musicData', 'esa-layouts')!;
export const obsData = useReplicant<ObsData>('obsData', 'esa-layouts')!;
export const omnibar = useReplicant<Omnibar>('omnibar', 'esa-layouts')!;
export const otherStreamData = useReplicant<OtherStreamData>('otherStreamData', 'esa-layouts')!;
export const prizes = useReplicant<Prizes>('prizes', 'esa-layouts')!;
export const readerIntroduction = useReplicant<ReaderIntroduction>('readerIntroduction', 'esa-layouts')!;
export const { runDataActiveRun, runDataActiveRunSurrounding, runDataArray, timer } = sc;
export const serverTimestamp = useReplicant<ServerTimestamp>('serverTimestamp', 'esa-layouts')!;
export const soloedBidID = useReplicant<SoloedBidID>('soloedBidID', 'esa-layouts')!;
export const streamDeckData = useReplicant<StreamDeckData>('streamDeckData', 'esa-layouts')!;
export const ttsVoices = useReplicant<TtsVoices>('ttsVoices', 'esa-layouts')!;
export const upcomingRunID = useReplicant<UpcomingRunID>('upcomingRunID', 'esa-layouts')!;
export const videoPlayer = useReplicant<VideoPlayer>('videoPlayer', 'esa-layouts')!;

// export const useLayoutStore = defineStore('esa-layouts', () => {
//   return {
//     //
//   };
// });
