import type { MessageResult } from '~lib/messages';
import type { Chain } from '~types/chain';

// approved ic record
export interface ApprovedIcRecord {
    type: 'approved_ic';

    created: number;

    chain: Chain;

    canister_id: string;
    method: string;

    args: string;

    state: MessageResult<string, string>; // Too long and it gets truncated
}
