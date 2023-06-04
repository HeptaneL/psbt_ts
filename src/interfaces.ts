import { TxStatus } from '@mempool/mempool.js/lib/interfaces/bitcoin/transactions';
import * as bitcoin from 'bitcoinjs-lib';

export interface IListingState {
  seller: {
    makerFeeBp: number;
    sellerOrdAddress: string;
    price: number;
    ordItem: IOrdItem;
    sellerReceiveAddress: string;
    unsignedListingPSBTBase64?: string;
    signedListingPSBTBase64?: string;
    tapInternalKey?: string;
  };

  buyer?: {
    takerFeeBp: number;
    buyerAddress: string;
    buyerTokenReceiveAddress: string;
    feeRateTier: string;
    buyerPublicKey?: string;
    unsignedBuyingPSBTBase64?: string;
    unsignedBuyingPSBTInputSize?: number;
    signedBuyingPSBTBase64?: string;
    buyerDummyUTXOs?: utxo[];
    buyerPaymentUTXOs?: utxo[]; // after the selection
    mergedSignedBuyingPSBTBase64?: string;
  };
}

export interface IOrdAPIPostPSBTListing {
  price: number;
  tokenId: string;
  sellerReceiveAddress: string;
  signedListingPSBTBase64: string;
  tapInternalKey?: string;
}

export interface utxo {
  txid: string;
  vout: number;
  value: number;
  status: TxStatus;
  tx: bitcoin.Transaction;
}

export interface IOrdItem {
  // fixed
  id: string;
  contentURI: string;
  contentType: string;
  contentPreviewURI: string;
  sat: number;
  satName: string;
  genesisTransaction: string;
  genesisTransactionBlockTime?: string;
  genesisTransactionBlockHash?: string;
  inscriptionNumber: number;
  meta?: IOrdItemMeta;
  chain: string;
  owner: string;

  // dynamic
  location: string;
  locationBlockHeight?: number;
  locationBlockTime?: string;
  locationBlockHash?: string;
  outputValue: number;
  output: string;
  mempoolTxId?: string;

  // listing
  listed: boolean;
  listedAt?: string;
  listedPrice?: number;
  listedMakerFeeBp?: number;
  listedSellerReceiveAddress?: string;
}

export interface IOrdItemMeta {
  name: string;
  high_res_img_url?: string;
  status?: string;
  rank?: number;
  attributes?: IOrdItemAttribute[];
}

export interface IOrdItemAttribute {
  trait_type: string;
  value: string;
  status?: string;
  percent?: string;
}
