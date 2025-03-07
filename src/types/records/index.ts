import type { ApprovedIcRecord } from './approved/approved_ic';
import type { ConnectedRecord } from './connected';
import type { TokenTransferredIcRecord } from './token/transferred_ic';

export type FuseRecord =
    | { connected: ConnectedRecord }
    | { token_transferred_ic: TokenTransferredIcRecord }
    | { approved_ic: ApprovedIcRecord };

// <prefix>:record:<date> => FuseRecord[]
export type FuseRecordList = FuseRecord[];
