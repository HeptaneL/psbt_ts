import {IListingState, IOrdItem} from "./interfaces";
import { NodeRPC } from "./vendors/noderpc";
import { generateUnsignedListingPSBT } from "./signer";


const getCount = async () => {
	const count = await NodeRPC.getblockcount();
	console.log("count:", count);
}

const getPSBT = async () => {
	const item:IOrdItem = {
		id: '0b278b07fdcdec736760c24a6ff354b861fef09de0959b965b0065833ae7032ci0',
		contentType: 'text/plain;charset=utf-8',
		contentURI: '',
		contentPreviewURI: '',
		sat: -1,
		genesisTransaction: '',
		genesisTransactionBlockTime: '',
		inscriptionNumber: 0,
		chain: 'btc-regtest',
		location: '',
		output: '0b278b07fdcdec736760c24a6ff354b861fef09de0959b965b0065833ae7032c:0',
		outputValue: 0.96,
		owner: '',
		listed: false,
		satName: 'satname',
	};
	const listing:IListingState ={
		seller: {
			makerFeeBp: 0,
			sellerOrdAddress: 'bcrt1pqefcjuu406xaadspwcwh5r0n6dsy6ywh8gzgex22crrvzkz2cqzsdsx6g8',
			price: 0.04,
			ordItem:item,
			sellerReceiveAddress: 'bcrt1pqefcjuu406xaadspwcwh5r0n6dsy6ywh8gzgex22crrvzkz2cqzsdsx6g8',
			tapInternalKey: '',
		},
	};
	console.log("before:", listing);
	const list2 = await generateUnsignedListingPSBT(listing);
	console.log("after:", list2);
}

getCount();
//getPSBT();
