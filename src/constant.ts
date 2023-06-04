export const BITCOIN_RPC_USER = process.env.BITCOIN_RPC_USER || 'root';
export const BITCOIN_RPC_PASS = process.env.BITCOIN_RPC_PASS || '12345678';
export const BITCOIN_RPC_HOST = process.env.BITCOIN_RPC_HOST || 'http://127.0.0.1';
export const BITCOIN_RPC_PORT = Number(process.env.BITCOIN_RPC_PORT ?? 18443);
export const BITCOIN_RPC_TIMEOUT = Number(process.env.BITCOIN_RPC_TIMEOUT ?? 120000);
