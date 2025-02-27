import { useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTimeout } from 'usehooks-ts';

export const FuseSlideTransition = ({ children }: { children: React.ReactNode }) => {
    const [key, setKey] = useState<'show' | 'hide'>('hide');
    useTimeout(() => setKey('show'), 13);

    const nodeRef = useRef(null);

    return (
        <div className="w-full">
            <TransitionGroup>
                <CSSTransition nodeRef={nodeRef} key={key} in classNames="fuse-slide" timeout={300}>
                    <div>
                        {key === 'show' && <div ref={nodeRef}>{children}</div>}
                        {key === 'hide' && (
                            <div ref={nodeRef}>
                                <div className="w-full"></div>
                            </div>
                        )}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
};
