// MCP commerce server bootstrap — canonical 5-tool (ADR-0062, 2026-04-26).
//
// Canonical tools (manifest.json:48-73 와 1:1):
//   1. search_product  — 카탈로그 검색
//   2. get_product     — 단일 SKU 상세
//   3. create_cart     — cart 생성 + 초기 견적
//   4. quote_checkout  — 결제 직전 재견적 + AP2 CartMandate payload
//   5. submit_intent   — 서명된 VC 수신 + PortOne 결제 세션 발급
//
// Transport-agnostic. Plug into stdio / HTTP / SSE via the MCP SDK of your
// choice. Cloudflare Workers 호환 (Node-only API 미사용).
import { searchProductTool } from "./tools/search-product.js";
import { getProductTool } from "./tools/get-product.js";
import { createCartTool } from "./tools/create-cart.js";
import { quoteCheckoutTool } from "./tools/quote-checkout.js";
import { submitIntentTool } from "./tools/submit-intent.js";
const CANONICAL_TOOL_ORDER = [
    "search_product",
    "get_product",
    "create_cart",
    "quote_checkout",
    "submit_intent",
];
export function createMcpServer(opts = {}) {
    const handlers = {
        search_product: (opts.overrides?.search_product ??
            searchProductTool.handler),
        get_product: (opts.overrides?.get_product ??
            getProductTool.handler),
        create_cart: (opts.overrides?.create_cart ??
            createCartTool.handler),
        quote_checkout: (opts.overrides?.quote_checkout ??
            quoteCheckoutTool.handler),
        submit_intent: (opts.overrides?.submit_intent ??
            submitIntentTool.handler),
    };
    const schemas = {
        search_product: searchProductTool.inputSchema,
        get_product: getProductTool.inputSchema,
        create_cart: createCartTool.inputSchema,
        quote_checkout: quoteCheckoutTool.inputSchema,
        submit_intent: submitIntentTool.inputSchema,
    };
    const descriptors = {
        search_product: { name: searchProductTool.name, description: searchProductTool.description },
        get_product: { name: getProductTool.name, description: getProductTool.description },
        create_cart: { name: createCartTool.name, description: createCartTool.description },
        quote_checkout: {
            name: quoteCheckoutTool.name,
            description: quoteCheckoutTool.description,
        },
        submit_intent: {
            name: submitIntentTool.name,
            description: submitIntentTool.description,
        },
    };
    return {
        listTools() {
            return CANONICAL_TOOL_ORDER.map((n) => descriptors[n]);
        },
        async callTool(name, rawInput) {
            if (!isCanonicalName(name)) {
                throw new Error(`unknown_tool:${name}`);
            }
            const schema = schemas[name];
            const handler = handlers[name];
            const parsed = schema.parse(rawInput);
            return handler(parsed);
        },
    };
}
function isCanonicalName(name) {
    return CANONICAL_TOOL_ORDER.includes(name);
}
export { CANONICAL_TOOL_ORDER };
