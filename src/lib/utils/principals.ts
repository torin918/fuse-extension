import { Principal } from '@dfinity/principal';

export const string2principal = (p: string): Principal => Principal.fromText(p);

export const isPrincipalText = (text: string | undefined): boolean => {
    if (!text) return false;
    try {
        string2principal(text);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
        return false;
    }
};

export const isCanisterIdText = (text: string | undefined): boolean => {
    if (!text) return false;
    if (text.length !== 27) return false;
    return isPrincipalText(text);
};
