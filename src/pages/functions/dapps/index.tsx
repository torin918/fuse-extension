import type { MainPageState } from '~pages/functions';

function DappsPage({ setState }: { setState: (state: MainPageState) => void }) {
    return <div className="w-full">Dapps</div>;
}

export default DappsPage;
