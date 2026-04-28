import { z } from "zod";
/**
 * AP2 IntentMandate VC (사전 서명, search/대화 단계에서 발급).
 * 본 tool 은 검증만 — 실제 발급은 별도 ap2-agent 책임.
 *
 * 형식 = W3C Verifiable Credential JSON-LD 또는 JWT 인코딩 문자열.
 * 본 OSS 패키지는 wire-shape 만 정의 (parser/verifier 는 호출자 측 주입).
 */
export declare const IntentMandateVcSchema: z.ZodString;
/**
 * AP2 v0.1 spec §4.1.1 — Payer ("Verifiable identities for the user").
 * W3C VC Data Model 1.1 §4.4 — `holder` MUST be a URI; for DID-bound buyers
 * it is a DID (https://www.w3.org/TR/vc-data-model/#holder).
 *
 * Semore Phase 0 supports an explicit allowlist of 3 DID methods:
 *   - did:web   — Semore agent itself + merchants (`did:web:semore.net`)
 *   - did:key   — buyer self-issued key (Phase 1+ default)
 *   - did:jwk   — JWK direct (Stripe Click-to-Pay interop, draft-ietf-oauth-jwk)
 *
 * Other DID methods (did:ion / did:ethr / did:pkh / did:ebsi …) are
 * **explicitly rejected** at the OSS surface — adding support is tracked
 * as a follow-up FU per method (each requires resolver wiring + legal review).
 *
 * **FU-0062-2.13 — strict pct-encoded ABNF**:
 * W3C DID Core 1.0 §3.1 ABNF requires `idchar = ALPHA / DIGIT / "." / "-" /
 * "_" / pct-encoded` and `pct-encoded = "%" HEXDIG HEXDIG`. The previous
 * regex (`[a-zA-Z0-9._:%-]+`) admitted `%` as a stand-alone character —
 * `did:web:bad%` or `did:web:bad%XYZ` slipped through. This regex now
 * matches `%HH` strictly (exactly two hex digits per `%`). The `:` in the
 * character class accommodates DID method-specific identifiers that embed
 * additional path segments separated by `:` (e.g. `did:web:host:path:sub`).
 */
export declare const DID_REGEX: RegExp;
/**
 * Zod schema for AP2 `buyer_did`. Required + DID-method allowlist.
 * Reusable by callers that want to validate buyer_did independently
 * (e.g. apps/api before constructing a SubmitIntent payload).
 */
export declare const BuyerDidSchema: z.ZodString;
export type BuyerDid = z.infer<typeof BuyerDidSchema>;
/**
 * FU-0062-2.16 — verifyProofVerificationMethod helper (W3C VC 1.1 §4.7).
 *
 * Syntactically validate that a Data-Integrity / Linked-Data proof's
 * `verificationMethod` URL points to a key controlled by `holderDid`:
 *   - `<holderDid>#<keyId>`  (DID URL with fragment — the common case)
 *   - `<holderDid>`          (bare DID — minority case where the key id is
 *                              implicit, e.g. did:key)
 *
 * This is **syntactic** only — full cryptographic verification (resolve the
 * controller's DID document, fetch the public key, verify the signature
 * over the JCS canonical) is the responsibility of `apps/api`'s
 * `did-issuer.ts` resolver (FU-0062-2.8 separate).
 *
 * References:
 *   - W3C VC Data Model 1.1 §4.7 (Proofs): https://www.w3.org/TR/vc-data-model/#proofs
 *     "verificationMethod ... a set of parameters that can be used together
 *     with a process to independently verify a proof."
 *   - W3C DID Core 1.0 §3.2 (DID URL Syntax): `did-url = did *( "/" path )
 *     [ "?" query ] [ "#" fragment ]`.
 */
export declare function verifyProofVerificationMethod(proof: {
    verificationMethod: string;
} | undefined | null, holderDid: string): boolean;
/**
 * Decompose a DID string into its method + method-specific identifier.
 * Returns `null` when the input does not match the allowlist regex.
 *
 * Example:
 *   parseDid("did:web:semore.net") === { method: "web", identifier: "semore.net" }
 */
export declare function parseDid(input: string): {
    method: "web" | "key" | "jwk";
    identifier: string;
} | null;
/**
 * Optional strict-mode parser for IntentMandate VC. Returns the decoded
 * `credentialSubject` if the wire string is a JSON-LD VC with the expected
 * `@context` / `type` / `proof` triple. Throws on structural mismatch.
 *
 * Caller side may opt-in for `quote_checkout` validation; the OSS handler
 * itself only enforces wire-shape (size). Integration is FU-0062-2.4 followup.
 *
 * Note: signature verification is **not** performed here — pair this with
 * the issuer's did:web key resolver (apps/api `did-issuer.ts`).
 *
 * **FU-0062-2.11 — buyer_did binding (W3C VC 1.1 §4.4 holder)**:
 * When `opts.buyerDid` is supplied AND `opts.strict` is true, the helper
 * additionally enforces that the VC's `holder` field (or, as a fallback,
 * `credentialSubject.id`) equals the supplied `buyerDid`. Mismatch throws
 * `intent_mandate_vc.buyer_did_holder_mismatch` so callers can surface a
 * stable error code (e.g. submit_intent handler).
 *
 *   - W3C VC Data Model 1.1 §4.4 (holder): https://www.w3.org/TR/vc-data-model/#holder
 *     "The holder of a verifiable credential is typically the subject … expressed
 *     using the holder property … the value of the holder property MUST be a URI."
 *   - W3C VC Data Model 1.1 §4.4 also notes that `credentialSubject.id` is the
 *     conventional binding for the subject DID; both are checked here.
 */
export declare function parseIntentMandateVc(raw: string, opts?: {
    strict?: boolean;
    buyerDid?: string;
}): {
    credentialSubject: Record<string, unknown>;
    holder?: string;
};
/**
 * AP2 v0.1 spec §4.1.1 — Payee identification (merchant-bound info).
 */
export declare const PayeeSchema: z.ZodObject<{
    /** Merchant id (Semore-issued, e.g. `mer_abc123`). */
    id: z.ZodString;
    /** Optional did:web for AP2 mandate proof chain. */
    did: z.ZodOptional<z.ZodString>;
    /** Display name used in user-facing receipts. */
    display_name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    display_name: string;
    did?: string | undefined;
}, {
    id: string;
    display_name: string;
    did?: string | undefined;
}>;
export type Payee = z.infer<typeof PayeeSchema>;
/**
 * AP2 v0.1 spec §4.1.1 — Risk signals (optional, PSP-bound info).
 *
 * AP2 v0.1 spec: §4.1.1 (Risk Payload) + §7.4 (Risk Signals) — both names refer to this schema.
 * Naming follows §7.4 (Risk Signals) for snake_case + plural noun convention.
 *
 * NOTE (PIPA): `ip` / `device_fp` are sensitive identifiers under PIPA.
 * Phase 0 sandbox 한정 — production 진입 시 별도 ADR (FU-0062-2 followup queue)
 * 로 retention/legal-basis 정의 필요. OSS schema 는 optional 표면만 노출.
 */
export declare const RiskSignalsSchema: z.ZodObject<{
    ip: z.ZodOptional<z.ZodString>;
    device_fp: z.ZodOptional<z.ZodString>;
    /** PSP-issued behavioural risk score (0~1 or 0~100, PSP-defined). */
    behavioral_score: z.ZodOptional<z.ZodNumber>;
    /** Free-form fraud flags (e.g. ["velocity_high", "geo_mismatch"]). */
    fraud_flags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    ip?: string | undefined;
    device_fp?: string | undefined;
    behavioral_score?: number | undefined;
    fraud_flags?: string[] | undefined;
}, {
    ip?: string | undefined;
    device_fp?: string | undefined;
    behavioral_score?: number | undefined;
    fraud_flags?: string[] | undefined;
}>;
export type RiskSignals = z.infer<typeof RiskSignalsSchema>;
export declare const QuoteCheckoutInput: z.ZodObject<{
    cart_id: z.ZodString;
    /** Optional. 사전 발급된 IntentMandate VC (없으면 anonymous quote). */
    intent_mandate_vc: z.ZodOptional<z.ZodString>;
    /**
     * Buyer DID — AP2 holder (W3C VC 1.1 §4.4). Optional at the quote stage
     * to allow anonymous price preview; the `submit_intent` step requires it
     * (FU-0062-2.11). When supplied, the same allowlist (did:web/key/jwk)
     * applies as in `BuyerDidSchema`.
     */
    buyer_did: z.ZodOptional<z.ZodString>;
    /** Optional payment method hint (Stripe/PayPal/Eximbay channel). */
    payment_method: z.ZodOptional<z.ZodEnum<["stripe", "paypal", "eximbay"]>>;
    shipping_method: z.ZodOptional<z.ZodEnum<["k_packet", "ems", "dhl_express"]>>;
}, "strip", z.ZodTypeAny, {
    cart_id: string;
    intent_mandate_vc?: string | undefined;
    buyer_did?: string | undefined;
    payment_method?: "stripe" | "paypal" | "eximbay" | undefined;
    shipping_method?: "k_packet" | "ems" | "dhl_express" | undefined;
}, {
    cart_id: string;
    intent_mandate_vc?: string | undefined;
    buyer_did?: string | undefined;
    payment_method?: "stripe" | "paypal" | "eximbay" | undefined;
    shipping_method?: "k_packet" | "ems" | "dhl_express" | undefined;
}>;
export type QuoteCheckoutInput = z.infer<typeof QuoteCheckoutInput>;
/**
 * AP2 CartMandate VC payload (canonical, to-be-signed).
 *
 * 본 OSS wire-shape 는 minimal — 실제 issuer (`ap2-agent`) 는 W3C VC
 * `@context` + `type` + `credentialSubject` 를 채워서 Ed25519 서명을 부여.
 * 서명 후 결과를 `submit_intent.cart_mandate_vc_signed` 로 다시 전달.
 *
 * 4 신규 필드 (FU-0062-2.1, AP2 spec §4.1.1):
 *   - `payee`: merchant 식별 (id + did? + display_name)
 *   - `payment_method_token`: PSP 발급 opaque token (channel_key wrap, PCI safe)
 *   - `risk_signals`: optional PSP risk metadata (PIPA-sensitive — sandbox only)
 *   - `intent_hash`: SHA-256 hex chain link to IntentMandate (ADR-0042 §19)
 *
 * 추가 필드 (FU-0062-2.10, AP2 spec §4.1.1 5th bound info):
 *   - `refundable`: optional boolean — caller (merchant policy) 가 결정.
 *     true = refund 가능, false = no-refund. omitted = caller-default.
 *
 * cart_hash invariant (ADR-0042 §19):
 *   cart_hash = SHA-256(JCS(cart_payload_minus_cart_hash)) — RFC 8785
 *   즉 본 payload 에서 `cart_hash` 필드를 제거한 나머지를 JCS canonicalize 후
 *   SHA-256 hex 64. 검증은 issuer/verifier 측 책임. OSS 는 wire-shape regex 만.
 */
export declare const CartMandatePayloadSchema: z.ZodObject<{
    type: z.ZodLiteral<"CartMandate">;
    cart_id: z.ZodString;
    /** Server-side canonical hash. cart_hash = SHA-256(JCS(cart_payload_minus_cart_hash)) — RFC 8785. */
    cart_hash: z.ZodString;
    total_usd: z.ZodString;
    currency: z.ZodString;
    fx_rate: z.ZodOptional<z.ZodString>;
    /** ISO 8601 expiry — VC `exp` claim 매핑. */
    expires_at: z.ZodString;
    issuer: z.ZodString;
    /**
     * Buyer DID — W3C VC 1.1 §4.4 holder mapping. Optional only when the
     * mandate is anonymous (rare); SubmitIntent requires it (FU-0062-2.11).
     */
    buyer_did: z.ZodOptional<z.ZodString>;
    /** AP2 §4.1.1 — payee 식별. Merchant-bound info. */
    payee: z.ZodObject<{
        /** Merchant id (Semore-issued, e.g. `mer_abc123`). */
        id: z.ZodString;
        /** Optional did:web for AP2 mandate proof chain. */
        did: z.ZodOptional<z.ZodString>;
        /** Display name used in user-facing receipts. */
        display_name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        display_name: string;
        did?: string | undefined;
    }, {
        id: string;
        display_name: string;
        did?: string | undefined;
    }>;
    /** AP2 §4.1.1 — PSP-issued opaque token (PortOne `channel_key` wrap, PAN/CVV X). */
    payment_method_token: z.ZodString;
    /** AP2 §4.1.1 — optional risk metadata (PIPA-sensitive in prod). */
    risk_signals: z.ZodOptional<z.ZodObject<{
        ip: z.ZodOptional<z.ZodString>;
        device_fp: z.ZodOptional<z.ZodString>;
        /** PSP-issued behavioural risk score (0~1 or 0~100, PSP-defined). */
        behavioral_score: z.ZodOptional<z.ZodNumber>;
        /** Free-form fraud flags (e.g. ["velocity_high", "geo_mismatch"]). */
        fraud_flags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        ip?: string | undefined;
        device_fp?: string | undefined;
        behavioral_score?: number | undefined;
        fraud_flags?: string[] | undefined;
    }, {
        ip?: string | undefined;
        device_fp?: string | undefined;
        behavioral_score?: number | undefined;
        fraud_flags?: string[] | undefined;
    }>>;
    /** ADR-0042 §19 — chain link to parent IntentMandate. SHA-256 hex of intent subject. */
    intent_hash: z.ZodString;
    /**
     * AP2 §4.1.1 5th bound info — caller (merchant policy) 가 결정.
     * true = refund 가능, false = no-refund. omitted = caller-default.
     */
    refundable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "CartMandate";
    currency: string;
    cart_id: string;
    total_usd: string;
    expires_at: string;
    cart_hash: string;
    issuer: string;
    payee: {
        id: string;
        display_name: string;
        did?: string | undefined;
    };
    payment_method_token: string;
    intent_hash: string;
    buyer_did?: string | undefined;
    fx_rate?: string | undefined;
    risk_signals?: {
        ip?: string | undefined;
        device_fp?: string | undefined;
        behavioral_score?: number | undefined;
        fraud_flags?: string[] | undefined;
    } | undefined;
    refundable?: boolean | undefined;
}, {
    type: "CartMandate";
    currency: string;
    cart_id: string;
    total_usd: string;
    expires_at: string;
    cart_hash: string;
    issuer: string;
    payee: {
        id: string;
        display_name: string;
        did?: string | undefined;
    };
    payment_method_token: string;
    intent_hash: string;
    buyer_did?: string | undefined;
    fx_rate?: string | undefined;
    risk_signals?: {
        ip?: string | undefined;
        device_fp?: string | undefined;
        behavioral_score?: number | undefined;
        fraud_flags?: string[] | undefined;
    } | undefined;
    refundable?: boolean | undefined;
}>;
export type CartMandatePayload = z.infer<typeof CartMandatePayloadSchema>;
export declare const QuoteCheckoutOutput: z.ZodObject<{
    quote_id: z.ZodString;
    cart_id: z.ZodString;
    refreshed_total_usd: z.ZodString;
    tax_usd: z.ZodString;
    shipping_usd: z.ZodString;
    fx_rate: z.ZodOptional<z.ZodString>;
    cart_mandate_payload: z.ZodObject<{
        type: z.ZodLiteral<"CartMandate">;
        cart_id: z.ZodString;
        /** Server-side canonical hash. cart_hash = SHA-256(JCS(cart_payload_minus_cart_hash)) — RFC 8785. */
        cart_hash: z.ZodString;
        total_usd: z.ZodString;
        currency: z.ZodString;
        fx_rate: z.ZodOptional<z.ZodString>;
        /** ISO 8601 expiry — VC `exp` claim 매핑. */
        expires_at: z.ZodString;
        issuer: z.ZodString;
        /**
         * Buyer DID — W3C VC 1.1 §4.4 holder mapping. Optional only when the
         * mandate is anonymous (rare); SubmitIntent requires it (FU-0062-2.11).
         */
        buyer_did: z.ZodOptional<z.ZodString>;
        /** AP2 §4.1.1 — payee 식별. Merchant-bound info. */
        payee: z.ZodObject<{
            /** Merchant id (Semore-issued, e.g. `mer_abc123`). */
            id: z.ZodString;
            /** Optional did:web for AP2 mandate proof chain. */
            did: z.ZodOptional<z.ZodString>;
            /** Display name used in user-facing receipts. */
            display_name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            display_name: string;
            did?: string | undefined;
        }, {
            id: string;
            display_name: string;
            did?: string | undefined;
        }>;
        /** AP2 §4.1.1 — PSP-issued opaque token (PortOne `channel_key` wrap, PAN/CVV X). */
        payment_method_token: z.ZodString;
        /** AP2 §4.1.1 — optional risk metadata (PIPA-sensitive in prod). */
        risk_signals: z.ZodOptional<z.ZodObject<{
            ip: z.ZodOptional<z.ZodString>;
            device_fp: z.ZodOptional<z.ZodString>;
            /** PSP-issued behavioural risk score (0~1 or 0~100, PSP-defined). */
            behavioral_score: z.ZodOptional<z.ZodNumber>;
            /** Free-form fraud flags (e.g. ["velocity_high", "geo_mismatch"]). */
            fraud_flags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            ip?: string | undefined;
            device_fp?: string | undefined;
            behavioral_score?: number | undefined;
            fraud_flags?: string[] | undefined;
        }, {
            ip?: string | undefined;
            device_fp?: string | undefined;
            behavioral_score?: number | undefined;
            fraud_flags?: string[] | undefined;
        }>>;
        /** ADR-0042 §19 — chain link to parent IntentMandate. SHA-256 hex of intent subject. */
        intent_hash: z.ZodString;
        /**
         * AP2 §4.1.1 5th bound info — caller (merchant policy) 가 결정.
         * true = refund 가능, false = no-refund. omitted = caller-default.
         */
        refundable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "CartMandate";
        currency: string;
        cart_id: string;
        total_usd: string;
        expires_at: string;
        cart_hash: string;
        issuer: string;
        payee: {
            id: string;
            display_name: string;
            did?: string | undefined;
        };
        payment_method_token: string;
        intent_hash: string;
        buyer_did?: string | undefined;
        fx_rate?: string | undefined;
        risk_signals?: {
            ip?: string | undefined;
            device_fp?: string | undefined;
            behavioral_score?: number | undefined;
            fraud_flags?: string[] | undefined;
        } | undefined;
        refundable?: boolean | undefined;
    }, {
        type: "CartMandate";
        currency: string;
        cart_id: string;
        total_usd: string;
        expires_at: string;
        cart_hash: string;
        issuer: string;
        payee: {
            id: string;
            display_name: string;
            did?: string | undefined;
        };
        payment_method_token: string;
        intent_hash: string;
        buyer_did?: string | undefined;
        fx_rate?: string | undefined;
        risk_signals?: {
            ip?: string | undefined;
            device_fp?: string | undefined;
            behavioral_score?: number | undefined;
            fraud_flags?: string[] | undefined;
        } | undefined;
        refundable?: boolean | undefined;
    }>;
    /** Unix epoch (seconds). */
    expires_at: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    cart_id: string;
    shipping_usd: string;
    expires_at: number;
    quote_id: string;
    refreshed_total_usd: string;
    tax_usd: string;
    cart_mandate_payload: {
        type: "CartMandate";
        currency: string;
        cart_id: string;
        total_usd: string;
        expires_at: string;
        cart_hash: string;
        issuer: string;
        payee: {
            id: string;
            display_name: string;
            did?: string | undefined;
        };
        payment_method_token: string;
        intent_hash: string;
        buyer_did?: string | undefined;
        fx_rate?: string | undefined;
        risk_signals?: {
            ip?: string | undefined;
            device_fp?: string | undefined;
            behavioral_score?: number | undefined;
            fraud_flags?: string[] | undefined;
        } | undefined;
        refundable?: boolean | undefined;
    };
    fx_rate?: string | undefined;
}, {
    cart_id: string;
    shipping_usd: string;
    expires_at: number;
    quote_id: string;
    refreshed_total_usd: string;
    tax_usd: string;
    cart_mandate_payload: {
        type: "CartMandate";
        currency: string;
        cart_id: string;
        total_usd: string;
        expires_at: string;
        cart_hash: string;
        issuer: string;
        payee: {
            id: string;
            display_name: string;
            did?: string | undefined;
        };
        payment_method_token: string;
        intent_hash: string;
        buyer_did?: string | undefined;
        fx_rate?: string | undefined;
        risk_signals?: {
            ip?: string | undefined;
            device_fp?: string | undefined;
            behavioral_score?: number | undefined;
            fraud_flags?: string[] | undefined;
        } | undefined;
        refundable?: boolean | undefined;
    };
    fx_rate?: string | undefined;
}>;
export type QuoteCheckoutOutput = z.infer<typeof QuoteCheckoutOutput>;
/**
 * Pluggable re-quote backend. Apps inject `lib/commerce.ts#requoteCart`
 * which (a) refreshes the cross-border quote against current FX/tariff/IOSS
 * tables and (b) hands the canonical CartMandate payload to the AP2 issuer
 * for signing in a downstream step.
 */
export interface CheckoutQuoter {
    (input: QuoteCheckoutInput): Promise<QuoteCheckoutOutput>;
}
/** Sentinel placeholder used by STUB_QUOTER. Production callers must replace. */
export declare const STUB_CART_HASH_SENTINEL: string;
export declare const STUB_INTENT_HASH_SENTINEL: string;
export interface QuoteCheckoutToolOptions {
    quoter?: CheckoutQuoter;
    /**
     * Allow stub sentinel values (`cart_hash` / `intent_hash` = 64 zeros) to
     * pass through. Required when `process.env.NODE_ENV === "production"`
     * and a sentinel is detected — otherwise the handler throws to prevent
     * stub leakage. Defaults to `false`.
     */
    allowStub?: boolean;
}
export declare function makeQuoteCheckoutTool(options?: QuoteCheckoutToolOptions): {
    name: "quote_checkout";
    description: string;
    inputSchema: z.ZodObject<{
        cart_id: z.ZodString;
        /** Optional. 사전 발급된 IntentMandate VC (없으면 anonymous quote). */
        intent_mandate_vc: z.ZodOptional<z.ZodString>;
        /**
         * Buyer DID — AP2 holder (W3C VC 1.1 §4.4). Optional at the quote stage
         * to allow anonymous price preview; the `submit_intent` step requires it
         * (FU-0062-2.11). When supplied, the same allowlist (did:web/key/jwk)
         * applies as in `BuyerDidSchema`.
         */
        buyer_did: z.ZodOptional<z.ZodString>;
        /** Optional payment method hint (Stripe/PayPal/Eximbay channel). */
        payment_method: z.ZodOptional<z.ZodEnum<["stripe", "paypal", "eximbay"]>>;
        shipping_method: z.ZodOptional<z.ZodEnum<["k_packet", "ems", "dhl_express"]>>;
    }, "strip", z.ZodTypeAny, {
        cart_id: string;
        intent_mandate_vc?: string | undefined;
        buyer_did?: string | undefined;
        payment_method?: "stripe" | "paypal" | "eximbay" | undefined;
        shipping_method?: "k_packet" | "ems" | "dhl_express" | undefined;
    }, {
        cart_id: string;
        intent_mandate_vc?: string | undefined;
        buyer_did?: string | undefined;
        payment_method?: "stripe" | "paypal" | "eximbay" | undefined;
        shipping_method?: "k_packet" | "ems" | "dhl_express" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        quote_id: z.ZodString;
        cart_id: z.ZodString;
        refreshed_total_usd: z.ZodString;
        tax_usd: z.ZodString;
        shipping_usd: z.ZodString;
        fx_rate: z.ZodOptional<z.ZodString>;
        cart_mandate_payload: z.ZodObject<{
            type: z.ZodLiteral<"CartMandate">;
            cart_id: z.ZodString;
            /** Server-side canonical hash. cart_hash = SHA-256(JCS(cart_payload_minus_cart_hash)) — RFC 8785. */
            cart_hash: z.ZodString;
            total_usd: z.ZodString;
            currency: z.ZodString;
            fx_rate: z.ZodOptional<z.ZodString>;
            /** ISO 8601 expiry — VC `exp` claim 매핑. */
            expires_at: z.ZodString;
            issuer: z.ZodString;
            /**
             * Buyer DID — W3C VC 1.1 §4.4 holder mapping. Optional only when the
             * mandate is anonymous (rare); SubmitIntent requires it (FU-0062-2.11).
             */
            buyer_did: z.ZodOptional<z.ZodString>;
            /** AP2 §4.1.1 — payee 식별. Merchant-bound info. */
            payee: z.ZodObject<{
                /** Merchant id (Semore-issued, e.g. `mer_abc123`). */
                id: z.ZodString;
                /** Optional did:web for AP2 mandate proof chain. */
                did: z.ZodOptional<z.ZodString>;
                /** Display name used in user-facing receipts. */
                display_name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                display_name: string;
                did?: string | undefined;
            }, {
                id: string;
                display_name: string;
                did?: string | undefined;
            }>;
            /** AP2 §4.1.1 — PSP-issued opaque token (PortOne `channel_key` wrap, PAN/CVV X). */
            payment_method_token: z.ZodString;
            /** AP2 §4.1.1 — optional risk metadata (PIPA-sensitive in prod). */
            risk_signals: z.ZodOptional<z.ZodObject<{
                ip: z.ZodOptional<z.ZodString>;
                device_fp: z.ZodOptional<z.ZodString>;
                /** PSP-issued behavioural risk score (0~1 or 0~100, PSP-defined). */
                behavioral_score: z.ZodOptional<z.ZodNumber>;
                /** Free-form fraud flags (e.g. ["velocity_high", "geo_mismatch"]). */
                fraud_flags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            }, {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            }>>;
            /** ADR-0042 §19 — chain link to parent IntentMandate. SHA-256 hex of intent subject. */
            intent_hash: z.ZodString;
            /**
             * AP2 §4.1.1 5th bound info — caller (merchant policy) 가 결정.
             * true = refund 가능, false = no-refund. omitted = caller-default.
             */
            refundable: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        }, {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        }>;
        /** Unix epoch (seconds). */
        expires_at: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        cart_id: string;
        shipping_usd: string;
        expires_at: number;
        quote_id: string;
        refreshed_total_usd: string;
        tax_usd: string;
        cart_mandate_payload: {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        };
        fx_rate?: string | undefined;
    }, {
        cart_id: string;
        shipping_usd: string;
        expires_at: number;
        quote_id: string;
        refreshed_total_usd: string;
        tax_usd: string;
        cart_mandate_payload: {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        };
        fx_rate?: string | undefined;
    }>;
    handler: (input: QuoteCheckoutInput) => Promise<QuoteCheckoutOutput>;
};
export declare const quoteCheckoutTool: {
    name: "quote_checkout";
    description: string;
    inputSchema: z.ZodObject<{
        cart_id: z.ZodString;
        /** Optional. 사전 발급된 IntentMandate VC (없으면 anonymous quote). */
        intent_mandate_vc: z.ZodOptional<z.ZodString>;
        /**
         * Buyer DID — AP2 holder (W3C VC 1.1 §4.4). Optional at the quote stage
         * to allow anonymous price preview; the `submit_intent` step requires it
         * (FU-0062-2.11). When supplied, the same allowlist (did:web/key/jwk)
         * applies as in `BuyerDidSchema`.
         */
        buyer_did: z.ZodOptional<z.ZodString>;
        /** Optional payment method hint (Stripe/PayPal/Eximbay channel). */
        payment_method: z.ZodOptional<z.ZodEnum<["stripe", "paypal", "eximbay"]>>;
        shipping_method: z.ZodOptional<z.ZodEnum<["k_packet", "ems", "dhl_express"]>>;
    }, "strip", z.ZodTypeAny, {
        cart_id: string;
        intent_mandate_vc?: string | undefined;
        buyer_did?: string | undefined;
        payment_method?: "stripe" | "paypal" | "eximbay" | undefined;
        shipping_method?: "k_packet" | "ems" | "dhl_express" | undefined;
    }, {
        cart_id: string;
        intent_mandate_vc?: string | undefined;
        buyer_did?: string | undefined;
        payment_method?: "stripe" | "paypal" | "eximbay" | undefined;
        shipping_method?: "k_packet" | "ems" | "dhl_express" | undefined;
    }>;
    outputSchema: z.ZodObject<{
        quote_id: z.ZodString;
        cart_id: z.ZodString;
        refreshed_total_usd: z.ZodString;
        tax_usd: z.ZodString;
        shipping_usd: z.ZodString;
        fx_rate: z.ZodOptional<z.ZodString>;
        cart_mandate_payload: z.ZodObject<{
            type: z.ZodLiteral<"CartMandate">;
            cart_id: z.ZodString;
            /** Server-side canonical hash. cart_hash = SHA-256(JCS(cart_payload_minus_cart_hash)) — RFC 8785. */
            cart_hash: z.ZodString;
            total_usd: z.ZodString;
            currency: z.ZodString;
            fx_rate: z.ZodOptional<z.ZodString>;
            /** ISO 8601 expiry — VC `exp` claim 매핑. */
            expires_at: z.ZodString;
            issuer: z.ZodString;
            /**
             * Buyer DID — W3C VC 1.1 §4.4 holder mapping. Optional only when the
             * mandate is anonymous (rare); SubmitIntent requires it (FU-0062-2.11).
             */
            buyer_did: z.ZodOptional<z.ZodString>;
            /** AP2 §4.1.1 — payee 식별. Merchant-bound info. */
            payee: z.ZodObject<{
                /** Merchant id (Semore-issued, e.g. `mer_abc123`). */
                id: z.ZodString;
                /** Optional did:web for AP2 mandate proof chain. */
                did: z.ZodOptional<z.ZodString>;
                /** Display name used in user-facing receipts. */
                display_name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                display_name: string;
                did?: string | undefined;
            }, {
                id: string;
                display_name: string;
                did?: string | undefined;
            }>;
            /** AP2 §4.1.1 — PSP-issued opaque token (PortOne `channel_key` wrap, PAN/CVV X). */
            payment_method_token: z.ZodString;
            /** AP2 §4.1.1 — optional risk metadata (PIPA-sensitive in prod). */
            risk_signals: z.ZodOptional<z.ZodObject<{
                ip: z.ZodOptional<z.ZodString>;
                device_fp: z.ZodOptional<z.ZodString>;
                /** PSP-issued behavioural risk score (0~1 or 0~100, PSP-defined). */
                behavioral_score: z.ZodOptional<z.ZodNumber>;
                /** Free-form fraud flags (e.g. ["velocity_high", "geo_mismatch"]). */
                fraud_flags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            }, {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            }>>;
            /** ADR-0042 §19 — chain link to parent IntentMandate. SHA-256 hex of intent subject. */
            intent_hash: z.ZodString;
            /**
             * AP2 §4.1.1 5th bound info — caller (merchant policy) 가 결정.
             * true = refund 가능, false = no-refund. omitted = caller-default.
             */
            refundable: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        }, {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        }>;
        /** Unix epoch (seconds). */
        expires_at: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        cart_id: string;
        shipping_usd: string;
        expires_at: number;
        quote_id: string;
        refreshed_total_usd: string;
        tax_usd: string;
        cart_mandate_payload: {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        };
        fx_rate?: string | undefined;
    }, {
        cart_id: string;
        shipping_usd: string;
        expires_at: number;
        quote_id: string;
        refreshed_total_usd: string;
        tax_usd: string;
        cart_mandate_payload: {
            type: "CartMandate";
            currency: string;
            cart_id: string;
            total_usd: string;
            expires_at: string;
            cart_hash: string;
            issuer: string;
            payee: {
                id: string;
                display_name: string;
                did?: string | undefined;
            };
            payment_method_token: string;
            intent_hash: string;
            buyer_did?: string | undefined;
            fx_rate?: string | undefined;
            risk_signals?: {
                ip?: string | undefined;
                device_fp?: string | undefined;
                behavioral_score?: number | undefined;
                fraud_flags?: string[] | undefined;
            } | undefined;
            refundable?: boolean | undefined;
        };
        fx_rate?: string | undefined;
    }>;
    handler: (input: QuoteCheckoutInput) => Promise<QuoteCheckoutOutput>;
};
//# sourceMappingURL=quote-checkout.d.ts.map