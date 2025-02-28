import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useTimeout } from 'usehooks-ts';

import { usePathname } from '~hooks/store';

const TRANSITION_TIMEOUT = 300;

export const FusePageTransition = ({
    className,
    setHide,
    header,
    children,
}: {
    className?: string;
    setHide?: (v: { hide?: () => Promise<void> }) => void;
    header?: React.ReactNode;
    children: React.ReactNode;
}) => {
    const [pathname, setPathname] = usePathname();
    const location = useLocation();
    const _show = useMemo(() => {
        const path = location.pathname;
        if (path === pathname) return true;
        setPathname(path);
        if (pathname.startsWith(path)) return true;
        return false;
    }, [pathname, setPathname, location]);

    const [show, setShow] = useState<boolean>(_show);
    useTimeout(() => setShow(true), 11);
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

    const ref = useRef(null);
    return (
        <div className={className ?? 'w-full'}>
            {header}
            <CSSTransition nodeRef={ref} in={show} classNames="slide" timeout={TRANSITION_TIMEOUT}>
                <div ref={ref}>{children}</div>
            </CSSTransition>
        </div>
    );
};
