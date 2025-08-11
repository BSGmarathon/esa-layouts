import type {
  AdditionalDonations,
  Bids,
  BigbuttonPlayerMap,
  CommentatorsNew,
  Countdown,
  CurrentRunDelay,
  DelayedTimer,
  DonationAlerts,
  DonationReader,
  DonationReaderNew,
  DonationsToRead,
  DonationTotal,
  DonationTotalMilestones,
  FullScreenVideoPlayer,
  GameLayouts,
  IntermissionSlides,
  LowerThird,
  MediaBox,
  MusicData, NotableDonations,
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
import {
  RunDataActiveRun,
  RunDataActiveRunSurrounding,
  RunDataArray,
  Timer,
  TwitchCommercialTimer,
} from 'speedcontrol-util/types/schemas';
import { SoloedBidID } from '@esa-layouts/types/schemas/soloedBidID';
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable';

const bundleName = 'esa-layouts';
const sc = 'nodecg-speedcontrol';

export const speedControl = new SpeedcontrolUtilBrowser(nodecg);

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const additionalDonations = useReplicant<AdditionalDonations>('additionalDonations', bundleName)!;
export const assetsDonationAlertAssets = useAssetReplicant('donation-alert-assets', bundleName)!;
export const assetsIntermissionSlides = useAssetReplicant('intermission-slides', bundleName)!;
export const assetsMediaBoxImages = useAssetReplicant('media-box-images', bundleName)!;
export const assetsReaderIntroductionImages = useAssetReplicant('reader-introduction-images', bundleName)!;
export const assetsVideos = useAssetReplicant('videos', bundleName)!;
export const bids = useReplicant<Bids>('bids', bundleName)!;
export const bigbuttonPlayerMap = useReplicant<BigbuttonPlayerMap>('bigbuttonPlayerMap', bundleName)!;
// export const commentators = useReplicant<Commentators>('commentators', bundleName)!;
export const commentatorsNew = useReplicant<CommentatorsNew>('commentatorsNew', bundleName)!;
export const countdown = useReplicant<Countdown>('countdown', bundleName)!;
export const currentRunDelay = useReplicant<CurrentRunDelay>('currentRunDelay', bundleName)!;
export const delayedTimer = useReplicant<DelayedTimer>('delayedTimer', bundleName)!;
export const donationAlerts = useReplicant<DonationAlerts>('donationAlerts', bundleName)!;
export const donationReader = useReplicant<DonationReader>('donationReader', bundleName)!;
export const donationReaderNew = useReplicant<DonationReaderNew>('donationReaderNew', bundleName)!;
export const donationsToRead = useReplicant<DonationsToRead>('donationsToRead', bundleName)!;
export const donationTotal = useReplicant<DonationTotal>('donationTotal', bundleName)!;
export const donationTotalMilestones = useReplicant<DonationTotalMilestones>('donationTotalMilestones', bundleName)!;
export const fullScreenVideoPlayer = useReplicant<FullScreenVideoPlayer>('fullScreenVideoPlayer', bundleName)!;
export const gameLayouts = useReplicant<GameLayouts>('gameLayouts', bundleName)!;
export const intermissionSlides = useReplicant<IntermissionSlides>('intermissionSlides', bundleName)!;
export const lowerThird = useReplicant<LowerThird>('lowerThird', bundleName)!;
export const mediaBox = useReplicant<MediaBox>('mediaBox', bundleName)!;
export const musicData = useReplicant<MusicData>('musicData', bundleName)!;
export const notableDonations = useReplicant<NotableDonations>('notableDonations', bundleName)!;
export const obsData = useReplicant<ObsData>('obsData', bundleName)!;
export const omnibar = useReplicant<Omnibar>('omnibar', bundleName)!;
export const otherStreamData = useReplicant<OtherStreamData>('otherStreamData', bundleName)!;
export const prizes = useReplicant<Prizes>('prizes', bundleName)!;
export const readerIntroduction = useReplicant<ReaderIntroduction>('readerIntroduction', bundleName)!;
export const runDataArray = useReplicant<RunDataArray>('runDataArray', sc)!;
export const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', sc)!;
export const runDataActiveRunSurrounding = useReplicant<RunDataActiveRunSurrounding>(
  'runDataActiveRunSurrounding',
  sc,
)!;
// TODO: rename and properly implement
export const timerRep = useReplicant<Timer>('timer', sc)!;
export const twitchCommercialTimer = useReplicant<TwitchCommercialTimer>('twitchCommercialTimer', sc)!;
export const {
  timer,
} = speedControl; // TODO: convert to normal useReplicants
export const serverTimestamp = useReplicant<ServerTimestamp>('serverTimestamp', bundleName)!;
export const soloedBidID = useReplicant<SoloedBidID>('soloedBidID', bundleName)!;
export const streamDeckData = useReplicant<StreamDeckData>('streamDeckData', bundleName)!;
export const ttsVoices = useReplicant<TtsVoices>('ttsVoices', bundleName)!;
export const upcomingRunID = useReplicant<UpcomingRunID>('upcomingRunID', bundleName)!;
export const videoPlayer = useReplicant<VideoPlayer>('videoPlayer', bundleName)!;

// export const useLayoutStore = defineStore('esa-layouts', () => {
//   return {
//     //
//   };
// });
