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
    } else if (typeof (document as any).msHidden !== 'undefined') {
        return ['msHidden', 'msvisibilitychange']; // cspell: disable-line
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
        return ['webkitHidden', 'webkitvisibilitychange']; // cspell: disable-line
    }
    return [];
})();
let is_page_visible = hidden ? !(document as any)[hidden] : false;
// console.debug(`🚀 ~ is_page_visible:`, is_page_visible);
if (hidden && visibilityChange) {
    document.addEventListener(visibilityChange, () => (is_page_visible = !(document as any)[hidden]), false);
}

// inject
const name = 'fuse'; // export name
const client = new FuseClient(() => is_page_visible);

if (typeof window !== 'undefined') {
    const w = window as any;
    if (w.ic === undefined) w.ic = {};
    w.ic[name] = client;
}
