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
import FunctionSettingsChangePwdPage from './functions/settings/pages/security/changepwd';
import FunctionSettingsScreenLock from './functions/settings/pages/security/screenlock'
import FunctionSettingsPreferencesPage from './functions/settings/pages/preferences';
import FunctionSettingsCurrency from './functions/settings/pages/preferences/currency';
import FunctionSettingsLanguage from './functions/settings/pages/preferences/language';
import FunctionSettingsAddressesPage from './functions/settings/pages/address';
import FunctionSettingsConnectedAppPage from './functions/settings/pages/connected';
import FunctionSettingsAboutPage from './functions/settings/pages/about';
import FunctionReceivePage from './functions/receive';
import FunctionSwapPage from './functions/swap';
import FunctionTransferTokenPage from './functions/transfer/token';
import FunctionTransferPage from './functions/transfer';
import FunctionTokenPage from './functions/token';

export const getRoutes = (wt: WindowType) => {
    const routes: RouteObject[] = [
        ...(hit(wt, []) ? [{ path: '/welcome', element: <WelcomePage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial', element: <InitialPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial/create', element: <InnerCreatePage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial/restore', element: <CreateRestorePage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/locked', element: <LockedPage wt={wt} /> }] : []),

        ...(hit(wt, []) ? [{ path: '/', element: <MainPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home', element: <MainPage wt={wt} /> }] : []),

        // receive
        ...(hit(wt, []) ? [{ path: '/home/receive', element: <FunctionReceivePage /> }] : []),

        // send
        ...(hit(wt, []) ? [{ path: '/home/transfer', element: <FunctionTransferPage   /> }] : []),
        // send token
        ...(hit(wt, []) ? [{ path: '/home/transfer/token', element: <FunctionTransferTokenPage   /> }] : []),

        // token
        ...(hit(wt, []) ? [{ path: '/home/token', element: <FunctionTokenPage   /> }] : []),
        // token transfer
        ...(hit(wt, []) ? [{ path: '/home/token/transfer', element: <FunctionTransferTokenPage   /> }] : []),


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
        ...(hit(wt, []) ? [{ path: '/home/settings/security/changepwd', element: <FunctionSettingsChangePwdPage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/security/screenlock', element: <FunctionSettingsScreenLock /> }] : []),
        // settings/preferences
        ...(hit(wt, []) ? [{ path: '/home/settings/preferences', element: <FunctionSettingsPreferencesPage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/preferences/currency', element: <FunctionSettingsCurrency /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home/settings/preferences/language', element: <FunctionSettingsLanguage /> }] : []),
        // settings/addresses
        ...(hit(wt, []) ? [{ path: '/home/settings/addresses', element: <FunctionSettingsAddressesPage /> }] : []),
        // settings/connected
        ...(hit(wt, []) ? [{ path: '/home/settings/connected', element: <FunctionSettingsConnectedAppPage /> }] : []),
        // settings/about
        ...(hit(wt, []) ? [{ path: '/home/settings/about', element: <FunctionSettingsAboutPage /> }] : []),

        // swap
        ...(hit(wt, []) ? [{ path: '/home/swap', element: <FunctionSwapPage   /> }] : []),

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
