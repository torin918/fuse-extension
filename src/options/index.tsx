import { HeroUIProvider } from '@heroui/react';

import '~styles/globals.css';
import '../assets/iconfont/iconfont';

import { HashRouter, useRoutes } from 'react-router-dom';

import { useBackground } from '~hooks/memo/background';
import { getRoutes } from '~pages/routes';

// routes of options page
const routes = getRoutes('options');

// The options page is meant to be a dedicated place for the extension's settings and configuration.
function IndexOptions() {
    return (
        <HashRouter>
            <HeroUIProvider>
                <div className="flex h-full w-full flex-col">
                    <InnerIndexOptions />
                </div>
            </HeroUIProvider>
        </HashRouter>
    );
}

export default IndexOptions;

function InnerIndexOptions() {
    useBackground();
    const views = useRoutes(routes);
    return <>{views}</>;
}
