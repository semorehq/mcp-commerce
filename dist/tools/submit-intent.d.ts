import { z } from "zod";
import { CartMandatePayloadSchema, type CartMandatePayload } from "./quote-checkout.js";
/** AP2 CartMandate VC (서명됨). quote_checkout 가 산출한 payload 의 서명 결과. */
export declare const SignedCartMandateVcSchema: z.ZodString;
/**
 * AP2 PaymentMandate VC (서명됨). submit_intent 의 caller-injectable
 * `paymentSigner` 가 발급. wire-shape 만 OSS 에서 정의 — 실제 서명/검증은
 * issuer (apps/api `lib/ap2/payment-sign.ts`) 책임.
 */
export declare const SignedPaymentMandateVcSchema: z.ZodString;
export declare const SubmitIntentInput: z.ZodObject<{
    cart_id: z.ZodString;
    quote_id: z.ZodString;
    intent_mandate_vc: z.ZodString;
    cart_mandate_vc_signed: z.ZodString;
    /**
     * Buyer DID — required at submit-stage (FU-0062-2.11).
     * AP2 v0.1 spec §4.1.1 ("Verifiable identities for the user") + W3C VC
     * Data Model 1.1 §4.4 (`holder` MUST be a URI). Allowlist: did:web /
     * did:key / did:jwk. Other methods are explicitly rejected — adding
     * support is tracked as separate FUs (resolver wiring + legal review).
     */
    buyer_did: z.ZodString;
    customer_email: z.ZodString;
    language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
    /** Idempotency 키 — 동일 키 중복 호출 시 같은 order_id 반환. */
    idempotency_key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    language: "en" | "ja" | "de" | "fr" | "es" | "ko";
    cart_id: string;
    intent_mandate_vc: string;
    buyer_did: string;
    quote_id: string;
    cart_mandate_vc_signed: string;
    customer_email: string;
    idempotency_key: string;
}, {
    cart_id: string;
    intent_mandate_vc: string;
    buyer_did: string;
    quote_id: string;
    cart_mandate_vc_signed: string;
    customer_email: string;
    idempotency_key: string;
    language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
}>;
export type SubmitIntentInput = z.infer<typeof SubmitIntentInput>;
export declare const SubmitIntentOutput: z.ZodObject<{
    order_id: z.ZodString;
    /** PortOne 결제 세션 redirect URL (hosted UI). PAN/CVV 는 여기서만 입력. */
    payment_session_url: z.ZodString;
    payment_session_id: z.ZodString;
    /**
     * PSP 채널 — manifest.json 의 ACP/AP2 호환 PSP 라우팅 결과.
     * `stripe` | `paypal` | `eximbay`.
     */
    psp_channel: z.ZodEnum<["stripe", "paypal", "eximbay"]>;
    status: z.ZodEnum<["pending", "requires_payment", "confirmed"]>;
    /** Unix epoch (seconds) — 결제 세션 만료 시각. */
    expires_at: z.ZodNumber;
    /**
     * AP2 PaymentMandate VC (signed, wire-shape).
     * ADR-0062 §2.3 — 3 단 mandate 체인의 최종 leaf. caller-injected signer
     * (`paymentSigner`) 가 발급. apps/api `lib/ap2/payment-sign.ts` 가
     * production wiring (Ed25519, did:web:semore.net).
     */
    payment_mandate_vc: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "requires_payment" | "confirmed";
    expires_at: number;
    order_id: string;
    payment_session_url: string;
    payment_session_id: string;
    psp_channel: "stripe" | "paypal" | "eximbay";
    payment_mandate_vc: string;
}, {
    status: "pending" | "requires_payment" | "confirmed";
    expires_at: number;
    order_id: string;
    payment_session_url: string;
    payment_session_id: string;
    psp_channel: "stripe" | "paypal" | "eximbay";
    payment_mandate_vc: string;
}>;
export type SubmitIntentOutput = z.infer<typeof SubmitIntentOutput>;
/**
 * Pluggable PortOne session issuer. Apps inject the real implementation
 * backed by `lib/portone.ts#createSession` which:
 *   1. Verifies both VCs (Ed25519, did:web resolution).
 *   2. Picks PSP channel by buyer country + currency + risk score.
 *   3. POSTs to PortOne `/v2/payments/sessions` with cart hash + amount.
 *   4. Persists order row in D1 with mandate VC IDs for audit chain.
 */
export interface IntentSubmitter {
    (input: SubmitIntentInput): Promise<Omit<SubmitIntentOutput, "payment_mandate_vc">>;
}
/**
 * Pluggable PaymentMandate VC signer. Production wiring in apps/api
 * `lib/ap2/payment-sign.ts#signPaymentMandate` (Ed25519 over JCS canonical).
 *
 * 본 OSS 패키지는 issuer key 미보유 → 기본은 placeholder stub VC 반환.
 * stub 은 production (NODE_ENV) 에서 leak guard 가 throw 하므로 안전.
 */
export interface PaymentSigner {
    (intent_mandate_vc: string, cart_mandate_payload: CartMandatePayload): Promise<string>;
}
/** Sentinel placeholder used by STUB_PAYMENT_SIGNER. */
export declare const STUB_PAYMENT_MANDATE_VC = "stub.payment_mandate_vc.placeholder";
export interface SubmitIntentToolOptions {
    submitter?: IntentSubmitter;
    /**
     * Caller-injectable PaymentMandate VC signer. Default returns a placeholder
     * string that is rejected by the leak guard in production.
     */
    paymentSigner?: PaymentSigner;
    /**
     * Allow stub `payment_mandate_vc` placeholder to flow in production.
     * Defaults to false. Required when running the OSS stub against
     * NODE_ENV=production deliberately (e.g. CI fixtures).
     */
    allowStub?: boolean;
    /**
     * FU-0062-2.11 — enforce W3C VC 1.1 §4.4 holder binding to `buyer_did`.
     *
     * When `true` (default) the handler best-effort parses
     * `intent_mandate_vc`; if the wire string is JSON-LD VC AND carries a
     * `holder` field or `credentialSubject.id`, that value MUST equal the
     * input `buyer_did`. Opaque JWT-encoded VCs (no holder/subject.id at
     * top level) skip the check — verification is caller responsibility.
     *
     * Set to `false` only for fixtures that intentionally exercise mismatch
     * paths or legacy callers that have not yet adopted DID-bound holders.
     */
    verifyHolderBinding?: boolean;
}
export declare function makeSubmitIntentTool(options?: SubmitIntentToolOptions): {
    name: "submit_intent";
    description: string;
    inputSchema: z.ZodObject<{
        cart_id: z.ZodString;
        quote_id: z.ZodString;
        intent_mandate_vc: z.ZodString;
        cart_mandate_vc_signed: z.ZodString;
        /**
         * Buyer DID — required at submit-stage (FU-0062-2.11).
         * AP2 v0.1 spec §4.1.1 ("Verifiable identities for the user") + W3C VC
         * Data Model 1.1 §4.4 (`holder` MUST be a URI). Allowlist: did:web /
         * did:key / did:jwk. Other methods are explicitly rejected — adding
         * support is tracked as separate FUs (resolver wiring + legal review).
         */
        buyer_did: z.ZodString;
        customer_email: z.ZodString;
        language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        /** Idempotency 키 — 동일 키 중복 호출 시 같은 order_id 반환. */
        idempotency_key: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        language: "en" | "ja" | "de" | "fr" | "es" | "ko";
        cart_id: string;
        intent_mandate_vc: string;
        buyer_did: string;
        quote_id: string;
        cart_mandate_vc_signed: string;
        customer_email: string;
        idempotency_key: string;
    }, {
        cart_id: string;
        intent_mandate_vc: string;
        buyer_did: string;
        quote_id: string;
        cart_mandate_vc_signed: string;
        customer_email: string;
        idempotency_key: string;
        language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        order_id: z.ZodString;
        /** PortOne 결제 세션 redirect URL (hosted UI). PAN/CVV 는 여기서만 입력. */
        payment_session_url: z.ZodString;
        payment_session_id: z.ZodString;
        /**
         * PSP 채널 — manifest.json 의 ACP/AP2 호환 PSP 라우팅 결과.
         * `stripe` | `paypal` | `eximbay`.
         */
        psp_channel: z.ZodEnum<["stripe", "paypal", "eximbay"]>;
        status: z.ZodEnum<["pending", "requires_payment", "confirmed"]>;
        /** Unix epoch (seconds) — 결제 세션 만료 시각. */
        expires_at: z.ZodNumber;
        /**
         * AP2 PaymentMandate VC (signed, wire-shape).
         * ADR-0062 §2.3 — 3 단 mandate 체인의 최종 leaf. caller-injected signer
         * (`paymentSigner`) 가 발급. apps/api `lib/ap2/payment-sign.ts` 가
         * production wiring (Ed25519, did:web:semore.net).
         */
        payment_mandate_vc: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "requires_payment" | "confirmed";
        expires_at: number;
        order_id: string;
        payment_session_url: string;
        payment_session_id: string;
        psp_channel: "stripe" | "paypal" | "eximbay";
        payment_mandate_vc: string;
    }, {
        status: "pending" | "requires_payment" | "confirmed";
        expires_at: number;
        order_id: string;
        payment_session_url: string;
        payment_session_id: string;
        psp_channel: "stripe" | "paypal" | "eximbay";
        payment_mandate_vc: string;
    }>;
    handler: (input: SubmitIntentInput) => Promise<SubmitIntentOutput>;
};
export declare const submitIntentTool: {
    name: "submit_intent";
    description: string;
    inputSchema: z.ZodObject<{
        cart_id: z.ZodString;
        quote_id: z.ZodString;
        intent_mandate_vc: z.ZodString;
        cart_mandate_vc_signed: z.ZodString;
        /**
         * Buyer DID — required at submit-stage (FU-0062-2.11).
         * AP2 v0.1 spec §4.1.1 ("Verifiable identities for the user") + W3C VC
         * Data Model 1.1 §4.4 (`holder` MUST be a URI). Allowlist: did:web /
         * did:key / did:jwk. Other methods are explicitly rejected — adding
         * support is tracked as separate FUs (resolver wiring + legal review).
         */
        buyer_did: z.ZodString;
        customer_email: z.ZodString;
        language: z.ZodDefault<z.ZodEnum<["en", "ja", "de", "fr", "es", "ko"]>>;
        /** Idempotency 키 — 동일 키 중복 호출 시 같은 order_id 반환. */
        idempotency_key: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        language: "en" | "ja" | "de" | "fr" | "es" | "ko";
        cart_id: string;
        intent_mandate_vc: string;
        buyer_did: string;
        quote_id: string;
        cart_mandate_vc_signed: string;
        customer_email: string;
        idempotency_key: string;
    }, {
        cart_id: string;
        intent_mandate_vc: string;
        buyer_did: string;
        quote_id: string;
        cart_mandate_vc_signed: string;
        customer_email: string;
        idempotency_key: string;
        language?: "en" | "ja" | "de" | "fr" | "es" | "ko" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        order_id: z.ZodString;
        /** PortOne 결제 세션 redirect URL (hosted UI). PAN/CVV 는 여기서만 입력. */
        payment_session_url: z.ZodString;
        payment_session_id: z.ZodString;
        /**
         * PSP 채널 — manifest.json 의 ACP/AP2 호환 PSP 라우팅 결과.
         * `stripe` | `paypal` | `eximbay`.
         */
        psp_channel: z.ZodEnum<["stripe", "paypal", "eximbay"]>;
        status: z.ZodEnum<["pending", "requires_payment", "confirmed"]>;
        /** Unix epoch (seconds) — 결제 세션 만료 시각. */
        expires_at: z.ZodNumber;
        /**
         * AP2 PaymentMandate VC (signed, wire-shape).
         * ADR-0062 §2.3 — 3 단 mandate 체인의 최종 leaf. caller-injected signer
         * (`paymentSigner`) 가 발급. apps/api `lib/ap2/payment-sign.ts` 가
         * production wiring (Ed25519, did:web:semore.net).
         */
        payment_mandate_vc: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "requires_payment" | "confirmed";
        expires_at: number;
        order_id: string;
        payment_session_url: string;
        payment_session_id: string;
        psp_channel: "stripe" | "paypal" | "eximbay";
        payment_mandate_vc: string;
    }, {
        status: "pending" | "requires_payment" | "confirmed";
        expires_at: number;
        order_id: string;
        payment_session_url: string;
        payment_session_id: string;
        psp_channel: "stripe" | "paypal" | "eximbay";
        payment_mandate_vc: string;
    }>;
    handler: (input: SubmitIntentInput) => Promise<SubmitIntentOutput>;
};
export { CartMandatePayloadSchema };
//# sourceMappingURL=submit-intent.d.ts.map