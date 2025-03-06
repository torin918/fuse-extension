import * as fs from 'fs';
import * as path from 'path';
import { anonymous } from '@choptop/haw';
import BigNumber from 'bignumber.js';

import { get_token_info_ic } from '~hooks/store/local/token/ic/info';
import { list_sns_canisters } from '~lib/canisters/sns_root';
import type { IcTokenInfo } from '~types/tokens/ic';

type TokenItem = {
    root_canister_id: string;
    name: string;
    url: string;
    logo: string;
    description: string;
};

const main = async () => {
    const response = await fetch(
        'https://sns-api.internetcomputer.org/api/v1/snses?offset=0&limit=100&include_swap_lifecycle=LIFECYCLE_ADOPTED&include_swap_lifecycle=LIFECYCLE_COMMITTED&include_swap_lifecycle=LIFECYCLE_OPEN&include_swap_lifecycle=LIFECYCLE_PENDING&include_swap_lifecycle=LIFECYCLE_UNSPECIFIED',
    );
    const json = await response.json();
    const data = json.data as TokenItem[];

    // save images
    const items: {
        token: TokenItem;
        ext: string;
        token_info: IcTokenInfo;
        import_logo_name: string;
        token_info_name: string;
    }[] = [];
    for (const d of await Promise.all(
        data.map(async (d) => {
            const canisters = await list_sns_canisters(anonymous, d.root_canister_id);
            if (canisters.ledger === undefined) throw new Error(`ledger canister not found: ${d.root_canister_id}`);
            const token_info = await get_token_info_ic(canisters.ledger);
            if (token_info === undefined) throw new Error(`token info not found: ${d.root_canister_id}`);
            return {
                ...d,
                canisters,
                token_info,
            };
        }),
    )) {
        const logo = d.logo;
        let ext = (() => {
            if (logo.startsWith('data:image/svg+xml')) return 'svg';
            if (logo.startsWith('data:image/png')) return 'png';
            throw new Error(`unknown logo extension: ${logo}`);
        })();
        const token_info = d.token_info;
        const name = `${token_info.symbol}.${ext}`;
        const binary = Buffer.from(logo.replace(/^data:image\/(png|jpeg|jpg|svg\+xml);base64,/, ''), 'base64');
        fs.writeFileSync(path.join(__dirname, '../src/assets/svg/tokens/ic/sns', name), binary);
        const n = token_info.symbol.toUpperCase().replaceAll('-', '_');
        items.push({
            token: d,
            ext,
            token_info,
            import_logo_name: `TOKEN_IC_SNS_${n}_${ext.toUpperCase()}`,
            token_info_name: `TOKEN_INFO_IC_SNS_${n}`,
        });
    }

    // print import
    const max_logo_length = Math.max(...items.map((item) => item.token_info_name.length));
    console.log(`============== import ==============`);
    console.log(`// SNS`);
    for (const item of items) {
        let spaces = '';
        for (let i = 0; i < max_logo_length - item.import_logo_name.length - 1; i++) spaces += ' ';
        console.log(
            `import ${item.import_logo_name}${spaces} from 'data-base64:~assets/svg/tokens/ic/sns/${item.token_info.symbol}.${item.ext === 'svg' ? 'min.svg' : 'png'}';`,
        );
    }

    // print preset
    console.log(``);
    console.log(`============== preset logo ==============`);
    console.log(`    // SNS`);
    for (const item of items) {
        console.log(`    'ic#${item.token_info.canister_id}': ${item.import_logo_name},`);
    }

    // print token info
    const max_token_info_length = Math.max(...items.map((item) => item.token_info_name.length));
    const max_token_name_length = Math.max(...items.map((item) => item.token_info.name.length));
    const max_decimals_length = Math.max(...items.map((item) => item.token_info.decimals.toString().length));
    const max_fee_length = Math.max(...items.map((item) => item.token_info.fee.length));
    console.log(``);
    console.log(`============== token info ==============`);
    console.log(`// SNS`);
    for (const item of items) {
        let token_info_spaces = '';
        for (let i = 0; i < max_token_info_length - item.token_info_name.length; i++) token_info_spaces += ' ';
        let token_name_spaces = '';
        for (let i = 0; i < max_token_name_length - item.token_info.name.length; i++) token_name_spaces += ' ';
        let decimals_spaces = '';
        for (let i = 0; i < max_decimals_length - item.token_info.decimals.toString().length; i++)
            decimals_spaces += ' ';
        let fee_spaces = '';
        for (let i = 0; i < max_fee_length - item.token_info.fee.length; i++) fee_spaces += ' ';
        console.log(
            `const ${item.token_info_name}${token_info_spaces} : IcTokenInfo = { canister_id: '${item.token_info.canister_id}', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: '${item.token_info.name}',${token_name_spaces} symbol: '${item.token_info.symbol}',${token_info_spaces} decimals: ${decimals_spaces}${item.token_info.decimals}, fee: ${fee_spaces}'${item.token_info.fee}' }; // fee ${BigNumber(
                item.token_info.fee,
            )
                .div(BigNumber(10).pow(BigNumber(item.token_info.decimals)))
                .toFixed()} ${item.token_info.symbol}`,
        );
    }

    // print preset all token info
    console.log(``);
    console.log(`============== preset all token info ==============`);
    console.log(`    // SNS`);
    for (const item of items) {
        let token_info_spaces = '';
        for (let i = 0; i < max_token_info_length - item.token_info_name.length; i++) token_info_spaces += ' ';
        console.log(
            `    { info: { ic: ${item.token_info_name}${token_info_spaces} }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },`,
        );
    }
};

main();
