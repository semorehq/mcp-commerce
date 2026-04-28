import { z } from "zod";
export declare const CartItemSchema: z.ZodObject<{
    sku_id: z.ZodString;
    qty: z.ZodNumber;
    /** Optional variant/option payload (size, color, etc). */
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    sku_id: string;
    qty: number;
    options?: Record<string, string> | undefined;
}, {
    sku_id: string;
    qty: number;
    options?: Record<string, string> | undefined;
}>;
export type CartItem = z.infer<typeof CartItemSchema>;
export declare const AddressSchema: z.ZodObject<{
    /** ISO 3166-1 alpha-2. */
    country: z.ZodString;
    region: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    line1: z.ZodOptional<z.ZodString>;
    line2: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    country: string;
    region?: string | undefined;
    city?: string | undefined;
    postal_code?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
}, {
    country: string;
    region?: string | undefined;
    city?: string | undefined;
    postal_code?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
}>;
export type Address = z.infer<typeof AddressSchema>;
export declare const CreateCartInput: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        sku_id: z.ZodString;
        qty: z.ZodNumber;
        /** Optional variant/option payload (size, color, etc). */
        options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        sku_id: string;
        qty: number;
        options?: Record<string, string> | undefined;
    }, {
        sku_id: string;
        qty: number;
        options?: Record<string, string> | undefined;
    }>, "many">;
    address: z.ZodObject<{
        /** ISO 3166-1 alpha-2. */
        country: z.ZodString;
        region: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        line1: z.ZodOptional<z.ZodString>;
        line2: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        postal_code?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
    }, {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        postal_code?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
    }>;
    language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    currency: z.ZodDefault<z.ZodEnum<["USD", "JPY", "EUR", "KRW"]>>;
}, "strip", z.ZodTypeAny, {
    items: {
        sku_id: string;
        qty: number;
        options?: Record<string, string> | undefined;
    }[];
    address: {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        postal_code?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
    };
    language: "en" | "ja" | "de" | "fr" | "es" | "ko";
    currency: "USD" | "JPY" | "EUR" | "KRW";
}, {
    items: {
        sku_id: string;
        qty: number;
        options?: Record<string, string> | undefined;
    }[];
    address: {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        postal_code?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
    };
    language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    currency?: "USD" | "JPY" | "EUR" | "KRW" | undefined;
}>;
export type CreateCartInput = z.infer<typeof CreateCartInput>;
export declare const CartLineSchema: z.ZodObject<{
    sku_id: z.ZodString;
    qty: z.ZodNumber;
    unit_price_usd: z.ZodString;
    line_total_usd: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sku_id: string;
    qty: number;
    unit_price_usd: string;
    line_total_usd: string;
}, {
    sku_id: string;
    qty: number;
    unit_price_usd: string;
    line_total_usd: string;
}>;
export type CartLine = z.infer<typeof CartLineSchema>;
export declare const CreateCartOutput: z.ZodObject<{
    cart_id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        sku_id: z.ZodString;
        qty: z.ZodNumber;
        unit_price_usd: z.ZodString;
        line_total_usd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sku_id: string;
        qty: number;
        unit_price_usd: string;
        line_total_usd: string;
    }, {
        sku_id: string;
        qty: number;
        unit_price_usd: string;
        line_total_usd: string;
    }>, "many">;
    subtotal_usd: z.ZodString;
    shipping_usd: z.ZodString;
    duty_usd: z.ZodString;
    import_tax_usd: z.ZodString;
    total_usd: z.ZodString;
    currency: z.ZodString;
    /** Unix epoch (seconds) — TTL 만료 시각. */
    expires_at: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    currency: string;
    cart_id: string;
    line_items: {
        sku_id: string;
        qty: number;
        unit_price_usd: string;
        line_total_usd: string;
    }[];
    subtotal_usd: string;
    shipping_usd: string;
    duty_usd: string;
    import_tax_usd: string;
    total_usd: string;
    expires_at: number;
}, {
    currency: string;
    cart_id: string;
    line_items: {
        sku_id: string;
        qty: number;
        unit_price_usd: string;
        line_total_usd: string;
    }[];
    subtotal_usd: string;
    shipping_usd: string;
    duty_usd: string;
    import_tax_usd: string;
    total_usd: string;
    expires_at: number;
}>;
export type CreateCartOutput = z.infer<typeof CreateCartOutput>;
/**
 * Pluggable cross-border pricer. Apps inject a real implementation
 * (`lib/commerce.ts#priceCart` — D1 SKU lookup + HS tariff + de minimis +
 * IOSS). The OSS default below is deterministic for tests.
 */
export interface CartPricer {
    (input: CreateCartInput): Promise<CreateCartOutput>;
}
export declare const offlineStubPricer: CartPricer;
export interface CreateCartToolOptions {
    pricer?: CartPricer;
}
export declare function makeCreateCartTool(options?: CreateCartToolOptions): {
    name: "create_cart";
    description: string;
    inputSchema: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            sku_id: z.ZodString;
            qty: z.ZodNumber;
            /** Optional variant/option payload (size, color, etc). */
            options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }, {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }>, "many">;
        address: z.ZodObject<{
            /** ISO 3166-1 alpha-2. */
            country: z.ZodString;
            region: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            line1: z.ZodOptional<z.ZodString>;
            line2: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        }, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        }>;
        language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        currency: z.ZodDefault<z.ZodEnum<["USD", "JPY", "EUR", "KRW"]>>;
    }, "strip", z.ZodTypeAny, {
        items: {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        };
        language: "en" | "ja" | "de" | "fr" | "es" | "ko";
        currency: "USD" | "JPY" | "EUR" | "KRW";
    }, {
        items: {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        };
        language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        currency?: "USD" | "JPY" | "EUR" | "KRW" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        cart_id: z.ZodString;
        line_items: z.ZodArray<z.ZodObject<{
            sku_id: z.ZodString;
            qty: z.ZodNumber;
            unit_price_usd: z.ZodString;
            line_total_usd: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }, {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }>, "many">;
        subtotal_usd: z.ZodString;
        shipping_usd: z.ZodString;
        duty_usd: z.ZodString;
        import_tax_usd: z.ZodString;
        total_usd: z.ZodString;
        currency: z.ZodString;
        /** Unix epoch (seconds) — TTL 만료 시각. */
        expires_at: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        cart_id: string;
        line_items: {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }[];
        subtotal_usd: string;
        shipping_usd: string;
        duty_usd: string;
        import_tax_usd: string;
        total_usd: string;
        expires_at: number;
    }, {
        currency: string;
        cart_id: string;
        line_items: {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }[];
        subtotal_usd: string;
        shipping_usd: string;
        duty_usd: string;
        import_tax_usd: string;
        total_usd: string;
        expires_at: number;
    }>;
    handler: (input: CreateCartInput) => Promise<CreateCartOutput>;
};
export declare const createCartTool: {
    name: "create_cart";
    description: string;
    inputSchema: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            sku_id: z.ZodString;
            qty: z.ZodNumber;
            /** Optional variant/option payload (size, color, etc). */
            options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }, {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }>, "many">;
        address: z.ZodObject<{
            /** ISO 3166-1 alpha-2. */
            country: z.ZodString;
            region: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            line1: z.ZodOptional<z.ZodString>;
            line2: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        }, {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        }>;
        language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        currency: z.ZodDefault<z.ZodEnum<["USD", "JPY", "EUR", "KRW"]>>;
    }, "strip", z.ZodTypeAny, {
        items: {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        };
        language: "en" | "ja" | "de" | "fr" | "es" | "ko";
        currency: "USD" | "JPY" | "EUR" | "KRW";
    }, {
        items: {
            sku_id: string;
            qty: number;
            options?: Record<string, string> | undefined;
        }[];
        address: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        };
        language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
        currency?: "USD" | "JPY" | "EUR" | "KRW" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        cart_id: z.ZodString;
        line_items: z.ZodArray<z.ZodObject<{
            sku_id: z.ZodString;
            qty: z.ZodNumber;
            unit_price_usd: z.ZodString;
            line_total_usd: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }, {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }>, "many">;
        subtotal_usd: z.ZodString;
        shipping_usd: z.ZodString;
        duty_usd: z.ZodString;
        import_tax_usd: z.ZodString;
        total_usd: z.ZodString;
        currency: z.ZodString;
        /** Unix epoch (seconds) — TTL 만료 시각. */
        expires_at: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        cart_id: string;
        line_items: {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }[];
        subtotal_usd: string;
        shipping_usd: string;
        duty_usd: string;
        import_tax_usd: string;
        total_usd: string;
        expires_at: number;
    }, {
        currency: string;
        cart_id: string;
        line_items: {
            sku_id: string;
            qty: number;
            unit_price_usd: string;
            line_total_usd: string;
        }[];
        subtotal_usd: string;
        shipping_usd: string;
        duty_usd: string;
        import_tax_usd: string;
        total_usd: string;
        expires_at: number;
    }>;
    handler: (input: CreateCartInput) => Promise<CreateCartOutput>;
};
//# sourceMappingURL=create-cart.d.ts.map