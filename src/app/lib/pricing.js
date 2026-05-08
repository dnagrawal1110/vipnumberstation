// dealerPrice × (1 + commission/100) = sellingPrice (price)
// sellingPrice / 0.85 = MRP  → shows 15% discount on site
export function calcPrices(dealerPrice, commissionPct = 25) {
  const price = Math.ceil(dealerPrice * (1 + commissionPct / 100));
  const mrp   = Math.ceil(price / 0.85);
  return { price, mrp, discount: 15 };
}
