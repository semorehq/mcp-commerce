import { z } from "zod";
export declare const GetProductInput: z.ZodObject<{
    sku_id: z.ZodString;
    lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
}, "strip", z.ZodTypeAny, {
    lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
    sku_id: string;
}, {
    sku_id: string;
    lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
}>;
export type GetProductInput = z.infer<typeof GetProductInput>;
export declare const ProductImageSchema: z.ZodObject<{
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    url: string;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}, {
    url: string;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}>;
export declare const ProductSpecsSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export declare const GetProductOutput: z.ZodObject<{
    sku_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        url: string;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }>, "many">;
    specs: z.ZodRecord<z.ZodString, z.ZodString>;
    /** 무게 (g). cross-border 배송비/관세 계산에 필수. */
    weight_g: z.ZodNumber;
    /** Harmonized System code (관세 분류). 6~10 자리. */
    hs_code: z.ZodString;
    ship_from: z.ZodString;
    /** Sourcing → fulfillment 까지 영업일. */
    lead_days: z.ZodNumber;
    stock: z.ZodNumber;
    price_usd: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sku_id: string;
    title: string;
    price_usd: string;
    ship_from: string;
    description: string;
    images: {
        url: string;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }[];
    specs: Record<string, string>;
    weight_g: number;
    hs_code: string;
    lead_days: number;
    stock: number;
    brand?: string | undefined;
}, {
    sku_id: string;
    title: string;
    price_usd: string;
    ship_from: string;
    description: string;
    images: {
        url: string;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }[];
    specs: Record<string, string>;
    weight_g: number;
    hs_code: string;
    lead_days: number;
    stock: number;
    brand?: string | undefined;
}>;
export type GetProductOutput = z.infer<typeof GetProductOutput>;
export interface ProductFetcher {
    (input: GetProductInput): Promise<GetProductOutput>;
}
export interface GetProductToolOptions {
    fetcher?: ProductFetcher;
}
export declare function makeGetProductTool(options?: GetProductToolOptions): {
    name: "get_product";
    description: string;
    inputSchema: z.ZodObject<{
        sku_id: z.ZodString;
        lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    }, "strip", z.ZodTypeAny, {
        lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
        sku_id: string;
    }, {
        sku_id: string;
        lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        sku_id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        images: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            alt: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }, {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }>, "many">;
        specs: z.ZodRecord<z.ZodString, z.ZodString>;
        /** 무게 (g). cross-border 배송비/관세 계산에 필수. */
        weight_g: z.ZodNumber;
        /** Harmonized System code (관세 분류). 6~10 자리. */
        hs_code: z.ZodString;
        ship_from: z.ZodString;
        /** Sourcing → fulfillment 까지 영업일. */
        lead_days: z.ZodNumber;
        stock: z.ZodNumber;
        price_usd: z.ZodString;
        brand: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sku_id: string;
        title: string;
        price_usd: string;
        ship_from: string;
        description: string;
        images: {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }[];
        specs: Record<string, string>;
        weight_g: number;
        hs_code: string;
        lead_days: number;
        stock: number;
        brand?: string | undefined;
    }, {
        sku_id: string;
        title: string;
        price_usd: string;
        ship_from: string;
        description: string;
        images: {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }[];
        specs: Record<string, string>;
        weight_g: number;
        hs_code: string;
        lead_days: number;
        stock: number;
        brand?: string | undefined;
    }>;
    handler: (input: GetProductInput) => Promise<GetProductOutput>;
};
export declare const getProductTool: {
    name: "get_product";
    description: string;
    inputSchema: z.ZodObject<{
        sku_id: z.ZodString;
        lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    }, "strip", z.ZodTypeAny, {
        lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
        sku_id: string;
    }, {
        sku_id: string;
        lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        sku_id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        images: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            alt: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }, {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }>, "many">;
        specs: z.ZodRecord<z.ZodString, z.ZodString>;
        /** 무게 (g). cross-border 배송비/관세 계산에 필수. */
        weight_g: z.ZodNumber;
        /** Harmonized System code (관세 분류). 6~10 자리. */
        hs_code: z.ZodString;
        ship_from: z.ZodString;
        /** Sourcing → fulfillment 까지 영업일. */
        lead_days: z.ZodNumber;
        stock: z.ZodNumber;
        price_usd: z.ZodString;
        brand: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sku_id: string;
        title: string;
        price_usd: string;
        ship_from: string;
        description: string;
        images: {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }[];
        specs: Record<string, string>;
        weight_g: number;
        hs_code: string;
        lead_days: number;
        stock: number;
        brand?: string | undefined;
    }, {
        sku_id: string;
        title: string;
        price_usd: string;
        ship_from: string;
        description: string;
        images: {
            url: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }[];
        specs: Record<string, string>;
        weight_g: number;
        hs_code: string;
        lead_days: number;
        stock: number;
        brand?: string | undefined;
    }>;
    handler: (input: GetProductInput) => Promise<GetProductOutput>;
};
//# sourceMappingURL=get-product.d.ts.map