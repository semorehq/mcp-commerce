// @deprecated — ADR-0062 (2026-04-26): `build_cart` 가 canonical `create_cart`
// 로 rename. 본 모듈은 backward-compat re-export 만 제공.
// 신규 코드는 `../tools/create-cart.js` 의 `createCartTool` 사용.
//
// REMOVAL TIMELINE: 0.3.0.
import { z } from "zod";
export const CartItemSchema = z.object({
    skuId: z.string().min(1),
    qty: z.number().int().min(1).max(99),
});
export const AddressSchema = z.object({
    country: z.string().length(2), // ISO 3166-1 alpha-2
    region: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    line1: z.string().optional(),
    line2: z.string().optional(),
});
export const BuildCartInput = z.object({
    items: z.array(CartItemSchema).min(1).max(50),
    address: AddressSchema,
    language: z.enum(["en", "ja", "de", "fr", "es", "ko"]).default("en"),
    currency: z.enum(["USD", "JPY", "EUR", "KRW"]).default("USD"),
});
export const BuildCartLineSchema = z.object({
    skuId: z.string(),
    qty: z.number().int(),
    unitPrice: z.string(),
    lineTotal: z.string(),
});
export const BuildCartOutput = z.object({
    cartId: z.string(),
    subtotal: z.string(),
    shipping: z.string(),
    dutyTax: z.string(),
    total: z.string(),
    currency: z.string(),
    lines: z.array(BuildCartLineSchema),
});
const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);
const DEFAULT_OFFLINE_PRICE_USD = 25;
export const offlineStubPricer = async (input) => {
    const lines = input.items.map((i) => ({
        skuId: i.skuId,
        qty: i.qty,
        unitPrice: fmt(DEFAULT_OFFLINE_PRICE_USD),
        lineTotal: fmt(DEFAULT_OFFLINE_PRICE_USD * i.qty),
    }));
    const subtotalNum = lines.reduce((s, l) => s + Number(l.lineTotal), 0);
    const shippingNum = input.items.length * 5;
    const dutyTaxNum = subtotalNum * 0.1;
    const totalNum = subtotalNum + shippingNum + dutyTaxNum;
    return {
        cartId: `cart_offline_${input.items.length}`,
        subtotal: fmt(subtotalNum),
        shipping: fmt(shippingNum),
        dutyTax: fmt(dutyTaxNum),
        total: fmt(totalNum),
        currency: input.currency,
        lines,
    };
};
export function makeBuildCartTool(options = {}) {
    const pricer = options.pricer ?? offlineStubPricer;
    return {
        name: "build_cart",
        description: "Compute a priced cart (subtotal + shipping + duty + tax) for the given items and destination.",
        inputSchema: BuildCartInput,
        outputSchema: BuildCartOutput,
        handler: async (input) => pricer(input),
    };
}
export const buildCartTool = makeBuildCartTool();
