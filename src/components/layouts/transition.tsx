import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTimeout } from 'usehooks-ts';

const TRANSITION_TIMEOUT = 300;

export const FusePageTransition = ({
    setHide,
    children,
}: {
    setHide?: (v: { hide?: () => Promise<void> }) => void;
    children: React.ReactNode;
}) => {
    const ref = useRef(null);

    const [show, setShow] = useState<boolean>(false);
    useTimeout(() => setShow(true), 1);
    useEffect(() => {
        if (!setHide) return;
        setHide({
            hide: () =>
                new Promise<void>((resolve) => {
                    setShow(false);
                    setTimeout(() => resolve(), TRANSITION_TIMEOUT * 0.7);
                }),
        });
    }, [setHide]);

    return (
        <div className="w-full">
            <CSSTransition nodeRef={ref} in={show} classNames="fuse-page-left" timeout={TRANSITION_TIMEOUT}>
                <div ref={ref}>{children}</div>
            </CSSTransition>
        </div>
    );
};
