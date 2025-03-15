import type { PlasmoCSConfig } from 'plasmo';

import { FuseClient } from '~types/clients/ic';

export const config: PlasmoCSConfig = {
    matches: [
        // '<all_urls>',
        'file://*/*',
        'http://*/*',
        'https://*/*',
    ],
    world: 'MAIN', // main world can find
};

// check page visible
const [hidden, visibilityChange] = (() => {
    if (typeof document.hidden !== 'undefined') {
        return ['hidden', 'visibilitychange'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (typeof (document as any).msHidden !== 'undefined') {
        return ['msHidden', 'msvisibilitychange']; // cspell: disable-line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
        return ['webkitHidden', 'webkitvisibilitychange']; // cspell: disable-line
    }
    return [];
})();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let is_page_visible = hidden ? !(document as any)[hidden] : false;
// console.debug(`🚀 ~ is_page_visible:`, is_page_visible);
if (hidden && visibilityChange) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.addEventListener(visibilityChange, () => (is_page_visible = !(document as any)[hidden]), false);
}

// inject
const name = 'fuse'; // export name
const client = new FuseClient(() => is_page_visible);

if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.ic === undefined) w.ic = {};
    w.ic[name] = client;
}
