import { z } from "zod";
export declare const GetPolicyInput: z.ZodObject<{
    kind: z.ZodEnum<["returns", "refunds", "shipping", "privacy", "terms"]>;
    lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
}, "strip", z.ZodTypeAny, {
    lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
    kind: "shipping" | "returns" | "refunds" | "privacy" | "terms";
}, {
    kind: "shipping" | "returns" | "refunds" | "privacy" | "terms";
    lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
}>;
export type GetPolicyInput = z.infer<typeof GetPolicyInput>;
export declare const GetPolicyOutput: z.ZodObject<{
    kind: z.ZodString;
    lang: z.ZodString;
    version: z.ZodString;
    updatedAt: z.ZodString;
    body: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    lang: string;
    kind: string;
    version: string;
    updatedAt: string;
    body: string;
    url?: string | undefined;
}, {
    lang: string;
    kind: string;
    version: string;
    updatedAt: string;
    body: string;
    url?: string | undefined;
}>;
export type GetPolicyOutput = z.infer<typeof GetPolicyOutput>;
/**
 * @deprecated Removal pending FU-0062-5 RFC (policy surface relocation).
 */
export declare const getPolicyTool: {
    name: "get_policy";
    description: string;
    inputSchema: z.ZodObject<{
        kind: z.ZodEnum<["returns", "refunds", "shipping", "privacy", "terms"]>;
        lang: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    }, "strip", z.ZodTypeAny, {
        lang: "en" | "ja" | "de" | "fr" | "es" | "ko";
        kind: "shipping" | "returns" | "refunds" | "privacy" | "terms";
    }, {
        kind: "shipping" | "returns" | "refunds" | "privacy" | "terms";
        lang?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        kind: z.ZodString;
        lang: z.ZodString;
        version: z.ZodString;
        updatedAt: z.ZodString;
        body: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        lang: string;
        kind: string;
        version: string;
        updatedAt: string;
        body: string;
        url?: string | undefined;
    }, {
        lang: string;
        kind: string;
        version: string;
        updatedAt: string;
        body: string;
        url?: string | undefined;
    }>;
    handler: (input: GetPolicyInput) => Promise<GetPolicyOutput>;
};
//# sourceMappingURL=get-policy.d.ts.map