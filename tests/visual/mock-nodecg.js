/* eslint-disable */
/**
 * Minimal, synchronous stand-in for NodeCG's client-side API.
 *
 * This script is injected via `page.addInitScript()` *before* any bundle
 * scripts run, so `window.nodecg`/`window.NodeCG` already exist by the time
 * the graphics' Vue apps start calling `nodecg.Replicant(...)` etc.
 *
 * The test controls the state the graphic sees by defining:
 *   window.__NODECG_MOCK__ = {
 *     bundleName: 'esa-layouts',
 *     bundleConfig: { ... },
 *     replicants: {
 *       'esa-layouts': { replicantName: value, 'assets:media-box-images': [...] },
 *       'nodecg-speedcontrol': { runDataArray: [...] }
 *     },
 *   };
 * before navigation.
 */
(function installNodeCGMock() {
  if (window.nodecg && window.nodecg.__isMock) return;

  var cfg = window.__NODECG_MOCK__ || {};
  var bundleName = cfg.bundleName || 'esa-layouts';
  var bundleConfig = cfg.bundleConfig || {};
  var replicantValues = cfg.replicants || {};

  var store = new Map();

  function keyFor(name, namespace) { return namespace + ':' + name; }

  function getInitialValue(name, namespace, opts) {
    var ns = replicantValues[namespace];
    if (ns && Object.prototype.hasOwnProperty.call(ns, name)) {
      return deepClone(ns[name]);
    }
    if (opts && 'defaultValue' in opts) return deepClone(opts.defaultValue);
    return undefined;
  }

  function deepClone(v) {
    if (v === undefined) return undefined;
    try { return structuredClone(v); } catch (_) {
      return JSON.parse(JSON.stringify(v));
    }
  }

  function Replicant(name, namespaceOrOpts, maybeOpts) {
    var namespace;
    var opts;
    if (typeof namespaceOrOpts === 'string') {
      namespace = namespaceOrOpts;
      opts = maybeOpts || {};
    } else {
      namespace = bundleName;
      opts = namespaceOrOpts || {};
    }

    var key = keyFor(name, namespace);
    if (store.has(key)) return store.get(key);

    var listeners = { change: [], declared: [] };
    var value = getInitialValue(name, namespace, opts);

    var rep = {
      name: name,
      namespace: namespace,
      opts: opts,
      get value() { return value; },
      set value(v) {
        var old = value;
        value = v;
        for (var i = 0; i < listeners.change.length; i++) {
          try { listeners.change[i](value, old); } catch (e) { console.error(e); }
        }
      },
      on: function (event, fn) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(fn);
        // Emulate NodeCG's behaviour of firing `change` once with the current
        // value shortly after subscribe, and `declared` once immediately.
        if (event === 'change') {
          queueMicrotask(function () { fn(value, undefined); });
        } else if (event === 'declared') {
          queueMicrotask(function () { fn(); });
        }
        return rep;
      },
      once: function (event, fn) {
        var wrap = function () {
          rep.removeListener(event, wrap);
          fn.apply(null, arguments);
        };
        return rep.on(event, wrap);
      },
      off: function (event, fn) {
        if (!listeners[event]) return rep;
        listeners[event] = listeners[event].filter(function (l) { return l !== fn; });
        return rep;
      },
      removeListener: function (event, fn) { return rep.off(event, fn); },
      removeAllListeners: function (event) {
        if (event) listeners[event] = []; else listeners = { change: [], declared: [] };
        return rep;
      },
    };

    // Mark mock replicants for debugging.
    Object.defineProperty(rep, '__isMock', { value: true });
    store.set(key, rep);
    return rep;
  }

  // `log` noop-proxy supports `nodecg.log.info/warn/debug/error/...`
  var log = new Proxy({}, { get: function () { return function () {}; } });

  var nodecg = {
    __isMock: true,
    bundleName: bundleName,
    bundleConfig: bundleConfig,
    Replicant: Replicant,
    sendMessage: function () { return Promise.resolve(); },
    sendMessageToBundle: function () { return Promise.resolve(); },
    listenFor: function () {},
    unlisten: function () {},
    readReplicant: function (name, namespace, cb) {
      var rep;
      if (typeof namespace === 'function') {
        cb = namespace; rep = Replicant(name);
      } else {
        rep = Replicant(name, namespace);
      }
      if (typeof cb === 'function') cb(rep.value);
      return Promise.resolve(rep.value);
    },
    waitForReplicants: function () {
      var reps = Array.prototype.slice.call(arguments);
      return Promise.all(reps.map(function () { return Promise.resolve(); }));
    },
    getSocket: function () { return null; },
    log: log,

    // Used by the mock/tests to mutate replicant values post-load.
    __setReplicant: function (name, namespace, value) {
      var rep = Replicant(name, namespace);
      rep.value = deepClone(value);
      return rep;
    },
    __getReplicant: function (name, namespace) {
      return Replicant(name, namespace);
    },
  };

  window.nodecg = nodecg;
  window.NodeCG = function () { return nodecg; };

  // A few bundles listen on window for declaration events – no-op emitter.
  window.addEventListener = window.addEventListener || function () {};
})();
