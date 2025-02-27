export type MessageResult<T, E> = { ok: T; err?: undefined } | { ok?: undefined; err: E };

// message
// * Extension-Pages/CS	-> BGSW
export const MESSAGE_PING = 'ping';

// message via relay
// * Website -> CS/BGSW
export const RELAY_MESSAGE_PING = 'relay-ping';
export const RELAY_MESSAGE_GET_FAVICON = 'relay-get-favicon';
export const RELAY_MESSAGE_REQUEST_CONNECT = 'relay-request-connect';
export const RELAY_MESSAGE_IS_CONNECTED = 'relay-is-connected';
export const RELAY_MESSAGE_DISCONNECT = 'relay-disconnect';
export const RELAY_MESSAGE_GET_ADDRESS = 'relay-get-address';
export const RELAY_MESSAGE_IC_PROXY_AGENT = 'relay-ic-proxy-agent';

// ports
// * Extension-Pages/CS	-> BGSW
// * BGSW -> Extension-Pages/CS
export const PORT_MAIL = 'mail';

// ports + relay
// * BGSW -> WebPage
