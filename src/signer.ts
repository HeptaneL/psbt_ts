import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import {IListingState, IOrdAPIPostPSBTListing} from './interfaces';
import {getSellerOrdOutputValue} from './vendors/feeprovider';
import {NodeRPC} from './vendors/noderpc';

export const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.subarray(1, 33);
const network = bitcoin.networks.regtest;

bitcoin.initEccLib(ecc);

export async function generateUnsignedListingPSBT(
	listing: IListingState,
): Promise<IListingState> {
	const psbt = new bitcoin.Psbt({network});
	const [ordinalUtxoTxId, ordinalUtxoVout] =
		listing.seller.ordItem.output.split(':');

	const tx = bitcoin.Transaction.fromHex(
		await NodeRPC.getrawtransaction(ordinalUtxoTxId),
	);

	if (!listing.seller.tapInternalKey) {
		for (let outputIndex = 0; outputIndex < tx.outs.length; outputIndex++) {
			try {
				tx.setWitness(outputIndex, [])
			} catch {}
		}
	}

	const input: any = {
		hash: ordinalUtxoTxId,
		index: parseInt(ordinalUtxoVout),
		nonWitnessUtxo: tx.toBuffer(),
		witnessUtxo: tx.outs[parseInt(ordinalUtxoVout)],
		sighashType:
			bitcoin.Transaction.SIGHASH_SINGLE |
			bitcoin.Transaction.SIGHASH_ANYONECANPAY,
	};

	if (listing.seller.tapInternalKey) {
		input.tapInternalKey = toXOnly(
			tx.toBuffer().constructor(listing.seller.tapInternalKey, 'hex'));
	}

	psbt.addInput(input);

	const sellerOutput = getSellerOrdOutputValue(
		listing.seller.price,
		listing.seller.makerFeeBp,
		listing.seller.ordItem.outputValue,
	);

	psbt.addOutput({
		address: listing.seller.sellerReceiveAddress,
		value: sellerOutput,
	});

	listing.seller.unsignedListingPSBTBase64 = psbt.toBase64();
	return listing;
}

export async function verifySignedListingPSBTBase64(
	req: IOrdAPIPostPSBTListing,
): Promise<void> {
	const psbt = bitcoin.Psbt.fromBase64(req.signedListingPSBTBase64, {network});
	psbt.data.inputs.forEach((input) => {
		if (input.tapInternalKey) {
			const finalScriptWitness = input.finalScriptWitness;
			if (finalScriptWitness && finalScriptWitness.length > 0) {
				if (finalScriptWitness.toString('hex') == '0141') {
					throw new Error('Invalid signature - no taproot present on the finalScriptWitness');
				}
			}
			else {
				throw new Error('Invalid signature - no finalScriptWitness');
			}
		}
	});

	if (
		(await NodeRPC.analyzepsbt(req.sellerReceiveAddress))?.inputs[0]?.is_final !== true)
	{
		throw new Error('Invaild signature');
	}

}
