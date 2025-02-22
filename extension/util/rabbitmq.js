"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mq = void 0;
const amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
const amqplib_1 = __importDefault(require("amqplib"));
const events_1 = require("events");
const uuid_1 = require("uuid");
const nodecg_1 = require("./nodecg");
const helpers_1 = require("./helpers");
function getTimeInfo() {
    const nowDate = new Date();
    return {
        unix: nowDate.getTime() / 1000,
        iso: nowDate.toISOString(),
    };
}
// Below chunk of code used if "useTestData" is enabled.
function generateDonationMsg() {
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
        event: 'testevt1',
        _id: Math.floor(Math.random() * 1000000000),
        donor_visiblename: 'Anonymous',
        amount: Math.floor(Math.random() * 100),
        comment_state: 'APPROVED',
        comment: 'This is a comment!',
        time_received: new Date(Date.now()).toISOString(),
    };
    /* eslint-enable */
}
function generateUserTagMsg(tag, id) {
    return {
        flagcarrier: {
            id,
            group: 'stream1',
            time: {
                iso: (new Date()).toISOString(),
                unix: Date.now() / 1000,
            },
            uid: (0, uuid_1.v4)(),
        },
        user: {
            displayName: (() => {
                switch (tag) {
                    case 1:
                        return 'ExampleUser1';
                    case 2:
                        return 'ExampleUser2';
                    case 3:
                        return 'ExampleUser3';
                    default:
                        return 'ExampleUser';
                }
            })(),
        },
        raw: {
            pronouns: (() => {
                switch (tag) {
                    case 1:
                        return 'he/him';
                    case 2:
                        return 'she/her';
                    case 3:
                        return 'they/them';
                    default:
                        return '';
                }
            })(),
            twitch_name: (() => {
                switch (tag) {
                    case 1:
                        return 'exampleuser1';
                    case 2:
                        return 'exampleuser2';
                    case 3:
                        return 'exampleuser3';
                    default:
                        return '';
                }
            })(),
            country_code: (() => {
                switch (tag) {
                    case 1:
                        return 'DE';
                    case 2:
                        return 'SE';
                    case 3:
                        return 'FI';
                    default:
                        return '';
                }
            })(),
        },
    };
}
const buttonMsgCount = {};
function generateBigbuttonPressMsg(id) {
    if (!buttonMsgCount[id])
        buttonMsgCount[id] = 1;
    else
        buttonMsgCount[id] += 1;
    return {
        button_id: id,
        button_message_count: buttonMsgCount[id],
        time: {
            iso: (new Date()).toISOString(),
            unix: Date.now() / 1000,
        },
    };
}
const testData = {
    donationFullyProcessed: generateDonationMsg(),
    newScreenedSub: {
        message: {
            trailing: 'This is an extra message from the user!',
            tags: {
                'system-msg': 'ExampleUser subscribed at Tier 1. They\'ve subscribed for '
                    + '26 months, currently on a 26 month streak!',
            },
        },
        user: {
            displayName: 'ExampleUser',
        },
    },
    newScreenedCheer: {
        message: {
            trailing: 'This is a message included with the cheer!',
            tags: {
                'display-name': 'ExampleUser',
                bits: '500',
            },
        },
    },
    bigbuttonTagScanned: generateUserTagMsg(1, '1'),
    bigbuttonPressed: generateBigbuttonPressMsg(1),
    newScreenedTweet: {
        message: {
            full_text: 'Some lengthy tweet that will need some scrolling. '
                + 'Some lengthy tweet that will need some scrolling? '
                + 'Some lengthy tweet that will need some scrolling!',
        },
        user: {
            name: 'Some Cool Twitter User',
        },
    },
    newScreenedCrowdControl: {
        message: {
            trailing: 'SomeExampleUser has received 1000 coins!',
        },
    },
};
class RabbitMQ {
    constructor(nodecg, useTestData, opts) {
        this.evt = new events_1.EventEmitter();
        this.nodecg = nodecg;
        this.config = opts.config;
        this.exchange = opts.exchange;
        this.event = opts.event;
        this.listenTopics = opts.listenTopics;
        this.useTestData = useTestData;
        if (opts.config.enabled) {
            if (!useTestData) {
                try {
                    nodecg.log.info('[RabbitMQ] Setting up connection');
                    const conn = amqp_connection_manager_1.default.connect([this.url()], this.opts())
                        .on('connect', () => {
                        nodecg.log.info('[RabbitMQ] Server connection successful');
                    })
                        .on('disconnect', (err) => {
                        nodecg.log.warn('[RabbitMQ] Server connection closed');
                        if (err) {
                            nodecg.log.warn('[RabbitMQ] Server connection error');
                            nodecg.log.debug('[RabbitMQ] Server connection error:', err);
                        }
                    });
                    this.chan = conn.createChannel({
                        json: false,
                        setup: (chan) => this.setupChan(chan),
                    }).on('error', (err) => {
                        nodecg.log.warn('[RabbitMQ] Server channel error');
                        nodecg.log.debug('[RabbitMQ] Server channel error:', err);
                    }).on('close', () => {
                        nodecg.log.warn('[RabbitMQ] Server channel closed');
                    });
                }
                catch (err) {
                    nodecg.log.warn('[RabbitMQ] Some caught error, YOU PROBABLY NEED TO RESTART NODECG!');
                    nodecg.log.debug('[RabbitMQ] Some caught error, YOU PROBABLY NEED TO RESTART NODECG!:', err);
                }
            }
            else {
                nodecg.listenFor('testRabbitMQ', ({ msgType, data }) => {
                    if (msgType === 'donationFullyProcessed') {
                        testData.donationFullyProcessed = generateDonationMsg();
                    }
                    else if (msgType === 'bigbuttonTagScanned') {
                        testData.bigbuttonTagScanned = generateUserTagMsg(((data === null || data === void 0 ? void 0 : data.tag) || 1), ((data === null || data === void 0 ? void 0 : data.id) || '1'));
                    }
                    else if (msgType === 'bigbuttonPressed') {
                        testData.bigbuttonPressed = generateBigbuttonPressMsg(((data === null || data === void 0 ? void 0 : data.id) || 1));
                    }
                    nodecg.log.debug('[RabbitMQ] Sending test message out for topic %s: %s', msgType, JSON.stringify(testData[msgType]));
                    this.evt.emit(msgType, testData[msgType]);
                });
            }
        }
    }
    url() {
        return `${this.config.protocol}://${this.config.hostname}${this.config.vhost ? `/${this.config.vhost}` : ''}`;
    }
    opts() {
        if (this.config.username || !this.config.password) {
            return {
                connectionOptions: {
                    credentials: amqplib_1.default.credentials.plain(this.config.username, this.config.password),
                },
            };
        }
        return undefined;
    }
    validateMsg(msg) {
        return msg.fields.exchange !== this.exchange
            || !msg.fields.routingKey.startsWith(`${this.event}.`);
    }
    async setupChan(chan) {
        try {
            chan.assertExchange(this.exchange, 'topic', { durable: true, autoDelete: true });
            this.listenTopics.forEach((topic) => {
                let queueName = `${this.exchange}-${this.event}-${topic.name}`;
                if (this.config.queuePrepend)
                    queueName = `${this.config.queuePrepend}_${queueName}`;
                chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });
                chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
                chan.bindQueue(queueName, topic.exchange, topic.key);
                chan.consume(queueName, (msg) => {
                    if (msg && msg.content && this.validateMsg(msg)) {
                        setTimeout(() => {
                            this.evt.emit(topic.name, JSON.parse(msg.content.toString()));
                        }, 0);
                        this.nodecg.log.debug('[RabbitMQ] Received message from topic %s: %s', topic.name, msg.content.toString());
                    }
                    if (msg) {
                        chan.ack(msg);
                    }
                }, { noAck: false });
            });
            this.nodecg.log.info('[RabbitMQ] Server connection listening for messages');
        }
        catch (err) {
            this.nodecg.log.warn('[RabbitMQ] Some caught channel error');
            this.nodecg.log.debug('[RabbitMQ] Some caught channel error:', err);
        }
    }
    /**
     * Used to send messages over the RabbitMQ connection.
     * Automatically prepends the event name to the key.
     * @param key The routing key this message will be published with.
     * @param data The data that should be sent in this message.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async send(key, data) {
        if (!this.config.enabled) {
            // RabbitMQ not enabled, don't even try to send.
            return;
        }
        if (!this.chan && !this.useTestData) {
            this.nodecg.log.debug('[RabbitMQ] Could not send message as channel is not defined');
            return;
        }
        const newData = Object.assign(Object.assign({}, data), {
            event: this.event,
            time: getTimeInfo(),
        });
        const fullKey = `${this.event}.${key}`;
        if (this.chan && !this.useTestData) {
            try {
                await this.chan.publish(this.exchange, fullKey, Buffer.from(JSON.stringify(newData)), { persistent: true });
            }
            catch (err) {
                this.nodecg.log.warn('[RabbitMQ] Error sending message, YOU MAY NEED TO RESTART NODECG!');
                this.nodecg.log.debug('[RabbitMQ] Error sending message, YOU MAY NEED TO RESTART NODECG!:', err);
            }
        }
        this.nodecg.log.debug('[RabbitMQ] Sending message with routing key: %s: %s', fullKey, JSON.stringify(newData));
    }
}
const { useTestData, rabbitmq } = (0, nodecg_1.get)().bundleConfig;
const exchange = 'cg';
const event = (0, helpers_1.getCurrentEventShort)();
// eslint-disable-next-line import/prefer-default-export
exports.mq = new RabbitMQ((0, nodecg_1.get)(), useTestData, {
    config: rabbitmq,
    exchange,
    event,
    listenTopics: [
        {
            name: 'donationTotalUpdated',
            exchange: 'tracker',
            key: '*.donation_total.updated',
        },
        {
            name: 'donationFullyProcessedStream',
            exchange: 'tracker',
            key: `${event}.donation.*.fully_processed`,
        },
        {
            name: 'donationFullyProcessedTeam',
            exchange: 'tracker',
            key: 'esaw2024.donation.*.fully_processed', // HARDCODED! (ESAW24)
        },
        {
            name: 'newScreenedTweet',
            exchange: 'moderation',
            key: 'screened.tweet',
        },
        {
            name: 'newScreenedSub',
            exchange: 'moderation',
            key: 'screened.sub',
        },
        {
            name: 'newScreenedCheer',
            exchange: 'moderation',
            key: 'screened.cheer',
        },
        {
            name: 'newScreenedCrowdControl',
            exchange: 'moderation',
            key: 'screened.crowdcontrol',
        },
        {
            name: 'bigbuttonTagScanned',
            exchange: 'bigbutton',
            key: '*.tag_scanned',
        },
        {
            name: 'bigbuttonPressed',
            exchange: 'bigbutton',
            key: '*.pressed',
        },
        {
            name: 'runChanged',
            exchange,
            key: '*.run.changed',
        },
        {
            name: 'streamingStatusChanged',
            exchange,
            key: '*.obs.stream.*',
        },
        {
            name: 'gameSceneChanged',
            exchange,
            key: '*.obs.scene.*.*.gamescene',
        },
    ],
});
