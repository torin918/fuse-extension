import { getActorCreatorByAgent, principal2account, type ConnectedIdentity } from '@choptop/haw';
import { useEffect, useState } from 'react';

import { get_unique_ic_agent } from '~hooks/store/agent';
import type { IdentityId } from '~types/identity';

export const useCurrentConnectedIcIdentity = (current_identity: IdentityId | undefined) => {
    const [identity, setIdentity] = useState<ConnectedIdentity>();

    useEffect(() => {
        if (!current_identity) return setIdentity(undefined);
        const agent = get_unique_ic_agent();
        if (!agent) return setIdentity(undefined);
        agent.getPrincipal().then((p) => {
            const principal = p.toText();
            setIdentity({
                principal,
                account: principal2account(principal),
                agent,
                creator: getActorCreatorByAgent(agent),
            });
        });
    }, [current_identity]);

    return identity;
};
