import {RPCClient} from 'rpc-bitcoin';
import {
	BITCOIN_RPC_HOST, 
	BITCOIN_RPC_PORT, 
	BITCOIN_RPC_USER, 
	BITCOIN_RPC_PASS, 
	BITCOIN_RPC_TIMEOUT
} from '../constant';

export type IAnalyzePSBTResult = {
  inputs: {
    has_utxo: boolean;
    is_final: boolean;
    next: string;
  }[];
  next: string;
};

let client:RPCClient|undefined;

export class NodeRPC {
	static getClient(): RPCClient {
		if (client) return client;
		client = new RPCClient({
			url: BITCOIN_RPC_HOST, 
			port: BITCOIN_RPC_PORT, 
			timeout: BITCOIN_RPC_TIMEOUT, 
			user: BITCOIN_RPC_USER, 
			pass: BITCOIN_RPC_PASS,
		});
		return client;
	}

	static async getblockcount() {
		const client = this.getClient();
		const count = await client.getblockcount();
		return count
	}

	static async getrawtransaction(txid: string): Promise<string> {
		const client = this.getClient();
		const res = await client.getrawtransaction({txid});
		return res as string;
	}

	static async analyzepsbt(psbt: string): Promise<IAnalyzePSBTResult> {
		const client = this.getClient();
		const res = await client.analyzepsbt({psbt});
		return res as IAnalyzePSBTResult;
	}
}
