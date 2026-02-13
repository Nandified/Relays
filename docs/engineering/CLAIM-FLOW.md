# Claim Profile Flow — Engineering Spec

## Overview
Pre-populated IDFPR profiles can be "claimed" by the real professional. This converts an unclaimed listing into a full Relays pro account with editing capabilities and a verified badge.

## Consumer vs Pro Experience

### Consumer View (unclaimed profile)
- Looks like a normal pro profile (headshot, name, brokerage, category, rating)
- **No license number shown**
- **No professional IDs shown**
- Subtle "Are you [Name]? Claim this profile →" link
- Can view contact info, reviews, service area

### Pro View (after claiming)
- Full edit capabilities (bio, headshot, service areas, availability, etc.)
- License number displayed (opted in by claiming)
- Verified badge appears
- Professional ID shown (if provided)
- Indistinguishable from a native Relays signup

---

## Claim Flow Steps

### Step 1: Initiate
- Pro clicks "Claim this profile →" on their unclaimed profile
- Redirects to Sign Up / Log In (if not authenticated)
- After auth, redirects back to claim verification

### Step 2: Primary Verification — License Number
- Prompt: "Enter your IDFPR license number to verify your identity"
- Pro enters their license number
- **Server-side match:** entered number must match the IDFPR record for this profile
- ✅ Match → proceed to Step 3
- ❌ No match → "This license number doesn't match this profile. Please try again."
- Rationale: Only the real agent readily knows their license number. Public on IDFPR, but the friction of looking it up + completing all steps deters impersonation.

### Step 3: Secondary Verification — Professional ID (optional)
- Based on the professional's category, show the appropriate optional field:

| Category | Field Label | ID System | Notes |
|---|---|---|---|
| Realtor | MLS ID | MLS Agent ID / NRDS ID | Assigned by local MLS (e.g., MRED) or NAR nationally |
| Mortgage Lender | NMLS ID | NMLS Unique Identifier | Federally required, permanently assigned |
| Attorney | Bar / ARDC Number | State bar registration | 7-digit in IL (ARDC), varies by state |
| Home Inspector | InterNACHI or ASHI # | Association certification | Voluntary, not all inspectors have one |
| Insurance Agent | NPN | National Producer Number | Assigned by NAIC/NIPR, unique nationwide |

- All optional — secondary trust signal, not required
- Stored on profile, can be displayed after claiming
- Future: cross-reference against public databases when API access is available

### Step 4: Claim Complete
- Profile ownership transferred to authenticated user
- Verified badge granted immediately
- License number now visible on profile
- Professional ID visible (if provided)
- Pro can now edit: bio, headshot, service areas, availability, booking link, etc.
- Welcome modal: "Your profile is live! Complete your profile to attract more clients."

---

## Verification Logic Summary

```
Primary (required):   IDFPR License Number → exact match against record
Secondary (optional): Professional ID (MLS/NMLS/ARDC/ASHI/NPN) → stored, future cross-ref
Result:               Claimed + Verified badge
```

## Anti-Abuse Considerations
- One claim per profile (first-come-first-served)
- Rate limit claim attempts (3 tries per profile per session)
- If a claim is disputed, admin can revoke and re-open
- Future: email verification to address on file (if enrichment data has email)
- Future: SMS verification to phone on file

## Data Model Changes Needed
- `UnclaimedProfessional` → add `claimedByUserId`, `claimedAt`, `professionalId`, `professionalIdType`
- New table/collection: `claim_attempts` (audit log)
- Pro account linking: `users.linkedProfessionalId` → points to IDFPR record

## Dependencies
- Auth system (Supabase or Clerk) — not yet implemented
- Claim flow UI components
- Server-side claim verification API endpoint

## Status
- [ ] Auth integration
- [ ] Claim flow UI (multi-step modal or page)
- [ ] Server-side `/api/claim` endpoint
- [ ] Professional ID fields per category
- [ ] Post-claim profile editor
- [ ] Admin dispute resolution
