import { z } from "zod";
export declare const CreateOrderInput: z.ZodObject<{
    cartId: z.ZodString;
    buyerDid: z.ZodOptional<z.ZodString>;
    shippingAddress: z.ZodObject<{
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
    contactEmail: z.ZodOptional<z.ZodString>;
    idempotencyKey: z.ZodString;
    /** Optional AP2 payment mandate VC id for chain linkage. */
    paymentMandateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cartId: string;
    shippingAddress: {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        postal_code?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
    };
    idempotencyKey: string;
    buyerDid?: string | undefined;
    contactEmail?: string | undefined;
    paymentMandateId?: string | undefined;
}, {
    cartId: string;
    shippingAddress: {
        country: string;
        region?: string | undefined;
        city?: string | undefined;
        postal_code?: string | undefined;
        line1?: string | undefined;
        line2?: string | undefined;
    };
    idempotencyKey: string;
    buyerDid?: string | undefined;
    contactEmail?: string | undefined;
    paymentMandateId?: string | undefined;
}>;
export type CreateOrderInput = z.infer<typeof CreateOrderInput>;
export declare const CreateOrderOutput: z.ZodObject<{
    orderId: z.ZodString;
    checkoutUrl: z.ZodString;
    status: z.ZodEnum<["pending", "requires_payment", "confirmed"]>;
    createdAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "requires_payment" | "confirmed";
    orderId: string;
    checkoutUrl: string;
    createdAt: number;
}, {
    status: "pending" | "requires_payment" | "confirmed";
    orderId: string;
    checkoutUrl: string;
    createdAt: number;
}>;
export type CreateOrderOutput = z.infer<typeof CreateOrderOutput>;
/**
 * @deprecated Use `submitIntentTool` from `../submit-intent.js` instead.
 */
export declare const createOrderTool: {
    name: "create_order";
    description: string;
    inputSchema: z.ZodObject<{
        cartId: z.ZodString;
        buyerDid: z.ZodOptional<z.ZodString>;
        shippingAddress: z.ZodObject<{
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
        contactEmail: z.ZodOptional<z.ZodString>;
        idempotencyKey: z.ZodString;
        /** Optional AP2 payment mandate VC id for chain linkage. */
        paymentMandateId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        cartId: string;
        shippingAddress: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        };
        idempotencyKey: string;
        buyerDid?: string | undefined;
        contactEmail?: string | undefined;
        paymentMandateId?: string | undefined;
    }, {
        cartId: string;
        shippingAddress: {
            country: string;
            region?: string | undefined;
            city?: string | undefined;
            postal_code?: string | undefined;
            line1?: string | undefined;
            line2?: string | undefined;
        };
        idempotencyKey: string;
        buyerDid?: string | undefined;
        contactEmail?: string | undefined;
        paymentMandateId?: string | undefined;
    }>;
    outputSchema: z.ZodObject<{
        orderId: z.ZodString;
        checkoutUrl: z.ZodString;
        status: z.ZodEnum<["pending", "requires_payment", "confirmed"]>;
        createdAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "requires_payment" | "confirmed";
        orderId: string;
        checkoutUrl: string;
        createdAt: number;
    }, {
        status: "pending" | "requires_payment" | "confirmed";
        orderId: string;
        checkoutUrl: string;
        createdAt: number;
    }>;
    handler: (input: CreateOrderInput) => Promise<CreateOrderOutput>;
};
//# sourceMappingURL=create-order.d.ts.map