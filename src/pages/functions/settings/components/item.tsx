import { useNavigate } from 'react-router-dom';

import Icon from '~components/icon';

export const SettingsItem = ({
    icon,
    path,
    title,
    tip,
    arrow = true,
    right,
}: {
    icon?: React.ReactNode;
    path: string | (() => void);
    title: string;
    tip?: string | number;
    arrow?: boolean;
    right?: React.ReactNode;
}) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => {
                if (typeof path === 'string') navigate(path);
                else path();
            }}
            className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]"
        >
            <div className="flex items-center">
                {icon}
                <span className="px-3 text-sm text-[#EEEEEE]">{title}</span>
            </div>
            <div className="flex items-center">
                {tip !== undefined && <span className="pr-2 text-sm text-[#999999]">{tip}</span>}
                {arrow && <Icon name="icon-arrow-right" className="h-[9px] w-[14px] cursor-pointer text-[#999999]" />}
                {right}
            </div>
        </div>
    );
};
