import type { ApproveIcAction } from './approve-ic';
import type { ConnectAction } from './connect';

export type PopupAction = { connect: ConnectAction } | { approve_ic: ApproveIcAction };

export type PopupActions = PopupAction[];

export const match_popup_action = <T>(
    self: PopupAction,
    { connect, approve_ic }: { connect: (connect: ConnectAction) => T; approve_ic: (approve_ic: ApproveIcAction) => T },
): T => {
    if ('connect' in self) return connect(self.connect);
    if ('approve_ic' in self) return approve_ic(self.approve_ic);
    throw new Error(`Unknown popup action: ${Object.keys(self)[0]}`);
};

export const match_popup_action_async = <T>(
    self: PopupAction,
    {
        connect,
        approve_ic,
    }: { connect: (connect: ConnectAction) => Promise<T>; approve_ic: (approve_ic: ApproveIcAction) => Promise<T> },
): Promise<T> => {
    if ('connect' in self) return connect(self.connect);
    if ('approve_ic' in self) return approve_ic(self.approve_ic);
    throw new Error(`Unknown popup action: ${Object.keys(self)[0]}`);
};

export const get_popup_action_id = (self: PopupAction): string => {
    return match_popup_action(self, {
        connect: (connect: ConnectAction) => `connect:${connect.message_id}`,
        approve_ic: (approve_ic: ApproveIcAction) => `approve_id#${approve_ic.id}`,
    });
};

export const is_same_popup_action = (a: PopupAction, b: PopupAction): boolean => {
    return get_popup_action_id(a) === get_popup_action_id(b);
};
