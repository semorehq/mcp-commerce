import { z } from "zod";
export declare const CartItemSchema: z.ZodObject<{
    skuId: z.ZodString;
    qty: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    qty: number;
    skuId: string;
}, {
    qty: number;
    skuId: string;
}>;
export declare const AddressSchema: z.ZodObject<{
    country: z.ZodString;
    region: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    line1: z.ZodOptional<z.ZodString>;
    line2: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    country: string;
    region?: string | undefined;
    city?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    postalCode?: string | undefined;
}, {
    country: string;
    region?: string | undefined;
    city?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    postalCode?: string | undefined;
}>;
export declare const BuildCartInput: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        skuId: z.ZodString;
        qty: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        qty: number;
        skuId: string;
    }, {
        qty: number;
        skuId: string;
    }>, "many">;
    address: z.ZodObject<{
        country: z.ZodString;
        region: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        line1: z.ZodOptional<z.ZodString>;
        line2: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
        postalCode?: string | undefined;
    }, {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
        postalCode?: string | undefined;
    }>;
    language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    currency: z.ZodDefault<z.ZodEnum<["USD", "JPY", "EUR", "KRW"]>>;
}, "strip", z.ZodTypeAny, {
    items: {
        qty: number;
        skuId: string;
    }[];
    address: {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
        postalCode?: string | undefined;
    };
    language: "en" | "ja" | "de" | "fr" | "es" | "ko";
    currency: "USD" | "JPY" | "EUR" | "KRW";
}, {
    items: {
        qty: number;
        skuId: string;
    }[];
    address: {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
        postalCode?: string | undefined;
    };
    language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    currency?: "USD" | "JPY" | "EUR" | "KRW" | undefined;
}>;
export type BuildCartInput = z.infer<typeof BuildCartInput>;
export declare const BuildCartLineSchema: z.ZodObject<{
    skuId: z.ZodString;
    qty: z.ZodNumber;
    unitPrice: z.ZodString;
    lineTotal: z.ZodString;
}, "strip", z.ZodTypeAny, {
    qty: number;
    skuId: string;
    unitPrice: string;
    lineTotal: string;
}, {
    qty: number;
    skuId: string;
    unitPrice: string;
    lineTotal: string;
}>;
export type BuildCartLine = z.infer<typeof BuildCartLineSchema>;
export declare const BuildCartOutput: z.ZodObject<{
    cartId: z.ZodString;
    subtotal: z.ZodString;
    shipping: z.ZodString;
    dutyTax: z.ZodString;
    total: z.ZodString;
    currency: z.ZodString;
    lines: z.ZodArray<z.ZodObject<{
        skuId: z.ZodString;
        qty: z.ZodNumber;
        unitPrice: z.ZodString;
        lineTotal: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        qty: number;
        skuId: string;
        unitPrice: string;
        lineTotal: string;
    }, {
        qty: number;
        skuId: string;
        unitPrice: string;
        lineTotal: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    total: string;
    currency: string;
    cartId: string;
    subtotal: string;
    shipping: string;
    dutyTax: string;
    lines: {
        qty: number;
        skuId: string;
        unitPrice: string;
        lineTotal: string;
    }[];
}, {
    total: string;
    currency: string;
    cartId: string;
    subtotal: string;
    shipping: string;
    dutyTax: string;
    lines: {
        qty: number;
        skuId: string;
        unitPrice: string;
        lineTotal: string;
    }[];
}>;
export type BuildCartOutput = z.infer<typeof BuildCartOutput>;
/**
 * External pricer contract. Apps that distribute this MCP package (notably
 * `apps/api/src/routes/mcp.ts`) inject a real implementation backed by the
 * shared `lib/commerce.ts#priceCart` (D1 SKU lookup + HS tariff + de minimis
 * + IOSS rules). The OSS default below is a deterministic stub used by
 * tests and offline demos so the package stays self-contained — never relied
 * on for real settlement.
 */
export interface CartPricer {
    (input: BuildCartInput): Promise<BuildCartOutput>;
}
export declare const offlineStubPricer: CartPricer;
export interface BuildCartToolOptions {
    pricer?: CartPricer;
}
export declare function makeBuildCartTool(options?: BuildCartToolOptions): {
    name: "build_cart";
    description: string;
    inputSchema: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            skuId: z.ZodString;
            qty: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            qty: number;
            skuId: string;
        }, {
            qty: number;
            skuId: string;
        }>, "many">;
        address: z.ZodObject<{
            country: z.ZodString;
            region: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
            line1: z.ZodOptional<z.ZodString>;
            line2: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        }, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        }>;
        language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        currency: z.ZodDefault<z.ZodEnum<["USD", "JPY", "EUR", "KRW"]>>;
    }, "strip", z.ZodTypeAny, {
        items: {
            qty: number;
            skuId: string;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        };
        language: "en" | "ja" | "de" | "fr" | "es" | "ko";
        currency: "USD" | "JPY" | "EUR" | "KRW";
    }, {
        items: {
            qty: number;
            skuId: string;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        };
        language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        currency?: "USD" | "JPY" | "EUR" | "KRW" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        cartId: z.ZodString;
        subtotal: z.ZodString;
        shipping: z.ZodString;
        dutyTax: z.ZodString;
        total: z.ZodString;
        currency: z.ZodString;
        lines: z.ZodArray<z.ZodObject<{
            skuId: z.ZodString;
            qty: z.ZodNumber;
            unitPrice: z.ZodString;
            lineTotal: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }, {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        total: string;
        currency: string;
        cartId: string;
        subtotal: string;
        shipping: string;
        dutyTax: string;
        lines: {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }[];
    }, {
        total: string;
        currency: string;
        cartId: string;
        subtotal: string;
        shipping: string;
        dutyTax: string;
        lines: {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }[];
    }>;
    handler: (input: BuildCartInput) => Promise<BuildCartOutput>;
};
export declare const buildCartTool: {
    name: "build_cart";
    description: string;
    inputSchema: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            skuId: z.ZodString;
            qty: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            qty: number;
            skuId: string;
        }, {
            qty: number;
            skuId: string;
        }>, "many">;
        address: z.ZodObject<{
            country: z.ZodString;
            region: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
            line1: z.ZodOptional<z.ZodString>;
            line2: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        }, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        }>;
        language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        currency: z.ZodDefault<z.ZodEnum<["USD", "JPY", "EUR", "KRW"]>>;
    }, "strip", z.ZodTypeAny, {
        items: {
            qty: number;
            skuId: string;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        };
        language: "en" | "ja" | "de" | "fr" | "es" | "ko";
        currency: "USD" | "JPY" | "EUR" | "KRW";
    }, {
        items: {
            qty: number;
            skuId: string;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
            postalCode?: string | undefined;
        };
        language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        currency?: "USD" | "JPY" | "EUR" | "KRW" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        cartId: z.ZodString;
        subtotal: z.ZodString;
        shipping: z.ZodString;
        dutyTax: z.ZodString;
        total: z.ZodString;
        currency: z.ZodString;
        lines: z.ZodArray<z.ZodObject<{
            skuId: z.ZodString;
            qty: z.ZodNumber;
            unitPrice: z.ZodString;
            lineTotal: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }, {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        total: string;
        currency: string;
        cartId: string;
        subtotal: string;
        shipping: string;
        dutyTax: string;
        lines: {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }[];
    }, {
        total: string;
        currency: string;
        cartId: string;
        subtotal: string;
        shipping: string;
        dutyTax: string;
        lines: {
            qty: number;
            skuId: string;
            unitPrice: string;
            lineTotal: string;
        }[];
    }>;
    handler: (input: BuildCartInput) => Promise<BuildCartOutput>;
};
//# sourceMappingURL=cart.d.ts.map