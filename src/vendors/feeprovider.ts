export function getSellerOrdOutputValue(
	price: number,
	makerFeeBp: number,
	prevUtxoValue: number,
):number {
	return (
		price -
			Math.floor((price * makerFeeBp)/ 10000) + prevUtxoValue);
}
