export const life = 42;

// Sandbox Pages are special extension pages with a different set of CSP restrictions.
// For example, it is possible to eval arbitrary code inside a sandbox page.
// Use the sandbox page to dynamically run code in a secure context with more privileges compared to an extension page.

// A sandbox page can mount UI components similar to a CSUI or execute simple scripts.
// The following example showcases the ability to eval arbitrary code from a sandbox page
// and communicate the result back to the caller via message passing.
window.addEventListener('message', async function (event) {
    const source = event.source as {
        window: WindowProxy;
    };

    source.window.postMessage(eval(event.data), event.origin);
});
