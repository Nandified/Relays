/* ── Relays — Webhook Delivery Service (Mock) ──────────────────── */
/*
 * This module simulates the webhook delivery lifecycle.
 * In production, this would be backed by a job queue (e.g. BullMQ / Inngest)
 * with persistent storage and proper retry/backoff logic.
 *
 * Functions:
 *   signPayload()   — HMAC-SHA256 signature for webhook payloads
 *   deliverEvent()   — Simulate sending an event to an endpoint
 *   retryDelivery()  — Simulate retrying a failed delivery
 *   testEndpoint()   — Send a test ping event to verify endpoint
 */

import type {
  RelaysEvent,
  WebhookEndpoint,
  WebhookDelivery,
  WebhookDeliveryStatus,
  EventType,
} from "@/lib/types";

// ── Signature ──────────────────────────────────────────────────

/**
 * Generate HMAC-SHA256 signature for a webhook payload.
 *
 * Real implementation:
 *   const hmac = crypto.createHmac("sha256", secret);
 *   hmac.update(JSON.stringify(payload));
 *   return `sha256=${hmac.digest("hex")}`;
 *
 * The consumer verifies:
 *   1. Extract `X-Relays-Signature` header
 *   2. Compute their own HMAC with shared secret
 *   3. timingSafeEqual(computed, received)
 */
export function signPayload(
  payload: Record<string, unknown>,
  _secret: string
): string {
  // Mock: return a realistic-looking signature
  const mockHash = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `sha256=${mockHash}`;
}

// ── Delivery Simulation ────────────────────────────────────────

/**
 * Simulate delivering an event to a webhook endpoint.
 *
 * Real implementation would:
 *   1. JSON.stringify the event payload
 *   2. Sign with HMAC-SHA256 using endpoint.secret
 *   3. POST to endpoint.url with headers:
 *      - Content-Type: application/json
 *      - X-Relays-Signature: sha256=...
 *      - X-Relays-Event: event.type
 *      - X-Relays-Delivery: delivery.id
 *      - X-Relays-Timestamp: ISO 8601
 *      - X-Relays-Idempotency-Key: event.idempotencyKey
 *   4. Record status code + response time
 *   5. On failure: schedule retry with exponential backoff
 *      (1min, 5min, 30min, 2hr, 12hr — max 5 attempts)
 *   6. After max retries: mark endpoint as "failed", send alert
 */
export function deliverEvent(
  event: RelaysEvent,
  endpoint: WebhookEndpoint
): WebhookDelivery {
  // Simulate varying outcomes
  const rand = Math.random();
  let status: WebhookDeliveryStatus;
  let statusCode: number | undefined;
  let responseMs: number | undefined;

  if (endpoint.status === "paused") {
    // Paused endpoints don't receive deliveries
    status = "pending";
  } else if (rand > 0.85) {
    // ~15% failure rate simulation
    status = "failed";
    statusCode = rand > 0.93 ? 500 : 408;
    responseMs = Math.floor(Math.random() * 5000) + 2000;
  } else {
    // Success
    status = "delivered";
    statusCode = 200;
    responseMs = Math.floor(Math.random() * 300) + 50;
  }

  const delivery: WebhookDelivery = {
    id: `del_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    endpointId: endpoint.id,
    eventId: event.id,
    eventType: event.type,
    status,
    statusCode,
    responseMs,
    attempts: 1,
    createdAt: new Date().toISOString(),
  };

  return delivery;
}

/**
 * Simulate retrying a failed delivery.
 *
 * Real implementation:
 *   - Exponential backoff: attempt N → delay = min(2^N * 60s, 43200s)
 *   - Jitter: ±10% random to avoid thundering herd
 *   - Max 5 attempts total
 *   - After exhaustion: mark endpoint.status = "failed"
 *   - Send notification to pro: "Webhook endpoint failing"
 */
export function retryDelivery(
  delivery: WebhookDelivery,
  _endpoint: WebhookEndpoint
): WebhookDelivery {
  const nextAttempt = delivery.attempts + 1;
  const maxAttempts = 5;

  if (nextAttempt > maxAttempts) {
    return {
      ...delivery,
      status: "failed",
      attempts: delivery.attempts,
    };
  }

  // Simulate: 60% chance of success on retry
  const success = Math.random() > 0.4;

  // Calculate next retry time with exponential backoff
  const backoffSeconds = Math.min(Math.pow(2, nextAttempt) * 60, 43200);
  const nextRetryAt = new Date(
    Date.now() + backoffSeconds * 1000
  ).toISOString();

  return {
    ...delivery,
    status: success ? "delivered" : "retrying",
    statusCode: success ? 200 : 500,
    responseMs: success
      ? Math.floor(Math.random() * 200) + 80
      : Math.floor(Math.random() * 5000) + 3000,
    attempts: nextAttempt,
    nextRetryAt: success ? undefined : nextRetryAt,
  };
}

/**
 * Send a test event to verify endpoint configuration.
 *
 * Real implementation:
 *   - Sends a special `test.ping` event (not a real EventType)
 *   - Payload includes { test: true, timestamp, message }
 *   - Endpoint must respond with 200 within 10s
 *   - Does NOT count toward delivery logs
 */
export function testEndpoint(
  endpoint: WebhookEndpoint
): { success: boolean; statusCode: number; responseMs: number; error?: string } {
  // Simulate test delivery
  const success = endpoint.url.startsWith("https://");

  return {
    success,
    statusCode: success ? 200 : 0,
    responseMs: success ? Math.floor(Math.random() * 150) + 50 : 0,
    error: success ? undefined : "Connection refused — endpoint must use HTTPS",
  };
}

// ── Event Builder ──────────────────────────────────────────────

/**
 * Build a RelaysEvent from a type + payload.
 * Generates a unique ID and idempotency key.
 */
export function buildEvent(
  type: EventType,
  payload: Record<string, unknown>,
  meta?: { journeyId?: string; proId?: string; consumerId?: string }
): RelaysEvent {
  const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    type,
    version: "v1",
    timestamp: new Date().toISOString(),
    payload,
    journeyId: meta?.journeyId,
    proId: meta?.proId,
    consumerId: meta?.consumerId,
    idempotencyKey: `${type}_${id}`,
  };
}

// ── Retry Schedule ─────────────────────────────────────────────

/**
 * Calculate retry delay for a given attempt number.
 * Uses exponential backoff with jitter.
 *
 * Attempt 1: ~1 min
 * Attempt 2: ~4 min
 * Attempt 3: ~16 min
 * Attempt 4: ~64 min (~1hr)
 * Attempt 5: ~256 min (~4hr) — capped at 12hr
 */
export function getRetryDelay(attempt: number): number {
  const baseMs = Math.pow(2, attempt) * 60_000;
  const capped = Math.min(baseMs, 43_200_000); // 12hr max
  const jitter = capped * (0.9 + Math.random() * 0.2); // ±10%
  return Math.floor(jitter);
}
