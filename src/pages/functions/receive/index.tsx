import CopyToClipboard from 'react-copy-to-clipboard';

import token_img from '~assets/svg/icp.svg';
import Icon from '~components/icon';
import { showToast } from '~components/toast';
import type { MainPageState } from '~pages/functions';

function ReceivePage({ setState }: { setState: (state: MainPageState) => void }) {
    return (
        <div className="flex h-screen w-full flex-col">
            <div className="flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                <div onClick={() => setState('home')}>
                    <Icon
                        name="icon-arrow-left"
                        className="h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                </div>
                <div className="text-lg">Receive</div>
                <div className="w-[14px]" onClick={() => setState('home')}>
                    <Icon
                        name="icon-close"
                        className="h-5 w-5 cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                </div>
            </div>
            <div className="h-full w-full flex-1 overflow-y-auto px-5">
                <div className="flex justify-center py-10">
                    <div className="relative h-[160px] w-[160px] overflow-hidden rounded-xl bg-white">
                        <img
                            src={token_img}
                            className="absolute left-1/2 top-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-[2px] border-white"
                        />
                        <img
                            src="data:image/png;base64,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"
                            className="h-full w-full"
                        />
                    </div>
                </div>
                <div className="w-full rounded-xl bg-[#181818] px-3">
                    <div className="w-full border-b border-[#333333] py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#999999]">Account ID</span>
                            <CopyToClipboard
                                text="87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413"
                                onCopy={() => {
                                    showToast('Copied', 'success');
                                }}
                            >
                                <div className="flex cursor-pointer items-center text-sm text-[#FFCF13] duration-300 hover:opacity-85">
                                    <Icon name="icon-copy" className="mr-2 h-3 w-3" />
                                    Copy
                                </div>
                            </CopyToClipboard>
                        </div>
                        <p className="block w-full break-words py-2 text-sm">
                            87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413
                        </p>
                    </div>
                    <div className="w-full py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#999999]">Principal ID</span>
                            <CopyToClipboard
                                text="uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe"
                                onCopy={() => {
                                    showToast('Copied', 'success');
                                }}
                            >
                                <div className="flex cursor-pointer items-center text-sm text-[#FFCF13] duration-300 hover:opacity-85">
                                    <Icon name="icon-copy" className="mr-2 h-3 w-3" />
                                    Copy
                                </div>
                            </CopyToClipboard>
                        </div>
                        <p className="block w-full break-words py-2 text-sm">
                            uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReceivePage;
