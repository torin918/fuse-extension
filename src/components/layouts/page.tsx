import { useNavigatePages } from '~hooks/navigate';
import { CurrentState } from '~types/state';

export const FusePage = ({
    current_state,
    states = CurrentState.ALIVE,
    replace = false,
    children,
}: {
    current_state: CurrentState;
    states?: CurrentState | CurrentState[] | null;
    replace?: boolean; // can go back or not
    children: React.ReactNode;
}) => {
    useNavigatePages(current_state, replace); // ! always check state and page

    if (states !== undefined && states !== null) {
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
