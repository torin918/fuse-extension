export const truncate_principal = (pid: string): string => {
    if (!pid) return '';
    const arr = pid.split('-');
    return `${arr[0]}...${arr[arr.length - 1]}`;
};

export const truncate_text = (text: string): string => {
    const max_length = 8;
    if (text.length <= max_length) return text;
    const truncated = `${text.substring(0, 5)}...${text.substring(text.length - 3)}`;
    return truncated;
};

export const formatNumber = (num: number | string): string => {
    const number = typeof num === 'string' ? parseFloat(num) : num;
    const fixed = number.toFixed(2);
    return fixed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
