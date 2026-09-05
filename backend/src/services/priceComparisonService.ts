import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PriceComparisonResult {
  productId: string;
  productName: string;
  unit: string;
  farmConnectPrice: number;
  localMarketPrice: number;
  retailPrice: number;
  savingsVsLocalAmount: number;
  savingsVsLocalPercent: number;
  savingsVsRetailAmount: number;
  savingsVsRetailPercent: number;
}

export const getPriceComparison = async (productId: string): Promise<PriceComparisonResult> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { priceHistory: { orderBy: { recordedAt: 'desc' }, take: 1 } }
  });

  if (!product) {
    throw new Error('Product not found for price comparison');
  }

  const farmConnectPrice = product.price;
  let localMarketPrice = Math.round(farmConnectPrice * 1.25);
  let retailPrice = Math.round(farmConnectPrice * 1.50);

  if (product.priceHistory && product.priceHistory.length > 0) {
    localMarketPrice = product.priceHistory[0].localMarketPrice;
    retailPrice = product.priceHistory[0].retailPrice;
  }

  const savingsVsLocalAmount = Math.max(0, localMarketPrice - farmConnectPrice);
  const savingsVsLocalPercent = Math.round((savingsVsLocalAmount / localMarketPrice) * 100);
  const savingsVsRetailAmount = Math.max(0, retailPrice - farmConnectPrice);
  const savingsVsRetailPercent = Math.round((savingsVsRetailAmount / retailPrice) * 100);

  return {
    productId: product.id,
    productName: product.name,
    unit: product.unit,
    farmConnectPrice,
    localMarketPrice,
    retailPrice,
    savingsVsLocalAmount,
    savingsVsLocalPercent,
    savingsVsRetailAmount,
    savingsVsRetailPercent
  };
};
