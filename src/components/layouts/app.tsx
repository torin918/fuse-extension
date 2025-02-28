import { HeroUIProvider } from '@heroui/react';
import { HashRouter, useRoutes, type RouteObject } from 'react-router-dom';

import '~styles/globals.css';
import '~assets/iconfont/iconfont.js';

import { useBackground } from '~hooks/memo/background';

export const SinglePageApp = ({ className, routes }: { className?: string; routes: RouteObject[] }) => {
    return (
        <HashRouter>
            <HeroUIProvider>
                <div className={className}>
                    <PageRoutes routes={routes} />
                </div>
            </HeroUIProvider>
        </HashRouter>
    );
};

const PageRoutes = ({ routes }: { routes: RouteObject[] }) => {
    useBackground();
    const views = useRoutes(routes);
    return <>{views}</>;
};
