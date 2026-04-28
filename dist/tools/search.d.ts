import { z } from "zod";
export declare const SearchProductsInput: z.ZodObject<{
    q: z.ZodString;
    lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    category: z.ZodOptional<z.ZodEnum<["kbeauty", "kfashion", "kpop", "electronics", "food"]>>;
    maxPriceUsd: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    q: string;
    lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
    limit: number;
    category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
    maxPriceUsd?: number | undefined;
}, {
    q: string;
    lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
    limit?: number | undefined;
    maxPriceUsd?: number | undefined;
}>;
export type SearchProductsInput = z.infer<typeof SearchProductsInput>;
export declare const SearchProductsOutput: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        skuId: z.ZodString;
        title: z.ZodString;
        priceUsd: z.ZodString;
        imageUrl: z.ZodOptional<z.ZodString>;
        brand: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        skuId: string;
        priceUsd: string;
        brand?: string | undefined;
        imageUrl?: string | undefined;
    }, {
        title: string;
        skuId: string;
        priceUsd: string;
        brand?: string | undefined;
        imageUrl?: string | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    items: {
        title: string;
        skuId: string;
        priceUsd: string;
        brand?: string | undefined;
        imageUrl?: string | undefined;
    }[];
}, {
    total: number;
    items: {
        title: string;
        skuId: string;
        priceUsd: string;
        brand?: string | undefined;
        imageUrl?: string | undefined;
    }[];
}>;
export type SearchProductsOutput = z.infer<typeof SearchProductsOutput>;
export declare const searchProductsTool: {
    name: "search_products";
    description: string;
    inputSchema: z.ZodObject<{
        q: z.ZodString;
        lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        category: z.ZodOptional<z.ZodEnum<["kbeauty", "kfashion", "kpop", "electronics", "food"]>>;
        maxPriceUsd: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        q: string;
        lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
        limit: number;
        category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
        maxPriceUsd?: number | undefined;
    }, {
        q: string;
        lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        category?: "kbeauty" | "kfashion" | "kpop" | "electronics" | "food" | undefined;
        limit?: number | undefined;
        maxPriceUsd?: number | undefined;
    }>;
    outputSchema: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            skuId: z.ZodString;
            title: z.ZodString;
            priceUsd: z.ZodString;
            imageUrl: z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            skuId: string;
            priceUsd: string;
            brand?: string | undefined;
            imageUrl?: string | undefined;
        }, {
            title: string;
            skuId: string;
            priceUsd: string;
            brand?: string | undefined;
            imageUrl?: string | undefined;
        }>, "many">;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        items: {
            title: string;
            skuId: string;
            priceUsd: string;
            brand?: string | undefined;
            imageUrl?: string | undefined;
        }[];
    }, {
        total: number;
        items: {
            title: string;
            skuId: string;
            priceUsd: string;
            brand?: string | undefined;
            imageUrl?: string | undefined;
        }[];
    }>;
    /**
     * Skeleton handler. Replace with a real catalog fetch in production.
     * The shipped implementation returns a deterministic empty result so
     * integrators can validate the wiring without a data source.
     */
    handler: (_input: SearchProductsInput) => Promise<SearchProductsOutput>;
};
//# sourceMappingURL=search.d.ts.map