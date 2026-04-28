import { searchProductTool } from "./tools/search-product.js";
import { getProductTool } from "./tools/get-product.js";
import { createCartTool } from "./tools/create-cart.js";
import { quoteCheckoutTool } from "./tools/quote-checkout.js";
import { submitIntentTool } from "./tools/submit-intent.js";
export interface McpToolDescriptor {
    readonly name: string;
    readonly description: string;
}
export interface McpServer {
    listTools(): McpToolDescriptor[];
    callTool(name: string, rawInput: unknown): Promise<unknown>;
}
export interface McpServerOptions {
    /** Override any default handler — handy for tests or production wiring. */
    readonly overrides?: {
        search_product?: typeof searchProductTool.handler;
        get_product?: typeof getProductTool.handler;
        create_cart?: typeof createCartTool.handler;
        quote_checkout?: typeof quoteCheckoutTool.handler;
        submit_intent?: typeof submitIntentTool.handler;
    };
}
declare const CANONICAL_TOOL_ORDER: readonly ["search_product", "get_product", "create_cart", "quote_checkout", "submit_intent"];
export type CanonicalToolName = (typeof CANONICAL_TOOL_ORDER)[number];
export declare function createMcpServer(opts?: McpServerOptions): McpServer;
export { CANONICAL_TOOL_ORDER };
//# sourceMappingURL=server.d.ts.map