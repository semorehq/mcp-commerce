import { z } from "zod";
export declare const SUPPORTED_LANGS: readonly ["en", "ja", "de", "fr", "es", "ko"];
export declare const SUPPORTED_CATEGORIES: readonly ["kbeauty", "kfashion", "kpop", "electronics", "food"];
export declare const SearchProductInput: z.ZodObject<{
    /** 자연어 또는 키워드 쿼리. 한국어/영문/일본어 mix 허용. */
    q: z.ZodString;
    lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    category: z.ZodOptional<z.ZodEnum<["kbeauty", "kfashion", "kpop", "electronics", "food"]>>;
    /** USD 환산 상한 — Workers 측 D1 query 에서 cross-border presentment 환산. */
    max_price_usd: z.ZodOptional<z.ZodNumber>;
    /** ISO 3166-1 alpha-2 도착지 (US/JP/DE/FR/ES/KR ...). 관세/배송 시뮬에 사용. */
    country: z.ZodDefault<z.ZodString>;
    /** 최대 반환 SKU 수. */
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    q: string;
    lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
    country: string;
    limit: number;
    category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
    max_price_usd?: number | undefined;
}, {
    q: string;
    lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
    max_price_usd?: number | undefined;
    country?: string | undefined;
    limit?: number | undefined;
}>;
export type SearchProductInput = z.infer<typeof SearchProductInput>;
export declare const SearchProductResultItem: z.ZodObject<{
    sku_id: z.ZodString;
    title: z.ZodString;
    price_usd: z.ZodString;
    ship_from: z.ZodOptional<z.ZodString>;
    available: z.ZodDefault<z.ZodBoolean>;
    rank: z.ZodOptional<z.ZodNumber>;
    image_url: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sku_id: string;
    title: string;
    price_usd: string;
    available: boolean;
    ship_from?: string | undefined;
    rank?: number | undefined;
    image_url?: string | undefined;
    brand?: string | undefined;
}, {
    sku_id: string;
    title: string;
    price_usd: string;
    ship_from?: string | undefined;
    available?: boolean | undefined;
    rank?: number | undefined;
    image_url?: string | undefined;
    brand?: string | undefined;
}>;
export type SearchProductResultItem = z.infer<typeof SearchProductResultItem>;
export declare const SearchProductOutput: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        sku_id: z.ZodString;
        title: z.ZodString;
        price_usd: z.ZodString;
        ship_from: z.ZodOptional<z.ZodString>;
        available: z.ZodDefault<z.ZodBoolean>;
        rank: z.ZodOptional<z.ZodNumber>;
        image_url: z.ZodOptional<z.ZodString>;
        brand: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sku_id: string;
        title: string;
        price_usd: string;
        available: boolean;
        ship_from?: string | undefined;
        rank?: number | undefined;
        image_url?: string | undefined;
        brand?: string | undefined;
    }, {
        sku_id: string;
        title: string;
        price_usd: string;
        ship_from?: string | undefined;
        available?: boolean | undefined;
        rank?: number | undefined;
        image_url?: string | undefined;
        brand?: string | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    results: {
        sku_id: string;
        title: string;
        price_usd: string;
        available: boolean;
        ship_from?: string | undefined;
        rank?: number | undefined;
        image_url?: string | undefined;
        brand?: string | undefined;
    }[];
    total: number;
}, {
    results: {
        sku_id: string;
        title: string;
        price_usd: string;
        ship_from?: string | undefined;
        available?: boolean | undefined;
        rank?: number | undefined;
        image_url?: string | undefined;
        brand?: string | undefined;
    }[];
    total: number;
}>;
export type SearchProductOutput = z.infer<typeof SearchProductOutput>;
/**
 * Pluggable catalog backend (D1 FTS5 in production, in-memory in tests).
 * Apps that distribute this MCP package (notably `apps/api/src/routes/mcp.ts`)
 * inject a real implementation backed by the D1 SKU table + cross-border
 * pricer. The OSS default returns a deterministic empty payload so the
 * package stays self-contained — never relied on for real settlement.
 */
export interface ProductSearcher {
    (input: SearchProductInput): Promise<SearchProductOutput>;
}
export interface SearchProductToolOptions {
    searcher?: ProductSearcher;
}
export declare function makeSearchProductTool(options?: SearchProductToolOptions): {
    name: "search_product";
    description: string;
    inputSchema: z.ZodObject<{
        /** 자연어 또는 키워드 쿼리. 한국어/영문/일본어 mix 허용. */
        q: z.ZodString;
        lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        category: z.ZodOptional<z.ZodEnum<["kbeauty", "kfashion", "kpop", "electronics", "food"]>>;
        /** USD 환산 상한 — Workers 측 D1 query 에서 cross-border presentment 환산. */
        max_price_usd: z.ZodOptional<z.ZodNumber>;
        /** ISO 3166-1 alpha-2 도착지 (US/JP/DE/FR/ES/KR ...). 관세/배송 시뮬에 사용. */
        country: z.ZodDefault<z.ZodString>;
        /** 최대 반환 SKU 수. */
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        q: string;
        lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
        country: string;
        limit: number;
        category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
        max_price_usd?: number | undefined;
    }, {
        q: string;
        lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
        max_price_usd?: number | undefined;
        country?: string | undefined;
        limit?: number | undefined;
    }>;
    outputSchema: z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
            sku_id: z.ZodString;
            title: z.ZodString;
            price_usd: z.ZodString;
            ship_from: z.ZodOptional<z.ZodString>;
            available: z.ZodDefault<z.ZodBoolean>;
            rank: z.ZodOptional<z.ZodNumber>;
            image_url: z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            sku_id: string;
            title: string;
            price_usd: string;
            available: boolean;
            ship_from?: string | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }, {
            sku_id: string;
            title: string;
            price_usd: string;
            ship_from?: string | undefined;
            available?: boolean | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }>, "many">;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        results: {
            sku_id: string;
            title: string;
            price_usd: string;
            available: boolean;
            ship_from?: string | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }[];
        total: number;
    }, {
        results: {
            sku_id: string;
            title: string;
            price_usd: string;
            ship_from?: string | undefined;
            available?: boolean | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }[];
        total: number;
    }>;
    handler: (input: SearchProductInput) => Promise<SearchProductOutput>;
};
export declare const searchProductTool: {
    name: "search_product";
    description: string;
    inputSchema: z.ZodObject<{
        /** 자연어 또는 키워드 쿼리. 한국어/영문/일본어 mix 허용. */
        q: z.ZodString;
        lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        category: z.ZodOptional<z.ZodEnum<["kbeauty", "kfashion", "kpop", "electronics", "food"]>>;
        /** USD 환산 상한 — Workers 측 D1 query 에서 cross-border presentment 환산. */
        max_price_usd: z.ZodOptional<z.ZodNumber>;
        /** ISO 3166-1 alpha-2 도착지 (US/JP/DE/FR/ES/KR ...). 관세/배송 시뮬에 사용. */
        country: z.ZodDefault<z.ZodString>;
        /** 최대 반환 SKU 수. */
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        q: string;
        lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
        country: string;
        limit: number;
        category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
        max_price_usd?: number | undefined;
    }, {
        q: string;
        lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
        max_price_usd?: number | undefined;
        country?: string | undefined;
        limit?: number | undefined;
    }>;
    outputSchema: z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
            sku_id: z.ZodString;
            title: z.ZodString;
            price_usd: z.ZodString;
            ship_from: z.ZodOptional<z.ZodString>;
            available: z.ZodDefault<z.ZodBoolean>;
            rank: z.ZodOptional<z.ZodNumber>;
            image_url: z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            sku_id: string;
            title: string;
            price_usd: string;
            available: boolean;
            ship_from?: string | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }, {
            sku_id: string;
            title: string;
            price_usd: string;
            ship_from?: string | undefined;
            available?: boolean | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }>, "many">;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        results: {
            sku_id: string;
            title: string;
            price_usd: string;
            available: boolean;
            ship_from?: string | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }[];
        total: number;
    }, {
        results: {
            sku_id: string;
            title: string;
            price_usd: string;
            ship_from?: string | undefined;
            available?: boolean | undefined;
            rank?: number | undefined;
            image_url?: string | undefined;
            brand?: string | undefined;
        }[];
        total: number;
    }>;
    handler: (input: SearchProductInput) => Promise<SearchProductOutput>;
};
//# sourceMappingURL=search-product.d.ts.map