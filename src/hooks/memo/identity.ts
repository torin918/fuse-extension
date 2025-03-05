import { getActorCreatorByAgent, principal2account, type ConnectedIdentity } from '@choptop/haw';
import { useEffect, useState } from 'react';

import { get_unique_ic_agent } from '~hooks/store/agent';
import type { IdentityId } from '~types/identity';

const CACHED: Record<IdentityId, ConnectedIdentity> = {};

export const useCurrentConnectedIcIdentity = (current_identity: IdentityId | undefined) => {
    const [identity, setIdentity] = useState<ConnectedIdentity | undefined>(CACHED[current_identity ?? '']);

    useEffect(() => {
        if (!current_identity) return setIdentity(undefined);
        const agent = get_unique_ic_agent();
        if (!agent) return setIdentity(undefined);
        if (identity !== undefined) return; // ? already had
        agent.getPrincipal().then((p) => {
            const principal = p.toText();
            const identity: ConnectedIdentity = {
                principal,
                account: principal2account(principal),
                agent,
                creator: getActorCreatorByAgent(agent),
            };
            setIdentity((CACHED[current_identity] = identity));
        });
    }, [current_identity, identity]);

    return identity;
};
