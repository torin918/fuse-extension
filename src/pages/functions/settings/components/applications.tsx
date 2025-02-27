import { Button } from '@heroui/react';

import Icon from '~components/icon';

function ApplicationsPage() {
    const allapps = [
        {
            linktime: 'Today',
            apps: [
                {
                    id: '1',
                    name: 'Internet Computer',
                    img: 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png',
                },
                { id: '2', name: 'ICU', img: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png' },
                { id: '3', name: 'ICPSwap', img: 'https://metrics.icpex.org/images/ca6gz-lqaaa-aaaaq-aacwa-cai.png' },
            ],
        },
        {
            linktime: 'Yesterday',
            apps: [
                { id: '2', name: 'ICU', img: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png' },
                { id: '3', name: 'ICPSwap', img: 'https://metrics.icpex.org/images/ca6gz-lqaaa-aaaaq-aacwa-cai.png' },
            ],
        },
        {
            linktime: 'Last week',
            apps: [
                {
                    id: '1',
                    name: 'Internet Computer',
                    img: 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png',
                },
                { id: '2', name: 'ICU', img: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png' },
                { id: '3', name: 'ICPSwap', img: 'https://metrics.icpex.org/images/ca6gz-lqaaa-aaaaq-aacwa-cai.png' },
            ],
        },
    ];
    return (
        <div className="flex h-[calc(100vh-60px)] flex-col justify-between">
            <div className="flex-1 overflow-y-auto px-5">
                {allapps.map((item, index) => (
                    <div key={index} className="mt-3 w-full">
                        <div className="pb-2 text-sm text-[#999999]">{item.linktime}</div>
                        {item.apps.map((app, i) => (
                            <div
                                key={i}
                                className="mb-3 block w-full cursor-pointer rounded-xl bg-[#181818] px-4 py-[10px] duration-300 hover:bg-[#2B2B2B]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={app.img} className="h-10 w-10 rounded-full" />
                                        <span className="pl-3 text-base">{app.name}</span>
                                    </div>
                                    <Icon
                                        name="icon-unlink"
                                        className="h-[18px] w-[18px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="w-full p-5">
                <Button className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black">
                    Disconnect All
                </Button>
            </div>
        </div>
    );
}

export default ApplicationsPage;
