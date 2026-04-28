// create_cart — canonical Semore MCP commerce tool #3 (ADR-0062).
//
// items + 도착지 → cart_id + 초기 견적 (subtotal+ship+duty+import_tax)
// 반환. 기존 build_cart 자리 (rename, 동작 동일). manifest.json:59-63 와 정합.
import { z } from "zod";
export const CartItemSchema = z.object({
    sku_id: z.string().min(1),
    qty: z.number().int().min(1).max(99),
    /** Optional variant/option payload (size, color, etc). */
    options: z.record(z.string(), z.string()).optional(),
});
export const AddressSchema = z.object({
    /** ISO 3166-1 alpha-2. */
    country: z.string().length(2),
    region: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    line1: z.string().optional(),
    line2: z.string().optional(),
});
export const CreateCartInput = z.object({
    items: z.array(CartItemSchema).min(1).max(50),
    address: AddressSchema,
    language: z.enum(["en", "ja", "de", "fr", "es", "ko"]).default("en"),
    currency: z.enum(["USD", "JPY", "EUR", "KRW"]).default("USD"),
});
export const CartLineSchema = z.object({
    sku_id: z.string(),
    qty: z.number().int(),
    unit_price_usd: z.string(),
    line_total_usd: z.string(),
});
export const CreateCartOutput = z.object({
    cart_id: z.string(),
    line_items: z.array(CartLineSchema),
    subtotal_usd: z.string(),
    shipping_usd: z.string(),
    duty_usd: z.string(),
    import_tax_usd: z.string(),
    total_usd: z.string(),
    currency: z.string(),
    /** Unix epoch (seconds) — TTL 만료 시각. */
    expires_at: z.number().int(),
});
const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);
const DEFAULT_OFFLINE_PRICE_USD = 25;
const DEFAULT_TTL_SECONDS = 15 * 60; // 15 분
export const offlineStubPricer = async (input) => {
    const lines = input.items.map((i) => ({
        sku_id: i.sku_id,
        qty: i.qty,
        unit_price_usd: fmt(DEFAULT_OFFLINE_PRICE_USD),
        line_total_usd: fmt(DEFAULT_OFFLINE_PRICE_USD * i.qty),
    }));
    const subtotal = lines.reduce((s, l) => s + Number(l.line_total_usd), 0);
    const shipping = input.items.length * 5;
    const duty = subtotal * 0.05;
    const importTax = subtotal * 0.05;
    const total = subtotal + shipping + duty + importTax;
    return {
        cart_id: `cart_offline_${input.items.length}_${Date.now().toString(36)}`,
        line_items: lines,
        subtotal_usd: fmt(subtotal),
        shipping_usd: fmt(shipping),
        duty_usd: fmt(duty),
        import_tax_usd: fmt(importTax),
        total_usd: fmt(total),
        currency: input.currency,
        expires_at: Math.floor(Date.now() / 1000) + DEFAULT_TTL_SECONDS,
    };
};
export function makeCreateCartTool(options = {}) {
    const pricer = options.pricer ?? offlineStubPricer;
    return {
        name: "create_cart",
        description: "Create a Semore cart with items + destination address. Returns cart_id + itemized cross-border quote (subtotal + shipping + duty + import tax) and TTL.",
        inputSchema: CreateCartInput,
        outputSchema: CreateCartOutput,
        handler: async (input) => pricer(input),
    };
}
export const createCartTool = makeCreateCartTool();
