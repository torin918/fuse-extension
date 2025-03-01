import type { RouteObject } from 'react-router-dom';

import type { WindowType } from '~types/pages';

import ActionsPage from './actions';
import MainPage from './functions';
import FunctionDappsPage from './functions/dapps';
import FunctionSettingsPage from './functions/settings';
import SettingsAccountsPage from './functions/settings/pages/account';
import AccountsSinglePage from './functions/settings/pages/account/edit';
import InitialPage from './initial';
import InnerCreatePage from './initial/create';
import CreateRestorePage from './initial/restore';
import LockedPage from './locked';
import WelcomePage from './welcome';
import FunctionSettingsSecurityPage from './functions/settings/pages/security';

export const getRoutes = (wt: WindowType) => {
    const routes: RouteObject[] = [
        ...(hit(wt, []) ? [{ path: '/welcome', element: <WelcomePage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial', element: <InitialPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial/create', element: <InnerCreatePage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial/restore', element: <CreateRestorePage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/locked', element: <LockedPage wt={wt} /> }] : []),

        ...(hit(wt, []) ? [{ path: '/', element: <MainPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home', element: <MainPage wt={wt} /> }] : []),

        // settings
        // settings/accounts
        ...(hit(wt, []) ? [{ path: '/home/settings', element: <FunctionSettingsPage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/accounts', element: <SettingsAccountsPage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/accounts/extra', element: <InitialPage wt={wt} extra={true} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/accounts/extra/create', element: <InnerCreatePage wt={wt} extra={true} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/accounts/extra/restore', element: <CreateRestorePage wt={wt} extra={true} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/accounts/:id', element: <AccountsSinglePage /> }] : []),
        // settings/security
        ...(hit(wt, []) ? [{ path: '/home/settings/security', element: <FunctionSettingsSecurityPage /> }] : []),

        // dapps
        ...(hit(wt, []) ? [{ path: '/home/dapps', element: <FunctionDappsPage wt={wt} /> }] : []),

        // action
        ...(hit(wt, []) ? [{ path: '/action', element: <ActionsPage wt={wt} /> }] : []),
        { path: '*', element: <MainPage wt={wt} /> },
    ];
    return routes;
};

const hit = (wt: WindowType, excludes: WindowType[]): boolean => {
    if (excludes.includes(wt)) return false;
    return true;
};
