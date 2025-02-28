import { ProxyMessageKind, ProxyStubAgent, type ProxyMessage, type ProxyMessageError } from '@dfinity/agent';
import { IDL, type JsonValue } from '@dfinity/candid';
import { mapping_func } from '@jellypack/runtime/lib/wasm/candid';
import { parse_func_candid } from '@jellypack/wasm-react';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import {
    delete_current_session_approve,
    delete_popup_action,
    find_current_session_approve,
    push_popup_action,
} from '~hooks/store';
import { get_unique_ic_agent } from '~hooks/store/agent';
import { get_current_info } from '~hooks/store/local-secure';
import { get_current_notification, open_notification } from '~lib/notification';
import { parse_proxy_message, stringify_proxy_message } from '~lib/utils/ic-message';
import { stringify_factory } from '~lib/utils/json';
import { get_popup_action_id, type PopupAction } from '~types/actions';
import type { ApproveIcAction } from '~types/actions/approve-ic';
import type { CurrentInfo } from '~types/current';
import type { CurrentWindow } from '~types/window';

interface RequestBodyService {
    window?: CurrentWindow;
    timeout: number;
    origin: string;
    canister_id: string;
    service: [string, string][];
}

export type RequestBody = { service: RequestBodyService } | { request: { origin: string; request: string } }; // ! stringify ProxyMessage cause Uint8Array will be change to plain object
export type ResponseBody = string; // ! stringify ProxyMessage cause Uint8Array will be change to plain object

const services = new Map<string, Map<string, { window?: CurrentWindow; timeout: number; list: IDL.ServiceClass[] }>>();
const stringify = stringify_factory(JSON.stringify);

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    if (!req.body) throw new Error(`can not find request body from ic-proxy-agent message`);
    const body: RequestBody = req.body;

    const response = await match_ic_proxy_agent_async<ResponseBody>(req.body, {
        service: async (service) => {
            // * handle service
            let origin = services.get(service.origin);
            if (origin === undefined) {
                origin = new Map();
                services.set(service.origin, origin);
            }
            const item = origin.get(service.canister_id) ?? { timeout: service.timeout, list: [] };
            const found = item.list.some((s) => JSON.stringify(s) === JSON.stringify(service.service));
            let changed = false;
            if (JSON.stringify(item.window) !== JSON.stringify(service.window)) {
                changed = true;
                item.window = service.window;
            }
            if (!found) {
                changed = true;
                item.list.push(await restore_service(service.service));
            }
            if (item.timeout !== service.timeout) {
                changed = true;
                item.timeout = service.timeout;
            }
            if (changed) origin.set(service.canister_id, item);
            return '';
        },
        request: async (request) => {
            // * handle request
            const msg: ProxyMessage = parse_proxy_message(request.request);
            console.debug('===>>> 🎁 receive message', [body], '->', [msg]);

            const current_info = await get_current_info();
            if (!current_info) return handle_error(msg.id, `disconnected`);

            const agent = get_unique_ic_agent();
            if (!agent) return handle_error(msg.id, `disconnected`);

            // Intercept messages that require popup confirmation
            const intercepted = await intercept_request(request.origin, msg);
            if (intercepted !== undefined) return intercepted;

            // ? do request
            const response: ResponseBody = await new Promise((resolve) => {
                const proxy = new ProxyStubAgent((msg) => {
                    const response = stringify_proxy_message(msg);
                    console.debug('<<<=== 📦 got message after sent to agent', [msg], '->', [response]);
                    resolve(response);
                }, agent);
                proxy.onmessage(msg);
            });

            return response;
        },
    });

    return res.send(response);
};

export default handler;

const match_ic_proxy_agent_async = async <T>(
    self: RequestBody,
    {
        service,
        request,
    }: {
        service: (service: RequestBodyService) => Promise<T>;
        request: (request: { origin: string; request: string }) => Promise<T>;
    },
): Promise<T> => {
    if ('service' in self) return service(self.service);
    if ('request' in self) return request(self.request);
    throw new Error(`can not match ic-proxy-agent message: ${JSON.stringify(self)}`);
};

const restore_service = async (service: [string, string][]): Promise<IDL.ServiceClass> => {
    const fields: Record<string, IDL.FuncClass> = {};
    for (const [name, func] of service) {
        const single_api = `${name}: ${func}`.replaceAll('→', '->');
        // console.debug(`🚀 ~ const restore_service= ~ single_api:`, single_api);
        const [_name, wrapped_func] = await parse_func_candid(single_api, (s) => s, false);
        fields[_name] = mapping_func(IDL, wrapped_func) as any; // TODO version is not match, check plug wallet again
    }
    return new IDL.ServiceClass(fields);
};

const handle_error = (id: number, error: string): ResponseBody => {
    const message_error: ProxyMessageError = { id, type: ProxyMessageKind.Error, error };
    return stringify_proxy_message(message_error);
};

const intercept_request = async (origin: string, msg: ProxyMessage): Promise<ResponseBody | undefined> => {
    switch (msg.type) {
        case ProxyMessageKind.Query: {
            break; // TODO query
        }
        case ProxyMessageKind.Call: {
            // * intercept
            const [canister_id, { methodName: method, arg }] = msg.args;
            // TODO pass canister_id.method or not
            // do approve
            const window_timeout_and_func = find_window_timeout_and_func(origin, canister_id, method);
            if (window_timeout_and_func === undefined)
                return handle_error(msg.id, `can not find service with method: ${method}`);
            const [current_window, timeout, func] = window_timeout_and_func;
            console.debug(`🚀 ~ const intercept_request= ~ func:`, func);
            const func_text = func.display();
            const args = decode_args(func, arg);
            // const args_text = stringify(args);
            const args_text = IDL.FuncClass.argsToString(func.argTypes, args);
            console.debug(
                `🚀 ~ const intercept_request= ~ args_text:`,
                timeout,
                func_text,
                args,
                args_text,
                stringify(args),
            );

            // do popup
            let action: PopupAction | undefined = undefined;
            const current_info: CurrentInfo | undefined = await get_current_info();
            if (current_info === undefined) return handle_error(msg.id, `disconnected`);
            let popup = false; // only popup once
            let approve_id = '';
            try {
                // * insert action
                const approve_action: ApproveIcAction = {
                    type: 'approve_ic',
                    id: msg.id,
                    origin,
                    canister_id,
                    method,
                    func_text,
                    args_text,
                };
                action = { approve_ic: approve_action };
                await push_popup_action(action); // * push action

                // // check first
                // const approved = await find_approved(current_info, origin, approve_id);
                // if (approved !== undefined) {
                //     return res.send({ ok: connected });
                // }

                approve_id = get_popup_action_id(action);
                const response = await new Promise<ResponseBody | undefined>((resolve) => {
                    const got_response = (response: ResponseBody | undefined, interval_id: NodeJS.Timeout) => {
                        clearInterval(interval_id);
                        resolve(response);
                    };
                    const s = Date.now();
                    const interval_id = setInterval(() => {
                        (async () => {
                            // check timeout
                            const n = Date.now();
                            if (n - s > timeout) return got_response(handle_error(msg.id, `timeout`), interval_id);

                            const approved = await find_approved(current_info, origin, approve_id);
                            if (approved !== undefined) {
                                return got_response(
                                    approved ? undefined : handle_error(msg.id, `User refused`),
                                    interval_id,
                                );
                            }

                            const window = await get_current_notification(false); // do not focus window
                            if (window === undefined && !popup) {
                                popup = true; // * only open notification once
                                await open_notification(current_window);
                            }
                        })();
                    }, 67);
                });
                return response;
            } catch (e) {
                return handle_error(msg.id, `${e}`);
            } finally {
                if (action) await delete_popup_action(action); // * delete action
                if (approve_id) {
                    await delete_current_session_approve(
                        current_info.current_identity,
                        current_info.current_chain_network,
                        'ic',
                        origin,
                        approve_id,
                    );
                }
            }
        }
    }
    return undefined;
};

const find_approved = async (
    current_info: CurrentInfo,
    origin: string,
    approve_id: string,
): Promise<boolean | undefined> => {
    const approved = await find_current_session_approve(
        current_info.current_identity,
        current_info.current_chain_network,
        'ic',
        origin,
        approve_id,
    );
    return approved;
};

const find_window_timeout_and_func = (
    origin: string,
    canister_id: string,
    method: string,
): [CurrentWindow | undefined, number, IDL.FuncClass] | undefined => {
    const item = services.get(origin)?.get(canister_id);
    if (item === undefined) return undefined;
    const { window, timeout, list } = item;
    const func = (() => {
        for (let i = list.length - 1; 0 <= i; i--) {
            const service = list[i];
            const func = service._fields.find(([m]) => m === method);
            if (func) return func[1];
        }
        return undefined;
    })();
    if (func === undefined) return undefined;
    return [window, timeout, func];
};

const decode_args = (func: IDL.FuncClass, arg: ArrayBuffer): JsonValue[] => {
    const args = IDL.decode(func.argTypes, arg);
    return args;
};
