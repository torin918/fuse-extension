import CopyToClipboard from 'react-copy-to-clipboard';

import Img_logo from '~assets/svg/logo.svg';
import Icon from '~components/icon';
import { showToast } from '~components/toast';

function AboutPage() {
    return (
        <div className="w-full px-5">
            <div className="flex w-full flex-col items-center justify-center py-[50px]">
                <div className="w-[70px]">
                    <img src={Img_logo} className="w-full" />
                </div>
                <span className="py-3 text-3xl font-bold text-[#FFCF13]">FUSE</span>
                <span className="text-sm text-[#999999]">Version 1.1</span>
            </div>
            <div className="flex flex-col overflow-hidden rounded-xl bg-[#181818]">
                <div className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]">
                    <span className="px-3 text-sm text-[#EEEEEE]">Terms of Service</span>
                    <Icon
                        name="icon-jump"
                        className="h-4 w-4 cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                    ></Icon>
                </div>
                <div className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]">
                    <span className="px-3 text-sm text-[#EEEEEE]">Privacy policy</span>
                    <Icon
                        name="icon-jump"
                        className="h-4 w-4 cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                    ></Icon>
                </div>
                <div className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]">
                    <span className="px-3 text-sm text-[#EEEEEE]">Contact</span>
                    <CopyToClipboard
                        text="Contact@Fuse.com"
                        onCopy={() => {
                            showToast('Copied', 'success');
                        }}
                    >
                        <div className="flex items-center">
                            <span className="pr-3 text-sm text-[#999999]">Contact@Fuse.com</span>
                            <Icon
                                name="icon-copy"
                                className="h-[14px] w-[14px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                            ></Icon>
                        </div>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
