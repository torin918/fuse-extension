import { HeroUIProvider } from '@heroui/react';
import { HashRouter, useRoutes } from 'react-router-dom';

import { getRoutes } from '~pages/routes';

import '~styles/globals.css';
import '../assets/iconfont/iconfont';

import { useBackground } from '~hooks/memo/background';

// routes of notification page
const routes = getRoutes('notification');

// Tab Pages is a feature unique to the Plasmo framework.
// Unlike Extension Pages, Tab Pages are just regular web pages shipped with your extension bundle.
// Extensions generally redirect to or open these pages programmatically, but you can link to them as well.
// Use Cases
// - A page to show when a user first installs your extension.
// - A dedicated page for authentication
// - When you need a more elaborate routing setup
function NotificationPage() {
    return (
        <HashRouter>
            <HeroUIProvider>
                <div className="flex h-full w-full flex-col">
                    <InnerNotificationPage />
                </div>
            </HeroUIProvider>
        </HashRouter>
    );
}

export default NotificationPage;

function InnerNotificationPage() {
    useBackground();
    const views = useRoutes(routes);
    return <>{views}</>;
}
