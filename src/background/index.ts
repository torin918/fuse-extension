// An extension's background service worker is powerful because it runs in the service worker context(opens in a new tab).
// For example, when in this context, you no longer need to worry about CORS and can fetch resources from any origin.
// It is also common to offload heavy computation to the background service worker.

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        // TODO open survey when uninstall
        // chrome.runtime.setUninstallURL('https://example.com/extension-survey');

        chrome.runtime.openOptionsPage();
        // chrome.tabs.create({ url: './tabs/delta-flyer.html' });
        // chrome.tabs.create({ url: chrome.runtime.getURL('pages/NewPage.html') })
    }
});

export {};

console.log(
    'Live now; make now always the most precious time. Now will never come again.',
    process.env.PLASMO_PUBLIC_SITE_URL,
    process.env.NODE_ENV,
);
