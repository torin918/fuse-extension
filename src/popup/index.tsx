import { HeroUIProvider } from '@heroui/react';

import '~styles/globals.css';
import '../assets/iconfont/iconfont';

import { HashRouter, useRoutes } from 'react-router-dom';

import { useBackground } from '~hooks/memo/background';
import { getRoutes } from '~pages/routes';

// routes of popup page
const routes = getRoutes('popup');

// The popup page is a small dialog window that opens when a user clicks on the extension's icon in the browser toolbar.
// It is the most common type of extension page.
function IndexPopup() {
    return (
        <HashRouter>
            <HeroUIProvider>
                <div className="flex h-[600px] w-[360px] flex-col">
                    <InnerIndexPopup />
                </div>
            </HeroUIProvider>
        </HashRouter>
    );
}

export default IndexPopup;

function InnerIndexPopup() {
    useBackground();
    const views = useRoutes(routes);
    return <>{views}</>;
}
