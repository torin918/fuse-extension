import { HeroUIProvider } from '@heroui/react';
import { HashRouter, useRoutes } from 'react-router-dom';

import { getRoutes } from '~pages/routes';

import '~styles/globals.css';
import '../assets/iconfont/iconfont';

import { useBackground } from '~hooks/memo/background';

// routes of sidepanel page
const routes = getRoutes('popup');

// The Side Panel allows extensions to display their own UI in the side panel,
// enabling persistent experiences that complement the user's browsing journey.
function IndexSidePanel() {
    return (
        <HashRouter>
            <HeroUIProvider>
                <div className="flex h-full min-h-screen w-screen flex-col">
                    <InnerIndexSidePanel />
                </div>
            </HeroUIProvider>
        </HashRouter>
    );
}

export default IndexSidePanel;

function InnerIndexSidePanel() {
    useBackground();
    const views = useRoutes(routes);
    return <>{views}</>;
}
