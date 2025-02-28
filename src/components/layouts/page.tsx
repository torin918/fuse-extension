import { useNavigatePages } from '~hooks/navigate';
import type { CurrentState } from '~types/state';

export const FusePage = ({
    current_state,
    states,
    replace = false,
    children,
}: {
    current_state: CurrentState;
    states?: CurrentState | CurrentState[];
    replace?: boolean; // can go back or not
    children: React.ReactNode;
}) => {
    useNavigatePages(current_state, replace); // ! always check state and page

    if (states !== undefined) {
        if (Array.isArray(states)) {
            if (!states.includes(current_state)) {
                return <></>;
            }
        } else if (current_state !== states) {
            return <></>;
        }
    }
    return <>{children}</>;
};
