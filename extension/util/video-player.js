"use strict";
const get_video_duration_1 = require("get-video-duration");
const path_1 = require("path");
const process_1 = require("process");
const promises_1 = require("timers/promises");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
class VideoPlayer extends tiny_typed_emitter_1.TypedEmitter {
    constructor(nodecg, obsConfig, obs) {
        super();
        this.playlist = [];
        this.playing = false;
        this.index = -1;
        this.nodecg = nodecg;
        this.obsConfig = obsConfig;
        this.obs = obs;
        // Listens for when videos finish playing in OBS.
        obs.conn.on('MediaEnded', (data) => {
            if (data.sourceName === this.obsConfig.names.sources.videoPlayer
                && this.playing && this.index >= 0) {
                this.emit('videoEnded', this.playlist[this.index]);
            }
        });
    }
    /**
     * Validate and load in a supplied playlist.
     */
    loadPlaylist(playlist) {
        if (!this.obs.connected || !this.obsConfig.enabled) {
            throw new Error('no OBS connection available');
        }
        if (this.playing)
            throw new Error('another playlist currently playing');
        if (!playlist.length)
            throw new Error('playlist must have at least 1 video');
        const invalidItems = playlist.filter((i) => !i.length && !i.video);
        if (invalidItems.length) {
            throw new Error('all playlist items must have either video or length');
        }
        this.playlist = playlist;
    }
    /**
     * Attempt to play the next playlist item.
     * If at the end, triggers the end of the playlist.
     */
    async playNext() {
        if (!this.obs.connected || !this.obsConfig.enabled) {
            throw new Error('no OBS connection available');
        }
        if (this.playlist.length - 1 > this.index) {
            this.playing = true;
            this.index += 1;
            const item = this.playlist[this.index];
            this.emit('videoStarted', item); // Emitted even if no video is added.
            let waitLength = 5;
            if (item.length && item.commercial)
                this.emit('playCommercial', item);
            if (item.video) {
                waitLength = 0;
                await this.playVideo(item.video);
                // "videoEnded" event sent out from elsewhere.
            }
            else if (item.length && !item.commercial)
                waitLength = item.length;
            this.nodecg.log.debug('[Video Player] waitLength has been set to %s', waitLength);
            if (waitLength) {
                // Wrapped function here so we can await without blocking the other stuff
                (async () => {
                    this.nodecg.log.debug('[Video Player] waitLength is %s, will start waiting', waitLength);
                    // This setTimeout is wrapped so if it's cancelled, nothing breaks.
                    try {
                        this.delayAC = new AbortController();
                        await (0, promises_1.setTimeout)(waitLength * 1000, undefined, { signal: this.delayAC.signal });
                        this.emit('videoEnded', item); // "Pretend" video ended in this case
                    }
                    catch (err) {
                        this.nodecg.log.warn('[Video Player] Error with waitLength waiting:', err);
                    }
                    this.delayAC = undefined; // Hopefully this makes the previous AC garbage collected
                    this.nodecg.log.debug('[Video Player] waitLength waiting is finished');
                })();
            }
        }
        else {
            this.playing = false;
            this.index = -1;
            this.playlist.length = 0;
            this.emit('playlistEnded', false);
        }
    }
    /**
     * Used to end the playlist early; will stop the video if any, reset settings,
     * and emit "playlistEnded".
     */
    async endPlaylistEarly() {
        var _a;
        if (this.playing && this.index >= 0) {
            this.playing = false;
            this.index = -1;
            this.playlist.length = 0;
            (_a = this.delayAC) === null || _a === void 0 ? void 0 : _a.abort();
            try {
                await this.obs.conn.send('StopMedia', { sourceName: this.obsConfig.names.sources.videoPlayer });
            }
            catch (err) { /* do nothing */ }
            this.emit('playlistEnded', true);
        }
    }
    /**
     * Play the supplied asset via the OBS source.
     * @param video NodeCG asset of the video.
     */
    async playVideo(video) {
        if (!this.obs.connected || !this.obsConfig.enabled) {
            throw new Error('no OBS connection available');
        }
        const source = await this.obs.conn.send('GetSourceSettings', {
            sourceName: this.obsConfig.names.sources.videoPlayer,
        });
        const location = (0, path_1.join)((0, process_1.cwd)(), `assets/${video.namespace}/${video.category}/${video.base}`);
        // File is the same as before, just restart it.
        // ONLY WORKS FOR ffmpeg_source, but might not even be needed for VLC source!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (source.sourceSettings.local_file === location) {
            await this.obs.conn.send('RestartMedia', {
                sourceName: this.obsConfig.names.sources.videoPlayer,
            });
            // If different, explicitily set it. This also starts the playback.
        }
        else if (source.sourceType === 'ffmpeg_source') {
            await this.obs.conn.send('SetSourceSettings', {
                sourceName: this.obsConfig.names.sources.videoPlayer,
                sourceSettings: {
                    is_local_file: true,
                    local_file: location,
                    looping: false,
                    restart_on_activate: false,
                },
            });
        }
        else if (source.sourceType === 'vlc_source') {
            await this.obs.conn.send('SetSourceSettings', {
                sourceName: this.obsConfig.names.sources.videoPlayer,
                sourceSettings: {
                    loop: false,
                    shuffle: false,
                    playback_behavior: 'always_play',
                    playlist: [
                        {
                            hidden: false,
                            selected: false,
                            value: location,
                        },
                    ],
                },
            });
        }
        else {
            throw new Error('No video player source found in OBS to trigger');
        }
    }
    /**
     * Calculates how long the playlist will last (estimated).
     * @returns Length in seconds.
     */
    async calculatePlaylistLength() {
        let totalLength = 0;
        for (const item of this.playlist) {
            if (item.video) {
                let length = 0;
                try {
                    length = await (0, get_video_duration_1.getVideoDurationInSeconds)((0, path_1.join)((0, process_1.cwd)(), `assets/${item.video.namespace}/${item.video.category}/${item.video.base}`));
                }
                catch (err) { /* err */ }
                // If item has a commercial/length longer than the video, use that instead.
                if (item.length && item.length > length)
                    totalLength += item.length;
                else
                    totalLength += length;
            }
            else if (item.length) {
                totalLength += item.length;
            }
        }
        return totalLength;
    }
}
module.exports = VideoPlayer;
