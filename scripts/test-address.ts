import { get_address_by_mnemonic } from '~lib/mnemonic';

const main = async () => {
    const address = get_address_by_mnemonic(
        'tooth palace artefact ticket rebel limit virus dawn party pet return young',
    );
    console.assert(
        address.ic?.owner === 'nicf7-7bhqy-ltzcv-nxk43-l5xml-afruc-bvmvw-lutxr-l6i4m-lgdgj-rqe',
        `wrong ic owner`,
    );
    console.assert(
        address.ic?.account_id ===
            'f81eaa2e86339ba699a237ca699d26464378457e077318b6738e0c7cd90f3e7d',
        `wrong ic account`,
    );

    console.debug(`🚀 ~ IndexOptions ~ address:`, address);
};

main();
