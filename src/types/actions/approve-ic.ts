export interface ApproveIcAction {
    type: 'approve_ic';
    id: number;

    origin: string; // window.location.origin
    canister_id: string;
    method: string;
    func_text: string; // candid display
    args_text: string;
}
