import { Input } from '@heroui/react';
import { useEffect, useState } from 'react';

import { cn } from '~lib/utils/cn';

import Icon from './icon';

function InputPassword({
    placeholder,
    errorMessage,
    onChange,
}: {
    placeholder?: string;
    errorMessage?: string;
    onChange: (value: string) => void;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [value, setValue] = useState('');

    // TODO TEST
    useEffect(() => {
        setTimeout(() => {
            onChange('1111qqqq');
            setValue('1111qqqq');
        }, 1000);
    }, [onChange]);

    return (
        <Input
            className="w-full"
            classNames={{
                mainWrapper: ['relative'],
                inputWrapper: [
                    'border-1',
                    'border-[#333333]',
                    'outline-[0px]',
                    'text-[#EEEEEE]',
                    '!rounded-xl',
                    errorMessage
                        ? 'group-data-[focus=true]:!border-[#ff2c3f]'
                        : 'group-data-[focus=true]:!border-[#fece13]',
                    errorMessage
                        ? 'group-data-[hover=true]:!border-[#ff2c3f]'
                        : 'group-data-[hover=true]:!border-[#fece13]',
                    errorMessage ? '!hover:border-[#ff2c3f]' : '!hover:border-[#fece13]',
                ],
                helperWrapper: ['absolute bottom-[-20px] left-0'],
            }}
            endContent={
                <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}>
                    {isVisible ? (
                        <Icon
                            name="icon-eye"
                            className={cn('h-[12px] w-[18px] text-[#fece13]', errorMessage && 'text-[#ff2c3f]')}
                        />
                    ) : (
                        <Icon
                            name="icon-eye-slash"
                            className={cn('h-[12px] w-[18px] text-[#999999]', errorMessage && 'text-[#ff2c3f]')}
                        />
                    )}
                </button>
            }
            placeholder={placeholder}
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            errorMessage={errorMessage}
            isInvalid={!!errorMessage}
            color={!value ? undefined : errorMessage ? 'danger' : 'success'}
            onChange={(e) => {
                const value = e.target.value;
                onChange(value);
                setValue(value);
            }}
            value={value}
            size="lg"
        />
    );
}

export default InputPassword;
