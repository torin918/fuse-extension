import { FuseSlideTransition } from '~components/transition';
import type { WindowType } from '~types/pages';

function FunctionDappsPage({ wt }: { wt: WindowType }) {
    return (
        <FuseSlideTransition>
            <div className="w-full">Dapps</div>
        </FuseSlideTransition>
    );
}

export default FunctionDappsPage;
