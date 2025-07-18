/* eslint-disable max-len */

import {
  AdditionalDonations, Bids,
  BigbuttonPlayerMap,
  CapturePositions,
  Commentators,
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
  MusicData,
  NameCycle,
  NotableDonations,
  ObsData,
  Omnibar,
  OtherStreamData,
  Prizes,
  ReaderIntroduction,
  ServerTimestamp,
  StreamDeckData,
  TaskmasterTimestamps,
  TtsVoices,
  UpcomingRunID,
  VideoPlayer,
} from '@esa-layouts/types/schemas';
import type NodeCGTypes from '@nodecg/types';
import { HoraroImportStatus, OengusImportStatus, TwitchAPIData, TwitchChannelInfo } from 'speedcontrol-util/types/schemas';
import { SoloedBidID } from '@esa-layouts/types/schemas/soloedBidID';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const additionalDonations = nodecg().Replicant<AdditionalDonations>('additionalDonations') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<AdditionalDonations>;
export const assetsDonationAlertAssets = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:donation-alert-assets') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsIntermissionSlides = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:intermission-slides') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsMediaBoxImages = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:media-box-images') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsReaderIntroductionImages = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:reader-introduction-images') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsVideos = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:videos') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const bids = nodecg().Replicant<Bids>('bids', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Bids>;
export const bigbuttonPlayerMap = nodecg().Replicant<BigbuttonPlayerMap>('bigbuttonPlayerMap') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<BigbuttonPlayerMap>;
export const capturePositions = nodecg().Replicant<CapturePositions>('capturePositions') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<CapturePositions>;
export const commentators = nodecg().Replicant<Commentators>('commentators') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Commentators>;
export const commentatorsNew = nodecg().Replicant<CommentatorsNew>('commentatorsNew') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<CommentatorsNew>;
export const countdown = nodecg().Replicant<Countdown>('countdown') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Countdown>;
export const currentRunDelay = nodecg().Replicant<CurrentRunDelay>('currentRunDelay') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<CurrentRunDelay>;
export const delayedTimer = nodecg().Replicant<DelayedTimer>('delayedTimer') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DelayedTimer>;
export const donationAlerts = nodecg().Replicant<DonationAlerts>('donationAlerts') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationAlerts>;
export const donationReader = nodecg().Replicant<DonationReader>('donationReader') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationReader>;
export const donationReaderNew = nodecg().Replicant<DonationReaderNew>('donationReaderNew') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationReaderNew>;
export const donationsToRead = nodecg().Replicant<DonationsToRead>('donationsToRead', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationsToRead>;
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationTotal>;
export const donationTotalMilestones = nodecg().Replicant<DonationTotalMilestones>('donationTotalMilestones') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationTotalMilestones>;
export const fullScreenVideoPlayer = nodecg().Replicant<FullScreenVideoPlayer>('fullScreenVideoPlayer') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<FullScreenVideoPlayer>;
export const gameLayouts = nodecg().Replicant<GameLayouts>('gameLayouts') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<GameLayouts>;
export const horaroImportStatus = nodecg().Replicant<HoraroImportStatus>('horaroImportStatus', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<HoraroImportStatus>;
export const intermissionSlides = nodecg().Replicant<IntermissionSlides>('intermissionSlides') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<IntermissionSlides>;
export const lowerThird = nodecg().Replicant<LowerThird>('lowerThird') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<LowerThird>;
export const musicData = nodecg().Replicant<MusicData>('musicData') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<MusicData>;
export const nameCycle = nodecg().Replicant<NameCycle>('nameCycle', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NameCycle>;
export const notableDonations = nodecg().Replicant<NotableDonations>('notableDonations') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NotableDonations>;
export const obsData = nodecg().Replicant<ObsData>('obsData', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ObsData>;
export const oengusImportStatus = nodecg().Replicant<OengusImportStatus>('oengusImportStatus', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<OengusImportStatus>;
export const omnibar = nodecg().Replicant<Omnibar>('omnibar') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Omnibar>;
export const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<OtherStreamData>;
export const prizes = nodecg().Replicant<Prizes>('prizes', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Prizes>;
export const readerIntroduction = nodecg().Replicant<ReaderIntroduction>('readerIntroduction') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ReaderIntroduction>;
export const serverTimestamp = nodecg().Replicant<ServerTimestamp>('serverTimestamp') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ServerTimestamp>;
export const soloedBidID = nodecg().Replicant<SoloedBidID>('soloedBidID') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<SoloedBidID>;
export const streamDeckData = nodecg().Replicant<StreamDeckData>('streamDeckData') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<StreamDeckData>;
export const taskmasterTimestamps = nodecg().Replicant<TaskmasterTimestamps>('taskmasterTimestamps') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TaskmasterTimestamps>;
export const ttsVoices = nodecg().Replicant<TtsVoices>('ttsVoices') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TtsVoices>;
export const twitchAPIData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TwitchAPIData>;
export const twitchChannelInfo = nodecg().Replicant<TwitchChannelInfo>('twitchChannelInfo', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TwitchChannelInfo>;
export const upcomingRunID = nodecg().Replicant<UpcomingRunID>('upcomingRunID') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<UpcomingRunID>;
export const videoPlayer = nodecg().Replicant<VideoPlayer>('videoPlayer') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<VideoPlayer>;

// Custom stuff for companion
export const companionFastCropEnabled = nodecg().Replicant<boolean>('companionFastCropEnabled', { persistent: false, defaultValue: true }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<boolean>;
export const companionWaitingSingleCropConfirm = nodecg().Replicant<boolean>('companionWaitingSingleCropConfirm', { persistent: false, defaultValue: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<boolean>;
export const companionWaitingAllCropConfirm = nodecg().Replicant<boolean>('companionWaitingAllCropConfirm', { persistent: false, defaultValue: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<boolean>;
export const selectedCropItem = nodecg().Replicant<number>('companionSelectedCropItem', { persistent: false, defaultValue: -1 }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<number>;
