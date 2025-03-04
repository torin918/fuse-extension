import { useEffect, useState } from 'react';

import type { SecureStorage } from '@plasmohq/storage/secure';

const CACHED: Record<string, SecureStorage> = {};

export const useSecureStorageInner = (
    password: string,
    new_secure_storage: () => SecureStorage,
): SecureStorage | undefined => {
    const [storage, setStorage] = useState<SecureStorage | undefined>(CACHED[password]);

    useEffect(() => {
        if (!password) return setStorage(undefined);
        const storage = new_secure_storage();
        storage.setPassword(password).then(() => setStorage((CACHED[password] = storage)));
    }, [new_secure_storage, password]);

    return storage;
};
