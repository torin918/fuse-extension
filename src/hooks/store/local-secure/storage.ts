import { useEffect, useState } from 'react';

import type { SecureStorage } from '@plasmohq/storage/secure';

export const useSecureStorageInner = (password: string, secure_storage: SecureStorage): SecureStorage | undefined => {
    const [storage, setStorage] = useState<SecureStorage>();

    useEffect(() => {
        if (!password) return setStorage(undefined);
        secure_storage.setPassword(password).then(() => {
            setStorage(secure_storage);
        });
    }, [secure_storage, password]);

    return storage;
};
