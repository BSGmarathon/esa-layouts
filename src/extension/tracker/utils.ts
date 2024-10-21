import { get as nodecg } from '@esa-layouts/util/nodecg';

const config = nodecg().bundleConfig.tracker;

function getTrackerBaseUrl(): string {
  const addr = config.address;
  const proto = addr.startsWith('http') ? '' : 'https://';

  return `${proto}${addr}`;
}

export function trackerUrl(path: string): string {
  const addr = getTrackerBaseUrl();

  return `${addr}/tracker${path}`;
}

export function trackerAdminUrl(path: string): string {
  const addr = getTrackerBaseUrl();

  return `${addr}/admin${path}`;
}
