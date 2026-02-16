/**
 * Mock Verification Data
 *
 * Mock verification requests, OCR results, and claim attempts
 * for development and demo purposes.
 */

import { type VerificationRequest, type VerificationOCR, type ClaimAttempt } from "@/lib/types";

/* ── Mock Verification Requests ──────────────────────────────── */

export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: "vr_1",
    proId: "pro_1",
    proName: "Alex Martinez",
    type: "license_upload",
    documentUrl: "/mock/license-alex.pdf",
    status: "auto_approved",
    ocrResult: {
      extractedName: "Alex R. Martinez",
      extractedLicenseNumber: "450.012345",
      extractedExpiration: "2027-09-30",
      nameMatch: true,
      licenseMatch: true,
      expirationValid: true,
      confidence: 0.96,
    },
    confidence: 0.96,
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "vr_2",
    proId: "pro_2",
    proName: "Jordan Lee",
    type: "license_upload",
    documentUrl: "/mock/license-jordan.pdf",
    status: "pending",
    ocrResult: {
      extractedName: "Jordan H. Lee",
      extractedLicenseNumber: "031.0?8?21",
      extractedExpiration: "2027-03-15",
      nameMatch: true,
      licenseMatch: false,
      expirationValid: true,
      confidence: 0.58,
    },
    confidence: 0.58,
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: "2026-02-08T14:15:00Z",
  },
  {
    id: "vr_3",
    proId: "pro_5",
    proName: "Priya Kapoor",
    type: "claim_verification",
    documentUrl: null,
    status: "rejected",
    ocrResult: {
      extractedName: "Robert J. Thompson",
      extractedLicenseNumber: "999.888777",
      extractedExpiration: "2025-01-15",
      nameMatch: false,
      licenseMatch: false,
      expirationValid: false,
      confidence: 0.12,
    },
    confidence: 0.12,
    reviewedBy: "Admin",
    reviewedAt: "2026-02-09T16:00:00Z",
    rejectionReason: "Document does not appear to belong to the profile owner. Name and license number do not match.",
    createdAt: "2026-02-09T11:00:00Z",
  },
  {
    id: "vr_4",
    proId: "pro_4",
    proName: "Marcus Williams",
    type: "license_upload",
    documentUrl: "/mock/license-marcus.pdf",
    status: "manual_review",
    ocrResult: {
      extractedName: "Marcus D. Williams",
      extractedLicenseNumber: "631.098765",
      extractedExpiration: "2027-06-30",
      nameMatch: true,
      licenseMatch: true,
      expirationValid: true,
      confidence: 0.72,
    },
    confidence: 0.72,
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: "2026-02-10T09:45:00Z",
  },
];

/* ── Mock Claim Attempts ─────────────────────────────────────── */

export const mockClaimAttempts: ClaimAttempt[] = [
  {
    id: "ca_1",
    professionalId: "lic_001",
    licenseNumberEntered: "471.012345",
    matched: true,
    professionalIdType: "mls",
    professionalIdValue: "10234567",
    timestamp: "2026-02-08T14:30:00Z",
  },
  {
    id: "ca_2",
    professionalId: "lic_002",
    licenseNumberEntered: "999.000000",
    matched: false,
    professionalIdType: null,
    professionalIdValue: null,
    timestamp: "2026-02-09T10:15:00Z",
  },
];

/* ── Helper: Get verification for a pro ──────────────────────── */

export function getVerificationForPro(proId: string): VerificationRequest | undefined {
  return mockVerificationRequests.find((v) => v.proId === proId);
}

export function getVerificationStatus(proId: string): "not_verified" | "pending" | "verified" {
  const req = getVerificationForPro(proId);
  if (!req) return "not_verified";
  if (req.status === "auto_approved" || req.status === "approved") return "verified";
  if (req.status === "pending" || req.status === "manual_review") return "pending";
  return "not_verified";
}

export function getVerificationDate(proId: string): string | null {
  const req = getVerificationForPro(proId);
  if (!req) return null;
  if (req.status === "auto_approved") return req.createdAt;
  if (req.status === "approved") return req.reviewedAt;
  return null;
}
