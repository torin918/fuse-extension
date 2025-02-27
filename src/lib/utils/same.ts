import { stringify_factory } from './json';

const stringify = stringify_factory(JSON.stringify);
export const same = <T>(a: T, b: T): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') return stringify(a) === stringify(b);
    return false;
};
