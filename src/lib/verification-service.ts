/**
 * Verification Service — Mock OCR + License Verification
 *
 * This module simulates document OCR processing and license verification.
 * All functions are interface-ready for real service integration later.
 *
 * ── Future Integration Points ──
 * - processDocument() → Replace with AWS Textract, Google Vision, or Azure Form Recognizer
 * - verifyLicenseNumber() → Replace with IDFPR API or state licensing board lookup
 * - crossReferenceId() → Replace with NMLS, ARDC, NAR, etc. public APIs
 */

import {
  type VerificationOCR,
  type VerificationStatus,
  type ProfessionalIdType,
  type ProServiceCategory,
} from "@/lib/types";

/* ── OCR Document Processing ─────────────────────────────────── */

export interface OCRProcessingResult {
  success: boolean;
  ocrResult: VerificationOCR;
  status: VerificationStatus;
  processingTimeMs: number;
}

/**
 * Simulate OCR processing of an uploaded license document.
 *
 * In production, this would:
 * 1. Upload document to S3/GCS
 * 2. Send to OCR service (Textract / Google Vision / Azure)
 * 3. Parse structured fields from extracted text
 * 4. Compare extracted fields against profile data
 * 5. Return confidence score
 *
 * @param _documentFile - The uploaded file (unused in mock)
 * @param profileName - Pro's name from their profile
 * @param profileLicenseNumber - Known license number (if available)
 * @param scenario - Mock scenario to simulate (for demo purposes)
 */
export async function processDocument(
  _documentFile: File | null,
  profileName: string,
  profileLicenseNumber: string | null,
  scenario: "high_confidence" | "low_confidence" | "mismatch" = "high_confidence"
): Promise<OCRProcessingResult> {
  // Simulate processing delay (1.5-3s)
  const processingTimeMs = 1500 + Math.random() * 1500;
  await new Promise((resolve) => setTimeout(resolve, processingTimeMs));

  /*
   * ── INTEGRATION POINT ──
   * Replace this mock with real OCR:
   *
   * const textractResult = await textractClient.analyzeDocument({
   *   Document: { Bytes: documentBuffer },
   *   FeatureTypes: ['FORMS', 'TABLES'],
   * });
   *
   * const extracted = parseTextractResponse(textractResult);
   */

  const scenarios: Record<string, VerificationOCR> = {
    high_confidence: {
      extractedName: profileName,
      extractedLicenseNumber: profileLicenseNumber || "471.012345",
      extractedExpiration: "2027-09-30",
      nameMatch: true,
      licenseMatch: true,
      expirationValid: true,
      confidence: 0.94,
    },
    low_confidence: {
      extractedName: profileName.split(" ")[0] + " " + profileName.split(" ").slice(1).join(" ").substring(0, 3) + "...",
      extractedLicenseNumber: profileLicenseNumber || "471.0?2?45",
      extractedExpiration: "202?-??-??",
      nameMatch: true,
      licenseMatch: false,
      expirationValid: false,
      confidence: 0.42,
    },
    mismatch: {
      extractedName: "Robert J. Thompson",
      extractedLicenseNumber: "999.888777",
      extractedExpiration: "2025-01-15",
      nameMatch: false,
      licenseMatch: false,
      expirationValid: false,
      confidence: 0.15,
    },
  };

  const ocrResult = scenarios[scenario] ?? scenarios.high_confidence;

  // Determine status based on confidence
  let status: VerificationStatus;
  if (ocrResult.confidence >= 0.8 && ocrResult.nameMatch && ocrResult.expirationValid) {
    status = "auto_approved";
  } else if (ocrResult.confidence >= 0.4) {
    status = "manual_review";
  } else {
    status = "rejected";
  }

  return {
    success: true,
    ocrResult,
    status,
    processingTimeMs,
  };
}

/* ── License Number Verification ─────────────────────────────── */

export interface LicenseVerificationResult {
  matched: boolean;
  professionalName: string | null;
  licenseType: string | null;
  expirationDate: string | null;
}

/**
 * Verify a license number against our database of professionals.
 *
 * In production, this would query IDFPR or state licensing board APIs.
 *
 * @param licenseNumber - License number entered by the pro
 * @param professionalId - ID of the unclaimed professional record
 */
export async function verifyLicenseNumber(
  licenseNumber: string,
  professionalId: string
): Promise<LicenseVerificationResult> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  /*
   * ── INTEGRATION POINT ──
   * Replace with real IDFPR API lookup:
   *
   * const result = await idfprClient.verifyLicense(licenseNumber);
   * return {
   *   matched: result.status === 'ACTIVE' && result.id === professionalId,
   *   professionalName: result.name,
   *   licenseType: result.type,
   *   expirationDate: result.expires,
   * };
   */

  // Mock: match if license number contains "471" (Illinois prefix) or matches exactly
  const isMatch = licenseNumber.includes("471") || licenseNumber.length >= 6;

  return {
    matched: isMatch,
    professionalName: isMatch ? "Match found" : null,
    licenseType: isMatch ? "Licensed Real Estate Broker" : null,
    expirationDate: isMatch ? "2027-09-30" : null,
  };
}

/* ── Professional ID Cross-Reference ─────────────────────────── */

export interface CrossReferenceResult {
  valid: boolean;
  source: string;
  details: string | null;
}

/**
 * Cross-reference a professional ID (MLS, NMLS, ARDC, etc.)
 *
 * In production, these would hit various public APIs:
 * - NMLS Consumer Access API for mortgage lenders
 * - ARDC Attorney Registration for attorneys
 * - NAR NRDS for realtors
 * - NPN/NIPR for insurance agents
 */
export async function crossReferenceProfessionalId(
  idType: ProfessionalIdType,
  idValue: string
): Promise<CrossReferenceResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  /*
   * ── INTEGRATION POINT ──
   * Replace with real lookups per idType:
   *
   * switch (idType) {
   *   case 'nmls':
   *     return await nmlsClient.lookup(idValue);
   *   case 'ardc':
   *     return await ardcClient.lookup(idValue);
   *   // etc.
   * }
   */

  const sources: Record<ProfessionalIdType, string> = {
    mls: "MLS / MRED",
    nmls: "NMLS Consumer Access",
    ardc: "ARDC Attorney Registration",
    internachi: "InterNACHI Member Directory",
    ashi: "ASHI Inspector Search",
    npn: "NIPR Producer Database",
  };

  return {
    valid: idValue.length >= 4, // Mock: any ID ≥ 4 chars is "valid"
    source: sources[idType],
    details: idValue.length >= 4 ? `Verified via ${sources[idType]}` : null,
  };
}

/* ── Category → Professional ID Mapping ──────────────────────── */

export interface ProfessionalIdField {
  type: ProfessionalIdType;
  label: string;
  placeholder: string;
  description: string;
}

export function getProfessionalIdFieldForCategory(
  category: ProServiceCategory
): ProfessionalIdField | null {
  const map: Record<string, ProfessionalIdField> = {
    Realtor: {
      type: "mls",
      label: "MLS ID (MRED/NRDS)",
      placeholder: "e.g., 10234567",
      description: "Your local MLS agent ID or NAR NRDS number",
    },
    "Mortgage Lender": {
      type: "nmls",
      label: "NMLS ID",
      placeholder: "e.g., 123456",
      description: "Your NMLS unique identifier (federally required)",
    },
    Attorney: {
      type: "ardc",
      label: "Bar / ARDC Number",
      placeholder: "e.g., 6301234",
      description: "Your state bar registration number",
    },
    "Home Inspector": {
      type: "internachi",
      label: "InterNACHI or ASHI #",
      placeholder: "e.g., NACHI12345678",
      description: "Your association certification number (optional)",
    },
    "Insurance Agent": {
      type: "npn",
      label: "NPN (National Producer Number)",
      placeholder: "e.g., 12345678",
      description: "Your NAIC/NIPR national producer number",
    },
  };

  return map[category] ?? null;
}
