import { InstanceBase, InstanceStatus, SomeCompanionConfigField, runEntrypoint } from '@companion-module/base';
import { WebSocket } from 'ws';
import initActions from './actions';
import { Config, getConfigFields } from './config';
import { initFeedbacks, obsSceneFeedback, setObsSceneKeys } from './feedbacks';
import initPresets from './presets';
import upgradeScripts from './upgrades';
import initVariables from './variables';

class ModuleInstance extends InstanceBase<Config> {
  config: Config;
  ws: WebSocket | undefined;
  wsReconnectionTimeout: NodeJS.Timeout | undefined;

  /**
   * The usual JS class constructor.
   * @param internal ??? Unsure but needs to be passed into "super"
   */
  constructor(internal: unknown) {
    super(internal);
    this.config = {};
    this.ws = undefined;
    this.wsReconnectionTimeout = undefined;
  }

  wsCleanup() {
    // Clean up current connection if one is active.
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) this.ws.close();
        this.ws.removeAllListeners();
        this.ws = undefined;
      } catch (err) {
        // Ignore for now.
      }
    }
    // Clean up reconnection timeout if one is active.
    clearTimeout(this.wsReconnectionTimeout);
    this.wsReconnectionTimeout = undefined;
  }

  /**
   * Function to (re)connect to the WebSocket server in the NodeCG bundle.
   */
  wsConnect() {
    this.updateStatus(InstanceStatus.Connecting);
    this.wsCleanup();
    const address = this.config.address || 'localhost:9092'; // Default
    const key = this.config.key || 'DEFAULT_KEY'; // Default
    this.ws = new WebSocket(`ws://${address}/?key=${key}`);
    this.log('debug', 'Connecting');

    this.ws.on('open', () => {
      this.updateStatus(InstanceStatus.Ok);
      this.log('debug', 'Open');
    });
    this.ws.on('error', (err) => {
      this.updateStatus(InstanceStatus.ConnectionFailure);
      this.log('error', err.toString());
    });
    this.ws.on('close', (code, reason) => {
      this.updateStatus(InstanceStatus.Disconnected);
      this.log('debug', `Closed (${code} - ${reason})`);
      if (!this.wsReconnectionTimeout) {
        this.wsReconnectionTimeout = setTimeout(() => this.wsConnect(), 5000);
      }
    });
    // TODO: clean this up
    this.ws.on('message', (data, isBinary) => {
      this.log('debug', `Message: "${data.toString()}", isBinary: ${isBinary}`);

      const msg: { name: string, value: unknown } = JSON.parse(data.toString());

      /* eslint-disable no-case-declarations */
      switch (msg.name) {
        case 'timer':
          // TODO: Reference type from another location?
          const timer = msg.value as {
            time: string;
            state: 'stopped' | 'running' | 'paused' | 'finished';
            // Other unimportant (at the moment) types omitted.
          };

          // TODO: Setup debounce to not hammer the function.
          this.setVariableValues({
            timer_time: timer.time,
            timer_state: timer.state,
          });
          break;
        case 'timerChangesDisabled':
          // TODO: Reference type from another location?
          this.setVariableValues({
            timer_changes_disabled: msg.value as boolean,
          });
          break;
        case 'streamDeckData':
          // TODO: Reference type from another location?
          const sdData = msg.value as {
            playerHUDTriggerType?: string;
          };
          this.setVariableValues({
            player_hud_trigger_type: sdData.playerHUDTriggerType,
          });
          break;
        case 'twitchCommercialTimer':
          // TODO: Reference type from another location?
          const commercialTimer = msg.value as {
            secondsRemaining: number;
            originalDuration: number;
            timestamp: number;
          };
          this.setVariableValues({
            twitch_commercial_timer_seconds_remaining: commercialTimer.secondsRemaining,
          });
          break;
        case 'twitchCommercialsDisabled':
          // TODO: Reference type from another location?
          this.setVariableValues({
            twitch_commercials_disabled: msg.value as boolean,
          });
          break;
        case 'obsData':
          // TODO: Reference type from another location?
          const obsData = msg.value as {
            connected: boolean;
            scene?: string;
            sceneList: string[];
            transitioning: boolean;
            streaming: boolean;
            disableTransitioning: boolean;
            transitionTimestamp: number;
          };
          this.setVariableValues({
            obs_connected: obsData.connected,
            obs_transitioning: obsData.transitioning,
            obs_transitioning_disabled: obsData.disableTransitioning,
            obs_scene: obsData.scene,
            obs_scene_list: JSON.stringify(obsData.sceneList), // Weird to store, change?
          });
          // Trigger this feedback check in case we changed scenes here.
          this.checkFeedbacks('obsSceneFeedback');
          break;
        case 'cfgScenes':
          // TODO: Reference type from another location?
          const sceneKeys = msg.value as {
            commercials: string;
            gameLayout: string;
            readerIntroduction: string;
            intermission: string;
            intermissionPlayer: string;
            countdown: string;
          };
          // Stores this for use later (maybe could be done better?)
          setObsSceneKeys(sceneKeys);
          // Updates the multidropdown with the configuration scene names.
          this.setFeedbackDefinitions({
            obsSceneFeedback: obsSceneFeedback(),
          });
          // Trigger this feedback check, needed on connection, not sure if needed
          // for anything else, but safe to have.
          this.checkFeedbacks('obsSceneFeedback');
          break;
        case 'videos':
          // TODO: Reference type from another location?
          const videos = msg.value as {
            name: string;
            sum: string;
            // Other unimportant (at the moment) types omitted.
          }[];
          // Updates the dropdown with the video information by re-initialising all actions.
          // TODO: Is there a better way?
          initActions(this, videos);
          break;
        case 'fastCropOn':
          this.setVariableValues({
            fastCropOn: msg.value as boolean,
          });
          break;
        case 'waitingForSingleCropConfirm':
          this.setVariableValues({
            waitingForSingleCropConfirm: msg.value as boolean,
          });
          break;
        case 'waitingForAllCropConfirm':
          this.setVariableValues({
            waitingForAllCropConfirm: msg.value as boolean,
          });
          break;
        case 'selectedCropItem':
          this.setVariableValues({
            selectedCropItem: msg.value as number,
          });
          break;
        default:
          break;
      }
      /* eslint-enable no-case-declarations */
    });
  }

  /**
   * Called when the module instance is OK to start setting up.
   * @param config The initial configuration object
   * @param isFirstInit ??? Unsure when this changes
   */
  async init(config: Config, isFirstInit: boolean) {
    this.log('debug', `Init (isFirstInit: ${isFirstInit})`);
    this.config = config;
    this.updateStatus(InstanceStatus.Connecting);
    initVariables(this);
    initFeedbacks(this);
    initActions(this);
    initPresets(this);
    this.wsConnect();
  }

  /**
   * Called when this module instance is going to be destroyed, to do clean up.
   */
  async destroy() {
    this.log('debug', 'Destroy');
    this.wsCleanup();
  }

  /**
   * Called when the user updates the configuration of this module instance in Companion.
   * @param config The updated configuration object
   */
  async configUpdated(config: Config) {
    this.log('debug', 'Config updated');
    this.config = config;
    this.wsConnect();
  }

  /**
   * Called when the user configuration of this module instance in Companion needs to be created.
   * @returns The configuration array
   */
  // eslint-disable-next-line class-methods-use-this
  getConfigFields(): SomeCompanionConfigField[] {
    return getConfigFields();
  }

  /**
   * Send data over the WebSocket connection to the NodeCG bundle's server.
   * @param data.name Name of the action to send.
   */
  wsSend(data: { name: string, value?: unknown }) {
    if (!this.ws) return;
    const str = JSON.stringify(data);
    this.log('debug', `Send: "${str}"`);
    this.ws.send(str);
  }
}

// Sets up the module for execution.
runEntrypoint(ModuleInstance, upgradeScripts);

export default ModuleInstance;
